# Search Console baseline — 2026-09-01

Scope: Google Search Console Web exports supplied by Tushar for `https://www.slashskills.xyz`, reviewed 2026-09-01 from Asia/Kolkata. This is a pre-deployment baseline for the existing `/guides/cursor` update, not a causal performance claim.

## Property baseline

| Export | Available period | Clicks | Impressions | CTR | Impression-weighted position |
| --- | --- | ---: | ---: | ---: | ---: |
| Last 7 days | 2026-08-25 through 2026-08-29 | 1 | 462 | 0.22% | 61.10 |
| Last 24 hours | 2026-08-31 04:30 through 2026-09-01 03:30, UTC+05:30 | 0 | 86 | 0% | 63.84 |

The seven-day export contains five available daily rows, so the table reports the exported period rather than assuming two missing days had zero activity.

## Cursor guide baseline

| Export | Clicks | Impressions | Share of property impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: | ---: |
| Last 7 days | 0 | 234 | 50.65% | 0% | 65.11 |
| Last 24 hours | 0 | 55 | 63.95% | 0% | 64.78 |

The visible seven-day query table contains 96 impressions; 60 include `cursor`. Search Console can omit anonymized queries from the query table while retaining them in aggregate totals, so query rows must not be treated as the complete demand set.

## Decision and measurement

- Update the existing `/guides/cursor` URL. It already owns the observed intent and more than half of current impressions; a new article would split a weak ranking signal.
- Cover installation, project versus global scope, one-message invocation versus persistent Custom Mode, skills versus rules/commands/plugins, and portable versus Cursor-only fields.
- Preserve the canonical URL and add no new sitemap entry.
- After deployment, compare the same page in Search Console after 14 and 28 complete days. Primary measures: clicks, impressions, CTR, and position for `/guides/cursor`. Secondary measure: visible Cursor-intent query coverage.
- Do not call the update successful from impressions alone. Look for movement out of the mid-60s and the first non-branded clicks while checking that broader property performance did not create the change.

## Source artifacts

- `/Users/tushaarmehtaa/Downloads/https___www`: Search Console “Last 7 days” export.
- `/Users/tushaarmehtaa/Downloads/https___www-2`: Search Console “Last 24 hours” export.
- Google documentation: [anonymized queries are omitted from query tables but included in chart totals](https://support.google.com/webmasters/answer/7576553).
