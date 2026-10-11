// Act 2. One line you'd say out loud, and the app changing in front of you.
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, S, clamp, ease } from "../theme";
import { BEATS, result } from "../data";
import { Brand, Logo, SkillsMark } from "../Logo";
import { TallyDashboard, TallyPricing, TallySignIn } from "./Tally";

const B = S.beat;
// The app screens are drawn at desktop size; the card shows them a little closer so they read on a phone.
const ZOOM = 1.3;

const useSpring = (at: number, damping = 200) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - at, fps, config: { damping } });
};

const Chip: React.FC<{ slug: string; brand?: Brand; dark?: boolean }> = ({ slug, brand, dark }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: F.mono, fontSize: 30, fontWeight: 500, color: dark ? C.termGreen : C.accent }}>
    {brand ? <Logo brand={brand} size={34} color={dark ? "#FFFFFF" : undefined} /> : <SkillsMark size={34} />}
    /{slug}
  </div>
);

// The state pill in the card's corner: red before, green after.
const Tag: React.FC<{ text: string; good: boolean }> = ({ text, good }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 30, fontFamily: F.sans, fontSize: 24, fontWeight: 500,
    background: good ? C.accentDim : C.redDim, color: good ? C.accent : C.red, whiteSpace: "nowrap",
  }}>
    <span style={{ width: 9, height: 9, borderRadius: 5, background: good ? C.accent : C.red }} />{text}
  </span>
);

type Card = { url: string; before: React.ReactNode; after: React.ReactNode; tags: [string, string]; phone?: boolean };

const CARDS: Record<string, Card> = {
  "auth-implementation": { url: "localhost:3000/dashboard", before: <TallyDashboard />, after: <TallySignIn />, tags: ["anyone can open this", "members only"] },
  "payments-with-dodo": { url: "localhost:3000/pricing", before: <TallyPricing live={false} />, after: <TallyPricing live />, tags: ["placeholder checkout", "real subscriptions"] },
  "mobile-first": {
    url: "", phone: true, tags: ["984px wide", "fits 320px"],
    before: <Img src={staticFile("proof/mobile-first/before-mobile.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />,
    after: <Img src={staticFile("proof/mobile-first/after-mobile.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />,
  },
};
const BRAND: Partial<Record<string, Brand>> = { "auth-implementation": "clerk" };

export const Beat: React.FC<{ slug: string; dur: number }> = ({ slug, dur }) => {
  const f = useCurrentFrame();
  const copy = BEATS[slug];
  const head = useSpring(B.headlineAt);
  const card = useSpring(B.cardAt);
  const proof = interpolate(f, [B.proofAt, B.proofAt + 10], [0, 1], clamp);
  const out = ease(interpolate(f, [dur - 10, dur], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: C.surface, fontFamily: F.sans }}>
      <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 700, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, opacity: 1 - out, transform: `translateX(${-out * 40}px)` }}>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 14}px)` }}><Chip slug={slug} brand={BRAND[slug]} /></div>
        <p style={{ margin: 0, fontSize: 96, lineHeight: 1.0, fontWeight: 600, letterSpacing: "-0.05em", color: C.ink, opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>{copy.line}</p>
        <p style={{ margin: 0, fontSize: 30, lineHeight: 1.4, color: C.text, opacity: proof, transform: `translateY(${(1 - proof) * 10}px)`, maxWidth: 620 }}>{copy.proof}</p>
      </div>
      <div style={{ opacity: card * (1 - out), transform: `translateX(${(1 - card) * 80 + out * 40}px) scale(${0.97 + card * 0.03})`, transformOrigin: "center" }}>
        <AppCard slug={slug} />
      </div>
    </AbsoluteFill>
  );
};

// Wipe progress: the after state sweeps over the before, left to right.
const useWipe = () => {
  const f = useCurrentFrame();
  return ease(interpolate(f, [B.wipeAt, B.wipeAt + 16], [0, 1], clamp));
};

const Wiped: React.FC<{ before: React.ReactNode; after: React.ReactNode; edge?: boolean }> = ({ before, after, edge = true }) => {
  const w = useWipe();
  return (
    <>
      <div style={{ position: "absolute", inset: 0 }}>{before}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{after}</div>
      {edge && w > 0 && w < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${w * 100}%`, width: 4, marginLeft: -2, background: C.accent, boxShadow: `0 0 24px 6px rgba(52,88,71,0.35)` }} />}
    </>
  );
};

