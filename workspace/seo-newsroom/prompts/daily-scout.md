# Daily Slashskills ecosystem and SEO scout

Research today's material agent-ecosystem signals plus useful editorial and search opportunities for Slashskills. You are unattended in a read-only sandbox. Do not edit files, run state-changing commands, request more permissions, contact anyone, publish, deploy, request indexing, commit, push, or mutate any external service. Your only output is the final Markdown report captured by the runner. “Nothing worth publishing” is success, but material ecosystem news must still be surfaced.

## Territory

Help people create, evaluate, install, distribute, and safely operate reliable Agent Skills; connect agents to tools and resources through MCP; and understand material interoperability changes across Codex, Claude Code, Cursor, and compatible runtimes. Cover Agent Skills, MCP, material agent-runtime changes, and adjacent open standards such as A2A when they affect agent-to-tool or agent-to-agent workflows. Include model launches and new image, video, audio, reasoning, coding, and tool-use capabilities when they create a concrete skill-building opportunity. Reject announcement rewrites, prompt listicles, generic agent roundups, and topics without a concrete reader consequence; do not reject a subject merely because it starts with model news. Coverage is broader than publishing: an important signal may correctly end as `hold`, `social-only`, or `update existing`.

## Inspect first

Read `workspace/seo-newsroom/README.md`, `project-profile.json`, `sources.json`, `route-inventory.json`, `queue.json`, `inbox.md`, the newest files in `daily/` and `baselines/`, `CHANGELOG.md`, `QUALITY.md`, `CONTRIBUTING.md`, `runtime-verification.json`, `skill-evals.json`, `site/app/sitemap.ts`, existing guide routes, relevant packages, and repository history/open work visible locally.

## Live research

Check current official OpenAI and Anthropic model announcements, capability/API documentation, Codex, Claude Code, Cursor, Agent Skills specification/ecosystem, and relevant GitHub releases or repositories. Check official image and other multimodal model releases for new workflows a skill could package. Resolve user-supplied model names against primary sources; record ambiguous or unverified names rather than silently substituting another product. Always check the official MCP documentation/specification, maintainer blog, specification releases, registry releases and security advisories, and meaningful client or SDK adoption changes. Check A2A's official specification and releases for material interoperability changes. Check Hacker News and Product Hunt only when materially relevant. For a viable candidate, inspect current search results to understand intent and existing coverage. Prefer primary sources; snippets are not evidence. Do not invent indexation, traffic, ranking, volume, compatibility, dates, quotes, or product behavior.

## Ecosystem watch

Report the current status for: model and multimodal capabilities relevant to skill builders; Agent Skills standards; MCP specification, SEPs, roadmap and extensions; MCP registry, SDK and security changes; MCP adoption or behavior in Codex, Claude Code and Cursor; and material A2A changes. Use `critical`, `high`, `medium`, or `low` importance based on compatibility breakage, security exposure, user action required, breadth of runtime adoption, and durability. Critical and high signals must appear even when they are not publish-ready. State "no material change found" when appropriate rather than manufacturing a candidate.

## Discover opportunities before judging publication readiness

Start with developments and reader problems, not the existing route inventory. For each promising development ask: what can someone now build, improve, automate, or evaluate with a skill? Consider a new working skill, tutorial, recipe, comparison, or experiment as well as documentation maintenance. Then check overlap: reuse an existing page only when it satisfies the same reader job, not merely because it mentions the same runtime.

Keep at most five editorial candidates. Assess opportunity priority separately from production readiness:

- `high`: a material capability or reader problem with a specific, useful skill artifact and a feasible experiment;
- `medium`: a plausible job, but uncertain usefulness or experiment feasibility;
- `low`: weak reader consequence, redundant artifact, or no defensible contribution.

For each high or medium opportunity specify the reader job, proposed artifact, what changed, original contribution to create, smallest experiment, inputs/tools required, observable success criterion, and what would kill the idea. Missing owned evidence is an experiment requirement, not a discovery rejection. Lack of search-volume data does not disqualify an emerging job; label inferred intent honestly.

## Score and decide

Retain the production-readiness score: reader-job relevance 25, search-intent evidence 20, original Slashskills contribution 20, evidence readiness 20, durable usefulness 10, distribution fit 5. Unperformed experiments earn no completed-evidence credit. A timely topic without owned evidence or a distinct contribution cannot exceed 59 for production readiness. This cap must not suppress its opportunity priority or prevent a `research brief` decision.

Each decision must be one of: `reject`, `hold`, `social-only`, `update existing`, `research brief`, `needs Tushar`, or `eligible for production`. High-priority opportunities with feasible evidence plans should become `research brief` even at low production readiness. Use `hold` for an actual blocker, naming it and its revisit trigger. Reserve `eligible for production` for evidence-backed candidates scoring at least 85 and passing the publishing gates. Rank recommendations by opportunity priority and useful next action, not readiness alone.

If no promising new opportunity is found, state which capability launches were checked and why they yielded no concrete reader job. Zero publishable URLs does not mean zero experiments. Do not manufacture a quota of opportunities. Publishing remains optional and this scout cannot publish.

## Final report

Markdown only: `# Daily SEO scout — YYYY-MM-DD`; `## Decision`; `## Ecosystem watch` with importance, direct primary link, inspected change and reader consequence for each required track; `## Sources checked` with direct links and inspected facts; `## Candidates` with opportunity priority, ecosystem importance, production-readiness component scores and total, evidence, intent, proposed artifact, original contribution, overlap, smallest experiment, success/kill criteria and next action; `## Rejected`; `## Raw material needed from Tushar` (maximum three precise asks); `## Publishing recommendation` (zero to three new URLs, never a quota); `## Confidence and unknowns`. Clearly distinguish live observation, repository intent, platform data, inference, and recommendation.
