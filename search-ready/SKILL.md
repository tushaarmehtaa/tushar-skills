---
name: search-ready
description: Audit and improve technical SEO, content, structured data, social previews, and AI-search visibility. Use when preparing or maintaining a site for discovery.
license: MIT
---

# Search readiness

Make a real site easier to crawl, understand, rank, cite, and share. Work from live evidence and the repository. Do not produce a generic checklist detached from the implementation.

## Workflow

1. Confirm the canonical production URL, important routes, audience, conversion action, and access to the codebase.
2. Fetch the live site and inspect the rendered HTML, response headers, redirects, robots rules, sitemap, canonicals, metadata, structured data, internal links, and status codes.
3. Search the web for branded queries, category queries, direct competitors, current search-result formats, and sources that answer the audience's questions. Treat rankings and snippets as time-sensitive evidence.
4. Inventory indexable routes and assign each a search job. Identify duplicates, thin pages, orphaned pages, accidental noindex rules, and missing content.
5. Fix technical blockers before content polish: crawlability, canonicalization, metadata, schema validity, rendering, performance, and sitemap coverage.
6. Improve page content around real questions and claims. Put the direct answer near the top, keep terminology consistent, cite primary sources, and add proof the project can support.
7. Add AI-discovery support where useful: explicit entity descriptions, answer-shaped sections, accessible HTML, crawler policy, and `llms.txt`. Never present `llms.txt` as a ranking guarantee.
8. Verify social previews for important routes. If the project needs new preview artwork or dynamic images, follow the `social-sharing` skill.
9. Re-fetch the deployed result, validate structured data, compare metadata route by route, and report what changed, what remains blocked, and what should be checked monthly.

## Load deeper guidance

- Read [technical SEO](references/technical-seo.md) for the repository audit, implementation patterns, scoring model, and verification commands.
- Read [AI-search workflow](references/ai-search-workflow.md) when the task includes answer engines, citations, authority building, or current web research.
- Read [AI-search reference](references/ai-search-reference.md) for schema, crawler, directory, and outreach details.

## Output

Return:

- a prioritized findings table with evidence, affected URLs, severity, and fix;
- implemented changes with file paths;
- a route-level metadata and schema matrix;
- content opportunities grounded in live queries and competitors;
- verification results and a short maintenance cadence.

Do not invent traffic, rankings, authority, or indexation. Distinguish observed live behavior from repository intent and from recommendations.
