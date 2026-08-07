---
name: remove-ai-slop
description: Audit and remove AI-like design and copy defaults using rendered evidence and confidence scoring. Use when reviewing an interface for generic or repetitive patterns.
license: MIT
---

Audit the actual interface, not just a list of fashionable motifs. Remove unmistakable defaults forcefully. Judge softer patterns by whether they fit the product, content, and brand or merely repeat a learned template.

Never turn the cleanup into another house style. Do not make every interface flat, dark, minimally rounded, or monochrome by default.

## Use three verdicts

### HARD BAN

Use this only for exact unfinished-copy, semantic-duplication, consequential-ambiguity, fabricated-evidence, or similarly objective definitions below. One confirmed occurrence is enough. Visual taste, common components, geometry, fonts, and decorative motifs do not qualify by themselves.

Use this verdict:

> **HARD BAN — [pattern]. [Why it fails]. Remove it. [Repair direction].**

Allow only the narrow semantic exceptions listed with that pattern. “It is a brand choice” is not evidence by itself.

### STRONG PRESUMPTION

Use this for patterns that can work but usually read as defaults when unsupported or repeated. Require a concrete product, content, functional, or documented brand reason to keep one.

Use this verdict:

> **STRONG PRESUMPTION — [pattern] reads as a reused default because [evidence]. Keep it only if [specific purpose]; otherwise [repair].**

### CONTEXTUAL SIGNAL

Use this for neutral design or copy vocabulary that becomes slop only through repetition, mismatch, co-occurrence, or dominance. Do not report an isolated low-confidence motif as a defect.

Keep accessibility, semantics, performance, and factual-integrity defects in a separate `QUALITY DEFECTS` section. They matter, but they are not proof of AI authorship.

## Phase 1: Establish context

Choose an audit scope before inventorying the repository:

- **Focused** — one route, component family, flow, or reported pattern. Inspect every meaningful state inside that boundary.
- **Representative** — the default for a product-wide review. Sample each distinct page role, shared chrome, major component system, and high-risk flow; include enough routes to test convergence without rendering every sibling page.
- **Exhaustive** — every in-scope route, locale, channel, and meaningful state. Use when the user explicitly requests full coverage or when regulated, release-blocking, or migration work justifies the cost.

Infer the narrowest sufficient scope from the request and repository. State inclusions, exclusions, sampling rationale, and unavailable states. Expand only when a finding may originate in a shared source or when the requested confidence requires it.

Read repository evidence before judging taste:

- Read the README, product brief, design documentation, route structure, existing copy, design tokens, font setup, logo, and first-party assets.
- Identify the product, audience, primary task, intended tone, and meaningful brand constraints. Mark missing information `unknown`; do not invent a brand story.
- Assign each route a job such as marketing, pricing, docs, dashboard, settings, onboarding, or account management.
- Record the primary action and content shape for each route.
- Separate shared navigation and footer chrome from page-specific composition when comparing routes.

Discover relevant source without truncating the selected scope:

```bash
rg --files \
  -g '*.{tsx,jsx,ts,js,css,scss,sass,less,html,vue,svelte,astro,md,mdx,json,yaml,yml}' \
  -g '!node_modules/**' -g '!.next/**' -g '!dist/**' -g '!build/**'
```

Include theme files, component-library overrides, content files, and asset manifests that influence the selected scope. Use dependency and route structure to avoid unrelated application code.

## Phase 2: Inspect rendered output

Run the existing application when the repository provides a safe development command. In focused mode, capture every meaningful in-scope state. In representative mode, capture each distinct page role and shared system at viewports and states that can reveal the suspected issue. In exhaustive mode, use a route/state matrix and record coverage.

For each rendered finding, record:

- Route, viewport, and state
- Screenshot or precise rendered description
- Source file and line
- Computed style or component evidence where useful

If rendering is unavailable, label appearance-dependent findings:

> **CANDIDATE — render confirmation unavailable.**

Do not claim visual dominance, hierarchy failure, or poor composition from a class name alone.

## Phase 3: Find high-confidence defects and defaults

### 1. Ornamental bold all-caps eyebrows

Treat an eyebrow as a strong presumption when a short label immediately above an H1 or H2:

