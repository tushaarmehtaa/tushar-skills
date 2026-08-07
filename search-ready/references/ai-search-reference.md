# Conditional AI-search patterns

Use only the pattern justified by the main workflow and current primary documentation.

## Entity-oriented structured data

Prefer a small connected graph sourced from visible content over many disconnected blocks. Typical relationships can include:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Example",
      "url": "https://example.com/"
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "publisher": { "@id": "https://example.com/#organization" }
    }
  ]
}
```

Adapt types and properties to the actual entity. Do not add an offer, rating, price, author, or claim that is absent or unsupported on the page.

## Optional `llms.txt` shape

If current evidence justifies the experiment:

```markdown
# Product or documentation name

> Accurate definition for the intended audience.

## Documentation
- [Getting started](https://example.com/docs/start): Scope and contents.
- [Reference](https://example.com/docs/reference): Scope and contents.

## Policies or status
- [Security](https://example.com/security): Current security information.
- [Status](https://status.example.com/): Service status.
```

Use canonical, public, maintained URLs. A link description should describe the resource, not make a promotional claim.

## Crawler policy record

Before editing `robots.txt`, record:

| Operator/user agent | Documented purpose | Desired policy | Official source | Retrieved | Live verification |
|---|---|---|---|---|---|

Generate rules from this record and existing wildcard groups. Verify syntax and live CDN response. Do not copy a frozen universal bot list.

## Answer/content evidence table

```text
Audience question
Current live answer and URL
Observed result/source landscape and date
Missing evidence or clarity
Proposed user-facing improvement
Schema/entity change, if justified
Measurement and limitation
```

## Comparison content

Fair comparisons should state:

- audience/use case for each option;
- source and date for pricing/features;
- evaluation method and environment;
- limitations and conflicts of interest;
- where the competitor is a better fit.

Avoid unsourced feature checkmarks and pages generated only to capture competitor queries.

## Outreach evidence record

Keep outside the send-ready message:

- article/resource URL and last meaningful update;
- author/editor role and contact source;
- submission/link policy;
- exact omission or factual update;
- proof the proposed resource adds;
- disclosure or commercial relationship.
