# Contributing Agent Skills

slashskills is an Agent Skills-first repository. A contribution should be a useful workflow, a portable package, and an honest statement of where it has been tested.

## Repository contract

Each skill lives in a lowercase, hyphenated directory whose name matches the frontmatter `name`:

```text
your-skill-name/
├── SKILL.md
└── references/       # optional; provider variants, examples, or deeper guidance
    └── guide.md
```

`SKILL.md` is the entry point. Keep it at 500 lines or fewer and move optional detail or implementation variants into focused reference files. Link every bundled reference from `SKILL.md`, directly or through another reachable reference, so multi-file installs remain understandable and complete.

## Standard frontmatter

Use only fields defined by the open Agent Skills specification:

```yaml
---
name: your-skill-name
description: Describe the workflow outcome clearly. Use when the user or project needs a specific result.
license: MIT
---
```

The repository requires:

- `name`: a lowercase, hyphenated string matching the directory name, at most 64 characters.
- `description`: a string of at most 200 characters that says both what the skill does and when to use it. Include an explicit `Use when ...` clause so the requirement is deterministic.
- `license`: exactly `MIT`.

The standard optional fields are `compatibility`, `metadata`, and `allowed-tools`. Use `compatibility` only for real environment constraints; keep it at 500 characters or fewer. If present, `metadata` must map string keys to string values, and `allowed-tools` must be a string.

Do not put `category`, `tags`, or `author` in skill frontmatter. Those are site concerns and belong in the matching entry in [`site/lib/catalog.ts`](./site/lib/catalog.ts).

## Write a portable workflow

Good Agent Skills make the execution contract concrete without assuming one vendor's UI:

- Use imperative, ordered instructions and define the expected output.
- Inspect existing project state before changing files or installing dependencies.
- State required capabilities such as filesystem, shell, browser, network, or user files in the catalog.
- Use relative links for bundled resources and verify that each target exists.
- Refer to another workflow as “the `product-brief` skill,” not as a runtime-specific slash command.
- Put runtime-specific behavior behind detection or a clear `compatibility` constraint.
- Stop with a clear unsupported-path message when the documented workflow cannot safely handle a detected provider.
- Finish with proportional verification and distinguish work performed from work the user still needs to do.

Never imply that a chat upload can replace filesystem, shell, browser, or repository access. Only add the `claude-app` surface to a workflow that can produce its result using conversation and user-provided files.

## Catalog metadata

Add exactly one catalog entry with:

```ts
{
  category: "workflow",
  tags: ["example", "portable"],
  author: "your-github-username",
  surfaces: ["coding-agent"],
  capabilities: ["filesystem"],
  support: {
    "claude-code": "untested",
    codex: "untested",
    cursor: "untested",
  },
}
```

Use `tested` only after the runtime test below passes. Use `unsupported` only for a genuine compatibility boundary, not for a runtime that simply has not been tested.

## Validate locally

Install the validator and site dependencies once, then regenerate and check the repository:

```bash
npm install
npm --prefix site install
npm run catalog:sync
npm run check
npm --prefix site test --if-present
npm --prefix site run build
```

The README catalog is generated from `site/lib/catalog.ts` plus standard skill frontmatter. The ZIP builder includes every regular file in each skill directory. Commit the synchronized README; regenerate and verify the ignored ZIP build output locally and in CI.

## Runtime testing

Test a new or materially changed skill in every runtime you mark `tested`:

1. Install the package using the documented target and scope.
2. Confirm automatic discovery and explicit invocation.
3. Verify every required bundled file loads.
4. Confirm the workflow requests only capabilities available in that runtime.
5. Complete the expected workflow and its verification output.
6. Reload after an update, then confirm removal leaves no stale package behind.

For a `claude-app` surface, upload the generated ZIP and verify the chat workflow separately. That result does not establish coding-agent support.

For every local runtime marked `tested`, add one matching entry to [`runtime-verification.json`](./runtime-verification.json). Record the skill, runtime, date, environment, smoke-test summary, verifier or result reference, and `passed` outcome. The repository validator rejects a `tested` catalog claim without that record.

## Pull request checklist

- [ ] Standard frontmatter contains only valid fields and uses `license: MIT`.
- [ ] The description explains what and when in 200 characters or fewer.
- [ ] `SKILL.md` is no longer than 500 lines.
- [ ] Every relative link resolves and every bundled reference is reachable.
- [ ] Catalog capabilities, surfaces, and support statuses match observed behavior.
- [ ] README and ZIPs are regenerated.
- [ ] Repository validation, site tests, and the production build pass.
- [ ] The changelog explains a user-visible addition or compatibility change.

## V1 boundaries

V1 distribution targets local Agent Skills for Claude Code, Codex, and Cursor. Claude app upload is limited to chat-capable workflows. Copilot, Gemini, and OpenAI plugin packaging are intentionally outside v1; propose those as separate scoped changes rather than adding undocumented install paths.
