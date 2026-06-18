---
name: remove-ai-slop
description: Audit a codebase or document for AI slop tells in design and copy. Identifies generic patterns that make AI-built work look AI-built, shows before/after for every fix, then applies only what you approve.
category: workflow
tags: [design, copy, audit, refactor, quality]
author: tushaarmehtaa
---

AI tools converge on the same patterns. Same gradients, same words, same structure. This skill finds every instance, shows you exactly what changes, and waits for your go-ahead before touching anything.

---

## Phase 1: Read what exists

```bash
# Find files to audit
find . -name "*.tsx" -o -name "*.css" -o -name "*.scss" -o -name "*.md" -o -name "*.html" | grep -v node_modules | grep -v .next | head -60
```

Read the markup, styles, and copy in full. Do not skim. Open every file that could contain design or copy.

---

## Phase 2: Audit

Work through every checklist item. For each match, record:
- The file path and line number
- The exact offending code or text
- Which pattern it matches

### Layout tells
- [ ] Centered hero with a badge/pill/chip floating above the H1
- [ ] Three-column feature card grid (`grid-cols-3`) with uniform height and rounded corners
- [ ] Icon + heading + body card repeated 3–6 times
- [ ] Numbered steps section (1. Install → 2. Configure → 3. Ship) or `01` `02` `03` section labels
- [ ] Stat banner (3 numbers in a row, no supporting context)
- [ ] Footer with 4 equal columns
- [ ] Bento grid with 5+ different accent colors
- [ ] Nested cards (card-inside-card creating visual noise)
- [ ] Cards with identical heights forced rather than flowing to content
- [ ] Hero section occupying full viewport with vague headline

### Color tells
- [ ] Purple-to-blue or indigo-to-pink gradient in the hero, CTA, or background
- [ ] "VibeCode purple" — lavender/violet as the sole brand accent
- [ ] Warm amber-and-cream used as "tasteful" default without brand justification
- [ ] Two competing accent colors (e.g. cyan for info + amber for action)
- [ ] Gradient text (`background-clip: text`) on hero headings
- [ ] Low-contrast gray body text on dark backgrounds
- [ ] Safe emerald green as default "clean" accent

### Effect tells
- [ ] Grain texture overlay (`::before` or `body::after`)
- [ ] Stage-light / ambient spotlight overlay (radial gradient on body)
- [ ] Shimmer pseudo-element on cards (`::after` sliding highlight)
- [ ] Glow on borders, rules, or headings (`box-shadow`, `text-shadow` as decoration)
- [ ] Animated gradient border
- [ ] Fake blinking cursor keyframe
- [ ] Glassmorphism — `backdrop-filter: blur` on cards used decoratively
- [ ] Repeating-gradient stripes as surface decoration
- [ ] Dark glowing gradients behind hero cards or CTA buttons

### Typography tells
- [ ] Inter, Geist, Space Grotesk, or Instrument Serif used as the only font (no intentional pairing choice)
- [ ] Space Grotesk + Instrument Serif combo specifically
- [ ] Monospace font on body text (not just code blocks)
- [ ] Oversized hero headline consuming full viewport width
- [ ] Italic serif on a single hero word as "accent"
- [ ] `> ` prefix on headings (terminal-line aesthetic)
- [ ] `MANUAL PAGE` or similar meta-label above the heading
- [ ] All-caps section labels on every section
- [ ] Uppercase eyebrow label with decorative dots or trailing lines
- [ ] Flat type hierarchy — font sizes too close together, no clear jump

### Component tells
- [ ] Colored left border on every card (left-border-as-accent)
- [ ] Colored top border on cards
- [ ] `rounded-2xl` (24px+) applied uniformly to everything
- [ ] `rounded-full` on non-pill elements
- [ ] 8px uniform card shadow on every surface
- [ ] Emoji icons in sidebar navigation or feature lists
- [ ] shadcn/ui defaults leaking through without customization (default slate colors, default ring styles)
- [ ] Icon tile (rounded-square container) above every feature card heading

### Animation/motion tells
- [ ] Bounce or elastic easing on UI elements (`cubic-bezier` with overshoot)
- [ ] Staggered fade-in entrance on every section (generic `opacity: 0 → 1` with delay)
- [ ] Load animations on elements that don't need them
- [ ] Image hover scale or rotate transform
- [ ] Animating `width`, `height`, `padding`, or `margin` (causes layout thrash)
- [ ] No `prefers-reduced-motion` fallback anywhere

### Imagery tells
- [ ] Abstract 3D blobs or orbs floating in hero section
- [ ] Brain/neural network as hero illustration (AI product cliché)
- [ ] Stock photos of diverse teams looking at laptops in well-lit offices
- [ ] AI illustrations that are "slightly too smooth, slightly too symmetrical"

---

### Copy tells

**Banned words** — remove on sight:

*Empty adjectives:* seamless, robust, comprehensive, powerful, cutting-edge, next-generation, world-class, best-in-class, state-of-the-art, groundbreaking, innovative, revolutionary, stellar, formidable, compelling, engaging, captivating, marvelous, paramount, crucial, fantastic

