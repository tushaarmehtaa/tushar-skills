---
name: tushar-design
description: Build production-grade frontends in Tushar's personal design system — dark, precise, opinionated. Interactive: asks 4 questions (foundation, accent, typography, motion) before writing any code. Rooted in a real design system derived from real projects, not AI-generated aesthetics. Use when building web components, pages, dashboards, landing pages, or any UI in Tushar's orbit.
license: Complete terms in LICENSE.txt
---

This skill builds production-grade frontends rooted in one specific, proven design system. It is opinionated by default. Before writing any code, ask 4 short questions to configure the system for the project. The output is always a complete, functional implementation — never a mockup, never a wireframe.

---

## Step 1: Ask these 4 questions before touching code

Ask all four in one message. Numbered list per question. Show defaults clearly.

```
Before I build this, 4 quick questions:

1. Foundation — what's the base surface?
   A) Void black (#0a0a0a) — the default. Pure, maximum contrast.
   B) Off-white (#FAFAF7) — warm cream light mode
   C) Warm dark (#110E0B) — dark but brownish, editorial
   D) Cool slate (#0B0F1A) — dark with blue depth
   E) Pure white (#FFFFFF) — clinical, high-structure

2. Accent — one color that pops against your base:
   [show only the accents that harmonize with the chosen foundation — see table below]

3. Typography — pick a pair:
   A) Geist + JetBrains Mono — clean, precise, the default
   B) Instrument Serif + Geist Sans — editorial, luxury
   C) Bricolage Grotesque + JetBrains Mono — bold, expressive
   D) DM Sans + DM Mono — neutral, product-grade
   E) Syne + Space Mono — artistic, unconventional
   F) Plus Jakarta Sans + Fira Code — warm, modern

4. Motion — what level of animation?
   A) Static — no motion, CSS transitions only
   B) Subtle — entrance fades and stagger only
   C) Full — page load orchestration, hover states, scroll triggers
```

---

## Color System

### Foundations

| ID | Name | bg | surface | surface-raised | border | border-hover | text | muted | heading |
|---|---|---|---|---|---|---|---|---|---|
| A | Void Black | `#0a0a0a` | `#111111` | `#181818` | `#262626` | `#3a3a3a` | `#a3a3a3` | `#6b6b6b` | `#FAFAFA` |
| B | Off-white | `#FAFAF7` | `#F0EDE8` | `#E8E4DD` | `#D8D4CE` | `#C0BAB2` | `#3C3A37` | `#7A766F` | `#09090B` |
| C | Warm Dark | `#110E0B` | `#1A1612` | `#221E1A` | `#2E2924` | `#3D3730` | `#B8AFA6` | `#6B6259` | `#FAFAFA` |
| D | Cool Slate | `#0B0F1A` | `#111827` | `#1F2937` | `#374151` | `#4B5563` | `#9CA3AF` | `#6B7280` | `#FAFAFA` |
| E | Pure White | `#FFFFFF` | `#F9F9F9` | `#F0F0F0` | `#E4E4E7` | `#D4D4D8` | `#3F3F46` | `#A1A1AA` | `#09090B` |

### Accents by Foundation Compatibility

| Accent | Hex | Best with | Why |
|---|---|---|---|
| Ember Orange | `#FF5E33` | A, C | The signature. Complementary to teal. Warm-dark's natural pair. |
| Amber Gold | `#E8C547` | A, D | Analogous to orange. Triadic with teal + violet. |
| Teal Jade | `#14B8A6` | A, B, D | Complement to orange/red. Calm authority. |
| Electric Blue | `#3B82F6` | A, D | Monochromatic with slate. Trust signal. |
| Coral Rose | `#F43F5E` | B, E | Warm accent for light modes. Bold on white. |
| Sage Emerald | `#10B981` | B, C, E | Growth, calm. Works light or warm dark. |
| Deep Violet | `#8B5CF6` | A, D | Split complement to yellow. Premium, creative. |
| Sand Nude | `#C4A882` | B, C | Muted, editorial. Warmth without saturation. |

**Rule:** One accent only. It appears on: active states, `::selection`, hover border lifts, icon buttons, and key data points. Nowhere else. The primary CTA is never the accent.

---

## Typography Pairings

| ID | Display | Body | Mono | Source |
|---|---|---|---|---|
| A | Geist Sans 600–700 | Geist Sans 400 | JetBrains Mono | `@fontsource/geist` |
| B | Instrument Serif | Geist Sans | JetBrains Mono | Google Fonts |
| C | Bricolage Grotesque 700 | Bricolage Grotesque 400 | JetBrains Mono | Google Fonts |
| D | DM Sans 600 | DM Sans 400 | DM Mono | Google Fonts |
| E | Syne 700–800 | Syne 400 | Space Mono | Google Fonts |
| F | Plus Jakarta Sans 600 | Plus Jakarta Sans 400 | Fira Code | Google Fonts |

**Typography rules — always apply regardless of pairing:**
- Display/h1: `letter-spacing: -0.02em; line-height: 1.1`
- Body: `line-height: 1.7; font-size: 15px`
- Labels: `font-family: mono; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted)`
- `webkit-font-smoothing: antialiased` always
- `font-feature-settings: "ss01" on, "cv01" on` when using Geist

---

## Component Contracts

These are non-negotiable. Every component adapts to the chosen foundation and accent but must match these structural patterns.

### Card
```css
border: 1px solid var(--border);
background: var(--surface);
border-radius: 12px;
padding: 20px 24px;
transition: border-color 150ms ease;
&:hover { border-color: var(--border-hover); }
```

