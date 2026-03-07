---
name: aeo-ready
description: Full Answer Engine Optimization audit — make your project discoverable by AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews), not just Google. Use when the user wants to improve their site's visibility in AI-powered search, add structured data, create llms.txt, optimize for AI citations, or audit their AEO readiness. Triggers on requests like "AEO audit", "AI search optimization", "make my site visible to AI", "structured data", "schema markup", "llms.txt", "answer engine", "AI discoverability", or any mention of being found by AI search engines or chatbots.
category: workflow
tags: [aeo, schema, llms-txt, structured-data, ai-search]
author: tushaarmehtaa
---

# AEO Ready

Full Answer Engine Optimization audit. Makes your project discoverable by AI search engines (ChatGPT, Perplexity, Claude, Google AI Overviews) — not just traditional Google.

## How AEO Differs From SEO

| SEO (Google) | AEO (AI Engines) |
|---|---|
| Rank on page 1 | Get cited in AI responses |
| Keywords in content | Q&A-structured content AI can extract |
| Backlinks for authority | Mentioned in listicles AI synthesizes from |
| Meta tags | Schema markup (SoftwareApplication, FAQPage, HowTo) |
| Sitemap for crawling | llms.txt for LLM-readable summary |
| robots.txt for Googlebot | robots.txt rules for GPTBot, ClaudeBot, PerplexityBot |

## What This Generates

| Output | Purpose |
|--------|---------|
| **Schema Markup** | Structured data so AI engines can parse your content |
| **FAQ Blocks** | Q&A-structured content optimized for AI extraction |
| **llms.txt** | Machine-readable site summary for LLM crawlers |
| **AI Crawler Rules** | robots.txt rules for AI-specific crawlers |
| **Citation Strategy** | Prioritized list of articles to pitch for inclusion |
| **Content Gaps** | Missing content AI engines need to cite you |

## Phase 1: Scan Codebase

Detect:
- Framework (Next.js, Astro, Remix, static HTML, etc.)
- Existing meta tags and structured data
- Content pages (blog, docs, landing pages)
- Existing robots.txt and sitemap.xml
- Current schema markup (if any)

## Phase 2: Schema Markup

Based on project type, generate appropriate schema:

| Project Type | Schema Types |
|---|---|
| **SaaS / Web App** | SoftwareApplication, FAQPage, HowTo, Organization |
| **Blog / Content** | Article, FAQPage, BreadcrumbList, Person |
| **E-commerce** | Product, Review, FAQPage, Organization |
| **Documentation** | TechArticle, HowTo, FAQPage |

### SoftwareApplication Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Project Name]",
  "description": "[One-line description]",
  "applicationCategory": "[Category]",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "[Price or 0 for free]",
    "priceCurrency": "USD"
  }
}
```

### FAQPage Schema

**Critical:** Each answer must be 40-60 words. Too short = not useful. Too long = gets truncated by AI engines.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is [Product]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[40-60 word direct answer]"
      }
    }
  ]
}
```

### HowTo Schema

For any tutorial or getting-started content:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [use/set up Product]",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1",
      "text": "[Instruction]"
    }
  ]
}
```

Inject all schema as `<script type="application/ld+json">` in the page `<head>`.

## Phase 3: llms.txt

Create `public/llms.txt`:

```
# [Project Name]

> [One-line description]

## What it does
[2-3 sentence explanation]

## Key features
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Pricing
[Free tier details, paid tiers if applicable]

## Links
- Homepage: [URL]
- Documentation: [URL]
- Getting started: [URL]
```

## Phase 4: AI Crawler Rules

Add to `robots.txt`:

```
# AI Crawlers — allow indexing
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

If user wants to block specific crawlers, generate Disallow rules and explain the tradeoff (blocking = not cited by that engine).

## Phase 5: Citation Strategy

1. Search "best [your category] tools 2025" — find top 10 ranking articles
2. For each article: note publication, author, last updated date, accepts submissions?
3. Generate pitch angle per article (what makes this product different from tools already listed)

Output as a table:

| Article | Publication | Last Updated | Pitch Angle |
|---------|------------|-------------|-------------|

## Phase 6: Content Gap Analysis

Check for content answering these questions:

| Question | Present? | Schema Added? |
|----------|----------|--------------|
| "What is [Product]?" | ❌/✅ | ❌/✅ |
| "How does [Product] work?" | ❌/✅ | ❌/✅ |
| "Is [Product] free?" | ❌/✅ | ❌/✅ |
| "[Product] vs [Competitor]?" | ❌/✅ | ❌/✅ |
| "How to get started?" | ❌/✅ | ❌/✅ |

For each missing piece, generate the content block with proper schema.

## Scoring Output

Rate each area and output summary:

| Area | Score | Status |
|------|-------|--------|
| Schema Markup | 0-10 | ❌/⚠️/✅ |
| FAQ Content | 0-10 | ❌/⚠️/✅ |
| llms.txt | 0-10 | ❌/⚠️/✅ |
| AI Crawler Access | 0-10 | ❌/⚠️/✅ |
| Citation Readiness | 0-10 | ❌/⚠️/✅ |
| Content Gaps | 0-10 | ❌/⚠️/✅ |

## Workflow

1. Scan codebase — framework, existing meta/schema, content pages
2. Detect project type (SaaS, blog, e-commerce, etc.)
3. Generate appropriate schema markup and inject into head/layout
4. Generate FAQ blocks with 40-60 word answers
5. Create `public/llms.txt`
6. Update `robots.txt` with AI crawler rules
7. Generate citation strategy table
8. Run content gap analysis and generate missing content blocks
9. Output audit report with scores

## Checklist

- [ ] All appropriate schema types generated and injected
- [ ] FAQ answers are 40-60 words each
- [ ] `llms.txt` created in public directory
- [ ] `robots.txt` updated with AI crawler rules
- [ ] Citation strategy table generated with pitch angles
- [ ] Content gaps identified with generated fix content
- [ ] Audit report with scores outputted

## Detailed Reference

For schema examples by industry, advanced llms.txt patterns, and citation outreach email templates, see [references/guide.md](references/guide.md).
