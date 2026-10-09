# Slashskills v2 plan — approved 9 October 2026

Source audit: https://claude.ai/artifact/PW89wA4nYaDYLG5873JhXF (private to Tushar).

## Decisions (Tushar, 9 Oct)

1. **Taxonomy:** Shape / Build / Ship / Grow everywhere, including `skills.sh.json`.
2. **Voice:** Claude drafts "why I made this" and "skip it when" for all 34 skills; Tushar edits or approves before anything ships in his voice.
3. **Proof:** real Claude Code runs on fixture projects for skills that need no outside accounts. Skills that need Dodo, Supabase, Resend or Upstash show their SKILL.md output contract verbatim, labelled as the format.
4. **Look:** keep the light Geist/sage system. Change hierarchy, content and voice, not the palette.

## Definition of done

- Zero placeholder visuals. No "Illustrative concept" captions.
- 34/34 skills: name-first title (`/slug`), outcome line, use-when and skip-when lines, "what you get back" block (real run or verbatim contract), facts list, next skill in the workflow.
- Install-all command and first skill row in the first screen at 390×844 and 1440×900.
- Mobile install is one tap; the command is fully visible at 320px.
- No horizontal overflow at 320, 375, 390, 768, 1024, 1440.
- ≥15 skills verified in Claude Code, recorded in `runtime-verification.json` with the method used for `changelog`.
- Lighthouse mobile ≥95 performance and accessibility; full keyboard journey; reduced motion respected.
- One CSS file replaces `globals.css` + `canvas.css` + `visual-direction.css` layering. Tests green, build passes.
- skills.sh listing cleared of retired names.

## Taste guardrails (from RESUME.md)

No uppercase eyebrows, no logo dot, no "menu+", no ambiguous input-like headings, no oversized mobile rows, no decorative wasted space. Mobile is designed on its own, not shrunk.

## Tracks (parallel)

1. **Paper design** — new page in the existing Paper file; old 61 frames stay as history.
2. **Content** — per-skill fields drafted for review in one table.
3. **Proof runs** — fixture projects, real runs, captured output, verification records.
4. **Code** — components (skill row, inline installer with Command/Prompt and remembered agent, facts list, output block), cleanup list, CSS consolidation, tests.

## Gates

1. Decisions — done 9 Oct.
2. Paper frames for home + two skill pages, desktop and mobile — Tushar reviews before code.
3. Coded journey on a Vercel preview — Tushar checks on his phone.
4. Content table approved; proof assets in.
5. Full rollout, cleanup, CSS consolidation, full QA — ship to main.

## Git

Work happens on `redesign-v2`. Baseline commit = the redesign worktree as of 9 Oct (excluding `workspace/seo-newsroom/`). Main and the live site stay untouched until gate 5.
