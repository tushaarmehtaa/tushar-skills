# DevDay guide distribution drafts — September 30

Prepared assets only. No post, message, notification or indexing request sent. Internal distribution already exists through the Guides index and relevant skill pages.

## Packaging recipe draft

A workflow that writes from supplied context can be a skill-only plugin. We packaged decision-doc with a portable manifest and checked its schema and copied skill files. The guide explains packaging and sharing boundaries; host installation is still untested. Recipe: https://www.slashskills.xyz/guides/chatgpt

## Event workflow draft

A webhook acknowledgment can arrive before the draft exists. Our local event fixture persists receipt, then checks permissions again before completing the job. Fifteen cases cover signatures, duplicates, restart, retries, revocation and unsubscribe. The guide includes the reproducible fixture and its host-testing limits: https://www.slashskills.xyz/guides/mcp-event-automation

## Model evaluation draft

We supplied the same changelog skill and synthetic git evidence to Sol and Astra, three times each. Median HTTP completion: 14.8s vs 24.4s. Both caught a commit/code discrepancy. Estimated token costs were $0.0083 vs $0.0441 per median run, with cache usage recorded. One task is a small sample; Astra Ultrafast was rejected by this API project and remains unmeasured. Full method and outputs: https://www.slashskills.xyz/guides/astra-skill-instructions
