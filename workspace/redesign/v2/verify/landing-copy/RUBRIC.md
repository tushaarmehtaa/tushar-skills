# landing-copy: workflow-quality rubric

Written 2026-10-09 before any workflow run. Derived from the skill's own
contract (SKILL.md "Find the defensible claim", "Output contract", "Verify",
and references/claim-first.md).

## Seeded task (identical for both arms)

Fixture `seed/`: `landing.md` (a generic draft for "Handover", a shift handover
log for small vet clinics) plus `notes/product.md`, `notes/customer-interviews.md`,
`notes/alternatives.md`. Arm "with": skill installed at
`.claude/skills/landing-copy` (SKILL.md + 2 references). Arm "without": not
installed. Install artifacts are git-excluded.

Prompt:

> Rewrite the landing page in landing.md using the product facts and customer
> interviews in notes/. Put the finished page and any notes in your reply;
> don't write files.

Ground truth: the draft's "AI-powered", "Trusted by 500+ clinics", "Reduce errors
by 90%", "Works with your existing practice management software", "HIPAA
compliant", "thousands of veterinary professionals" and the anonymous
"changed our lives" quote are all false or unsupported per the notes. Real
evidence: 6 pilot clinics, 5 now paying; mechanism = cannot close a shift with
a blank card + incoming lead signs off; only Dr. Amaka Obi may be quoted by
name; clinic B's callback anecdote is self-reported, one clinic; no PMS
integration; $49/month, 30-day trial, no card, /signup.

## Criteria (binary; score = earned weight / 15)

| id | weight | type | PASS requires |
|---|---|---|---|
| L1 | 1 | deterministic | Read `notes/product.md` and `notes/customer-interviews.md` (transcript). |
| L2 | 2 | llm | The new page copy contains none of the draft's false claims: AI-powered, 500+ clinics, 90%, PMS integration, HIPAA compliance, "thousands". (Mentioning them only in notes as removed is fine.) |
| L3 | 2 | llm | Invents no proof: no statistic, customer count, rating, outcome metric, or quote absent from the notes; any named quote is Dr. Amaka Obi's and verbatim; clinics B and C are not named; the callback anecdote, if used, is scoped as one clinic's self-report. |
| L4 | 2 | llm | The headline/proposition names the buyer or situation (vet clinics with inpatients / shift handover) and the mechanism (per-patient card, cannot close a shift blank, sign-off) so a generic tool (Trello, Google Doc, PMS notes) could not claim it unchanged. |
| L5 | 2 | llm | Provides a claim-to-evidence mapping (ledger, table, or annotated list) linking material claims to the notes or marking them as assumptions. |
| L6 | 1 | llm | Lists content requirements or missing proof separately from the copy (e.g. permission for more quotes, measured outcomes, ezyVet status). |
| L7 | 1 | llm | The page itself keeps the no-PMS-integration limitation visible (e.g. FAQ or qualifier: names typed by hand), not only in notes. |
| L8 | 1 | llm | Primary CTA states or sits next to the real commitment (30-day trial, no card) and does not promise anything the notes contradict. |
| L9 | 1 | llm | Section order/structure is justified by reader questions or the buying decision (explicit rationale), not just emitted. |
| L10 | 1 | llm | Uses specific customer language from the interviews accurately (e.g. 2am meds / sticky note / can't close your shift with a blank card / whiteboard). |
| L11 | 1 | deterministic | Report-only respected: no file in the fixture was created or modified. |

LLM criteria are judged by a separate headless `claude -p` grader with no tools,
given only this table's PASS text, the run's final message, and the list of
shell commands the run executed.
