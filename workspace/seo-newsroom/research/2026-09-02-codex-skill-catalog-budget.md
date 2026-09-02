# Codex skill-catalog budget — research brief

## Decision saved on 2026-09-02

Research the observable consequences of Codex's initial skill-catalog budget. Do not begin with an article.

Reader question: **When many Agent Skills are installed, which descriptions does Codex shorten or omit, what warning appears, and how does that affect discovery?**

Official evidence: OpenAI documents that Codex's initial list of skill names, descriptions, and paths uses at most 2% of the model context window, or 8,000 characters when the context size is unknown. It shortens descriptions first and may omit skills with a warning. The full `SKILL.md` remains available after selection.

## Controlled fixture

1. Create an isolated temporary Git repository with project-scoped `.agents/skills`; do not alter the user's existing global skills.
2. Generate deterministic sets of 10, 25, 50, and 100 harmless skills. Keep names, ordering, description lengths, and distinguishing trigger phrases in a checked-in manifest.
3. Include a stable subset of real Slashskills descriptions at every size so the results connect to the owned catalog without modifying production packages.
4. Record Codex version, model/context setting, repository path, fixture hash, and exact invocation for every run.

## Measurements

- Initial catalog characters and entries exposed to the model.
- Descriptions preserved, shortened, or omitted, including ordering.
- Exact warning text and when it first appears.
- Whether explicit `$skill-name` invocation still loads an omitted skill.
- Whether deterministic prompts implicitly select preserved, shortened, and omitted skills.
- Differences across supported context sizes or model settings that can be selected without changing the fixture.

Preserve raw terminal output and the fixture manifest. Repeat each selection task enough to distinguish consistent behavior from one-off model variance. Documentation claims remain documentation until reproduced.

## Safety and stop conditions

- Use project scope in a disposable repository only.
- Use instruction-only skills with no shell, network, credential, or file-mutation behavior.
- Do not claim a stable ordering rule from a single run.
- Stop if the installed Codex version or model context cannot be recorded precisely.

## Expected contribution

Turn the results into practical description guidance: what to front-load, how terse descriptions should be, and how operators can recognize catalog pressure. This is useful only if measurements go beyond repeating the official limit.

## Publication gate

- **Straightforward results:** update `/guides/codex` and `/skill-creator`; create no URL.
- **Unexpected deterministic omission behavior or a reusable audit method:** reassess a distinct guide.
- **Inconclusive or unstable results:** retain the artifacts and stop.

## Exact restart point

Write the fixture manifest under `workspace/seo-newsroom/experiments/codex-skill-catalog-budget/` before generating any skills, then run the 10-skill baseline with the current Codex version.
