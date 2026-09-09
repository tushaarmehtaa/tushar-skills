import { EditorialGuide, guideMetadata } from "@/components/editorial-guide";
import { EDITORIAL_GUIDES } from "@/lib/guides";

const guide = EDITORIAL_GUIDES[1];
export const metadata = guideMetadata(guide);
const content = `## Audit the instructions before rewriting the skill

When a model changes, an existing skill can expose ambiguities that previously went unnoticed. Start with one real stopping point: what did the user authorize, which instruction was loaded, and why did the agent stop?

OpenAI's [GPT-6 Astra guidance](https://developers.openai.com/api/docs/guides/latest-model), checked September 9, 2026, describes sensitivity to unclear or conflicting skill instructions and recommends making instruction priority explicit. It also discusses clarification and mid-turn steering. This is provider guidance. **Slashskills has not completed an Astra-versus-Sol evaluation.** The examples here are proposed instruction edits and a reproducible test method, not claims of improved performance.

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

## Judge completion and boundaries together

A useful result is fewer redundant questions with the same or better task completion, while every consequential boundary remains intact. Count unnecessary stops separately from required questions. Inspect the artifact as well as the conversation: an agent that stops asking but builds the wrong page has not improved.

Discard a comparison if permissions, tools, or the task changed between runs. If the difference cannot be reproduced, keep the instruction revision as a hypothesis. Do not turn one successful task into a claim about all Astra skills.

Start with the [skill-creator workflow](/skill-creator) to make a scoped revision. Keep the original, the revised passage, and the task traces together so a later model update can be checked against the same cases.
`;

export default function Page() { return <EditorialGuide guide={guide} content={content} />; }
