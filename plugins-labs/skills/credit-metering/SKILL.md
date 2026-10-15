---
name: credit-metering
description: Implement or audit usage credits with atomic reservations, spending, grants, purchases, expiration, refunds, limits, UI state, and an immutable ledger. Use when an app meters consumable usage.
license: MIT
---

# Credit metering

Build credits as a financial state machine. Preserve existing denominations, billing semantics, and provider integrations.

## Workflow

1. Inspect backend/runtime, database/ORM, auth and tenant keys, current balance/ledger fields, payment provider, usage paths, retries, queues, and frontend state.
2. Infer existing costs, grants, and packs from code. Ask only for unresolved commercial policy: denomination, per-action or measured cost, free/recurring grants, expiration/rollover, refund/clawback behavior, and overspend/debt policy. Never default to a new payment provider when one exists.
3. Read [database schemas](references/database-schemas.md), then implement only the matching database variant. Do not treat PostgreSQL, MySQL/PlanetScale, Prisma providers, and MongoDB as interchangeable.
4. Use an append-only ledger with a unique idempotency key/external event ID. Update cached balance and ledger in one database transaction, or derive balance from the ledger when scale permits. Enforce positive input amounts and the chosen non-negative/debt rule in the database.
5. Implement explicit operations:
   - `grant` for signup, subscription, promotion, or admin credit;
   - `reserve` before costly/concurrent work;
   - `capture` after measured success;
   - `release` on cancellation/failure;
   - `refund` or `reverse` linked to the original transaction;
   - `expire`/`rollover` when credits have lifecycle rules.
6. Authenticate and authorize from server context. Never accept balance, price, pack value, or user identity from the browser. Map a server-owned product/price ID to the credit amount.
7. Read [payment providers](references/payment-providers.md) only for the detected provider. Verify raw-body signatures, durably deduplicate events, and retry transient failures. Acknowledge before processing only after a durable queue/inbox write.
8. Make promotions atomic. Use a redemption table with a unique `(promo_id, user_id)` constraint when one redemption per user is intended; update global usage and grant credit in the same transaction.
9. Treat the UI balance as a projection. Reconcile after responses, account switches, multi-tab updates, refunds, and webhook grants. Optimistic display must not authorize work.

## Verification

Test signup/recurring grant, reserve-capture, reserve-release, insufficient balance, variable final cost, duplicate request, concurrent spend, payment replay, out-of-order event, refund/clawback, promo race, account switching, and reconciliation after network failure. Assert ledger/balance invariants and run database concurrency tests plus repository lint/type/test/build commands.

## Output

Report the denomination and policies, schema/migrations, ledger operations and invariants, protected usage paths, provider/product mapping, UI reconciliation, verification evidence, and remaining dashboard or production setup.
