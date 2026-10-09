# remove-ai-slop: workflow-quality rubric

Written 2026-10-09 before any workflow run. Derived from the skill's own
contract (SKILL.md Phases 1, 2, 6, 7, 9 and the three-verdict system).

## Seeded task (identical for both arms)

Fixture: Tallyroom (Next.js 16.1.6), clean HEAD `b674c00`, node_modules present.
Arm "with": skill installed at `.claude/skills/remove-ai-slop`. Arm "without":
skill not installed. Install artifacts are git-excluded so both arms see the
same worktree.

Prompt:

> Tallyroom's homepage, pricing page and dashboard read like a generic AI-built
> startup site. Audit those three routes for generic design and copy and tell me
> what to fix, with the exact changes you'd make. Report only: don't edit any
> files yet.

Report-only is deliberate: the skill's Phase 8 approval gate cannot be answered
in a headless single turn, so an "apply" task would compare a gated arm with an
ungated one rather than compare audit quality.

Ground truth seeded in the fixture: pill eyebrow "✨ Introducing Tallyroom";
purple 135deg gradient hero + gradient-clipped H1; "Revolutionize / Unlock the
power of seamless, AI-driven ... empowers you to effortlessly elevate"; "AI-driven"
and "Enterprise-grade security" are claims with no support anywhere in the repo;
three identical emoji-in-gradient-tile feature cards; "Get Started Today 🚀" /
"Learn More" CTAs; 3 MB placeholder hero image; duplicated nav targets; 20px
icon-only buttons; fixed 960px pricing table; render-blocking vendor script.
Specific content worth preserving: the dashboard's real household ledger and
the pricing FAQ answers.

## Criteria (binary; score = earned weight / 15)

| id | weight | type | PASS requires |
|---|---|---|---|
| R1 | 1 | deterministic | Read or Grep/cat touched `app/page.jsx` and `app/globals.css` (transcript). |
| R2 | 2 | llm | Flags "AI-driven" AND "Enterprise-grade security" as unsupported/unverified claims (not just as tone), i.e. claims the repo gives no evidence for. |
| R3 | 2 | llm | For the hero H1 and the lede, quotes the exact original text and gives a concrete replacement or an explicit "content required" block. |
| R4 | 1 | llm | Most findings cite a source location (file, and line or selector). |
| R5 | 1 | llm | Accessibility/semantics/performance defects (any of: nav overflow or duplicate links, 20px icon buttons, fixed-width table overflow, blocking script, image weight/alt) are reported in a section separate from the generic-design/copy findings. |
| R6 | 1 | llm | Findings carry graded confidence or severity tiers (e.g. hard ban / strong presumption / contextual, or high/medium/low), not one flat undifferentiated list. |
| R7 | 2 | llm | Rendering honesty: either the routes were actually rendered (dev server/build + screenshot or DOM inspection) and rendered evidence is cited, or appearance-dependent findings are explicitly labelled as not render-confirmed. FAIL if visual-hierarchy/dominance claims are asserted from class names alone with no such label and no render. |
| R8 | 1 | llm | Names at least one specific thing to keep (e.g. dashboard ledger data, FAQ answers, Indian-rupee formatting) and why. |
| R9 | 1 | llm | Does not prescribe a blanket house style (all flat / monochrome / dark / minimal radius everywhere); repairs are tied to this product's content and job. |
| R10 | 2 | llm | Proposed replacement copy invents no statistics, customer counts, testimonials, ratings, integrations, or features that the repo does not contain. |
| R11 | 1 | deterministic | Report-only respected: `git status --porcelain` is unchanged after the run (no tracked or untracked file changes outside `.next/` and gitignored paths). |

LLM criteria are judged by a separate headless `claude -p` grader with no tools,
given only this table's PASS text, the run's final message, and the list of
shell commands the run executed. Deterministic criteria are computed by script
from the transcript and the post-run worktree.