- Uses uppercase text or `text-transform: uppercase`
- Uses weight 600+, high contrast, accent color, wide tracking, a dot, or a decorative rule to manufacture importance
- Adds no information beyond the heading, route, or surrounding navigation

Treat labels such as `FEATURES`, `WHY US`, `OUR PLATFORM`, `MANUAL PAGE`, and `INTRODUCING` as decorative candidates when they merely announce the content below. Repetition, visual dominance, or conflict with the established hierarchy raises confidence; one occurrence alone does not prove a system-level problem.

Allow only real, non-redundant status or operational metadata such as `LIVE`, `ERROR`, `BETA`, a permission state, or a version. Do not flag natural acronyms.

Default verdict:

> **STRONG PRESUMPTION — Ornamental all-caps eyebrow. It appears to add emphasis without information because [evidence]. Remove or reduce it unless it performs a documented navigation, status, or brand role.**

### 2. Incoherent or misused fonts

Report typography as a quality defect when legibility or semantic consistency fails, and as a strong presumption of template assembly when any of these is true without a supported role:

- Three or more visible type families appear without explicit, stable roles
- The same semantic role changes family between components or routes
- A component introduces a one-off font outside the design tokens
- Serif, italic, mono, script, or display type decorates an isolated word without meaning
- A novelty, condensed, script, or display face is used for paragraphs, navigation, controls, tables, or dense product UI

Allow wordmarks, real code or terminal content, mathematical notation, and language-specific fallbacks when scoped to that content.

Default verdict:

> **STRONG PRESUMPTION — Incoherent type system. These font changes have no stable role in the inspected system. Consolidate them into explicit roles unless product or language evidence explains the variation.**

Repair with one family or an intentional pair plus optional mono. Define roles as tokens. Do not automatically replace everything with Inter or Geist.

### 3. Generic rounded or pill buttons

Treat a button as a strong presumption of starter styling when either condition is true and rendered evidence shows it conflicts with the product's action hierarchy:

- An ordinary text CTA uses capsule geometry such as `rounded-full`, `9999px`, or a computed radius at least half its height
- An action retains an unmodified starter-library recipe: generic radius, stock padding, solid fill, white label, and default hover/focus treatment, with no meaningful hierarchy or product character

Allow actual chips, tags, filter tokens, segmented controls, toggles, and circular icon-only controls. An ordinary CTA does not become a chip because it is small.

Default verdict:

> **STRONG PRESUMPTION — Generic rounded/pill CTA. Its geometry and state treatment repeat an unmodified starter pattern and do not express this product's action hierarchy. Redesign the action system unless the pattern is established and functional here.**

Repair primary, secondary, destructive, and quiet actions as one system. Choose geometry, typography, borders or fills, icon treatment, focus, hover, pressed, loading, and disabled states from the product’s visual language. Do not replace every pill with the same stock 8px black rectangle.

### 4. Other high-confidence findings

- Fake terminal chrome, decorative shimmer, animated-gradient borders, routine confetti, and emoji navigation are strong presumptions when they do not fit product subject, state, frequency, or established brand.
- Unsupported stat banners and invented or misleading charts are claim-integrity defects. Report them under `QUALITY DEFECTS`, regardless of whether their visual style looks generated.

Confirm appearance-dependent findings in the render. Cite the exact role, repetition, mismatch, or integrity rule that failed; “ugly font” and “boring button” are not findings.

## Phase 4: Find contextual slop

Treat these as strong presumptions when repeated across unrelated page roles or unsupported by repo evidence. Otherwise score them as contextual signals.

### Layout and component signals

- Centered badge or pill → oversized H1 → two CTAs → three equal feature cards
- Uniform three-column icon, heading, and body cards regardless of content type
- Numbered `01 / 02 / 03` steps used for content that is not sequential
- Bento layouts that flatten unrelated ideas into decorative tiles
- Nested cards and forced equal heights for unequal content
- Four equal footer columns regardless of information architecture
- Full-viewport hero with a vague headline and no product evidence
- Generic offset composition used only to look editorial
- One card component or data schema forced onto three or more semantic roles
- `rounded-2xl`, identical borders, or identical shadows applied to nearly every surface
- Rounded-square icon tiles above every feature heading
- Default shadcn or starter-kit styling left unmodified

### Color and effect signals

