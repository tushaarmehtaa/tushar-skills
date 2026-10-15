# Buildable technical specification

Adapt this reference to the existing architecture and selected mode. It is not a default stack recommendation or a mandatory interview.

## Contents

- [Architecture fit](#architecture-fit)
- [Flows and states](#flows-and-states)
- [Data and authorization](#data-and-authorization)
- [Interfaces and background work](#interfaces-and-background-work)
- [Non-functional requirements](#non-functional-requirements)
- [Delivery and rollout](#delivery-and-rollout)
- [Acceptance and verification](#acceptance-and-verification)

## Architecture fit

Document the relevant current state before proposing change:

- component/service boundaries and owners;
- frameworks, persistence, auth, queues, analytics, deployment;
- existing conventions and reusable modules;
- known constraints, debt, and incompatible assumptions;
- build-versus-buy decision and reversibility where relevant.

Prefer the smallest change consistent with the product outcome and operating risk. Do not introduce a fashionable stack to a working repository without evidence.

## Flows and states

For each user/system flow, specify:

| Step | Actor | Preconditions | Action/system behavior | State/result | Failure/recovery |
|---|---|---|---|---|---|

Consider first use, repeat use, empty, loading, validation, permission denied, conflict, timeout, partial failure, cancellation, retry, success, deletion, and support recovery as applicable.

## Data and authorization

For each entity:

- purpose and owner/tenant;
- identifiers and relationships;
- lifecycle and allowed state transitions;
- required/optional fields and constraints;
- source of truth and derived fields;
- retention, deletion, export, and audit needs;
- migration/backfill and compatibility;
- authorization matrix by actor and operation.

Address idempotency, unique constraints, concurrency, ordering, and transaction boundaries where multiple writes or retries can occur.

## Interfaces and background work

For each API, event, job, or integration, define:

- caller/consumer and authorization;
- input/output schema and versioning;
- validation and stable error contract;
- idempotency/retry/timeout behavior;
- rate and size limits;
- observability and privacy classification;
- dependency failure and recovery;
- compatibility/deprecation policy.

Use concrete endpoints only when the architecture calls for them. UI routes are not a substitute for state and permission requirements.

## Non-functional requirements

Include proportional requirements for:

- security and abuse prevention;
- privacy, consent, retention, and deletion;
- accessibility and responsive/input behavior;
- performance budgets and service objectives;
- reliability, backups, and disaster recovery;
- analytics and auditability;
- support and operational ownership;
- cost limits and capacity.

Mark what is required for launch, what can be monitored, and what is explicitly deferred with risk accepted.

## Delivery and rollout

Use vertical slices:

```text
user outcome
→ flow and states
→ data/interface changes
→ implementation boundary
→ acceptance criteria
→ verification evidence
```

For live changes, define feature gating, migration order, backward compatibility, canary population, monitoring, rollback trigger, backout steps, and stale-code/data cleanup.

The solo-MVP modifier may constrain time and staffing, but it does not remove mandatory security, data integrity, or accessibility work.

## Acceptance and verification

Write acceptance criteria as observable behavior under explicit conditions. Cover happy path, permission, validation, dependency failure, concurrency/idempotency, accessibility, observability, migration, and rollback as risk requires.

Specify verification method and environment:

- unit/property tests for invariants;
- integration/contract tests for boundaries;
- end-to-end tests for value paths;
- migration rehearsal and reconciliation;
- security/privacy/accessibility checks;
- load/performance tests where thresholds matter;
- deployed smoke tests and telemetry confirmation.
