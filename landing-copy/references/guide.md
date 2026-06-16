# Landing Copy — Reference Guide

Frameworks, before/after rewrites, and split-test patterns.

---

## Copy Frameworks

### PAS — Problem, Agitate, Solution

Best for: product pages, email, ads where the pain is well-understood.

Structure:
```
Problem   — name the exact pain the reader already feels
Agitate   — make it worse. describe the cost of NOT solving it
Solution  — introduce your product as the exit
```

Example (project management tool):
```
Problem:  Your team runs on Slack threads and stale spreadsheets.
Agitate:  Three meetings to clarify one decision. Work redone because
          the brief changed and nobody updated the doc. Half the team
          working on the wrong version.
Solution: [Product] is one place for decisions, context, and work.
          Async by default. No meeting required.
```

Use it when: the reader already knows they have a problem but hasn't felt the urgency to fix it. Agitation does that.

---

### AIDA — Attention, Interest, Desire, Action

Best for: full page structure, long-form sales letters, email sequences.

Structure:
```
Attention — hook. interrupt the scroll.
Interest  — pull them in with something relevant to their world
Desire    — make them want the outcome. benefits, not features.
Action    — clear, specific CTA. one ask.
```

Example (analytics tool for founders):
```
Attention: You don't know which page is killing your signups.
Interest:  Most founders guess. They move the CTA button. Change
           the headline color. Watch the number barely move.
Desire:    [Product] shows you the exact point where users leave
           — session replay, heatmaps, funnel drop-offs —
           without a data team or a week of setup.
Action:    See your first report in 5 minutes. Free.
```

Use it when: readers aren't yet sold on why they need this category of solution. You have to build the case from zero.

---

### BAB — Before, After, Bridge

Best for: hero sections, testimonials, short ads. Fastest framework.

Structure:
```
Before  — their life right now, without your product
After   — their life with the problem solved
Bridge  — your product is the path between the two
```

Example (scheduling tool):
```
Before: You spend Sunday prepping for Monday's meeting.
After:  You find out about Monday's meeting on Monday.
Bridge: [Product] turns your calendar into something that
        runs itself. Prep docs auto-attached. Agenda sent.
        You show up, not manage.
```

Use it when: you need to write fast, or the headline slot is short. BAB forces clarity because you can't hide in the middle.

---

### 4Ps — Promise, Picture, Proof, Push

Best for: emotionally driven offers, consumer products, high-consideration purchases.

Structure:
```
Promise — the single biggest benefit. lead with it.
Picture — help them see themselves using it. sensory.
Proof   — evidence. numbers, names, results.
Push    — urgency or remove friction. why now.
```

Example (fitness app):
```
Promise: Build the habit in 21 days or you don't pay.
Picture: 6am. Coffee. 12 minutes. You're done before
         your family wakes up. That's the routine.
Proof:   141,000 people finished their first month.
         Average streak: 34 days.
Push:    First month free. Cancel before day 21 and
         pay nothing.
```

Use it when: the reader is intrigued but not convinced. They need to see themselves in the story before they'll act.

---

## Before/After Rewrites by Product Type

### SaaS / Dev Tool

**Weak:**
> "A powerful platform that helps development teams collaborate more effectively and ship better software faster."

**Strong:**
> "Your PR gets reviewed in hours, not days. [Product] puts the right diff in front of the right person — no manual assignment, no Slack tag, no waiting."

What changed: removed "powerful platform," named a specific outcome ("PR reviewed in hours"), made it about the reader's day not the product's features.

---

### Productivity / Async Tool

**Weak:**
> "Streamline your workflow and enhance team productivity with our innovative solution."

**Strong:**
> "Spend less time in meetings. More time shipping. [Product] replaces your weekly status call with a five-minute async update everyone actually reads."

What changed: every word in the original could apply to 500 products. The rewrite names the exact behavior change (fewer meetings, async update) and the exact outcome (everyone reads it).

