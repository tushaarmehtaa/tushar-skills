---
name: landing-page
description: Design, build, audit, or repair evidence-led landing pages by coordinating message, proof, structure, interface, and verification. Use when a marketing page must perform a clear job.
license: MIT
---

# Landing page

Produce a coherent marketing page for one audience and one primary decision. Own the page-level argument: what the visitor must understand, believe, and do. Preserve the product's existing brand and implementation system unless evidence supports changing them.

## Keep the boundary clear

This skill coordinates a landing-page outcome without replacing specialist work:

- Use the `landing-copy` skill when the core problem is positioning, claims, proof, objections, or CTA language.
- Use the `interface-design` skill when the core problem is a broader design system, application workflow, or component implementation.
- Use the `mobile-first` skill for a measured responsive audit or repair after the page structure is sound.
- Use `performance-diagnosis`, `social-sharing`, or `remove-ai-slop` when those are the actual requested outcomes.

When a specialist skill is unavailable, handle the necessary portion here, but do not pretend to have verified evidence you could not inspect.

## Choose the working mode

Infer the narrowest mode from the request and existing project:

- **Build** — create and implement a new page or substantial section.
- **Repair** — change an existing page whose message, structure, proof, or conversion path is underperforming.
- **Audit** — return evidence-backed findings without changing files.
- **Handoff** — produce an implementation brief or sequenced prompts because another person or agent will execute the work.

State the selected mode and scope in one sentence. Do not offer the modes as a menu.

## Recover evidence before asking

Inspect the supplied brief, repository, live page, analytics, search data, customer language, product states, existing brand tokens, and reference sites that are in scope. Separate observed facts from assumptions.

Resolve these decisions from evidence when possible:

- the visitor, their entry context, and the job they are trying to complete;
- the single primary action and any legitimate secondary path;
- the differentiated claim and the proof available to support it;
- implementation constraints, visual system, and required states;
- how success will be measured after release.

Ask only about missing choices that materially change the result. Batch at most three short questions. Typical blockers are an unknown primary action, contradictory reference directions, or permission to replace a consequential conversion flow. Continue with labeled assumptions when the choice is reversible.

## Build the page argument

Read [references/architecture.md](references/architecture.md) when choosing the page shape, section order, or proof. Write a compact page brief before implementation:

1. **Visitor:** who arrives and what they already know.
2. **Decision:** the primary action and the commitment it requires.
3. **Claim:** a specific, defensible reason to choose this product now.
4. **Proof:** the strongest available evidence and its provenance.
5. **Objections:** the few uncertainties that genuinely block the decision.
6. **Measurement:** the event or outcome that would show the page is working.

If the claim or proof is missing, do not compensate with decorative design or invented evidence. Surface the gap and either request the missing input or build an honest lower-commitment page.

## Compose, do not fill a template

Choose sections because each advances the visitor's decision. A useful sequence often moves from orientation to evidence to objection resolution to action, but the evidence determines the order.

- Put the product and its consequence in the first viewport; avoid category-only headlines.
- Repeat the primary action where renewed intent makes sense, not at a fixed interval.
- Treat screenshots, demos, samples, comparisons, customer evidence, and operational details as proof with different strengths.
- Use real product content and realistic extremes. Label fixtures and never present them as customer evidence.
- Preserve one clear action hierarchy. Secondary links may support evaluation without competing visually with the primary action.
- Let content determine layout. Do not require cards, gradients, display fonts, animation, or a particular radius system.

## Implement within the project

Reuse sound components, tokens, assets, routing, analytics, and test conventions. Do not install a new framework or motion library only to achieve a landing-page style.

Build meaningful states: narrow and wide layouts, loading or unavailable product evidence where relevant, form success and failure, keyboard focus, reduced motion, and long copy. Protect personal information and secrets in screenshots or fixtures.

When the work changes an existing funnel, preserve event semantics or document the migration. Never infer deployment, experiment launch, paid traffic changes, or production publication from authorization to edit the page.

## Audit and verify

Read [references/review.md](references/review.md) for audit criteria and the output contract. Read [references/evidence.md](references/evidence.md) before asserting standards, performance thresholds, or conversion research.

For implemented work:

1. Run the repository's build, typecheck, lint, and relevant tests.
2. Render representative narrow, tablet, and desktop widths plus 200% zoom.
3. Exercise the primary action, forms, errors, navigation, and keyboard path.
4. Verify claims, links, analytics events, metadata, share previews, and page performance proportionally to risk.
5. Compare the result with the brief and report observed gaps rather than declaring success from section presence.

## Deliver

Return the implemented page or requested artifact, then summarize:

- the visitor, decision, claim, and proof used;
- material structure and design decisions;
- what was changed and directly verified;
- assumptions, missing evidence, and production work still requiring authorization;
- the post-release measurement plan.

In audit mode, change nothing. Rank findings by their effect on comprehension, trust, action, accessibility, and performance, then recommend the smallest coherent repair.
