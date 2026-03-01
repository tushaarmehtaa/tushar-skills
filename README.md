# /slashskills

Claude Code skills that actually work. Drop them in, invoke with a slash command, ship faster.

**[Browse the directory &rarr;](https://slashskills.vercel.app)**

---

## What are skills?

Skills are markdown files that teach Claude Code a repeatable workflow. Write the instructions once, invoke with `/skill-name`, and Claude runs it — no re-explaining every time.

Think of them as slash commands you write yourself.

---

## Skills

| Skill | Category | What it does |
|-------|----------|-------------|
| [`/deploy-check`](./deploy-check/SKILL.md) | DevOps | Pre-flight checklist before every production push. Catches TypeScript errors, staged secrets, pending migrations. |
| [`/model-audit`](./model-audit/SKILL.md) | AI | Full AI model routing table. Every AI call, what model it uses, cost per call. |
| [`/economics`](./economics/SKILL.md) | AI | Unit economics calculator. Revenue per action, API cost, gross margin, free tier damage. |
| [`/changelog`](./changelog/SKILL.md) | Workflow | Weekly changelog card for Twitter/X. Reads git log, distills into 6 punchy items. |
| [`/cold-email`](./cold-email/SKILL.md) | Workflow | Write cold emails that actually get replies. 2-4 sentence formula with real examples from Evan Spiegel, Mark Cuban, Elon Musk. |

---

## Install

### All skills at once (recommended)

```bash
npx skills add tushaarmehtaa/tushar-skills
```

### One skill

```bash
# Replace "deploy-check" with the skill you want
curl -sL https://raw.githubusercontent.com/tushaarmehtaa/tushar-skills/main/deploy-check/SKILL.md \
  -o ~/.claude/skills/deploy-check/SKILL.md --create-dirs
```

Then in any Claude Code session:

```
/deploy-check
/model-audit
/economics
/changelog
/cold-email
```

---

## Add your own skill

This is an open-source skills directory. Contribute your own:

1. Create a folder with your skill name (lowercase, hyphenated)
2. Add a `SKILL.md` with YAML frontmatter and instructions
3. Open a PR — it automatically appears on the site

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

---

## Customise

These skills are project-agnostic — they read your codebase and adapt. But you may want to tweak:

- **deploy-check**: add project-specific checks
- **economics**: hardcode your token estimates if you know your average prompt sizes
- **changelog**: lock in your own HTML template

Edit the `SKILL.md` file in each folder. Plain markdown — just instructions Claude follows.

---

## How skills work

Claude Code looks for skills in `~/.claude/skills/[skill-name]/SKILL.md`. When you type `/skill-name`, it loads the file and follows the instructions in the context of your current project.

More on Claude Code skills: [docs.anthropic.com](https://docs.anthropic.com)

---

Built by [@tushaarmehtaa](https://twitter.com/tushaarmehtaa)
