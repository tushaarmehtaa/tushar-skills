# Remotion primitives

Read this reference only when the selected treatment benefits from reusable scene lifecycle, transition, text-reveal, or typing behavior. These are adaptable patterns, not mandatory visual signatures.

## Contents

- [Scene lifecycle](#scene-lifecycle)
- [Text reveal](#text-reveal)
- [Transition overlay](#transition-overlay)
- [Typing behavior](#typing-behavior)
- [Selection rules](#selection-rules)

## Scene lifecycle

Keep scene-relative timing explicit and handle zero-length fades without duplicate interpolation points.

```tsx
import { AbsoluteFill, interpolate } from "remotion";

type SceneProps = {
  children: React.ReactNode;
  frame: number;
  duration: number;
  fadeIn?: number;
  fadeOut?: number;
};

export const Scene = ({
  children,
  frame,
  duration,
  fadeIn = 0,
  fadeOut = 0,
}: SceneProps) => {
  const enter = fadeIn > 0
    ? interpolate(frame, [0, fadeIn], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const exit = fadeOut > 0
    ? interpolate(frame, [duration - fadeOut, duration - 1], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return <AbsoluteFill style={{ opacity: Math.min(enter, exit) }}>{children}</AbsoluteFill>;
};
```

Add backgrounds only when the shot should occlude earlier layers. Transparent scenes are valid for intentional compositing.

## Text reveal

Reveal by line, word, or character only when sequencing helps comprehension. Use semantic text and preserve natural spacing.

```tsx
const words = text.split(/(\s+)/);

return words.map((token, index) => {
  if (/^\s+$/.test(token)) return token;
  const opacity = interpolate(frame - index * stagger, [0, enterFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <span key={`${token}-${index}`} style={{ opacity }}>{token}</span>;
});
```

Avoid springing every word or scaling type from extreme sizes unless the treatment specifically calls for that emphasis.

## Transition overlay

Use an overlay only when a cut or direct scene overlap does not express the relationship.

```tsx
export const FadeOverlay = ({ frame, duration, color }: {
  frame: number;
  duration: number;
  color: string;
}) => {
  const midpoint = duration / 2;
  const opacity = interpolate(frame, [0, midpoint, duration], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ backgroundColor: color, opacity, zIndex: 100 }} />;
};
```

Set stacking relative to the actual composition rather than assuming `100` is universally sufficient.

## Typing behavior

Use typing only for a real command, search, message, or input whose sequence matters.

```typescript
const typed = Math.floor(
  interpolate(frame, [start, end], [0, text.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
);
const visibleText = text.slice(0, typed);
```

Keep the cursor subordinate, stop or change it when entry completes, and ensure the full value remains visible long enough to read.

## Selection rules

- Prefer a cut when continuity is already clear.
- Prefer local transforms over layout-property animation.
- Keep effects tied to a narrative or state change.
- Parameterize tokens through the composition's design system.
- Test primitives at sequence boundaries, in every requested format, and under direct frame seeking.
