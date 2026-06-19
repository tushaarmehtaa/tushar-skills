---
name: aeo-ready
description: Audit Answer Engine Optimization (AEO) for AI search engines — ChatGPT, Perplexity, Claude, Google AI Overviews. Generates structured data, llms.txt, and AI crawler rules to make your project discoverable beyond Google.
category: seo
tags: [aeo, schema, llms-txt, structured-data, ai-search]
author: tushaarmehtaa
---

Google crawls pages and ranks them. AI engines synthesize answers from sources they've already ingested. Getting cited is a different problem: structure, authority, access, and content that directly answers questions.

This skill audits and fixes all four.

## The Mechanics

Three types of AI crawlers exist. Know the difference before touching robots.txt:

- **Training crawlers** (GPTBot, ClaudeBot, CCBot) — index content once for model training datasets. Blocking them means future model versions won't know about you.
- **Retrieval crawlers** (PerplexityBot, OAI-SearchBot) — fetch pages in real time to answer specific user queries. Blocking these has immediate effect — your pages stop appearing in answers within hours.
- **Live browsing agents** (ChatGPT-User) — fetch a single page on demand when a user asks the model to visit a URL.

## Phase 1: Scan the Codebase

Read the project before generating anything:

- **Framework**: Next.js / Astro / Remix / static HTML?
- **Existing meta tags**: Check `<head>`, `layout.tsx`, `_document.tsx`, or equivalent
- **Existing structured data**: Search for `application/ld+json` scripts
- **Content pages**: Blog, docs, landing page, FAQ sections
- **robots.txt**: Does it exist? Does it block anything?
- **sitemap.xml**: Does it exist and is it submitted?

Report what's missing before making any changes.

---

## Phase 2: Schema Markup

Schema tells AI engines exactly what your content means. Without it, they guess.

### Pick schema types by project type

| Project Type | Schema Types |
|---|---|
| SaaS / web app | SoftwareApplication + FAQPage + HowTo |
| Blog / content site | Article (BlogPosting) + FAQPage + BreadcrumbList |
| Documentation | TechArticle + HowTo + FAQPage |
| Portfolio | Person + CreativeWork |

### SoftwareApplication Schema

Inject in the `<head>` of the main layout:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Product Name]",
  "description": "[One sentence — what it does and who it's for]",
  "applicationCategory": "[BusinessApplication / DeveloperApplication / etc.]",
  "operatingSystem": "Web",
  "url": "[Homepage URL]",
  "offers": {
    "@type": "Offer",
    "price": "[0 for free tier]",
    "priceCurrency": "USD",
    "description": "[Free tier / pricing summary]"
  },
  "creator": {
    "@type": "Person",
    "name": "[Your Name]",
    "url": "[Your website]"
  }
}
</script>
```

### FAQPage Schema

The highest-value schema for AI engines. AI engines pull FAQ answers directly to respond to user queries. Each answer must be 40-60 words — too short gets ignored, too long gets cut off.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is [Product]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Product] is a [category] tool that helps [target user] [achieve outcome]. [How it works in one sentence]. [What makes it different or what the free tier includes]. [Result users get]."
      }
    },
    {
      "@type": "Question",
      "name": "How does [Product] work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Product] works in three steps: [step 1], [step 2], and [step 3]. [Timeframe — how fast users get results]. [No manual work / fully automated / etc.]."
      }
    },
    {
      "@type": "Question",
      "name": "Is [Product] free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Product] has a free tier that includes [what's included]. Paid plans start at [price] and include [key paid features]. No credit card required to get started."
      }
    },
    {
      "@type": "Question",
      "name": "[Product] vs [Main Competitor]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Key differentiator in one sentence]. [Competitor] is [description]. [Product] is [description]. [Specific advantage — price, speed, feature, integration]."
      }
    }
  ]
}
</script>
```

Read the actual landing page and docs to generate real answers — never fabricate them.

### HowTo Schema

For any getting-started or tutorial content:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to [use / set up / get started with] [Product]",
  "step": [
    { "@type": "HowToStep", "name": "Step 1", "text": "[Instruction]" },
    { "@type": "HowToStep", "name": "Step 2", "text": "[Instruction]" },
    { "@type": "HowToStep", "name": "Step 3", "text": "[Instruction]" }
  ]
}
</script>
```

### Article / BlogPosting Schema

Add to every blog post. This is required for blog content to get AI citations — without it, AI engines can't confirm authorship or freshness.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post title]",
  "datePublished": "[ISO 8601 date]",
  "dateModified": "[ISO 8601 date]",
  "author": {
    "@type": "Person",
    "name": "[Author name]",
    "url": "[Author URL]"
  },
  "publisher": {
    "@type": "Organization",
    "name": "[Site name]"
  },
  "url": "[Canonical URL]"
}
</script>
```

### BreadcrumbList Schema

Add to any page more than one level deep. Helps AI engines understand topical hierarchy.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "[homepage URL]" },
    { "@type": "ListItem", "position": 2, "name": "[Section]", "item": "[section URL]" },
    { "@type": "ListItem", "position": 3, "name": "[Current page]", "item": "[page URL]" }
  ]
}
</script>
```

For Next.js App Router: inject schema in `generateMetadata` or directly in the page component via a script tag. For static HTML: inject in `<head>`.

---

## Phase 3: llms.txt

`llms.txt` is a Markdown file at your domain root that gives AI systems a curated map of your most important content. The spec (llmstxt.org) was proposed in September 2024 and is community-driven — no major AI provider has publicly confirmed they read it in production. Still worth having: it costs nothing and serves as a canonical reference.

**Important:** don't dump every URL in here. Curate 10–40 links. A list of every page is not useful.

```
# [Product Name]

