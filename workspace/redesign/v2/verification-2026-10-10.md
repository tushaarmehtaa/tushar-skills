# Claude Code verification, 9–10 October 2026

Method: the one used for `changelog` on 16 September (see `runtime-verification.json` and `workspace/seo-newsroom/research/2026-09-15-changelog-plugin-eval.md`), run by two agents on fixture projects with Claude Code 2.1.295 and `npx skills` 1.7.2. Each skill: documented project-scope install with SKILL.md byte-identical to the repository, 15 automatic-discovery runs across three phrasings (one avoiding the skill's keywords), 5 explicit `/slug` runs, 3 workflow runs with the skill against 3 without it on the same seeded task (graded against a rubric written before any run), then update and removal. Runs aborted by the account's session usage limit were set aside and rerun, never counted. Per-skill rubrics, counts and scores are in `verify/<slug>/`.

## Results

| Skill | Discovery | Explicit | With vs without | Contract issues | Recorded as |
|---|---|---|---|---|---|
| remove-ai-slop | 15/15 | 5/5 | 0.89 vs 0.65 | none | **Verified** |
| rate-limit | 15/15 | 5/5 | 1.00 vs 0.875 | none; fake Upstash host, live service never contacted | **Verified** |
| deploy-check | 15/15 | 5/5 | 1.00 vs 0.63 | none after the 10 Oct fix (see below); first pass printed the fixture's fake key in 2 of 3 runs | **Verified** |
| landing-copy | 15/15 | 5/5 | 0.82 vs 0.73 | no claim-by-claim evidence table in any run (0/3), which its contract asks for | Ran in Claude Code |
| readme | 15/15 | 5/5 | 1.00 vs 1.00 | none, but the fixture was easy enough that Claude without the skill also scored full marks, so no lift was shown | Ran in Claude Code |

## The update step

`npx skills update` (1.7.2) reported "up to date" and left a deliberately edited local SKILL.md unchanged for every skill tested. It restored the file only when the lockfile hash was also stale, and re-running `npx skills add` always restored it. This is behaviour of the install CLI, not of any skill, so it is not counted against a skill. The install guides should tell people to re-run `npx skills add` to restore a modified skill.

## Limits

Three workflow runs per arm, one grader pass each. The grader could often tell which arm an output came from by its format. Some runs wrote logs to system temp folders, and one installed Playwright into a temp folder; those files were removed afterwards.

## Follow-ups

- ~~deploy-check: tighten the rule against printing secret values, then re-verify.~~ Done, see below.
- landing-copy: make the evidence table harder to skip, then re-verify.
- readme: re-verify on a fixture with problems a model without the skill does not fix unaided.

## deploy-check re-verification, 10 October

The first pass printed the fixture's fake Stripe key in 2 of 3 workflow runs: the model judged the value harmless because it looked like a placeholder. Commit ee0eb07 changed SKILL.md step 4 to forbid printing any secret value, including fake, test-mode, placeholder or already exposed ones, and to show at most the key prefix. The Output section now requires a rollback section.

The full method was rerun on the same fixture and the rubric written on 9 October, with Claude Code 2.1.296: documented install byte-identical to the repository, discovery 15/15, explicit 5/5, workflow 1.00 with the skill against 0.63 without (n=3 per arm, both arms rerun). Every criterion passed in all three skill runs. The key appeared in none of the 8 complete skill-arm reports, in full or in part; without the skill it was printed in 2 of 3. Every skill-arm report had a rollback section. Install and removal were clean; the update step behaved as described above. The first pass is archived beside the new runs in `verify/deploy-check/archive-2026-10-09/`.
