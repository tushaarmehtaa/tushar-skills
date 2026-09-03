---
name: skill-creator
description: Create, improve, merge, and validate portable Agent Skill packages with adaptive workflows and behavioral evals. Use when authoring or reconstructing SKILL.md packages.
license: MIT
---

# Skill creator

Turn a repeatable workflow into a compact specialist package, or improve an existing package without erasing its effective domain knowledge. Optimize for correct behavior on real requests rather than conformity to one Markdown template.

## Choose the mode

- **Create** — build a new package from concrete usage examples.
- **Improve** — diagnose and revise an existing package while preserving working behavior.
- **Merge** — combine overlapping packages, reconcile triggers and resources, and define migration boundaries.
- **Validate** — inspect structure, resource routing, triggers, and behavior without changing the package unless asked.

Read the current package, repository conventions, validators, and catalog metadata before asking questions. Ask only for intent that cannot be recovered and would materially alter trigger scope, side effects, or output.

## Model real usage

Collect or derive representative prompts:

- direct requests that should trigger;
- common paraphrases and incomplete requests;
- near-miss requests that belong to another skill;
- multi-turn requests where the skill becomes relevant later;
- risky, unavailable, or ambiguous cases that require a branch;
- examples of successful output and known failure modes.

For each positive example, outline the execution path from inputs to verified outcome. Identify decisions that depend on context and operations that should remain deterministic.

## Audit an existing package

When improving or merging, inventory:

- frontmatter trigger coverage and collisions;
- user inputs, inferred context, and unnecessary questions;
- decision branches and missing failure paths;
- domain rules versus generic advice;
- output and side-effect contract;
- verification that exercises behavior rather than checking ingredients;
- every reference, script, and asset, including reachability and duplication;
- runtime-specific assumptions and portability constraints.

Preserve concise, evidence-backed instructions and tested resources. Remove false precision, unsupported claims, authorial house style, and formatting rules that do not affect behavior.

For merges, map which package owns each trigger, workflow, resource, and output. Resolve contradictory rules explicitly and state whether old package names need a compatibility or migration path.

## Design the resource graph

Keep core selection logic, invariants, workflow, output, and verification in `SKILL.md`. Move material only when it improves execution:

- `references/` for conditional domain knowledge, provider or framework variants, schemas, and extended examples;
- `scripts/` for repeated deterministic work, parsing, conversion, or validation that should not be regenerated each run;
- `assets/` for templates, fixtures, media, or boilerplate copied into outputs rather than read as instructions.

Link every reference directly from `SKILL.md` at the decision that requires it and say when to read it. Avoid forcing unrelated references into context. Add a `Contents` section near the top of reference files longer than 100 lines.

Do not duplicate the same rule in the main file and a reference. Test added scripts by running representative inputs, including failure cases.

## Write the trigger

Use the repository's frontmatter contract. The description must state both capability and trigger context in concrete language. Include important modes when they affect discovery, but do not turn the description into a workflow summary.

Front-load the distinctive capability and strongest trigger in the opening clause. Runtimes may shorten catalog descriptions as more skills are installed, so do not depend on a qualifier or disambiguating phrase near the end. Keep the whole description concise enough to preserve useful routing detail under pressure.

Check the trigger against:

1. positive examples;
2. paraphrases that omit the skill's preferred nouns;
3. adjacent tasks that should not trigger;
4. broad requests where another skill should remain primary;
5. contexts where this skill is necessary even if not explicitly named.

Avoid vague “helps with” wording and avoid runtime branding unless the workflow truly depends on that runtime.

## Write adaptive instructions

Set the degree of freedom from task variability:

- use principles and decision criteria when multiple approaches are valid;
- use parameterized patterns when a preferred approach has meaningful variants;
- use deterministic scripts and strict sequencing for fragile, repeatable operations.

The body should tell the next agent how to inspect context, choose a branch, execute, handle unavailable inputs, produce a bounded output, and verify the result. Do not mandate phase numbering, a heading style, checklist syntax, tone, or arbitrary line target beyond the repository's actual constraints.

Prefer observable rules. Replace “make it polished” with the evidence, behavior, or acceptance check that demonstrates polish in this domain.

## Define side effects and output

State whether the skill answers, audits, edits files, runs commands, opens applications, or changes external state. Separate report-only work from mutation and require approval where the underlying action is consequential.

Define the minimum complete output, source/provenance expectations, how blocked facts are represented, and what limitations must be reported. Avoid a single fixed output form when audit, generation, and implementation modes need different artifacts.

## Build behavioral evals

Create a small eval set with expected behavior, not only trigger labels:

```text
Prompt:
Expected trigger decision:
Expected mode and context inspection:
Expected questions, if any:
Expected artifact or changes:
Expected verification:
Disallowed behavior:
```

Cover positive, negative, near-miss, incomplete-input, multi-turn, and failure-recovery cases. For a reconstructed skill, include at least one regression case for each major defect being fixed.

When feasible, forward-test the package in a clean context using raw prompts and artifacts. Do not leak the intended answer or audit diagnosis into the test. Compare observed behavior with the expected contract and revise the package when failures expose a generalizable gap.

## Package and validate

1. Keep `SKILL.md` at the package root and within the repository's line limit.
2. Confirm the directory name and frontmatter name agree.
3. Parse frontmatter using the repository validator.
4. Resolve every relative Markdown link.
5. Confirm references are directly and conditionally routed from `SKILL.md`.
6. Confirm references longer than 100 lines have a contents section.
7. Run and test deterministic scripts that changed.
8. Run the repository's skill validator on every touched package.
9. Re-run representative behavioral evals after structural changes.

## Output contract

Deliver:

- the complete package, including changed resources;
- a concise behavior summary and trigger boundary;
- validation and eval results;
- resources added, removed, or rerouted;
- preserved behavior and intentional breaking changes;
- remaining limitations or untested environments.

Read [the authoring guide](references/guide.md) when selecting a multi-file resource structure, designing eval cases, merging packages, or diagnosing portability and routing failures.
