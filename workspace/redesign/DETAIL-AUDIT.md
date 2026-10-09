# Canvas implementation detail audit — 5 October 2026

**Status: all 12 findings below have now been repaired and verified locally.** See [repair verification](POLISH-VERIFICATION.md) for implemented changes, checks and final screenshots. The findings below preserve the initial audit; code line numbers refer to that earlier implementation.

Initial verdict: the implementation preserves the content and core functionality, but is not yet finished to the approved design standard. The previous build/test report overrepresented readiness: those checks did not establish design fidelity or cover the edge cases below. Keep Canvas and refine the implementation. No product code was changed in this audit.

Inspected the local production build at localhost:3100, current source, approved Paper browse/mobile/source-reader frames, and discovery/search/detail/guides/requirements at 390, 768, 1024 and 1440px. Measured browser geometry and exercised keyboard, empty results, long search text and package navigation. These are Chromium findings; physical-device and other-browser verification remain separate.

## Findings in repair order

“After” below means the recommended correction, not a change already applied.

| Priority | Before — observed | After — recommended | Evidence |
| --- | --- | --- | --- |
| P1 | Long unbroken search text is echoed into the result count without wrapping; it widens the mobile document and pushes Topics offscreen. | Constrain and wrap/ellipsize the displayed query while retaining its complete input and URL value. | `site/components/skill-directory.tsx:192`, `site/app/canvas.css:263`; reproduced at 390px with 160 characters. Initial browser reproduction; final captures are linked in the repair verification. |
| P1 | The fixed mobile install bar covers keyboard-focused footer links. Focus moved to the author, personal-site and specification links while their lower edges were behind the bar. | Reserve scroll space at the viewport level and ensure focused elements scroll above the bar. Scope footer padding to pages that actually have a sticky installer. | `site/app/canvas.css:795`, `site/app/canvas.css:1142`; bar begins at y=771 in an 844px viewport, focused links extend to y=795/823/844. |
| P1 | For an unmatched query with no active filters, the prominent “Clear filters” action changes nothing. Copy incorrectly attributes the empty result to filters. | Offer “Clear search” for query-only emptiness; keep query-preserving “Clear filters” only when filters are active. | `site/components/skill-directory.tsx:272`; reproduced at `/?q=nomatchingpackage`. |
| P1 | Source-reader design is incomplete. Instructions and all references are appended into one long page, with raw text opening above rendered text. There is no selected-file reader, persistent file navigation or on-page contents as designed. | Implement the approved reader with package-file navigation and true Read/Raw modes. Preserve all original content and anchors. Keep the overview/install decision concise. | `site/components/skill-detail.tsx:219`; approved Paper “Read source” desktop/mobile frames. Interface detail is about 9,002px tall at 390px; related guides/package information follow the source. |
| P2 | Tablet retains two hero columns and 48px type. At 768×844, the headline wraps across four lines; first result begins at y≈765. Search remains near the bottom even after a query is entered. | Give tablet its own compact composition and reduce the hero during active search. Make results the visual focus once the user starts searching. | `site/app/canvas.css:95`, `site/app/canvas.css:884`; initial tablet measurement. |
| P2 | Catalog rows use package descriptions rather than concise reader-facing summaries. The first mobile row is 157px tall; only two full results fit at 390×844. | Add deliberately edited short display summaries for all 34 skills. Keep canonical descriptions and source unchanged. Retain full summaries on detail pages. | `site/components/skill-directory.tsx:252`; approved mobile uses “Build a thoughtful, usable interface.” Implementation uses a longer technical description. |
| P2 | The “Package details” link jumps roughly 6,043px down the desktop interface-design page to a disclosure that remains closed. | Put package information near the overview or explicitly open and focus the target disclosure when navigating to it. | `site/components/skill-detail.tsx:66`, `site/components/skill-detail.tsx:314`; `details.open === false` after navigation. |
| P2 | Whole-library installation is below all 34 rows, with no early shortcut. The homepage is approximately 6,475px tall on mobile. | Provide a restrained “Install collection” entry point near discovery that opens or jumps to the installer. Individual skills remain primary. | `site/app/page.tsx:104`; homepage measured at 390px. |
| P2 | Search-row body opens a new page, while a downward chevron opens the side inspector. The chevron suggests expansion below and has no visible explanatory label. | Use an explicit preview affordance with a side-panel symbol/tooltip and consistent selected-state feedback; keep the shareable detail link clear. | `site/components/skill-directory.tsx:260`; initial desktop search inspection. |
| P2 | The intended workflow meaning was partly lost: approved desktop rows show transformations such as “Brief → Interface”; implementation replaces those with repeated “Local agent”. | Restore concise, accurate input/output cues where they help explain the skill. Keep platform eligibility as secondary metadata. Use task-specific icons when category-level icons are too generic. | `site/components/skill-directory.tsx:249`, `site/components/skill-directory.tsx:255`; Paper browse comparison. |
| P3 | Copy feedback differs between guides and installers: guide “Copied” remains indefinitely, installer feedback resets after 2.5 seconds. Replay uses a text glyph alongside custom SVG icons. | Share feedback timing/icon treatment across copy controls; use the same SVG vocabulary for replay. | `site/components/guide-code.tsx:7`, `site/components/canvas-art.tsx:53`. |
| P3 | Disclosure summaries for downloads and package details are only 20px high; the sheet lacks overscroll containment. Footer bottom padding is applied on every phone page, including those without an installer. | Increase the actual disclosure hit area, contain sheet overscroll, and apply bottom compensation only where needed. | `site/components/skill-detail.tsx:318`, `site/components/install-panel.tsx`; measured summary rectangles and computed sheet overscroll=`auto`; `site/app/canvas.css:1142`. |

## What to keep

The white/ink/sage palette and Geist typography remain coherent. The original vector weave, conventional icons, skill-name pills, search URLs, reduced-motion treatment and desktop/mobile installation distinction are useful foundations. Content preservation is substantive: the preceding implementation verification matched all 91 protected files and exercised all 34 routes/downloads and eight guides. This audit found presentation and interaction gaps; it does not indicate missing skill packages.

## Repair plan

1. Fix reproduced overflow, focus occlusion and empty-state behavior, with regression checks that reproduce these exact cases.
2. Complete the source reader and correct package-detail navigation while preserving source text and anchors.
3. Recompose tablet/search states, edit compact catalog summaries and surface whole-library installation appropriately.
4. Unify icons, copy feedback, disclosure hit areas and fine spacing; review real content on each template rather than only the representative interface-design page.
5. Recheck the changed journeys and visually review desktop, tablet and phone states. Do not equate the existing passing tests with completion of these corrections.

## References

- [Approved Paper design](https://app.paper.design/file/01M45F1ZJ3W8T4ZH2T9BNE9E20/p-1-0): browse, mobile browse and source-reader comparison.
- [skills.sh homepage](https://www.skills.sh/) and [skill detail](https://www.skills.sh/anthropics/skills/frontend-design), inspected today: discovery and installation remain the core reader job. Retain our task-based curation and original artwork; do not copy popularity rankings without corresponding evidence.
- [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), fetched today: focus visibility, content resilience and motion checks. User-approved sentence case takes precedence over its title-case preference.
- Emil design-engineering skill: consistent feedback, purposeful motion and small interaction details. A short settling animation is acceptable; additional decorative motion would not remedy the structural issues above.