- Purple-to-blue, indigo-to-pink, or similar default gradient dominating the hero or CTA
- Gradient text on the primary headline
- Grid or dot backgrounds used as generic technology texture
- Warm amber and cream, safe emerald, or lavender used without product or brand justification
- Competing accent colors without semantic roles
- Grain, ambient spotlights, glow, glass, stripes, and decorative pseudo-elements
- Three or more decorative effects stacked in one region
- Low-contrast gray text on dark backgrounds; report this separately as a quality defect when contrast fails

### Typography signals

- Inter, Geist, Space Grotesk, or Instrument Serif chosen by default rather than for product fit
- Space Grotesk and Instrument Serif paired as a fashionable shortcut
- Monospace used for ordinary prose
- Hero type that consumes the viewport without earning that emphasis
- Italic serif applied to one hero word as decoration
- All-caps labels repeated across every section
- Flat hierarchy or too many competing display styles

Do not flag a common font merely for being common. Flag the absence of intentional roles, fit, and hierarchy.

### Motion signals

- Bounce or elastic easing on routine controls
- Staggered fade-in applied to every section or list
- Load animation on content that needs no temporal explanation
- Generic image hover scale or rotation
- Animation of width, height, padding, or margin
- Missing `prefers-reduced-motion`; report this as a quality defect

### Imagery and data signals

- Abstract 3D blobs, orbs, brains, or neural networks used as generic AI product imagery
- Generic team-at-laptop stock photography
- Smooth, symmetrical AI illustration that does not match the product’s subject
- The same image reused for unrelated claims or routes
- Screenshots that hide the actual product behind decorative framing
- Charts with implausible data, unsuitable chart type, missing axes or units, illegible labels, inaccessible color coding, or no stated takeaway

## Phase 5: Measure convergence and fit

Audit the distribution of decisions across the codebase, not only individual elements.

- Compare route anatomy: landmark order, hero structure, section sequence, component tree, layout primitives, and recurring class bundles.
- Exclude shared chrome before judging page similarity.
- Flag high structural similarity between semantically different routes.
- Count repeated motif combinations, not just individual tokens.
- Check whether unrelated content is forced through the same `icon + title + description` or card schema.
- Check whether the same radius, shadow, accent, and type treatment appears on every surface role.
- Compare asset reuse with the meaning of each page.
- Preserve cohesion between same-role pages while demanding adaptation between different roles.

Judge page-role fit explicitly:

- Marketing pages need a specific proposition and product evidence.
- Pricing pages need comparison and decision support.
- Dashboards need task density, state, and information hierarchy.
- Documentation needs navigation, sequence, and readable examples.
- Settings need clarity, consequences, and safe actions.

Score every non-hard design candidate with this transparent heuristic:

- `+2` repeated across three or more distinct contexts
- `+2` conflicts with the page job, content shape, or documented brand
- `+2` visually dominates the rendered page
- `+1` co-occurs with two or more other generic defaults
- `+1` harms comprehension or action hierarchy
- `-2` has a concrete functional or brand justification supported by evidence

Use the score as guidance, not fake science:

- `5+`: `HIGH` confidence; recommend removal or redesign
- `3–4`: `MEDIUM` confidence; report as a strong presumption with the missing justification
- `≤2`: `LOW` confidence; omit from defects or list only as an observation

Hard bans bypass this score once their exact criteria are confirmed.

## Phase 6: Audit copy

Audit marketing copy and in-product language as a system. Flag usage, not innocent substrings, quotations, product names, code examples, legal text, or necessary technical language.

### Build a copy manifest

Define the in-scope surfaces, channels, flows, routes, locales, and states before extraction. Report anything unavailable instead of implying complete coverage.

Extract user-facing strings from markup, component props, constants, locale files, CMS fixtures, toasts, errors, empty states, loading states, dialogs, forms, emails, and notifications.

Record for each string:

- Surface or channel, flow, optional route, page role, component, and UI state
- Source file and line
- Rendered text after interpolation when available
- Locale, message ID, interpolation variables, plural or select branches, and fallback when applicable
- Accessible name, alt text, validation role, or other non-visible purpose when applicable
- Both the unique source decision and every rendered instance created by a shared component
- Actual action, destination, system state, or claim provenance for consequential copy and material claims; use `N/A` elsewhere

