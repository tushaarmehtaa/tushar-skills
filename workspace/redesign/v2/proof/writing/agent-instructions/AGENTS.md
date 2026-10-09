# mdtally

Node CLI that counts words and estimates reading time for Markdown files.
ES modules (`"type": "module"`), Node >= 20, no runtime or dev dependencies — there is nothing to install.

## Layout

- `src/count.js` — all counting logic: `stripMarkdown`, `countWords`, `readingMinutes`. Put behavior changes here.
- `bin/mdtally.js` — thin CLI wrapper: argument parsing (`--json`, `--wpm=N`, file paths) and output formatting only.
- `test/count.test.js` — `node:test` + `node:assert/strict` tests against `src/count.js`. `test/sample.md` is a fixture for manual CLI runs.

## Commands

```bash
npm test                                   # node --test; runs test/*.test.js
npm run lint                               # node --check on bin/mdtally.js and src/count.js (syntax only)
node bin/mdtally.js test/sample.md --json  # smoke-test the CLI
```

Before finishing a change, run `npm test` and `npm run lint`; both must pass.

## Conventions

- Keep zero dependencies. Use Node built-ins (`node:fs`, `node:test`, `node:assert/strict`) rather than adding packages.
- Use double quotes, semicolons, and named exports, matching existing files.
- Add a test in `test/count.test.js` for any change to counting or reading-time behavior.
- The default reading speed is 230 wpm, and it is set in two places: `readingMinutes` in `src/count.js` and the CLI fallback in `bin/mdtally.js`. Change both together.
- Reading time rounds up to whole minutes, with a minimum of 1. Tests assert this.
- `npm run lint` lists files explicitly. If you add a source file, add it to the `lint` script in `package.json`.

## Do not edit

- `.claude/skills/` and `skills-lock.json` are installed by `npx skills`. Update them through that tool, not by hand.
