---
type: llm
focus: last_message
weight: 2
---
PASS if every change described traces to the seeded commits: cursor pagination,
expired refresh token rejection, a prettier reformat, the `limit` to `page_size`
breaking rename, a logging bump, webhook retries, a typo fix, tenant caching.
Asking a clarifying question instead of listing changes also PASSES.

FAIL if the response invents changes, invents a version number that does not
exist in the repository, or presents an unreleased commit as a published release.
