---
name: humanize
description: Edit or audit prose for generic AI patterns while preserving voice, meaning, uncertainty, and format. Use when writing sounds synthetic, repetitive, over-polished, or unlike its author.
license: MIT
---

# Humanize

Make prose sound like its author writing clearly, not like a different fashionable voice. Remove generic model habits only when the text supplies evidence for the edit. Preserve facts, calibrated uncertainty, technical terms, personality, and the register required by the format.

## Keep the boundary clear

Use this skill for voice preservation and synthetic-writing patterns.

- Use `landing-copy`, `cold-outreach`, `readme`, or `ui-copy` when the primary job is creating or correcting that format's substance.
- Use `remove-ai-slop` for rendered interface patterns and cross-route design convergence.
- Use an article-development workflow when the argument, reporting, or structure needs major editorial work before a prose pass.

A request to “humanize,” “de-slop,” preserve voice, or detect AI-like patterns belongs here. A generic “make this better” should stay with the format-specific skill unless the evidence shows voice is the main problem.

## Choose the mode

- **Edit** — return revised prose while preserving the author's position and factual meaning.
- **Detect** — identify checkable patterns and explain their effect without rewriting.
- **Calibrate** — derive a compact voice profile from supplied samples for a later or included edit.

Infer the mode and state it briefly. Do not claim that a detector can determine who or what wrote the text, and do not output an “AI percentage.”

## Establish the writing contract

Read the full draft before changing sentences. Determine:

- audience, format, and intended reader action or belief;
- point of view, vocabulary, cadence, humor, formality, and recurring intentional habits;
- statements that carry facts, uncertainty, legal scope, attribution, or personal experience;
- passages that already sound specific and alive.

Infer the voice from a substantial mixed-quality draft. If the text is almost entirely synthetic and the user explicitly wants their personal voice, ask for one representative sample in a single concise question. If they only want clearer prose, proceed in an appropriate neutral register and say that no personal voice sample was available.

Never ask for a sample merely to avoid editing.

## Diagnose before rewriting

Read [references/patterns.md](references/patterns.md) for the evidence tiers. Separate findings into:

- **Substantive defects:** unsupported claims, invented evidence, semantic ambiguity, missing attribution, or lost qualification.
- **High-confidence defaults:** language that adds no information or disguises the actual claim.
- **Contextual patterns:** ordinary devices that become generic only through repetition, mismatch, or dominance.

Do not treat punctuation, vocabulary, sentence length, active voice, fragments, jargon, lists, or rhetorical questions as proof in isolation.

## Edit proportionally

1. Preserve strong human passages and exact useful details.
2. Remove empty setup, duplicated meaning, unsupported importance, and placeholder scaffolding.
3. Replace vague abstraction with a concrete statement only when the draft contains that information.
4. Vary sentence shape only when the existing cadence is monotonous; do not manufacture decorative variation.
5. Keep passive voice when the actor is unknown, irrelevant, deliberately de-emphasized, or conventional for the format.
6. Protect hedges that express real uncertainty or scope.
7. Read [references/formats.md](references/formats.md) and adapt the pass to the deliverable.

Never invent a statistic, example, quotation, source, opinion, anecdote, or product capability to make a sentence more vivid.

## Resolve consequential edits interactively

Make ordinary style edits without asking. Pause or mark `Needs you` when a proposed change would alter the author's stance, remove a real qualification, choose between conflicting voice samples, or require a fact the draft does not supply.

When the missing choice blocks the whole edit, ask one question with a recommended interpretation. Otherwise complete the safe edit and isolate the unresolved passages.

## Output

Adapt the output to the size and mode.

For edit mode:

1. Return the complete edited draft without inline commentary.
2. Add a short `What changed` section grouped by material pattern or structural decision.
3. Add `Preserved` when naming deliberate voice choices helps the user trust the edit.
4. Add `Needs you` only for unresolved facts, claims, or voice decisions.

For a one-line or very short edit, return the edit and one sentence of rationale; do not force four empty sections.

For detect mode, list the pattern, exact excerpt, evidence tier, consequence, and repair direction. Also identify specific passages that already work. Do not rewrite unless requested.

## Verify

Read [references/evaluation.md](references/evaluation.md) before returning substantial work. Confirm that:

- the author would recognize the position and voice;
- factual meaning and calibrated uncertainty survived;
- the amount changed matches the evidence;
- the revision does not install uniform staccato, corporate polish, or a terse personal house style;
- the result works in its actual format when read aloud or exercised in context.