Exclude tests, logs, localization keys without rendered values, quoted or code samples not presented as product communication, and deliberately labelled templates. Keep real documentation prose in scope. Keep shared navigation in the terminology audit but exclude it from cross-route convergence counts.

### Find hard copy slop

Use `HARD BAN` only when the exact definition is satisfied. Phrase shape alone is not proof. Treat a hard copy ban as a mandatory removal verdict, not proof that AI authored the text.

#### 1. User-facing scaffolding

Ban `Lorem ipsum`, `TODO`, `Feature 1`, `Your headline here`, explicitly placeholder or confirmed fictional testimonials, and other scaffolding exposed as finished product copy. Mark testimonials with missing provenance `UNVERIFIED`; do not call them fictional without evidence. Allow clearly labelled demos, templates, and documentation examples.

> **HARD BAN — User-facing placeholder copy. This is scaffolding, not product communication. Remove it; replace it with verified content or omit the block.**

#### 2. Content-free narration or cadence

Ban an opener, transition, or marketing construction when deleting it loses no claim, instruction, scope, navigation, reassurance, safety cue, accessibility purpose, intentional voice, or meaningful contrast. This includes empty uses of:

- “In today’s fast-paced world,” “Let’s dive in,” or “Here’s the kicker”
- “It’s not about X, it’s about Y” or “This doesn’t just X — it also Y”
- “No X. No Y. Just Z,” “From X to Y,” or clipped triples such as “Fast. Simple. Powerful.”

Do not ban a construction that communicates concrete facts. “No setup. No credit card. Just paste the URL.” is specific; “No friction. No limits. Just growth.” is not.

> **HARD BAN — Content-free copy. “[quote]” performs rhetoric without adding information. Remove it; begin with the first substantive claim.**

#### 3. Exact semantic duplication

Ban copy visible in the same rendered state when it repeats the same proposition without adding a mechanism, detail, implication, proof, decision, or next action. Do not count responsive alternatives, mutually exclusive states, accessibility-only equivalents, or genuine synthesis in long-form documentation.

> **HARD BAN — Semantic duplicate. “[quote]” repeats [earlier copy] without adding information. Delete it or replace it with the missing detail.**

#### 4. Ambiguous consequential copy

Ban `Submit`, `OK`, `Confirm`, or `Continue` as the sole label for payment, deletion, publication, permission, account, or other consequential actions. Ban “Something went wrong,” “Success!”, or “No data” as the entire message when the user needs the affected object, result, or recovery action.

Allow conventional `Back`, `Close`, `Done`, `Retry`, and `Continue` when the surrounding flow makes their consequence unambiguous and low-risk.

> **HARD BAN — Ambiguous consequential copy. “[quote]” hides what will happen or what just happened. Name the action and object, result, or safe recovery path.**

### Separate claim and state integrity

Report these under `QUALITY DEFECTS`, not as evidence of AI authorship:

- Fabricated or unverified statistics, testimonials, rankings, certifications, logos, or customer counts
- Unsupported comparative, absolute, security, privacy, reliability, or performance claims
- Error causes the system does not actually know
- Progress text that claims measurement the system does not have
- Success copy displayed before the operation is confirmed
- Terminology or action labels that contradict actual product behavior

Do not call proof fabricated merely because its source is absent from the repository. Mark it `UNVERIFIED`, request provenance, and remove it only when disproven or left unsupported.

### Find strong presumptions

Treat these as strong presumptions when repo evidence does not supply the missing substance:

- A complete hero message that fails to establish what the product does, for whom, or why it matters
- “Unlock value,” “elevate your workflow,” “chaos into clarity,” “scale without limits,” or similar abstraction without a named task, mechanism, constraint, or outcome
- Empty puffery such as world-class, best-in-class, battle-tested, revolutionary, intelligent, or AI-powered
- Generic CTA text whose destination or result remains unclear in context
- Rhetorical questions, canned contrasts, transformation headlines, or noun-swapped feature descriptions repeated across unrelated routes
- A benefit-first formula imposed on every feature while hiding the actual capability
- A sudden faux-casual, cute, grandiose, or hyper-technical voice unsupported by surrounding copy
- A recap that adds too little to justify its space but is not an exact duplicate

### Keep contextual signals contextual

