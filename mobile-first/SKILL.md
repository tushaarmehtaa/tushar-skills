---
name: mobile-first
description: Audit and repair responsive interfaces from measured narrow-screen evidence without changing product intent. Use when a page clips, overflows, stacks poorly, or fails on touch.
license: MIT
---

# Mobile first

Make the primary task usable on narrow, zoomed, touch, keyboard, and reduced-motion presentations. Reconsider layout relationships when width changes; do not merely shrink the desktop composition or optimize for the shortest possible page.

## Own responsive behavior, not the product

This skill owns viewport-dependent layout, reflow, overflow, touch ergonomics, focus visibility, mobile navigation behavior, and responsive verification.

It does not rewrite the proposition, remove product requirements, invent a mobile-only conversion funnel, or replace the project's visual system. Use `landing-page` or `interface-design` first when the underlying information architecture or interface job is wrong.

## Choose the mode

- **Audit** — measure and report without changing files.
- **Repair** — measure, implement the smallest coherent responsive changes, then compare.
- **Build** — apply the responsive contract while creating a new interface; there is no before-state baseline.
- **Handoff** — provide sequenced, independently executable change briefs when the user asks another person or agent to implement.

Infer the mode from the request and state it in one sentence. A request to fix or build authorizes in-scope implementation; do not stop at prompts unless handoff was requested.

## Inspect before choosing a transform

Read the repository's instructions, layout primitives, tokens, breakpoints, navigation, content extremes, browser tests, and supported device requirements. Render the current interface when possible.

For an existing interface, read [references/audit.md](references/audit.md) and record the baseline before editing. Page height is diagnostic context, not a target: a shorter page can be worse when it hides comparison, proof, controls, or recovery paths.

## Resolve consequential choices interactively

Most responsive repairs are reversible; make them without interrogation. Ask only when two plausible layouts materially change content order, navigation access, comparison behavior, or the primary action.

When blocked, present the observed constraint, a recommended option, and one alternative with its tradeoff. Ask one concise question. Examples include whether dense data must remain comparable, whether a persistent action is a real product requirement, or which content owns priority when two desktop columns cannot remain simultaneous.

Do not ask the user to choose breakpoints, CSS properties, or implementation details the repository can answer.

## Choose layout from the content relationship

Read [references/patterns.md](references/patterns.md) when a desktop primitive fails narrowly. Decide per component:

- Preserve sequence when items must be read in order.
- Preserve comparison when differences matter simultaneously.
- Preserve access to navigation and primary actions without making every action sticky.
- Use a contained horizontal region only when the content genuinely benefits from two-dimensional or browseable presentation.
- Keep reading content within the viewport; never let an intentional table or carousel expand the document.

Breakpoints belong where content or controls stop working, not at arbitrary device labels. Reuse existing breakpoints when they solve the observed failure.

## Implement within the existing system

- Prefer intrinsic sizing, wrapping, grid `minmax(0, 1fr)`, flex children with `min-width: 0`, and content-driven constraints before adding breakpoints.
- Preserve semantic order even when visual order changes.
- Keep focus order aligned with reading and interaction order.
- Give custom controls a practical touch target while applying WCAG size and spacing exceptions correctly.
- Contain tables, diagrams, and carousels in named, keyboard-reachable scroll regions when horizontal scrolling is necessary.
- Account for safe areas and obscured focus when controls are fixed or sticky.
- Choose `svh`, `dvh`, or ordinary document flow from the intended behavior; do not mechanically replace every `vh` declaration.
- Provide a complete static state for reduced-motion users rather than merely shortening animations.

Do not add a carousel, hamburger, bottom CTA bar, or mobile-only content duplication as a default. Each needs a content or product reason.

## Verify the outcome

Read [references/standards.md](references/standards.md) before making a compliance claim. After implementation:

1. Re-run the baseline measurements at 320px, 375px, 768px, and 1440px where supported.
2. Test 200% zoom and the 320 CSS-pixel reflow condition; use 400% zoom when validating WCAG reflow on a 1280px-wide presentation.
3. Exercise keyboard navigation, visible focus, touch controls, orientation changes, text enlargement, and reduced motion.
4. Test realistic long labels, localization expansion, error states, open menus, dialogs, and software-keyboard behavior where relevant.
5. Check a real phone when browser chrome, safe areas, input keyboards, or installed-web-app behavior could change the result.
6. Run the repository's build, tests, and browser checks.

## Deliver

For an audit, provide the measurement table, ranked findings, preserved strengths, and sequenced repairs without editing files.

For a repair or build, report:

- the observed failures and chosen responsive transformations;
- files changed and meaningful product tradeoffs;
- before/after measurements where a baseline existed;
- widths, zoom levels, states, inputs, and motion preferences tested;
- real-device or production checks that remain.

Do not claim “mobile complete” from a single screenshot or the absence of document overflow.
