# Remotion implementation cheatsheet

Read this reference only when implementing animation, responsive composition, font loading, or render commands. Confirm every API against the versions installed in the target repository.

## Animation parameters

Start from the interaction's meaning, then tune while watching at normal speed.

```typescript
const progress = spring({
  frame: localFrame,
  fps,
  config: { damping: 18, stiffness: 120, mass: 1 },
});
```

- Increase damping to reduce oscillation.
- Increase stiffness for a faster response.
- Increase mass for a heavier response.
- Prefer non-oscillating timing for routine UI, data, and instructions.
- Review at final scale; a movement visible in Studio may disappear in a feed.

Use `interpolate()` clamping when the input can precede or exceed its range:

```typescript
const opacity = interpolate(localFrame, [0, enterFrames], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

## Responsive composition

Derive layout from composition dimensions and safe areas. Do not scale a desktop frame uniformly into portrait.

```typescript
const { width, height } = useVideoConfig();
const orientation = height > width ? "portrait" : "landscape";
const shortEdge = Math.min(width, height);
```

Branch composition when the information hierarchy changes. Test long copy, product UI, captions, and platform overlays independently in every requested format.

## Font loading

Use the font mechanism supported by the installed Remotion version. Load fonts before rendering dependent frames, bundle only licensed files, and provide a predictable fallback. Test missing and slow font paths rather than masking them with an arbitrary renderer timeout.

## Render workflow

Inspect project scripts first. Typical commands may include:

```bash
npx remotion compositions
npx remotion studio
npx remotion still <composition-id> --frame=<frame> out/review.png
npx remotion render <composition-id> out/video.mp4
```

Use composition IDs, props, codecs, and timeouts defined by the project. Render representative stills around transitions before paying the cost of a full render.

## Determinism checks

- Seek directly to a frame and compare it with playback reaching the same frame.
- Avoid wall-clock time, random values without stable seeds, and mutable module state.
- Pass local frame values to scene-relative animation.
- Verify asynchronous media and data use Remotion's supported render-delay mechanism.
- Test the first and last frame of every sequence for flashes or stale layers.

## Review checklist

Check the final encoded file, not only Studio: resolution, frame rate, duration, safe areas, text rendering, media presence, audio sync, caption sync, and representative device playback.
