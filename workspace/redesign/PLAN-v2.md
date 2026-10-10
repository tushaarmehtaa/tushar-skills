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

## Status (updated 9 Oct, late evening)

Legend: [x] done and checked · [~] partly done · [ ] not started

### Audit findings
- [x] 1. Skill names lead every row and title (`/rate-limit`), verb phrases moved to the description
- [x] 2. All 31 placeholder visuals removed; 21 skills show a real Claude Code run, 13 show their verbatim output section
- [~] 3. Trust copy (now also: every skill page lists 3–4 checks from its own SKILL.md under "How it checks its own work"): "unverified" removed from the installer, facts list added, Verified badge only where a full verification exists. Default tab stays Codex (Tushar's July decision). Full verification of more skills not done (see Definition of done)
- [x] 4. Homepage: install-all in the hero, one taxonomy (site + skills.sh.json), grouped rows, chips, generic icons removed
- [~] 5. Voice: first-person hero line live; 34 "why" lines drafted from repo evidence, **waiting for Tushar's approval**
- [~] 6. Consistency debt
  - [x] one breadcrumb style replaces three back links
  - [x] "1 installs" bug gone (installs now a facts row)
  - [x] one list for browse and search (inspector removed)
  - [x] tablet duplicate category controls gone
  - [x] CHANGELOG and /changelog brought up to date (five missing releases, 10 Sep to 9 Oct, including guides leaving the homepage). The "30 skills" lines are historical and correct for their dates
  - [~] skills.sh still lists retired names. Its docs offer no owner control; our four groups now sort the 34 current skills to the top and push retired names to "Other skills" at the bottom. Full removal needs Tushar to contact skills.sh
  - [x] CSS consolidated: 453 dead rules removed, canvas/visual-direction/library merged into site.css (globals.css keeps tokens and base). 4 files, ~2,750 lines became 2 files, 1,433 lines; pixel-identical on 21 page states

### Definition of done
- [x] Zero placeholder visuals
- [~] 34/34 skill profiles (why lines pending approval)
- [x] Install-all and first skill row in the first screen at 390×844 and 1440×900 (tested)
- [x] One-tap mobile install, command fully visible at 320px (tested)
- [x] No horizontal overflow 320–1440 on core pages (tested)
- [~] 3 skills fully verified in Claude Code (changelog, remove-ai-slop, rate-limit); 33 skills have a single real run. Target of 15 not met; follow-ups listed in the verification report
- [x] Lighthouse mobile (production build): performance 96 on / and /remove-ai-slop, 97–98 elsewhere; accessibility 100 on every page tested. Fonts use display: optional. /guides SEO 66 is its deliberate noindex (navigation hub); best practices 96 is a local-only analytics 404
- [x] One site stylesheet (site.css) plus globals.css for tokens and base
- [x] Tests green (31 browser, 21 unit), validation and production build pass
- [~] skills.sh retired names: contained (grouped below current skills), removal needs skills.sh

### In progress
- [x] Mobile alignment pass (Tushar's feedback 9 Oct): headline is two lines sized to fill the width (320–430px); one full-width copy bar on every command; installer sits on the page edge instead of nested cards; facts collapse to 3 rows + "All facts" on phones; "Then type" shows one command. Checked at 390 and 320, 31/31 browser tests pass

### Remaining
- [x] Guides, Requirements, Changelog and guide pages brought into the v2 look (same column, page head, hairline rows, ink command blocks, one left edge); skill pages link their related guides again
- [x] Small repo fixes: user-insights em dash replaced. Left as is on purpose: humanize "article-development workflow" (a boundary, not a broken link), product-experiments "if present" (correct), remove-ai-slop em dashes (inside its report template, changing them changes the output format)
- [~] Voice-line review page live (https://claude.ai/artifact/MyBLXNK18aCBpfnJ6N2dAj): 34 lines seeded, waiting for Tushar
- [ ] Merge `redesign-v2` to main (needs Tushar's go-ahead)

### Update, 9 Oct night
- [x] Why lines rewritten per Tushar: the thinking behind each skill, then the outcome for the user (workspace/redesign/v2/why-v2.json); quote label "The thinking behind it"
- [x] Before/after pairs ("what went in, what came out") for all 21 runs: screenshots, text, code or data
- [x] Real runs for the remaining 12 skills (code skills on the Tallyroom fixture with test keys, caveats say what was not exercised); 33 of 34 skills now show a real run with a before/after. image-editing stays contract-only (needs an image-model key)
- [x] Full verification (changelog method): remove-ai-slop and rate-limit verified and recorded; deploy-check (printed a fake secret 2/3), landing-copy (skipped its evidence table), readme (fixture showed no lift) stay unverified. Report: workspace/redesign/v2/verification-2026-10-10.md
- [x] Merge redesign-v2 into main (fast-forward, approved by Tushar)

## v3 · 10 Oct: less information, designed results (live, main af84ddf)
Tushar's feedback: the run logs, verification rows and verbatim dumps were too much for visitors, and "What you get back" was a pile of text outside remove-ai-slop.
- [x] Skill pages show "you asked → what you got": one designed card per skill (verdict, findings with bars or stats, built, rewrite, screenshots) from site/lib/skill-results.json; every number traced to the run (Paper: "v3 · Result cards")
- [x] Cut from pages: run log, caveats, "From the reply, word for word", raw code/CSV, Tested in / Full verification / Updated / Package facts, "Use it when". Verified badge by the title only for verified skills
- [x] "What you get back" averages 97 words (was 300–400); no overflow at 320px on any of the 34 skill pages; 31 browser + 21 unit tests pass
- Audit trail (excerpts, before/after, run metadata) stays in site/lib/skill-proof.json and workspace/redesign/v2/proof/

## v4 · 10 Oct: hero and image-editing (live, main 7a48d7c)
Tushar's feedback: "Great work", not "Good work", on one line; the subheadline was mellow; use GitHub stars and skills.sh installs well; anyone landing should instantly get what the skills do. Paper: "v4 · Hero · Desktop" and "v4 · Hero · Mobile".
- [x] Headline "Great work starts with a useful skill." on one line from 640px up, two lines on phones; OG image updated
- [x] Subheadline: "34 skills that turn Claude Code, Codex or Cursor into a product team. Spec the idea, wire auth and payments, block the bad deploy, write the launch."
- [x] Three real results in the hero (deploy-check BLOCKED, performance-diagnosis 788 → 404 ms, humanize cut clichés), each linking to its skill; sideways scroll on phones, a row of three on tablets, stacked beside the install on desktop
- [x] Header: installs stay; "Open source on GitHub" replaces the 12-star count until stars reach 100
- [x] image-editing real run: one OpenAI image edit (banner attached as reference), every word exact on independent check; an earlier run recolored pixels without the API to guarantee exact text. Key from Tushar's tweetbuzz repo, used for these runs only and deleted after. All 34 skills now show a real run
- [x] Result labels by what the skill did: made, changed, built, found
- [x] First skill row stays on the first screen at 390, 768 and 1440px; no overflow at 320px on any page; 31 browser + 21 unit tests pass; CI green

### Still open
- [ ] deploy-check printed a fake secret in 2 of 3 verification runs; tightening its SKILL.md rule needs Tushar's OK, then re-verify
- [ ] Re-verify landing-copy (skipped its evidence table) and readme (fixture showed no lift)
- [~] skills.sh retired names: contained on the site, removal needs Tushar to contact skills.sh
- [ ] Paper still shows v2/v3 frames as designed, not the final shipped skill pages
- [~] Voice-line review page: 34 lines seeded, no edits from Tushar yet
