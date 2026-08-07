# PostHog implementation

Read this reference before changing PostHog browser/server setup, identity, page views, feature flags, or events. Check the installed `posthog-js`/`posthog-node` versions and current PostHog documentation before copying API options.

## Contents

- [Plan events and privacy](#plan-events-and-privacy)
- [Initialize](#initialize)
- [Identity](#identity)
- [Typed capture](#typed-capture)
- [Server capture](#server-capture)
- [Verification](#verification)

## Plan events and privacy

Define stable event names and required properties before installation. Avoid credentials, payment data, message/content bodies, raw prompts, unrestricted URLs/query strings, and unnecessary personal data. Email addresses are personal data; capture them only when justified by the product’s privacy/consent policy. Configure opt-out/consent, retention, replay masking, and region before production.

## Initialize

Use the framework pattern recommended for the installed version. In current Next.js versions, prefer PostHog’s current App Router guidance and do not add manual page-view capture until checking whether the selected defaults already capture navigation.

```typescript
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as Provider } from 'posthog-js/react';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    // Set capture_pageview explicitly only when the installed-version plan requires it.
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <Provider client={posthog}>{children}</Provider>;
}
```

The browser project token is designed for ingestion; do not confuse it with a personal API key. Keep personal keys and management API credentials server-only.

## Identity

Use the stable internal application user ID as `distinct_id`. Identify only after authoritative authentication, reset on logout, and test account switching and impersonation.

```typescript
posthog.identify(user.id, {
  // Include personal properties only when approved by the measurement/privacy plan.
  plan: user.plan,
});

posthog.reset();
```

Do not identify from untrusted query/body fields. Define how anonymous pre-login activity merges and how deletion/opt-out requests are handled.

## Typed capture

```typescript
type ProductEvent =
  | { event: 'project_created'; properties: { projectId: string } }
  | { event: 'generation_completed'; properties: { generationId: string; latencyMs: number } };

export function captureProductEvent(value: ProductEvent) {
  posthog.capture(value.event, value.properties);
}
```

Capture authoritative outcomes on the server when a browser event could be blocked, forged, or duplicated.

## Server capture

Create one reusable server client per runtime pattern, pass the stable user ID, and ensure queued events are flushed according to the host lifecycle. Do not force `flushAt: 1` without measuring latency/cost. Serverless and edge runtimes may require explicit shutdown/flush handling from current SDK documentation.

## Verification

- Confirm exactly one expected page-view event per navigation strategy.
- Confirm typed custom events and property shapes.
- Test anonymous-to-authenticated merge, logout reset, and account switching.
- Confirm development/test traffic is separated or disabled.
- Inspect a real event for accidental personal/sensitive properties.
- For server capture, confirm delivery before the runtime exits and verify duplicate-request behavior.
