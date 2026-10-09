# Resume here — 6 October 2026

> **Shipped, 10 October 2026:** v2 is merged to main and live. Status checklist and open follow-ups: [PLAN-v2.md](PLAN-v2.md). Verification report: [v2/verification-2026-10-10.md](v2/verification-2026-10-10.md).
>
> **Superseded direction, 9 October 2026:** read [PLAN-v2.md](PLAN-v2.md) first. The audit and Tushar's four decisions there (Shape/Build/Ship/Grow, drafted voice lines, real runs, keep the look) now set the direction. Work continues on the `redesign-v2` branch. The notes below remain useful history and constraints.

## Current status: paused for continuity, design NOT approved

User asked to save progress locally with checkpoints and memory. Do not interpret earlier “finalized” documents as current approval. The user rejected the implemented visual catalog as inconsistent/overwhelming (three illustrated skills, generic icons for the rest), then said it lacked typography, hierarchy, personality and emphasis. A sidebar/single-list revision is running locally, but the subsequent feedback still questioned the experience and effort. We acknowledged that reactive layout changes were not solving the underlying product experience.

Latest unresolved phrase: “what we were trying to do with God” may be a transcription error. We asked what it referred to; no answer yet. Do not invent its meaning.

## Working locations

- Repository: `/Users/tushaarmehtaa/Dev/active/tushar-skills`
- Local preview: http://localhost:3100 (production server; may need restarting in a new session)
- Paper file: **Slashskills · Experience rethink**, ID `01M45F1ZJ3W8T4ZH2T9BNE9E20`
- Paper page: **/skills · Checkpoint · Experience rethink**, ID `p-1-0`
- Start here: https://app.paper.design/file/01M45F1ZJ3W8T4ZH2T9BNE9E20/p-1-0/18N-0
- Browse desktop: `3O0-0`; mobile: `3RU-0`; detail desktop: `OP-0`; mobile: `UZ-0`; install sheet: `V0-0`.
- Paper has 61 frames including review labels/reference boards. Ten rows cover discovery, branches, source/package, guides, requirements/recovery, design reference, chat workflows, local agent setup, editorial guides and flow contract.
- **Paper and local discovery diverge.** Paper retains the earlier visual-card concept. The latest sidebar/list revision was made directly in code at the user's request. StartHere now explicitly marks the direction unresolved.

## What exists locally

- Next.js site; Geist + Geist Mono, white/graphite/sage.
- Homepage: large two-line heading, sage emphasis, task sidebar with counts on desktop, one reading lane of consistent skill rows. Mobile uses category/platform selects and compact rows.
- Detail pages retain illustrative outcome previews, requirements, installer, source reader, platform disclosures and package data.
- Mobile installer is inline near title and opens an accessible dialog; no fixed bottom bar.
- Guides and requirements have short workflow strips. Guides remain separate from discovery.
- All 34 skills, package sources and ZIP downloads preserved. Nothing publicly deployed.

## Primary files

- `site/app/page.tsx`: hero and catalog ordering.
- `site/components/skill-directory.tsx`: search, categories, filters, result rows and desktop search inspector.
- `site/app/visual-direction.css`: current visual overrides; latest discovery block begins “Discovery: one reading lane”. Earlier card CSS remains above it; consolidate after settling the direction instead of accumulating more overrides.
- `site/app/canvas.css`: earlier Canvas base/layout rules.
- `site/components/skill-visual.tsx`: illustrative interface/chat/research concepts, compact thumbnails, generic workflow diagrams.
- `site/components/skill-detail.tsx`, `install-panel.tsx`, `agent-tabs.tsx`: detail/install flow.
- `site/components/workflow-strip.tsx`, `guide-layout.tsx`, `editorial-guide.tsx`: guide treatment.
- `site/lib/canvas.ts`: task groupings, titles, summaries/icons.

## Constraints and taste memory

Read `workspace/product-principles.md` and root AGENTS.md. Skills.sh is the benchmark; inspect current relevant surfaces before material changes. Homepage is for finding/installing skills; no guide feed. Preserve content accumulated over months, real requirements and honest testing status. No invented installs, rankings or proof.

User liked welcoming copy such as “Good work starts with a useful skill.” They want new-age workflows, not an old-book aesthetic; no uppercase eyebrows, logo dot, “menu+”, ambiguous input-like headings, oversized mobile rows or decorative wasted space. Mobile must be designed independently. They liked Canvas exploration and meaningful abstractions, but subsequent implementation did not meet their expectations. Do not assume sage/Geist/list treatment is now final or that building more images fixes the experience.

## Checkpoints and rollback evidence

`checkpoints/2026-10-06-experience-rethink/` contains:
- `site-source.tar.gz`: full current site sources including untracked implementation files, excluding dependencies, builds, test artifacts and env files.
- `site-tracked.patch`: tracked site diff against git HEAD (not enough alone to restore untracked files).
- `worktree-status.txt`: current dirty-file inventory.
- `desktop.png`, `mobile.png`: latest sidebar/list screenshots.

Extract archive into a separate temporary directory to compare/recover; do not blindly overwrite newer work. No git reset, stash or commit was performed. Extensive site edits existed before this session. Unrelated `workspace/seo-newsroom/` modifications must remain untouched.

## Validation and running

Last production build passed (53 generated pages); repository validation synchronized 34 packages and ZIPs. Earlier unit checks: 9 repository + 21 site tests passed. Latest browser run: 20 passed; one old exact category-name selector failed after visible counts were added. Updated that selector and its search/filter/return-path test passed on rerun. This is website behavior validation, not runtime execution of installed skills.

Run from `site/`:

```sh
npm run build
npm run start -- --port 3100
```

For active development use `npm run dev -- --port 3100` after stopping the existing server. `npx` errored in this environment; direct binaries worked:

```sh
node node_modules/typescript/bin/tsc --noEmit
node node_modules/@playwright/test/cli.js test --workers=4
```

## Next-session checkpoints

1. Read this document, inspect current local page and Paper StartHere, confirm worktree state. Do not restart from scratch or repeat rejected directions.
2. Clarify the unresolved reference if it matters, then define a concrete discovery → understanding → installation experience. Resolve hierarchy, interaction and personality together; avoid another cosmetic card/list swap.
3. Implement one coherent representative journey directly locally (user preference), inspect desktop/mobile and the first fold. Get design feedback before proliferating the treatment across all screens.
4. Preserve functional coverage, source/content, route/ZIP integrity and accessibility. Consolidate CSS once the direction stabilizes.
5. Keep Paper/local divergence explicit. Update corresponding frames only once the revised experience is accepted.
