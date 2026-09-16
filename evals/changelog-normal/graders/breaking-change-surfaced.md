---
type: llm
focus: last_message
weight: 2
---
The changelog must surface the breaking parameter rename as a breaking change.

PASS requires all of:
- An item covering the `/v1/events` query parameter rename from `limit` to `page_size`.
- That item is explicitly labelled as breaking, or listed under a breaking-changes heading.
- It states the action a caller must take (send `page_size`, stop sending `limit`), or
  states the consequence of not acting (requests using `limit` now fail / return 400).

FAIL if the rename is absent, is described as a routine feature with no breaking
label anywhere, or if the required caller action and the failure consequence are
both missing.
