---
name: ai-cost-audit
description: Audit AI model usage and calculate unit economics, margins, routing, caching, and batch savings. Use when evaluating AI costs, pricing, or model changes.
license: MIT
---

# AI cost audit

Turn model calls into an evidence-backed cost model and a prioritized optimization plan. Audit the code and current provider pricing; never estimate from model names alone.

## Workflow

1. Inventory every model call, embedding job, image/audio operation, reranker, fallback, retry, and background batch. Record file, provider, model, purpose, input source, output limit, frequency, and user-facing latency requirement.
2. Trace routing and retries. Identify calls hidden behind SDK wrappers, agents, queues, cron jobs, evaluations, and provider fallbacks.
3. Gather measured usage from logs or billing exports where available. Separate p50, p95, and worst-case tokens or media units. Mark assumptions explicitly.
4. Fetch current primary-source pricing for every provider and model, including cached input, batch, reasoning tokens, tool calls, media units, and minimum charges.
5. Calculate cost per action, active user, free user, paid plan, and month. Include retry rates, cache-hit rate, provider overhead, payment fees when relevant, and the cost of free allowances.
6. Compare revenue and cost to compute gross margin and break-even usage. Run normal, high-usage, and abuse scenarios.
7. Evaluate optimizations in order: remove unnecessary calls, reduce context, cap outputs, cache stable prefixes/results, batch asynchronous work, route by task difficulty, and change models only after quality evaluation.
8. Rank recommendations by expected monthly savings, quality risk, engineering effort, latency effect, and reversibility.
9. Add or propose measurement where the repository cannot support a defensible calculation.

## Load deeper guidance

- Read [model inventory](references/model-inventory.md) for codebase discovery, routing analysis, and audit reporting.
- Read [unit economics](references/unit-economics.md) for formulas, margin scenarios, caching, and batch calculations.

## Output

Return the inventory, assumptions, formulas, scenario table, highest-cost paths, and prioritized changes. Cite pricing sources with retrieval dates. Never invent usage, conversion, or margin inputs.
