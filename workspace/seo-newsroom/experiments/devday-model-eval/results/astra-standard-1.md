# orbit-api v0.3.0

*Release notes for the upcoming release; deployment has not been verified.*

## Breaking changes

- **Rename the `/v1/events` page-size parameter from `limit` to `page_size`.** Update callers from, for example, `/v1/events?limit=100` to `/v1/events?page_size=100`. The `limit` parameter is no longer supported.

## Security fixes

- **Reject expired refresh tokens.** Previously, expired refresh tokens could be accepted indefinitely. Clients must handle refresh failures and obtain valid credentials rather than continue using an expired refresh token.

## Improvements

- **Cursor-based pagination for `/v1/events`.** Clients can use the `cursor` query parameter to page beyond 10,000 events without offset drift.
- **Automatic retries for failed webhook deliveries.** Failed deliveries are retried with exponential backoff: up to five retries after the initial attempt, for six attempts total. Retry delays total approximately 31 seconds, excluding request duration.
- **Faster tenant lookups through in-process caching.** The commit reports that `/v1/events` p99 latency fell from 420 ms to 250 ms in the load harness. This is a benchmark result, not a production latency guarantee.

---

## Handoff summary

- **Range:** `v0.2.0..HEAD` on `main`; captured HEAD is `535af3cc8bbc23febc275c03a0c4f75b023ff226`.
- **Audience and channel:** External API developers; Markdown release notes delivered in this reply.
- **Release status:** Unreleased/pre-release copy for v0.3.0. No release or deployment evidence was supplied.
- **Items:** 5.
- **Provenance:**

  | Item | Evidence |
  |---|---|
  | `limit` → `page_size` migration | `62c31be`; `src/events.js` |
  | Expired refresh-token rejection | `281cf30`; `src/auth.js` |
  | Cursor pagination | `363f021`; `src/events.js` |
  | Webhook retries | `b4ec88e`; `src/webhooks.js` |
  | Tenant lookup caching and benchmark | `535af3c`; `src/tenants.js`; commit-reported load-harness result |

- **Statistics:** No repository-volume statistics included. Latency figures are commit-reported p99 measurements; retry counts and delays follow the supplied code.
- **Artifacts:** Markdown in this reply only; no files or visual assets created.
- **Limitations and evidence reconciliation:**
  - The webhook commit says “up to five attempts,” but the implementation permits **six total attempts**. The changelog follows the implementation.
  - The breaking-change commit says `limit` requests return HTTP 400, but the supplied diff does not show that validation. The changelog preserves the required migration without asserting the unverified response status.
  - Production performance and live availability were not verified. Review used only the captured evidence; no commands or tests were executed.
  - Contributor-note edits, formatting, and the internal logging-library update were omitted because the supplied evidence establishes no external-developer impact.