# Canvas Structure — design handoff

Selected by Tushar. Finalized design pass: 5 October 2026.

[Paper design](https://app.paper.design/file/01M45F1ZJ3W8T4ZH2T9BNE9E20/p-1-0)

## Scope and truth

This is a design package, not an implemented or deployed redesign. Paper screens specify layouts, representative content and interaction states. They do not replace the complete articles, skill instructions or package files in the repository. Preserve the original full content during implementation. Static mockups cannot establish that keyboard behavior, motion, downloads or live integrations work.

The package covers the homepage/catalog, desktop search inspector, mobile search, category selection, platform filtering, empty results, mobile navigation, skill overview, installation, package contents, source reader, full-library installer, requirements, release changelog, guide index, all eight guides, and missing-page recovery. Shared skill templates cover all 34 entries; duplicating every skill into Paper would not provide additional layout coverage. Long source files, references and articles must continue to render in full.

## Review order

Read each labeled Paper row from left to right. Desktop and mobile are paired.

1. Browse → search → understand → install.
2. Discovery branches: categories, platforms, empty results and menu.
3. Source → package/platform choice → whole-library installation.
4. Guides index → Codex setup → image-editing editorial template.
5. Requirements → release history → missing-page recovery.
6. Interaction, catalog and visual-language references.
7. ChatGPT → Claude app → original icon reference.
8. Claude Code → Cursor → desktop empty state.
9. Astra article → MCP article → desktop filter popover.
10. Flow and implementation contract.

## Visual system

White #FFFFFF, ink #17191C, secondary #60646C, sage #345847, surface #F5F7F5, selected #EEF3EF, divider #DCDDE1, control outline #858B89. Dividers are decorative; control boundaries and focus indicators need sufficient contrast.

Geist for UI and reading; Geist Mono for commands and package identifiers. Main desktop hero 58/64, mobile hero 30/35; guide desktop headings 48px, mobile 32px; result titles 24px desktop and 20px mobile; body 16/24, compact supporting text 14/20. Sentence case throughout. Avoid excessive weight and oversized mobile type.

The woven field is original vector artwork and an abstract brand metaphor: incoming context → organization by a skill → a clearer path to output. Use it once on discovery and in a compact crop on the guide index. Use labeled real stages for instructions; never imply a measured agent run with decorative artwork.

`assets/icons/` contains 21 original SVGs. Use conventional action symbols and labeled task symbols. Preserve existing provider identities from `site/lib/runtime-brands.ts` and their provenance; do not substitute task symbols for provider logos. Icons use currentColor. Icon-only controls need accessible names; decorative graphics use aria-hidden.

## Product and content preservation

The existing product principles remain authoritative. Homepage content is skill discovery and installation only. Guides stay at `/guides` and contextual skill links.

The comparable skills.sh surfaces were inspected for the find → understand → install journey. We retain that direct hierarchy. We deliberately use a curated task-based catalog instead of popularity rankings because this library has 34 skills and no evidence for invented popularity metrics. Canvas artwork supplies identity without displacing search or installation.

`catalog-map.json` captures all 34 catalog records and their proposed task grouping. No entries are missing or duplicated. Humanize and skill-creator are shared tools: expose them in All skills and relevant task groups rather than creating an orphan category. Preserve the original 13 category values as metadata and searchable terms. Existing category query URLs must resolve to their original subsets; introduce a separate task parameter for the four new task groups instead of silently reinterpreting old URLs.

Preserve all source-of-truth material:

- `site/lib/catalog.ts`: surfaces, capability requirements, every tested/untested/unsupported status and summaries.
- All 34 root skill directories: complete SKILL.md files, references, scripts and assets; package-relative links and heading anchors.
- `site/lib/agents.ts`: runtime IDs, scope, generated commands, invocation, update/removal and verification notes.
- `site/app/guides/[agent]/page.tsx`: all runtime-specific sections, including Codex catalog pressure and Cursor configuration notes.
- ChatGPT and Claude app pages: eligible skill lists, exact packaging examples, setup boundaries, dated verification and official source links. Paper shows abbreviated guide copy, not permission to delete source paragraphs or manifests.
- The three editorial pages: full Markdown, code, tables, citations, dates, experiment limitations and related skills. Astra estimated costs and timings are specific measurements, not current pricing advice or general rankings. MCP fixture tests are not live ChatGPT integration tests.
- Requirements and changelog pages: all rows and entries, not only the representative rows shown in Paper.
- `skills.json`, `llms.txt`, sitemap, robots, OG generation, canonical metadata, GitHub links and all ZIP endpoints.

`source-baseline.json` records file hashes before implementation. A source-content change requires a deliberate content decision, not accidental truncation while translating the design.

## Behavior contracts

Search and filters update immediately. Preserve q/category/surface in the URL, Back/Forward state, query text on filter reset and the current result when entering/leaving a detail. Slash focuses search only outside editable fields. Announce result counts politely; do not announce each visual detail.

Desktop search uses an inline inspector. Opening the full skill creates a shareable route. Mobile opens a dedicated skill page. The mobile install action is sticky within the viewport with safe-area inset and enough trailing content padding; its position at the bottom of the long Paper frame is a static representation.

Category and platform controls have persistent labels. Use native select where possible, or a keyboard-complete listbox/dialog. Menus/popovers close on Escape and outside interaction and restore focus to the trigger. Mobile sheets trap focus, have a visible close control and do not require dragging. Avoid trapping focus in a desktop nonmodal inspector.

Require a meaningful runtime and scope choice before generating a specific install command. Never imply clipboard copy installed or executed a skill. Keep command text selectable. Success shows a check and polite live announcement for 2.5 seconds; focus stays on the control. Failure shows manual-copy text and retry without clearing runtime/scope.

Preserve separate raw package and Claude upload ZIPs. ChatGPT follows its own accepted-file/plugin guidance. Gate chat upload instructions on catalog eligibility. A local-only skill explains missing capabilities and offers the local path; raw source inspection remains available.

Source reader exposes all bundled files and Read/Raw modes. On mobile, file selection and contents are disclosed; long code can scroll horizontally without causing page overflow. Copy actions copy the exact original text, not wrapped display text. Article tables keep headers; adapt to narrow layouts with labeled rows or a contained horizontal scroll where comparison demands it.

## Motion and accessibility

Based on Emil design-engineering and the installed better-interface guidance. Search, filtering and repeated selection are immediate. Button press: 160ms, scale .96. Popover: 180ms from its trigger, with a faster exit. Mobile sheet: 220ms. Animate opacity/transform only, with explicit properties; never transition:all. No looping weave, repeated list entrance or ornamental delay.

prefers-reduced-motion removes transform and spatial animation. Preserve clear focus-visible indicators, 44px minimum touch targets, semantic headings, true buttons/links, tab semantics, keyboard order and screen-reader labels. Never rely only on color for selection, errors or test status. Check 320, 375, 390, 768, 1024 and 1440px widths and 200% zoom in the implemented app.

## Before release

Resolve the existing `/changelog` collision between the release-history route and the `changelog` skill slug. Recommended implementation: retain `/changelog` for release history; give the skill an explicit `/skills/changelog` route and update its catalog/canonical/internal links. Treat this as a deliberate route migration with tests, not an assumption that both existing pages are reachable at the same path.

Run the repository validation/build and browser contracts after implementation. Check every catalog route, all eight guide routes, full rendered content and references, install commands for all runtimes/scopes, archive contents, filter URLs, Back behavior, keyboard navigation, focus restoration, clipboard failure, safe-area placement, narrow overflow and reduced motion. Visual review in Paper does not substitute for these checks.

No production source, package content or unrelated newsroom work was changed during this design pass.
