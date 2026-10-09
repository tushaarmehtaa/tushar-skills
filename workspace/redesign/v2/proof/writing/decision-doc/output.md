I've written the decision doc at `docs/search-decision.md`. It recommends building search on Postgres for now: Postgres full-text search for ingredients, pg_trgm for typos, and plain filters. My confidence is medium. I haven't committed the file.

**Why Postgres:** it's the only option that doesn't fail one of the team's hard constraints. Meilisearch would mean running a new service, which breaks "no new on-call." Algolia's ~$1,100/month is over the $500 limit, so it needs CFO sign-off. Postgres also has a working prototype with good speed, adds no cost, and is cheap to switch away from later. The trade-off is weaker typo tolerance, and the counts next to each filter ("Vegan (312)") would have to be hand-written.

**What could flip it.** Your notes leave two gaps that matter, so I added two quick checks to do before the Oct 20 deadline:
- **Sort the 41 August search tickets** into typo, ingredient, filter and other. If typo complaints are the biggest group, Meilisearch becomes the better choice.
- **Get a full Postgres estimate from Maya, including the filter counts.** We have Sam's 2-week estimate for Meilisearch but nothing comparable for Postgres. If Maya's comes in well above that, Postgres loses its main advantage.

**Also in the doc:**
- **Filters vs. counts:** filtering by diet or cook time is easy in Postgres; only the counts are extra work. That's worth checking with Priya, since filters are what she cares about most.
- **Zero-result query logging:** start it now, whichever option wins. A February review uses that data to decide whether to move off Postgres.
- **Both views represented:** Sam's case for Meilisearch is written up fairly as the main counterargument, alongside Maya's preference for Postgres.

**Things I made up — please check:**
- The owners and due dates for the next steps (Priya sorts the tickets, Maya does the estimate and the logging) are my suggestions.
- I assumed Algolia would also need a pipeline to keep it in sync with Postgres. Your notes don't say either way, and the doc labels it as an assumption.