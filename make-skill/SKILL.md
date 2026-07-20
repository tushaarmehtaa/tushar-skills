---
name: make-skill
description: Turn a repeatable workflow into a portable Agent Skill with standard frontmatter, resources, and verification. Use when creating or improving a SKILL.md package.
license: MIT
---

Package any repeatable workflow as a portable Agent Skill. The output is a self-contained skill directory that coding agents can discover and load from `SKILL.md`.

## Phase 1: Capture the Workflow

Ask for anything missing:

1. **What does it do?** — One sentence. What problem does it solve?
2. **When should it trigger?** — Exact phrases or contexts. Be specific.
3. **What does it need from the user?** — Inputs before it can run.
4. **What does it output?** — File changes, code, chat output, commands?
5. **What are the steps?** — Walk through the process start to finish.
6. **What are the hard rules?** — Things it must always or never do.

If the current conversation already describes a workflow, extract answers from it before asking. Don't ask for what you already have.

## Phase 2: Write the Frontmatter

```yaml
---
name: skill-name           # lowercase, hyphenated, no spaces
description: [What it does]. Use when [specific contexts or requests].
license: MIT
---
```

**The description is the trigger.** Agent runtimes use it to decide when to activate the skill. Make it explicit and keep it at 200 characters or fewer for broad compatibility:

- Include WHAT the skill does AND WHEN to use it
- Name concrete contexts or request types
- Prefer a direct `Use when ...` clause
- Keep runtime-specific requirements out unless the workflow truly depends on one runtime

Use only fields defined by the Agent Skills specification. Add `compatibility` only when the skill has a real environment or runtime constraint. Do not put catalog-only fields such as category, tags, or author in the package frontmatter.

## Phase 3: Write the Body

The structure that matches the quality bar of the existing skills:

````markdown
[One-liner opener — what this does, what it outputs. No heading above this.]

## Phase 1: [First Phase Title]

[Instructions. Dense. Opinionated. No hedging.]

## Phase 2: [Next Phase Title]

...

## Verify

```text
[ ] [Thing that must be true]
[ ] [Thing that must be true]
[ ] [Edge case handled]
```
````

**Rules that don't move:**

- Open with a single sentence — no `# Heading` before it. This is the first instruction an agent reads.
- Use `## Phase N: Title` for every major section
- Use `### 1.1` sub-phases only when Phase 1 needs branching (stack detection, mode selection)
- Code blocks must contain real, runnable code — not pseudocode
- **Bold warnings inline** for things that fail silently or break the whole flow
- End with `## Verify` using bare `[ ]` items inside a code block (not markdown `- [ ]` list items)
- Under 500 lines total — push long examples to `references/guide.md`

## Phase 4: The Verify Section

The verify section is not optional. It's how the user confirms the skill ran correctly.

Format exactly like this — bare brackets in a fenced code block:

````markdown
## Verify

```
[ ] [Thing that must be true after the skill runs]
[ ] [Output format is correct]
[ ] [Edge case handled]
[ ] [Common mistake avoided]
```
````

Each item must be checkable — either it's done or it isn't. No vague items like "quality looks good."

## Phase 5: References (if needed)

Create `references/guide.md` when:

- Full examples would push SKILL.md over 500 lines
- Multiple variants need their own section
- Edge cases are complex enough to need real examples

The reference file must have real input → output examples. Not outlines of examples.

## Phase 6: Test Prompts

Write 3–5 prompts that should trigger the skill, and 2 that should NOT:

```
"make a skill for PR reviews"          ✅ should trigger
"create a skill to audit my code"      ✅ should trigger
"turn this process into a skill"       ✅ should trigger
"review my PR"                         ❌ should not trigger (different skill)
"what skills are available?"           ❌ should not trigger
```

Use these to validate the description before publishing. If any trigger should fire but doesn't, add the phrase to the description.

## Phase 7: Package and Validate

Create one directory named exactly after the skill. Put `SKILL.md` at its root and keep optional resources in `references/`, `scripts/`, or `assets/`.

Before handing it off:

1. Parse the YAML frontmatter and confirm the name matches the directory.
2. Confirm the description says what the skill does and when to use it in 200 characters or fewer.
3. Check that every relative Markdown link resolves inside the skill directory.
4. Confirm every bundled reference is linked directly from `SKILL.md` and says when to read it.
5. Run the repository's skill validator when one exists.
6. Deliver the complete directory, not only `SKILL.md`, so installations retain bundled resources.

## Verify

```
[ ] YAML frontmatter uses standard fields only and includes name, description, and license
[ ] Name matches the lowercase hyphenated directory name
[ ] Description states what the skill does and when to use it in 200 characters or fewer
[ ] Body opens with a one-liner — no heading before it
[ ] All sections use ## Phase N: Title format
[ ] Code blocks contain real code, not pseudocode
[ ] Critical constraints are bolded inline
[ ] Verify section uses bare [ ] items in a fenced code block
[ ] SKILL.md is under 500 lines
[ ] Long examples moved to references/guide.md when needed and linked from SKILL.md
[ ] Every relative link resolves and every bundled reference is reachable
[ ] 3-5 test prompts written to validate triggers
```

See [references/guide.md](references/guide.md) for an annotated portable skill, a multi-file example, and common structural mistakes.
