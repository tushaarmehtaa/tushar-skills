---
name: cold-email
description: Write cold emails that get replies. Signal-based formula, current deliverability requirements, and send limits that keep you out of spam. Covers investors, employers, mentors, partners.
category: marketing
tags: [email, outreach, sales, networking, founders]
author: tushaarmehtaa
---

Write cold emails that get responses. Ultra-short, signal-based, specific. Under 80 words — everything else is noise.

## Phase 0: Sender Setup (Do Once)

Before sending a single cold email, your domain needs to pass authentication. Gmail, Yahoo, and Microsoft all reject non-compliant senders.

**Required DNS records:**
- **SPF** — `v=spf1 include:youresp.com ~all` (authorizes your sending server)
- **DKIM** — 2048-bit key, set up through your ESP (Resend, SendGrid, Postmark)
- **DMARC** — minimum `v=DMARC1; p=none; rua=mailto:you@yourdomain.com`

**Domain warmup:**
- New domain: start at 20–30 emails/day, ramp over 4–6 weeks
- Production limit: 50–100 emails per mailbox per day, never more
- Scale with multiple warmed mailboxes (3–5) rather than volume per mailbox

**Health targets:**
- Bounce rate: under 2% (above 5%, most ESPs suspend you)
- Spam complaint rate: under 0.1% (Gmail hard limit is 0.3%)
- If open rates are below 30%, the problem is infrastructure, not copy

---

## Phase 1: Gather

Before writing, you need four things. Ask for anything missing:

1. **Recipient** — Name, role, company
2. **Your credentials** — Past wins, numbers, notable affiliations
3. **Your ask** — What you actually want
4. **Signal** — A specific, recent, verifiable event about the recipient

**Signal types ranked by reply rate:**
- Leadership change (new role in past 90 days): 14–25% reply rate
- Funding round: 12–20% reply rate
- Hiring surge (10+ open roles in their function): 10–18% reply rate
- Technology adoption (just switched tools): 8–15% reply rate

If no signal exists, use a specific piece of their work — a post, a talk, a product decision. Generic admiration ("I've been following your work") is not a signal.

---

## Phase 2: The Formula

Every email follows this structure. No exceptions.

```
Subject: [Signal reference or direct question, under 45 chars]

Hey [FirstName],

[Signal + implication — prove you know their specific situation] (1 sentence)

[Your credibility with concrete details] (1 sentence)

[Single, time-specific ask] (1 sentence)

[Name]
```

**Under 80 words. One CTA. No signature block. No "Best regards." No "I hope this email finds you well."**

---

## Phase 3: Email Types

Auto-select based on context. Formula stays the same — emphasis shifts.

| Type | Signal to use | Credibility to lead with |
|------|--------------|--------------------------|
| **Investor outreach** | Funding round they led, portfolio company they backed | Traction numbers, revenue, growth rate |
| **Advice / Mentorship** | Recent talk, article, or decision they made | Specific situation that mirrors what they solved |
| **Job / Internship** | Company news, new product, open role | One concrete result with numbers |
| **Partnership** | Their recent launch, expansion, or gap | Your users, revenue, or relevant customer |
| **Paid consulting** | Their specific expertise applied to your problem | Offer to pay upfront + tight scope |

---

## Phase 4: Subject Lines

**What works:**
- Signal reference: `[Company]'s Series B — quick thought`
- Direct question: `How is [Company] handling [specific challenge]?`
- Mutual connection: `[Name] said I should reach out`
- Under 45 characters for mobile

**What's dead:**
- "Quick question" — one of the two most overused cold email subjects in 2026
- "Following up" — same
- Fake threading: `RE:` or `FW:` on a first email
- Anything with "free," "guaranteed," "limited time" (triggers spam filters)

Numbers in subject lines get 113% higher open rates. Use them when you have them: `Saw [Company] posted 12 SDR roles`

---

## Phase 5: Voice

**DO:**
- Lead with the signal — first sentence proves situational awareness
- State credentials with numbers: `$2M ARR`, `backed by a16z`, `ex-Stripe`
- Make the ask time-specific: `15 min this Thursday?` not `grab coffee sometime`
- Randomize send times — 3–8 minute intervals between emails, not batch sends
- Send Tuesday–Thursday mornings (Thursday 9–11 AM has highest open rates)

**DON'T:**
- Generic compliments: "I admire your work" with nothing specific
- More than one ask per email
- Long paragraphs about your background
- Emails over 80 words (2.4x lower reply rate vs. 50–125 words)
- Being apologetic for reaching out

---

## Phase 6: Follow-Up Sequence

58% of replies come from the first email. But a sequence improves total response by 50%+.

```
Email 1 → follow up after 2–3 business days
Email 2 → follow up after 3–4 business days
Email 3 → follow up after 5–7 business days
Email 4+ → follow up after 7–14 business days
```

Follow-up template:

```
Subject: Re: [original subject]

Hey [Name],

Bumping this — still think [specific reason this is relevant to them].

[Name]
```

4–7 emails is the optimal sequence length. Stop if they ask you to.

---

## Verify

```
[ ] Under 80 words
[ ] Opens with a specific, verifiable signal — not generic admiration
[ ] Credibility includes a number or a name
[ ] Single ask with a specific time
[ ] Subject under 45 characters, no spam trigger words
[ ] No "quick question", "following up", fake RE:
[ ] Casual — you'd send this to a colleague
[ ] SPF + DKIM + DMARC set up on the sending domain
[ ] Sending under 100 emails/day per mailbox
```

See [references/guide.md](references/guide.md) for real examples that got replies from Evan Spiegel, Mark Cuban, and Elon Musk — plus templates by situation and advanced tactics.
