---
name: product-brief
description: Write a one-page product brief before coding. What you're building, who it's for, what v1 doesn't include. Lighter than a full spec.
category: planning
tags: [product, brief, planning, scope, v1]
author: tushaarmehtaa
---

Write a one-page product brief before any code gets written. Lighter than `/mvp-spec`. One page. Forces clarity.

## How to start

Ask ONE question first.

> "What are you building? One sentence."

Wait for the answer. Then interrogate it before writing anything:

- If the WHO is vague ("developers", "small businesses") — push: "Who specifically? Name one real person."
- If the WHAT is broad ("an AI tool for X") — push: "What's the one thing it must do well?"
- If they can't say what people do today instead — push: "What's the current workaround? If nothing, the problem might not be real."

**Do not write the brief until the pressure-test questions below are answered.** The brief is the output of the interrogation, not a first draft to revise.

---

## Phase 1: Extract the Idea

Ask for anything you can't infer:

1. **What is this?** — One sentence. "It's a ___ that lets ___ do ___."
2. **Who is it for?** — One specific person, not a category. "Junior devs shipping their first SaaS" not "developers."
3. **Why does this need to exist?** — What's broken today? What do people currently do instead?
4. **What's the one thing it must do well?** — If it only does one thing, what is it?

If the user has already described the idea in conversation, extract these from context. Don't re-ask what you already know.

## Phase 2: Write the Brief

One page. Six sections. No fluff.

```
PRODUCT BRIEF — [Name]
════════════════════════════════════

WHAT IS THIS?
[One paragraph. What it does, in plain language. A stranger reads this and gets it.]

WHO IS IT FOR?
[One specific person. Name their situation, not their job title.
"A founder who just built something and needs to tell people about it"
not "entrepreneurs and marketers"]

THE PROBLEM
[What's broken right now. What people do today and why it sucks.
Be specific. "They spend 3 hours writing a landing page that converts at 0.5%"
not "marketing is hard"]

THE SOLUTION
[How this product fixes the problem. One paragraph.
Focus on the experience, not the implementation.
"You describe your product, get conversion-tested copy in 2 minutes"
not "AI-powered copywriting engine with fine-tuned models"]

V1 DOES:
- [thing it does]
- [thing it does]
- [thing it does]
- [thing it does]
(4-6 items. Each starts with a verb.)

V1 DOES NOT:
- [thing it won't do yet]
- [thing it won't do yet]
- [thing it won't do yet]
(3-5 items. This section is more important than the one above.
Saying no is how you ship.)

════════════════════════════════════
```

## Phase 3: The "Does Not" Test

The V1 DOES NOT section is the whole point of this skill. Vibe coders skip this and end up building for 3 months instead of 3 days.

**Prompt hard on this:**

- "You listed 8 features in V1 DOES. Which 3 can you cut and still have something useful?"
- "If you had to launch in one weekend, which features survive?"
- "What's the simplest version someone would actually pay for / use / share?"

The brief is not done until the DOES NOT list is at least half as long as the DOES list.

## Phase 4: Pressure-Test (before writing, not after)

Ask these before writing the brief. If the user can't answer them, the idea isn't ready for a brief yet.

1. **Can you explain this to a friend in one sentence?** — If not, the WHAT section isn't clear yet.
2. **Name one real person — not a persona — who would use this.** — If they can't, the WHO is too vague.
3. **What do people use today instead?** — If "nothing," either the problem isn't real or they haven't found the workaround yet. Push harder.
4. **What would make someone switch from the current solution?** — This is the differentiator. If they can't answer it, they don't have one yet.
5. **What's the first thing a user does after signing up?** — If this isn't obvious, the core loop isn't defined yet.

Once all five have real answers, write the brief. If any answer is still vague after one push, note it in the brief as an open question — don't paper over it.

## Phase 5: Output

Write the brief as a markdown file. Offer to save it as `BRIEF.md` in the project root.

If `/mvp-spec` would be useful as a next step (the idea is validated and needs full technical planning), say so. The brief comes first — the spec comes after.

## Verify

```
[ ] WHAT section is one paragraph a stranger understands
[ ] WHO section names a specific person, not a job title or category
[ ] PROBLEM section describes what people do today and why it fails
[ ] SOLUTION section describes the experience, not the implementation
[ ] V1 DOES list is 4-6 items, each starting with a verb
[ ] V1 DOES NOT list is at least half as long as V1 DOES
[ ] You can explain the whole product in one sentence
[ ] You can name one real person who would use this
[ ] Brief fits on one page — if it doesn't, cut until it does
```
