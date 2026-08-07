---
name: changelog
description: Turn a verified git range into audience-appropriate changelog copy and optional visual assets. Use when preparing weekly updates, release summaries, or social changelog cards.
license: MIT
---

# Changelog

Translate a clearly defined change range into truthful release communication. Let the amount and importance of shipped work determine the item count, technical depth, and visual format.

## Establish scope

Infer from the request and repository:

- target branch, tag range, release, or date window;
- whether uncommitted or unreleased work is excluded;
- audience and expected technical depth;
- output: prose, Markdown, HTML card, image, or a combination;
- existing changelog policy, template, visual system, and prior examples.

Ask only when the range or release status remains ambiguous. Record the exact range in the handoff. Do not describe merged, committed, or feature-flagged work as live without deployment evidence.

## Inspect what changed

Start with repository-native release tooling when present. Otherwise inspect the chosen range:

```bash
git log --oneline <range>
git diff --stat <range>
git diff --name-status <range>
```

Read unclear diffs and relevant tests or documentation. Group commits by user-visible behavior rather than commit boundaries.

Include internal changes when they affect compatibility, security, reliability, performance, migration, or operator behavior. Exclude churn that has no consequence for the intended audience.

For each candidate item, capture:

- user or operator impact;
- evidence commits or diff paths;
- release status;
- breaking, migration, security, or limitation details;
- confidence and any missing deployment evidence.

## Draft for the audience

Use as many items as the range supports. Combine changes only when they form one coherent outcome; do not pad the update to fill a layout.

Each item should answer what changed and why the audience cares. Include implementation language when readers need it to adopt, debug, migrate, or evaluate the release.

Preserve the product's voice and capitalization. Do not force lowercase, emoji, slogans, or benefit-only language. If icons or category labels are part of an existing template, use them consistently and accessibly.

Call out breaking changes and required actions beside the affected item. Keep unverified deployment claims out of published copy and report them separately.

## Calculate truthful statistics

Use metrics only when they help and label exactly what they count. Avoid presenting changed-file entries across commits as unique files.

For unique files in a git range:

```bash
git diff --name-only <range> | sort -u | wc -l
```

Use `git diff --numstat <range>` for added/deleted text lines, accounting for binary entries. A commit count, unique-file count, or changed-line count is not a proxy for user value.

## Build a visual artifact conditionally

If the user requests a card or the repository has an established changelog template:

1. inspect existing assets, CSS, dimensions, and prior output;
2. preserve locked template code unless the user requested a design change;
3. choose a layout that fits the actual item count and copy length;
4. create the dated artifact using the repository's naming convention;
5. render or capture it at the target dimensions.

When no template exists, derive typography, color, and attribution from repository brand evidence. Do not default to a dark monospace card. Build semantic HTML, keep text selectable where appropriate, and support the requested capture tool and operating system.

If the desired platform or dimensions are unclear and affect composition, ask or provide a sensible explicitly labelled format.

## Output contract

Deliver the requested artifact plus:

```text
Range: [commits/tags/dates and branch]
Audience and channel: [who/where]
Release status: [verified live, released, unreleased, or mixed]
Items: [final count]
Provenance: [item -> commits or paths]
Statistics: [definitions and values, if used]
Artifacts: [paths and dimensions]
Limitations: [deployment or content facts not verified]
```

For a prose-only request, do not create HTML. For an audit request, stop at findings and proposed copy unless the user also asked for edits.

## Verify

1. Re-check every claim against the selected range and release evidence.
2. Confirm no meaningful breaking, security, compatibility, or migration change was hidden by the “user-facing” filter.
3. Confirm combined items describe one outcome and no item exists merely to fill space.
4. Recompute any statistics with commands that match their labels and handle binary files.
5. Validate dates, product names, links, versions, and attribution.
6. Render visual artifacts at target dimensions and inspect overflow, clipping, contrast, hierarchy, and long-item behavior.
7. Open the actual output using an available tool or provide a render path; do not rely on manual screenshot instructions as verification.
8. Report whether deployment/live status was directly verified or inferred.
