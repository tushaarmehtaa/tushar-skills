# Canvas Structure implementation

Implemented locally on 5 October 2026. Production deployment has not been performed.

Preview: http://localhost:3100

## Delivered

- White/ink/sage Canvas identity, Geist typography, original task/action SVG icons, light-theme provider marks, favicon and social preview.
- Original woven SVG on discovery and the guide index. Transform/opacity settling motion runs once, with explicit replay. Reduced motion removes it; no new animation library, video or WebGL.
- Task browsing alongside all original topic categories and URL filters. Search matches package names, descriptions and visible task titles. Desktop inspector, separate mobile detail page, query-preserving empty-state recovery and remembered result selection.
- Responsive navigation with keyboard dismissal. Desktop installation panel and mobile modal sheet with focus containment, Escape/close/backdrop dismissal, focus restoration and background scroll lock.
- Runtime and scope controls, exact commands, clipboard success/failure, support evidence and requirements. Detail installation retains Codex/global as visible defaults; whole-library specific commands require scope selection.
- Complete source and references, exact raw-file copying including frontmatter, package metadata, existing platform eligibility and ZIP downloads.
- All eight guides retain complete source content. Shared guide layout, guide index, requirements matrix, release history and custom 404 use the new presentation.
- Changelog skill now has `/skills/changelog`; release history stays at `/changelog`. Catalog JSON, llms.txt, sitemap, canonical metadata and internal links use the right destination.
- GitHub star count retained in the footer. Unrelated newsroom worktree changes were preserved.

## Verification

- Root `npm run check`: 9 tests passed; all 34 archives rebuilt and repository validation passed.
- Site `npm test`: 21 tests passed.
- Site `npm run build`: production build passed, including TypeScript and all static routes.
- Site `npm run test:browser`: 16 Chromium tests passed.
- `git diff --check` passed.
- 91 protected baseline files match their original SHA-256 hashes; see `content-verification.json`. This includes skill source material, runtime/catalog definitions and full guide source pages.
- All 34 skill destinations and archive endpoints, all eight guides, OG image response, canonical links, sitemap paths and custom 404 checked.
- Responsive checks at 320, 390, 768, 1024 and 1440 CSS pixels. Desktop/mobile screenshots visually inspected. Additional tablet full-library installer check passed.
- Rapid typing, query/filter retention, browser Back restoring selected preview, all three runtimes in both scopes, exact SKILL.md clipboard bytes, clipboard denial, menu/sheet keyboard behavior, focus restoration and reduced motion checked.

Browser verification uses Chromium viewport emulation, not a claim of exhaustive testing on physical devices or every browser. Production hosting has not been exercised by this local run.

## Review images

- [Desktop homepage](implementation/home-desktop.png)
- [Mobile homepage](implementation/home-mobile.png)
- [Mobile installer](implementation/install-mobile.png)

## Engineering reference

Search updates use Next.js's supported native History API integration so typing does not wait for server navigation: https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api
