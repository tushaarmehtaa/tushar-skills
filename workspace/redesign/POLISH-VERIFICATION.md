# Canvas repair verification — 5 October 2026

All 12 findings in [the detail audit](DETAIL-AUDIT.md) are repaired in the local implementation. Preview: http://localhost:3100. These changes have not been deployed.

## Repairs

| Finding | Implemented result |
| --- | --- |
| Long query overflow | Result metadata wraps safely; the complete query remains in the input and URL. A 160-character unbroken query no longer widens the mobile page. |
| Obscured keyboard focus | Pages with a fixed installer reserve viewport scroll space and footer clearance. Keyboard-focused footer links remain above the bar at phone and tablet widths. |
| Empty-state action | Query-only empty states offer Clear search. Clear filters appears for active constraints and preserves the query. |
| Source reader | Selected-file navigation, exclusive Read/Raw modes, copy controls and heading navigation replace appended references. Mobile uses a file selector and contents disclosure. Direct hashes and cross-file links reveal the correct file; source text and anchors remain available. |
| Tablet density | Tablet has its own compact hero composition. Active search hides the hero. At 768px, the first result moved from approximately y=765 to y=577; active-search results begin around y=338. |
| Catalog descriptions | All 34 skills have edited display summaries, separate from canonical descriptions. The first mobile result shrank from 157px to approximately 115px. |
| Package details | Metadata sits before the reader. Its anchor opens, focuses and scrolls the disclosure, including repeat navigation to the same hash. |
| Collection installation | An Install collection shortcut beside discovery jumps to the existing collection installer. |
| Preview affordance | A labelled Preview action and side-panel icon communicate the desktop inspector. Detail links remain separate. |
| Workflow meaning | Skill-specific icons and compact input/output cues explain the work; platform eligibility is secondary. |
| Feedback and replay | Guide and installer copy controls share accessible success/error feedback and reset timing. Replay uses the original SVG icon vocabulary and remains hidden under reduced motion. |
| Small interaction details | Disclosure targets are enlarged, sheet overscroll is contained, and installer clearance is scoped to pages that need it. |

## Verification

- Production build passed: all 53 static pages generated, package archives and repository validation passed.
- Root checks: 9 tests passed. Site unit tests: 21 passed.
- Browser regression coverage: all 21 cases passed across the full run and an isolated rerun. The archive case initially encountered an HTTP 500 while a concurrent root check regenerated ZIPs; rerunning it after generation completed passed. Avoid concurrent archive regeneration and download testing.
- Five new browser cases cover query overflow/reset behavior, tablet density and collection navigation, keyboard footer visibility, reader modes/file navigation/package disclosure, and cross-file reference links.
- All 91 protected baseline files still match their recorded SHA-256 hashes. Original skill and guide source content remains unchanged.
- Route/download checks cover all 34 skills and eight guides, plus sitemap, canonical metadata, Open Graph and the missing-page response.
- Final visual review covered phone, tablet and desktop. `git diff --check` passed.

These checks use local Chromium and automated route/content validation. Physical-device and other-browser verification were not performed; this is not a claim of exhaustive compatibility.

## Final visual captures

| Surface | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Discovery | [390px](polished/home-390.png) | [768px](polished/home-768.png) | [1440px](polished/home-1440.png) |
| Source reader | [390px](polished/reader-390.png) | [768px](polished/reader-768.png) | [1440px](polished/reader-1440.png) |

The older `audit/` images were refreshed during repair inspection and should not be treated as preserved before screenshots. Original measured observations remain in the audit; the captures above document the final repaired state.
