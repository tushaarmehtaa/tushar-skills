import { EditorialGuide, guideMetadata } from "@/components/editorial-guide";
import { EDITORIAL_GUIDES } from "@/lib/guides";

const guide = EDITORIAL_GUIDES[0];
export const metadata = guideMetadata(guide);
const content = `## Make the edit reproducible

A product-image revision often has two jobs: change the requested detail and preserve everything already approved. A useful skill makes both explicit, keeps track of the correct base image, and inspects the result before the next revision.

This guide accompanies the [image-editing package](/image-editing). The package and edit record are available to inspect and install. The workflow has **not yet been evaluated across image models or runtimes**; the examples below are instructions and acceptance criteria, not generated results.

## Where GPT Image 2.5 fits

OpenAI documents text and image inputs for both GPT-Image-2.5 Flare and Sunburst. Its model pages position Flare for everyday generation and Sunburst for editing precision. Both can be selected through the Images API or the Responses image-generation tool. Those are provider descriptions, not a measured comparison from Slashskills. See the [Flare documentation](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare) and [Sunburst documentation](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst), checked September 9, 2026.

The skill supplies the editing workflow. Your runtime must supply image inspection and an editing tool or configured API. Installing a SKILL.md file does not add those capabilities or model access. If your tool does not expose model selection, record that limitation instead of labeling its output as a particular model.

## Start with a change/preserve contract

Suppose a customer supplies a bottle photograph and asks for a warmer background. “Make this look better” leaves the label, geometry, and composition open to interpretation. A more useful edit request names the boundaries:

\`\`\`text
Edit the attached product photograph.
Change: replace the background with warm gray.
Preserve: bottle silhouette, cap shape, label position,
all label text, camera angle, and product scale.
Exact label copy: NORTH / 250 ml.
Return: one edited image at the supplied dimensions.
\`\`\`

This is an illustrative brief. Use the actual text and constraints from your reference. Do not add preservation requirements that conflict with the requested edit.

## Keep identity and revision history separate

Use the original photograph as the identity reference. For a second edit, use the latest approved output as the edit base. These files serve different purposes: the first establishes what the product is; the second carries the changes already accepted.

For example, after the background is approved, the customer might ask for a softer shadow. The new request should retain the warm-gray background while changing the shadow. If the label became distorted in a rejected draft, using that draft as the next base would carry the defect forward.

The package includes a [revision record](/image-editing#package-file-72-65-66-65-72-65-6e-63-65-73-2f-65-64-69-74-2d-72-65-63-6f-72-64-2e-6d-64). Its core fields are:

\`\`\`yaml
identity_reference: references/product-original.png
edit_base: outputs/revision-01-approved.png
requested_change: Soften the shadow.
preserve:
  - Approved warm-gray background
  - Bottle and cap geometry
  - Label text and placement
output: outputs/revision-02.png
approval: pending
\`\`\`

Attach the actual files through the tool's supported reference mechanism. Filenames in a prompt do not attach images. If a required image is missing, retrieve it or request it before the edit.

## Inspect four things before another edit

For each output, check the requested change, product identity, exact copy, and previously approved edits. Record pass, fail, or unchecked for each. A polished image may still fail because one letter changed or the cap shape drifted.

OCR can help check text, but the visual inspection still matters: correct characters can have broken spacing or distorted placement. When an output fails, retry from the last approved base with a correction for that specific defect. Keep failed drafts separate.

The package defaults to at most two corrective revisions per requested output unless the user sets another limit. This is a workflow limit, not a model capability claim. Stop sooner if the available budget or tool cannot support another attempt. Report remaining defects rather than marking an unchecked result approved.

## Try the skill on one real edit

1. Open the [image-editing skill](/image-editing), check its requirements, and install it for your runtime.
2. Supply a reference and ask for one concrete change. Identify exact text or geometry that must remain.
3. Inspect the result against the original and record failures.
4. Approve a base, request a second change, and check that the first edit survives.

To evaluate whether the skill helps, compare this sequence with the same task using a plain instruction. Keep the model, tool settings, references, and budget identical. Save the returned files and inspect them without knowing which approach produced them. Do not report an improvement until those outputs exist and have been scored.

For application-level API integration, retries, and observability, use [ai-product-development](/ai-product-development). This guide's narrower job is to make the editing workflow reusable.
`;

export default function Page() { return <EditorialGuide guide={guide} content={content} />; }
