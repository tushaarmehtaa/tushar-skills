---
name: rate-limit
description: Implement or audit Upstash Redis rate limits with trusted user, tenant, API-key, or IP identifiers, 429 headers, and outage behavior. Use when protecting Next.js routes from abuse or cost.
license: MIT
---

# Rate limiting with Upstash

Rate limits are one layer of abuse and cost control. Design policy before wiring middleware.

## Workflow

1. Detect Next.js/runtime/version, deployed proxy/CDN, auth/API-key model, installed Upstash versions, protected routes, operation cost, existing quotas, and whether middleware/proxy already touches the request.
2. Define a policy table per route class: identifier, algorithm/window/burst, cost weight, user tier, response behavior, and store-outage behavior. Ask only when the threat/cost tradeoff cannot be inferred.
3. Prefer authenticated user, API key, or tenant+user identifiers. Use IP only for anonymous traffic and only from a deployment-provided trusted source. Never trust arbitrary `x-forwarded-for` from the public internet; configure trusted proxy depth/platform headers. Do not collapse unknown clients to `127.0.0.1`.
4. Namespace by environment and route/policy. Do not apply blanket middleware and a per-route limiter to the same request unless deliberate layered limits use different keys.
5. Configure explicit Upstash timeout and logging/metrics. Choose outage behavior by endpoint:
   - low-risk availability paths may fail open with degraded telemetry;
   - authentication, high-cost generation, or abuse-sensitive paths may use a local emergency limit, queue, credit reservation, or fail closed with a clear temporary response.
6. Return `429` with a non-negative `Retry-After` and consistent rate-limit headers. Add headers to successful responses where useful. Do not emit misleading zero limits during fail-open degradation.
7. For weighted work, consume tokens based on server-calculated batch/operation cost. Combine rate limits with body-size limits, concurrency controls, idempotency, budgets/credits, and provider quotas where relevant.
8. Preserve async work such as analytics synchronization using the runtime’s `waitUntil` mechanism when the SDK exposes a pending promise.

## Verification

Use deterministic tests with an isolated key prefix and controllable clock/window where possible. Test allowed/blocked/reset behavior, route isolation, authenticated and anonymous keys, spoofed forwarding headers, paid/free policies, concurrency, weighted requests, store timeout/outage behavior, and duplicate middleware avoidance. Run repository lint/type/test/build and inspect Upstash analytics only when enabled.

## Output

Report the policy table, identifier trust model, files/env names changed, outage behavior, response headers, layered controls, automated test evidence, and remaining Upstash/deployment configuration.
