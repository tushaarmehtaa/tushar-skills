# Open-source submissions — 2026-09-10

User authorized submitting to the researched directories. First batch: three focused PRs, affiliation and AI assistance disclosed. No claims of community adoption or end-to-end runtime verification.

| Target | PR | Submission | Signed commit |
|---|---|---|---|
| junminhong/awesome-agent-skills | https://github.com/junminhong/awesome-agent-skills/pull/46 | Slashskills collection | `f8de222543f7c8a2d8408215c97017de29b55d8b` |
| philipbankier/awesome-agent-skills | https://github.com/philipbankier/awesome-agent-skills/pull/86 | Slashskills collection | `2d3f9a8db9ae343752ead51b77063d733df8a7f3` |
| Ezeafk/awesome-agent-skills | https://github.com/Ezeafk/awesome-agent-skills/pull/38 | deploy-check skill | `b14de2380b8d51b7fed63dc9c1f56c61bebc68fd` |

All commits were created through GitHub and their signature.isValid field verified before opening the PR. Each diff was checked to contain only the intended README additions. No duplicate listings, issues, or open PRs were found in the first three targets.

## Follow-up

- Review maintainer feedback and checks before further submissions to these directories.
- VoltAgent: needs evidence of real community usage.
- karanb192 and ComposioHQ: require actual Claude skill testing; website tests are not a substitute.
- travisvn: excludes AI-assisted submissions; not included in this run.
- GetBindu and sandipan1: remaining candidates, not submitted in this batch.

## Submission bodies

### jun

## Summary
Add Slashskills to Skill Collections, with matching English and Traditional Chinese entries. The collection provides directly installable SKILL.md workflows and bundled references for software work.

## Contribution type
- [x] New listing

## Project details
- Canonical source: https://github.com/tushaarmehtaa/tushar-skills
- README section/category: Skill Collections
- Type: Collection
- Platforms: Codex, Claude Code, Cursor
- License: MIT
- Affiliation: I maintain the upstream repository. Prepared with AI assistance.
- Related taxonomy issue: N/A

## Checklist
- [x] Public source, skill implementations, documentation, and license.
- [x] Canonical collection link; documented platform installation paths.
- [x] Neutral description without volatile counts or promotional claims.
- [x] Searched existing listings, issues, and open pull requests for duplicates.
- [x] One collection; only README.md and README_ZH.md changed.
- [x] Matching names, URLs, types, and platforms; translated description.
- [x] Alphabetical placement; no copied skill implementations.
- [x] Affiliation disclosed; existing category used.
- [x] Focused Markdown change.
- [x] Commit signature verified through GitHub before submission.

Validation: upstream repository/package checks and website tests pass. Runtime setup is documented; this is not a claim that every workflow has been evaluated end-to-end in every host.

### philip

Add the Slashskills repository to Agent Skills → Collections. It contains installable software-development workflows, with per-runtime installation documentation and explicit tool requirements.

- One README entry; description is under 120 characters.
- Canonical repository link and requested stars badge.
- Repository has 11 stars at submission preparation and recent maintenance.
- No existing listing or open duplicate PR found.

Affiliation: I maintain Slashskills (tushaarmehtaa/tushar-skills). This submission was prepared with AI assistance.

The upstream repository is MIT-licensed and documents installation and required tools. Runtime instructions are documented; repository validation and website tests are not presented as proof of end-to-end skill performance.

### eze

Add deploy-check under DevOps and Cloud. It guides an agent through release scope, existing CI checks, secrets/configuration review, migration risks, observability, and rollback, then returns an evidence-backed readiness verdict.

Self-assessment under the contribution rubric: 8/10 (maintainer review welcome).
- Task clarity: 2/2 — release scope is the input; readiness verdict and findings are the output.
- Reusable structure: 1/2 — structured multi-step SKILL.md workflow and output contract; no bundled executor.
- Platform/tool fit: 2/2 — installation documented for Codex, Claude Code, and Cursor; local repository and shell required.
- Validation/examples: 1/2 — repository checks and evaluation prompts exist; no recorded end-to-end runtime evaluation is claimed.
- Maintenance/safety: 2/2 — MIT license, recent maintenance, worktree preservation and secret-redaction instructions; pushing/deploying requires separate authorization.

Risk is High because release checks can involve production configuration and migration planning. The skill explicitly separates assessment from authorization to deploy; running project commands still requires review of the target repository.

- [x] Canonical skill directory; existing DevOps category.
- [x] Platform, use case, includes, status and risk completed.
- [x] Score and limitations disclosed.
- [x] No duplicate found; linked source exists.

Affiliation: I maintain Slashskills (tushaarmehtaa/tushar-skills). This submission was prepared with AI assistance.

The upstream repository is MIT-licensed and documents installation and required tools. Runtime instructions are documented; repository validation and website tests are not presented as proof of end-to-end skill performance.

## Second batch — user requested all remaining targets

- GetBindu/awesome-claude-code-and-skills: https://github.com/GetBindu/awesome-claude-code-and-skills/pull/202 — signed commit `e9bdfb212f4e523a9986dd26e48d7df2b21c95f5`; open at submission.
- sandipan1/awesome-claude-skills: https://github.com/sandipan1/awesome-claude-skills/pull/24 — signed commit `625598b3562ba7ad9dc1bee67c432f94ac7c14c5`; open at submission.

Remaining targets:
- karanb192: pending actual Claude test. Claude Code auth status is loggedIn=false; login requested from user. Draft entry and fixture saved under pending/.
- ComposioHQ: pending actual Claude test and tested example; draft entry and upstream source copy saved under pending/.
- VoltAgent: not submitted because real community usage is required and has not been evidenced. Eleven stars alone do not establish skill usage.
- travisvn: not submitted because current contribution rules explicitly prohibit AI-assisted generation/submission.

No end-to-end Claude test was run or claimed. No additional PRs were opened in already-submitted targets.

## Third batch — Claude login resolved

Live authentication succeeded. Tested decision-doc through Claude Code 2.1.260 with the unmodified skill supplied as system context; response model claude-sonnet-5. Tools disabled. This was an instruction-execution test, not an installation/discovery test. Core artifact was functional, with explicit compliance limitations recorded in claude-test/assessment.md and both PR descriptions.

- karanb192/awesome-claude-skills: https://github.com/karanb192/awesome-claude-skills/pull/291 — signed commit `36d15c38a51f4d56cc76256d3c407b48dbca68d9`. Open at submission.
- ComposioHQ/awesome-claude-skills: https://github.com/ComposioHQ/awesome-claude-skills/pull/1871 — signed commit `d5c4c7f79f30757079ec78b17de2da7cc046697f`. Open at submission.

This supersedes the earlier Karan/Composio login blockers. Seven submissions now opened in total. VoltAgent remains unsubmitted for lack of proven community usage; travisvn remains unsubmitted because AI-assisted submissions are prohibited.

Composio follow-up: automated validator requires README-only changes, contradicting contribution guide folder instructions. Updated PR #1871 to one canonical source link; moved full observed output into the PR description. No skill files remain in final PR diff.
