# PostHog Implementation

Read this reference when the project needs PostHog installation, browser or server tracking, page views, user identification, or typed custom events.

## Contents

- [Install](#21-install)
- [Client-side provider](#22-client-side-provider)
- [Page-view tracking](#23-page-view-tracking-nextjs-spa)
- [User identification](#24-user-identification)
- [Custom events](#25-custom-event-tracking)
- [Server-side tracking](#26-server-side-tracking-nextjs)

### 2.1 Install

**Next.js:**
```bash
npm install posthog-js posthog-node
```

**React SPA (Vite):**
```bash
npm install posthog-js
```

**Python:**
```bash
pip install posthog
```

### 2.2 Client-Side Provider

**Next.js App Router** — create `app/providers.tsx`:

```typescript
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We handle this manually for SPA navigation
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        // Disable in dev unless you want to test
        // posthog.opt_out_capturing();
      }
    },
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}
```

Wrap the app in `layout.tsx`:
```typescript
import { PostHogProvider } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
```

**React SPA (Vite)** — create `lib/analytics.ts`:

```typescript
import posthog from 'posthog-js';

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;

  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
  });

  initialized = true;
}

export { posthog };
```

Call `initAnalytics()` in your app entry point.

### 2.3 Page View Tracking (Next.js SPA)

PostHog doesn't auto-track SPA navigation. Add a component that fires on route changes:

```typescript
// components/PostHogPageView.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect, Suspense } from 'react';

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) url += '?' + search;
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

export function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
```

Add to layout:
```typescript
<PostHogProvider>
  <PostHogPageView />
  {children}
</PostHogProvider>
```

### 2.4 User Identification

When a user logs in, identify them in PostHog so events are linked to a person:

```typescript
import posthog from 'posthog-js';

// Call this after successful auth sync
function identifyUser(user: { id: string; email?: string; name?: string }) {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
  });
}

// Call this on logout
function resetUser() {
  posthog.reset();
}
```

Wire this into your auth hook or auth sync callback.

### 2.5 Custom Event Tracking

Create a thin wrapper for type safety and consistency:

```typescript
// lib/track.ts
import posthog from 'posthog-js';

type TrackEvent =
  | { event: 'signed_up'; properties?: { method: string } }
  | { event: 'created_project'; properties: { projectId: string } }
  | { event: 'upgraded_plan'; properties: { plan: string; price: number } }
  | { event: 'used_feature'; properties: { feature: string } };

export function track({ event, properties }: TrackEvent) {
  posthog.capture(event, properties);
}
```

Usage:
```typescript
track({ event: 'created_project', properties: { projectId: '123' } });
```

The union type ensures you can't track events with wrong properties. Add your events to the union as your product grows.

### 2.6 Server-Side Tracking (Next.js)

For events that happen on the server (API routes, webhooks):

```typescript
// lib/posthog-server.ts
import { PostHog } from 'posthog-node';

let client: PostHog | null = null;

export function getPostHogServer() {
  if (!client && process.env.POSTHOG_API_KEY) {
    client = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return client;
}
```

Usage in API routes:
```typescript
const posthog = getPostHogServer();
posthog?.capture({
  distinctId: userId,
  event: 'api_call',
  properties: { endpoint: '/api/generate', status: 200 },
});
```
