# Audio and captions

Read this reference only when the deliverable includes narration, music, sound effects, captions, or a muted-playback requirement.

## Build an audio plan

Record each source, owner or license, duration, format, intended role, and whether it may be redistributed. Do not download or generate media unless the user authorized that production path.

Prioritize intelligibility:

1. narration or essential product sound;
2. supporting sound effects;
3. music and ambience.

Music should not be programmatically pulsed on every beat merely because the BPM is known. Shape volume around narration, editorial transitions, and the track's own dynamics. Use automation sparingly and listen to the rendered result.

## Synchronize to final media

Use the actual audio duration and waveform when setting scene boundaries. Keep timeline values derived from `fps` and composition duration rather than hardcoded frame counts.

```typescript
const secondsToFrames = (seconds: number, fps: number) =>
  Math.round(seconds * fps);
```

When using Remotion audio components, verify the installed API and whether volume callbacks receive source-relative or composition-relative frames. Keep fades within the source's audible region.

```typescript
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const fadeEnvelope = (
  frame: number,
  start: number,
  end: number,
  fadeInFrames: number,
  fadeOutFrames: number,
) => {
  const inGain = fadeInFrames > 0 ? (frame - start) / fadeInFrames : 1;
  const outGain = fadeOutFrames > 0 ? (end - frame) / fadeOutFrames : 1;
  return clamp01(Math.min(inGain, outGain));
};
```

Adapt this envelope to actual edit points. Do not reuse arbitrary desktop, phone, or transition multipliers.

## Narration

- Write for one hearing: concrete nouns, manageable clauses, and stable terms.
- Read the script aloud before recording.
- Match delivery to the viewer and subject; do not default to launch-video hype.
- Remove breaths or noise only when the edit remains natural.
- Keep a clean narration stem so the mix can be revised.

If narration is generated, disclose the production method when required and verify pronunciation, names, numbers, and technical vocabulary.

## Captions

Create captions from the final narration, not an earlier script. Preserve meaning rather than mechanically filling a fixed character count.

- split at phrase boundaries;
- keep each caption on screen long enough to read;
- avoid covering product controls or platform UI;
- use sufficient contrast and a background treatment that survives changing footage;
- verify punctuation, names, units, and specialist terms;
- export the requested sidecar format and/or burn-in version.

For sound effects that convey information, provide an equivalent caption or visual cue.

## Mix and verify

Render the final composition before judging the mix. Check:

1. speech intelligibility throughout;
2. no clipping, abrupt source boundaries, or unexplained level jumps;
3. consistent perceived loudness across cuts and deliverables;
4. no music masking consonants or product sounds;
5. clean intro and outro boundaries;
6. caption timing against the final encoded file;
7. muted playback still communicates essential meaning when required.

Use available metering tools for peaks and loudness, but do not claim a broadcast or platform standard was met unless it was measured against that specified standard.
