# Slashskills SEO newsroom bootstrap prompt

Paste the prompt below into Codex while the working directory is
`/Users/tushaarmehtaa/Dev/active/tushar-skills`.

```text
/goal Build and activate a complete, project-specific SEO newsroom for Slashskills.

You are working in /Users/tushaarmehtaa/Dev/active/tushar-skills.

Do the entire job end to end. Do not stop after giving me a plan, do not ask me to
copy commands, and do not create a PR. Make reasonable, reversible assumptions.
Only ask me a question if a missing decision would materially change the product
or authorize an external action you cannot safely infer.

FIRST: UNDERSTAND BOTH SYSTEMS

1. Read this repository completely enough to understand:
   - the product and audience;
   - https://www.slashskills.xyz and the Next.js site under site/;
   - the skill catalog, runtime verification, QUALITY.md, CONTRIBUTING.md,
     CHANGELOG.md, drafts, guides, and existing search-ready skill;
   - deployment, tests, validation, and the conversion action.

2. Read these working Bangers Only SEO newsroom references. Use their operating
   model, guardrails, state machine, scheduling approach, and publishing ledger,
   but do not copy their product topics, voice, URLs, or assumptions:
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/seo-newsroom/README.md
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/seo-newsroom/START-HERE.md
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/seo-newsroom/daily-scout-prompt.md
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/seo-newsroom/queue.json
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/seo-newsroom/publishing-ledger.json
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/seo-newsroom/tweet-inbox.md
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/workspace/playbooks/seo-newsroom.md
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/scripts/run_seo_newsroom_scout.sh
   - /Users/tushaarmehtaa/Dev/active/tweetbuzz/scripts/seo_newsroom_guard.py

PROJECT POSITIONING

Slashskills is not a generic AI-news blog. Its editorial territory is:

“Help people create, evaluate, install, distribute, and safely operate reliable
Agent Skills; connect agents to tools and resources through MCP; and understand
material interoperability changes across Codex, Claude Code, Cursor, and
compatible runtimes.”

A story is relevant only when it materially changes one of those jobs. Reject
generic model news, prompt listicles, generic AI-agent roundups, rewritten release
notes, and search-first variations with no original evidence.

Coverage is broader than publishing. The scout must surface material Agent Skills,
MCP, agent-runtime, security, and adjacent interoperability developments even when
the correct decision is hold, social-only, update existing, or no publication.

The strongest owned evidence is already in the repo:
   - real skill packages and bundled references;
   - runtime verification and compatibility records;
   - validation rules and behavioral evals;
   - repository history and changelog;
   - implementation lessons from real projects;
   - the ability to run controlled cross-runtime skill tests.

BUILD THE SYSTEM

Create a project-specific newsroom under workspace/seo-newsroom/ containing at
minimum:
   - README.md with the editorial constitution, scoring, candidate states,
     evidence rules, publishing gate, attribution rules, and kill criteria;
   - START-HERE.md that lets a new Codex session recover the entire system;
   - project-profile.json;
   - sources.json;
   - route-inventory.json;
   - queue.json;
   - publishing-ledger.json with Asia/Kolkata timezone and a maximum of three new
     indexable URLs per day as a hard ceiling, never a quota;
   - inbox.md for URLs, customer questions, skill ideas, and runtime changes;
   - daily/, research/, baselines/, experiments/, distribution/, checkpoints/,
     runs/ and prompts/ directories as appropriate;
   - a read-only daily scout prompt;
   - a durable operating playbook.

Create a guard script that:
   - reports how many new indexable URLs have been published today in IST;
   - blocks a fourth URL;
   - records a URL only after production verification;
   - rejects duplicate paths and URLs;
   - has focused tests.

Create a daily scout runner modeled on Bangers Only, but customized for this repo.
It must:
   - run Codex ephemerally in a read-only sandbox;
   - use live web research;
   - write only its final report into a gitignored runs directory;
   - use a lock and durable log;
   - never edit product code, commit, push, deploy, request indexing, publish,
     contact anyone, or mutate external services;
   - treat “nothing worth publishing” as success.

Schedule it locally for 08:20 Asia/Kolkata every day so it does not collide with
the Bangers Only 08:00 scout. Preserve all existing crontab entries. The Mac may
sleep, so also create a safe catch-up mechanism that runs at most once per IST day
after the machine becomes available. It must never create overlapping runs.

The scout should inspect current, authoritative sources such as:
   - official OpenAI/Codex documentation and announcements;
   - official Anthropic/Claude Code documentation and announcements;
   - official Cursor documentation and changelog;
   - the Agent Skills specification/ecosystem;
   - official MCP documentation, specification, SEPs, maintainer blog, roadmap,
     registry, SDK releases, security advisories, and client adoption changes;
   - official A2A specification and releases when they materially affect agent
     interoperability or the boundary between agent-to-tool and agent-to-agent work;
   - relevant GitHub releases and repositories;
   - Hacker News and Product Hunt only when materially relevant;
   - this repository’s open work, changelog, runtime records, validation rules,
     existing guides/pages, and inbox;
   - current search results for a candidate when assessing search intent.

It must return no more than five scored candidates and make one of these decisions:
reject, hold, social-only, update existing, research brief, needs Tushar, or
eligible for production. Publishing remains optional.

TECHNICAL SEARCH BASELINE

Audit the live production site and repository intent separately. Inspect and
record representative behavior for:
   - canonical host and redirects;
   - robots.txt and sitemap coverage;
   - indexable route classes;
   - canonicals, metadata, social previews, and structured data;
   - status codes and accidental soft-404/thin/orphan behavior;
   - internal linking;
   - server-rendered accessibility of important content;
   - mobile and desktop rendering;
   - current analytics/Search Console inputs if locally available.

Do not invent indexation, traffic, ranking, or search-volume claims. Store the
dated baseline and distinguish live observation, repository intent, platform
data, inference, and recommendation.

Implement only low-risk technical blockers that are clearly supported by the
audit and consistent with the existing site. Do not create a generic blog merely
because one is absent. First decide whether the right search surface is guides,
compatibility evidence, skill teardowns, evaluations, changelog-derived pages,
or improvements to existing skill pages. Preserve the existing design system.

INITIAL RESEARCH AND QUEUE

Run the scout once manually after installation. Convert its useful findings into
a reviewed initial queue inside the repo. Also derive durable opportunities from
the existing repository, including:
   - installation and operation guides;
   - runtime compatibility questions;
   - controlled cross-runtime evaluations;
   - evidence-backed skill teardowns;
   - standards changes with practical consequences;
   - updates to existing pages when a new URL is not justified.

Do not publish an article during bootstrap unless the repository already contains
all necessary evidence and the page has clearly distinct intent. The purpose of
bootstrap is to make the system operational, not manufacture content.

QUALITY AND AUTHORITY RULES

   - Scheduled work is report-only.
   - Active reviewed sessions may research, write, test, commit, push directly to
     main, and verify production. No PR is required unless repository instructions
     require one.
   - Never fabricate firsthand experience, compatibility, outcomes, benchmarks,
     search demand, or product behavior.
   - Prefer updates to existing pages over cannibalizing new URLs.
   - Every factual compatibility claim needs a verification record or primary
     source.
   - Every new page needs a defined reader job, distinct intent, useful original
     contribution, internal links, metadata, canonical, sitemap treatment,
     appropriate structured data, and mobile/desktop verification.
   - No unattended agent may publish, deploy, send outreach, request indexing, or
     alter analytics/search-platform configuration.

VERIFY EVERYTHING

Run the repository’s existing checks plus focused tests for the newsroom guard
and runner. Verify the installed schedule, lock behavior, log path, gitignore,
manual scout completion, generated report, clean failure behavior, and that the
scheduled prompt cannot mutate the repository.

Inspect git status before editing, preserve unrelated user changes, use small
coherent commits, and push directly to main only after all relevant checks pass.
Verify the resulting production deployment if site files changed. Do not claim
Search Console indexing unless Search Console actually confirms it.

DONE WHEN

   - the Slashskills-specific newsroom and recovery documentation exist;
   - the technical baseline and route inventory are recorded;
   - the daily scout and safe once-per-day catch-up are installed and verified;
   - a manual live scout has completed successfully;
   - the initial queue contains evidence-backed, non-generic opportunities;
   - publishing limits and kill criteria are enforceable;
   - tests and repository checks pass;
   - any approved low-risk technical fixes are deployed and verified;
   - commits are on main and the worktree is clean;
   - your final response tells me only: what is now running, today’s scout
     decision, anything you need from me, and the exact one-line command I can use
     in a future session to resume the newsroom.
```
