# tushar-skills

Four Claude Code skills I use on every project. Drop them in, invoke with a slash command, get structured output in seconds.

---

## What are Claude Code skills?

Skills are markdown files that teach Claude Code a repeatable workflow. You write the instructions once, invoke the skill with `/skill-name`, and Claude runs it automatically — no re-explaining every time.

Think of them as slash commands you write yourself.

---

## Skills

### `/deploy-check`
Pre-flight checklist before every production push.

Catches: TypeScript errors, accidentally staged secrets, pending database migrations, missing environment variables, and surfaces hygiene reminders (changelog, README, docs).

Run it before every push. It takes 30 seconds and has saved me from pushing broken TypeScript, committing a `.env` file, and deploying without running migrations.

---

### `/model-audit`
Full AI model routing table for your product.

Reads your codebase, finds every AI call, resolves aliases to actual model names, and prints a complete table: feature → model → cost per call.

Run it whenever you change models or when API pricing updates. Catches the silent problem of hardcoded model names scattered around the codebase that don't get updated when you change your config.

---

### `/economics`
Unit economics calculator for AI products.

Reads your credit pricing and action costs from the codebase, fetches current API pricing, and calculates margin per action + free tier damage.

Run it when model pricing changes or when you're deciding whether to change your credit pricing. Replaces the spreadsheet you keep meaning to update.

---

### `/changelog`
Weekly changelog card for Twitter/X.

Reads git log, distills the week's work into 6 punchy items in plain English, fills an HTML template, and opens it in your browser ready to screenshot and post.

Run every Friday. Turns "write a changelog" from a 20-minute chore into a 2-minute one.

---

## Install

```bash
# Clone the repo
git clone https://github.com/tushaarmehtaa/tushar-skills.git

# Copy skills to Claude Code's skill directory
cp -r tushar-skills/deploy-check ~/.claude/skills/
cp -r tushar-skills/model-audit ~/.claude/skills/
cp -r tushar-skills/economics ~/.claude/skills/
cp -r tushar-skills/changelog ~/.claude/skills/
```

Then in any Claude Code session:
```
/deploy-check
/model-audit
/economics
/changelog
```

---

## Customise

These skills are written to be project-agnostic — they read your codebase and adapt. But you may want to tweak:

- **deploy-check**: add project-specific checks (e.g. your own sync check between two files)
- **economics**: hardcode your token estimates if you know your average prompt sizes
- **changelog**: lock in your own HTML template once you have a design you like

Edit the `SKILL.md` file in each folder. The format is plain markdown — just instructions Claude follows.

---

## How skills work

Claude Code looks for skills in `~/.claude/skills/[skill-name]/SKILL.md`. When you type `/skill-name`, it loads the file and follows the instructions in the context of your current project.

More on Claude Code skills: [docs.anthropic.com](https://docs.anthropic.com)

---

Built by [@tushaarmehtaa](https://twitter.com/tushaarmehtaa)
