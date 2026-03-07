---
name: mvp-spec
description: Turn a rough product idea into a structured MVP specification — user personas, data model, API routes, page list, tech stack recommendation, and a prioritized feature list split into "launch" and "later". Use when the user has a product idea and wants to scope it before building, needs a PRD, wants to plan an MVP, or needs to think through what to build first. Triggers on requests like "MVP spec", "spec this out", "plan this product", "what should I build first", "scope this idea", "product spec", "PRD", "feature list", "data model for...", "write a PRD", "product requirements", or any request to structure a product idea before coding.
category: workflow
tags: [mvp, spec, planning, prd, product]
author: tushaarmehtaa
---

# MVP Spec

Turn a rough product idea into a structured, buildable MVP specification. The thinking skill — before you touch code.

## What This Outputs

| Section | Purpose |
|---------|---------|
| **Problem Statement** | One sentence: who has what problem |
| **User Personas** | 2-3 types of users with their specific pain |
| **Core Value Prop** | What makes this worth using (one sentence) |
| **Feature List** | Split into LAUNCH (week 1) and LATER (month 2+) |
| **Data Model** | Database tables with fields |
| **API Routes** | Endpoint list with methods |
| **Page List** | Every screen the user will see |
| **Tech Stack** | Recommended stack with reasoning |
| **Scope Cut List** | What v1 explicitly does NOT build |

## Required Information

1. **The idea** — What does it do? (even a rough sentence)
2. **Who is it for?** — Target user (skill will suggest if not specified)
3. **Monetization** (optional) — Free, freemium, paid, credits?
4. **Tech preferences** (optional) — Any framework or DB preferences?

## The One-Build Rule

Before speccing, validate:
- Is this ONE product, not three ideas stitched together?
- Can v1 be built and shipped in 1-2 weeks?
- Is there one clear action the user takes?

If the idea is too broad, narrow it to one core loop before continuing.

## Feature Prioritization

### LAUNCH (must ship in v1)

Only features that complete the core loop:
- User can sign up
- User can do THE ONE THING
- User gets value from doing it
- You can see usage data

### LATER (month 2+)

Everything else:
- Settings and preferences
- Notifications
- Team / collaboration features
- Advanced analytics
- Integrations
- Mobile optimization
- Admin dashboard

### The Test

For each feature: "If I remove this, can a user still get value from v1?"
- Yes → LATER
- No → LAUNCH

## Data Model Template

```
[Table Name]
├── id (primary key, uuid or auto-increment)
├── [core fields]
├── created_at
└── updated_at

Relationships:
- [Table A] has many [Table B]
- [Table B] belongs to [Table A]
```

## API Routes Template

```
Auth:
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me

[Resource]:
GET    /api/[resource]        — List
POST   /api/[resource]        — Create
GET    /api/[resource]/:id    — Get one
PUT    /api/[resource]/:id    — Update
DELETE /api/[resource]/:id    — Delete
```

Only spec routes that LAUNCH features actually need.

## Tech Stack Recommendation Logic

| If the user wants... | Recommend |
|---------------------|-----------|
| Ship fastest, solo builder | Next.js + Supabase + Vercel |
| Full control, custom backend | Next.js + Postgres + Prisma + Railway |
| AI-heavy app | Next.js + Vercel AI SDK + Supabase |
| Simple static + API | Astro + Supabase |
| Backend-heavy, Python | FastAPI + Postgres + Supabase + Vercel |

Always explain WHY — match to their stated constraints (speed, control, cost, familiarity).

## Workflow

1. Gather idea, target user, and any tech preferences
2. Apply the one-build rule — narrow if needed
3. Write problem statement (one sentence)
4. Define 2-3 user personas with specific pain points
5. State core value prop (one sentence)
6. List ALL features, then split into LAUNCH and LATER
7. Design data model based on LAUNCH features only
8. Generate API routes for LAUNCH features only
9. List all pages and screens
10. Recommend tech stack with reasoning
11. Write explicit scope cut list
12. Output complete spec

## Checklist

- [ ] Problem statement is one clear sentence
- [ ] 2-3 user personas with specific pain (not vague demographics)
- [ ] Feature list split into LAUNCH and LATER
- [ ] LAUNCH features complete exactly ONE core loop
- [ ] Data model covers LAUNCH features only
- [ ] API routes listed with HTTP methods
- [ ] All pages and screens listed
- [ ] Tech stack recommended with reasoning tied to user's constraints
- [ ] Scope cut list is explicit about what v1 does NOT do
- [ ] Entire spec could realistically be built in 1-2 weeks
