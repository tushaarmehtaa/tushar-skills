---
name: init-claude-md
description: Read a project codebase and write a complete CLAUDE.md. Detects stack, commands, key files, and gotchas so Claude has accurate context from the first message.
category: workflow
tags: [claude, context, setup, onboarding]
author: tushaarmehtaa
---

Read the project. Write a CLAUDE.md that gives Claude accurate context from the first message.

## Steps

### 1. Read the project

```bash
ls -la
cat package.json 2>/dev/null
cat README.md 2>/dev/null | head -60
cat .env.example 2>/dev/null
ls src/ app/ lib/ backend/ frontend/ api/ 2>/dev/null
```

Identify: language, framework, entry points, project type (web app, API, CLI, library, mobile).

### 2. Detect the stack

Read the dependency manifests:
- `package.json` — Node/React/Next.js. Note major versions. Next.js 15 vs 14 is a breaking difference.
- `Cargo.toml` — Rust
- `requirements.txt` / `pyproject.toml` — Python
- `go.mod` — Go
- `src-tauri/` — Tauri (Rust + web frontend)

List framework, ORM/database client, auth provider, and key external services.

### 3. Verify the commands

Do not assume `npm run dev`. Check `package.json` scripts, `Makefile`, `justfile`, or README:

```bash
cat package.json | grep -A 20 '"scripts"'
cat Makefile 2>/dev/null | grep "^[a-z]"
```

For each command, note the expected port, any required environment variables, and whether a venv or specific runtime version is needed.

### 4. Map key files

Walk the directory structure. Note:
- Main entry point
- Core business logic
- Config files that change behavior (auth config, DB schema, billing)
- Files that are easy to break (migrations, webhooks, payment handlers)
- Non-obvious locations (e.g. `src-tauri/src/lib.rs` for Tauri backend)

### 5. Find the gotchas

Look for:
- Comments like `// DO NOT MODIFY`, `// IMPORTANT`, or `// WARNING`
- Non-standard conventions or patterns unique to this project
- Monorepo or multi-package structure
- External services that require API keys to run locally
- Known issues, TODOs, or WIP branches

### 6. Write CLAUDE.md

```markdown
# Project Name

One sentence on what this is.

## Commands
\`\`\`bash
# dev (runs on port XXXX)
command here

# build
command here

# test
command here
\`\`\`

## Key Files
- `path/to/entry.ts` — what it does
- `path/to/config.ts` — what it controls

## Stack
- Framework + version
- Database + ORM
- Auth provider
- Key external services

## Gotchas
- Non-obvious things that would trip someone up
- What not to touch without reading X first
- Any invariants the code depends on
```

Keep it under 60 lines. Leave out sections that don't apply. A short accurate CLAUDE.md beats a long padded one every time.
