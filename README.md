# /slashskills

Claude Code skills that actually work. Drop them in, invoke with a slash command, ship faster.

**[Browse the directory &rarr;](https://slashskills.vercel.app)**

---

## What are skills?

Skills are markdown files that teach Claude Code a repeatable workflow. Write the instructions once, invoke with `/skill-name`, and Claude runs it — no re-explaining every time.

Think of them as slash commands you write yourself.

---

## Skills

| Skill | Category | What it does |
|-------|----------|-------------|
| [`/aeo-ready`](./aeo-ready/SKILL.md) | Workflow | Full AEO audit — schema markup, llms.txt, AI crawler rules, and citation strategy to get cited by ChatGPT, Perplexity, and Claude. |
| [`/add-analytics`](./add-analytics/SKILL.md) | DevOps | Wire PostHog analytics, Sentry error tracking, and a health endpoint. Stop flying blind in production. |
| [`/changelog`](./changelog/SKILL.md) | Workflow | Weekly changelog card for Twitter/X. Reads git log, distills into 6 punchy items. |
| [`/cold-email`](./cold-email/SKILL.md) | Workflow | Write cold emails that actually get replies. 2-4 sentence formula with real examples from Evan Spiegel, Mark Cuban, Elon Musk. |
| [`/cold-outreach-sequence`](./cold-outreach-sequence/SKILL.md) | Workflow | Generate complete 3-5 email outreach sequences with timing, escalation, and a different angle per touch. |
| [`/deploy-check`](./deploy-check/SKILL.md) | DevOps | Pre-flight checklist before every production push. Catches TypeScript errors, staged secrets, pending migrations. |
| [`/dodo-webhook`](./dodo-webhook/SKILL.md) | DevOps | Wire Dodo Payments webhooks — signature verification, idempotency, subscription lifecycle, database sync. |
| [`/economics`](./economics/SKILL.md) | AI | Unit economics calculator. Revenue per action, API cost, gross margin, free tier damage. |
| [`/landing-copy`](./landing-copy/SKILL.md) | Workflow | Audit or generate conversion-focused landing page copy across 7 dimensions — headlines, CTAs, social proof, objection handling. |
| [`/make-skill`](./make-skill/SKILL.md) | Workflow | Create new Claude Code skills from workflow descriptions. The meta-skill that builds more skills. |
| [`/model-audit`](./model-audit/SKILL.md) | AI | Full AI model routing table. Every AI call, what model it uses, cost per call. |
| [`/mvp-spec`](./mvp-spec/SKILL.md) | Workflow | Turn a rough idea into a full MVP spec — personas, data model, API routes, page list, and LAUNCH vs LATER feature split. |
| [`/og-image`](./og-image/SKILL.md) | Workflow | Set up dynamic Open Graph image generation and all required meta tags so links look great when shared anywhere. |
| [`/pricing-page`](./pricing-page/SKILL.md) | Workflow | Scaffold a complete pricing system — tiers, feature gating, Dodo Payments checkout, and a polished pricing UI component. |
| [`/segment-users`](./segment-users/SKILL.md) | AI | Generate behavioral user segments from your DB schema — SQL queries, ORM queries, current counts, and action plans per segment. |
| [`/seo-ready`](./seo-ready/SKILL.md) | Workflow | Full SEO + AEO audit that reads your codebase, scores every signal, and fixes what's missing — meta tags, structured data, sitemap, robots.txt, llms.txt, AI crawler rules. |
| [`/ship-credits`](./ship-credits/SKILL.md) | Workflow | Scaffold a complete credits/token system — database schema, backend middleware, payment webhooks, frontend state, and UI components. |
| [`/ship-email`](./ship-email/SKILL.md) | Workflow | Wire transactional and campaign email infrastructure — Resend setup, templates, user segmentation, and admin campaign UI. |
| [`/wire-auth`](./wire-auth/SKILL.md) | DevOps | Set up auth end-to-end — Clerk/NextAuth/Supabase Auth + database sync + row-level security + frontend hooks + session management. |

---

## Install

### All skills at once (recommended)

```bash
npx skills add tushaarmehtaa/tushar-skills
```

### One skill

```bash
# Replace "deploy-check" with the skill you want
curl -sL https://raw.githubusercontent.com/tushaarmehtaa/tushar-skills/main/deploy-check/SKILL.md \
  -o ~/.claude/skills/deploy-check/SKILL.md --create-dirs
```

Then in any Claude Code session:

```
/deploy-check
/seo-ready
/ship-credits
/wire-auth
/add-analytics
/model-audit
/economics
/changelog
/cold-email
```

---

## Add your own skill

This is an open-source skills directory. Contribute your own:

1. Create a folder with your skill name (lowercase, hyphenated)
2. Add a `SKILL.md` with YAML frontmatter and instructions
3. Open a PR — it automatically appears on the site

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

## Customise

These skills are project-agnostic — they read your codebase and adapt. But you may want to tweak:

- **deploy-check**: add project-specific checks
- **economics**: hardcode your token estimates if you know your average prompt sizes
- **changelog**: lock in your own HTML template

Edit the `SKILL.md` file in each folder. Plain markdown — just instructions Claude follows.

---

## How skills work

Claude Code looks for skills in `~/.claude/skills/[skill-name]/SKILL.md`. When you type `/skill-name`, it loads the file and follows the instructions in the context of your current project.

More on Claude Code skills: [docs.anthropic.com](https://docs.anthropic.com)

---

Built by [@tushaarmehtaa](https://twitter.com/tushaarmehtaa)
