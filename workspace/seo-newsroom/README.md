# Slashskills SEO newsroom

This is the durable operating record for research about reliable Agent Skills. It helps people create, evaluate, install, distribute, and safely operate skills across Codex, Claude Code, Cursor, and compatible runtimes. Research is daily; publishing is optional.

## Editorial constitution

1. A candidate must materially change one of those reader jobs. Reject generic AI news, prompt lists, agent roundups, rewritten release notes, and search-first variations without original evidence.
2. Prefer an existing skill, guide, compatibility page, or changelog update when it satisfies the intent. A new URL requires distinct intent and a useful original contribution.
3. Owned evidence is strongest: checked-in packages, references, validation rules, behavioral evals, runtime verification records, controlled tests, repository history, and implementation lessons.
4. Important claims require a primary source or a dated verification record. Search snippets are discovery aids, not sources. Never invent firsthand experience, compatibility, benchmarks, demand, traffic, rankings, or product behavior.
5. Scheduled work is report-only. It may not edit, publish, deploy, commit, push, request indexing, contact anyone, or mutate an external service.
6. Active reviewed sessions may research, implement, test, commit, push to `main`, and verify production. A production URL is recorded only after verification.
7. Maximum three new indexable URLs per Asia/Kolkata calendar day. This is a hard ceiling, never a quota.

## Candidate states and decisions

Workflow states are `discovered`, `researching`, `needs_tushar`, `ready`, `writing`, `qa`, and `published`. Terminal or alternate states are `hold`, `social_only`, `update_existing`, and `rejected`.

Scout decisions are exactly: `reject`, `hold`, `social-only`, `update existing`, `research brief`, `needs Tushar`, or `eligible for production`.

## Scoring

- Reader-job relevance: 25
- Search-intent evidence: 20
- Original Slashskills contribution: 20
- Evidence readiness: 20
- Durable usefulness: 10
- Distribution fit: 5

Thresholds: 0–39 reject; 40–59 hold; 60–74 social-only or update existing; 75–84 research brief or needs Tushar; 85–100 eligible for production. A timely subject without owned evidence or a distinct Slashskills contribution cannot score above 59.

## Attribution and evidence

Record the source URL, publisher, retrieval date, claim supported, and whether it is primary. Quote sparingly and link to originals. Compatibility claims must cite `runtime-verification.json`, a reproducible controlled test in `research/`, or current official runtime documentation. Separate live observation, repository intent, platform data, inference, and recommendation.

## Publishing gate

Before a new URL: confirm reader job, distinct intent, no cannibalization, evidence map, maintained owner, internal links, metadata, self-canonical, sitemap treatment, appropriate visible-content schema, server-rendered content, mobile and desktop rendering, relevant tests/build, production response, and `python3 scripts/seo_newsroom_guard.py can-publish`. Record only after production verification with `record`.

## Kill criteria

Reject or stop work when the candidate is generic news; only paraphrases a source; lacks a defensible Slashskills contribution; duplicates an existing route; requires fabricated experience or unverified compatibility; has no maintainable evidence owner; depends on unsupported search-volume/ranking claims; or creates more maintenance and indexable surface than reader value. “Nothing worth publishing” is success.

## Files

- `START-HERE.md`: recovery instructions.
- `project-profile.json`, `sources.json`, `route-inventory.json`: product and evidence map.
- `queue.json`: reviewed candidates; unattended scouts never mutate it.
- `publishing-ledger.json`: verified new URLs and daily ceiling.
- `inbox.md`: raw URLs, questions, skill ideas, and runtime changes.
- `prompts/daily-scout.md`: unattended read-only contract.
- `baselines/`: dated live/repository audits; `daily/`: reviewed reports; `runs/`: ignored raw output.
- `research/`, `experiments/`, `distribution/`, `checkpoints/`: evidence through the publication lifecycle.
