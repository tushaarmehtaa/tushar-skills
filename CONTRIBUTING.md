# Contributing

Thanks for contributing to tushar/skills! This guide covers everything you need to add a new skill.

## Adding a new skill

### 1. Create a folder

```
your-skill-name/
└── SKILL.md
```

Use lowercase, hyphenated names (e.g., `deploy-check`, `model-audit`).

### 2. Add SKILL.md with frontmatter

Every `SKILL.md` starts with YAML frontmatter:

```yaml
---
name: your-skill-name
description: One-line description of what this skill does and when to use it.
category: devops        # devops | ai | workflow | quality
tags: [tag1, tag2, tag3]
author: your-github-username
---
```

**Required fields:**
- `name` — matches the folder name
- `description` — one sentence, starts with a verb (e.g., "Calculate...", "Generate...", "Check...")
- `category` — one of: `devops`, `ai`, `workflow`, `quality`
- `tags` — 3-5 relevant keywords
- `author` — your GitHub username

### 3. Write the skill instructions

After the frontmatter, write the instructions Claude will follow. Good skills:

- **Start with context** — one line explaining what the skill does
- **Use numbered steps** — Claude follows these sequentially
- **Be specific** — say exactly what to look for, what to output, what format to use
- **Handle edge cases** — what if a file doesn't exist? What if there's no data?
- **End with output** — describe the exact output format (table, checklist, summary)

### 4. Open a PR

- One skill per PR
- Include a brief description of the use case
- Make sure the skill works by testing it in Claude Code

## Style guide

- Write instructions in imperative mood ("Check the build", not "You should check the build")
- Use `##` headers for major sections, `###` for steps
- Keep descriptions under 200 characters
- Tags should be lowercase, no spaces

## Frontmatter reference

| Field | Required | Type | Example |
|-------|----------|------|---------|
| `name` | Yes | string | `deploy-check` |
| `description` | Yes | string | `Pre-flight check before pushing to production.` |
| `category` | Yes | enum | `devops` \| `ai` \| `workflow` \| `quality` |
| `tags` | Yes | string[] | `[deploy, ci, typescript]` |
| `author` | Yes | string | `tushaarmehtaa` |
