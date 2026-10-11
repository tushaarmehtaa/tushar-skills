// Google, home and results, in its own type and colours. Coordinates are page-relative at 1280 wide.
import { F } from "../theme";
import { GoogleWordmark, Logo } from "../Logo";
import type { Hit } from "../data";

export const RESULT_TOP = 150;
export const RESULT_H = 118;
export const RESULT_LEFT = 168;
export const BOX_RESULTS = { x: 168, y: 22, w: 690, h: 46 };
export const BOX_HOME = { x: 348, y: 238, w: 584, h: 48 };

const Mag: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = "#9AA0A6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path fill={color} d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" /></svg>
);
const Mic = () => (
  <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#4285f4" d="M12 15c1.66 0 3-1.31 3-2.97v-7.02A2.99 2.99 0 0 0 12 2C10.34 2 9 3.34 9 5.01v7.02C9 13.69 10.34 15 12 15" /><path fill="#34a853" d="M11 18.08h2V22h-2z" /><path fill="#fbbc04" d="M7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45.56 2.42 1.47 3.38z" /><path fill="#ea4335" d="M12 16.93a4.97 5.25 0 0 1-3.54-1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93" /></svg>
);
const Lens = () => (
  <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#4285f4" d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8" /><path fill="#ea4335" d="M5 8V5h3V3H5a2 2 0 0 0-2 2v3z" /><path fill="#fbbc04" d="M3 16v3a2 2 0 0 0 2 2h3v-2H5v-3z" /><path fill="#34a853" d="M19 21a2 2 0 0 0 2-2v-3h-2v3h-3v2z" /><path fill="#4285f4" d="M16 3v2h3v3h2V5a2 2 0 0 0-2-2z" /></svg>
);

// The search box with its dropdown. `typed` is what's in the box; `suggestions` open below it while typing.
export const SearchBox: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  text: string; caret: boolean; selected?: boolean; suggestions?: string[]; typed?: string; highlight?: number; clear?: boolean;
}> = ({ box, text, caret, selected, suggestions, typed = "", highlight = -1, clear }) => {
  const open = !!suggestions && suggestions.length > 0;
  return (
    <div style={{
      position: "absolute", left: box.x, top: box.y, width: box.w, background: "#FFFFFF", zIndex: 4,
      borderRadius: open ? "24px 24px 24px 24px" : box.h / 2, border: open ? "none" : "1px solid #DFE1E5",
      boxShadow: open ? "0 2px 8px 1px rgba(64,60,67,0.24)" : "0 1px 6px rgba(32,33,36,0.18)", overflow: "hidden", fontFamily: F.google,
    }}>
      <div style={{ height: box.h, display: "flex", alignItems: "center", padding: "0 14px 0 16px", gap: 14 }}>
        <Mag />
        <span style={{ flex: 1, fontSize: 16, color: "#202124", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
          <span style={{ background: selected ? "#B4D5FE" : "transparent" }}>{text}</span>
          <span style={{ width: 1.5, height: 20, marginLeft: 1, background: caret ? "#202124" : "transparent" }} />
        </span>
        {clear && <span style={{ fontSize: 22, color: "#70757A", paddingRight: 8, borderRight: "1px solid #DADCE0", lineHeight: "24px" }}>×</span>}
        <Mic />
        <Lens />
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #E8EAED", margin: "0 14px", paddingBottom: 10 }}>
          {suggestions!.map((s, k) => {
            const bold = s.startsWith(typed) ? s.slice(typed.length) : "";
            const lead = s.startsWith(typed) ? typed : s;
            return (
              <div key={s} style={{
                height: 34, display: "flex", alignItems: "center", gap: 14, margin: "0 -14px", padding: "0 16px",
                background: k === highlight ? "#EEEEEE" : "transparent", fontSize: 16, color: "#202124",
              }}>
                <Mag size={16} />
                <span>{lead}<b>{bold}</b></span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const GoogleHome: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: F.google }}>
    <div style={{ position: "absolute", right: 24, top: 14, display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#1F1F1F" }}>
      <span>Gmail</span><span>Images</span>
      <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#5F6368" d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4m6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4" /></svg>
      <span style={{ width: 32, height: 32, borderRadius: 16, background: "linear-gradient(135deg,#C88A5F,#7C5A44)" }} />
    </div>
    <div style={{ position: "absolute", left: 640 - 136, top: 110 }}><GoogleWordmark height={92} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 316, display: "flex", justifyContent: "center", gap: 12 }}>
      {["Google Search", "I'm Feeling Lucky"].map((b) => (
        <span key={b} style={{ background: "#F8F9FA", border: "1px solid #F8F9FA", borderRadius: 4, padding: "0 16px", height: 36, lineHeight: "36px", fontSize: 14, color: "#3C4043" }}>{b}</span>
      ))}
    </div>
  </div>
);

export const GoogleResults: React.FC<{ hits: Hit[]; visited: boolean[]; flash?: number }> = ({ hits, visited, flash = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: F.google }}>
    <div style={{ position: "absolute", left: 28, top: 27 }}><GoogleWordmark height={30} /></div>
    <div style={{ position: "absolute", right: 24, top: 26 }}><span style={{ display: "block", width: 32, height: 32, borderRadius: 16, background: "linear-gradient(135deg,#C88A5F,#7C5A44)" }} /></div>
    <div style={{ position: "absolute", left: RESULT_LEFT, top: 84, display: "flex", gap: 24, fontSize: 14, color: "#5F6368" }}>
      {["All", "Images", "Videos", "News", "Forums", "Shopping", "More"].map((t, k) => (
        <span key={t} style={{ paddingBottom: 10, color: k === 0 ? "#1F1F1F" : "#5F6368", fontWeight: k === 0 ? 700 : 400, borderBottom: k === 0 ? "3px solid #1F1F1F" : "3px solid transparent" }}>{t}</span>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 119, height: 1, background: "#EBEBEB" }} />
    <div style={{ position: "absolute", left: RESULT_LEFT, top: RESULT_TOP, width: 652, opacity: flash }}>
      {hits.map((h, k) => (
        <div key={k} style={{ height: RESULT_H, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 28, height: 28, borderRadius: 14, background: "#F1F3F4", border: "1px solid #DADCE0", display: "grid", placeItems: "center" }}>
              {h.brand ? <Logo brand={h.brand} size={16} color={h.brand === "vercel" || h.brand === "x" || h.brand === "mdn" || h.brand === "medium" || h.brand === "dev" || h.brand === "next" ? "#202124" : undefined} /> : <span style={{ fontSize: 13, fontWeight: 700, color: "#5F6368" }}>{h.site[0]}</span>}
            </span>
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 14, color: "#202124" }}>{h.site}</span>
              <span style={{ fontSize: 12, color: "#4D5156" }}>{h.crumb}</span>
            </span>
          </div>
          <span style={{ marginTop: 6, fontSize: 20, lineHeight: "26px", color: visited[k] ? "#681DA8" : "#1A0DAB", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.title}</span>
          <span style={{ marginTop: 3, fontSize: 14, lineHeight: "22px", color: "#4D5156", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{h.snippet}</span>
        </div>
      ))}
    </div>
  </div>
);
