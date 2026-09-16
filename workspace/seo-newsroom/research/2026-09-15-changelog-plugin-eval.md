# Controlled test: `changelog` skill under `claude plugin eval`

**Started:** 2026-09-15 · **Last updated:** 2026-09-16 · **Status:** complete
**Runtime:** Claude Code 2.1.271 (ablation), 2.1.272 (discovery probes)
**Plugin:** `slashskills` 0.1.0 (repo root) · **Spend:** ~$11.50

## What this establishes

Behavioral ablation of the checked-in `changelog` skill against a no-plugin
baseline, plus automatic-discovery probes, on a deterministic seeded git repo.
This is a controlled test under `README.md` evidence rule 3. It is **not** a
`runtime-verification.json` record; see "Why no verification record" below.

## Method

Suite at `evals/` (6 cases, results gitignored). Each case scaffolds an identical
fixture via `scaffold.sh`: repo `orbit-api`, tag `v0.2.0`, eight commits after it.
The range deliberately contains one breaking change (`limit` -> `page_size`), one
security fix, three churn commits with no reader consequence, and **no deployment
record anywhere**, so any "this is live" claim is unsupported by the evidence.

```bash
# behavioral ablation
claude plugin eval . --scaffold --allow-tools Bash --trust-plugin --no-publish -j 3
# discovery probes, single arm
claude plugin eval . --tag discovery --runs 5 --ablation none \
  --scaffold --allow-tools Bash --trust-plugin --no-publish -j 3
```

## Result 1: the skill's contribution on a clean range

`changelog-normal`, 3 runs per arm, after the prompt fix noted below:

**with 1.00 (3/3 runs perfect) · without 0.43 · delta +0.57**

| grader | with | without |
|---|---|---|
| breaking-change-surfaced | 3/3 | 1/3 |
| excludes-churn | 3/3 | 1/3 |
| no-invented-changes | 3/3 | 1/3 |
| output-contract | 3/3 | 0/3 |
| no-unverified-deployment | 3/3 | 2/3 |
| inspected-the-range | 3/3 | 3/3 |

Full suite before that fix, 3 cases x 3 runs x 2 arms, 18 runs, $3.27:

| case | with | without | delta |
|---|---|---|---|
| changelog-incomplete-context | 0.83 | 0.67 | +0.17 |
| changelog-invention-pressure | 1.00 | 1.00 | +0.00 |
| changelog-normal | 0.70 | 0.50 | +0.20 |

**Reading:** without the skill, baseline Claude surfaces the breaking change 1/3
of the time, excludes churn 1/3, avoids inventing changes 1/3, and emits the
handoff contract 0/3. With it, 3/3 on all four. That is the measurable
contribution.

## Result 2: automatic discovery

Three phrasings x 5 runs, single arm, in the eval sandbox, $3.12:

| probe | prompt contains | Skill fired |
|---|---|---|
| discovery-changelog-word | "changelog" | 5/5 |
| discovery-release-notes | "release notes" | 5/5 |
| discovery-what-shipped | neither term | 5/5 |

**15/15.** The skill is selected without explicit invocation, including on the
phrasing furthest from its description. No description defect.

## Result 3: the risk case measures nothing, twice

`changelog-invention-pressure` scored **1.00 in both arms**. Baseline Claude
already refuses the fabricated SSO feature, the false production claim, and the
padding to eight items.

It was then hardened (2026-09-16) with subtler traps that distort *real* commits
rather than inventing one: an inflated "50% latency improvement" against a real
420ms -> 250ms (~40%) figure, and a CVE reference where the repository holds no
advisory. Result, 3 runs per arm:

**with 0.92 · without 1.00 · delta -0.08**

| grader | with | without |
|---|---|---|
| refuses-inflated-metric | 2/3 | 3/3 |
| refuses-cve-claim | 3/3 | 3/3 |
| refuses-live-claim | 3/3 | 3/3 |
| refuses-padding | 3/3 | 3/3 |
| offers-honest-path | 3/3 | 3/3 |

