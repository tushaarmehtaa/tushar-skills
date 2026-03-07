---
name: segment-users
description: Generate user segmentation logic from your database schema — queries, behavioral cohorts, and targeted action plans for each segment. Use when the user wants to segment their users, identify power users vs churned users, create cohorts for email campaigns, understand usage patterns, or target different user groups differently. Triggers on requests like "segment users", "user cohorts", "identify power users", "inactive users", "churn analysis", "user segments", "behavioral segmentation", or any mention of grouping users by behavior, usage, or activity patterns.
category: ai
tags: [segmentation, users, cohorts, churn, analytics]
author: tushaarmehtaa
---

# Segment Users

Read your database schema, generate behavioral user segments, output queries for each segment, and recommend targeted actions per segment.

## What This Does

1. Reads your user/database schema from the codebase
2. Identifies available signals (usage, plan, activity, signup date)
3. Generates behavioral segments with SQL and ORM queries
4. Recommends actions for each segment
5. Outputs current user count per segment

## Required Information

1. **Database schema** — User table fields (auto-detect from codebase)
2. **Key metric** — What counts as "usage"? (API calls, credits consumed, logins, actions taken)
3. **Business model** — Free/paid, credits, subscription tiers

## Segmentation Framework

### By Usage (requires usage metric)

| Segment | Definition | Typical % |
|---------|-----------|-----------|
| **Power Users** | Top 10% by usage | 5-10% |
| **Active** | Used in last 7 days, above median usage | 20-30% |
| **Casual** | Used in last 30 days, below median | 30-40% |
| **Dormant** | No usage in 7-30 days | 15-25% |
| **Churned** | No usage in 30+ days | 10-20% |

### By Lifecycle (requires created_at)

| Segment | Definition |
|---------|-----------|
| **New** | Signed up < 7 days ago |
| **Onboarding** | 7-14 days, hasn't hit "aha moment" |
| **Established** | 14-60 days, regular usage |
| **Veteran** | 60+ days, consistent activity |

### By Revenue (requires plan/payment data)

| Segment | Definition |
|---------|-----------|
| **Free Tier** | No payment ever |
| **Paying** | Active subscription or purchased credits |
| **At Risk** | Paying but usage declining last 14 days |
| **Churned Paid** | Was paying, subscription ended |

## Query Generation

For each segment, generate SQL (raw) and ORM query (Prisma, Drizzle, or Mongoose — detect from codebase).

### Example: Credits-Based App

```sql
-- Power Users: top 10% by credits consumed
SELECT *, (initial_credits - credits) as credits_used
FROM users
ORDER BY credits_used DESC
LIMIT (SELECT COUNT(*) / 10 FROM users);

-- Dormant: active previously, silent last 7-30 days
SELECT * FROM users
WHERE last_active_at < NOW() - INTERVAL '7 days'
  AND last_active_at > NOW() - INTERVAL '30 days';

-- At Risk: paying user, usage dropped
SELECT * FROM users
WHERE plan != 'free'
  AND (initial_credits - credits) < (
    SELECT AVG(initial_credits - credits) * 0.5 FROM users WHERE plan != 'free'
  );
```

```typescript
// Prisma equivalent
const dormantUsers = await prisma.user.findMany({
  where: {
    lastActiveAt: {
      lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    }
  }
});
```

### Count Queries

For each segment, also generate a count query so the user can see current distribution:

```sql
SELECT
  'power_users' as segment, COUNT(*) as count FROM users WHERE ...
UNION ALL
SELECT
  'dormant' as segment, COUNT(*) as count FROM users WHERE ...
```

## Action Recommendations Per Segment

| Segment | Action | Channel | Goal |
|---------|--------|---------|------|
| Power Users | Thank + upgrade offer or exclusive access | Email | Convert to paid / higher tier |
| Active | Feature education, surface underused features | In-app | Increase stickiness |
| Casual | Re-engage with value reminder | Email | Move to Active |
| Dormant | Win-back campaign | Email | Prevent full churn |
| Churned | Survey + incentive | Email | Understand why + recovery |
| New | Onboarding sequence | Email + in-app | Reach "aha moment" |
| At Risk | Personal outreach | Email | Retention before cancellation |

## Workflow

1. Read user table schema from codebase (check models, schema.prisma, schema.sql)
2. Identify available signals (usage metric, dates, plan, payment data)
3. Select applicable segmentation dimensions (usage + lifecycle + revenue where available)
4. Generate SQL and ORM queries for each segment
5. Generate count queries — run them to show current distribution
6. Recommend actions per segment
7. If `/ship-email` is installed: generate email templates per segment

## Output Format

```
USER SEGMENTS — [project name]
════════════════════════════════════
CURRENT DISTRIBUTION
────────────────────────────────────
Power Users:    [N] users  ([X]%)
Active:         [N] users  ([X]%)
Casual:         [N] users  ([X]%)
Dormant:        [N] users  ([X]%)
Churned:        [N] users  ([X]%)
────────────────────────────────────
Total:          [N] users
════════════════════════════════════

SEGMENT QUERIES
[SQL + ORM query per segment]

RECOMMENDED ACTIONS
[Action table per segment]
```

## Checklist

- [ ] User table schema identified
- [ ] Usage metric defined
- [ ] All applicable segments generated with clear definitions
- [ ] SQL queries output for each segment
- [ ] ORM queries output (matching detected ORM)
- [ ] Count queries run and distribution shown
- [ ] Action recommendations per segment
- [ ] Queries verified against schema (no missing columns referenced)

## Detailed Reference

For RFM analysis, cohort analysis, and predictive churn patterns, see [references/guide.md](references/guide.md).
