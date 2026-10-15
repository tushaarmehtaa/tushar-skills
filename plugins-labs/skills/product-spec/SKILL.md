---
name: product-spec
description: Create or audit product briefs and buildable specs covering scope, flows, data, permissions, rollout, and acceptance. Use when planning a new product or a change before implementation.
license: MIT
---

# Product specification

Move from a product decision to an implementable, testable change. Do not manufacture technical detail before the audience, problem, and scope are credible.

## Choose a mode

- **Brief:** clarify audience, trigger, problem, promise, smallest value path, and exclusions.
- **Greenfield buildable spec:** define a new v1 and its operating boundary.
- **Change spec:** fit a feature or behavior change into an existing product and architecture.
- **Audit:** find contradictions, missing states, untestable requirements, and infeasible scope.
- **Solo-MVP modifier:** constrain to a short, one-person build only when that is the actual goal.

Do not automatically prepend a brief to an audit or a sufficiently grounded change spec.

## Workflow

1. Read research, conversation context, decisions, existing specs, repository, architecture, constraints, and conventions. Ask only blocking questions.
2. Separate facts, observations, assumptions, decisions, and open questions.
3. Define target user or role, triggering situation, current workaround, desired outcome, product promise, and mechanism. Use a real person only when it improves evidence; do not force one where role/context is the correct unit.
4. Draw the boundary: included capabilities, exclusions, dependencies, success signals, and smallest end-to-end path that proves value.
5. Map primary, alternate, and failure flows: first use, empty, loading, offline/timeout, permission, validation, conflict, error, success, cancellation, recovery, and deletion where relevant.
6. For technical work, inspect the existing stack before proposing architecture. Define entities and lifecycle, ownership, authorization, APIs/routes, integrations, background work, idempotency/concurrency, migrations, privacy/security, accessibility, observability, performance/SLOs, and operational needs in proportion to risk.
7. Split delivery into vertical slices that each produce a testable user outcome. Trace each outcome through flow/state, data/API change, acceptance criterion, and verification.
8. Define rollout, compatibility, migration/backfill, kill/rollback, and cleanup when modifying a live system.
9. Record decisions, risks, confidence, unresolved questions, and owners. Never bury uncertainty inside confident requirements.

## Load conditional references

- Read [product brief](references/product-brief.md) only for brief mode or when product framing is genuinely incomplete.
- Read [technical specification](references/technical-spec.md) for greenfield, change-spec, or technical-audit detail.

References provide templates and prompts, not mandatory interviews. This file is authoritative.

## Output contract

For a brief, return audience/trigger, problem/evidence, promise/mechanism, smallest value path, scope, exclusions, success signals, assumptions, and open questions.

For a buildable or change spec, add flows/states, architecture fit, data and authorization, interfaces, non-functional requirements, rollout/migration, vertical slices, acceptance criteria, verification, risks, and decisions. For an audit, return findings with evidence, impact, and required correction rather than silently rewriting product intent.

## Verify

- Scope traces to a stated user outcome and evidence.
- Facts, assumptions, decisions, and open questions are distinguishable.
- Primary and failure states are covered.
- Data ownership and authorization are explicit.
- Interfaces and acceptance criteria are testable.
- Migration, compatibility, observability, security/privacy, and rollback are addressed proportionally.
- Every delivery slice yields a verifiable user outcome.
