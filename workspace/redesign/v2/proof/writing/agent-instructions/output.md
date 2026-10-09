I've added two files: `AGENTS.md` holds all the instructions, and `CLAUDE.md` pulls them in with an import, so Codex and Claude Code read the same text. Nothing is committed yet.

**Files**
- `AGENTS.md` (repo root): what the project is, where the code lives, the commands, the coding conventions, and one "do not edit" area. Codex reads this file directly.
- `CLAUDE.md` (repo root): just `@AGENTS.md` plus a comment saying Claude-only notes go below it. The current Claude Code docs show this exact pattern for sharing one file between tools. I used the import rather than relying on Claude Code reading `AGENTS.md` on its own: that only works on v2.1.277 or later, and it stops as soon as a `CLAUDE.md` or `CLAUDE.local.md` exists.

There were no instruction files before, so nothing conflicted. The repo is a single small package, so one root file covers everything.

**Commands**

| Command | Status |
|---|---|
| `npm test` | Ran: 3 of 3 tests passed (Node v23.11.0) |
| `npm run lint` | Ran: passed. It only checks syntax, and only for `bin/mdtally.js` and `src/count.js` |
| `node bin/mdtally.js test/sample.md --json` | Ran: printed the expected JSON |

There's nothing to install because the package has no dependencies.

**Rules I wrote down that are easy to miss**
- The default reading speed (230 words per minute) is set in two places, `src/count.js` and `bin/mdtally.js`, so they have to change together.
- The lint script names each file it checks, so any new source file has to be added to it by hand.
- `.claude/skills/` and `skills-lock.json` are managed by `npx skills` and shouldn't be edited by hand.

**Left out**
- The repo has no CI, release, or publish setup, so the files say nothing about them.
- `.install.log` and `.install-method` look like leftovers from installing the skill, but they're committed. I didn't mention them in the instructions; you may want to delete them or add them to `.gitignore`.

Want me to commit the two files?