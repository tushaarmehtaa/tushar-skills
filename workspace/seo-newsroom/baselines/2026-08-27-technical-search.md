# Technical search baseline — 2026-08-27

Scope: live `https://www.slashskills.xyz` and repository intent, sampled 2026-08-27 from Asia/Kolkata. No Search Console, analytics export, CDN logs, or field-performance data was locally available; no indexation, traffic, ranking, volume, or Core Web Vitals claim is made.

## Live observations before fixes

| Route/state | Observation | Evidence class |
| --- | --- | --- |
| apex `/` | One redirect to `https://www.slashskills.xyz/`, final 200 HTML | live HTTP |
| homepage | 200, self-canonical, unique title/description, OG image, WebSite JSON-LD, server-rendered main content | live HTML |
| `/search-ready` | 200, self-canonical, unique metadata/OG, visible full package, CreativeWork JSON-LD | live HTML |
| `/guides/codex` | 200 and unique title/description, but canonical and OG identity inherited from homepage; repository inspection showed the same inherited canonical pattern on other static secondary routes | live HTML + repository intent |
| `/robots.txt` | 200 text; wildcard allows public pages and disallows `/api/`; named AI crawler rules explicitly allow | live HTTP; crawler purposes not re-verified here |
| `/sitemap.xml` | 200 XML; includes core pages and skill routes, omits Codex/Claude Code/Cursor guides, and duplicates `/changelog` because a static route and skill share the path | live HTTP + repository intent |
| unknown skill-like slug | `/definitely-not-a-real-route` returned 500 instead of 404 | live HTTP |

The homepage, skill detail, guide, compatibility, and changelog content are server rendered in source. Navigation links connect home, compatibility, runtime guides, and skill pages. Mobile/desktop design is covered by responsive components and Playwright tests; production visual sampling is recorded separately when performed.

## Repository intent and actions

1. **High:** unknown dynamic skill slugs should return 404. Added `dynamicParams = false` because every catalog slug is statically enumerated; verify after deployment.
2. **High:** runtime and other secondary routes need self-canonicals and route-specific Open Graph identity. Added them to shared guide metadata and the compatibility, changelog, ChatGPT, and Claude app routes.
3. **Medium:** add the three local-runtime guides to the sitemap and deduplicate paths already owned by static routes.
4. **Deferred:** `/changelog` is both a catalog skill slug and the public release-log route. The static route wins, so the skill package has no distinct public detail URL. This needs a deliberate routing/product decision; do not create a competing URL automatically.
5. **Deferred:** Search Console/index coverage and performance decisions require platform access or exports. Vercel Analytics is present in source, but no local report was available.

## Search-surface decision

The correct surface is the existing catalog, installation guides, compatibility evidence, controlled evaluations, package teardowns, and changelog-derived updates. A generic blog is not justified. Prefer route improvements until original evidence earns a distinct page.