Treat individual vocabulary hits, em dashes, fragments, rhetorical questions, contractions, sentence-initial “And” or “But,” passive voice, jargon, humor, emoji, summaries, and benefit-first or feature-first ordering as contextual signals.

Preserve hedges that communicate real uncertainty, probability, scope, capability, risk, legal qualification, or time range. Remove only evasive throat-clearing. Treat seamless, robust, powerful, cutting-edge, innovative, leverage, elevate, empower, unlock, harness, supercharge, craft, delve, tapestry, and synergy as search leads, never automatic defects.

### Measure copy convergence and specificity

Compare copy across routes and components using:

- Exact and near-duplicate wording
- Repeated sentence skeletons after replacing product nouns, numbers, and names with slots
- Repeated headline formulas, CTA verbs, contrast structures, fragments, tricolons, em dashes, and rhetorical questions
- Reused section anatomy such as eyebrow → imperative heading → one-sentence promise → CTA
- Terminology drift: multiple names or verbs for the same domain object or action
- Shared marketing voice leaking into dashboards, errors, settings, or destructive flows

Preserve coherence between same-role pages. Flag the same sales template appearing across pricing, documentation, onboarding, settings, and product UI.

Use four tests:

1. **Deletion:** Does removing the text lose meaningful information or action?
2. **Three-product swap:** Could three unrelated products use it unchanged?
3. **Proof:** Does each material claim map to a capability, constraint, measurement, source, or verified outcome?
4. **State:** Does the text match what the system knows, what happened, and what the user can do?

Judge material propositions as message blocks, not isolated sentences. Look for enough concrete anchors among the actor, action, domain object, mechanism, constraint, and observable result. Do not require every label or sentence to contain all of them.

### Judge voice, page role, and UI state

Infer voice from product documentation, customer language, and strong existing examples. Record formality, warmth, directness, technical density, person, contractions, casing, punctuation, and preferred terminology. Preserve coherent voice while allowing tone to become calmer and more precise in high-stakes contexts.

Match copy to its job:

- Marketing: audience, proposition, mechanism, evidence, and next action
- Pricing: real distinctions, costs, limits, billing terms, and decision support
- Documentation: prerequisites, outcome, sequence, and accurate examples
- Dashboard and settings: current state, task, consequence, and save status rather than slogans
- Onboarding and account flows: next useful action, recovery, and security consequences

Build a state matrix for meaningful flows: initial, first-use empty, filtered-zero, permission-limited, loading, populated, disabled, error, success, and confirmation. State a cause only when known. Name destructive objects and reversibility. Do not force every empty state into “No X yet — create your first X.”

### Score contextual copy

- `+2` repeated across three or more unrelated contexts
- `+2` conflicts with the page role or UI-state job
- `+2` fails product specificity at the message-block level
- `+1` repeats stock syntax or cadence alongside other generic defaults
- `+1` breaks established voice, terminology, or action clarity
- `-2` has documented voice, functional, customer-language, or same-role justification

Use `5+` as `HIGH`, `3–4` as `MEDIUM`, and `≤2` as `LOW`. Hard bans and integrity defects bypass this score.

### Repair copy without inventing it

- Delete filler and exact duplication.
- Replace abstract claims with verified domain nouns, user actions, mechanisms, constraints, or outcomes appropriate to the message block.
- Narrow or remove unsupported claims. If required facts are missing, mark the proposed fix `BLOCKED — CONTENT REQUIRED` instead of inventing metrics, capabilities, or proof.
- Name consequential actions and objects. For errors, state impact and recovery; include cause only when known and useful.
- Distinguish empty-state types and write only the guidance each state needs.
- Preserve calibrated uncertainty, necessary technical terms, conventional controls, and intentional voice.
- Check neighboring copy so a local rewrite does not create terminology or tone drift.
- Avoid replacing AI hype with a uniform terse, blunt, faux-minimal house voice.

## Phase 7: Report findings and fixes

Stop before editing. Lead with a prioritized summary ranked by user impact, frequency, confidence, and repair cost. In focused work, report all in-scope findings. In representative or exhaustive work, group repeated source decisions so the report does not duplicate the same repair for every rendered instance. Use these sections when applicable:

