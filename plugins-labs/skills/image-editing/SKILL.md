---
name: image-editing
description: Edit supplied images while preserving product identity, exact copy, composition, and previously approved changes. Use when a supplied image needs reference-based edits or successive revisions.
license: MIT
---

# Image editing

Requires an image-editing tool or configured API, image inspection, and access to the supplied references. Installing this skill does not provide model access.

Deliver edited images and a short report of requested changes, preserved details, and remaining defects. Follow the user's requested model, style, references, and output format.

## Establish the edit

Inspect the supplied images and prior approved output before choosing a base. Distinguish the image to edit from references that establish identity, style, or layout. If a required reference is missing, request that file; do not invent its content. Infer routine details from the supplied brief rather than requiring a questionnaire.

For successive revisions, use the latest approved output as the edit base and keep the original identity reference available. Do not promote a failed draft to the new base. Read [the edit record](references/edit-record.md) when tracking multiple references, revisions, or exact-copy requirements.

Write a compact change/preserve contract: the requested difference, details that must remain, exact text, and output dimensions. Resolve direct conflicts (such as changing a label while preserving all label text) before dependent work; continue independent inspection.

## Select and use the tool

Inspect the available image tool's contract. Use its supported reference-image mechanism and editing operation. A text prompt describing a reference is not a substitute for attaching it. If using an API, verify the requested model ID, edit endpoint, supported parameters, and account access in current official documentation. Never claim that a tool selected a model when it does not expose model selection.

Use existing configured access. Do not place credentials in prompts, source files, or output logs. If editing is unavailable, return the prepared edit contract and name the missing capability; do not claim to have produced an image. A skill does not grant tool permissions or pay for model access.

Perform the requested edit within the authorized budget. Preserve original files and save revisions separately. Unless the user sets another limit, try at most two corrective revisions per requested output. Do not turn a single edit into a model comparison or batch experiment without authorization for that expanded work.

## Inspect and revise

View the actual result alongside the base and identity references. Check each requested change and preserved detail separately: product shape, logo, exact copy, composition, and accumulated edits as applicable. Use OCR as supporting evidence for text; visually inspect glyphs and layout too.

When an output drifts, identify the failed constraint and retry from the last approved base with a focused correction. Stop at the retry/budget limit or when required inputs are unavailable. Never label an unchecked image approved. Distinguish agent inspection from user approval.

## Deliver

Return the image files, the model identity if exposed, which changes passed inspection, and specific unresolved defects. For a revision chain, identify the chosen base and final output. Do not claim measured fidelity, superiority, or cross-runtime compatibility without an actual recorded test.
