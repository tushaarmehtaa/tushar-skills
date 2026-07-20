---
name: add-analytics
description: Set up PostHog analytics, Sentry error tracking, and health endpoints for web apps. Use when adding or auditing product analytics, monitoring, or uptime checks.
license: MIT
---

Add event tracking, error monitoring, and a status endpoint to the detected web stack.

## Phase 1: Detect the Stack

Read the project and figure out what to install.

### 1.1 Framework
- `next.config.*` → Next.js (check App Router vs Pages Router)
- `vite.config.*` → Vite / React SPA
- `astro.config.*` → Astro
- `nuxt.config.*` → Nuxt
- Python backend (`main.py`, `app.py`, `manage.py`) → FastAPI / Django / Flask

### 1.2 Existing Analytics
Check if any analytics/monitoring is already installed:
- `posthog-js` or `posthog-node` → PostHog already present
- `@sentry/nextjs` or `@sentry/react` or `sentry-sdk` → Sentry already present
- `@vercel/analytics` → Vercel Analytics present
- `@google-analytics` or `gtag` → GA present

If already installed, audit the setup instead of installing fresh. Check for gaps (missing error boundaries, no server-side tracking, no health endpoint).

### 1.3 Ask the User
```
Detected: [framework]
Existing analytics: [what's already there, or "none"]

I'll set up:
1. PostHog — event tracking, user identification, feature flags
2. Sentry — error tracking with source maps
3. Health endpoint — /api/status for uptime monitoring

Need your project keys:
- PostHog API key (get from app.posthog.com → Project Settings)
- Sentry DSN (get from sentry.io → Project Settings → Client Keys)

Or I can set up the code and you add the keys later.
```

## Phase 2: Implement Observability

Load only the implementation references needed for this project:

- **PostHog analytics:** Read [references/posthog.md](references/posthog.md) before adding client or server tracking, page views, identification, or typed events.
- **Sentry error tracking:** Read [references/sentry.md](references/sentry.md) before configuring Sentry, error boundaries, or structured logging.
- **Health endpoint:** Read [references/health-endpoint.md](references/health-endpoint.md) before adding a Next.js or FastAPI status route and uptime monitoring.

Preserve existing integrations. If a system is already present, use its reference to audit gaps instead of installing it again. Match every example to the detected framework and authentication model.

## Phase 3: Environment Variables

Add to `.env.local` (or `.env`):

```
# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_API_KEY=phc_...  # Same key, used server-side

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o123.ingest.sentry.io/456
SENTRY_AUTH_TOKEN=sntrys_...  # For source map uploads
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

Verify none of these are committed to git. Check `.gitignore` includes `.env*`.

## Phase 4: Verify

After wiring everything, test each system:

```
PostHog:
[ ] Open the app → check PostHog dashboard for a pageview event
[ ] Navigate between pages → each page triggers a pageview
[ ] Log in → user appears in PostHog with email/name (identified)
[ ] Track a custom event → appears in PostHog events
[ ] Log out → posthog.reset() called, new anonymous session

Sentry:
[ ] Add a temporary `throw new Error('sentry test')` to a page
[ ] Load the page → error appears in Sentry dashboard
[ ] Check that source maps resolve (you see your actual code, not minified)
[ ] Remove the test error
[ ] Error boundary renders fallback UI (not a white screen)

Health Endpoint:
[ ] GET /api/status returns 200 with uptime and database status
[ ] If database is down, returns 503
[ ] Set up monitoring service to ping it every 5 minutes
```

Tell the user which systems are live and working.

## Important Notes

- **PostHog free tier:** up to 1M events/month. Confirm the current plan limits before relying on them.
- **Sentry free tier:** up to 5K errors/month. Confirm the current plan limits before relying on them.
- **Don't track PII** in PostHog events (no passwords, no credit card numbers). User IDs and emails are fine.
- **Sample rates matter.** 10% tracing in prod keeps costs near zero. Increase only if debugging specific issues.
- **Source maps** are critical for Sentry. Without them, error stack traces show minified code. The Sentry wizard handles this for Next.js. For other frameworks, upload maps during build.
