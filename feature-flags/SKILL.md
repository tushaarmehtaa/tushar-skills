---
name: feature-flags
description: Wire PostHog feature flags into a Next.js app. Server-side evaluation in route handlers and server components, client-side with useFeatureFlagEnabled, local override for dev. Use when shipping behind a flag, rolling out to a percentage, or A/B testing.
category: ai
tags: [feature-flags, posthog, rollout, ab-testing, experiments]
author: tushaarmehtaa
---

Wire PostHog feature flags end-to-end — server-side evaluation, client-side hook, and local dev overrides. Reads the project first, extends the existing PostHog setup if present.

## Two things that silently break PostHog flags

1. **Evaluating flags client-side when you need server-side behavior.** `useFeatureFlagEnabled` runs in the browser after hydration. If you're using a flag to show/hide a page section, that section flashes on then disappears. For anything above the fold or that affects routing, evaluate the flag on the server.
2. **Missing `distinctId` in server-side calls.** PostHog's server SDK requires a distinct user identifier to evaluate flags. Using a placeholder like `"anonymous"` means every unauthenticated user gets the same flag variant — not a rollout, just a constant.

## Phase 1: Detect the Project

```bash
cat package.json | grep -E "posthog"
grep -r "posthog" src/ app/ --include="*.ts" --include="*.tsx" -l 2>/dev/null | head -5
```

- **`posthog-js` installed + provider found?** → PostHog client-side already set up. Add server-side SDK.
- **`posthog-node` already installed?** → extend it, don't reinstall.
- **Nothing?** → wire up PostHog from scratch (run `/add-analytics` first for the base setup, then return here).

## Phase 2: Install Server SDK

```bash
npm install posthog-node
```

Add to `.env.example` (already set if `/add-analytics` was run):
```
NEXT_PUBLIC_POSTHOG_KEY=
POSTHOG_API_KEY=   # same as POSTHOG_KEY — use for server-side calls
```

## Phase 3: Server-Side Flag Client

Create a singleton for server-side evaluation:

```typescript
// lib/posthog-server.ts
import { PostHog } from 'posthog-node';

let client: PostHog | null = null;

export function getPostHogServer(): PostHog {
  if (!client) {
    client = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: 'https://us.i.posthog.com',
      flushAt: 1,      // flush immediately in serverless
      flushInterval: 0,
    });
  }
  return client;
}

export async function isFeatureEnabled(
  flagKey: string,
  distinctId: string,
  groups?: Record<string, string>
): Promise<boolean> {
  const ph = getPostHogServer();
  const result = await ph.isFeatureEnabled(flagKey, distinctId, { groups });
  return result ?? false;
}

export async function getFeatureFlagVariant(
  flagKey: string,
  distinctId: string
): Promise<string | boolean | undefined> {
  const ph = getPostHogServer();
  return ph.getFeatureFlag(flagKey, distinctId);
}
```

## Phase 4: Server Component Usage

Evaluate flags in Server Components and route handlers — no client-side flicker:

```typescript
// app/dashboard/page.tsx (Server Component)
import { isFeatureEnabled } from '@/lib/posthog-server';
import { getAuthUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getAuthUser();

  const showNewDashboard = user
    ? await isFeatureEnabled('new-dashboard', user.id)
    : false;

  return showNewDashboard ? <NewDashboard /> : <OldDashboard />;
}
```

```typescript
// app/api/generate/route.ts (Route Handler)
import { isFeatureEnabled } from '@/lib/posthog-server';

export async function POST(req: Request) {
  const user = await getAuthUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const hasStreamingAccess = await isFeatureEnabled('streaming-responses', user.id);

  if (hasStreamingAccess) {
    return handleStreaming(req, user);
  }
  return handleNonStreaming(req, user);
}
```

## Phase 5: Client-Side Usage

For flags that change UI after user interaction (not on initial render):

```tsx
// components/feature-flagged-button.tsx
'use client';
import { useFeatureFlagEnabled } from 'posthog-js/react';

export function NewFeatureButton() {
  const isEnabled = useFeatureFlagEnabled('new-export-feature');

  // useFeatureFlagEnabled returns undefined while loading
  if (isEnabled === undefined) return null;
  if (!isEnabled) return null;

  return <button>Export (New)</button>;
}
```

**Never use the client hook for above-the-fold content.** The hook returns `undefined` on first render, which causes layout shift. Use the server-side approach for anything visible on page load.

## Phase 6: Local Dev Overrides

Add a dev-only flag override mechanism so you can test both variants locally without touching PostHog:

```typescript
// lib/posthog-server.ts (add to existing file)
export async function isFeatureEnabled(
  flagKey: string,
  distinctId: string,
  groups?: Record<string, string>
): Promise<boolean> {
  // Local override for development
  if (process.env.NODE_ENV === 'development') {
    const override = process.env[`FLAG_${flagKey.toUpperCase().replace(/-/g, '_')}`];
    if (override === 'true') return true;
    if (override === 'false') return false;
  }

  const ph = getPostHogServer();
  const result = await ph.isFeatureEnabled(flagKey, distinctId, { groups });
  return result ?? false;
}
```

In `.env.local`:
```
FLAG_NEW_DASHBOARD=true    # force-enable new-dashboard flag locally
FLAG_STREAMING_RESPONSES=false  # force-disable
```

## Phase 7: Creating Flags in PostHog

Tell the user exactly what to set up. In PostHog dashboard:

1. Feature Flags → New Feature Flag
2. Key: `new-dashboard` (matches what's in code)
3. Rollout: start at 0%, increment to 10%, 50%, 100%
4. Conditions: can target by user properties (plan = 'pro'), cohorts, or percentage

For A/B tests: use "Multiple Variants" instead of boolean. Then use `getFeatureFlagVariant()` and return `'control'` or `'test'`.

## Verify

```
[ ] posthog-node installed
[ ] POSTHOG_API_KEY in .env.example
[ ] Server-side evaluation uses real user ID as distinctId — not "anonymous"
[ ] Server Components use isFeatureEnabled() — not the client hook
[ ] Client hook used only for post-hydration interactions, not initial render
[ ] Local override via FLAG_* env vars works in development
[ ] Flags created in PostHog dashboard with matching key names
[ ] Test: set FLAG_[KEY]=false in .env.local — confirm feature is hidden
[ ] Test: set FLAG_[KEY]=true in .env.local — confirm feature is shown
[ ] PostHog flag set to 0% rollout first — expand after confirming it works
```

See [references/guide.md](references/guide.md) for multivariate (A/B) flag patterns, flag-based redirects in middleware, and experiment tracking with PostHog insights.
