# Auth.js / NextAuth implementation

Read this reference only after detecting the installed Auth.js/NextAuth major version and router. The examples below follow current Auth.js v5-style Next.js setup; preserve a working v4 integration unless migration is requested.

## Contents

- [Configuration and handlers](#configuration-and-handlers)
- [Session and authorization](#session-and-authorization)
- [Adapters and account linking](#adapters-and-account-linking)
- [Environment](#environment)
- [Verification](#verification)

## Configuration and handlers

Keep configuration in `auth.ts`, then export route handlers separately.

```typescript
// auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  // Add an adapter/session strategy only after inspecting the existing schema.
});
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

Do not place the `NextAuth()` destructuring in `route.ts` and omit `GET`/`POST`; the route would not expose handlers.

## Session and authorization

Use `auth()` on the server and enforce resource/tenant authorization next to access.

```typescript
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await requireProjectAccess(session.user.id);
}
```

Add TypeScript module augmentation when placing database IDs/roles on the session. Do not trust client session fields as the only authorization boundary. For Next.js 16+, follow current `proxy.ts` naming; preserve `middleware.ts` on older versions.

## Adapters and account linking

Inspect the adapter’s required schema and existing migrations before adding it. Provider account records, verification tokens, sessions, and users have distinct lifecycle rules. Do not assume an adapter makes all account linking safe:

- allow automatic linking only under provider/documented guarantees;
- require verified email and explicit reauthentication when linking identities;
- preserve unique provider-account constraints;
- handle deleted/revoked accounts and database cleanup deliberately.

Callbacks must not assume a database user exists at a lifecycle point unless the installed adapter/version guarantees it. Test first-login and repeated-login behavior.

## Environment

Current Auth.js commonly uses `AUTH_SECRET` and provider-specific `AUTH_*` variables; older NextAuth versions may use `NEXTAUTH_SECRET`/`NEXTAUTH_URL`. Detect the installed version and existing convention instead of adding both sets blindly.

Keep OAuth client secrets and auth secrets server-only. Add names, not values, to `.env.example`.

## Verification

- Test provider callback/handler routes and CSRF/state behavior.
- Test new/returning login, logout, expiry/refresh, denied account, and account linking.
- Test database/session strategies if both are supported.
- Test anonymous, other-user, other-tenant, and non-admin access to protected resources.
- Run schema migrations plus lint/type/test/build.
