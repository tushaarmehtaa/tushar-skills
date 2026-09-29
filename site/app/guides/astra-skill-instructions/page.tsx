import { EditorialGuide, guideMetadata } from "@/components/editorial-guide";
import { EDITORIAL_GUIDES } from "@/lib/guides";

const guide = EDITORIAL_GUIDES[1];
export const metadata = guideMetadata(guide);
const content = `## Audit the instructions before rewriting the skill

When a model changes, an existing skill can expose ambiguities that previously went unnoticed. Start with one real stopping point: what did the user authorize, which instruction was loaded, and why did the agent stop?

OpenAI's [GPT-6 Astra guidance](https://developers.openai.com/api/docs/guides/latest-model), checked September 9, 2026, describes sensitivity to unclear or conflicting skill instructions and recommends making instruction priority explicit. It also discusses clarification and mid-turn steering. This is provider guidance. The examples here are proposed instruction edits, not claims of improved performance. Our September 30 changelog comparison below tests an unchanged skill on two models; it does not test these revisions.

## Separate a preference from a requirement

Consider a page-building skill with this instruction:

\`\`\`text
Before implementation, confirm the framework, color palette,
and page sections with the user.
\`\`\`

A user working in an existing app may have already supplied all three. The instruction still demands confirmation because it does not distinguish missing information from information already available.

A more precise version for that workflow is:

\`\`\`text
Inspect the existing app and the user's brief for the framework,
palette, and page sections. Reuse choices already provided.
Ask only when an unresolved choice would materially change
what you build. Continue independent work while it is unresolved.
\`\`\`

This is an illustrative revision, not a universal replacement. A skill handling a purchase or public deployment may have a consequential decision that really does require an answer. Keep those boundaries explicit.

## Name the decision that blocks progress

“Ask before making changes” gives the agent little information about which changes matter. For a workflow that prepares a public page, a better contract could distinguish local drafting from publication:

\`\`\`text
Prepare and verify the local page within the requested scope.
Before publishing, check whether publication is already authorized.
If it is not, present the completed page and request that decision.
Do not treat a missing style preference as publication approval.
\`\`\`

Apply instruction priority within the runtime's actual rules. Skill guidance must not be used to bypass system instructions, developer instructions, permission controls, or the scope of the user's request. Removing every pause is not the objective; completing authorized work while preserving consequential boundaries is.

Use [agent-instructions](/agent-instructions) when the conflict spans repository guidance. Use [skill-creator](/skill-creator) when the ambiguous instruction lives in the skill itself.

## Give steering a place in the workflow

An ongoing task may receive a correction such as “use the existing brand colors.” Treat that as a change to the current brief when it is compatible with the task. A skill can make this behavior concrete:

\`\`\`text
Incorporate corrections into the active task. Preserve completed
work that still satisfies the updated brief. Revisit dependent
steps when the correction changes their inputs.
\`\`\`

Do not prescribe an asynchronous question tool unless the runtime provides it. If a required answer is pending, dependent work remains blocked; time passing does not resolve the question. Other inspection or preparation may still be useful.

## Run a small paired test

Choose one skill and keep a copy of its original instructions. Change only the ambiguous passage. Use the same files, tools, permission settings, and user prompts for both versions.

Run three cases:

1. **Already specified:** the user supplies the framework, palette, and sections. Record whether the agent starts useful work or repeats those questions.
2. **Missing consequential choice:** the user asks for a local draft, then the task reaches publication. Record whether the agent stops before an unauthorized external action.
3. **Mid-task correction:** after implementation starts, supply one predetermined change. Record whether the agent incorporates it without discarding unrelated work.

For each case, save the complete trace, resulting artifact, model identifier, runtime version, loaded instructions, and tool availability. Repeat the cases to catch inconsistent behavior. If comparing models, keep the rest of the setup identical and confirm that both model versions are actually available.

## What our Sol and Astra comparison measured

On September 30, we ran the unchanged [changelog skill](https://github.com/tushaarmehtaa/tushar-skills/tree/main/changelog) through the Responses API with the same synthetic repository evidence. Each model received the complete skill explicitly, used medium reasoning, and completed three HTTP streaming runs. There were no tools or runtime skill-discovery steps. The [method, runner and complete outputs](https://github.com/tushaarmehtaa/tushar-skills/tree/main/workspace/seo-newsroom/experiments/devday-model-eval) make the comparison inspectable.

| Observed sample | GPT-6.1 Sol Standard | GPT-6 Astra Standard |
| --- | --- | --- |
| Completed runs | 3 | 3 |
| Median completion time | 14.8 seconds | 24.4 seconds |
| Median time to first text | 5.65 seconds | 9.38 seconds |
| Median estimated token cost per run | $0.0083 | $0.0441 |

Client timings include network and HTTP overhead. Cost estimates use recorded input, cached-input, cache-write and output usage with [September 30 prices](https://developers.openai.com/api/docs/pricing); no billing invoice was checked. First runs wrote the cache and later runs read it. Across all six completed calls, the token estimate was about $0.19. This small sample cannot establish production tail latency or a general model ranking.

An unblinded review by the Codex assistant found that all six outputs surfaced the breaking migration, included five meaningful changes, excluded churn from customer bullets, supplied provenance and kept deployment unverified. All six caught a discrepancy: a commit described five webhook attempts, while its code allowed an initial attempt plus five retries.

There was a useful publication-review difference. Astra omitted or attributed a commit-only HTTP 400 claim in all three customer-facing drafts. Sol stated it without attribution in all three customer bullets, then disclosed the missing validation code in the handoff. This was an exploratory observation, not a preset quality score. Review the publication text as well as its limitations section.

We requested Astra Ultrafast separately. Although [OpenAI documents HTTP support](https://developers.openai.com/api/docs/guides/ultrafast-mode), this API project returned **Invalid service_tier argument** and completed no Ultrafast run. Its speed, quality and cost remain unmeasured here. Record the returned tier in your own evaluation; do not relabel Standard output as Ultrafast.

Use these results to design your own paired evaluation. They establish behavior for one supplied changelog task; they do not show that an instruction revision improves Astra or that either model installs, discovers or executes skills in a host.

## Judge completion and boundaries together

A useful result is fewer redundant questions with the same or better task completion, while every consequential boundary remains intact. Count unnecessary stops separately from required questions. Inspect the artifact as well as the conversation: an agent that stops asking but builds the wrong page has not improved.

Discard a comparison if permissions, tools, or the task changed between runs. If the difference cannot be reproduced, keep the instruction revision as a hypothesis. Do not turn one successful task into a claim about all Astra skills.

Start with the [skill-creator workflow](/skill-creator) to make a scoped revision. Keep the original, the revised passage, and the task traces together so a later model update can be checked against the same cases.
`;

export default function Page() { return <EditorialGuide guide={guide} content={content} />; }
