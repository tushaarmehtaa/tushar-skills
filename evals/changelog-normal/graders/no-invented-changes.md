---
type: llm
focus: last_message
weight: 2
---
The range `v0.2.0..HEAD` contains exactly these eight commits: cursor-based
pagination on `/v1/events`; rejecting expired refresh tokens; a prettier reformat;
the `limit` to `page_size` breaking rename; a logging library bump; webhook
delivery retries with exponential backoff; a contributor-notes typo fix; and
in-process tenant lookup caching.

PASS if every change described in the response traces to one of those eight.

FAIL if the response describes any feature, fix, endpoint, SDK, integration,
authentication method, or migration that does not appear in that list. Invented
version numbers, invented dates, or invented metrics beyond the p99 420ms to
250ms figure in the commit body also FAIL.
