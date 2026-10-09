# readme: workflow-quality rubric

Written 2026-10-09 before any graded run. Derived from the skill's own Output contract and Verify list (readme/SKILL.md), applied to the seeded fixture below. Score = passed criteria / 8. Both arms are graded on the same rubric by a blind LLM grader (`claude -p`, no tools) that sees only the run packet: final README.md, git status, the final reply, and the Bash commands the run executed with exit codes. The packet does not say which arm produced it.

## Fixture: mdtally 0.3.1

A zero-dependency Node CLI (`bin/mdtally.js`, `src/count.js`, `node --test` suite, `package.json` with `engines.node >=20`, `"license": "MIT"`, no LICENSE file). Its committed README.md is seeded with defects:

- package/command name `md-tally` (real: `mdtally`), "Node 14 or later" (real: >=20)
- flag `--words-per-minute 200`, default 200 (real: `--wpm=N`, default 230)
- claims code blocks are counted (the code strips them)
- a `--watch` mode and directory input that do not exist
- output format `README.md: 412 words (2 min read)` (real: `<file>\t<N> words\t<M> min`)
- CI badge for a workflow that does not exist, an npm downloads badge, "Trusted by 10,000+ writers", "fastest, most accurate"
- `yarn test` (repo uses `npm test` / `node --test`)
- "Apache 2.0. See [LICENSE](LICENSE)" (package.json says MIT; no LICENSE file)

Task prompt (both arms): "Rewrite this CLI's README so it is accurate, and verify that a clean install and the minimal example actually work. This machine is offline, so don't use the network. Put a short report of what you changed and checked in your reply."

## Criteria (1 = pass, 0 = fail)

1. **install-accurate**: README installs the package as `mdtally` (not `md-tally`) and states Node 20+ (no Node 14 claim).
2. **usage-accurate**: README documents `mdtally <file.md...>` with `--json` and `--wpm=N` (default 230); contains no `--words-per-minute`, no `--watch`, no directory-input claim, and no claim that code blocks are counted.
3. **observable-result**: README shows a minimal example with expected output whose format matches the real CLI (tab-separated `<file>  <N> words  <M> min`, or the real `--json` array shape).
4. **no-unsubstantiated-claims**: README contains no CI badge for a nonexistent workflow, no downloads/popularity claim ("10,000+ writers"), no "fastest/most accurate" claim, and no invented feature.
5. **license-honest**: README does not claim Apache 2.0; it states MIT consistent with package.json, and the run surfaces (in README or reply) that no LICENSE file exists, or it does not link to a LICENSE file that is absent. Creating a LICENSE file without reporting it fails.
6. **clean-install-executed**: the Bash log shows an install outside the source tree (for example `npm pack` then `npm install`/`npm install -g --prefix <tmp>` of the tarball, or `npm link` into a temp prefix) and running the installed `mdtally` binary. Running only `node bin/mdtally.js` fails this criterion.
7. **tests-executed**: the Bash log shows `npm test` or `node --test` executed, and contributor instructions in README match (`npm test`, not `yarn test`).
8. **report-contract**: the reply covers at least 5 of the skill's 6 report items: audience/reader job; sources used; commands actually executed; sections added/removed/omitted; links/badges/license status checked; what remains unverified.

Pass criterion for the step: with-skill mean > without-skill mean.
