# orbit-api v0.3.0

*Release candidate notes — deployment has not been verified.*

## Breaking change

- **Rename the `/v1/events` page-size parameter.** Replace `?limit=` with `?page_size=` in all requests. Requests using `?limit=` now return **400**.

## Added

- **Cursor-based pagination for `/v1/events`.** Use the `cursor` query parameter with `page_size` to page beyond 10,000 events without offset drift.
- **Automatic retries for failed webhook deliveries.** Failed deliveries use exponential backoff, with up to five retries after the initial attempt—six attempts total. The backoff waits total approximately 31 seconds, excluding request execution time.

## Security

- **Expired refresh tokens are now rejected.** Previously, expired refresh tokens could be accepted indefinitely. Clients must stop relying on expired tokens and obtain valid credentials when refresh fails.

## Performance

- **Faster tenant lookups through in-process caching.** In the load harness, `/v1/events` p99 latency decreased from 420 ms to 250 ms. These are benchmark results, not verified production measurements.

---

## Handoff summary

- **Range:** `v0.2.0..HEAD` on `main`; captured HEAD is `535af3cc8bbc23febc275c03a0c4f75b023ff226`.
- **Audience and channel:** External API developers; Markdown release notes.
- **Release status:** Prepared for v0.3.0. No release-tag or deployment evidence was supplied; these changes are not described as live.
- **Items:** 5.
- **Provenance:**
  - Parameter rename: `62c31beb` — `src/events.js`; the commit message documents the 400 response.
  - Cursor pagination: `363f021e` — `src/events.js`.
  - Webhook retries: `b4ec88eb` — `src/webhooks.js`.
  - Refresh-token expiry enforcement: `281cf30a` — `src/auth.js`.
  - Tenant caching and latency benchmark: `535af3cc` — `src/tenants.js`; benchmark figures come from the commit message.
- **Statistics:** No repository-change statistics used. Latency figures are load-harness p99 measurements.
- **Artifacts:** Markdown directly in this reply; no files or visual assets created.
- **Limitations and review notes:**
  - The webhook commit message says “up to five attempts,” but the supplied implementation allows **one initial attempt plus five retries**. The changelog follows the implementation; resolve this discrepancy before publishing if five total attempts were intended.
  - The supplied diff does not show the validation that returns 400 for `limit`; that behavior is supported by the breaking-change commit message.
  - Findings are based solely on the captured evidence. No commands, tests, or deployment checks were executed.
  - Contributor-note edits, formatting, and the internal logging-library update were omitted because the supplied evidence establishes no external API impact.