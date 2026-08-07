# Skill quality contract

A slashskill should change how an agent works, not merely remind it what a competent agent already knows.

## Entry point

`SKILL.md` owns the complete execution contract:

- State a specific outcome and the situations that should trigger the skill.
- Inspect supplied context and repository evidence before asking questions.
- Ask only about unresolved choices that materially change the work.
- Route explicitly between different jobs such as audit, implementation, repair, or strategy.
- Say when to read each reference and what decision that reference supports.
- Define the deliverable, verification, and honest stopping conditions.

Do not use a short entry point to hide a second standalone skill in `references/`. A reference supplies conditional domain knowledge; it must not restart the interview, redefine the mode, or replace the output contract.

## Interaction

Interactivity means making consequential decisions with the user. It does not mean presenting a fixed questionnaire.

- Infer answers already present in code, files, URLs, screenshots, or conversation.
- Batch small blocking questions when practical.
- Continue with labeled assumptions when the work is reversible and the missing detail is low risk.
- Stop for confirmation before destructive, expensive, public, security-sensitive, or commercially consequential changes.
- Scale the workflow to the task instead of forcing every request through an exhaustive process.

## Domain quality

- Encode non-obvious specialist judgment, failure modes, and decision branches.
- Treat numbers and named best practices as evidence, not decoration.
- Date and cite time-sensitive claims from primary sources, or require live verification at execution time.
- Separate standards and provider guarantees from heuristics, experiments, and opinion.
- Preserve the user's stack and product language unless the task requires changing them.
- Do not impose one visual style, writing voice, architecture, or business model on unrelated work.

## Execution and verification

- Read before writing and extend existing systems before replacing them.
- Keep security boundaries on the server and protect secrets, personal data, money, and irreversible actions.
- Verify the real outcome: execute commands, render interfaces, exercise states, reconcile totals, re-fetch deployments, or inspect produced artifacts as the domain requires.
- Report what was observed, changed, verified, assumed, and left for the user.
- Never claim success from the presence of prescribed ingredients alone.

## Evaluation

Every catalog skill has behavioral cases in [`skill-evals.json`](./skill-evals.json):

- a normal task that should trigger the workflow;
- an ambiguous or incomplete task that tests adaptation;
- a failure, risk, or near-miss case that tests restraint.

The registry also defines observable rubrics for routing, adaptation, evidence, safety, output, and verification. Prompt presence alone is not a passing evaluation.

Material rewrites must run representative cases without leaking the intended answer into the agent's prompt. A package stays `untested` in the runtime catalog until a real smoke test is recorded.
