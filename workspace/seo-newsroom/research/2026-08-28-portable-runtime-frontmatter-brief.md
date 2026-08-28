# Portable core versus runtime extensions — research brief

## Decision saved on 2026-08-28

Research this question, but do not begin with a new article. The default deliverable is an evidence-backed matrix and updates to `/skill-creator` and `/compatibility`.

Reader question: **How can one Agent Skill remain portable across Codex, Claude Code, and Cursor while still using valuable runtime-specific features safely?**

## Controlled fixtures

Build four harmless packages with the same basic task:

1. Portable Agent Skills frontmatter only.
2. Portable fields plus documented Claude Code extensions.
3. Portable fields plus documented Cursor extensions.
4. Portable `SKILL.md` plus OpenAI metadata in `agents/openai.yaml`.

Do not use destructive tools, credentials, network mutations, or ambiguous success criteria.

## Test matrix

Run every fixture through:

- the Slashskills validator;
- Codex discovery, automatic matching, and explicit invocation;
- Claude Code discovery, automatic matching, and explicit invocation;
- Cursor discovery, automatic matching, and explicit invocation.

Record runtime and installer versions, package path, accepted/rejected/ignored fields, warnings, discovery, invocation behavior, permission behavior, and reload/removal outcome. Preserve raw outputs. Do not convert documentation claims into observed behavior.

## Questions to answer

- Which fields are portable and validated everywhere?
- Do unsupported runtime fields fail, warn, or get silently ignored?
- Can adapter files preserve one portable `SKILL.md`?
- Which features require separate runtime variants?
- Can Slashskills state a safe packaging policy without overstating compatibility?

## Expected policy to test

- Keep `SKILL.md` within the open portable core.
- Put OpenAI-specific presentation and dependency metadata in `agents/openai.yaml`.
- Treat Claude Code and Cursor extensions as optional variants until cross-runtime behavior is observed.
- Never describe unsupported fields as safely ignored without test evidence.

## Publication gate

- **Straightforward results:** update `/skill-creator` and `/compatibility`; create no URL.
- **Surprising incompatibility or reusable adapter pattern:** reassess whether a distinct guide has a separate reader job.
- **Only repeats vendor documentation:** save the evidence and stop.

## Exact restart point

Start by creating the four fixtures under `workspace/seo-newsroom/experiments/portable-runtime-frontmatter/`, write a deterministic test manifest before running any runtime, and keep this queue item in `researching` until observed outputs exist.
