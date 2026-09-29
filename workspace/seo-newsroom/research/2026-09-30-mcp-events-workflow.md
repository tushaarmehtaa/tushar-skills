# MCP event workflow evidence — September 30, 2026

## Decision and product placement

Publish `/guides/mcp-event-automation` as a local testing recipe. Distinct job: turn an event into a bounded draft workflow and test failure paths. `/guides/chatgpt` covers packaging/distribution. Contextual links connect `ai-product-development` and `decision-doc`; no homepage changes. Tushar authorized all three follow-ups September 30.

The current [skills.sh docs](https://www.skills.sh/docs), inspected this session, separates installation help from discovery. We retain that placement and contribute our own reproducible experiment.

## Claim map

| Claim | Evidence | Allowed scope |
| --- | --- | --- |
| Integration supports verified webhooks; protocol 2026-07-28 | Primary: [OpenAI MCP Events](https://developers.openai.com/plugins/build/mcp-events), retrieved September 30 | Documented behavior, no host observation |
| Signature binds ID, attempt timestamp and body | Primary: [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md) | Signing contract |
| Local signer matches known-answer vector | Owned test + MIT-licensed [upstream vector](https://github.com/standard-webhooks/standard-webhooks/blob/main/libraries/javascript/src/webhook.test.ts) | This vector, no crypto audit |
| 15 lifecycle tests pass | Owned: [fixture](../experiments/devday-mcp-events/) | Injected local transport, deterministic drafts |
| Duplicate/restart case creates one output | Owned journal assertions | Single process, not distributed exactly-once |
| Revocation cancels queued work | Owned injected permission check | Synthetic authorization, no OAuth proof |

## Findings and limits

Receipt and completion are separate checkpoints. Persisting the inbox before acknowledgment makes interruption inspectable. One local journal update includes draft creation and completion. The worker rechecks authorization because stopping outbound delivery leaves already received jobs queued.

The title remains data; no LLM runs or injection defense is tested. Concurrent writes, remote business operations, replay, host activation and network controls need separate evidence. This JSON journal is an experiment, not a production durability recommendation.

## Score and maintenance

85: reader job 24, observed discovery intent 10, original contribution 20, claim-matched evidence 18, durable usefulness 9, distribution fit 4. No measured search volume. Tushar owns maintenance; revisit integration/proposal changes. Guard passed before creation: September 30, 0/3 URLs used. Record after live verification.

Check metadata, canonical, index/follow, sitemap, September 30 article dates, skill/index links, mobile and desktop reading/copy journey. Measurement windows October 14/28: relevant impressions/clicks and guide-to-skill opens. Search Console access is unverified; deployment does not establish indexation.
