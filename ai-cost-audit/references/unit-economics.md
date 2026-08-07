# Unit economics and reconciliation

Use these formulas after the main skill establishes scope and evidence. Fetch all prices from current official provider sources; this reference intentionally contains no model prices or universal margin benchmarks.

## Contents

- [Evidence hierarchy](#evidence-hierarchy)
- [Per-operation cost](#per-operation-cost)
- [Product economics](#product-economics)
- [Cache analysis](#cache-analysis)
- [Batch and routing analysis](#batch-and-routing-analysis)
- [Reconciliation](#reconciliation)
- [Scenario design](#scenario-design)
- [Recommendation record](#recommendation-record)

## Evidence hierarchy

Prefer, in order:

1. provider invoice/billing export;
2. provider-metered usage attached to requests;
3. application traces with token/media counts;
4. tokenizer or file-duration/dimension calculations;
5. code-derived limits and observed volume;
6. explicitly labeled generic assumptions.

Never blend classes without showing which inputs are estimated.

## Per-operation cost

For a token-priced operation:

```text
input_cost       = uncached_input_units × input_rate
cache_read_cost  = cached_input_units × cache_read_rate
cache_write_cost = cache_write_units × cache_write_rate
output_cost      = output_units × output_rate
reasoning_cost   = billed_reasoning_units × reasoning_rate
request_cost     = sum(components) + tool/media/minimum fees
```

Normalize rates and units before arithmetic. For media, use the provider's billed duration, resolution, characters, images, or other current unit.

Expected feature cost:

```text
base_paths    = Σ(path_probability × path_cost)
retry_cost    = Σ(retry_probability × retry_path_cost)
fallback_cost = Σ(fallback_probability × fallback_path_cost)
feature_cost  = base_paths + retry_cost + fallback_cost + storage + egress + gateway
```

Report a distribution where request shapes vary materially.

## Product economics

```text
variable_cost_per_action = AI + non-AI variable infrastructure + payment-variable cost
contribution_per_action  = allocated_revenue - variable_cost_per_action
contribution_margin      = contribution_per_action / allocated_revenue

monthly_variable_cost = Σ(action_volume × expected_action_cost)
gross_profit          = recognized_revenue - cost_of_revenue
break_even_usage      = available_contribution / marginal_action_cost
```

State the accounting boundary. Gross margin, contribution margin, and cash spend answer different questions.

For free allowances:

```text
expected_free_cost = signup_count × activation_rate × E[cost | activated free user]
payback_ratio      = contribution_per_payer / expected_cost_per_nonpayer
```

Do not invent activation, conversion, or usage distributions.

## Cache analysis

Model provider-specific write/read rules, TTLs, minimum cacheable length, invalidation, and privacy boundaries from current documentation.

```text
uncached_cost  = repeated_units × normal_input_rate
cached_cost    = write_cost + expected_reads × read_cost + uncached_remainder
cache_savings  = comparable_uncached_cost - cached_cost
break_even_reads = incremental_write_cost / savings_per_read
```

Use observed prefix stability and hit rate. Include latency and quality effects when context must be restructured.

## Batch and routing analysis

For batch, verify current eligibility, completion window, cancellation behavior, quota, and discount. Compare with the workload's real deadline and retry policy.

For routing, calculate expected savings using observed task mix, then gate the proposal with representative evaluations. Include false-success cost, retry amplification, latency, and operational complexity.

## Reconciliation

Reconcile by provider, account/project, model/operation, environment, and day where possible.

```text
variance = billed_total - modeled_total
variance_pct = variance / billed_total
```

Investigate taxes, credits, tiers, minimums, storage, fine-tuning, deleted logs, untagged environments, retries, external tools, currency conversion, and billing-period boundaries. Leave a residual unexplained amount if evidence cannot resolve it.

## Scenario design

Include only decision-relevant scenarios:

- measured baseline;
- high-usage or tail request shape;
- abuse/retry incident;
- price or volume sensitivity;
- proposed cache/batch/routing change;
- quality failure or fallback amplification.

Show formulas, input values, provenance, and a range rather than false precision.

## Recommendation record

For each change, report:

- affected path and evidence;
- monthly savings range and confidence;
- engineering effort and owner;
- quality, latency, privacy, and reliability risk;
- evaluation/canary design;
- rollback trigger;
- post-change measurement window.
