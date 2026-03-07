---
name: ship-email
description: Wire transactional and campaign email infrastructure end-to-end. Use when the user wants to add email sending to their app — welcome emails, notifications, marketing campaigns, user segmentation, or any email functionality. Triggers on requests like "add email", "set up Resend", "email campaigns", "transactional email", "send emails to users", "email infrastructure", "welcome email", "notification emails", or any mention of email sending in an app context.
category: infrastructure
tags: [email, resend, transactional, campaigns, deliverability]
author: tushaarmehtaa
---

# Ship Email

Scaffold complete email infrastructure — transactional emails, campaign system, user segmentation, and admin UI. Reads your codebase and adapts to your stack.

## What This Builds

| Component | What It Does |
|-----------|-------------|
| **Provider Setup** | Resend integration with domain verification checklist |
| **Transactional Emails** | Welcome, password reset, usage alerts — triggered by app events |
| **Campaign System** | Admin UI to send targeted emails to user segments |
| **User Segmentation** | Query logic to group users by behavior |
| **Email Templates** | HTML templates with dynamic variables |
| **Deliverability** | SPF, DKIM, DMARC verification checks |

## Required Information

Prompt user for any missing pieces:

1. **Stack** — Framework (Next.js, Express, etc.), database (Postgres, MongoDB, etc.)
2. **Email types needed** — Transactional only, campaigns only, or both
3. **Sender identity** — From name, from email, domain
4. **User data available** — What fields exist in user table (email, name, usage metrics, plan, created_at)

## Provider Setup (Step 1)

1. Install: `npm install resend`
2. Add env var: `RESEND_API_KEY=re_xxxxx`
3. Domain verification checklist:
   - Add MX record
   - Add SPF TXT record
   - Add DKIM TXT records (Resend provides these in dashboard)
   - Verify domain in Resend dashboard
4. Create email utility:

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'Your Name <you@yourdomain.com>' }: EmailParams) {
  return resend.emails.send({ from, to, subject, html });
}
```

## Transactional Emails (Step 2)

Scaffold these event-triggered emails based on what exists in the codebase:

| Trigger | Email | Priority |
|---------|-------|----------|
| User signs up | Welcome email with getting-started CTA | Must have |
| User hits usage milestone | Congratulations + upgrade nudge | Should have |
| User inactive 7+ days | Re-engagement with value reminder | Should have |
| Payment failed | Alert with update-payment link | Must have (if billing exists) |
| Password reset | Reset link (time-limited) | Must have (if auth exists) |

### Template Rules

- Plain text feel — minimal HTML, no heavy design
- Short paragraphs (2-3 sentences max)
- One clear CTA per email
- Signed with a human name, not "The Team"
- No image-heavy layouts (kills deliverability)
- Always include unsubscribe link for campaigns

### Template Structure

```typescript
// emails/welcome.ts
export function welcomeEmail(name: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <p>Hey ${name},</p>
      <p>Welcome — you're in.</p>
      <p>[One sentence: what they can do right now].</p>
      <p><a href="[CTA URL]" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">[CTA Text]</a></p>
      <p style="margin-top: 40px; color: #666; font-size: 14px;">— [Your Name]</p>
    </div>
  `;
}
```

## Campaign System (Step 3)

### User Segmentation Logic

Read the user table schema and generate segments based on available data:

| If user table has... | Segments generated |
|---------------------|-------------------|
| `credits` or `usage_count` | Power users (top 20%), Active (middle 60%), Inactive (bottom 20%) |
| `created_at` | New (<7 days), Established (7-30 days), Veteran (30+ days) |
| `plan` or `subscription_tier` | Free, Paid, Churned |
| `last_active_at` | Active (<7 days), Dormant (7-30 days), Churned (30+ days) |

### Admin Campaign UI

Scaffold an admin route with:

1. **Segment selector** — Dropdown with generated segments + user count preview
2. **Template selector** — Choose from created templates
3. **Preview panel** — Rendered email with sample user data
4. **Confirmation modal** — "Send to X users? This cannot be undone."
5. **Send button** — Hits API endpoint that loops through segment
6. **Result display** — Success count, failed emails, errors

### Campaign API Endpoint

```
POST /api/admin/send-campaign
Body: { segmentId: string, templateId: string }
Response: { success: boolean, sentCount: number, failedEmails: string[] }
```

Requirements:
- Admin auth check before processing
- Rate limiting (Resend free: 100/day, paid: 50,000/day)
- Per-email error handling — don't fail entire batch on one bad address
- Log sent emails to database for tracking

## Deliverability Checklist (Step 4)

- [ ] SPF record configured
- [ ] DKIM records configured
- [ ] DMARC record configured
- [ ] From address uses verified domain (not gmail.com)
- [ ] Unsubscribe link present in all campaign emails
- [ ] Reply-to set to monitored inbox
- [ ] HTML validates (no broken tags)

## Workflow

1. Detect stack (framework, database, existing auth)
2. Prompt for missing info (sender identity, email types needed)
3. Install Resend SDK
4. Create email utility with send function
5. Generate email templates based on user table schema
6. If campaigns requested: build segmentation queries + admin UI
7. Add env vars to .env.example
8. Run deliverability checklist
9. Output summary of what was created

## Checklist

- [ ] Resend SDK installed and configured
- [ ] Email utility created with proper error handling
- [ ] At least welcome email template created
- [ ] Domain verification steps documented
- [ ] `RESEND_API_KEY` added to .env.example
- [ ] If campaigns: segmentation queries generated
- [ ] If campaigns: admin UI scaffolded with auth check
- [ ] Unsubscribe mechanism for campaign emails
- [ ] Deliverability checklist passed

## Detailed Reference

For email copy examples by segment, subject line formulas, spam trigger words to avoid, and rate limiting strategies, see [references/guide.md](references/guide.md).
