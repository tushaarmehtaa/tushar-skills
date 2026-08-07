# Clerk implementation

Read this reference only after detecting Clerk and its installed major version. The patterns target current Next.js App Router; use `proxy.ts` for Next.js 16+ and `middleware.ts` for Next.js 15 and earlier.

## Contents

- [Protect resources](#protect-resources)
- [Synchronize users](#synchronize-users)
- [Clerk with Supabase](#clerk-with-supabase)
- [Environment](#environment)
- [Verification](#verification)

## Protect resources

Use `clerkMiddleware()`/proxy for Clerk request integration, but authorize next to data access. Current Clerk guidance deprecates using `createRouteMatcher()` as the primary protection boundary.

```typescript
// proxy.ts on Next.js 16+, middleware.ts on <=15
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  await requireResourceAccess({ userId, orgId, permission: 'project:read' });
  // Read the authorized resource.
}
```

Use provider roles/permissions only where they match the product’s authorization model. Always include tenant/resource ownership checks.

## Synchronize users

Avoid a local mirror if session claims/provider lookup are sufficient. When a mirror is required, prefer signed Clerk lifecycle webhooks for `user.created`, `user.updated`, and `user.deleted`.

```typescript
import { verifyWebhook } from '@clerk/backend/webhooks';

export async function POST(request: Request) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  await processClerkEventIdempotently(event);
  return new Response('OK');
}
```

Use the provider event ID as a unique idempotency key and upsert by Clerk user ID. Verify selected primary-email status from the signed/provider payload. Do not accept name/email/avatar from an authenticated browser and treat it as authoritative. Do not merge a local user by email unless the product has an explicit, verified account-linking flow that proves control of both identities.

Handle deletion/soft-deletion policy and backfill existing users. Return non-2xx for transient synchronous processing failures so Clerk can retry, or acknowledge only after a durable inbox/queue write.

## Clerk with Supabase

Use the current native Clerk–Supabase third-party auth integration rather than the deprecated Supabase JWT template. Configure Clerk in Supabase’s third-party auth settings, then pass the Clerk session token through the Supabase client’s `accessToken` callback. RLS can read the Clerk subject with `auth.jwt() ->> 'sub'`.

```typescript
const supabase = createClient(url, publishableKey, {
  async accessToken() {
    return (await auth()).getToken();
  },
});
```

This token-scoped client respects RLS. Use a separate service client only for explicitly authorized administration.

## Environment

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use names required by installed SDK versions. Keep secret and webhook keys server-only.

## Verification

- Test signed, invalid, duplicate, out-of-order, update, and deletion webhooks.
- Test account switching and organization/tenant changes.
- Test every protected resource as anonymous, another user, another tenant, and allowed owner/admin.
- For Supabase, confirm two Clerk users cannot read or mutate each other’s rows through the Data API.
