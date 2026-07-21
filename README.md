# slashskills

**workflows saved as Agent Skills.**

Reusable SKILL.md workflows from real projects. Install them in Codex, Claude Code, or Cursor; see what each skill needs and where it has been tested.

**[Browse the directory →](https://slashskills.vercel.app)**

## Agent Skills, not runtime-specific prompts

Each directory is a self-contained [Agent Skills](https://agentskills.io) package: a standard `SKILL.md` plus any references needed to run the workflow. The package format is shared, while installation, invocation, and available tools still differ by runtime.

The catalog records those differences explicitly:

- `tested` means a checked-in runtime verification record substantiates the smoke test.
- `untested` means the package is installable but has not completed that test yet.
- `unsupported` means the workflow depends on a different runtime. `init-claude-md`, for example, intentionally targets Claude Code.

[`CONTRIBUTING.md`](./CONTRIBUTING.md) defines the runtime smoke test and the required verification record. Skills remain `untested` until that evidence is committed.

## Install

Select a package, runtime, and scope in the directory installer. For a deterministic global install, target the runtime explicitly:

```bash
# Claude Code
npx skills add tushaarmehtaa/tushar-skills --skill <slug> -g -a claude-code -y

# Codex
npx skills add tushaarmehtaa/tushar-skills --skill <slug> -g -a codex -y

# Cursor
npx skills add tushaarmehtaa/tushar-skills --skill <slug> -g -a cursor -y
```

Omit `--skill <slug>` to install every skill. See the runtime guides for project-scoped installs, invocation, updates, removal, reload behavior, and known limitations:

- [Claude Code guide](https://slashskills.vercel.app/guides/claude-code)
- [Codex guide](https://slashskills.vercel.app/guides/codex)
- [Cursor guide](https://slashskills.vercel.app/guides/cursor)
- [Compatibility matrix](https://slashskills.vercel.app/compatibility)

## Claude app

Only chat-capable skills expose Claude app upload instructions. Skills that need a repository, shell, or local browser show **local coding agent required** instead. Their ZIP files remain available for inspection, but uploading one does not provide execution equivalent to a local coding agent.

See the [Claude app guide](https://slashskills.vercel.app/guides/claude-app) for the supported upload path.

## Skill catalog

This table is generated from the same catalog and frontmatter used by the site. Do not edit the generated block by hand; run `npm run catalog:sync` after changing catalog metadata or a description.

<!-- BEGIN GENERATED SKILL CATALOG -->
| Skill | Category | What it does and when to use it |
| --- | --- | --- |
| [`add-analytics`](./add-analytics/SKILL.md) | devops | Set up PostHog analytics, Sentry error tracking, and health endpoints for web apps. Use when adding or auditing product analytics, monitoring, or uptime checks. |
| [`aeo-ready`](./aeo-ready/SKILL.md) | seo | Audit and improve AI search visibility with schema, llms.txt, crawler rules, and answer-first content. Use when optimizing a site for answer engines and AI citations. |
| [`ai-streaming`](./ai-streaming/SKILL.md) | ai | Implement end-to-end AI response streaming in Next.js with Vercel AI SDK, aborts, errors, and loading states. Use when building chat or generation features. |
| [`app-copy`](./app-copy/SKILL.md) | workflow | Audit or write UI microcopy for empty, error, loading, onboarding, dialog, and success states. Use when polishing product copy or replacing placeholders. |
| [`changelog`](./changelog/SKILL.md) | workflow | Generate a weekly social changelog card from git history and an HTML template. Use when turning recent shipped work into a screenshot-ready update. |
| [`cold-email`](./cold-email/SKILL.md) | marketing | Write short, signal-based cold emails and follow-ups with deliverability checks. Use when contacting investors, employers, mentors, customers, or partners. |
| [`cold-outreach-sequence`](./cold-outreach-sequence/SKILL.md) | workflow | Create signal-based, multi-touch email and LinkedIn outreach sequences with widening cadence. Use when one cold email is not enough to reach a prospect. |
| [`debug-perf`](./debug-perf/SKILL.md) | devops | Diagnose and fix Next.js development and production performance problems. Use when investigating hot-reload loops, CPU spikes, bundle bloat, or slow server work. |
| [`decision-doc`](./decision-doc/SKILL.md) | planning | Facilitate a choice and write a decision document with options, constraints, tradeoffs, and a recommendation. Use when a team is stuck between approaches. |
| [`deploy-check`](./deploy-check/SKILL.md) | devops | Run a production preflight across changes, types, secrets, migrations, dependencies, and documentation. Use when preparing to deploy or push a release. |
| [`dodo-webhook`](./dodo-webhook/SKILL.md) | payments | Implement secure, idempotent Dodo Payments webhooks and database sync. Use when handling Dodo payment or subscription events in Next.js or FastAPI. |
| [`economics`](./economics/SKILL.md) | ai | Calculate per-action AI product economics, margins, free-tier costs, caching savings, and batch discounts. Use when evaluating models, credits, or pricing. |
| [`feature-flags`](./feature-flags/SKILL.md) | ai | Implement PostHog feature flags across Next.js server and client code with local overrides. Use when gating features, staging rollouts, or running experiments. |
| [`file-upload`](./file-upload/SKILL.md) | infrastructure | Implement direct-to-storage uploads with validation, progress, and presigned URLs for Vercel Blob, R2, or S3. Use when adding uploads to a Next.js app. |
| [`gtm-launch`](./gtm-launch/SKILL.md) | marketing | Research and build a product launch plan covering positioning, assets, distribution, metrics, and follow-up. Use when preparing or reviewing a launch. |
| [`init-claude-md`](./init-claude-md/SKILL.md) | workflow | Inspect a codebase and create a CLAUDE.md with stack, commands, key files, and gotchas. Use when configuring project context specifically for Claude Code. |
| [`landing-copy`](./landing-copy/SKILL.md) | marketing | Audit, rewrite, or generate landing-page copy across headlines, CTAs, proof, features, and objections. Use when improving conversion messaging for a product page. |
| [`make-skill`](./make-skill/SKILL.md) | meta | Turn a repeatable workflow into a portable Agent Skill with standard frontmatter, resources, and verification. Use when creating or improving a SKILL.md package. |
| [`model-audit`](./model-audit/SKILL.md) | ai | Audit every AI model call, map routing and cost, and flag caching, batching, or right-sizing opportunities. Use when models, usage, or pricing change. |
| [`mvp-spec`](./mvp-spec/SKILL.md) | planning | Turn a validated product idea into a scoped MVP spec with features, data model, routes, pages, and stack. Use when planning a buildable v1 before coding. |
| [`og-image`](./og-image/SKILL.md) | marketing | Implement dynamic Open Graph images and social metadata across static or framework routes. Use when shared links lack accurate or professional previews. |
| [`pitch-vc`](./pitch-vc/SKILL.md) | planning | Coach a founder through Khosla Ventures' pitch framework and produce lures, risks, slide headlines, and a summary. Use when preparing a VC pitch. |
| [`pmarca`](./pmarca/SKILL.md) | planning | Apply Marc Andreessen's startup frameworks through focused questioning. Use when assessing product-market fit, fundraising, hiring, or big-company deals. |
| [`pricing-page`](./pricing-page/SKILL.md) | monetization | Scaffold Dodo Payments pricing, tier definitions, feature gates, checkout, billing portal, and UI. Use when monetizing an app with Dodo Payments. |
| [`product-brief`](./product-brief/SKILL.md) | planning | Facilitate and write a one-page product brief covering audience, problem, solution, v1 scope, and exclusions. Use when clarifying an idea before technical planning. |
| [`rate-limit`](./rate-limit/SKILL.md) | devops | Implement Upstash Redis rate limits with user or IP keys, 429 headers, and safe fallbacks. Use when protecting Next.js routes from abuse or cost overruns. |
| [`readme`](./readme/SKILL.md) | workflow | Audit or write a project README with install, usage, visuals, badges, contribution, and license sections. Use when documentation needs a release-ready pass. |
| [`remotion-video`](./remotion-video/SKILL.md) | workflow | Scaffold a multi-format Remotion video project with scenes, springs, responsive sizing, and beat-synced audio. Use when creating demos, promos, or social videos. |
| [`remove-ai-slop`](./remove-ai-slop/SKILL.md) | workflow | Audit and remove AI-like design and copy defaults using rendered evidence and confidence scoring. Use when reviewing an interface for generic or repetitive patterns. |
| [`segment-users`](./segment-users/SKILL.md) | analytics | Analyze a database schema and generate behavioral user segments, queries, and actions. Use when identifying power users, churn risk, or outreach cohorts. |
| [`seo-ready`](./seo-ready/SKILL.md) | seo | Audit and fix SEO and AEO across metadata, schema, sitemaps, robots, content, and AI crawler access. Use when preparing a site for search discovery. |
| [`ship-credits`](./ship-credits/SKILL.md) | monetization | Scaffold credit metering with storage, atomic spending, payments, state, UI, promos, and audit history. Use when an app must sell and consume credits. |
| [`ship-email`](./ship-email/SKILL.md) | infrastructure | Scaffold Resend email infrastructure with templates, segmentation, campaigns, and unsubscribe handling. Use when adding transactional or campaign email to an app. |
| [`supabase`](./supabase/SKILL.md) | devops | Set up or extend Supabase schema, RLS policies, migrations, typed clients, and external-auth sync. Use when integrating Supabase or repairing data access. |
| [`teardown`](./teardown/SKILL.md) | workflow | Analyze a product, landing page, or app across positioning, copy, proof, UX, and design. Use when studying a competitor or extracting reusable tactics. |
| [`tushar-design`](./tushar-design/SKILL.md) | design | Build web interfaces with Tushar's configurable design system and interaction rules. Use when creating pages, dashboards, or components in this style. |
| [`waitlist`](./waitlist/SKILL.md) | marketing | Scaffold a waitlist with storage, duplicate handling, confirmation email, admin access, and optional referrals. Use when collecting signups before or during launch. |
| [`wire-auth`](./wire-auth/SKILL.md) | auth | Implement auth, user sync, data isolation, frontend state, and route protection for Clerk, NextAuth, or Supabase. Use when adding or repairing authentication. |
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
