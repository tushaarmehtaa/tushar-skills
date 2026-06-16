---
name: remove-ai-slop
description: Audit a codebase or document for AI slop tells in design and copy. Identifies generic patterns that make AI-built work look AI-built, then rewrites or refactors them out.
category: workflow
tags: [design, copy, audit, refactor, quality]
author: tushaarmehtaa
---

AI tools converge on the same patterns. Same gradients, same words, same structure. The output is technically correct and visually unremarkable. This skill finds and removes those patterns.

Run it on a landing page, a marketing site, a skill description, or any copy-heavy file.

## Phase 1: Read what exists

```bash
# Identify files to audit
find . -name "*.tsx" -o -name "*.css" -o -name "*.md" | head -40
cat globals.css 2>/dev/null
cat page.tsx 2>/dev/null
```

Read the markup, styles, and copy in full. Do not skim.

## Phase 2: Design audit

Work through this checklist. Flag every match.

### Layout tells
- [ ] Centered hero with a badge/pill/chip floating above the H1
- [ ] Three-column feature card grid (`grid-cols-3`) with uniform rounded corners
- [ ] Icon + heading + body card repeated 3–6 times
- [ ] Numbered steps section (1. Install → 2. Configure → 3. Ship)
- [ ] Stat banner (3 numbers in a row, no context)
- [ ] Footer with 4 equal columns

### Color tells
- [ ] Purple-to-blue or indigo-to-pink gradient in the hero or CTA
- [ ] Two accent colors (e.g. cyan for info + amber for action)
- [ ] Gradient text animation (`background-clip: text`)
- [ ] Low-contrast body text on a dark background
- [ ] Lavender/purple as the only accent

### Effect tells
- [ ] Grain texture overlay (`::before` or `body::after`)
- [ ] Stage-light / ambient spotlight overlay (radial gradient on body)
- [ ] Shimmer pseudo-element on cards or panels (`::after` sliding highlight)
- [ ] Glow on borders, rules, or headings (`box-shadow`, `text-shadow`)
- [ ] Gradient border animation
- [ ] Fake blinking cursor (`cursor-blink` keyframe)

### Typography tells
- [ ] `> ` prefix on headings (terminal-line aesthetic)
- [ ] `MANUAL PAGE` or similar meta-label above the heading
- [ ] Serif italics used as accent words inline
- [ ] Monospace font on body text (not just code)
- [ ] Space Grotesk + Instrument Serif combo
- [ ] All-caps section labels on every section

### Component tells
- [ ] Colored left border on every card (left-border-as-accent pattern)
- [ ] Emoji icons in sidebar or feature list
- [ ] `rounded-2xl` applied uniformly to everything
- [ ] 8px uniform card shadow on every surface

## Phase 3: Copy audit

### Banned words
Remove on sight. They add zero information:

**Empty adjectives:** seamless, robust, comprehensive, powerful, cutting-edge, next-generation, world-class, best-in-class, state-of-the-art, groundbreaking, innovative, revolutionary

**AI vocab spikes:** delve, leverage, elevate, intricate, meticulously, synergy, empower, tapestry, testament, beacon, realm, symphony, vibrant, nestled, renowned, showcasing, underscore

**Marketing verbs:** unlock, unleash, supercharge, exceed, game-changer, boasts, committed to

### Banned phrases
- "In today's landscape" / "In today's fast-paced world"
- "At the end of the day"
- "It's worth noting that" / "Worth mentioning"
- "This doesn't just X — it also Y" (defensive framing)
- "The part everyone gets wrong" / "What most people miss"
- "Built from production usage" / "Battle-tested"
- Any sentence that starts with "This skill reads your..."
- "However," / "Furthermore," / "Additionally," / "That being said,"
- Summary paragraphs that restate what the previous paragraph just said

### Structural slop
- [ ] Opener that narrates what's about to be said instead of saying it
- [ ] Hedge words: arguably, fairly, might want to consider, could potentially
- [ ] Em dashes every 50–80 words (more than 2 in a screen of text = AI-paced)
- [ ] Sentences that back away from their own point ("it's arguably one of the better...")
- [ ] Description that says what a feature IS without saying what it DOES

## Phase 4: Fix

For each flagged item, apply the simplest fix that removes the pattern.

### Design fixes
- Replace dual accent with one. Pick the one that appears in your most important CTA.
- Replace gradient hero background with flat dark or single color.
- Remove all decorative `::before` / `::after` overlays. If you can delete the CSS rule and nothing breaks visually, delete it.
- Replace grain/stage-light with nothing. Empty space reads as confidence.
- Replace `rounded-2xl` uniformity with intentional radius: tight (3–4px) on small elements, loose (8px) on panels, zero on large containers.
- Replace three-column grid with a simple list or two-column layout if content doesn't actually need three columns.

### Copy fixes
- If the opener narrates → delete the opener and start with the second sentence.
- If the sentence hedges → remove the hedge word. If the claim breaks without it, make the claim specific enough to stand.
- If an adjective is empty → replace with a specific measurement or delete it. "Robust error handling" → "catches and surfaces every Stripe webhook failure."
- If a phrase is on the banned list → rewrite or cut. Usually the sentence improves when the phrase is cut entirely.
- If the section ends with a summary → delete the summary. Readers can read.

## Phase 5: Verify

After changes:

1. Read the copy out loud. If you'd feel embarrassed saying it to someone → it's still AI slop.
2. Count accent colors in the CSS. More than one needs a reason.
3. Count decorative pseudo-elements. Each one needs a reason.
4. Search for banned words: `grep -r "seamless\|robust\|leverage\|delve\|tapestry" .`
5. Read the hero copy. If it could describe three different products → it's not specific enough.

## What "clean" looks like

Copy is clean when:
- Each sentence makes exactly one claim
- Every adjective could be replaced by a measurement
- The opener is the thing, not a description of the thing
- A reader can't tell whether a human or machine wrote it (the goal is indistinguishability, not "sounds human")

Design is clean when:
- One accent color, used sparingly
- No CSS rule exists purely for decoration
- Removing any visual layer doesn't reduce information
- The layout follows content structure, not a template
