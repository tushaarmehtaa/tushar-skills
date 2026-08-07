# Technical search diagnostics

Use this reference for technical audit, implementation, or verification after the main skill defines site type and scope. Do not calculate an equal-weight readiness score.

## Contents

- [Evidence and sampling](#evidence-and-sampling)
- [Crawl and response behavior](#crawl-and-response-behavior)
- [Indexing signals](#indexing-signals)
- [Rendering and content](#rendering-and-content)
- [Structured data and previews](#structured-data-and-previews)
- [Site-type branches](#site-type-branches)
- [Implementation and verification](#implementation-and-verification)

## Evidence and sampling

Build a representative matrix by route template and state:

| Template/state | Example live URL | Index intent | Search job | Traffic/value evidence | Notes |
|---|---|---|---|---|---|

Include homepage, important landing/content/product pages, dynamic detail pages, pagination/facets, locale variants, redirects, not-found/soft-404 behavior, and authenticated/private boundaries as relevant.

Evidence sources can include live HTTP/rendered behavior, repository/configuration, Search Console/Bing, analytics, server/CDN logs, structured-data validators, field performance, and lab tests. Record date and source; absence from a search result is not proof of non-indexation.

## Crawl and response behavior

Check:

- status code, redirect target/count, and final canonical host/protocol;
- robots meta/header and `robots.txt` behavior for the actual user agent;
- sitemap/index availability, discoverable canonical URLs, truthful `lastmod`, and stale/redirect/error entries;
- internal-link discovery and orphan routes;
- URL parameter/facet/pagination behavior and crawl traps;
- soft 404s, server errors, timeouts, and CDN/WAF variation;
- response headers affecting indexing, caching, content type, or locale.

Do not assume every private route must be disallowed in robots. Robots exclusion does not provide access control and can prevent crawlers from seeing `noindex`; choose controls based on actual exposure.

## Indexing signals

For each route class, reconcile:

- intended indexability;
- HTTP status and robots directives;
- canonical target and redirect behavior;
- sitemap inclusion;
- hreflang cluster where applicable;
- search-platform inspected/coverage state when available;
- duplication or near-duplication.

Canonical URLs are hints, not commands. Avoid adding self-canonicals mechanically before resolving host, parameter, pagination, syndication, and locale semantics.

Sitemap `priority` and `changefreq` are not substitutes for architecture or truthful modification dates. Follow current search-engine documentation for supported fields.

## Rendering and content

Compare source and rendered HTML when JavaScript can affect:

- title, description, canonical, robots, hreflang, and structured data;
- primary content and headings;
- internal links and pagination;
- error/empty states;
- image/video content and alt/transcript support.

Use one clear page title and a logical heading structure, but do not fail pages solely for character counts, multiple H1 elements, absence of question headings, or arbitrary internal-link totals. Evaluate truncation risk, uniqueness, relevance, information scent, accessibility, and template duplication in context.

For performance, distinguish field data from lab data and name the tested device/network/template. Connect issues to crawl/render/user outcomes rather than treating framework patterns as proof of poor performance.

## Structured data and previews

- Select schema types that match visible content and entity meaning.
- Check required/recommended properties against current official search-feature documentation.
- Validate JSON syntax/schema structure and search-feature eligibility separately.
- Do not add FAQ, HowTo, Product, Review, or Organization markup merely to earn a checklist point.
- Keep values consistent with visible content and canonical URLs.

For social previews, test the resolved metadata and image on representative routes. Verify absolute URL, fetchability, dimensions/file constraints from current platform documentation, fallback behavior, and localization.

## Site-type branches

- **SaaS/docs:** docs discovery, integration/comparison pages, versioning, API references, status/changelog, subdomain strategy.
- **Editorial:** authorship, dates, archives, pagination, syndication, paywalls, news/article requirements.
- **Commerce:** product/variant/category URLs, availability/price consistency, merchant feeds, reviews, faceting, image search.
- **Local:** location entities, NAP consistency, location pages, business profiles, duplicate listings.
- **International:** locale URLs, hreflang reciprocity, language/region targeting, translation quality, fallback selectors.

Load only the branch relevant to the site.

## Implementation and verification

Before editing, identify shared metadata/layout components and route-generation sources. Prefer fixing the template or data source over patching pages individually. Ask before making changes unless implementation was explicitly requested.

After change:

1. run repository tests/build/lint relevant to the files;
2. deploy or use an authorized preview;
3. fetch final and representative edge URLs;
4. verify headers, redirects, rendered HTML, robots, sitemap, canonical/hreflang, metadata, and schema;
5. run current official validators where applicable;
6. compare field/lab performance only with equivalent conditions;
7. record changes that require recrawl/reprocessing and avoid promising a timing outcome.
