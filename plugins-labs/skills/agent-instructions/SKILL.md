---
name: agent-instructions
description: Create or reconcile scoped AGENTS.md, CLAUDE.md, and Cursor rules from repository evidence. Use when coding-agent guidance is missing, stale, duplicated, or conflicting.
license: MIT
---

# Agent instructions

Create the smallest set of instruction files that helps the requested coding agent work safely and accurately in this repository. Recover facts from the repository before asking questions, and distinguish commands you executed from commands you only found in documentation.

## Choose the task and target

Determine whether the request is to:

- create instructions where none exist;
- improve one existing file;
- reconcile duplicated or conflicting instruction files;
- add scoped instructions for a package or subtree; or
- translate shared repository facts for more than one agent runtime.

Infer the target from the request and existing conventions. Ask only when the choice changes installation scope or runtime behavior. Do not create parallel vendor files unless the user asks for them.

Use the target's native form:

- `AGENTS.md` for agents that follow directory-scoped AGENTS instructions;
- `CLAUDE.md` for Claude Code project memory;
- `.cursor/rules/*.mdc` or the repository's existing Cursor convention;
- nested files only when a subtree needs meaningfully different commands, ownership, or boundaries.

## Inventory instruction scope

Before writing, locate all existing agent instructions and relevant repository guidance:

```bash
pwd
rg --files -g 'AGENTS.md' -g 'CLAUDE.md' -g '.cursor/**' -g 'README*' -g 'CONTRIBUTING*' -g 'Makefile' -g 'justfile' -g 'package.json' -g 'pyproject.toml' -g 'Cargo.toml' -g 'go.mod'
```

For each instruction file, record its directory, intended runtime, inherited scope, and any statements that conflict with a nearer file or repository evidence. Respect the nearest scoped instruction. Do not duplicate root guidance in every nested file.

Preserve valid project-specific constraints. Remove stale facts and redundant prose only when the replacement retains their intent.

## Build an evidence map

Read the minimum repository evidence needed to establish:

- project purpose, language, framework, and runtime versions;
- package or workspace boundaries;
- install, development, build, lint, typecheck, test, and release commands;
- entry points and locations of domain logic;
- generated files, migrations, credentials, deployment configuration, and other high-risk areas;
- naming, testing, formatting, and architectural conventions visible in representative code;
- required services, environment variables, ports, and setup order.

Prefer manifests, scripts, CI workflows, and executable configuration over prose. When sources disagree, report the conflict and use the source that controls actual execution.

Do not paste an exhaustive directory map. Include a path only when it changes how an agent should navigate, edit, or verify work.

## Verify commands proportionately

Classify each command as one of:

- **executed** — ran successfully in the current environment;
- **partially verified** — syntax or a narrow target ran, but dependencies or services prevented full verification;
- **documented only** — found in a trusted project source but not run;
- **stale or conflicting** — contradicted by configuration or failed for a repository reason.

Run safe, relevant checks when feasible. Do not start long-lived services, mutate external systems, install dependencies, or run destructive commands merely to upgrade a verification label. State prerequisites beside commands that need them.

## Write for the target runtime

Keep shared repository facts consistent, but adapt runtime-specific mechanics rather than copying one vendor file verbatim.

### AGENTS.md

Express directory-scoped instructions, commands, boundaries, and verification expectations. Put specialized guidance in the nearest directory that owns it.

### CLAUDE.md

Write durable project memory: commands, architecture landmarks, conventions, and hazards. Avoid unsupported runtime features or generic advice already supplied by Claude Code.

### Cursor rules

Follow the repository's current rule-file format and globs. If the repository has no Cursor rules, confirm the current supported format in Cursor's official documentation before creating one; do not infer a schema from memory or another runtime. Split rules only when activation scope differs. Verify frontmatter and glob coverage against the files the rule should govern.

## Resolve conflicts explicitly

For each conflict, choose one action:

1. retain the nearer scoped rule;
2. replace stale guidance with verified repository behavior;
3. separate runtime-specific instructions from shared facts;
4. ask the user when two live policies express different intent that the repository cannot resolve.

Do not silently choose between policy statements about deployment, generated files, security, data handling, or ownership.

## Output contract

When editing, deliver:

1. the requested instruction file or files;
2. a short scope summary naming which directories and runtimes they govern;
3. a command table with verification labels;
4. conflicts resolved, preserved, or still requiring a decision;
5. any facts deliberately omitted because they were unverified or too volatile.

Keep files concise enough to scan, but let repository complexity determine length. Prefer concrete imperatives and paths over explanatory essays.

## Verify

After writing:

1. Re-read every instruction file that applies to each edited location and confirm precedence is coherent.
2. Confirm every path, script name, package name, port, and environment-variable name exists in repository evidence.
3. Re-run the safe commands used as acceptance checks, or label them accurately when full execution was unavailable.
4. Confirm nested files contain only scope-specific differences and do not contradict inherited rules.
5. Check runtime-specific syntax against an existing valid file, an installed validator, or current official runtime documentation. If none is available, label syntax as unverified rather than presenting it as established.
6. Compare the final file with the evidence map and remove unsupported claims, generic agent advice, and duplicated repository documentation.
7. Report verification results and limitations; do not describe a documented-only command as tested.
