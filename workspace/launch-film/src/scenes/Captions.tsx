import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, F, S, clamp, ease } from "../theme";
import { ENDLESS_QUERIES } from "../data";
import { ChromeWindow, W, H, clockText } from "./Chrome";
import { APP_TAB, clockAt, endlessHits, tabsAt } from "./Browser";
import { GoogleResults } from "./Google";
import { TallyLanding } from "./Tally";

// "all i wanted was to build my app." Lowercase, one line, a lot of black.
export const Line: React.FC = () => {
  const f = useCurrentFrame();
  const words = "all i wanted was to build my app.".split(" ");
  return (
    <AbsoluteFill style={{ background: "#0A0B0C", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: F.sans, fontSize: 64, fontWeight: 500, color: "#F1F3F1", letterSpacing: "-0.03em", margin: 0 }}>
        {words.map((w, k) => (
          <span key={k} style={{ opacity: interpolate(f, [12 + k * 5, 20 + k * 5], [0, 1], clamp) }}>{w} </span>
        ))}
      </p>
    </AbsoluteFill>
  );
};

// The turn. Back to 4am, every tab closes, the clock runs back, and your app is all that's left.
export const Turn: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = S.endless.to;
  const lastQuery = ENDLESS_QUERIES[ENDLESS_QUERIES.length - 1];
  const all = tabsAt(end, `${lastQuery} - Google Search`);
  const p = ease(interpolate(f, [4, 40], [0, 1], { ...clamp, easing: (t) => t * t }));
  const keep = Math.max(1, Math.round(all.length - (all.length - 1) * p));
  const tabs = keep <= 1 ? [APP_TAB] : all.slice(0, keep);
  const appOnly = keep <= 1;
  const minutes = interpolate(p, [0, 1], [clockAt(end), 21 * 60 + 2]);
  const push = ease(interpolate(f, [40, 70], [0, 1], clamp));
  const one = spring({ frame: f - 46, fps, config: { damping: 200 } });
  const two = spring({ frame: f - 60, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1 + push * 0.06})`, transformOrigin: "50% 60%", filter: `blur(${push * 14}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${1920 / W})`, transformOrigin: "0 0" }}>
        <ChromeWindow tabs={tabs} active={appOnly ? "app" : "google"} host={appOnly ? "localhost:3000" : "google.com"} url={appOnly ? "" : `/search?q=${lastQuery.replace(/ /g, "+")}`} clock={clockText(minutes)}>
          {appOnly ? <TallyLanding /> : <GoogleResults hits={endlessHits(ENDLESS_QUERIES.length - 1)} visited={[true, true, false, true]} />}
        </ChromeWindow>
      </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(255,255,255,0.78)", opacity: push }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, fontFamily: F.sans }}>
        <p style={{ margin: 0, fontSize: 120, fontWeight: 600, letterSpacing: "-0.055em", color: C.ink, opacity: one, transform: `translateY(${(1 - one) * 26}px)` }}>focus on your app.</p>
        <p style={{ margin: 0, fontSize: 120, fontWeight: 600, letterSpacing: "-0.055em", color: C.accent, opacity: two, transform: `translateY(${(1 - two) * 26}px)` }}>skills take care of the rest.</p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
