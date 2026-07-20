# Agent Skill Authoring Guide

Use this guide when a workflow needs a concrete package example, bundled resources, or help diagnosing a structural mistake.

## Contents

- [Annotated single-file skill](#annotated-single-file-skill)
- [Annotated multi-file skill](#annotated-multi-file-skill)
- [Common structural mistakes](#common-structural-mistakes)
- [Portability review](#portability-review)

## Annotated single-file skill

Directory:

```text
release-notes/
└── SKILL.md
```

`release-notes/SKILL.md`:

````markdown
---
name: release-notes
description: Draft release notes from repository changes and group them by user impact. Use when preparing a product or library release.
license: MIT
---

Turn a verified set of changes into concise release notes for users.

## Phase 1: Establish scope

Read the repository status, compare the release range, and identify the target version. Ask only for information that cannot be recovered from the repository.

**Do not include uncommitted work unless the user explicitly includes it.**

## Phase 2: Classify changes

Group each user-visible change under Added, Changed, Fixed, Deprecated, Removed, or Security. Exclude dependency churn and internal refactors unless they change behavior.

## Phase 3: Draft

Write one bullet per behavior change. Lead with the user outcome and mention migration steps beside the affected change.

## Verify

```
[ ] Release range and version are explicit
[ ] Every claim maps to a commit or diff
[ ] Breaking changes include migration steps
[ ] Internal-only changes are excluded
```
````

Annotation:

- `name` matches the `release-notes` directory and uses lowercase hyphenated text.
- `description` states both the output and the trigger context in fewer than 200 characters.
- `license` is a standard package field and matches the repository license.
- The opening sentence states the outcome without repeating discovery metadata.
- Phases describe the workflow in imperative language.
- The bold warning protects the highest-risk boundary.
- Every verification item is observable.

## Annotated multi-file skill

Use bundled references when provider variants, examples, schemas, or domain rules would make the main file too large.

```text
deploy-service/
├── SKILL.md
└── references/
    ├── fly.md
    └── railway.md
```

`deploy-service/SKILL.md` keeps shared workflow and routing instructions:

````markdown
---
name: deploy-service
description: Prepare and deploy a web service with provider-specific configuration and checks. Use when shipping an app to Fly.io or Railway.
license: MIT
---

Deploy a web service through a verified, provider-specific path.

## Phase 1: Detect the target

Read existing deployment files before asking. Confirm the provider, service entry point, health route, required secrets, and rollback command.

## Phase 2: Load one provider guide

- For Fly.io, read [the bundled Fly guide](references/fly.md) before editing configuration.
- For Railway, read [the bundled Railway guide](references/railway.md) before editing configuration.

Load only the selected provider guide.

## Phase 3: Verify

Run the project's tests and build, validate the provider configuration, and check the health route after deployment.

## Verify

```
[ ] Exactly one provider guide was used
[ ] Build and configuration checks pass
[ ] Required secrets are present but not committed
[ ] Health route responds after deployment
[ ] Rollback command is recorded
```
````

Each reference should contain only its provider's commands, configuration, failure modes, and verification steps. The main file links both references directly and says when to read each one.

## Common structural mistakes

### Catalog metadata in package frontmatter

Bad:

```yaml
category: devops
tags: [deploy, cloud]
author: example
```

Keep discovery, grouping, and authorship in the repository catalog. Package frontmatter should remain portable across runtimes.

### Vague trigger description

Bad:

```yaml
description: Helps with releases.
```

Better:

```yaml
description: Draft release notes from repository changes and group them by user impact. Use when preparing a product or library release.
```

### Runtime branding without a real constraint

Bad: "Create a runtime-specific skill" when the workflow only reads files and runs ordinary shell commands.

Better: call it an Agent Skill and add `compatibility` only if the workflow requires a runtime-specific file, tool, or behavior.

### Orphaned resources

Bad: bundle `references/provider.md` without mentioning it in `SKILL.md`.

Better: link it from the relevant decision point and state exactly when the agent should load it.

### Broken promises

Bad: link a missing advanced guide or depend on a command supplied by another unpublished skill.

Better: include the required resource, describe an optional external workflow neutrally, or remove the promise.

### Oversized main file

Bad: put every framework or provider implementation in `SKILL.md`.

Better: keep selection logic and invariant steps in the main file, then move variants into directly linked references. Keep the main file under 500 lines.

### Unverifiable checklist

Bad:

```text
[ ] Output is high quality
```

Better:

```text
[ ] Every relative Markdown link resolves inside the skill directory
```

## Portability review

Before delivery, answer these questions:

1. Does the workflow rely on a branded slash-command syntax?
2. Does it name a tool that only one runtime exposes?
3. Does it assume resources are installed separately from the skill directory?
4. Can each command run in the detected project environment?
5. Are all runtime-specific constraints declared in `compatibility`?

Replace invocation syntax with neutral skill names, route tool use by capability, and keep the package self-contained.
