---
name: product-spec
description: Turn an idea into a clear brief and buildable v1 specification with scope, flows, data, routes, risks, and acceptance criteria. Use when planning before implementation.
license: MIT
---

# Product specification

Move from an idea to a product decision and then to an implementable v1. Do not manufacture technical detail before the audience, problem, and scope are credible.

## Choose the depth

- **Brief:** clarify the audience, problem, promise, v1 boundary, and exclusions.
- **Buildable spec:** add flows, states, data model, routes, integrations, risks, milestones, and acceptance criteria.
- **Audit:** find contradictions, missing states, vague requirements, and scope that cannot fit the stated constraints.

## Workflow

1. Read existing research, conversation context, code, constraints, and decisions. Do not ask the user to repeat known information.
2. State the target user and triggering situation precisely. Separate observed evidence from assumptions.
3. Define the problem, current workaround, desired outcome, product promise, and why the proposed mechanism can produce it.
4. Draw the v1 boundary. List included capabilities, explicit exclusions, success signals, and the smallest end-to-end path that proves value.
5. Map primary and failure flows, including first use, empty, loading, permission, validation, error, success, cancellation, and recovery states.
6. For a technical spec, inspect the existing stack before choosing architecture. Define entities, ownership, permissions, routes or endpoints, integrations, background work, and operational needs.
7. Split delivery into vertical slices that each produce a testable user outcome. Add acceptance criteria and proportional verification.
8. Record open questions, risks, reversibility, and decisions that require the user. Never bury uncertainty inside confident requirements.

## Load deeper guidance

- Read [product brief](references/product-brief.md) for the lightweight clarification interview and one-page output.
- Read [technical spec](references/technical-spec.md) for detailed MVP scope, data model, routes, pages, and stack planning.

## Output

Return a concise product brief followed by the technical specification only when requested or justified. Keep facts, assumptions, decisions, and open questions visibly separate.
