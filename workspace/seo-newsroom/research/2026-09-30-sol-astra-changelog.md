# Sol/Astra supplied-skill evaluation — September 30, 2026

Tushar authorized the comparison and the Tweetbuzz OpenAI key. Only the synthetic fixture and public checked-in skill were sent. No credentials or Tweetbuzz application data are in artifacts.

## Results and claims

Six completed HTTP streaming Responses calls: three `gpt-6.1-sol` Standard and three `gpt-6-astra` Standard. Identical medium reasoning, maximum output, skill and captured repository evidence; exact returned identifiers/tiers match. [Artifacts and method](../experiments/devday-model-eval/) retain inputs, outputs, usage, times and an unblinded review. This is an explicitly supplied skill, not a runtime installation/discovery evaluation.

| Sample, n=3 each | Sol | Astra |
| --- | --- | --- |
| Completion median | 14.818s | 24.364s |
| Completion nearest-rank p95 (=maximum) | 15.153s | 25.254s |
| First-text median | 5.652s | 9.375s |
| Estimated token-cost median | $0.008305 | $0.044119 |

All six meet the existing case's applicable artifact criteria: five meaningful items; migration; no churn in customer bullets; full handoff; provenance; deployment unverified. All six identified code allowing six webhook attempts versus commit wording saying five. Exploratory publication-copy difference: Astra omitted/attributed commit-only HTTP 400 behavior in its customer bullets; Sol stated it there without attribution, then disclosed the validation gap in the handoff. This observation was not a preregistered quality criterion.

Costs include explicit cache-write and cached-input usage. First run of each model wrote 2,189 tokens; later runs read 2,189. Total estimated token cost $0.1909688. No invoice/reconciliation; failed calls have no completed usage record. Cache and output lengths differ across observations. Latency includes network overhead. With three repeats, sample p95 equals the maximum and cannot estimate production tails.

## Ultrafast discrepancy

Official [Ultrafast docs](https://developers.openai.com/api/docs/guides/ultrafast-mode), inspected September 30, document `gpt-6-astra` with `service_tier: ultrafast` over HTTP. This API project rejected that exact request with **Invalid service_tier argument**, twice including diagnostic capture. Zero Ultrafast runs completed. No speed/quality/cost finding is supported for that arm. Do not infer global unavailability or the cause from this response. Revisit when the project accepts this tier. Sol Ultrafast was not tested.

## Production decision

Update `/guides/astra-skill-instructions`; no new URL. Preserve original instruction suggestions as hypotheses and explicitly distinguish the unchanged-skill experiment. Scores: reader relevance 24, observed intent 11, original contribution 20, evidence 18, durability 8, distribution 4 = 85. Missing Ultrafast evidence does not block the separate measured Standard comparison.

Sources: exact [Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) and [Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) pages, [pricing](https://developers.openai.com/api/docs/pricing), [Ultrafast](https://developers.openai.com/api/docs/guides/ultrafast-mode). Source claims and prices are provider documentation; results are local-client observations. No demand or traffic metric was collected.

After live verification, record September 30 update with measurement windows October 14/28. Compare relevant query coverage and skill opens; do not infer indexation from a response or sitemap.
