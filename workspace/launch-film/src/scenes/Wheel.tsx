// Every skill, at once. "/skills" is the hub; the 34 names radiate from it and turn past, one by one.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, clamp } from "../theme";
import { ALL_SKILLS, SKILL_COUNT } from "../data";

const HUB = { x: 640, y: 540 };
const HUB_R = 300;
const SPOKE_R = 380;
const STEP = 360 / SKILL_COUNT;

export const Wheel: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hub = spring({ frame: f - 2, fps, config: { damping: 200 } });
  // The names arrive one after another, then the wheel turns: quick at first, settling at the end.
  const arrive = (k: number) => 6 + k * 1.1;
  const turn = interpolate(f, [0, dur], [0, 1], clamp);
  const rot = 150 * (1 - Math.pow(1 - turn, 2.2));
  const shown = Math.min(SKILL_COUNT, Math.max(0, Math.floor((f - 6) / 1.1) + 1));
  const out = interpolate(f, [dur - 9, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: F.sans, overflow: "hidden", opacity: out }}>
      {[SPOKE_R - 30, 820, 1260].map((r, k) => (
        <div key={r} style={{
          position: "absolute", left: HUB.x - r, top: HUB.y - r, width: r * 2, height: r * 2, borderRadius: r,
          border: `1.5px ${k === 0 ? "solid" : "dashed"} ${C.line}`, opacity: interpolate(f, [k * 4, k * 4 + 14], [0, 0.9], clamp),
        }} />
      ))}
      {ALL_SKILLS.map((slug, k) => {
        const a = ((k * STEP - rot - 4) % 360 + 540) % 360 - 180; // -180..180, 0 points right
        const rad = (a * Math.PI) / 180;
        const facing = Math.cos(rad);
        if (facing < -0.05) return null;
        const p = spring({ frame: f - arrive(k), fps, config: { damping: 18, mass: 0.6 } });
        const focus = interpolate(Math.abs(a), [0, STEP * 0.8, STEP * 2.5], [1, 0.45, 0], clamp);
        const r = SPOKE_R + (1 - p) * 60;
        const x = HUB.x + r * Math.cos(rad);
        const y = HUB.y + r * Math.sin(rad);
        return (
          <div key={slug} style={{
            position: "absolute", left: x, top: y, transform: `translateY(-50%) rotate(${a}deg)`, transformOrigin: "0 50%",
            display: "flex", alignItems: "center", gap: 18, whiteSpace: "nowrap", opacity: p * interpolate(facing, [-0.05, 0.45, 1], [0, 0.5, 1], clamp),
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: focus > 0.5 ? C.accent : C.line, flexShrink: 0 }} />
            <span style={{
              fontFamily: F.mono, fontSize: 34 + 10 * focus, fontWeight: focus > 0.5 ? 600 : 500, letterSpacing: "-0.02em",
              color: focus > 0.5 ? C.ink : C.text,
            }}>
              <span style={{ color: C.accent }}>/</span>{slug}
            </span>
          </div>
        );
      })}
      <div style={{
        position: "absolute", left: HUB.x - HUB_R, top: HUB.y - HUB_R, width: HUB_R * 2, height: HUB_R * 2, borderRadius: HUB_R,
        background: C.surface, boxShadow: "0 30px 80px rgba(23,25,28,0.10), inset 0 0 0 1px rgba(23,25,28,0.06)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
        transform: `scale(${0.9 + 0.1 * hub})`, opacity: hub,
      }}>
        <span style={{ fontSize: 150, fontWeight: 650, letterSpacing: "-0.06em", color: C.ink, lineHeight: 1 }}>/skills</span>
        <span style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", color: C.text }}>
          <b style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{shown}</b> skills. one install.
        </span>
      </div>
    </AbsoluteFill>
  );
};
