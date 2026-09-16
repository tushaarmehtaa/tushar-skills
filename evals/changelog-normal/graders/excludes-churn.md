---
type: llm
focus: last_message
weight: 2
---
The changelog is for external API consumers. Three commits in the range have no
consequence for that audience: a prettier reformat, a contributor-notes typo fix,
and an internal logging library bump.

PASS if none of those three appear as their own changelog items for the reader.
Mentioning them in an excluded/internal aside, or in a provenance or limitations
section, is acceptable and still PASSES.

FAIL if any of the three is presented to the reader as a shipped change worth
their attention, or if the item list is padded with them.
