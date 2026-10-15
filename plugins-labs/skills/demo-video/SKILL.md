---
name: demo-video
description: Plan, script, build, and verify Remotion product demos, walkthroughs, launch clips, and explainers. Use when a product or technical claim needs a storyboard or rendered video.
license: MIT
---

# Demo video

Turn one defensible message into a visual sequence that works in its viewing context, then implement it with the repository's Remotion setup. Story, evidence, and comprehension determine the treatment; transitions do not.

## Establish the brief from available evidence

Inspect the product, existing media, brand assets, UI, documentation, and Remotion configuration before asking questions. Establish:

- target viewer and what they know before watching;
- destination, aspect ratio, sound-on or sound-off context, and duration range;
- one primary claim or learning outcome;
- product action, result, data, or demonstration that can prove it;
- call to action or final implication;
- available footage, UI states, narration, music, fonts, and brand constraints;
- deadline, rendering environment, and required deliverables.

Ask only for missing information that changes the claim, evidence, production scope, or rights to use an asset. If creative direction is open, propose a treatment and storyboard rather than asking the user to invent scenes.

## Choose the format

- **Product walkthrough** — chronological task completion with legible UI and minimal editorial interruption.
- **Launch or social clip** — compressed proposition, product evidence, payoff, and action; must work muted if the destination commonly autoplays without sound.
- **Technical explainer** — mechanism, observation, interpretation, limitation, and implication. Read [explainer writing](references/explainer-writing.md) before scripting.
- **Feature demo** — one capability, starting state, action, visible result, and boundary.
- **Narrated tutorial** — paced instruction with prerequisites, cursor intent, captions, recovery, and a reproducible result.

Do not combine every format into one video. When several outputs are requested, define a master narrative and decide which beats survive each cut.

## Write a proof-led treatment

Before code, produce:

```text
Viewer:
Destination and format:
Primary claim:
Visible proof:
What must be understood by the end:
Narration/caption approach:
Treatment:
Beat list with approximate timing:
Required assets or captures:
Risks or unknowns:
```

Each beat must change what the viewer knows, sees, or can do. Pair every material narration line with visible evidence or necessary context. Cut decorative scenes that merely repeat the voiceover.

Use real product states and truthful data. Label representative fixture data and avoid presenting it as customer proof.

## Script for time and sound context

Draft narration and on-screen copy together. Estimate timing by reading the script aloud at the intended delivery pace, then validate against recorded or generated audio rather than relying only on word count.

- Keep critical on-screen text readable long enough to parse.
- Caption spoken content when the deliverable requires accessibility or muted comprehension.
- Do not make captions compete with product UI or platform overlays.
- State specialist terms after explaining the mechanism, then use them consistently.
- Keep claims within what the visible demonstration establishes.

For voiceover, music, sound effects, caption generation, or loudness work, read [audio and captions](references/audio.md) before adding media.

## Plan formats deliberately

Do not render one unchanged composition into every aspect ratio. For each requested format, define safe areas, text measure, crop behavior, product-UI scale, and any beat that needs recomposition or omission.

Share components and timeline data when useful, but allow format-specific composition. Register only deliverables the user needs.

## Implement in the existing Remotion project

Inspect installed versions, module format, project entry point, configuration, scripts, and existing primitives. Use those APIs and conventions. For a new standalone project, select compatible current versions rather than copying pinned versions from this skill.

Separate concerns where the project size benefits from it:

- composition registration and input props;
- narrative/timeline data;
- scenes or shots;
- shared visual primitives;
- media and font loading;
- captions and audio mix;
- tests or frame assertions.

Pass local timeline time to scenes when their animation is scene-relative. Use global time only for deliberately continuous behavior. Clamp interpolation only when values can travel outside the intended range; do not add ceremonial options to bounded inputs.

Read [Remotion primitives](references/primitives.md) only when the treatment needs reusable scene lifecycle, text-reveal, transition, or typing patterns. Adapt the primitives to the chosen visual language; none is mandatory.

Read [implementation cheatsheet](references/cheatsheet.md) when choosing animation parameters, responsive sizing, font loading, or render commands. Verify APIs against the installed Remotion version.

## Design motion from meaning

Choose cuts, dissolves, spatial continuity, reveals, zooms, or pauses based on the relationship between beats. Avoid applying springs, stagger, grain, glow, terminal simulation, bouncing buttons, or animated gradients as a signature recipe.

Animation must be deterministic under frame seeking. Support reduced motion when the video is embedded as an interactive or web experience. Do not animate fine detail that disappears at the final delivery size.

## Handle product capture

When showing a live product:

1. define the exact state and data needed;
2. remove secrets and personal information;
3. control viewport, cursor, zoom, and animation settings;
4. capture at sufficient resolution;
5. preserve UI chronology so actions and results remain believable;
6. record limitations when a mock or fixture substitutes for a live state.

## Output contract

Deliver the requested combination of:

- treatment and timed beat sheet;
- narration and on-screen script;
- asset/capture manifest with provenance;
- Remotion source and composition IDs;
- caption file or embedded captions;
- rendered files named by format;
- representative stills or review frames;
- verification report including technical and editorial checks.

State which formats share a timeline and which were independently composed.

## Verify

### Technical

1. Install or reuse dependencies according to repository policy.
2. Run typecheck, build, and relevant tests.
3. List compositions and render every requested deliverable.
4. Seek representative frames around scene boundaries and confirm deterministic output.
5. Check missing-media, font-loading, long-text, and format-specific branches.
6. Confirm output resolution, frame rate, duration, codec, and file size match the delivery contract.

### Editorial and visual

1. Watch each final render from beginning to end at normal speed.
2. Confirm the opening establishes relevance, the proof is visible, and the ending resolves the stated claim.
3. Review at actual feed or player size, muted and with sound when applicable.
4. Check text duration, caption synchronization, safe areas, platform overlays, UI legibility, and visual continuity.
5. Confirm narration never outruns the evidence or claims unavailable product behavior.

### Audio and accessibility

1. Listen on headphones and ordinary speakers; check peaks, clipping, abrupt edits, intelligibility, and consistent loudness.
2. Verify captions against the final audio, including names and technical terms.
3. Confirm essential meaning survives muted playback when required.

Report every check actually performed and any limitation caused by unavailable assets, services, codecs, or deployment context.
