# PostHog implementation adapter

Use this adapter only when PostHog is already installed or explicitly selected. Inspect the installed SDK versions and current official documentation before editing code; API names, hosts, flag behavior, and shutdown requirements can change.

## Detect the existing integration

Inspect:

- package manifests and lockfiles;
- client and server initialization;
- configured host/data region;
- identity calls and anonymous-to-known merges;
- event naming/schema conventions;
- existing flag keys, experiments, cohorts, and groups;
- serverless/runtime lifecycle and error handling.

Extend the project's conventions. Do not add a second client or duplicate provider.

## Assignment and exposure

Feature-flag evaluation is not automatically a trustworthy experiment exposure.

For an experiment:

1. evaluate with the intended stable distinct ID or group key;
2. obtain the variant and immutable experiment version;
3. render or execute the treatment;
4. capture one exposure when treatment can affect behavior;
5. deduplicate repeated evaluations according to the analysis unit;
6. include variant, experiment version, subject type, timestamp, and eligibility context.

Verify in the provider's current documentation whether its experiment product captures exposure automatically and under which SDK/path. Do not double-capture.

## Client versus server evaluation

Prefer server evaluation for routing, permissions, pricing, API behavior, and initial-render content when the runtime supports it. Client evaluation can be appropriate for post-hydration UI behavior.

Test:

- loading/unknown state;
- provider timeout or outage;
- identity unavailable;
- assignment consistency across server and client;
- hydration/layout effects;
- data-region host and key type;
- serverless flush/shutdown behavior.

Feature flags are not authorization. Enforce access control independently.

## Local and test overrides

Use the project's existing override mechanism or add a development/test-only provider abstraction. Prevent production activation through environment validation. Tests should cover control, every variant, unknown flag, provider failure, and kill switch.

## Rollout checklist

- Start disabled or at the agreed safe allocation.
- Confirm eligibility and exclusions with known test identities.
- Observe exposure and outcome events in the intended project/environment.
- Reconcile variant counts and check sample-ratio mismatch.
- Monitor errors, latency, support signals, and guardrails.
- Widen only when the prewritten rollout gate passes.
- Document graduation/removal and stale-flag cleanup.

## Security and privacy

- Use the correct project key or server credential for the installed SDK; never guess from variable names.
- Keep management/personal API credentials out of client bundles.
- Minimize person properties and avoid sensitive experiment context.
- Follow the project's consent, retention, and deletion behavior.
- Treat provider dashboards as external systems with least-privilege access.
