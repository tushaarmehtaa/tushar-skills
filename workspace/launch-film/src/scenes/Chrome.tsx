// A full-screen Chrome window on macOS, drawn at 1280x720 and scaled up, so the UI keeps real proportions.
import { F } from "../theme";
import { Brand, Logo } from "../Logo";

export const W = 1280;
export const H = 720;
export const MENU = 25;
export const STRIP = 41;
export const TOOLBAR = 40;
export const PAGE_TOP = MENU + STRIP + TOOLBAR;

export type ChromeTab = { id: string; title: string; brand: Brand | null; hue: number; grow: number; kind?: "google" | "app" };

const STRIP_LEFT = 80;
const STRIP_RESERVE = 80;
const STRIP_BG = "#DFE3E9";

export function clockText(minutes: number) {
  const m = Math.round(minutes);
  const day = m >= 24 * 60 ? "Wed" : "Tue";
  const h24 = Math.floor(m / 60) % 24;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${day} ${h12}:${String(m % 60).padStart(2, "0")} ${h24 >= 12 ? "PM" : "AM"}`;
}

const MenuBar: React.FC<{ clock: string }> = ({ clock }) => (
  <div style={{
    position: "absolute", left: 0, top: 0, width: W, height: MENU, background: "rgba(246,246,248,0.92)", display: "flex", alignItems: "center",
    padding: "0 14px", gap: 18, fontFamily: F.system, fontSize: 13, color: "#1D1D1F", borderBottom: "0.5px solid rgba(0,0,0,0.12)",
  }}>
    <svg width="13" height="15" viewBox="0 0 814 1000"><path fill="#1D1D1F" d="M788 341c-6 4-108 62-108 190 0 148 130 200 134 201-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-165-40c-77 0-104 41-166 41s-106-58-156-128C44 789 0 667 0 551 0 365 121 266 240 266c63 0 116 42 156 42 38 0 97-44 169-44 27 0 126 2 192 77zM554 167c30-35 51-84 51-133 0-7-1-14-2-19-48 2-106 32-141 73-27 31-53 80-53 130 0 8 1 15 2 18 3 1 9 1 14 1 43 0 97-29 129-70z" /></svg>
    <b style={{ fontWeight: 700 }}>Chrome</b>
    {["File", "Edit", "View", "History", "Bookmarks", "Profiles", "Tab", "Window", "Help"].map((m) => <span key={m}>{m}</span>)}
    <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
      <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0zM3.6 6.9a6.3 6.3 0 0 1 8.8 0l1.1-1.2a7.9 7.9 0 0 0-11 0zM1.1 4.4a9.9 9.9 0 0 1 13.8 0L16 3.2A11.6 11.6 0 0 0 0 3.2z" fill="#1D1D1F" /></svg>
      <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="#1D1D1F" opacity="0.5" /><rect x="2" y="2" width="9" height="8" rx="1.6" fill="#1D1D1F" /><rect x="22.5" y="4" width="1.6" height="4" rx="0.8" fill="#1D1D1F" opacity="0.5" /></svg>
      <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 100, textAlign: "right" }}>{clock}</span>
    </span>
  </div>
);

export const Favicon: React.FC<{ tab: Pick<ChromeTab, "brand" | "hue" | "kind">; size?: number }> = ({ tab, size = 16 }) => {
  if (tab.kind === "google") return <GoogleG size={size} />;
  if (tab.kind === "app") {
    return <span style={{ width: size, height: size, borderRadius: 4, background: "linear-gradient(135deg,#6E7FF0,#8A4CD6)", flexShrink: 0 }} />;
  }
  if (tab.brand) return <Logo brand={tab.brand} size={size} color={tab.brand === "vercel" || tab.brand === "next" || tab.brand === "x" ? "#111" : undefined} />;
  return (
    <span style={{ width: size, height: size, borderRadius: size / 2, background: `hsl(${tab.hue} 30% 62%)`, flexShrink: 0, display: "grid", placeItems: "center" }}>
      <span style={{ width: size * 0.42, height: size * 0.42, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
    </span>
  );
};

export const GoogleG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.2C12.5 13.6 17.8 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.6 7l7.2 5.6c4.2-3.9 7.1-9.7 7.1-17.1z" />
    <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.2C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.2-5.6c-2.2 1.5-5.1 2.4-8.7 2.4-6.2 0-11.5-4.1-13.4-9.8l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
  </svg>
);

const TabStrip: React.FC<{ tabs: ChromeTab[]; active: string }> = ({ tabs, active }) => {
  const total = tabs.reduce((s, t) => s + t.grow, 0);
  const avail = W - STRIP_LEFT - STRIP_RESERVE;
  const w = Math.min(232, avail / Math.max(1, total));
  return (
    <div style={{ position: "absolute", left: 0, top: MENU, width: W, height: STRIP, background: STRIP_BG, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 16, top: 15, display: "flex", gap: 8 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)" }} />)}
      </div>
      <div style={{ position: "absolute", left: STRIP_LEFT, top: 6, height: STRIP - 6, display: "flex" }}>
        {tabs.map((t, k) => {
          const isActive = t.id === active;
          const width = w * t.grow;
          const showTitle = width > 58;
          const showIcon = width > 15 || isActive;
          return (
            <div key={t.id} style={{
              position: "relative", width: isActive ? Math.max(width, 44) : width, height: "100%", flexShrink: 0, display: "flex", alignItems: "center",
              gap: 8, padding: width > 30 ? "0 10px" : 0, justifyContent: width > 30 ? "flex-start" : "center", overflow: "hidden",
              background: isActive ? "#FFFFFF" : "transparent", borderRadius: "9px 9px 0 0", zIndex: isActive ? 2 : 1,
              fontFamily: F.system, fontSize: 12, color: isActive ? "#1F1F1F" : "#45474A", whiteSpace: "nowrap",
            }}>
              {!isActive && k > 0 && tabs[k - 1].id !== active && (
                <span style={{ position: "absolute", left: 0, top: 9, bottom: 9, width: 1, background: "#A8ADB4" }} />
              )}
              {showIcon && <Favicon tab={t} size={Math.min(16, Math.max(8, width - 6))} />}
              {showTitle && <span style={{ overflow: "hidden", textOverflow: "clip", flex: 1, maskImage: "linear-gradient(90deg,#000 80%,transparent)" }}>{t.title}</span>}
              {width > 90 && <span style={{ fontSize: 13, color: "#5F6368", marginLeft: 2 }}>×</span>}
            </div>
          );
        })}
        <span style={{ width: 34, display: "grid", placeItems: "center", fontSize: 20, color: "#45474A", flexShrink: 0, fontFamily: F.system, fontWeight: 300 }}>+</span>
      </div>
    </div>
  );
};

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const Toolbar: React.FC<{ url: string; host: string }> = ({ url, host }) => (
  <div style={{
    position: "absolute", left: 0, top: MENU + STRIP, width: W, height: TOOLBAR, background: "#FFFFFF", display: "flex", alignItems: "center",
    padding: "0 12px", gap: 16, borderBottom: "1px solid #E3E3E3", zIndex: 3,
  }}>
    <Icon d="M19 12H5m6-6-6 6 6 6" />
    <span style={{ opacity: 0.4 }}><Icon d="M5 12h14m-6-6 6 6-6 6" /></span>
    <Icon d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
    <div style={{
      flex: 1, height: 30, borderRadius: 15, background: "#EEF1F6", display: "flex", alignItems: "center", gap: 10, padding: "0 14px",
      fontFamily: F.system, fontSize: 13.5, color: "#1F1F1F", whiteSpace: "nowrap", overflow: "hidden",
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="2" strokeLinecap="round"><path d="M4 7h10m4 0h2M4 17h4m4 0h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
      <span><span style={{ color: "#1F1F1F" }}>{host}</span><span style={{ color: "#6B6F75" }}>{url}</span></span>
    </div>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="1.8"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z" /></svg>
    <span style={{ width: 24, height: 24, borderRadius: 12, background: "linear-gradient(135deg,#C88A5F,#7C5A44)" }} />
    <svg width="4" height="16" viewBox="0 0 4 16"><circle cx="2" cy="2" r="1.6" fill="#474747" /><circle cx="2" cy="8" r="1.6" fill="#474747" /><circle cx="2" cy="14" r="1.6" fill="#474747" /></svg>
  </div>
);

export const ChromeWindow: React.FC<{
  tabs: ChromeTab[]; active: string; host: string; url: string; clock: string; children: React.ReactNode;
}> = ({ tabs, active, host, url, clock, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#FFFFFF", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, top: PAGE_TOP, width: W, height: H - PAGE_TOP, overflow: "hidden" }}>{children}</div>
    <Toolbar host={host} url={url} />
    <TabStrip tabs={tabs} active={active} />
    <MenuBar clock={clock} />
  </div>
);

// The macOS arrow.
export const Pointer: React.FC<{ x: number; y: number; press?: number }> = ({ x, y, press = 0 }) => (
  <svg width="18" height="26" viewBox="0 0 18 26" style={{ position: "absolute", left: x, top: y, transform: `scale(${1 - press * 0.12})`, transformOrigin: "0 0", zIndex: 10, filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.35))" }}>
    <path d="M1 1v19.5l5-4.6 3.3 7.6 3.4-1.5-3.3-7.4H16z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
