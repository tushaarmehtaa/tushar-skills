# Product brief template and prompts

Use this reference only for brief mode or when product framing is incomplete. Do not restart an interview or require answers the available context already contains.

## Evidence prompts

Ask at most one blocking question at a time. Useful gaps include:

- Who encounters the problem, in what triggering situation?
- What do they do now, and what evidence shows the workaround is costly or inadequate?
- What changed outcome matters to them?
- What mechanism could plausibly create that outcome?
- What is the smallest end-to-end value path?
- What must explicitly not be included?

A role, team, or account can be the correct user unit. Do not force a named real person when it adds no evidence.

## Brief structure

```markdown
# Product brief: [name]

## Audience and trigger
[Specific user/role/account and the situation that creates the need]

## Problem and evidence
[Current behavior/workaround, cost or failure, evidence, and uncertainty]

## Desired outcome
[Observable change for the user or business]

## Product promise and mechanism
[What the product enables and why the mechanism could work]

## Smallest value path
1. [Trigger or entry]
2. [Core action]
3. [Value realized]

## In scope
- [Capability required for the value path]

## Explicitly out of scope
- [Adjacent capability intentionally excluded and why]

## Success signals
- [Leading behavior]
- [Outcome and measurement window]
- [Guardrail]

## Facts, assumptions, decisions, and open questions
[Four visibly separate lists]
```

## Scope tests

- Does each included capability support the smallest value path?
- Can a removed capability wait without making the path dishonest or unsafe?
- Are authentication, support, billing, compliance, or accessibility requirements being mistaken for optional “features”?
- Does the brief define a learning outcome, not only a shipping deadline?

Do not use arbitrary list lengths. An exclusion list should be long enough to prevent the actual scope risks.

## Brief audit

Flag:

- audience defined only by demographics or broad title;
- solution language replacing problem evidence;
- unsupported conversion or market claims;
- a feature list without a value path;
- scope that ignores mandatory operational or safety work;
- success metrics without denominator/window;
- assumptions written as requirements.
