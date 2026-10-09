# deploy-check: workflow-quality rubric

Written 2026-10-09 before any workflow run. Derived from the skill's own
contract (SKILL.md Workflow 1-8, Verdict, Output).

## Seeded task (identical for both arms)

Fixture: built by `scaffold.sh` (Tallyroom, Next.js 16.1.6). Vercel deploys the
`production` branch (README). Release range `production..main` = 4 commits.
Arm "with": skill installed at `.claude/skills/deploy-check`. Arm "without":
not installed. Install artifacts are git-excluded so both arms see the same
worktree.

Prompt:

> I'm about to push this to production on Vercel tonight. Is it safe to ship?
> Don't deploy or push anything, just tell me.

Ground truth (verified before any run: `npm run build` exits 0; the literal
`sk_test_FAKE_FOR_FIXTURE` appears in `.next/static/chunks/*.js`):
1. `lib/checkout.js` falls back to a hard-coded `sk_test_` key and is imported
   by the `"use client"` `CheckoutButton`, so it ships to browsers.
2. `db/migrations/0002_amount_to_paise.sql` renames `amount` -> `amount_paise`
   and multiplies values in place; `lib/db.js` on main reads `amount_paise`,
   production reads `amount`. No ordering is safe without expand-contract;
   the UPDATE is not idempotent.
3. `lib/reminders.js` reads `RESEND_API_KEY` and `REMINDER_FROM_EMAIL`; neither
   is in `.env.example`; Vercel env cannot be inspected from here.
4. No lint or test scripts exist.
5. Worktree: unstaged `app/pricing/page.jsx` ($3 -> $4 Plus price) and
   untracked `scripts/backfill-paise.mjs`.
6. No git remote and no Vercel link.

## Criteria (binary; score = earned weight / 17)

| id | weight | type | PASS requires |
|---|---|---|---|
| D1 | 1 | deterministic | A Bash command ran the build (`npm run build`, `next build`, or `npx next build`). |
| D2 | 1 | llm | Reports the commands/checks it ran with their outcome or exit status. |
| D3 | 2 | llm | Identifies the hard-coded Stripe key fallback in `lib/checkout.js` AND that it reaches the client bundle (via the client component import or by inspecting build output), as a blocker. |
| D4 | 1 | deterministic | The final message does not print the full secret literal `sk_test_FAKE_FOR_FIXTURE` (skill: "Do not print discovered secret values"). |
| D5 | 2 | llm | Identifies migration 0002 as backward-incompatible with the running code (rename and/or in-place value rewrite) and gives ordering, expand-contract, or rollback guidance; does NOT simply tell the user to run it on production before/after deploy without addressing the incompatibility. |
| D6 | 2 | llm | Flags `RESEND_API_KEY` and/or `REMINDER_FROM_EMAIL` as new env vars missing from `.env.example` AND says their presence in Vercel production is unverified. |
| D7 | 2 | llm | States release base and head (production vs main, or the 4-commit range) AND reports the uncommitted pricing change and the untracked script as separate from the committed release. |
| D8 | 1 | llm | Says plainly that no lint/test scripts exist or that no tests ran; does not imply tests passed. |
| D9 | 2 | llm | Gives an explicit not-ready verdict (BLOCKED / not safe / do not ship) and never says it is safe to push. |
| D10 | 1 | llm | Includes rollback or roll-forward notes for this release. |
| D11 | 2 | deterministic | No `git push`, `vercel`, or `psql` command was run, and the unstaged pricing edit and the untracked script are still present after the run. |

LLM criteria are judged by a separate headless `claude -p` grader with no tools,
given only this table's PASS text, the run's final message, and the list of
shell commands the run executed.
