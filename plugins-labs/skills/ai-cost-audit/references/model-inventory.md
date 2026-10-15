# Model and media call inventory

Use this reference only after the main skill has selected an inventory, economics, reconciliation, optimization, or verification mode. Do not restart intake here.

## Discovery strategy

Search with `rg`, then follow indirection rather than trusting model literals alone.

Look for:

- provider SDK constructors and request methods;
- gateways, proxy clients, model aliases, environment variables, and configuration files;
- orchestration frameworks, agent/tool loops, evaluators, and structured-output helpers;
- embeddings, rerankers, moderation, OCR, transcription, speech, and image/video operations;
- queues, cron jobs, workers, webhooks, migrations, notebooks, tests, and admin tools;
- retry, fallback, timeout, circuit-breaker, and provider-routing code;
- usage logging, billing webhooks, cost tags, budgets, and tracing spans.

Start broad, then inspect every returned call path. Provider method names change; do not rely on a frozen pattern list.

## Inventory fields

Record one row per distinct priced path, not merely per source line:

| Field | Meaning |
|---|---|
| Feature/action | User or system outcome that triggers the path |
| Location | File, function, worker, or external workflow |
| Environment | Production, staging, local, evaluation, migration |
| Provider/model | Resolved runtime value and alias source |
| Operation | Generation, reasoning, embedding, media, tool, rerank, moderation |
| Input source | Prompt, history, retrieval, files, media, tool results |
| Output control | Token/media limit, schema, stop rule |
| Frequency | Per request/action/session/job and observed volume |
| Routing | Eligibility, difficulty tier, provider/model selection |
| Amplification | Retries, fallbacks, loops, fan-out, regeneration |
| Cache/batch | Eligibility, configuration, observed hit/use rate |
| Latency | User-facing requirement and observed distribution |
| Usage evidence | Provider meter, trace, log, code estimate, or assumption |
| Owner | Team or component responsible |

Resolve aliases to actual runtime values by environment. Preserve uncertainty when configuration is injected externally.

## Call-graph checks

For each feature, trace:

1. entrypoint and eligibility;
2. preprocessing and context construction;
3. primary request;
4. tool calls or recursive turns;
5. validation and repair requests;
6. retry and fallback behavior;
7. asynchronous follow-up work;
8. stored artifacts and downstream media/embedding jobs.

Count amplification from code and telemetry separately. A nominal “one model call” feature may create several billed operations.

## Optimization candidates

Flag candidates only with supporting evidence:

- **Remove:** call does not affect a user or operating decision.
- **Reduce:** avoidable context, duplicate retrieval, excessive output, or repeated repair.
- **Cache:** stable repeated prefix or result with compatible provider semantics and privacy boundary.
- **Batch:** asynchronous work whose latency requirement matches the provider's current batch terms.
- **Route:** measurable task classes differ in required quality or latency.
- **Consolidate:** scattered literals or equivalent calls prevent governance.
- **Observe:** usage cannot be measured or tied to a feature.

Do not infer a safe model downgrade from labels such as “classification” or “summary.” Build a representative evaluation set and compare quality, latency, and failure cost.

## Inventory quality checks

- Search results include indirect wrappers and non-text operations.
- Runtime configuration is resolved for every relevant environment.
- Retries, fallbacks, tools, and fan-out are represented.
- Frequency and usage identify evidence class and date range.
- Unused configuration is distinguished from unreachable or externally triggered code.
- Secrets and raw customer content are excluded from the report.
