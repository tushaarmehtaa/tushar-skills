# Agent Skill authoring guide

Use this reference when the package needs conditional resources, behavioral evals, merge decisions, or portability diagnosis.

## Contents

- [Choosing package contents](#choosing-package-contents)
- [Single-file example](#single-file-example)
- [Conditional-reference example](#conditional-reference-example)
- [Behavioral eval design](#behavioral-eval-design)
- [Improving an existing skill](#improving-an-existing-skill)
- [Merging overlapping skills](#merging-overlapping-skills)
- [Routing and portability failures](#routing-and-portability-failures)

## Choosing package contents

Keep instructions in `SKILL.md` when the agent needs them for every invocation: context inspection, branch selection, invariants, side-effect boundaries, output, and verification.

Use a reference when knowledge is needed only for a selected framework, provider, file format, or advanced mode. Route it from the exact decision point.

Use a script when the operation is deterministic, repeated, easy to get subtly wrong, or expensive to regenerate. Scripts need input validation, useful failures, and representative execution tests.

Use an asset when a file is copied, adapted, or rendered rather than read as instructions. Keep placeholders out of finished outputs and document required substitutions in the main workflow.

## Single-file example

```markdown
---
name: release-notes
description: Draft and verify user-facing release notes from a repository change range. Use when preparing a product or library release.
license: MIT
---

# Release notes

Identify the release range and audience from tags, branches, and repository policy. Ask only when the range or release status remains ambiguous.

## Classify changes

Map every user-visible claim to a commit or diff. Include internal work only when it changes compatibility, security, reliability, or operation.

## Output

Produce grouped notes, migration instructions beside breaking changes, and a provenance table.

## Verify

Re-check every claim against the range, run available link checks, and report unverified release facts.
```

This package does not need a reference because its branches and domain rules fit comfortably in the main file.

## Conditional-reference example

```text
deploy-service/
├── SKILL.md
└── references/
    ├── fly.md
    └── railway.md
```

The main workflow should route, not summarize both providers:

```markdown
Detect the existing provider from configuration and deployment metadata.

- For Fly.io, read `references/fly.md` before changing provider configuration.
- For Railway, read `references/railway.md` before changing provider configuration.

Read only the selected provider reference. Ask when no provider evidence exists and choosing one would create an external commitment.
```

Each provider reference owns its commands, configuration, failure modes, secrets handling, deployment verification, and rollback. Do not repeat shared build checks in both references.

The paths above are illustrative package contents, not links in this guide.

## Behavioral eval design

A trigger-only list cannot reveal whether the skill asks needless questions, chooses the wrong mode, mutates too much, or verifies only ingredients.

Write expected behavior for each case:

```text
Prompt: Improve our existing deployment skill; it assumes Fly but we moved to Railway.
Trigger: yes
Mode: improve
Inspection: existing SKILL.md, both provider resources, deployment files, validators
Questions: only unresolved migration or compatibility intent
Output: revised trigger and Railway branch; stale Fly behavior removed or scoped
Verification: links resolve, validator passes, Railway eval succeeds, Fly near-miss does not route incorrectly
Disallowed: creating a second overlapping skill without explaining the boundary
```

Useful eval categories:

- direct positive request;
- paraphrase without the skill name;
- adjacent negative request;
- broad request where another skill should lead;
- incomplete input recoverable from repository evidence;
- missing input that genuinely requires a question;
- unsafe or unavailable operation;
- multi-turn request that changes mode;
- regression case from a prior failure.

Evaluate artifacts and actions, not rhetorical quality alone. A good result may be concise if it made the right decisions and verified them.

## Improving an existing skill

Start with observed failure modes and package evidence. Compare:

1. what the trigger promises;
2. what the body can actually do;
3. what references and scripts supply;
4. what the output contract claims;
5. what verification demonstrates.

Common defects include:

- a trigger advertises modes absent from the workflow;
- mandatory questionnaires ignore repository evidence;
- examples harden into universal style rules;
- exact counts and limits lack a domain reason;
- a checklist verifies wording or components but not behavior;
- references are linked without a condition or duplicate the main file;
- implementation snippets contradict the stated invariant;
- the package edits when the user requested only an audit.

Preserve effective specialist knowledge while replacing the mechanism that caused the failure. Re-run a regression eval for each repaired class.

## Merging overlapping skills

Build a table of trigger intents, inputs, workflows, resources, outputs, and side effects. Choose a primary package based on the clearest domain boundary, not the preferred name.

Decide for every overlap whether to:

- unify it as shared core behavior;
- keep it as a conditional branch;
- move provider or format depth to a reference;
- retain a separate skill because the user intent or side-effect boundary differs;
- deprecate an old package with an explicit migration path.

Test the merged trigger against prompts that formerly selected each source skill and against adjacent prompts that should still remain outside it.

## Routing and portability failures

Check for:

- orphaned resources;
- links that resolve only from the repository root rather than the package file;
- references that point to files shown only as examples;
- nested reference chains that hide necessary instructions;
- runtime-only tool names presented as universal capabilities;
- dependencies on separately installed unpublished skills;
- commands that assume a package manager, shell, or directory without detection;
- assets described as references or references copied as output assets;
- generated metadata that no longer matches the skill.

Fix portability by routing tool use by capability, declaring real compatibility constraints, resolving paths relative to their containing file, and keeping every required resource inside the delivered package.
