---
name: analytics
description: Plan, implement, or audit analytics, error monitoring, health checks, dashboards, and reporting. Use when designing events, consent-aware tracking, incident visibility, or observability.
license: MIT
---

# Analytics

Build the smallest measurement system that answers explicit product or operational questions. Preserve existing providers and schemas unless a migration is part of the request.

## Workflow

1. Inspect the framework, router/runtime, deployment target, auth model, existing analytics and monitoring packages, environment-variable examples, privacy controls, and current event calls.
2. Define the decisions the data must support: acquisition, activation, retention, adoption, revenue, reliability, or incident response. For every metric, record its unit, eligible population and exclusions, numerator/event, denominator, cohort anchor where relevant, observation window, maturity/censoring rule, timezone, owner, and decision threshold. Record event names, required properties, identity rules, retention needs, and sensitive fields to exclude.
3. Separate four concerns before choosing tools:
   - traffic analytics;
   - product analytics and experimentation;
   - errors, traces, and logs;
   - liveness, readiness, and business reporting.
4. Reuse an installed provider. If none exists, recommend the minimum stack and explain the tradeoff. Ask only for unresolved choices that materially affect implementation, such as consent requirements, data residency, provider preference, or whether a database dependency belongs in readiness checks. Never ask the user to paste secrets into chat; scaffold names in `.env.example` and let the user set values in the deployment environment.
5. Create or update a measurement plan before adding calls. Use stable event names, typed properties, server-side capture for authoritative outcomes, and a documented anonymous-to-authenticated identity transition.
6. Implement only the selected paths:
   - Read [PostHog](references/posthog.md) before changing PostHog browser/server setup, identity, page views, or events.
   - Read [Sentry](references/sentry.md) before changing Sentry initialization, boundaries, logging, replay, tracing, or source maps.
   - Read [health endpoints](references/health-endpoint.md) before adding liveness/readiness routes or uptime monitoring.
7. When an internal dashboard is requested, implement it as an authenticated product surface, not a public health endpoint. Use server-owned aggregate queries; define freshness and caching; reconcile each tile to its metric contract; enforce role/tenant access; suppress or coarsen small sensitive groups; and cover loading, empty, stale, partial, and error states. Keep operational status separate from product metrics even when they share a page.
8. Apply privacy controls before capture: minimize properties, exclude credentials/payment data/content by default, avoid URLs or query strings that contain personal data, honor applicable consent/opt-out rules, and review replay masking and log scrubbing.
9. Preserve secrets and deployment boundaries. Public ingestion tokens may be exposed only when the provider defines them as public; source-map tokens, service-role keys, and personal API keys stay server-side and out of logs and git.

## Verification

Verify only systems actually implemented:

- Trigger a known page view and typed product event; confirm exact names/properties in the provider.
- Test anonymous activity, sign-in identification, account switching, and logout reset without merging the wrong people.
- Trigger a controlled client and server error; record event IDs, verify redaction, environment/release tags, and resolved source maps, then remove the test path.
- Test liveness independently from dependencies. Test readiness with a forced dependency failure, a short timeout, and the expected non-2xx response.
- For dashboards, test authorization and tenant boundaries, reconcile aggregate queries to source fixtures, verify timezone/window/maturity behavior, and render loading, empty, stale, partial, error, and populated states.
- Run the project’s lint/type/test/build commands and test in the target runtime when serverless or edge behavior matters.
- Record anything that requires dashboard access or production credentials as manual setup, not as verified.

## Output

Report:

- questions the system now answers and the event/monitoring plan;
- metric contracts for activation, retention, or other implemented measures;
- providers reused, added, or deliberately omitted;
- files and environment-variable names changed;
- dashboard routes/components, aggregate queries, access policy, freshness, and rendered states when applicable;
- privacy, consent, identity, sampling, and retention decisions;
- verification performed with event IDs or observed responses;
- dashboard, DNS, token, alerting, and production checks still required.
