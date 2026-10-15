# Sentry implementation

Read this reference before changing Sentry initialization, source maps, boundaries, structured errors, replay, or tracing. Use the installed SDK’s current wizard/manual setup and review every generated file.

## Contents

- [Install and configure](#install-and-configure)
- [Privacy and sampling](#privacy-and-sampling)
- [Boundaries and logging](#boundaries-and-logging)
- [Source maps](#source-maps)
- [Verification](#verification)

## Install and configure

For Next.js, the current Sentry wizard may generate instrumentation files, client initialization, `global-error`, and `withSentryConfig`. Run it only when dependency installation and generated changes are in scope, then inspect the diff and adapt it to the detected Next.js/Sentry versions.

Keep DSNs where the SDK expects them. Keep source-map auth tokens and organization/project management credentials server-side and out of the application bundle.

## Privacy and sampling

Choose trace/replay sampling from traffic, incident needs, and budget rather than hard-coding 10%. Before enabling replay or request data capture:

- mask text and block sensitive media/DOM regions;
- scrub authorization, cookies, tokens, payment fields, prompts, and message bodies;
- set user identity only when allowed by policy;
- honor consent and regional requirements;
- tag environment and release consistently.

Error-triggered replay can still collect personal data; it is not automatically safe because normal session replay sampling is zero.

## Boundaries and logging

Use framework error files/boundaries for user recovery and capture unexpected exceptions once. Avoid duplicate capture in nested boundaries. Preserve a safe user-facing message and a retry/reset path.

```typescript
import * as Sentry from '@sentry/nextjs';

export function captureAppError(
  error: unknown,
  context: { action?: string; requestId?: string; metadata?: Record<string, unknown> } = {},
) {
  const normalized = error instanceof Error ? error : new Error(String(error));
  Sentry.withScope((scope) => {
    if (context.action) scope.setTag('action', context.action);
    if (context.requestId) scope.setTag('request_id', context.requestId);
    if (context.metadata) scope.setExtras(context.metadata);
    Sentry.captureException(normalized);
  });
}
```

Metadata must be allow-listed and scrubbed. Do not attach entire request bodies or user objects.

## Source maps

Upload source maps during the production build using the provider’s supported integration. Do not expose source-map tokens at runtime. Verify with a real event/release, because a successful build alone does not prove frames resolve.

## Verification

- Trigger controlled client and server errors and record their event IDs.
- Confirm each error is captured once with correct environment/release tags.
- Inspect payloads/replay for redaction and masking.
- Confirm the boundary recovery/reset path works.
- Verify source frames resolve to authored code, then remove the test path.
- Exercise tracing only at the configured sampling behavior and confirm cost-sensitive data is not attached.
