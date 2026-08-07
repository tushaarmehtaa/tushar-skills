# slashskills

**workflows saved as Agent Skills.**

Reusable SKILL.md workflows from real projects. Install them in Codex, Claude Code, or Cursor; see what each skill needs and where it has been tested.

The directory contains 30 focused skills. Each one owns a meaningful outcome rather than a single code snippet.

**[Browse the directory →](https://www.slashskills.xyz)**

## Agent Skills, not runtime-specific prompts

Each directory is a self-contained [Agent Skills](https://agentskills.io) package: a standard `SKILL.md` plus any references needed to run the workflow. The package format is shared, while installation, invocation, and available tools still differ by runtime.

Skill pages render the complete package, including every bundled Markdown reference. Links from `SKILL.md` into specialist guidance stay on the corresponding file and heading, so the directory view is not a shortened preview of the installed skill.

The catalog records those differences explicitly:

- `tested` means a checked-in runtime verification record substantiates the smoke test.
- `untested` means the package is installable but has not completed that test yet.
- `unsupported` means the workflow has a real runtime dependency that prevents equivalent execution elsewhere.

[`CONTRIBUTING.md`](./CONTRIBUTING.md) defines the runtime smoke test and the required verification record. Skills remain `untested` until that evidence is committed.

[`QUALITY.md`](./QUALITY.md) defines the interaction, evidence, execution, and evaluation standard every package is expected to meet.

## Install

Select a package, runtime, and scope in the directory installer. For a deterministic global install, target the runtime explicitly:

```bash
# Codex
npx skills add tushaarmehtaa/tushar-skills --skill <slug> -g -a codex -y

# Claude Code
npx skills add tushaarmehtaa/tushar-skills --skill <slug> -g -a claude-code -y

# Cursor
npx skills add tushaarmehtaa/tushar-skills --skill <slug> -g -a cursor -y
```

Omit `--skill <slug>` to install every skill. See the runtime guides for project-scoped installs, invocation, updates, removal, reload behavior, and known limitations:

- [Codex guide](https://www.slashskills.xyz/guides/codex)
- [Claude Code guide](https://www.slashskills.xyz/guides/claude-code)
- [Cursor guide](https://www.slashskills.xyz/guides/cursor)
- [Compatibility matrix](https://www.slashskills.xyz/compatibility)

## Claude app

Only chat-capable skills expose Claude app upload instructions. Skills that need a repository, shell, or local browser show **local coding agent required** instead. Their ZIP files remain available for inspection, but uploading one does not provide execution equivalent to a local coding agent.

See the [Claude app guide](https://www.slashskills.xyz/guides/claude-app) for the supported upload path.

## Skill catalog

This table is generated from the same catalog and frontmatter used by the site. Do not edit the generated block by hand; run `npm run catalog:sync` after changing catalog metadata or a description.

<!-- BEGIN GENERATED SKILL CATALOG -->
| Skill | Category | What it does and when to use it |
| --- | --- | --- |
| [`agent-instructions`](./agent-instructions/SKILL.md) | workflow | Create or reconcile scoped AGENTS.md, CLAUDE.md, and Cursor rules from repository evidence. Use when coding-agent guidance is missing, stale, duplicated, or conflicting. |
| [`ai-cost-audit`](./ai-cost-audit/SKILL.md) | ai | Audit AI usage, billing, unit economics, routing, caching, batching, and optimization. Use when AI cost, margin, pricing, model choice, or savings must be measured or verified. |
| [`ai-product-development`](./ai-product-development/SKILL.md) | ai | Design, implement, or audit production AI features with model selection, streaming UX, tool use, safety, evaluation, observability, and cost controls. Use when building AI into an app. |
| [`analytics`](./analytics/SKILL.md) | analytics | Plan, implement, or audit analytics, error monitoring, health checks, dashboards, and reporting. Use when designing events, consent-aware tracking, incident visibility, or observability. |
| [`auth-implementation`](./auth-implementation/SKILL.md) | auth | Implement authentication, authorization, tenant isolation, sessions, and protected routes. Use when adding sign-in, identity sync, provider integration, account linking, roles, or access control. |
| [`changelog`](./changelog/SKILL.md) | workflow | Turn a verified git range into audience-appropriate changelog copy and optional visual assets. Use when preparing weekly updates, release summaries, or social changelog cards. |
| [`cold-outreach`](./cold-outreach/SKILL.md) | marketing | Research, write, audit, and improve cold messages, introductions, replies, and sequences. Use when contacting prospects, investors, partners, candidates, or other professional recipients. |
| [`credit-metering`](./credit-metering/SKILL.md) | monetization | Implement or audit usage credits with atomic reservations, spending, grants, purchases, expiration, refunds, limits, UI state, and an immutable ledger. Use when an app meters consumable usage. |
| [`decision-doc`](./decision-doc/SKILL.md) | planning | Facilitate, research, write, or audit decision records with options, evidence, tradeoffs, ownership, and review triggers. Use when a person or team must choose or document an approach. |
| [`demo-video`](./demo-video/SKILL.md) | workflow | Plan, script, build, and verify Remotion product demos, walkthroughs, launch clips, and explainers. Use when a product or technical claim needs a storyboard or rendered video. |
| [`deploy-check`](./deploy-check/SKILL.md) | devops | Run a production preflight across release scope, tests, builds, secrets, migrations, dependencies, configuration, observability, and rollback. Use when deploying, pushing, or approving a release. |
| [`email-with-resend`](./email-with-resend/SKILL.md) | infrastructure | Implement or audit Resend email with templates, queues, preferences, audiences, campaigns, webhooks, and delivery safety. Use when an app needs consent-aware email or Resend repair. |
| [`fundraising`](./fundraising/SKILL.md) | planning | Assess venture fit, pitches, investors, round plans, meetings, and diligence. Use when founders are deciding whether to raise, preparing a raise, or improving an active fundraising process. |
| [`interface-design`](./interface-design/SKILL.md) | design | Design and implement production web interfaces from product, content, brand, and interaction evidence. Use when creating or redesigning pages, dashboards, workflows, or components. |
| [`landing-copy`](./landing-copy/SKILL.md) | marketing | Research, audit, or write evidence-backed landing-page messaging, proof, objections, and calls to action. Use when product, pricing, campaign, or waitlist pages need clearer positioning. |
| [`payments-with-dodo`](./payments-with-dodo/SKILL.md) | payments | Implement or repair Dodo Payments checkout, subscriptions, webhooks, entitlements, billing UI, refunds, and verification. Use when adding Dodo billing or auditing its full lifecycle. |
| [`performance-diagnosis`](./performance-diagnosis/SKILL.md) | devops | Diagnose web-app performance across build, server, browser, database, and network paths. Use when investigating slowness, resource spikes, reload loops, regressions, bloat, or poor Web Vitals. |
| [`product-experiments`](./product-experiments/SKILL.md) | analytics | Design, implement, validate, analyze, and conclude experiments or safe rollouts. Use when testing product behavior with flags, exposure tracking, metrics, staged releases, or A/B tests. |
| [`product-launch`](./product-launch/SKILL.md) | marketing | Plan, implement, audit, or review launches with positioning, assets, distribution, conversion, measurement, waitlists, and follow-up. Use when preparing or learning from a product launch. |
| [`product-spec`](./product-spec/SKILL.md) | planning | Create or audit product briefs and buildable specs covering scope, flows, data, permissions, rollout, and acceptance. Use when planning a new product or a change before implementation. |
| [`product-teardown`](./product-teardown/SKILL.md) | workflow | Produce evidence-backed product or competitor teardowns and transferable principles. Use when analyzing positioning, copy, UX, onboarding, pricing, trust, design, or visible retention loops. |
| [`rate-limit`](./rate-limit/SKILL.md) | devops | Implement or audit Upstash Redis rate limits with trusted user, tenant, API-key, or IP identifiers, 429 headers, and outage behavior. Use when protecting Next.js routes from abuse or cost. |
| [`readme`](./readme/SKILL.md) | workflow | Audit, write, and verify README files for adoption, operation, contribution, or internal orientation. Use when repository documentation is missing, inaccurate, or hard to follow. |
| [`remove-ai-slop`](./remove-ai-slop/SKILL.md) | workflow | Audit and remove AI-like design and copy defaults using rendered evidence and confidence scoring. Use when reviewing an interface for generic or repetitive patterns. |
| [`search-ready`](./search-ready/SKILL.md) | seo | Audit, implement, or verify technical SEO, indexation, content, schema, social previews, and AI discovery. Use when preparing or maintaining a live site for search and answer engines. |
| [`skill-creator`](./skill-creator/SKILL.md) | meta | Create, improve, merge, and validate portable Agent Skill packages with adaptive workflows and behavioral evals. Use when authoring or reconstructing SKILL.md packages. |
| [`social-sharing`](./social-sharing/SKILL.md) | marketing | Audit, implement, and verify canonical URLs, social metadata, preview images, and share links. Use when shared routes are missing, stale, generic, private, or incorrect. |
| [`supabase`](./supabase/SKILL.md) | devops | Set up, extend, or audit Supabase schema, grants, RLS, migrations, typed clients, storage, and external auth. Use when integrating Supabase or repairing data access and tenant isolation. |
| [`ui-copy`](./ui-copy/SKILL.md) | workflow | Audit, write, and implement interface language across actions, forms, states, errors, progress, and notifications. Use when product copy must match system behavior and voice. |
| [`user-insights`](./user-insights/SKILL.md) | analytics | Analyze behavioral segments, retention, activation, funnels, adoption, churn, and monetization. Use when product, event, billing, or qualitative data must inform a product decision. |
<!-- END GENERATED SKILL CATALOG -->

## Contributing

Contributions should preserve the portable Agent Skills package contract. Start with [CONTRIBUTING.md](./CONTRIBUTING.md), then run:

```bash
npm run catalog:sync
npm run check
npm --prefix site test --if-present
npm --prefix site run build
```

Validation covers standard frontmatter, naming, licensing, description portability, line limits, safe relative links and heading fragments, bundled-reference structure and reachability, behavioral eval coverage, catalog coverage, generated ZIP contents, and this README catalog.

## V1 scope

V1 supports local Agent Skills in Codex, Claude Code, and Cursor, plus a capability-gated Claude app path for chat workflows. Copilot, Gemini, and OpenAI plugin packaging are outside v1.

## License

[MIT](./LICENSE) © 2026 Tushar Mehta.
