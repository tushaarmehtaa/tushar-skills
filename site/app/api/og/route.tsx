import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const skill = searchParams.get("skill");
  const description = searchParams.get("description") || "";

  const isHomepage = !skill;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            margin: "1px",
            border: "1px solid #1e1e1e",
            padding: "56px 68px",
            fontFamily: "monospace",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "auto",
            }}
          >
            <span
              style={{
                color: "#f59e0b",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              /
            </span>
            <span
              style={{
                color: "#fafafa",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              slashskills
            </span>
          </div>

          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Skill badge */}
            {!isHomepage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.25)",
                    color: "#f59e0b",
                    fontSize: "12px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: "3px",
                  }}
                >
                  skill
                </div>
              </div>
            )}

            {/* Title */}
            {isHomepage ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0px",
                }}
              >
                <span
                  style={{
                    color: "#fafafa",
                    fontSize: "80px",
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: "-0.04em",
                  }}
                >
                  workflows
                </span>
                <span
                  style={{
                    color: "#fafafa",
                    fontSize: "80px",
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: "-0.04em",
                  }}
                >
                  saved as
                </span>
                <span
                  style={{
                    color: "#f59e0b",
                    fontSize: "80px",
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: "-0.04em",
                  }}
                >
                  terminal skills.
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  color: "#fafafa",
                  fontSize: skill && skill.length > 16 ? "60px" : "72px",
                  fontWeight: 600,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                {`/${skill}`}
              </div>
            )}

            {/* Description */}
            {!isHomepage && description && (
              <div
                style={{
                  display: "flex",
                  color: "#6b6b6b",
                  fontSize: "22px",
                  lineHeight: 1.5,
                  maxWidth: "820px",
                }}
              >
                {description}
              </div>
            )}

            {/* Homepage sub */}
            {isHomepage && (
              <div
                style={{
                  display: "flex",
                  color: "#6b6b6b",
                  fontSize: "22px",
                  lineHeight: 1.5,
                }}
              >
                30 skills from real projects. install in Claude Code or upload a zip to the Claude app.
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #1e1e1e",
              paddingTop: "24px",
            }}
          >
            <span
              style={{
                color: "#4a4a4a",
                fontSize: "14px",
                letterSpacing: "0.08em",
                textTransform: "lowercase",
              }}
            >
              {isHomepage
                ? "npx skills add tushaarmehtaa/tushar-skills"
                : "claude code skills"}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ color: "#f59e0b", fontSize: "14px" }}>/</span>
              <span style={{ color: "#4a4a4a", fontSize: "14px" }}>
                slashskills
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
