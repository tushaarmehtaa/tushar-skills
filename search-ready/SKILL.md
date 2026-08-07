---
name: search-ready
description: Audit, implement, or verify technical SEO, indexation, content, schema, social previews, and AI discovery. Use when preparing or maintaining a live site for search and answer engines.
license: MIT
---

# Search readiness

Make a real site easier to crawl, index, understand, serve, cite, and share. Work from live behavior, repository intent, and search data as separate evidence classes.

## Choose a mode

- **Audit:** diagnose live and repository issues without changing files.
- **Implement:** apply approved fixes and verify deployment behavior.
- **Content opportunity:** research current queries, competitors, and audience questions.
- **Structured data:** select, implement, and validate eligible markup.
- **AI discovery:** evaluate crawler policy, answer-ready content, entity clarity, and experimental aids.
- **Maintenance:** compare current state with prior evidence and define recurring checks.

Route by site type when relevant: SaaS/docs, editorial, commerce, local, or international. Do not use an equal-weight generic score across unlike sites.

## Workflow

1. Confirm canonical production host, important routes/templates, audience, conversion action, locales, site type, and repository access. Inspect available Search Console/Bing, analytics, logs, prior audits, and deployment configuration before asking questions.
2. Fetch representative live URLs and inspect rendered HTML, source HTML where useful, headers, redirects, robots, sitemap/indexes, canonicals, hreflang, metadata, structured data, internal links, status behavior, and rendering dependencies.
3. Compare live behavior with repository intent. Label observed live behavior, source intent, search-platform data, and recommendation separately.
4. Inventory indexable route classes and assign each a search job. Diagnose duplicates, soft 404s, thin/orphaned pages, faceted/paginated states, accidental noindex, canonical conflicts, redirect chains, and sitemap coverage.
5. Prioritize blockers by likely impact on crawl, index, serve, comprehension, user experience, and business value—not character counts or checklist totals.
6. Research current result formats, branded/category queries, competitors, and source ecosystems when the task needs content or citation evidence. Treat rankings and snippets as time-sensitive.
7. Improve content around real questions and defensible claims. Preserve natural structure; do not force question headings, FAQs, word counts, or statistics at arbitrary intervals.
8. Add structured data only when it matches visible content, applicable schema, and current search-feature policies. Validate syntax and eligibility separately.
9. Treat AI-search practices by confidence: provider-documented crawler controls, standard accessible content, experimental conventions such as `llms.txt`, and unsupported speculation. Never promise rankings or citations.
10. Re-fetch the deployed result, run relevant validators and performance checks, compare route samples, and report remaining blockers and maintenance needs.

## Load conditional references

- Read [technical SEO](references/technical-seo.md) for route sampling, diagnostics, implementation patterns, and validation.
- Read [AI-search workflow](references/ai-search-workflow.md) only for answer engines, citations, crawler policy, or entity/content work.
- Read [AI-search reference](references/ai-search-reference.md) only for conditional schema, crawler, `llms.txt`, and outreach patterns.

This file controls prioritization, safety, output, and verification.

## Output contract

Return mode-relevant sections:

- scope and evidence sources;
- prioritized findings with affected URLs/templates, severity, confidence, and fix;
- live-vs-repository discrepancies;
- route-level metadata/schema/indexation matrix;
- implemented changes with file paths;
- content opportunities grounded in current evidence;
- validator and deployed verification results;
- unresolved blockers and maintenance cadence.

## Verify

- Representative templates and edge states were sampled, not just the homepage.
- Live response, rendered content, and repository intent are distinguished.
- Indexation claims use search-platform evidence when available and are otherwise qualified.
- Schema matches visible content and passes relevant validation.
- Redirects, canonicals, robots, sitemap, hreflang, status codes, and rendering agree.
- Performance claims identify lab versus field data.
- AI-search recommendations state evidence confidence and do not treat experimental conventions as guarantees.
