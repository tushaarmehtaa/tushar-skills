# Search for Driftwood - raw notes (synthetic sample)

Driftwood = our recipe-sharing app. ~180k recipes, growing ~6k/month. Postgres 16 on a managed host. Team: 4 engineers, nobody owns search full time.

Problem: current search is `ILIKE '%term%'` on title only. Support tickets tagged "search" went from 14 in May to 41 in August. Users want ingredient search ("chickpea"), typo tolerance ("chikpea"), and filters (diet, cook time).

Options we talked about:
1. Postgres full-text search (tsvector + GIN index, pg_trgm for typos). No new infra. Maya prototyped it in 2 days: p95 38ms on a prod snapshot. Typo tolerance with pg_trgm is "okay, not great". Faceted counts would need hand-written queries.
2. Meilisearch self-hosted. Great typo tolerance and facets out of the box. Need to run + monitor another service and build a sync pipeline from Postgres. Sam estimates 2 weeks to production-ready.
3. Algolia (hosted). Best relevance tooling, zero ops. Quote we got: about $1,100/month at our projected volume. Finance said anything over $500/month recurring needs CFO sign-off.

Constraints: launch the new search before the January "healthy eating" campaign (Jan 6). Nobody wants a new on-call rotation.
Unknowns: how much typo tolerance actually matters vs ingredient search; we don't log zero-result queries today.
Opinions: Maya prefers Postgres. Sam prefers Meilisearch. Priya (PM) cares most about filters.
Decision owner: Priya. Needs to be decided by Oct 20.