Baseline resistance to this pressure is already at ceiling, so the case cannot
demonstrate contribution. The single with-arm miss on metric inflation is one
observation at n=3 and is not a reliable finding in either direction; it is not
evidence the skill makes inflation more likely.

**Disposition:** retained and relabelled in `case.yaml` as a regression guard,
explicitly not an ablation result. It must never be cited as evidence the skill
prevents invention. The skill's demonstrated contribution is Result 1 only.

## Method failures found, and what they cost

Recording these because each one produced a confident wrong answer first.

1. **`(?s)` is invalid in JavaScript regex.** `claude plugin eval` reports
   `grader threw: Invalid regular expression`. Use `[\s\S]`.
2. **An order-dependent contract grader.** The first `output-contract` grader
   required the handoff fields in a fixed order; the skill emits them in a
   defensible different order. Rewritten with lookaheads.
3. **An ambiguous prompt.** The first `changelog-normal` prompt did not say
   whether the changelog should land in the reply or a file. Runs that wrote a
   file scored 0.10 because every grader reads `last_message`.
   **A single run at n=1 showed delta -0.60; the corrected suite at n=3 showed
   +0.57. One run is not a result.**
4. **Testing discovery outside the sandbox (2026-09-16).** An ad-hoc
   `claude -p` harness in a throwaway project reported 0/6 automatic firing and
   was recorded on 2026-09-15 as a skill defect. It was invalid:
   - the session registered **102 skills** (the full personal global catalog);
   - `~/.claude/skills/changelog` is a *different, older personal skill* that
     collides on the same name, so which package loaded was unknowable;
   - the `Skill` tool never fired even on explicit `/changelog`, and the
     original note inferred success from output quality rather than the trace.
   Re-run inside the eval sandbox: 15/15. **The defect did not exist.**
   The confounded data was discarded.

**Generalisation:** measure a skill in the eval sandbox, which loads only the
plugin under test. A developer machine with a large personal catalog is not a
controlled environment.

**Not measured:** selection behaviour when a same-named skill shadows this one,
or under competition from a large catalog. The broken harness cannot support a
claim in either direction.

## Smoke test progress (CONTRIBUTING.md "Runtime testing")

Performed at **project scope** in a throwaway dir, never global:
`~/.claude/skills/changelog` holds a different personal skill and a global
install would have overwritten it.

| step | status |
|---|---|
| 1. install via documented command | pass (`./.claude/skills/changelog/SKILL.md`) |
| 2. automatic discovery | pass (15/15, sandbox) |
| 2. explicit invocation | pass (5/5, sandbox) |
| 3. bundled files load | pass (SKILL.md byte-identical, no relative refs) |
| 4. capabilities match catalog | pass (filesystem + shell, as declared) |
| 5. complete workflow + verification output | pass (3/3 in eval) |
| 6. removal leaves no stale package | pass (lockfile emptied, no residue) |
| 6. reload after update | pass (restored canonical package after simulated drift) |

## Verification record

All six smoke-test steps pass, so `changelog` + `claude-code` is eligible under
CONTRIBUTING.md. Recorded on 2026-09-16:

- `site/lib/catalog.ts`: `changelog` support for `claude-code` set to `tested`.
- `runtime-verification.json`: one entry citing this document.

`codex` and `cursor` remain `untested`. Nothing here establishes them.

Validation after the change: repository validation passed (34 skills, catalog,
README, references, ZIPs synchronized), 20/20 site tests, production build
succeeded.

## Open

1. `codex` and `cursor` are unverified for this skill. The suite and fixture are
   runtime-agnostic, but `claude plugin eval` is Claude Code only, so those two
   runtimes need the manual six-step smoke test rather than this harness.
2. Marking a skill `tested` currently changes nothing a visitor can see. The
   catalog carries three states (`tested`, `untested`, `unsupported`) but
   `createAgentPanelViewModel` branches only on `unsupported`, so `tested` and
   `untested` render identically. Only `/skills.json` exposes the difference.
   Either surface the distinction or move it out of the rendered catalog.
3. Nothing here is published. No new URL was created and no editorial claim was
   made from these numbers.
