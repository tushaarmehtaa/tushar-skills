# orbit-api v0.3.0

## Breaking change

- **Rename `/v1/events` pagination parameter from `limit` to `page_size`.** Update requests such as `/v1/events?limit=100` to `/v1/events?page_size=100` before upgrading. The `limit` parameter is no longer supported.

## Security

- **Reject expired refresh tokens.** Previously, expired refresh tokens could continue to be accepted indefinitely. Clients must handle refresh failures and require users to authenticate again when their refresh token has expired.

## Added

- **Cursor-based pagination for `/v1/events`.** Use the `cursor` query parameter to paginate beyond 10,000 events without offset drift.
- **Automatic retries for failed webhook deliveries.** Failed deliveries now retry with exponential backoff: up to five retries after the initial attempt, with delays totaling approximately 31 seconds, excluding delivery time.

## Performance

- **In-process tenant lookup caching.** The reported load-harness result reduced `/v1/events` p99 latency from 420 ms to 250 ms. This is a benchmark result, not a production latency guarantee.

---

## Handoff summary

- **Range:** `v0.2.0..HEAD` on `main`; captured HEAD: `535af3cc8bbc23febc275c03a0c4f75b023ff226`.
- **Audience and channel:** External API developers; Markdown release notes supplied directly in this reply.
- **Release status:** Unreleased release-preparation copy. No release or deployment evidence was supplied; live status is not verified.
- **Items:** 5.
- **Provenance:**

  | Item | Evidence |
  |---|---|
  | `limit` → `page_size` migration | `62c31be`; `src/events.js` |
  | Expired refresh-token rejection | `281cf30`; `src/auth.js` |
  | Cursor pagination | `363f021`; `src/events.js` |
  | Webhook retries | `b4ec88e`; `src/webhooks.js` |
  | Tenant lookup caching and benchmark | `535af3c`; `src/tenants.js`; commit-reported load-harness result |

- **Statistics:** No repository activity counts included. The performance figures are commit-reported p99 latency measurements, not independently verified results.
- **Artifacts:** Markdown above; no file or visual artifact created.
- **Limitations and evidence discrepancies:**
  - The webhook commit says “up to five attempts,” but the supplied implementation permits **six total attempts**: one initial attempt and five retries. The changelog follows the implementation.
  - The breaking-change commit states that `?limit=` returns HTTP 400. The supplied diff removes its use but does not show request validation establishing that response. The changelog preserves the required migration without asserting the unverified status code; confirm this behavior before publication.
  - Review used only the captured evidence. No commands, tests, benchmarks, or deployment checks were executed.
  - Contributor-note edits, formatting, and the internal logging-library update were excluded because the supplied evidence establishes no external developer impact.