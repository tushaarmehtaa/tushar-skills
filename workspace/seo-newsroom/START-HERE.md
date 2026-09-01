# SEO newsroom — start here

Read this file at the start of every Slashskills SEO session. Do not rely on chat history.

## Current system

- Daily read-only Agent Skills, MCP, runtime, and interoperability scout: 08:20 Asia/Kolkata via local cron.
- Missed-run catch-up: periodic local cron check, at most once per IST date and never overlapping.
- Runner: `scripts/run_seo_newsroom_scout.sh`; catch-up: `scripts/run_seo_newsroom_catchup.sh`.
- Raw report: `workspace/seo-newsroom/runs/YYYY-MM-DD.md`; durable log: `/private/tmp/slashskills-seo-newsroom-scout.log`.
- Rules: `workspace/seo-newsroom/README.md`; playbook: `workspace/playbooks/seo-newsroom.md`.
- Reviewed state: `queue.json`, `publishing-ledger.json`, newest `daily/` report, and newest baseline.

## Recovery sequence

1. Run `git status --short --branch` and inspect the latest three commits.
2. Read this file, `README.md`, `queue.json`, `publishing-ledger.json`, the newest raw run and reviewed daily report.
3. Run `python3 scripts/seo_newsroom_guard.py status`.
4. Verify cron with `crontab -l`; inspect the log and `runs/` directory.
5. Review the scout report. Promote useful evidence into `daily/` and update the queue only in an active reviewed session.
6. Prefer existing-page updates. Before a new indexable URL run `can-publish`; after deployment verification run `record <path> <url> <content-id>`.

## Non-negotiable boundaries

The unattended scout is report-only and read-only. It never changes this repository or any external system. Three new indexable URLs per IST day is a ceiling. Compatibility claims need a verification record or primary source. Search-platform claims require actual platform data. No article is published merely because a scout found a topic.

## Inputs from Tushar

Add URLs, customer questions, skill ideas, or runtime changes to `inbox.md`. A candidate needing firsthand evidence may ask for at most three precise inputs. Otherwise the newsroom should operate without intervention.

## Resume command

`cd /Users/tushaarmehtaa/Dev/active/tushar-skills && codex "Read workspace/seo-newsroom/START-HERE.md completely, recover the newsroom state, process the latest scout, and continue the highest-value safe action end to end."`
