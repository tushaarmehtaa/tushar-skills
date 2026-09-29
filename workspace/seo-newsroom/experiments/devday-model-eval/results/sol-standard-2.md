# orbit-api v0.3.0

*Release notes for the planned release; deployment has not been verified.*

## Breaking change

- **`/v1/events`: replace `limit` with `page_size`.** The `limit` query parameter is no longer accepted, and requests using it return `400`. Update your requests from `/v1/events?limit=100` to `/v1/events?page_size=100` before upgrading.

## Added

- **Cursor-based pagination for `/v1/events`.** Use the `cursor` query parameter to page past 10,000 events without offset drift.
- **Automatic retries for failed webhook deliveries.** Failed deliveries are retried with exponential backoff: five retries after the initial attempt, for up to six delivery attempts. The delays total approximately 31 seconds, excluding request duration.

## Security

- **Expired refresh tokens are now rejected.** Previously, expired refresh tokens could be accepted indefinitely. Clients must stop relying on expired tokens to refresh authentication.

## Performance

- **Faster tenant lookups through in-process caching.** In the load harness, `/v1/events` p99 latency decreased from 420 ms to 250 ms. This benchmark is not a verified production latency result.

---

## Handoff summary

- **Range:** `v0.2.0..HEAD` on `main`, with captured HEAD `535af3cc8bbc23febc275c03a0c4f75b023ff226`.
- **Audience and channel:** External developers calling orbit-api; Markdown release notes.
- **Release status:** Prepared for v0.3.0; treated as unreleased. No release or deployment evidence was supplied.
- **Items:** 5.
- **Provenance:**
  - Breaking parameter rename → `62c31beb`, `src/events.js`. The commit message specifies the `400` response; request validation is not shown in the supplied diff.
  - Cursor pagination → `363f021e`, `src/events.js`.
  - Webhook retries → `b4ec88eb`, `src/webhooks.js`.
  - Expired refresh-token rejection → `281cf30a`, `src/auth.js`.
  - Tenant caching and load-harness latency → `535af3cc`, `src/tenants.js`.
- **Statistics:** No repository activity statistics used. Performance figures are the supplied load-harness p99 measurements.
- **Artifacts:** Markdown included directly above; no files or visual assets created.
- **Limitations:**
  - The webhook commit message says “up to five attempts,” but the supplied implementation allows **six total attempts: one initial attempt plus five retries**. The changelog follows the implementation.
  - Production behavior, deployment status, and benchmark methodology were not independently verified. No git commands or tests were executed; this draft uses only the captured evidence.
  - Contributor-note edits, formatting changes, and the internal logging-library update were omitted because the supplied evidence identifies no external API impact.