### Primary CTA
```css
/* White on dark, black on light. NEVER the accent color. */
background: var(--heading);
color: var(--bg);
border-radius: 8px;
padding: 10px 18px;
font-size: 14px;
font-weight: 500;
transition: opacity 120ms ease;
&:hover { opacity: 0.9; }
```

### Secondary CTA
```css
border: 1px solid var(--border-hover);
color: var(--text);
border-radius: 8px;
padding: 10px 18px;
font-size: 14px;
background: transparent;
transition: color 120ms ease, border-color 120ms ease;
&:hover { color: var(--heading); border-color: var(--text); }
```

### Label / Section header
```css
font-family: var(--font-mono);
font-size: 11px;
text-transform: uppercase;
letter-spacing: 0.12em;
color: var(--muted);
margin-bottom: 24px;
```

### Badge / Pill
```css
display: inline-flex; align-items: center; gap: 6px;
border-radius: 9999px;
border: 1px solid var(--border-hover);
padding: 4px 10px;
font-size: 11px;
color: var(--text);
```

### Input (underline style)
```css
border: none;
border-bottom: 1px solid var(--border);
background: transparent;
outline: none;
padding: 8px 0;
color: var(--heading);
font-size: 15px;
transition: border-color 150ms ease;
&:focus { border-color: var(--heading); }
```

---

## Signature Details (hardcoded, non-negotiable)

These apply regardless of what foundation/accent/font the user chooses:

```css
/* Selection always uses accent */
::selection {
  background: color-mix(in srgb, var(--accent) 25%, transparent);
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 4px; }

/* Font rendering */
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
```

---

## Layout System

- Content max-width: `max-w-2xl` (640px). Wide layouts: `max-w-5xl`
- Page padding: `px-6 py-12 sm:py-16`
- Section spacing: `mb-16` minimum, `mb-28` for major breaks
- Card grid gap: `gap-4`
- Borders do all layout separation — no box-shadows as dividers

---

## Motion Contract

### Default entrance
```js
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
```

### Staggered list
```js
// Parent
variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
initial="hidden" whileInView="visible" viewport={{ once: true }}

// Child
variants={{
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
}}
```

### Always include reduced motion fallback
```js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// If true: skip y transform, keep opacity fade only
```

- **Static**: No Framer Motion. CSS `transition: opacity 200ms ease` only.
- **Subtle**: Entrances + stagger only. No scroll-triggered parallax.
- **Full**: Page load orchestration, hover states, `whileInView` on all sections.

---

## UX Laws Applied

| Law | How it's applied |
|---|---|
| **Hick's Law** | Max 4 nav items. Max 3 primary CTAs per page. Limit visible choices. |
| **Fitts's Law** | Primary CTAs min 44px tall. Clickable areas include padding, not just text. |
| **Miller's Law** | No list exceeds 7 items without grouping. Nav max 5 items. |
| **Law of Proximity** | Related elements share a container or consistent gap. Unrelated = 2× the gap. |
| **Aesthetic-Usability Effect** | Polish is not decoration. Visual quality increases perceived usability. |
| **Jakob's Law** | Familiar patterns for nav, forms, CTAs. Novelty goes in visual treatment, not interaction model. |
| **Law of Common Region** | Use `border` + `background` to group — not whitespace alone. |
| **Serial Position Effect** | Most important item is first or last. Never buried in the middle. |

---

## Logo Sourcing

| Type | Source | Display style |
|---|---|---|
| Company/tool SVG | `simple-icons` library | `rounded-[3px] bg-white/90 p-0.5` |
| Org favicon | `https://www.google.com/s2/favicons?domain=DOMAIN&sz=64` | `rounded-[3px] bg-white/90 p-0.5` |
| Person avatar | `https://github.com/USERNAME.png` | `rounded-full` |

Never use placeholder images or random CDN URLs for brand assets.

---

## Copy Voice

Self-audit every line of copy before output. If it fails any rule, rewrite it.

- Lowercase by default on UI labels, CTAs, taglines
- Specific over vague: "20 free credits. no card." not "try for free."
- CTAs follow `verb + object →` format: "start building →", "pick and post"
- No hedging: never "might", "could potentially", "you may find that"
- Section headers are fragments: "how it works", "what you get"
- Feature descriptions: 1–2 sentences max. Ends when the point is made.
- No summary paragraphs. Copy doesn't recap what was just said.
- Footer always includes: "built by @[handle]"
- No em dashes. Use a period or rewrite the sentence.
- No empty adjectives: powerful, seamless, robust, comprehensive, cutting-edge are banned.

---

## CSS Variables Output Template

After the user answers the 4 questions, open every implementation with this block:

```css
:root {
  --bg: [foundation bg];
  --surface: [foundation surface];
  --surface-raised: [foundation surface-raised];
  --border: [foundation border];
  --border-hover: [foundation border-hover];
  --text: [foundation text];
  --muted: [foundation muted];
  --heading: [foundation heading];

  --accent: [accent hex];
  --accent-dim: color-mix(in srgb, var(--accent) 18%, transparent);

  --font-sans: '[body font]', system-ui, sans-serif;
  --font-display: '[display font]', sans-serif;
  --font-mono: '[mono font]', monospace;

  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 18px;
  --text-h1: clamp(2rem, 4.8vw, 3.1rem);

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Definition of Done

A complete output from this skill:
- All 4 config questions answered and applied
- Full working code — functional, not a mockup
- CSS variables block at the top using the template above
- Custom scrollbar + `::selection` always present
- `webkit-font-smoothing: antialiased` present
- Motion matches chosen level, with `prefers-reduced-motion` fallback
- Copy follows voice rules — every line self-audited
- Primary CTA is heading-color (white/black), never the accent
- Logo assets from correct sources — no placeholder images

If scope is large, ask which section to build first. Never deliver a partial implementation without flagging it.
