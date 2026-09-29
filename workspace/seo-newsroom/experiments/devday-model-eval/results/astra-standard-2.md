# orbit-api v0.3.0

*Release notes for the upcoming release; deployment has not been verified.*

## Breaking changes

- **Replace `limit` with `page_size` on `/v1/events`.** The `limit` query parameter is no longer supported; requests using it return **400**, according to the breaking-change commit. Update your requests before adopting v0.3.0—for example, change `/v1/events?limit=100` to `/v1/events?page_size=100`.

## Security fixes

- **Expired refresh tokens are now rejected.** Previously, expired refresh tokens could continue to be accepted indefinitely. Ensure your client handles refresh-token expiration by prompting for reauthentication rather than repeatedly retrying the expired token.

## Features

- **Cursor-based pagination for `/v1/events`.** Use the `cursor` query parameter with `page_size` to page beyond 10,000 events without offset drift.
- **Automatic retries for failed webhook deliveries.** Failed deliveries are retried with exponential backoff. The implementation allows five retries after the initial attempt—six attempts total—with delays of 1, 2, 4, 8, and 16 seconds. This adds 31 seconds of backoff, excluding delivery time, to help recover from temporary failures.

## Performance

- **In-process tenant lookup caching.** The performance commit reports a reduction in `/v1/events` p99 latency from 420 ms to 250 ms in the load harness. This is a benchmark result, not a production latency guarantee.

---

## Handoff summary

**Range:** `v0.2.0..HEAD` on `main`, with captured HEAD at `535af3cc8bbc23febc275c03a0c4f75b023ff226`.

**Audience and channel:** External API developers; Markdown release notes supplied directly in this reply.

**Release status:** Unreleased/pre-release copy for v0.3.0. No release-tag or deployment evidence was supplied; live status was not verified.

**Items:** 5.

**Provenance:**

| Item | Evidence |
|---|---|
| `limit` → `page_size` migration | `62c31be`; `src/events.js` |
| Expired refresh-token rejection | `281cf30`; `src/auth.js` |
| Cursor-based event pagination | `363f021`; `src/events.js` |
| Webhook retries | `b4ec88e`; `src/webhooks.js` |
| Tenant lookup caching and benchmark | `535af3c`; `src/tenants.js` |

**Statistics:** No repository-volume statistics used. The p99 figures are load-harness results reported in the performance commit.

**Artifacts:** Inline Markdown only; no files or visual assets created.

**Limitations and evidence discrepancies:**
- The webhook commit says “up to five attempts,” but the supplied implementation permits **six total attempts**. The changelog follows the implementation.
- The **400 response for `limit`** is documented in the breaking-change commit, but the supplied diff does not show the request-validation layer. Confirm that behavior before publication.
- Benchmark results and pagination beyond 10,000 events are reported in commit descriptions; no benchmark output or tests were supplied.
- All evidence was reviewed from the captured fixture; no commands or tests were executed.
- Contributor-note edits, formatting, and the internal logging-library update were omitted because the supplied evidence establishes no external developer impact.