> [One or two sentences: what it does and who it's for. This often becomes the model's "mental model" of your site — write it like a definition, not a tagline.]

## What it does
[2-3 sentences covering the core use case and mechanism]

## Docs
- [Getting Started](https://yoursite.com/docs/getting-started): How to install and run [Product] in under 5 minutes.
- [API Reference](https://yoursite.com/docs/api): Full REST API with request/response examples.
- [Configuration](https://yoursite.com/docs/config): All configuration options with defaults.

## Key pages
- [Homepage](https://yoursite.com): Overview, pricing, and signup.
- [Pricing](https://yoursite.com/pricing): Free tier details and paid plan comparison.
- [Changelog](https://yoursite.com/changelog): All releases and what changed.

## Blog
- [Title of most important post](https://yoursite.com/blog/post): One-line description.
- [Title of second post](https://yoursite.com/blog/post2): One-line description.
```

Rules:
- H1 is required and must be the first element
- Blockquote (`>`) is the summary — write it precisely, this is often quoted verbatim
- H2 sections group links by topic
- Each link has a colon + one-line description
- File must be at `/llms.txt` (root), return HTTP 200, Content-Type: text/plain

---

## Phase 4: AI Crawler Access

Check `robots.txt`. Add explicit allow rules for every major AI crawler. Categorized by what each one does:

```
# OpenAI — training + retrieval + live browsing
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic — training + retrieval
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

# Google — AI products (separate from Search)
User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

# Perplexity — real-time retrieval
User-agent: PerplexityBot
Allow: /

# Apple Intelligence
User-agent: Applebot-Extended
Allow: /

# ByteDance / TikTok — training
User-agent: Bytespider
Allow: /

# Common Crawl — open training dataset
User-agent: CCBot
Allow: /

# Amazon Alexa AI
User-agent: Amazonbot
Allow: /

# Meta AI
User-agent: FacebookBot
Allow: /
```

If the user wants to block a specific crawler: generate the `Disallow: /` rule and note the tradeoff. Blocking a retrieval crawler (PerplexityBot, OAI-SearchBot) means immediate loss of citations from that engine. Blocking a training crawler (GPTBot, ClaudeBot) affects future model versions only.

---

## Phase 5: Content Structure for AI Citation

AI engines extract answers from content. Structure matters more than word count.

### Answer-first format
Every section should open with a direct 40-60 word answer to the question implied by the heading. Don't bury the answer after three paragraphs of context.

### Semantic chunking
Each H2/H3 section covers exactly one concept. 200-400 words per section. Don't mix definitions with instructions in the same block.

### Data-backed claims
Include a specific statistic or data point roughly every 150-200 words. Link to the original source. AI engines weight cited content higher in RAG retrieval. Vague claims ("many users") reduce citation probability.

### Entity consistency
Use your brand name, product name, and key terms consistently throughout. Define key terms on first mention. Link to authoritative external sources (Wikipedia, industry standards bodies) where relevant.

### Content freshness
AI engines weight recency. Update high-value pages quarterly — add new data, updated examples, current stats. Perplexity in particular favors fresh, well-cited articles.

---

## Phase 6: Content Gap Analysis

AI engines need direct answers to common questions about the product. Check if the landing page or docs covers each of these. Generate the missing content block for any that are absent:

**"What is [Product]?"** — answerable in 40-60 words on the landing page, not just a tagline.

**"How does [Product] work?"** — step-by-step with HowTo schema.

**"Is [Product] free?"** — clear pricing. Vague pricing = AI engines skip the citation.

**"[Product] vs [Competitor]?"** — if this comparison doesn't exist on your site, AI engines will pull competitor sources when users ask.

**"How do I get started?"** — quick-start guide. If onboarding is complex, summarize it on the landing page.

For each missing piece: generate the copy block and the matching schema together.

---

## Phase 7: Citation Strategy

AI engines synthesize from articles that rank on Google. Getting into those articles is a secondary citation path.

1. Search "best [your category] tools 2026" — find the top 10 ranking articles
2. Note: publication, whether it's actively maintained, whether it accepts submissions
3. Generate a pitch angle per article — what's unique about this product vs tools already listed

Output a table:

```
Article | Publication | Updated | Accepts Submissions | Pitch Angle
[title] | [pub]       | [date]  | yes/no              | [one sentence]
```

Use `/cold-email` to draft the outreach.

---

## Phase 8: Audit Report

```
AEO AUDIT — [project name]
════════════════════════════════════════
Schema Markup         [score /10]  [❌ missing / ⚠️ partial / ✅ done]
FAQ Content           [score /10]  [status]
llms.txt              [score /10]  [status]
AI Crawler Access     [score /10]  [status]
Content Structure     [score /10]  [status]
Citation Readiness    [score /10]  [status]
────────────────────────────────────────
Overall               [score /60]
════════════════════════════════════════
```

List the 3 highest-impact fixes in order.

---

## Verify

```
[ ] SoftwareApplication schema in <head> of main layout
[ ] FAQPage schema with at least 4 questions (include a vs-competitor question)
[ ] Every FAQ answer is 40-60 words
[ ] HowTo schema on getting-started content
[ ] BlogPosting schema on every blog post
[ ] BreadcrumbList on all pages more than one level deep
[ ] llms.txt at root — H1, blockquote, 10-40 curated links with descriptions
[ ] robots.txt allows all 13 AI crawlers listed above
[ ] Every content section opens with a direct answer
[ ] At least one data point with a source citation per 200 words
[ ] Content gap analysis done — missing answers generated
[ ] Citation strategy table output
[ ] Audit report with scores output
```
