# Product analysis patterns

Adapt these patterns to the actual event model and product decision. They intentionally avoid fixed lifecycle thresholds and snapshot-based retention.

## Contents

- [Metric contract](#metric-contract)
- [Data-quality audit](#data-quality-audit)
- [Activation and funnel analysis](#activation-and-funnel-analysis)
- [Behavioral segmentation](#behavioral-segmentation)
- [Event-based retention](#event-based-retention)
- [Usage decline](#usage-decline)
- [Query validation](#query-validation)
- [Action design](#action-design)

## Metric contract

For every metric record:

```text
name and decision supported
unit: user | account | workspace | subscription | device
eligible population and exclusions
numerator/event and denominator
time zone and window
event maturity/censoring rule
source tables and grain
known instrumentation changes
```

## Data-quality audit

Before interpreting behavior, measure:

- event volume and distinct subjects by day/version/environment;
- duplicate event IDs and retry patterns;
- null/unknown identity and merge rate;
- internal, bot, test, and deleted-account inclusion;
- late-arriving events and ingestion outages;
- event-property availability and semantic changes;
- plan/status history, refunds, pauses, and account merges.

Reconcile eligible totals across source systems where feasible.

## Activation and funnel analysis

Define activation as an observed value event or validated leading indicator, not signup or a convenient click by default. Record the eligible population, ordered or unordered steps, allowed window, unit of analysis, identity transition, and whether repeated attempts count.

Build the funnel from subject-level first qualifying timestamps so retries and duplicate events do not inflate conversion:

```sql
WITH eligible AS (
  SELECT subject_id, MIN(occurred_at) AS entered_at
  FROM events
  WHERE event_name = :entry_event
    AND occurred_at >= :analysis_start
    AND occurred_at < :analysis_end
  GROUP BY subject_id
), steps AS (
  SELECT
    e.subject_id,
    e.entered_at,
    MIN(v.occurred_at) FILTER (
      WHERE v.event_name = :value_event
        AND v.occurred_at >= e.entered_at
        AND v.occurred_at < e.entered_at + :activation_window
    ) AS activated_at
  FROM eligible e
  LEFT JOIN events v ON v.subject_id = e.subject_id
  GROUP BY e.subject_id, e.entered_at
)
SELECT
  COUNT(*) AS eligible_subjects,
  COUNT(activated_at) AS activated_subjects
FROM steps;
```

For multi-step funnels, calculate each step from raw events and require timestamps to satisfy the intended ordering. Report subject counts and denominators at every step, time-to-step distributions, window maturity, and exclusions. Compare segments only after checking sample size, instrumentation parity, acquisition mix, and exposure opportunity. Treat the observed funnel as descriptive unless assignment or a causal design supports stronger claims.

## Behavioral segmentation

Choose features tied to the product mechanism, such as recent active periods, successful value events, frequency, breadth/depth, collaboration, spend, or support friction.

Use quantiles when relative rank is meaningful:

```sql
WITH subject_metrics AS (
  SELECT
    subject_id,
    COUNT(*) FILTER (WHERE event_name = :value_event) AS value_events,
    COUNT(DISTINCT DATE_TRUNC(:period, occurred_at)) AS active_periods,
    MAX(occurred_at) AS last_value_at
  FROM events
  WHERE occurred_at >= :analysis_start
    AND occurred_at < :analysis_end
    AND environment = 'production'
  GROUP BY subject_id
), ranked AS (
  SELECT *,
    PERCENT_RANK() OVER (ORDER BY value_events) AS value_event_rank
  FROM subject_metrics
)
SELECT * FROM ranked;
```

Define segments after inspecting distributions. Handle ties, zero-inflation, small populations, and overlapping definitions. Run sensitivity checks at nearby boundaries and explain why a segment changes a decision.

## Event-based retention

Build cohort and activity periods from event rows:

```sql
WITH cohort AS (
  SELECT
    subject_id,
    DATE_TRUNC('week', MIN(occurred_at) AT TIME ZONE :analysis_timezone)::date AS cohort_week
  FROM events
  WHERE event_name = :entry_event
  GROUP BY subject_id
), activity AS (
  SELECT DISTINCT
    subject_id,
    DATE_TRUNC('week', occurred_at AT TIME ZONE :analysis_timezone)::date AS activity_week
  FROM events
  WHERE event_name = :return_event
), matrix AS (
  SELECT
    c.subject_id,
    c.cohort_week,
    ((a.activity_week - c.cohort_week) / 7)::int AS period
  FROM cohort c
  JOIN activity a USING (subject_id)
  WHERE a.activity_week >= c.cohort_week
)
SELECT cohort_week, period, COUNT(DISTINCT subject_id) AS retained_subjects
FROM matrix
GROUP BY cohort_week, period
ORDER BY cohort_week, period;
```

Join to cohort sizes and exclude cohorts that have not matured for the period. Define whether retention is exact-period, rolling, or bounded. Adapt SQL dialect and event eligibility.

## Usage decline

Measure a subject against its own prior comparable windows:

```sql
WITH periods AS (
  SELECT
    subject_id,
    COUNT(*) FILTER (
      WHERE occurred_at >= :current_start AND occurred_at < :current_end
    ) AS current_value_events,
    COUNT(*) FILTER (
      WHERE occurred_at >= :prior_start AND occurred_at < :prior_end
    ) AS prior_value_events
  FROM events
  WHERE event_name = :value_event
  GROUP BY subject_id
)
SELECT *,
  (current_value_events - prior_value_events)::numeric
    / NULLIF(prior_value_events, 0) AS relative_change
FROM periods;
```

Align weekday/season length, exclude incomplete windows, set a minimum prior activity, and distinguish product-wide seasonality from subject-specific decline. Do not label a person “at risk” without validating association with churn or a business rule.

## Query validation

For every final query:

- inspect join cardinality and duplicate amplification;
- reconcile totals to the eligible population;
- test empty, small, tied, null, deleted, and multi-account cases;
- verify time boundaries and timezone;
- compare a sample of subjects with raw event timelines;
- explain overlap or enforce mutually exclusive segments;
- use parameters, least-privilege access, and minimal fields;
- review execution plan/cost on large datasets.

ORM output is optional. Produce it only when the application needs the query in that ORM; do not duplicate SQL mechanically.

## Action design

For each finding state:

- evidence and denominator;
- plausible mechanism;
- alternative explanations;
- affected population and privacy risk;
- proposed action and expected change;
- guardrail and test design;
- decision owner and review window.

Founder outreach, incentives, onboarding, or feature education are hypotheses—not universal winners. Test proportionally and stop actions that create complaint, trust, or fairness harm.
