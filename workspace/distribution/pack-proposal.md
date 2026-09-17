## Skill name

`release-decision-record` — or, more narrowly, an example that complements the existing `deployment-and-ci` skill.

## What problem does it solve?

The pack already covers CI, migrations, health checks, and rollback. The complementary gap I would like to explore is recording a release decision when evidence is incomplete: which checks actually ran, which blockers remain, who owns the decision, and when the decision must be revisited.

## When should an agent use it?

Use when a SaaS release has a failed or unperformed check and the team needs to decide whether to fix, defer, or release with an explicitly accepted risk.

## Key contents you'd expect

A self-contained Markdown example is likely sufficient instead of another broad deployment skill:

- Scenario: a Drizzle migration check fails; a fix takes one day; the release can tolerate two days of delay.
- Evidence table separating supplied facts, observed test results, and unknowns. A successful build must not stand in for an authorization or payment-flow test.
- Compare fixing first, shipping with the known failure, and deferring. Include owner, decision date, consequences, and a review trigger.
- Keep tenant isolation, webhook correctness, and database compatibility explicit when they are affected. Never infer those checks passed from missing evidence.
- Hand back to `deployment-and-ci` for implementation and verification. No deployment is triggered by writing the record.

## References (optional)

I maintain the MIT-licensed [decision-doc workflow in Slashskills](https://github.com/tushaarmehtaa/tushar-skills/tree/main/decision-doc), which could be an optional companion. I am proposing a useful worked example first, not importing the entire collection or duplicating your deployment skill.

I have run a supplied-facts decision scenario with this workflow in Claude Code. That checks document generation only, not real deployment safety; the response also made assumptions beyond the supplied facts, so I would review and constrain any contributed example rather than calling the model output authoritative.

Would that focused example fit your pack? Prepared with AI assistance; maintainer affiliation disclosed above.