const AppCard: React.FC<{ slug: string }> = ({ slug }) => {
  const c = CARDS[slug];
  const w = useWipe();
  const tag = w > 0.5 ? <Tag text={c.tags[1]} good /> : <Tag text={c.tags[0]} good={false} />;
  if (c.phone) {
    return (
      <div style={{ position: "absolute", left: 1250, top: 90, width: 420, height: 900 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 58, background: "#16171A", boxShadow: "0 40px 90px rgba(23,25,28,0.22)" }} />
        <div style={{ position: "absolute", left: 14, top: 14, right: 14, bottom: 14, borderRadius: 46, overflow: "hidden", background: "#fff" }}>
          <Wiped before={c.before} after={c.after} />
        </div>
        <div style={{ position: "absolute", left: -260, top: 420 }}>{tag}</div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", left: 900, top: 150, width: 900, height: 780, borderRadius: 24, background: "#fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(23,25,28,0.14), 0 0 0 1px rgba(23,25,28,0.06)" }}>
      <div style={{ height: 62, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", background: "#F3F4F6", borderBottom: "1px solid #E5E7EB" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => <span key={col} style={{ width: 13, height: 13, borderRadius: 7, background: col }} />)}
        <span style={{ marginLeft: 18, flex: 1, height: 36, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", padding: "0 18px", fontFamily: F.sans, fontSize: 18, color: "#4B5058" }}>{c.url}</span>
        {tag}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 62, bottom: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 900 / ZOOM, height: 718 / ZOOM, transform: `scale(${ZOOM})`, transformOrigin: "0 0" }}>
          <Wiped before={c.before} after={c.after} />
        </div>
      </div>
    </div>
  );
};

// Launch night. Same layout as every other skill: you ask the agent, the verdict streams into the card.
export const Deploy: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const d = S.deploy;
  const copy = BEATS["deploy-check"];
  const head = useSpring(B.headlineAt);
  const card = useSpring(B.cardAt);
  const proof = interpolate(f, [d.proofAt, d.proofAt + 10], [0, 1], clamp);
  const out = ease(interpolate(f, [dur - 10, dur], [0, 1], clamp));
  return (
    <AbsoluteFill style={{ background: C.surface, fontFamily: F.sans }}>
      <div style={{ position: "absolute", left: 130, top: 0, bottom: 0, width: 700, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, opacity: 1 - out, transform: `translateX(${-out * 40}px)` }}>
        <div style={{ opacity: head, transform: `translateY(${(1 - head) * 14}px)` }}><Chip slug="deploy-check" brand="vercel" /></div>
        <p style={{ margin: 0, fontSize: 96, lineHeight: 1.0, fontWeight: 600, letterSpacing: "-0.05em", color: C.ink, opacity: head, transform: `translateY(${(1 - head) * 30}px)` }}>{copy.line}</p>
        <p style={{ margin: 0, fontSize: 30, lineHeight: 1.4, color: C.text, opacity: proof, transform: `translateY(${(1 - proof) * 10}px)`, maxWidth: 620 }}>{copy.proof}</p>
      </div>
      <div style={{ opacity: card * (1 - out), transform: `translateX(${(1 - card) * 80 + out * 40}px) scale(${0.97 + card * 0.03})` }}>
        <AgentCard />
      </div>
    </AbsoluteFill>
  );
};

// The agent's terminal, in the same window card as the app screens.
const AgentCard: React.FC = () => {
  const f = useCurrentFrame();
  const d = S.deploy;
  const r = result("deploy-check");
  const typed = d.keys.filter((k) => k.t <= f).map((k) => k.ch).join("");
  const sent = f >= d.enter;
  const verdict = f >= d.blockedAt;
  const badge = spring({ frame: f - d.blockedAt, fps: 30, config: { damping: 14, mass: 0.6 } });
  const caret = !sent && Math.floor(f / 12) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 900, top: 190, width: 900, height: 700, borderRadius: 24, overflow: "hidden", background: C.term, boxShadow: "0 40px 90px rgba(23,25,28,0.18), 0 0 0 1px rgba(23,25,28,0.08)" }}>
      <div style={{ height: 62, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", background: "#1A1C1E", borderBottom: "1px solid #26292B" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => <span key={col} style={{ width: 13, height: 13, borderRadius: 7, background: col }} />)}
        <span style={{ marginLeft: 18, flex: 1, fontFamily: F.mono, fontSize: 18, color: C.termDim }}>~/tallyroom</span>
        {verdict ? <Tag text="leak caught" good /> : <Tag text="about to ship" good={false} />}
      </div>
      <div style={{ padding: "40px 44px", fontFamily: F.mono, color: C.termInk, display: "flex", flexDirection: "column", gap: 22 }}>
        <p style={{ margin: 0, fontSize: 38, lineHeight: 1.3 }}>
          <span style={{ color: C.termGreen }}>&gt; </span>{typed}
          <span style={{ display: "inline-block", width: 18, height: 40, marginLeft: 4, verticalAlign: "-7px", background: C.termInk, opacity: caret ? 1 : 0 }} />
        </p>
        <p style={{ margin: 0, fontSize: 24, color: C.termDim, opacity: sent ? 1 : 0 }}>
          <span style={{ color: C.termGreen }}>/deploy-check</span> reading the build, the bundle and the env
        </p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, badge * 1.5), transform: `scale(${0.92 + 0.08 * badge})`, transformOrigin: "left center" }}>
          <span style={{ background: "#D9573F", color: "#fff", fontWeight: 700, fontSize: 30, letterSpacing: "0.04em", padding: "8px 16px", borderRadius: 8 }}>BLOCKED</span>
          <span style={{ fontFamily: F.sans, fontSize: 34, fontWeight: 600, color: "#fff", letterSpacing: "-0.02em" }}>{r.headline}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 6 }}>
          {(r.reasons ?? []).map((x, k) => {
            const on = interpolate(f, [d.reasonsAt[k], d.reasonsAt[k] + 6], [0, 1], clamp);
            const good = x.tone === "good";
            return (
              <p key={x.title} style={{ margin: 0, display: "flex", gap: 16, fontFamily: F.sans, fontSize: 29, lineHeight: 1.35, color: good ? C.termDim : C.termInk, opacity: on, transform: `translateY(${(1 - on) * 10}px)` }}>
                <span style={{ fontFamily: F.mono, color: good ? C.termGreen : "#F08A73", width: 24, flexShrink: 0 }}>{good ? "✓" : "✗"}</span>{x.title}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};
