# Content notes: v2 skill fields

Draft for Tushar's review. Source of truth is `content.json` in this folder. Every `why` is a draft in his voice and needs his edit or approval before it ships (PLAN-v2 decision 2).

## Groups, in builder order

**Shape (4)**: user-insights → product-teardown → decision-doc → product-spec

**Build (10)**: agent-instructions → supabase → auth-implementation → interface-design → ui-copy → ai-product-development → payments-with-dodo → credit-metering → rate-limit → email-with-resend

**Ship (9)**: remove-ai-slop → mobile-first → performance-diagnosis → search-ready → social-sharing → readme → deploy-check → changelog → skill-creator

**Grow (11)**: landing-copy → landing-page → image-editing → demo-video → analytics → product-launch → cold-outreach → humanize → product-experiments → ai-cost-audit → fundraising

Total 34. `next` follows this order. The last skill in each group points to the first skill in the next group. `fundraising` is the only `null`.

## Grouping calls I was unsure about

- **interface-design** went to Build. The brief lists "design direction" under Shape, and the skill has an Explore mode, but its default output is implemented code. With it, Shape has 5 skills. Without it, Shape is the smallest group at 4.
- **agent-instructions** went to Build, first. skills.sh.json puts it in Ship. I placed it first because you set up agent context before building anything.
- **skill-creator** went to Ship, last. skills.sh.json agrees, and canvas.ts TASK_GROUPS leaves it out entirely. It is meta. Build is also defensible.
- **remove-ai-slop** went to Ship as a readiness audit before release. canvas.ts has it in Build. skills.sh.json has it in Design.
- **humanize** went to Grow, after cold-outreach, because it mostly polishes words that go out to people. It applies just as well to readme and changelog copy (Ship). canvas.ts TASK_GROUPS leaves it out entirely.
- **landing-page** went to Grow with landing-copy. Implementing the page is Build-shaped work, but the job is marketing.
- **analytics** went to Grow, following the brief. Half the skill is error monitoring and health checks, which is Ship work.
- **ai-cost-audit** went to Grow as monetization economics. It also works as an engineering audit.
- **credit-metering** and **payments-with-dodo** went to Build because the work is implementation. The brief's "monetization economics" points Grow at ai-cost-audit.
- **fundraising** went to Grow, following the brief. canvas.ts has it in Shape.

## proofTier calls that are borderline

These are marked `run` because a mode named in the skill's description gives meaningful output with no accounts. The full workflow needs more.

- **ai-product-development**: audit mode runs locally. Implementing and running evals needs a model API key.
- **analytics**: plan mode and the health-endpoint path run locally. PostHog and Sentry verification need accounts.
- **credit-metering**: needs a local Postgres. Purchase grants need a payment provider.
- **cold-outreach**: an audit of a supplied draft runs locally. Recipient research involves real people, so the fixture uses a fictional profile.
- **fundraising**: memo audit runs locally. Investor research involves real firms and people.
- **search-ready** and **social-sharing**: local server checks run. Deployed verification needs a public URL.

`contract` (6): supabase, auth-implementation, payments-with-dodo, rate-limit, email-with-resend, image-editing.

## `why` lines grounded in skill purpose only

There is no commit, changelog or research note giving a personal motivation for these. Each line restates the SKILL.md's own purpose:

- user-insights
- agent-instructions
- ui-copy
- mobile-first
- performance-diagnosis
- readme
- landing-page
- humanize

All other `why` lines cite a commit, CHANGELOG.md entry, an old README or site line, or a workspace research note in `whyEvidence`. Three of them quote Tushar's own earlier words: deploy-check (initial README), decision-doc (README row in 0756efd) and the "i never set up / wired from scratch / never wrote" hero line in 49a579a (search-ready, credit-metering, changelog). Check that you still stand behind those.

## Output contract handling

- 29 skills copy their `## Output` or `## Output contract` section verbatim.
- 5 skills have no such section. These sections were copied instead:
  - image-editing: `Deliver`
  - landing-page: `Deliver`
  - mobile-first: `Deliver`
  - social-sharing: `Audit findings` (it includes the repair/implementation return list)
  - remove-ai-slop: `Phase 7: Report findings and fixes` (long. Consider showing only the code block on the site)
- The verbatim contracts for **user-insights** and **remove-ai-slop** contain em dashes. I left them because the field must be verbatim. The site should either show them as quoted source or the SKILL.md files need an edit.
- The validation script confirms every `outputContract` is an exact substring of its SKILL.md.

## Stale or contradictory things I noticed

- **skills.sh.json** still uses five groups (Build, Ship, Design, Grow, Decide). That contradicts PLAN-v2 decision 1 (Shape/Build/Ship/Grow everywhere).
- **site/lib/canvas.ts TASK_GROUPS** uses four other labels ("Shape an idea", "Build a product", "Get it out there", "Earn & grow") and excludes humanize and skill-creator. It needs remapping to the new taxonomy.
- **product-experiments/SKILL.md** says to read `references/posthog.md` "if present". The file exists, so the hedge is stale.
- **landing-page/SKILL.md** says its output contract lives in `references/review.md`. That file's section is called "Audit output", and the SKILL.md `Deliver` section duplicates part of it.
- **humanize/SKILL.md** sends major editorial work to "an article-development workflow". No such skill exists in this library.
- **ai-product-development/SKILL.md** warns against "embedded price tables". A grep of every `references/` folder found no per-million price table, because CHANGELOG says the static prices were removed. The warning now only guards against old copies.
- **CHANGELOG.md `[Unreleased]`** holds work going back to July/August 2026, including the 30-skill consolidation. Its own text says "30 skills" and "all 30 generated ZIPs", but the library now has 34.
- **image-editing** says runtime support is untested. product-principles.md asks to keep that status honest, so the `why` line repeats it.
