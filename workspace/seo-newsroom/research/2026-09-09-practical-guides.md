# Practical guides — September 9, 2026

Owner: Tushar Mehta. User authorized implementation of the proposed homepage → guide → skill journey in an active reviewed session.

## Publication scope

Three new URLs: `/guides/image-editing-skills`, `/guides/astra-skill-instructions`, and `/image-editing`. Homepage discovery and related-guide links update existing URLs. This is a narrower implementation-recipe scope than the scout's proposed comparative studies. Those studies remain unperformed; the pages explicitly disclose this and contain no claimed outcomes, generated examples, or compatibility measurements.

The image guide provides a checked-in skill package, revision record, illustrative edit brief and acceptance method. The Astra guide provides original before/after instruction examples and a three-case audit procedure, linked to existing authoring workflows. These reader jobs differ from runtime installation guides and skill source pages. The new image package owns successive reference-based edits; ai-product-development owns application integration.

## Evidence map

Primary sources retrieved September 9, 2026:

- https://developers.openai.com/api/docs/models/gpt-image-2.5-flare — documented model identity, text/image input, Images API and Responses tool selection; provider positioning, not our benchmark.
- https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst — documented editing model and supported surfaces; provider positioning, not our benchmark.
- https://developers.openai.com/api/docs/guides/latest-model — Astra guidance on conflicting skill instructions, clarification and steering.

Owned artifacts: `image-editing/SKILL.md`, `image-editing/references/edit-record.md`, three behavioral case prompts in `skill-evals.json`, and guide instruction examples. Case prompts are not passing evaluations. All image-editing runtime statuses remain untested.

## Validation

- Root tests: 4 passed. Site unit tests: 19 passed.
- Repository/package/README/ZIP validation passed for 34 skills; skill-creator frontmatter validation passed.
- Production build passed, including statically rendered guide routes.
- Six Playwright tests passed, including new mobile (390px) and desktop (1440px) guide navigation, self-canonical, single H1, viewport overflow, reference-fragment resolution, real ZIP response, related-skill navigation and sitemap presence.
- Homepage guide section and full image-guide screenshots inspected on mobile and desktop.
- Pages use TechArticle metadata matching visible author/date/content, with individual canonicals and share metadata.
- Publishing guard reports 0/3 used before deployment. Production verification and ledger entries follow only after live checks.

## Measurement

Track impressions and clicks per new URL, guide_open, guide_skill_open, ZIP downloads and existing install interactions. Clicks are not confirmed installations. Establish the deployment baseline after verification; compare at 14 and 28 complete days. No fresh Search Console data, indexation finding or traffic forecast is available.

Recheck provider statements after model/API changes. Add comparative claims only after the corresponding recorded experiments have passed review.

## Production verification

Published and verified September 9, 2026, commit `c4f3e8a`. GitHub validation run `34369793144` succeeded; Vercel deployment `6eNzowobydqKy8PAS4p4KTkZ21Jo` succeeded. Live HTTP 200 checks passed for the homepage, both guides, image skill, sitemap and ZIP. Canonicals and index/follow metadata match the three new routes. Both guides expose TechArticle schema and one H1; the skill uses the existing package renderer and CreativeWork schema. The downloaded ZIP contains SKILL.md and the revision reference. Homepage discovery and sitemap links verified. All three URLs recorded in the publishing ledger (3/3 for September 9).

Measurement windows: September 23 and October 7, 2026. Search indexation and performance remain unknown. Existing Cursor/Codex windows are unchanged.

## UX revision after user review

Replaced the guide presentation with an editorial reading layout: larger proportional headings and body text, top-of-page skill action, deterministic Guides breadcrumb, desktop contents sidebar, mobile expandable contents, and code-example copy controls with a manual-copy fallback. Homepage guide entries now use compact linked rows. Existing URLs and article claims are unchanged.

Validation: production build and 23 unit tests passed. All six browser checks passed, including the top action appearing in the initial viewport at 390px and 1440px, contents-anchor navigation, clipboard contents matching the displayed example, and breadcrumb return to homepage guides. Reviewed desktop/mobile guide and homepage screenshots. No new URL or publication-ledger entry is required for this correction.

## User correction: keep the homepage focused on skills

The user explicitly rejected guides ahead of skills and guides on the main page. Removed the guide section entirely from `/` and restored the prior skill ordering. Guides now live at `/guides`, reached from the header; article breadcrumbs return there. Related guides remain on their relevant skill pages. This is the durable product preference: the homepage is for discovering and installing skills, not an editorial feed.

The new `/guides` route is a non-indexable navigation hub with follow enabled, excluded from the sitemap. Individual article routes remain indexable; this adds no new indexable URL beyond the day's three recorded publications. Browser regression checks assert no Latest guides heading on the homepage and exercise navigation to the separate directory.
