# AI-search evidence workflow

Use this reference only when the task includes answer engines, citations, AI crawler policy, or content/entity work. Conventional crawlability, accessible HTML, useful content, and authority remain the foundation.

## Evidence confidence

Classify recommendations:

1. **Provider documented:** official crawler identity, robots behavior, publisher controls, or search documentation retrieved on a stated date.
2. **Open standard/established web practice:** semantic HTML, clear entities, canonical URLs, accessible content, source citation.
3. **Experimental convention:** community proposals such as `llms.txt` whose provider adoption may be unconfirmed.
4. **Speculation:** correlation studies, anecdotal prompt tests, or opaque ranking claims.

Do not present levels 3–4 as ranking or citation requirements.

## Crawler policy

Identify the operator's goals separately for:

- search/retrieval visibility;
- user-initiated fetching;
- model training use;
- copyright, licensing, privacy, bandwidth, and competitive concerns.

Fetch current official crawler documentation before naming user agents or claiming effects. Record source and retrieval date. An explicit `Allow` is usually unnecessary when a valid broader rule already permits crawling; avoid bloating policy files without a reason.

Remember:

- robots rules are crawler-specific voluntary controls, not access control;
- similarly named crawlers can have different purposes;
- blocking a crawler does not establish when previously processed content disappears;
- CDN/WAF behavior and authenticated content can differ from `robots.txt` intent.

## Content and entity analysis

For important audience questions:

1. inspect current result and answer formats;
2. identify recurring source types and primary evidence;
3. map whether the site has an accurate, accessible answer;
4. clarify the named entity, terminology, author/publisher, dates, and provenance;
5. improve the page for the user, not an arbitrary word-count formula;
6. cite original evidence for material factual claims.

Direct answers near relevant headings can improve comprehension, but not every section must begin with a fixed-length answer. Do not force FAQs, comparisons, statistics, or refresh cycles without audience need and maintainable evidence.

## Structured data

Schema can clarify entities and content but does not guarantee AI citation. Add only markup that:

- matches visible content;
- uses the correct entity type and relationships;
- is maintained from the same source of truth;
- passes relevant validation;
- complies with current search-feature policies if rich-result eligibility is a goal.

Do not claim FAQPage, BlogPosting, HowTo, or BreadcrumbList is required for citation.

## `llms.txt`

Treat `llms.txt` as an optional, low-cost experimental map when the site has stable canonical documentation and the team can maintain it. Before recommending it:

- verify the current proposal and provider adoption from primary sources;
- state that benefits are unconfirmed unless a provider documents support;
- curate canonical public links rather than duplicating a sitemap;
- avoid publishing secrets, private routes, unpublished pricing, or unsupported claims;
- verify HTTP status, content type, links, and freshness.

## Citation and authority opportunities

Research current questions and the sources answer systems surface. Opportunities may include original data/methods, reference documentation, accurate definitions, transparent comparisons, expert authorship, and inclusion in credible maintained resources.

For outreach, verify the publication, article freshness, editor/author, submission policy, and real differentiator. Follow the cold-outreach skill when installed. Do not buy deceptive placements, manufacture reviews, or create fake consensus.

## Measurement

Define what can actually be observed:

- server-log requests by documented crawler user agent/IP verification where available;
- referral traffic and tagged conversions;
- repeatable prompt samples with date, locale, account/model context, and citations;
- branded/category search data;
- third-party monitoring limitations.

Prompt tests are volatile samples, not a complete visibility score. Record uncertainty and avoid causal claims from before/after observations without controls.
