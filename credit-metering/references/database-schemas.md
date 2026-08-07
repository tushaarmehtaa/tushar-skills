# Credit database variants

Read this reference after detecting the database. Implement one compatible variant and keep all balance/ledger mutations transactional.

## Contents

- [Shared invariants](#shared-invariants)
- [PostgreSQL and Supabase](#postgresql-and-supabase)
- [Prisma](#prisma)
- [MySQL and PlanetScale](#mysql-and-planetscale)
- [MongoDB](#mongodb)
- [Verification](#verification)

## Shared invariants

- Amounts are positive integers at the operation boundary; ledger deltas carry the sign.
- Every logical operation has a unique idempotency key.
- Ledger rows are append-only and link reversals/refunds to the original operation.
- Balance and ledger update in one transaction, or balance is derived from the ledger.
- Reservation status supports pending/captured/released where concurrent or variable-cost work exists.
- Database constraints enforce the chosen no-debt/debt policy.

## PostgreSQL and Supabase

```sql
alter table public.users
  add column if not exists credit_balance bigint not null default 0,
  add constraint users_credit_balance_nonnegative check (credit_balance >= 0);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  idempotency_key text not null unique,
  kind text not null check (kind in (
    'grant', 'reserve', 'capture', 'release', 'refund', 'reverse', 'expire', 'rollover'
  )),
  amount bigint not null check (amount <> 0),
  balance_after bigint not null,
  original_transaction_id uuid references public.credit_transactions(id),
  external_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index credit_transactions_user_created_idx
  on public.credit_transactions (user_id, created_at desc);
create unique index credit_transactions_external_reference_idx
  on public.credit_transactions (external_reference)
  where external_reference is not null;
```

Implement a database function or application transaction that locks/conditionally updates the balance and inserts the ledger row atomically. For spend/reserve, use a conditional update such as `... where credit_balance >= amount` and confirm one affected row inside the transaction.

Apply RLS/grants based on the real auth model. Users may read their own history; only trusted server paths should mutate financial rows.

## Prisma

Model the same fields and unique constraints in the provider-compatible Prisma schema. Use an interactive transaction for conditional balance update plus ledger insert. Raw conditional SQL may be necessary for strict atomic spend; do not implement read-then-write in separate calls. JSON defaults and UUID generation differ by database provider, so avoid copying PostgreSQL annotations into MySQL.

## MySQL and PlanetScale

Use MySQL-compatible types (`char(36)`/binary UUID choice, `json`, `datetime`) and migrations supported by the project. `gen_random_uuid()`, `jsonb`, partial indexes, and `ADD COLUMN IF NOT EXISTS` are PostgreSQL-specific. Verify foreign-key support/configuration on the actual PlanetScale project. Preserve idempotency with unique indexes and use a transaction or single conditional update supported by the database.

## MongoDB

Store balance on the user/account document and ledger in a separate collection with unique indexes on `idempotencyKey` and optional `externalReference`. Use a replica-set transaction for balance+ledger atomicity, or a rigorously designed single-document ledger/balance model. A transaction schema alone is insufficient.

## Verification

- Concurrent spends cannot cross the permitted balance boundary.
- Replaying an idempotency key returns the original result without another delta.
- Ledger and cached balances reconcile after grants, capture/release, and refund.
- Mutation attempts from ordinary client credentials are denied.
- Migration applies from a clean database and upgrades an existing fixture safely.