---

### Consumer App

**Weak:**
> "Your all-in-one finance app. Budget, save, and invest with ease."

**Strong:**
> "Know where your money went before you check your bank. [Product] categorizes every transaction in real time — no manual entry, no month-end surprise."

What changed: "all-in-one" is meaningless. The rewrite names a specific moment of pain (the month-end surprise) and a specific behavior change (real time, no entry).

---

### AI Product

**Weak:**
> "Leverage the power of AI to supercharge your content creation workflow."

**Strong:**
> "First draft in 3 minutes. Sounds like you wrote it. [Product] writes in your voice because it reads your past work first — not a generic prompt."

What changed: "leverage the power of AI" is the most overused phrase in tech. The rewrite is specific: 3 minutes, sounds like you, reads your past work. Every claim is verifiable.

---

### Open Source / Dev Tool

**Weak:**
> "An open-source developer tool that makes building APIs easier and more efficient."

**Strong:**
> "Type your schema. Get a working API. No boilerplate, no configuration, no framework opinions. Ships in Node, Deno, or Bun."

What changed: "easier and more efficient" measures nothing. The rewrite describes the exact experience (type → get) and removes the three things devs hate writing.

---

## Headline Split-Test Patterns

These are the axes worth testing. One axis per test. Never two at once.

### Axis 1: Outcome vs. Feature

| Variant | Headline |
|---------|----------|
| Feature | "AI-Powered Writing Assistant" |
| Outcome | "Write your first draft in 3 minutes" |

Outcome usually wins by 30–100%. Feature headlines make the reader do the translation work.

### Axis 2: Problem vs. Benefit

| Variant | Headline |
|---------|----------|
| Problem | "Stop losing leads because your copy is generic" |
| Benefit | "Copy that converts because it sounds like a human wrote it" |

Problem works better at top-of-funnel (paid ads). Benefit works better on landing pages where the reader arrived with intent.

### Axis 3: Specific vs. Vague

| Variant | Headline |
|---------|----------|
| Vague | "Grow your business faster" |
| Specific | "Get 3x more qualified leads from the same traffic" |

Specific wins almost every time. "3x more" beats "faster." "In 5 minutes" beats "quickly." Quantify everything you can honestly quantify.

### Axis 4: Brand-Centric vs. Reader-Centric

| Variant | Headline |
|---------|----------|
| Brand | "We built the best tool for X" |
| Reader | "You'll never need to do X manually again" |

Reader-centric wins. "You" outperforms "We" in headlines consistently. Shift the sentence subject from your company to your customer.

### Axis 5: Long vs. Short

| Variant | Headline |
|---------|----------|
| Long | "The fastest way for solo founders to write landing pages that convert — without a copywriter or marketing budget" |
| Short | "Landing pages that convert. No copywriter needed." |

No consistent winner here — depends on how much education the reader needs. Test when the product is unfamiliar or the category is new.

---

## Common Mistakes and Fixes

### We-focused opening

**Wrong:** "We help businesses grow by providing innovative solutions..."
**Fix:** Start with the reader's problem or outcome. Delete "We" from your first three sentences.

### Feature list masquerading as value prop

**Wrong:** "AI writing, smart editing, team collaboration, 50+ templates."
**Fix:** Pick one outcome the feature list enables. "Write faster than you ever have — without sounding like everyone else."

### Vague social proof

**Wrong:** "Trusted by thousands of businesses worldwide."
**Fix:** "14,000 teams use [Product] to ship copy without a copywriter." Specific number. Specific outcome.

### CTA that describes the click, not the outcome

**Wrong:** "Sign Up" / "Learn More" / "Get Started"
**Fix:** "See your first report" / "Start writing free" / "Get the template"

### Objection buried in FAQ

**Wrong:** Hide pricing concerns in a collapsed FAQ accordion at the bottom.
**Fix:** Address price, trust, and cancellation inline — right next to the CTA where the decision happens.