*AI vocab spikes:* delve, leverage, elevate, intricate, meticulously, synergy, empower, tapestry, testament, beacon, realm, symphony, vibrant, nestled, renowned, showcasing, underscore, hone, unveil, unravel, harness, foster, navigate, tackle, catapult, supercharge, unleash, unlock, craft (used as vague verb)

*Marketing verbs:* exceed, game-changer, boasts, committed to, moves the needle, secret sauce, magic (used in product copy)

**Banned phrases** — rewrite or cut:
- "In today's landscape" / "In today's fast-paced world" / "In a world where"
- "At the end of the day"
- "It's worth noting that" / "Worth mentioning"
- "This doesn't just X — it also Y" (defensive framing)
- "It's not about X, it's about Y"
- "No X. No Y. Just Z." (triple-structure marketing cadence)
- "Chaos into clarity" or any "X into Y" transformation cliché
- "The part everyone gets wrong" / "What most people miss"
- "Built from production usage" / "Battle-tested"
- "Let's dive in" / "Ever wondered" / "Here's the kicker"
- "Build the future of work" / "Your all-in-one platform" / "Scale without limits"
- "Drive impact" / "Unlock value" / "Elevate your [noun]"
- Any sentence starting with "This skill reads your..." / "This tool analyzes your..."
- "However," / "Furthermore," / "Additionally," / "That being said,"
- Summary paragraphs that restate what was just said
- Two-word phrases repeated 2–3 times consecutively for rhythm

**Structural slop:**
- [ ] Opener that narrates what's about to be said instead of saying it
- [ ] Hedge words: arguably, fairly, might want to consider, could potentially, may help you
- [ ] Em dashes used more than twice per screen of text
- [ ] Sentences that back away from their own claim ("it's arguably one of the better...")
- [ ] Feature described by what it IS, not what it DOES
- [ ] Any headline vague enough to describe 3+ different products

---

## Phase 3: Report findings

Stop. Do not make any changes yet.

Present a numbered list of every issue found:

```
Found X issues:

DESIGN
1. [file:line] — [pattern name]: [exact code snippet]
2. [file:line] — [pattern name]: [exact code snippet]
...

COPY
7. [file:line] — [pattern name]: "[exact offending text]"
8. [file:line] — [pattern name]: "[exact offending text]"
...
```

Be specific. Show the actual code or text, not a description of it.

---

## Phase 4: Before/after preview

For each issue, show exactly what would change:

```
Fix 1 — globals.css:14
BEFORE: background: linear-gradient(135deg, #6366f1, #8b5cf6);
AFTER:  background: #1a1a1a;
Reason: purple gradient is the single most recognizable AI design tell

Fix 7 — hero.tsx:23
BEFORE: "Seamlessly integrate your workflow and unlock unprecedented productivity"
AFTER:  "Connect [tool A] to [tool B] in one step"
Reason: "seamlessly" + "unlock" + "unprecedented" all on banned list; replaced with specific claim
```

Work through every fix. Show all of them before asking for confirmation.

---

## Phase 5: Confirm

After showing all before/afters, ask:

> **Ready to apply [X] fixes. Any to skip?**
> Reply with fix numbers to skip (e.g. "skip 3, 7") or just say "go" to apply all.

Wait for the response. Do not apply anything until you have it.

---

## Phase 6: Apply fixes

Apply only the approved fixes. Make changes precisely — do not modify surrounding code or introduce new patterns.

For design fixes:
- Replace dual accent with one. Keep the one used in the most important CTA.
- Replace gradient hero background with flat dark or single color.
- Remove all decorative `::before` / `::after` overlays. If deleting the CSS rule leaves nothing broken, delete it.
- Replace `rounded-2xl` uniformity with intentional radius: 3–4px on small elements, 8px on panels, 0 on large containers.
- Replace three-column grid with a list or two-column layout if the content doesn't actually need three columns.
- Remove bounce/elastic easing. Replace with `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`.
- Remove staggered fade-ins. If animation is needed, use one — not one per element.

For copy fixes:
- If the opener narrates → delete it, start with the second sentence.
- If the sentence hedges → remove the hedge. If the claim breaks without it, make it specific enough to stand alone.
- If an adjective is empty → replace with a measurement or delete it. "Robust error handling" → "catches and surfaces every Stripe webhook failure."
- If a phrase is banned → cut it. The sentence almost always improves.
- If the section ends with a summary → delete the summary.

---

## Phase 7: Verify

After changes:

1. Read copy out loud. If you'd feel embarrassed saying it to someone → still slop.
2. Count accent colors in CSS. More than one needs a reason.
3. Count decorative pseudo-elements. Each one needs a reason.
4. Run: `grep -r "seamless\|robust\|leverage\|delve\|tapestry\|supercharge\|unleash\|harness\|elevate\|paramount" .`
5. Read the hero. If it could describe three different products → not specific enough.
6. Check motion: `grep -r "cubic-bezier\|bounce\|elastic\|stagger" .`

---

## What clean looks like

**Copy is clean when:**
- Each sentence makes exactly one claim
- Every adjective could be replaced by a measurement
- The opener is the thing, not a description of the thing
- A reader can't tell whether a human or machine wrote it

**Design is clean when:**
- One accent color, used sparingly
- No CSS rule exists purely for decoration
- Removing any visual layer doesn't reduce information
- The layout follows content structure, not a template
- No component pattern requires explanation to justify its existence
