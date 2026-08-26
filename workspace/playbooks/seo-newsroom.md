# Slashskills SEO newsroom operating playbook

The daily cron starts `scripts/run_seo_newsroom_scout.sh` at 08:20 Asia/Kolkata. A catch-up check runs later and starts the same guarded runner only when the IST date has no completed report and the scheduled time has passed. The runner uses an atomic lock, ephemeral Codex session, read-only sandbox, live search, ignored output directory, and durable `/private/tmp/slashskills-seo-newsroom-scout.log`. Existing reports make repeat calls a successful no-op.

## Daily review

Read the newest raw report, verify primary sources, save the reviewed result in `daily/YYYY-MM-DD.md`, and update `queue.json`. The scheduled process cannot do this. Reject weak or overlapping candidates; no publication is the normal outcome.

## Active production

For an approved candidate, map claims to evidence, decide existing route versus new URL, implement, test, and verify production. Before creating a URL run `python3 scripts/seo_newsroom_guard.py can-publish`. After a 2xx production response, self-canonical, intended indexability, sitemap/internal-link treatment, metadata/schema, and mobile/desktop checks all pass, run `python3 scripts/seo_newsroom_guard.py record /path https://www.slashskills.xyz/path content-id`. The guard rejects a fourth IST-day URL and duplicate path, URL, or content ID.

## Failure and recovery

Inspect the log, lock directory, report, cron, and `git status`. A stale lock older than four hours is reported but never deleted automatically; confirm no scout process is active before removing it. A partial report is never promoted because the runner writes a temporary file then validates the required heading before renaming. Failed research does not justify publishing from stale or incomplete evidence.

## Maintenance

Review sources quarterly and whenever official crawler/runtime behavior changes. Re-run the technical baseline after route or deployment changes. Review published pages at 7, 30, and 90 days only using available platform data; record “data unavailable” rather than inferring performance.
