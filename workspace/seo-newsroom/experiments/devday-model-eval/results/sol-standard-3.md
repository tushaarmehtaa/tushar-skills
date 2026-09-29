# orbit-api v0.3.0

Release notes for the upcoming release; deployment has not been verified.

## Breaking change

- **Rename `/v1/events` pagination parameter from `limit` to `page_size`.** Update requests from `?limit=…` to `?page_size=…`. Requests using `limit` now return **400 Bad Request**.

## Added

- **Cursor-based pagination for `/v1/events`.** Use the `cursor` query parameter to page past 10,000 events without offset drift. Use `page_size` to control page size.
- **Automatic retries for failed webhook deliveries.** Failed deliveries receive up to **five retries after the initial attempt**, with exponential backoff delays of 1, 2, 4, 8, and 16 seconds. That is up to six total delivery attempts, with 31 seconds of scheduled waiting, excluding request duration.

## Security

- **Expired refresh tokens are now rejected.** Previously, expired refresh tokens could be accepted indefinitely. Clients must no longer rely on an expired refresh token to renew access.

## Performance

- **Faster tenant lookups through in-process caching.** In the load harness, `/v1/events` p99 latency decreased from **420 ms to 250 ms**. These measurements are benchmark results, not a production latency guarantee.

---

## Handoff summary

- **Range:** `v0.2.0..HEAD` on `main`; captured HEAD: `535af3cc8bbc23febc275c03a0c4f75b023ff226`. Uncommitted work is outside the requested range.
- **Audience and channel:** External API developers; Markdown release notes.
- **Release status:** Prepared for the upcoming v0.3.0 release. No release-tag or deployment evidence was supplied; live status is not verified.
- **Items:** 5.
- **Provenance:**
  - Parameter rename and reported HTTP 400 behavior → `62c31beb`, `src/events.js`.
  - Cursor pagination → `363f021e`, `src/events.js`.
  - Webhook retries → `b4ec88eb`, `src/webhooks.js`.
  - Refresh-token expiration enforcement → `281cf30a`, `src/auth.js`.
  - Tenant caching and load-harness latency measurements → `535af3cc`, `src/tenants.js`.
- **Statistics:** No repository activity counts used. Latency figures come from the captured commit message.
- **Artifacts:** Markdown delivered directly in this reply; no files or visual assets created.
- **Limitations:** Review used only the supplied repository fixture; no commands or tests were executed. The webhook commit message says “five attempts,” but the supplied implementation allows one initial attempt plus five retries; the changelog follows the implementation. HTTP 400 behavior and the pagination scale claim are documented in commit messages but are not independently demonstrated by the supplied diff. Contributor-note edits, formatting, and the internal logging dependency update were omitted because no external API impact was evidenced.