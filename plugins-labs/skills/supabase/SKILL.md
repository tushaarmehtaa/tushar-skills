---
name: supabase
description: Set up, extend, or audit Supabase schema, grants, RLS, migrations, typed clients, storage, and external auth. Use when integrating Supabase or repairing data access and tenant isolation.
license: MIT
---

# Supabase

Build a migration-backed, typed Supabase integration with explicit authorization boundaries.

## Workflow

1. Inspect `supabase/`, migrations, generated types, installed Supabase packages/versions, framework/runtime, environment-variable names without printing values, auth/session flow, schemas exposed through the Data API, and existing grants/RLS.
2. Infer table ownership and tenant relationships from the domain model. Ask only when ownership, collaboration, deletion, retention, or external-auth behavior is ambiguous. Do not add `user_id` or four CRUD policies to every table mechanically.
3. Design keys, foreign keys, constraints, indexes, timestamps, lifecycle/deletion behavior, and server-generated ownership defaults appropriate to each table. Use external provider subject IDs as text unless a local identity mapping is intentionally modeled.
4. Create named migrations. Use `supabase migration new` or a reviewed `db diff` for local changes, verify with a local reset/test database, inspect `db push --dry-run`, and use `db push` only when remote deployment is explicitly in scope. `migration up` is not a substitute for remote deployment.
5. Secure every exposed object with both Postgres grants and RLS. Scope policies to roles, use indexed predicates, add `with check` for inserts/updates, review views/functions separately, and set a safe `search_path` on `security definer` functions.
6. Match auth strategy:
   - Supabase Auth: use `auth.uid()`/`auth.jwt()` and current SSR session guidance.
   - Clerk or another supported third-party provider: configure the native integration, pass the provider token through the client, and use the actual JWT `sub`/claims. Do not assume an RLS expression alone configures token verification.
   - Server administration: use a dedicated server-only client with explicit authorization; never expose secret/service credentials.
7. For current `@supabase/ssr`, create a client per request, use the supported cookie `getAll`/`setAll` adapter, await async framework cookie APIs, and add the required proxy/middleware refresh flow. Do not use legacy single-cookie adapters.
8. Generate TypeScript types after applying migrations to the target used for generation, then run type checks and update typed queries. Avoid `any` and handle `{ data, error }` explicitly.

## Verification

Run local migration reset/apply, schema/type drift checks, and repository lint/type/test/build. For each policy, test allowed owner/member/admin/service access and denied anonymous/other-user/other-tenant reads and mutations, including attempts to change ownership. Test session refresh/expiry and external-provider tokens in the target runtime.

## Output

Report tables/functions/storage changed, migration files, grants and RLS policies with auth strategy, client/session changes, type-generation command/result, negative authorization tests, and remaining linked-project/dashboard/production steps.
