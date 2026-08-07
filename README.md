# slashskills

**workflows saved as Agent Skills.**

Reusable SKILL.md workflows from real projects. Install them in Codex, Claude Code, or Cursor; see what each skill needs and where it has been tested.

The directory contains 30 focused skills. Each one owns a meaningful outcome rather than a single code snippet.

**[Browse the directory →](https://www.slashskills.xyz)**

## Agent Skills, not runtime-specific prompts

Each directory is a self-contained [Agent Skills](https://agentskills.io) package: a standard `SKILL.md` plus any references needed to run the workflow. The package format is shared, while installation, invocation, and available tools still differ by runtime.

The catalog records those differences explicitly:

- `tested` means a checked-in runtime verification record substantiates the smoke test.
- `untested` means the package is installable but has not completed that test yet.
- `unsupported` means the workflow has a real runtime dependency that prevents equivalent execution elsewhere.

[`CONTRIBUTING.md`](./CONTRIBUTING.md) defines the runtime smoke test and the required verification record. Skills remain `untested` until that evidence is committed.

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
| [`agent-instructions`](./agent-instructions/SKILL.md) | workflow | Inspect a codebase and create or improve AGENTS.md, CLAUDE.md, or Cursor instructions with verified commands and boundaries. Use when configuring coding agents. |
| [`ai-cost-audit`](./ai-cost-audit/SKILL.md) | ai | Audit AI model usage and calculate unit economics, margins, routing, caching, and batch savings. Use when evaluating AI costs, pricing, or model changes. |
| [`ai-product-development`](./ai-product-development/SKILL.md) | ai | Design and implement production AI features with model selection, streaming UX, tool use, safety, evaluation, observability, and cost controls. Use when building AI into an app. |
| [`analytics`](./analytics/SKILL.md) | analytics | Plan and implement product analytics, error monitoring, health checks, dashboards, and optional admin reporting. Use when adding or auditing app measurement. |
| [`auth-implementation`](./auth-implementation/SKILL.md) | auth | Implement authentication, user sync, authorization, data isolation, session state, and protected routes. Use when adding or repairing app identity and access. |
| [`changelog`](./changelog/SKILL.md) | workflow | Generate a weekly social changelog card from git history and an HTML template. Use when turning recent shipped work into a screenshot-ready update. |
| [`cold-outreach`](./cold-outreach/SKILL.md) | marketing | Research and write specific cold emails, follow-ups, and multichannel outreach sequences. Use when contacting prospects, investors, partners, or candidates. |
| [`credit-metering`](./credit-metering/SKILL.md) | monetization | Implement usage credits with atomic spending, grants, purchases, refunds, UI state, limits, and audit history. Use when an app sells or allocates consumable usage. |
| [`decision-doc`](./decision-doc/SKILL.md) | planning | Facilitate a choice and write a decision document with options, constraints, tradeoffs, and a recommendation. Use when a team is stuck between approaches. |
| [`demo-video`](./demo-video/SKILL.md) | workflow | Plan, script, build, and render product demos and technical explainers with Remotion. Use when creating walkthroughs, launch videos, or social clips. |
| [`deploy-check`](./deploy-check/SKILL.md) | devops | Run a production preflight across changes, types, secrets, migrations, dependencies, and documentation. Use when preparing to deploy or push a release. |
| [`email-with-resend`](./email-with-resend/SKILL.md) | infrastructure | Implement transactional and product email with Resend, including templates, preferences, audiences, campaigns, and delivery safety. Use when an app needs email. |
| [`fundraising`](./fundraising/SKILL.md) | planning | Pressure-test a startup fundraising case and improve its narrative, deck, risks, investor fit, and meeting answers. Use when preparing to raise venture capital. |
| [`interface-design`](./interface-design/SKILL.md) | design | Design and build production web interfaces with coherent typography, color, layout, states, and motion. Use when creating pages, dashboards, or components. |
| [`landing-copy`](./landing-copy/SKILL.md) | marketing | Audit, rewrite, or generate landing-page copy across headlines, CTAs, proof, features, and objections. Use when improving conversion messaging for a product page. |
| [`payments-with-dodo`](./payments-with-dodo/SKILL.md) | payments | Implement Dodo Payments checkout, subscriptions, webhooks, entitlements, billing UI, and verification. Use when adding or repairing Dodo billing in an app. |
| [`performance-diagnosis`](./performance-diagnosis/SKILL.md) | devops | Diagnose and fix web-app performance across development, build, server, browser, and network paths. Use when investigating slowness, CPU spikes, loops, or bloat. |
| [`product-experiments`](./product-experiments/SKILL.md) | analytics | Design, implement, measure, and conclude product experiments with feature flags and safe rollouts. Use when testing whether a feature changes user behavior. |
| [`product-launch`](./product-launch/SKILL.md) | marketing | Plan and implement a product launch with positioning, assets, distribution, measurement, waitlist capture, and follow-up. Use when preparing or reviewing a launch. |
| [`product-spec`](./product-spec/SKILL.md) | planning | Turn an idea into a clear brief and buildable v1 specification with scope, flows, data, routes, risks, and acceptance criteria. Use when planning before implementation. |
| [`product-teardown`](./product-teardown/SKILL.md) | workflow | Analyze a product or competitor across positioning, proof, copy, UX, design, pricing, and onboarding. Use when extracting evidence-backed lessons for another product. |
| [`rate-limit`](./rate-limit/SKILL.md) | devops | Implement Upstash Redis rate limits with user or IP keys, 429 headers, and safe fallbacks. Use when protecting Next.js routes from abuse or cost overruns. |
| [`readme`](./readme/SKILL.md) | workflow | Audit or write a project README with install, usage, visuals, badges, contribution, and license sections. Use when documentation needs a release-ready pass. |
| [`remove-ai-slop`](./remove-ai-slop/SKILL.md) | workflow | Audit and remove AI-like design and copy defaults using rendered evidence and confidence scoring. Use when reviewing an interface for generic or repetitive patterns. |
| [`search-ready`](./search-ready/SKILL.md) | seo | Audit and improve technical SEO, content, structured data, social previews, and AI-search visibility. Use when preparing or maintaining a site for discovery. |
| [`skill-creator`](./skill-creator/SKILL.md) | meta | Turn a repeatable workflow into a concise, portable Agent Skill with useful resources and validation. Use when creating, merging, or improving SKILL.md packages. |
| [`social-sharing`](./social-sharing/SKILL.md) | marketing | Implement and verify social metadata, share URLs, Open Graph images, and per-route link previews. Use when shared links look wrong or need better context. |
| [`supabase`](./supabase/SKILL.md) | devops | Set up or extend Supabase schema, RLS policies, migrations, typed clients, and external-auth sync. Use when integrating Supabase or repairing data access. |
| [`ui-copy`](./ui-copy/SKILL.md) | workflow | Write and audit clear, human UI copy across actions, forms, onboarding, empty states, errors, and confirmations. Use when product language needs a coherent voice. |
| [`user-insights`](./user-insights/SKILL.md) | analytics | Analyze product data to find behavioral segments, retention patterns, churn risks, and actions. Use when deciding what different user groups need next. |
<!-- END GENERATED SKILL CATALOG -->

## Contributing

Contributions should preserve the portable Agent Skills package contract. Start with [CONTRIBUTING.md](./CONTRIBUTING.md), then run:

```bash
npm run catalog:sync
npm run check
npm --prefix site test --if-present
npm --prefix site run build
```

Validation covers standard frontmatter, naming, licensing, description portability, line limits, relative links, bundled references, catalog coverage, generated ZIP contents, and this README catalog.

## V1 scope

V1 supports local Agent Skills in Codex, Claude Code, and Cursor, plus a capability-gated Claude app path for chat workflows. Copilot, Gemini, and OpenAI plugin packaging are outside v1.

## License

[MIT](./LICENSE) © 2026 Tushar Mehta.
