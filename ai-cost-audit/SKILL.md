---
name: ai-cost-audit
description: Audit AI usage, billing, unit economics, routing, caching, batching, and optimization. Use when AI cost, margin, pricing, model choice, or savings must be measured or verified.
license: MIT
---

# AI cost audit

Build a cost model from observed usage and current primary-source prices. Treat repository intent, measured usage, invoices, and projections as different evidence classes.

## Choose a mode

- **Inventory:** map model/media calls, routing, retries, and ownership.
- **Economics:** calculate cost per action, user, plan, and month.
- **Simulation:** compare pricing, volume, model, cache, batch, or abuse scenarios.
- **Optimization:** rank changes after measuring quality and operational risk.
- **Reconciliation:** explain the gap between bottom-up estimates and provider invoices.
- **Verification:** confirm that a completed change reduced spend without unacceptable quality or latency regressions.

Use the narrowest mode that answers the request. Combine modes only when the user asks for a full audit or the dependency is necessary.

## Workflow

1. Inspect the repository, existing telemetry, billing exports, pricing configuration, and prior analyses before asking questions.
2. State the audit boundary: environments, date range, providers, features, currencies, taxes, credits, and whether non-model infrastructure is included.
3. Inventory direct and indirect calls: generation, reasoning, embeddings, reranking, tools, image/audio/video, moderation, retries, fallbacks, agents, queues, evaluations, and batches.
4. Prefer provider-metered tokens or media units. Keep measured values, code-derived estimates, generic estimates, and assumptions visibly separate. Use p50, p95, and worst-case where available.
5. Fetch current prices only from official provider sources when pricing affects the answer. Record URL, retrieval date, region/tier/currency, and special terms such as cached input, reasoning tokens, batch, storage, or minimum charges. Do not rely on bundled price tables or memory.
6. Model each cost path, including failed calls, retry amplification, tool loops, cache writes/reads, storage, egress, gateway fees, payment fees, free allowances, and shared fixed costs when relevant.
7. Reconcile the modeled total against invoices or billing dashboards. Quantify unexplained variance instead of forcing agreement.
8. Run normal, high-usage, abuse, and sensitivity scenarios. Do not apply universal margin or traffic thresholds without the product's business constraints.
9. Rank recommendations by expected savings range, evidence confidence, quality risk, latency effect, engineering effort, reversibility, and measurement plan.
10. Require an evaluation and canary before changing models, prompts, routing, or output limits. Verify spend, quality, latency, error rate, and user outcomes afterward.

Ask only for inputs that cannot be recovered from the scoped artifacts and materially change the result.

## Safety and evidence rules

- Never invent usage, conversion, revenue, invoice, cache-hit, or quality inputs.
- Never expose secrets found in environment files or billing exports.
- Do not recommend a cheaper model solely from task labels; require representative evaluation data.
- Label projections as projections and show formulas with units.
- Treat prices and model availability as time-sensitive.

## Load conditional references

- Read [model inventory](references/model-inventory.md) for discovery patterns, call-path fields, and routing analysis.
- Read [unit economics](references/unit-economics.md) for formulas, reconciliation, scenario design, and recommendation ranking.

These references provide specialist detail only. This file controls mode, interaction, safety, output, and verification.

## Output contract

Return only sections supported by the selected mode:

- scope and evidence ledger;
- model/media call inventory with file paths and ownership;
- assumptions and data gaps;
- formulas with units and a scenario table;
- highest-cost paths and invoice reconciliation;
- prioritized changes with savings ranges and quality gates;
- verification results or an explicit measurement plan.

Cite every time-sensitive price with an official source and retrieval date.

## Verify

- Inventory covers wrappers, retries, fallbacks, background jobs, and non-text operations.
- Totals preserve units, currencies, date ranges, and environment boundaries.
- Measured and estimated inputs are distinguishable.
- Bottom-up totals are reconciled to billed totals when billing is available.
- Recommendations include a quality gate, rollback path, and owner or next action.
- Completed optimizations are verified with before/after spend, quality, latency, and error data.
