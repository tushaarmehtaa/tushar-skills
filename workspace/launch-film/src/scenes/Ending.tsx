import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, S, clamp } from "../theme";
import { SKILL_COUNT } from "../data";
import { CodexMark, Logo, SkillsMark } from "../Logo";

// Where it runs. The marks are the ones the site uses.
const AGENTS = [
  { name: "Claude Code", mark: <Logo brand="claudecode" size={108} color="#D97757" /> },
  { name: "Codex", mark: <div style={{ position: "absolute", left: -30, top: -30 }}><CodexMark size={300} /></div> },
  { name: "Cursor", mark: <Logo brand="cursor" size={100} color="#F7F7F4" /> },
];

export const Works: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const out = interpolate(f, [dur - 9, dur], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: F.sans, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 80, opacity: out }}>
      <p style={{ margin: 0, fontSize: 84, fontWeight: 600, letterSpacing: "-0.05em", color: C.ink, opacity: title, transform: `translateY(${(1 - title) * 20}px)` }}>works where you already build.</p>
      <div style={{ display: "flex", gap: 90 }}>
        {AGENTS.map((a, k) => {
          const p = spring({ frame: f - 14 - k * 7, fps, config: { damping: 16, mass: 0.7 } });
          return (
            <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})` }}>
              <div style={{
                width: 240, height: 240, borderRadius: 54, display: "grid", placeItems: "center", position: "relative", overflow: "hidden",
                background: "linear-gradient(145deg,#1B1C1E,#0E0F10)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 30px 60px rgba(23,25,28,0.22)",
              }}>
                <span style={{ position: "absolute", left: 30, right: 30, top: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)" }} />
                {a.mark}
              </div>
              <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", color: C.ink }}>{a.name}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = S.end;
  const brand = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const line = spring({ frame: f - 16, fps, config: { damping: 200 } });
  const term = spring({ frame: f - (e.commandAt - 10), fps, config: { damping: 200 } });
  const pasted = interpolate(f, [e.commandAt, e.commandAt + 4], [0, 1], clamp);
  const foot = interpolate(f, [e.enter + 6, e.enter + 16], [0, 1], clamp);
  const fine = interpolate(f, [e.enter + 22, e.enter + 32], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: F.sans, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28, opacity: brand, transform: `translateY(${(1 - brand) * 20}px)` }}>
        <SkillsMark size={104} />
        <span style={{ fontSize: 118, fontWeight: 650, letterSpacing: "-0.06em", color: C.ink }}>slashskills</span>
      </div>
      <p style={{ margin: "30px 0 0", fontSize: 50, fontWeight: 500, letterSpacing: "-0.03em", color: C.text, opacity: line, transform: `translateY(${(1 - line) * 14}px)` }}>
        {SKILL_COUNT} skills for everything that isn't your app.
      </p>
      <div style={{
        marginTop: 70, minWidth: 1000, background: C.term, color: C.termInk, fontFamily: F.mono, fontSize: 40, padding: "30px 44px", borderRadius: 18,
        boxShadow: "0 30px 70px rgba(23,25,28,0.20)", opacity: term, transform: `translateY(${(1 - term) * 20}px)`, display: "flex", alignItems: "center",
      }}>
        <span style={{ color: C.termGreen }}>$&nbsp;</span><span style={{ opacity: pasted, transform: `translateX(${(1 - pasted) * 8}px)`, display: "inline-block" }}>{e.text}</span>
        <span style={{ display: "inline-block", width: 20, height: 44, marginLeft: 4, background: C.termInk, opacity: f > e.enter || Math.floor(f / 12) % 2 === 0 ? 1 : 0 }} />
      </div>
      <div style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 18, fontSize: 34, color: C.ink, opacity: foot }}>
        <span style={{ fontFamily: F.mono, fontWeight: 600 }}>slashskills.xyz</span>
        <span style={{ color: C.line }}>|</span>
        <Logo brand="github" size={32} color={C.ink} />
        <span>free and open source</span>
      </div>
      <p style={{ position: "absolute", bottom: 56, margin: 0, fontSize: 22, color: C.text, opacity: fine }}>every result shown comes from a real run on a sample project</p>
    </AbsoluteFill>
  );
};