```text
COPY MANIFEST COVERAGE
Scope: [surfaces, routes, channels, locales, states]
Unavailable: [anything not inspected]
Unique source decisions: [count]  Rendered instances: [count]
Baseline: [hard bans, unverified claims, convergence clusters]

HARD SLOP — REMOVE
H1. [route, file:line] — [pattern]
    Before: [exact original]
    After: [verified replacement, deletion, or BLOCKED — CONTENT REQUIRED]
    Evidence: [exact code plus rendered evidence]
    Why it fails: [specific diagnosis]
    Verdict: Remove it.

CONTEXTUAL SLOP
C1. [route, file:line] — [pattern, score, HIGH or MEDIUM confidence]
    Verdict: [STRONG PRESUMPTION, CONTEXTUAL SIGNAL, or CANDIDATE]
    Before: [exact original]
    After: [product-specific repair or BLOCKED — CONTENT REQUIRED]
    Evidence: [repetition, mismatch, co-occurrence, render or copy manifest]

COPY CONVERGENCE
CC1. [convergence type and normalized pattern or term, score, confidence]
     Instances: [routes, states, files, and exact excerpts]
     Impact: [how unrelated jobs were flattened or terminology drifted]
     Repair: [which source decisions change and which terminology stays]
     Why it fails: [unrelated jobs forced through one voice or template]

QUALITY DEFECTS
Q1. [route, file:line] — [accessibility, semantics, performance, claim, or state-integrity issue]
    Evidence: [code, behavior, source, or contradiction]
    Impact: [user, trust, task, or compliance consequence]
    Provenance: [verified, unverified, contradicted, or not applicable]
    Recommendation: [repair, provenance request, or blocked status]

DECISIONS TO PRESERVE
P1. [element] — [why it is intentional, specific, and effective]
```

Critique the artifact, not its author. Be direct about objective hard slop: write “This placeholder is exposed as finished copy. Remove it,” not “You may want to consider refining it.” For visual defaults, state the rendered evidence and confidence rather than presenting taste as fact.

For every actionable source decision, show the exact before and after when the replacement can be grounded in repository evidence. When content or product intent is missing, state the required decision instead of generating speculative alternatives. Use real product copy and existing tokens rather than placeholders. Ground rewritten claims in cited repository evidence. Treat `UNVERIFIED` and `BLOCKED — CONTENT REQUIRED` as report-only statuses; never write them into user-facing copy. When rendering is available, compare the same route, viewport, state, data, and animation setting.

Do not use canonical replacements such as flat black, one accent, 8px radii, a two-column list, uniformly terse prose, or default casual voice unless the product evidence supports them. State the intended design or copy job first, then propose the smallest repair that performs it.

## Phase 8: Confirm and apply

Enter this phase only when the user requested implementation or asks to continue after a diagnosis. For diagnosis-only work, return the prioritized report, verification limits, and an optional one-line offer to apply fixes; do not manufacture an approval gate.

When implementation is in scope, after showing proposed source changes or a prioritized first batch, exclude report-only and blocked items from the actionable count, then ask:

> **Ready to apply [X] fixes. Any to skip?**
> Reply with fix IDs to skip, or say “go” to apply all.

Wait for approval. Apply only approved changes. Preserve unrelated code and intentional decisions recorded under `DECISIONS TO PRESERVE`.

## Phase 9: Verify

After editing:

1. Run the project’s relevant build, typecheck, lint, and tests.
2. Re-render the same routes, viewports, states, and data.
3. Confirm each hard-ban pattern is actually gone, not merely renamed.
4. Confirm type roles and button states form coherent systems.
5. Check hierarchy, overflow, contrast, focus, semantics, and reduced motion.
6. Re-run the route comparison and confirm unlike page roles no longer share a thoughtless template.
7. Confirm the repair did not replace one cliché with another.
8. Re-extract the copy manifest and confirm all hard-ban counts reach zero.
9. Re-run copy clustering and confirm unlike page roles diverge while terminology remains coherent.
10. Verify every material claim is sourced, scoped, narrowed, marked `UNVERIFIED`, or removed.
11. Re-test action labels, interpolation, pluralization, localization, overflow, and every meaningful UI state.
12. Read key flows aloud and confirm the cleanup did not impose one terse or faux-conversational house voice.

Call the work clean only when strong shared foundations coexist with page-specific structure, the product’s identity is visible in its decisions, and no hard slop remains.
