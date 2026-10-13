import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import profiles from "@/lib/skill-profiles.json";
import icons from "@/lib/skill-icons.json";
import { SKILL_DISPLAY } from "@/lib/canvas";
import { MASCOT } from "./mascot";

export const runtime = "edge";

// Brand v3: paper, ink and one amber. Same tokens as app/brand.css.
const PAPER = "#FAF9F5";
const INK = "#0A0A0A";
const AMBER = "#F59E0B";
const SOFT = "#5C574B";
const MUTED = "#7B7A72";
const CMD = "npx skills add tushaarmehtaa/tushar-skills";

const cal = fetch(new URL("./fonts/CalSans-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer());
const sans = fetch(new URL("./fonts/Geist-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer());
const mono = fetch(new URL("./fonts/GeistMono-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer());

const svgUri = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;
const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
// Satori misplaces ordinary spaces after some words in this Geist build (wide gaps after "feature", "workflow").
// A quarter-em space renders evenly and still wraps.
const even = (s: string) => s.replaceAll(" ", "\u2005");
const GROUP_LABELS: Record<string, string> = { shape: "Shape", build: "Build", ship: "Ship", grow: "Grow" };

function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width="44" height="44" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="7" fill={INK} />
        <path d="M10.5 24.5 L21.5 7.5" stroke={AMBER} strokeWidth="2.8" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: "Cal Sans", fontSize: 32, color: INK }}>slashskills</span>
    </div>
  );
}

/** The black install bar with the pixel astronaut standing on its top edge, as on the homepage. */
function InstallBar({ command, pose }: { command: string; pose: keyof typeof MASCOT }) {
  return (
    <div style={{ position: "absolute", left: 64, right: 64, bottom: 64, height: 88, display: "flex" }}>
      {/* 4x pixels: feet end on row 33 of 36, so the cell sits 132px above the bar. */}
      <img src={svgUri(MASCOT[pose])} width={128} height={144} style={{ position: "absolute", right: 40, top: -132 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: "0 32px",
          background: INK,
          fontFamily: "Geist Mono",
          fontSize: command.length > 62 ? 21 : command.length > 50 ? 24 : 27,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: MUTED, marginRight: 16 }}>$</span>
        <span style={{ color: AMBER }}>{command}</span>
      </div>
    </div>
  );
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const slug = q.get("skill");
  const title = q.get("title");
  const profile = slug ? (profiles.skills as Record<string, { group: string; outcome: string }>)[slug] : undefined;
  const icon = slug ? (icons as Record<string, { vb: string; svg: string }>)[slug] : undefined;

  let body: React.ReactNode;
  let command = CMD;
  let pose: keyof typeof MASCOT = "cheer";

  if (slug) {
    const outcome = profile?.outcome ?? q.get("description") ?? "";
    const flow = SKILL_DISPLAY[slug]?.flow;
    const meta = [profile && GROUP_LABELS[profile.group], flow].filter(Boolean).join("  ·  ");
    command = `${CMD} --skill ${slug}`;
    pose = "wave";
    body = (
      <div style={{ display: "flex", flexDirection: "column", marginTop: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {icon && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 104, height: 104, borderRadius: 24, background: INK }}>
              <img
                src={svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.vb}" fill="none" stroke="${AMBER}">${icon.svg.replaceAll("currentColor", AMBER)}</svg>`)}
                width={70}
                height={70}
              />
            </div>
          )}
          <span style={{ fontFamily: "Cal Sans", fontSize: slug.length > 18 ? 62 : 74, color: INK, letterSpacing: "-0.005em" }}>/{slug}</span>
        </div>
        {outcome && (
          <div style={{ marginTop: 26, maxWidth: 840, fontFamily: "Geist", fontSize: 31, lineHeight: 1.35, color: SOFT }}>{even(clip(outcome, 110))}</div>
        )}
        {meta && (
          <div style={{ marginTop: 18, fontFamily: "Geist Mono", fontSize: 20, letterSpacing: "0.04em", textTransform: "uppercase", color: MUTED }}>{meta}</div>
        )}
      </div>
    );
  } else if (title) {
    const description = q.get("description");
    pose = "laptop";
    body = (
      <div style={{ display: "flex", flexDirection: "column", marginTop: 64 }}>
        <div style={{ fontFamily: "Cal Sans", fontSize: title.length > 28 ? 64 : 84, lineHeight: 1.06, color: INK, maxWidth: 1000 }}>{clip(title, 60)}</div>
        {description && (
          <div style={{ marginTop: 22, maxWidth: 820, fontFamily: "Geist", fontSize: 30, lineHeight: 1.35, color: SOFT }}>{even(clip(description, 120))}</div>
        )}
      </div>
    );
  } else {
    body = (
      <div style={{ display: "flex", flexDirection: "column", marginTop: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cal Sans", fontSize: 86, lineHeight: 1.04, color: INK }}>
          <span>good work starts with</span>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <span>a useful skill</span>
            <div style={{ width: 14, height: 14, background: AMBER, marginLeft: 5, marginBottom: 18 }} />
          </div>
        </div>
        <div style={{ marginTop: 20, fontFamily: "Geist", fontSize: 30, color: SOFT }}>{even("One command to get them all.")}</div>
      </div>
    );
  }

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", flexDirection: "column", width: 1200, height: 630, padding: "56px 64px", background: PAPER }}>
        <Brand />
        {body}
        <InstallBar command={command} pose={pose} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Cal Sans", data: await cal, weight: 400, style: "normal" },
        { name: "Geist", data: await sans, weight: 400, style: "normal" },
        { name: "Geist Mono", data: await mono, weight: 400, style: "normal" },
      ],
    },
  );
}
