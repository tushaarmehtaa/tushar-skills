---
name: user-insights
description: Analyze behavioral segments, retention, activation, funnels, adoption, churn, and monetization. Use when product, event, billing, or qualitative data must inform a product decision.
license: MIT
---

# User insights

Start from a product decision and metric definition. Do not turn convenient columns or arbitrary time thresholds into personas.

## Choose a mode

- **Question framing:** turn a product concern into measurable questions.
- **Segmentation:** identify behaviorally meaningful groups from distributions or justified business rules.
- **Retention/cohort:** measure return behavior from event history.
- **Activation/funnel:** locate progression and drop-off.
- **Feature adoption/pathing:** understand use sequences and value realization.
- **Churn/monetization:** analyze decline, cancellation, expansion, and revenue behavior.
- **Qualitative synthesis:** connect interviews, support, or survey evidence to behavioral patterns.
- **Audit:** validate an existing query, dashboard, segment, or conclusion.

## Workflow

1. State the product decision, population, behavior, time window, and action the analysis may trigger.
2. Inspect schemas, event taxonomy, identity model, account/user relationships, plan history, billing/refunds, timezone, retention policy, and available qualitative evidence. Match the query language to the actual system.
3. Audit data quality before analysis: event semantics, duplicate/late events, nulls, bots/internal/test accounts, identity merges, plan changes, censoring, seasonality, and instrumentation changes.
4. Define every metric with numerator, denominator, eligibility, window, and unit of analysis. Prefer event history over current user snapshots for trends and retention.
5. For segments, inspect distributions and use quantiles, clusters, or business thresholds only when interpretable and justified. Test sensitivity to reasonable boundary changes. Small groups and ties need explicit handling.
6. For retention, build cohort-period activity from events and distinguish classic, rolling, and bounded retention. Do not infer historical retention from `last_active_at`.
7. For decline or churn risk, compare each subject with its own prior behavior or an appropriate matched baseline; do not call low cumulative usage a decline.
8. Execute queries only when access is available. Otherwise return executable queries and expected result shapes without fabricating counts.
9. Quantify sample size, uncertainty, missingness, and alternative explanations. Treat observational associations as non-causal.
10. Connect each finding to a decision, mechanism, proposed action, and validation method. Prefer experiments or staged tests for causal recommendations.

## Privacy and safety

- Minimize selected fields; avoid `SELECT *` and raw email unless the task requires identifiable outreach and access is authorized.
- Aggregate or pseudonymize outputs where possible.
- Respect consent, retention, deletion, and access-control boundaries.
- Do not label individuals with sensitive or stigmatizing inferred traits.

## Load conditional reference

Read [analysis patterns](references/guide.md) for calibrated segmentation, event-based cohort SQL, decline analysis, query review, and action design. The reference contains patterns to adapt, not fixed thresholds or a separate workflow.

## Output contract

Distinguish two states:

- **Executed analysis:** evidence ledger, metric definitions, data-quality findings, results with denominators/uncertainty, limitations, and decisions.
- **Query plan:** schema mapping, executable queries, expected columns, validation queries, and interpretation rules—no invented results.

For either state, include justified segments/cohorts only, privacy notes, alternative explanations, recommended action, and how to test it.

## Verify

- Queries use real schema fields and correct grain.
- Trends and retention use event history rather than snapshots.
- Cohort denominators and maturity/censoring are correct.
- Segment thresholds are justified and sensitivity-tested.
- Counts reconcile to eligible-population totals without unintended overlap.
- PII is minimized and access assumptions are explicit.
- Observational results are not presented as causal.
- Recommendations state evidence, mechanism, uncertainty, and validation.
