---
name: gtm-launch
description: Plan a product launch end-to-end. Research, positioning, distribution, launch assets, post-launch analysis. Covers Product Hunt, X, Reddit, HN, community channels.
category: marketing
tags: [gtm, launch, product-hunt, positioning, distribution]
author: tushaarmehtaa
---

Turn a product idea, repo, or rough positioning into a launch plan. Research first, separate facts from opinions, find the warm distribution loops, build the assets, feed the roadmap with what the launch needs.

## How to start

Ask TWO questions before any research or planning.

> "What's your one-line positioning? And who are your first 100 users specifically — not a demographic, actual people or a specific community?"

Wait for both answers. Challenge weak ones:

- If positioning is vague ("AI tool for productivity") — push: "Who specifically is this NOT for? What makes it different from the 50 other tools in this space?"
- If the first 100 users is generic ("developers", "founders") — push: "Where do these people actually hang out? Name a specific subreddit, Slack, Discord, newsletter, or person."

Do not start research until positioning is specific and the first 100 users are identified. A launch plan built on vague positioning is a waste. Lock these first, then build the plan around them.

---

## Principles

- Think first, research deeply, plan second.
- Separate facts from opinions.
- Warm loops beat cold blasts.
- Screenshots, clips, memos, demos, share cards, and visible product artifacts matter.
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

For large research tasks, parallelize by track:

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

---

## Channel Playbooks (2026)

### Product Hunt

**How the algorithm works:** Ranking = weighted upvotes / time velocity, with multipliers for account age and penalties for suspicious patterns. Comments are heavily weighted — a product with 40 upvotes and 20 genuine comments often outranks one with 70 upvotes and 2 comments. Upvotes from accounts created on launch day are discounted to near zero.

**Target in first 6 hours:** 200+ upvotes, 30+ comments. The algorithm sets your initial ranking in this window.

**Notification timing (3 waves):**
1. Core supporters — midnight PT (launch start)
2. Wider network — 6am PT
3. Final push — 6pm PT

Steady growth throughout the day beats a spike that dies. The maker who replies to every comment within 30 minutes does more for ranking than the one chasing extra upvotes over DMs.

**Best launch day:** Thursday. Tuesday in weeks 2-3 of the month also works. Avoid Monday (crowded) and Friday (low traffic).

**First comment matters:** Post your own first comment immediately after launch. Explain the why, what's next, and invite honest feedback. This seeds the conversation.

**What kills launches:** Upvote rings with new accounts, generic "please support us" DMs to everyone you know, no maker response after launch, posting without warming up your PH following first.

---

### Hacker News (Show HN)

**Reality check:** Only 2.3% of Show HN submissions hit the front page. The median Show HN scores 2 points. 50 points puts you in the top 6%.

**Title formula:** `Show HN: [Product Name] – [One-sentence technical description]`. Lead with what it does technically, not what it achieves for the user. HN rewards specificity and technical honesty.

**The first hour is everything:** 30-50 upvotes in the first 60 minutes is front-page threshold. 10 upvotes in 30 minutes beats the same 10 spread over three hours.

**Show HN advantage:** Posts get a grace period in the `/shownew` queue where downvotes are disabled. Use this window.

**Engagement:** Reply to every early comment. Threads with active, specific conversation rank higher. Don't defend — explain, acknowledge limitations, ask questions.

**Never do:** Vote manipulation, coordinated upvote campaigns, accounts with zero karma upvoting. HN's fraud detection catches these and penalties are permanent.

**Frame as discussion, not promotion.** "I built X because Y was painful and all existing tools do Z wrong" outperforms "Launch: the best X tool."

---

### Reddit

**Core rule:** Reddit is a community first. The platform allows self-promotion when it adds genuine value to the community. If your participation only serves yourself, it gets removed or shadowbanned.

**90/10 rule:** 90% of your activity should be genuine participation — answering questions, sharing knowledge, engaging with others. 10% can include promotional mentions. This is tracked by subreddit mods and Reddit's spam filters.

**Pre-launch:** Spend 2 weeks actively participating in your target subreddits before launch day. Build a post history showing you're a real community member.

**Where to launch:**
- `r/SideProject` — built for exactly this
- `r/roastmystartup` — feedback-framed launches work well here
- Subreddit-specific "Show and Tell," "Feedback Friday," or "Self-Promo Saturday" threads — check the sidebar
- Niche subreddits for your ICP (developers: `r/webdev`, `r/programming`; founders: `r/Entrepreneur`, `r/startups`)

**What Redditors reward:** Real numbers, screenshots, honest tradeoffs, lessons learned. Not hype. Lead with the problem and the story, mention the product as the solution — not the other way around.

---

### X / Twitter

**Algorithm reality in 2026:** X heavily favors accounts with demonstrated domain authority. Being a generalist is penalized. Replies within 15 minutes of posting get 3-5x more visibility than replies after 2 hours.

**X Premium:** Now effectively required for meaningful organic reach. The algorithmic boost for Premium subscribers is significant — without it, organic reach on a small account is close to zero.

**For a launch post:** Post the product story, not the features. What you built, why you built it, what you learned. Add a short demo video or GIF. Reply to every comment within the first hour.

**Content cadence around launch:** 3-5 posts per day in the week before and after launch. Don't go silent. The algorithm punishes inactivity.

**What works:** Threads (longer content = more engagement surface), "build in public" narrative (showing the process, not just the result), founder voice posts that reference a specific user problem.

**What doesn't:** Generic "We launched!" posts with no story. Feature lists. Posting once and going dark.

---

### Niche Newsletters

**Best paid channel before running ads.** A tight audience of 5,000 in your exact niche outperforms a broad audience of 100,000. Sponsor one newsletter where your ICP actually reads.

Find newsletters via Letterhead, Paved, or direct search for "[your niche] newsletter." Negotiate a dedicated send or a prominent placement, not a footer mention.

---

### Integrations as Distribution

Integrations are now a distribution channel, not just a product feature. If your product connects to ecosystems your audience already lives in — Notion, Slack, Shopify, Zapier, Webflow — one well-executed integration creates a durable growth loop.

List on integration marketplaces (Zapier app directory, Notion integrations page, Slack app directory). These have their own organic discovery.

---

### Open Source

Open source is the best free marketing for developer tools. It gives brand, credibility, and word-of-mouth at scale. If any part of your product can be open-sourced without undermining the business model, do it and launch it to GitHub/HN separately.

---

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

---

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

---

## Rules

- Do not produce generic launch advice.
- Cite sources when research was performed.
- Make claims traceable to observed data, source material, or explicit assumptions.
- Prefer warm, specific distribution over "post everywhere."
- Write copy that sounds native to each channel.
- Include product requirements when the launch needs them.
- End with the one strategy to execute and the immediate next actions.
