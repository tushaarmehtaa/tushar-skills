---
name: make-skill
description: Create new Claude Code skills from scratch — takes a workflow description and generates a properly structured SKILL.md with YAML frontmatter, trigger description, instructions, and optional reference files. Use when the user wants to turn a workflow into a skill, create a new skill, package their knowledge as a skill, or build a reusable automation. Triggers on requests like "make a skill", "create a skill", "turn this into a skill", "new skill for...", "package this as a skill", "build a skill", or any request to create a reusable Claude Code skill.
category: workflow
tags: [skills, automation, claude-code, workflow, meta]
author: tushaarmehtaa
---

# Make Skill

Create properly structured Claude Code skills from workflow descriptions. The meta-skill that builds more skills.

## What This Outputs

```
skill-name/
├── SKILL.md              (required — main instructions, under 500 lines)
└── references/            (optional — detailed guides, examples, edge cases)
    └── guide.md
```

## Step 1: Capture the Workflow

Ask the user:

1. **What does this skill do?** — Describe the task in one sentence
2. **When should it trigger?** — What phrases or contexts activate it
3. **What's the input?** — What info does the skill need from the user
4. **What's the output?** — File, chat response, code changes, etc.
5. **What are the steps?** — Walk through the process sequentially
6. **What are the rules?** — Hard constraints, always/never
7. **Got examples?** — Real inputs and their ideal outputs

If the current conversation already contains a workflow (user says "turn this into a skill"), extract answers from conversation history first before asking.

## Step 2: Write SKILL.md

### YAML Frontmatter (required)

```yaml
---
name: skill-name          # lowercase, hyphenated
description: [What it does]. Use when [contexts]. Triggers on requests like "[phrase 1]", "[phrase 2]", "[phrase 3]", or any request for [broader category].
category: workflow         # devops | ai | workflow | quality
tags: [tag1, tag2, tag3]   # 3-5 lowercase keywords
author: tushaarmehtaa
---
```

**Description rules:**
- Include WHAT the skill does AND WHEN to use it
- List specific trigger phrases in quotes — be explicit
- End with a broader catch-all ("or any request for...")
- Be "pushy" — Claude tends to undertrigger, so make triggers obvious

### Body Structure

```markdown
# [Skill Name]

[One sentence: what this does and what it outputs.]

## Required Information

[What the user must provide. List each item. Say how to prompt for missing pieces.]

## [Core Framework / Structure]

[The main methodology — use tables for structured info, not paragraphs]

## [Key Rules / Constraints]

[Hard rules. Use "must", "never", "always" — not "consider" or "might"]

## Workflow

[Numbered steps, start to finish]

## Checklist

[Verification items — user can confirm quality before accepting output]

## Detailed Reference

For [examples, advanced patterns], see [references/guide.md](references/guide.md).
```

### Writing Principles

- **Imperative language**: "Do X" not "You might consider X"
- **Tables over paragraphs**: For structured info, always use tables
- **Specific over vague**: "Max 180 words" not "Keep it concise"
- **Show examples**: Don't describe what good output looks like — show it
- **Checklist at the end**: Makes quality verifiable before handing to user

## Step 3: Write references/guide.md (if needed)

Put detailed content in references when:
- Full examples would make SKILL.md too long (>500 lines)
- Multiple variants need separate documentation
- Edge cases need their own section

Reference file must include:
- 2-3 full input → output examples
- Edge case handling
- Advanced patterns

## Step 4: Define Test Prompts

Write 3-5 prompts that should trigger the skill, and 2-3 that should NOT:

| Prompt | Should Trigger? |
|--------|----------------|
| "[relevant request phrasing]" | ✅ Yes |
| "[similar but different request]" | ❌ No |

## Step 5: Publish

Use the `/publish-skill` skill to copy the skill into the repo, update README, build the site, and push.

## Skill Quality Checklist

- [ ] YAML frontmatter has all 5 fields (name, description, category, tags, author)
- [ ] Description includes specific trigger phrases
- [ ] SKILL.md is under 500 lines
- [ ] Has Required Information section
- [ ] Has core framework with hard constraints
- [ ] Has numbered Workflow
- [ ] Has Checklist for verification
- [ ] Uses tables for structured info
- [ ] Uses imperative language throughout
- [ ] References guide.md if needed for examples

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Description too vague | Add specific trigger phrases with examples |
| SKILL.md too long | Move examples to references/guide.md |
| Rules are suggestions | Use "must", "never", "always" |
| No checklist | Add verification steps at the end |
| No workflow | Add numbered step-by-step process |
| Trigger description too narrow | Add broader catch-all at the end |
| Missing category | Must be: devops, ai, workflow, or quality |
