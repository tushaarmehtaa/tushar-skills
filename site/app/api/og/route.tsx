import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const skill = request.nextUrl.searchParams.get("skill");
  const description = request.nextUrl.searchParams.get("description");
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        color: "#17191C",
        padding: "56px 64px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        <span>/skills</span>
        <span style={{ fontSize: 18, color: "#345847", fontWeight: 400 }}>
          A workflow worth following.
        </span>
      </div>
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 40 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 700,
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: skill && skill.length > 40 ? 44 : 60,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              fontWeight: 500,
            }}
          >
            {skill || "Good work starts with a useful skill."}
          </div>
          <div style={{ fontSize: 21, lineHeight: 1.5, color: "#60646C" }}>
            {(
              description ||
              "Give your agent a workflow worth following. Find a skill, make it yours, and get to work."
            ).slice(0, 210)}
          </div>
        </div>
        <svg width="320" height="260" viewBox="0 0 620 250">
          {Array.from({ length: 34 }, (_, j) => (
            <path
              key={j}
              d={`M30 ${28 + j * 5} C180 ${28 + j * 5} 270 ${217 - j * 5} 590 ${217 - j * 5}`}
              fill="none"
              stroke={j % 4 === 0 ? "#4F7061" : "#A5B6AC"}
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 34 }, (_, j) => (
            <path
              key={`c${j}`}
              d={`M${95 + j * 12} 10 Q${220 + j * 4} 115 ${490 - j * 9} 225`}
              fill="none"
              stroke="#9BA7A0"
              strokeWidth="0.8"
            />
          ))}
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #DCDDE1",
          paddingTop: 24,
          fontSize: 17,
          color: "#60646C",
        }}
      >
        <span>For Codex, Claude Code, and Cursor</span>
        <span>slashskills.xyz</span>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
