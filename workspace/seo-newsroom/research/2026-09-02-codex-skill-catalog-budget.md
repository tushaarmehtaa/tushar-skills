# Codex skill-catalog budget — controlled results

## Decision saved on 2026-09-02

Research the observable consequences of Codex's initial skill-catalog budget. Do not begin with an article.

Reader question: **When many Agent Skills are installed, which descriptions does Codex shorten or omit, what warning appears, and how does that affect discovery?**

Official evidence: OpenAI documents that Codex's initial list of skill names, descriptions, and paths uses at most 2% of the model context window, or 8,000 characters when the context size is unknown. It shortens descriptions first and may omit skills with a warning. The full `SKILL.md` remains available after selection.

## Result saved on 2026-09-03

The controlled catalog capture ran on Codex CLI 0.152.1 with `gpt-5.6-sol`. The final privacy-safe capture began with 109 model-visible skills. The fixture added 10, 25, 50, and 100 project-scoped probes without changing the user's global catalog.

| Project probes | Total visible skills | Skill section | Visible probe description | Omitted probes | Front markers visible |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 10 | 119 | 22,232 chars | 118–120 chars | 0 | 3/10 |
| 25 | 134 | 22,238 chars | 98–100 chars | 0 | 10/25 |
| 50 | 159 | 22,241 chars | 72–76 chars | 0 | 23/50 |
| 100 | 209 | 22,253 chars | 40–44 chars | 0 | 48/100 |

Codex kept the model-visible skill section almost fixed at 22.2k characters. It progressively shortened descriptions across the whole catalog as probes were added. No probe name was omitted through the 209-skill condition. Every front-loaded synthetic marker survived; every rear-loaded marker was removed. The five real Slashskills descriptions were all shortened at 25 project probes and above.

An earlier capture in the same experiment began with 111 ambient skills and ended at 211; its probe-description lengths and omission counts were identical. The two-skill ambient drift reinforces that project-probe conditions and observed compression are the reusable result, not a universal total-skill threshold.

Interactive runs emitted this exact warning at the crowded condition:

> Skill descriptions were shortened to fit the skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.

The final deconfounded selection check used opaque skill names so the trigger could not reveal a filename:

| Check at 100 project probes | Successes | Interpretation |
| --- | ---: | --- |
| Explicit invocation of a rear-trigger skill | 3/3 | Explicit invocation still loaded the full skill. |
| Implicit selection with the trigger at the description front | 3/3 | The visible trigger consistently routed to the intended skill. |
| Implicit selection with the same trigger shortened away at the rear | 1/3 | Two runs selected unrelated skills; this is directional evidence, not a stable failure rate. |

The v2 and v3 pilot traces are retained because they exposed two test-design defects: a prohibited skill read and a marker-to-filename naming leak. Protocol amendments were committed before each corrected rerun. The v4 output is the reportable behavioral result.

## Practical consequence

- Put the distinctive capability and strongest trigger in the opening clause of `description`.
- Keep the description concise; do not rely on tail qualifiers for disambiguation.
- When Codex shows the shortening warning, disable unused skills or plugins and use explicit invocation for important workflows.
- Do not claim an omission threshold from this run. It observed description compression, not omission, through 209 visible skills in the final capture of one version/model/environment.

The evidence clears the preregistered straightforward-results gate: update `/guides/codex` and `/skill-creator`; create no new URL.

Artifacts: [`catalog-summary.md`](../experiments/codex-skill-catalog-budget/results/catalog-summary.md), [`catalog-summary.json`](../experiments/codex-skill-catalog-budget/results/catalog-summary.json), [`selection-summary.json`](../experiments/codex-skill-catalog-budget/results/selection-v4/selection-summary.json), and the raw prompt/JSONL captures under the same experiment directory. Machine-specific paths in committed raw artifacts are normalized to `$HOME` and `$FIXTURE_ROOT`.

## Preregistered protocol

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
