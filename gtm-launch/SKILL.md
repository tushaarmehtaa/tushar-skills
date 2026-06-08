---
name: gtm-launch
description: Plan a product launch end to end with research, positioning, distribution, launch assets, and post-launch analysis. Use for GTM plans, Product Hunt launches, X/Reddit/HN/community launches, launch events, or post-launch reviews.
category: marketing
tags: [gtm, launch, product-hunt, positioning, distribution]
author: tushaarmehtaa
---

# GTM Launch Strategist

Turn a product idea, repo, or rough positioning into a launch plan. Research first, separate facts from opinions, find the warm distribution loops, build the assets, feed the roadmap with what the launch needs.

## When to Invoke

Use this skill when the user asks for:

- A GTM plan or launch strategy
- Product Hunt, Hacker News, Reddit, X, newsletter, community, or event launch planning
- Competitive analysis for a launch
- Influencer, community, or super-spreader mapping
- Positioning, launch copy, asset banks, or launch timeline
- Post-launch analysis and roadmap updates

Trigger phrases include:

- "gtm plan"
- "launch strategy"
- "create launch plan"
- "competitive analysis for launch"
- "viral launch research"
- "Product Hunt launch plan"
- "research similar apps for launch"

## Principles

- Think first, research deeply, plan second.
- Separate facts from opinions.
- Warm loops beat cold blasts.
- Screenshots, clips, memes, demos, share cards, and visible product artifacts matter.
- Product requirements are part of GTM. If the launch loop needs a share card, widget, demo, compatibility check, or public roadmap, call it out.
- No single-channel launch plan. Stack multiple warm loops at the same time.
- Every launch should leave reusable assets, learnings, relationships, and roadmap decisions.

## Workflow

### 1. Intake

Ask only for missing information, one question at a time:

- Product name and one-line description
- Target platform
- Current positioning hypothesis
- Launch goal
- Timeline, budget, team size, existing audience, and constraints
- Existing assets, website, repo, waitlist, user interviews, or launch report
- Success metric: rank, downloads, signups, stars, sales, feedback, retention, or awareness
- Products or launches the user wants to emulate

If the user gives enough context, proceed without asking.

### 2. Research

Research broadly, then narrow. Use web search, official product pages, App Store pages, GitHub, X/Twitter, Reddit, Product Hunt, Hacker News, newsletters, community pages, and competitor docs as relevant.

Cover:

- Direct competitors
- Adjacent products with similar launch mechanics
- Products that spread because of design, humor, novelty, technical credibility, or community
- Existing user complaints and workflows
- Launch posts and assets that actually got engagement
- Communities where the ICP already spends time
- Influencers or super-spreaders who can make the launch feel native
- Channel-specific norms and traps

For large research tasks, parallelize with subagents by track:

- competitor landscape
- community/influencer map
- launch asset examples
- channel strategy
- product requirements

### 3. Synthesis

Turn research into decisions:

- Positioning: one-liner, full narrative, delta, and what it is not
- ICP: first 100 users, first 1,000 users, and first super-spreaders
- Launch loops: trigger, artifact, channel, conversion, metric
- Channel fit: what to do, what to avoid, what needs warming up
- Product gaps: what must ship before launch
- Asset strategy: screenshots, demos, videos, posts, comments, replies, landing page sections

### 4. Plan

Create a launch plan with:

- 4-6 week pre-launch timeline if timeline allows
- launch week war room
- channel-by-channel plan
- warm-up tasks
- outreach and influencer map
- Product Hunt/HN/Reddit/X/community-specific copy
- newsletter and email copy
- founder posts and reply banks
- launch asset checklist
- metrics dashboard
- risk register
- post-launch follow-up plan

### 5. Output

Produce one clean launch document. Save it in the workspace when possible:

```txt
plans/<product-slug>-gtm-plan.md
```

Use this structure:

```md
# <Product> GTM Research & Launch Plan

## 0. Launch Context

## 1. Executive Thesis / Positioning

## 2. Research Notes

## 3. Competitive Positioning & ICP

## 4. Audience, Super-Spreaders & Influencer Map

## 5. Launch Loops

## 6. Distribution Strategy

## 7. Launch Timeline & War Room

## 8. Creative & Asset Bank

## 9. Product Requirements for Launch Success

## 10. Metrics & Tracking

## 11. Risks & Mitigations

## 12. Post-Launch Analysis Template

## 13. Final Recommendation

## 14. Sources
```

## Playbook Variants

### Consumer / Viral / Personality

Use when the product spreads through emotion, screenshots, social identity, humor, novelty, design, or event energy.

Focus on:

- shareable screenshots
- memeable product states
- short clips
- creator and founder posts
- local events or stunts
- product copy with personality
- share cards, widgets, app icons, and visible artifacts

### Dev Tool / Product Hunt / Technical

Use when the product sells through clarity, technical trust, workflow pain, GitHub, PH, HN, Reddit, and niche communities.

Focus on:

- precise positioning
- comparison against existing tools
- "why now" and "why this is different"
- docs, README, roadmap, known issues
- technical demo video or GIFs
- PH first comment and reply bank
- HN/Reddit framing as discussion, not promotion
- community warm-up before launch day

### Hybrid

Use when the product needs both technical credibility and shareable personality. Keep both loops, but do not blur them. Make the technical launch credible and the social launch easy to share.

## Post-Launch Analysis

If the user provides launch numbers, feedback, comments, or analytics, switch to analysis mode:

- summarize numbers
- identify what worked
- identify what did not work
- extract user feedback themes
- update positioning
- update roadmap
- update distribution learnings
- write next-week follow-up actions

Use this template:

```md
# <Product> Post-Launch Review

## Numbers

## What Worked

## What Did Not Work

## User Feedback Themes

## Positioning Updates

## Product Roadmap Changes

## Distribution Learnings

## Next 7 Days

## Reusable Playbook Updates
```

## Rules

- Do not produce generic launch advice.
- Cite sources when research was performed.
- Make claims traceable to observed data, source material, or explicit assumptions.
- Prefer warm, specific distribution over "post everywhere."
- Write copy that sounds native to each channel.
- Include product requirements when the launch needs them.
- End with the one strategy to execute and the immediate next actions.
