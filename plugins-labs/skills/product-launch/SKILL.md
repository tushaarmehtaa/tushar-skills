---
name: product-launch
description: Plan, implement, audit, or review launches with positioning, assets, distribution, conversion, measurement, waitlists, and follow-up. Use when preparing or learning from a product launch.
license: MIT
---

# Product launch

Build a launch around a specific audience, credible claim, working conversion path, and learning loop.

## Choose a mode

- **Strategy:** positioning, audience access, channel choices, timeline, and risks.
- **Implementation:** build only the required site, waitlist, tracking, or launch assets.
- **Audit/dry run:** test readiness, claims, links, conversion, instrumentation, and operations.
- **Postmortem:** explain results, update positioning, and define follow-up experiments.

Scale the artifact to the launch. A small beta does not need a multiweek war room or a large GTM document.

## Workflow

1. Inspect product briefs, site/repository, analytics, waitlist, audience evidence, assets, platform accounts, and prior launches before asking questions.
2. Establish stage, audience, problem, proof, target action, launch date/window, owner, budget, constraints, existing reach, and decision metrics. Ask only for missing inputs that change the plan.
3. Research current alternatives, audience language, communities, channel rules, and relevant calendars from primary or first-party sources where possible. Date platform-sensitive findings. Do not claim knowledge of opaque ranking algorithms.
4. Write plain-language positioning: for whom, what changes, mechanism, why now, and why credible. Remove unsupported claims.
5. Choose a launch type and few channels based on audience access and product fit. For each, state format, owner, timing rationale, response plan, policy constraints, conversion path, and metric.
6. Inventory the smallest asset set needed. Treat landing pages, demos, screenshots, support docs, share artifacts, tracking links, and product changes as dependencies only when the chosen plan requires them.
7. Test the conversion path end to end. If demand capture is required, follow the safe waitlist guidance.
8. Instrument source attribution, activation, conversion, follow-up, and failure states. Define what decision each metric supports and distinguish directional attribution from causal proof.
9. Run a dry launch: links, forms, email delivery, mobile, accessibility, analytics, support, rollback, incident ownership, and platform-policy checks.
10. Operate the launch, then review at an appropriate early window and after enough time for the target behavior to mature.

## Load conditional references

- Read [launch strategy](references/launch-strategy.md) for positioning, channel selection, asset planning, operations, and postmortems.
- Read [waitlist implementation](references/waitlist-implementation.md) only when implementing or auditing signup capture.

References do not determine interaction or output; this file is authoritative.

## Output contract

Return only mode-relevant sections:

- launch context and evidence/assumption ledger;
- positioning and target action;
- channel plan and asset dependencies;
- implementation changes and conversion-path notes;
- measurement and attribution plan;
- dry-run findings, operations, rollback, and owners;
- follow-up schedule or postmortem with decisions.

## Verify

- Audience and channel choices are supported by evidence or labeled assumptions.
- Material claims have proof and current platform rules are sourced/date-stamped.
- Every public link and primary conversion path works in the deployed environment.
- Signup, confirmation, attribution, activation, and failure events are observed.
- Privacy, consent, security, accessibility, and suppression/retention requirements are addressed.
- Owners, incident path, rollback, and follow-up decisions are explicit.
