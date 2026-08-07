---
name: readme
description: Audit, write, and verify README files for adoption, operation, contribution, or internal orientation. Use when repository documentation is missing, inaccurate, or hard to follow.
license: MIT
---

# README

Create the README its actual readers need, grounded in repository behavior. Accuracy and successful first use come before promotional completeness.

## Choose mode and reader job

- **Audit** — report accuracy, coverage, and usability defects; edit only when requested.
- **Repair** — update specific weak or stale sections.
- **Generate** — create a README when none exists or a rewrite is explicitly requested.

Identify the repository type and primary reader job:

- library or SDK adoption;
- CLI installation and first command;
- hosted application setup or contribution;
- service operation and local development;
- monorepo navigation and package ownership;
- standard, dataset, research, or documentation project;
- internal project orientation.

Recover product purpose, audience, package manager, commands, supported versions, configuration, examples, repository policy, and license from code and authoritative files. Ask only for missing intent that the repository cannot establish.

## Audit accuracy first

Check every material README claim against manifests, source, CI, examples, configuration, and license files. Prioritize defects that cause a failed install, unsafe operation, wrong API usage, security misunderstanding, or legal ambiguity.

For each finding report:

```text
[severity] [section or line]
Claim or omission:
Repository evidence:
Reader impact:
Recommended repair:
Verification:
```

Do not let a numerical score hide a release-blocking defect. If the user requests scoring, score dimensions appropriate to the reader job and explain weighting.

## Design the information path

Choose sections from reader needs rather than a fixed template. Most public software READMEs need some form of:

1. identity and concise purpose;
2. who it is for and what problem it solves;
3. prerequisites and installation;
4. minimal successful use with expected result;
5. important capabilities, constraints, or compatibility;
6. configuration and operational requirements;
7. links to deeper documentation;
8. development, contribution, support, security, and license information when relevant.

Internal services may emphasize ownership, dependencies, local setup, common operations, and runbooks. Monorepos may need a package map before installation. Research or data repositories may need methodology, provenance, citation, and reproducibility rather than badges or marketing visuals.

Put the first successful path early. Keep reference material in dedicated docs when the README would become harder to navigate, but do not hide prerequisites or critical warnings behind links.

## Write from verified behavior

The opening should let the intended reader identify the project and its use without relying on slogans. Do not force an arbitrary word count when a qualifier is necessary for accuracy.

Installation commands must match the repository's package manager, supported runtime, workspace layout, and environment needs. Show the simplest working use that represents the real API or product, along with an observable result.

Use feature lists only when they help selection. Name capabilities and relevant outcomes without inventing performance, popularity, or customer proof.

Do not add badges, banners, screenshots, or GIFs as mandatory ingredients:

- add status badges only for maintained, meaningful endpoints;
- add visuals when they materially clarify a UI, CLI result, architecture, or workflow;
- use existing brand assets and repository conventions;
- do not create decorative media or noisy badge rows to improve an audit score.

Describe the repository's actual license and link to its file. When no license is present, report the practical ambiguity without giving categorical legal advice.

## Handle commands and examples safely

Classify commands as executed, partially verified, documented only, or unavailable. Prefer a clean temporary environment for install/quick-start verification when feasible and safe. Do not publish secrets, personal paths, or environment values captured locally.

Compile, typecheck, or run examples when the project makes that practical. If an example is illustrative rather than executable, label it and keep it consistent with current APIs.

## Output contract

In generate or repair mode, deliver the updated `README.md` and a short report containing:

- primary audience and reader job;
- authoritative sources used;
- commands and examples actually executed;
- sections added, removed, or intentionally omitted;
- links, assets, badges, and license status checked;
- limitations or setup paths that remain unverified.

In audit mode, deliver prioritized findings and proposed replacements for the most consequential defects. Do not rewrite only the lowest-scoring cosmetic sections.

## Verify

1. Read the README in order as a new member of the intended audience and confirm the first-use path is discoverable.
2. Check project name, package names, versions, paths, environment variables, ports, and expected output against repository evidence.
3. Run installation and the minimal usage path in a clean environment when feasible; label anything not executed.
4. Validate code blocks using the project's compiler, interpreter, linter, or doctest path where available.
5. Check relative links, anchors, referenced files, images, badge endpoints, and external documentation links with available tooling.
6. Confirm prerequisites, destructive operations, migrations, security-sensitive configuration, and known constraints are visible at the point of use.
7. Confirm contribution and test commands match CI and repository scripts.
8. Confirm license wording matches the repository license file or clearly reports its absence.
9. Remove placeholders, invented claims, stale screenshots, and sections that do not serve the identified reader job.
10. Report the environment and checks used so “ready” does not imply unperformed verification.
