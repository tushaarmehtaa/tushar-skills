---
name: product-experiments
description: Design, implement, validate, analyze, and conclude experiments or safe rollouts. Use when testing product behavior with flags, exposure tracking, metrics, staged releases, or A/B tests.
license: MIT
---

# Product experiments

Turn a product question into a measurable decision. A feature flag without trustworthy exposure data and a decision rule is release control, not an experiment.

## Choose a mode

- **Design:** create an experiment brief and analysis plan.
- **Implement:** add assignment, exposure tracking, metrics, and safeguards.
- **Rollout-only:** release safely when causal inference is unnecessary.
- **Validate:** audit instrumentation and assignment before launch.
- **Analyze:** estimate effects and diagnose data-quality failures.
- **Conclude:** decide ship, iterate, continue, or rollback and record why.

Keep design vendor-independent. Use an existing analytics/flag provider when present; add a new provider only when selected or explicitly authorized.

## Experiment brief

Before implementation, record:

- product decision and causal hypothesis;
- mechanism: why treatment should change behavior;
- eligible population and exclusions;
- assignment unit, exposure unit, and identity transition rules;
- control and variants, experiment key, and immutable version;
- primary outcome with numerator, denominator, window, and direction;
- guardrails and diagnostic metrics;
- baseline, minimum detectable effect or smallest worthwhile effect, and uncertainty method;
- minimum observation/maturity window and stop rules;
- rollout stages, kill conditions, owner, and rollback path;
- action triggered by positive, neutral, harmful, or invalid results.

If inputs are unavailable, state what can be designed now and what must be measured before launch. Do not invent power or duration.

## Workflow

1. Inspect the product, event taxonomy, identity model, analytics, flag system, existing experiments, and deployment constraints.
2. Choose assignment and exposure units that match the causal question. Address anonymous-to-authenticated identity, group assignment, repeat exposure, interference, and concurrent experiments.
3. Implement deterministic assignment or the provider's documented mechanism. Preserve assignment across requests and devices as required.
4. Capture one deduplicated exposure record at the point treatment can affect behavior. Include experiment key, version, variant, subject, timestamp, and relevant context. Do not substitute flag evaluation for exposure.
5. Instrument outcomes and guardrails with testable schemas. Verify that exposure joins to outcomes and that control/treatment event semantics match.
6. Launch at a safe initial allocation. Monitor errors, latency, data loss, sample-ratio mismatch, and guardrails before widening.
7. Analyze only after the planned maturity window unless a kill condition fires. Report effect size and uncertainty, not just significance. Check sample-ratio mismatch, missingness, novelty/carryover, peeking, multiple comparisons, censoring, and segment exploration.
8. Conclude against the prewritten decision rule. Separate invalid, inconclusive, practically neutral, beneficial, and harmful results.
9. Remove or graduate flags, document the decision, and verify the post-decision product state.

## Provider guidance

- If PostHog is already selected, read [PostHog implementation](references/posthog.md) if present. If it is absent, inspect installed versions and use current official documentation rather than copying remembered SDK code.
- If the measurement layer is missing, use an available analytics capability or provide a minimal vendor-neutral event contract and identify the implementation blocker.

## Safety

- Do not expose users to security, privacy, billing, or irreversible-risk variants without appropriate review.
- Minimize sensitive properties and define retention/access controls for experiment data.
- Do not recommend shipping from underpowered or invalid data.
- Never silently change the primary metric or exclusions after seeing results.

## Output contract

Return the applicable artifact:

- experiment brief and analysis plan;
- implementation changes and event schemas;
- pre-launch validation report;
- staged rollout/rollback plan;
- analysis with data-quality checks, effect sizes, uncertainty, and limitations;
- decision record with follow-up and flag cleanup.

## Verify

- Assignment is stable and matches the intended unit.
- Exposure is deduplicated, versioned, and recorded when treatment can act.
- Exposure joins to outcome and guardrail events.
- Control and treatment pass functional tests.
- Kill switch, provider failure behavior, and rollback are tested.
- Sample-ratio mismatch and event completeness are checked.
- Analysis honors the registered population, windows, and decision rule.
- Final decision includes practical significance, uncertainty, limitations, and cleanup.
