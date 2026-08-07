---
name: auth-implementation
description: Implement authentication, authorization, tenant isolation, sessions, and protected routes. Use when adding sign-in, identity sync, provider integration, account linking, roles, or access control.
license: MIT
---

# Authentication implementation

Implement identity and authorization end to end. Prefer the existing provider. Do not introduce or replace an identity system without an explicit user decision.

## Workflow

1. Detect framework/router version, auth package and version, database/ORM, session transport, user/account tables, tenant model, middleware or proxy, protected resources, and existing migrations.
2. Distinguish authentication from authorization. Write an access matrix for public, signed-in, owner, team member, admin, and service/background paths that actually exist.
3. Decide whether a local user mirror is necessary. If it is, model provider identities separately from application users when multiple login methods or providers are possible. Never link accounts from an unverified client-supplied email.
4. Ask only when a material choice remains: provider selection, account-linking policy, deletion behavior, organization/tenant model, or whether existing users must be backfilled.
5. Use the matching provider reference only after detecting the exact stack and installed version:
   - [Clerk](references/clerk.md) for current Next.js Clerk protection and verified user synchronization.
   - [Auth.js](references/nextauth.md) for current Auth.js/NextAuth handlers, adapters, sessions, and route protection.
   - [Supabase Auth](references/supabase-auth.md) for public-profile synchronization and Supabase session handling.
   - For Firebase, Auth0, custom JWT, or a provider/database combination not covered, preserve existing code and consult current primary provider documentation instead of adapting an incompatible example.
6. Enforce access next to every protected read/mutation. Middleware/proxy may provide broad routing, but it is not the sole authorization boundary.
7. For Supabase Data API access, implement RLS and grants with the actual token strategy. Add both `using` and `with check` where ownership may change. Service credentials stay server-only; do not create redundant service-role policies when the credential already bypasses RLS.
8. Make sync idempotent and verifiable. Prefer signed provider webhooks for lifecycle sync, or fetch authoritative provider data on the server for just-in-time sync. Handle create, update, deletion, replay, out-of-order delivery, and backfill.

## Verification

Test new sign-up, returning login, logout, expiry/refresh, account switching, verified linking, provider update/deletion, and replayed sync. For every protected resource, run negative tests as unauthenticated, another user, another tenant, and a non-admin; test permitted owner/admin/service cases separately. Run migrations and the repository’s lint/type/test/build commands in the target runtime.

## Output

Report provider/version and identity model, files/migrations changed, access matrix and enforcement points, sync strategy, RLS/grants, environment-variable names, automated verification evidence, and manual dashboard/backfill/production checks.
