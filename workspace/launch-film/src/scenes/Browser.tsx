// Act 1. 9pm to 4am in one Chrome window: search, open tabs, search again, until it spirals.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { S, clamp } from "../theme";
import { ENDLESS_QUERIES, ENDLESS_TABS, PICKED, RESULTS, SUGGESTIONS, type Hit } from "../data";
import { ChromeWindow, ChromeTab, PAGE_TOP, Pointer, W, H, clockText } from "./Chrome";
import { BOX_HOME, BOX_RESULTS, GoogleHome, GoogleResults, RESULT_H, RESULT_LEFT, RESULT_TOP, SearchBox } from "./Google";

const SEARCHES = S.searches;
const EN = S.endless;
const SCALE = 1920 / W;

type Opened = { id: string; at: number; title: string; brand: ChromeTab["brand"]; hue: number; group: number };

// Every tab that opens. Tabs opened from a search sit right after the Google tab, newest group first, the way Chrome inserts them.
const OPENED: Opened[] = [
  ...SEARCHES.flatMap((s, i) => s.tabsAt.map((at, j) => ({ id: `s${i}-${j}`, at, title: RESULTS[i][j].title, brand: RESULTS[i][j].brand, hue: (i * 53 + j * 31) % 360, group: i }))),
  ...EN.tabs.map((at, k) => ({ id: `e${k}`, at, title: ENDLESS_TABS[k % ENDLESS_TABS.length].title, brand: ENDLESS_TABS[k % ENDLESS_TABS.length].brand, hue: (k * 61) % 360, group: 100 + k })),
];

export const APP_TAB: ChromeTab = { id: "app", title: "Tallyroom · localhost:3000", brand: null, hue: 0, grow: 1, kind: "app" };

export function tabsAt(f: number, googleTitle: string): ChromeTab[] {
  const open = OPENED.filter((t) => t.at <= f);
  const groups = [...new Set(open.map((t) => t.group))].sort((a, b) => b - a);
  const ordered = groups.flatMap((g) => open.filter((t) => t.group === g));
  return [
    APP_TAB,
    { id: "google", title: googleTitle, brand: null, hue: 0, grow: 1, kind: "google" },
    ...ordered.map((t) => ({ id: t.id, title: t.title, brand: t.brand, hue: t.hue, grow: interpolate(f - t.at, [0, 4], [0, 1], clamp) })),
  ];
}

export function clockAt(f: number) {
  const m = f < EN.from
    ? interpolate(f, [0, EN.from], [21 * 60 + 2, 25 * 60 + 47], clamp)
    : interpolate(f, [EN.from, EN.to], [25 * 60 + 47, 28 * 60 + 58], clamp);
  return m;
}

export const endlessHits = (k: number): Hit[] => [0, 1, 2, 3].map((j) => {
  const tab = ENDLESS_TABS[(k * 3 + j) % ENDLESS_TABS.length];
  const q = ENDLESS_QUERIES[k];
  return { brand: tab.brand, site: tab.title, crumb: `${tab.title.toLowerCase().replace(/\s+/g, "")}.com › ${q.split(" ")[0]}`, title: `${q[0].toUpperCase()}${q.slice(1)} - ${tab.title}`, snippet: "14 answers · I tried everything in the docs and it still doesn't work…" };
});

// What the page, the box and the pointer show on frame f.
function state(f: number) {
  if (f >= EN.from) {
    const k = Math.max(0, EN.queries.filter((a) => a <= f).length - 1);
    const q = ENDLESS_QUERIES[k];
    const chars = Math.min(q.length, Math.floor((f - EN.queries[k]) * 2.4));
    return { page: "results" as const, hits: endlessHits(k), visited: [k % 2 === 0, true, k % 3 === 0, false], box: q.slice(0, chars), query: q, caret: true, flash: interpolate(f - EN.queries[k], [0, 2], [0.35, 1], clamp) };
  }
  const i = SEARCHES.reduce((n, s, k) => (f >= s.at - 10 ? k : n), -1);
  const done = SEARCHES.reduce((n, s, k) => (f >= s.enter + 1 ? k : n), -1);
  const page = done >= 0 ? ("results" as const) : ("home" as const);
  const hits = done >= 0 ? RESULTS[done] : [];
  const visited = done >= 0 ? SEARCHES[done].tabsAt.map((t) => f >= t) : [];
  const flash = done >= 0 ? interpolate(f - SEARCHES[done].enter, [1, 6], [0, 1], clamp) : 1;
  const caretOn = Math.floor(f / 15) % 2 === 0;
  if (i < 0) return { page, hits, visited, box: "", query: "", caret: caretOn, flash };
  const s = SEARCHES[i];
  if (f >= s.enter) return { page, hits, visited, box: s.query, query: s.query, caret: false, flash };
  if (f < s.at) {
    const prev = i > 0 ? SEARCHES[i - 1].query : "";
    return { page, hits, visited, box: prev, query: prev, caret: f >= s.at - 4, selected: f >= s.at - 4 && prev.length > 0, flash };
  }
  const typed = s.keys.filter((k) => k.t <= f).map((k) => k.ch).join("");
  const picked = f >= s.pick;
  return {
    page, hits, visited, flash, query: typed,
    box: picked ? SUGGESTIONS[i][PICKED] : typed, caret: true,
    suggestions: typed.length > 0 ? SUGGESTIONS[i] : undefined, typed, highlight: picked ? PICKED : -1,
  };
}

// Pointer waypoints: to the box before each search, onto each result it opens.
const WAYPOINTS = (() => {
  const pts: { f: number; x: number; y: number; click?: boolean }[] = [{ f: 0, x: 860, y: 470 }];
  SEARCHES.forEach((s, i) => {
    if (i === 0) pts.push({ f: s.at - 2, x: BOX_HOME.x + 420, y: BOX_HOME.y + 60 });
    else pts.push({ f: s.at - 4, x: BOX_RESULTS.x + 520, y: BOX_RESULTS.y + 24, click: true });
    s.tabsAt.forEach((at, j) => pts.push({ f: at, x: RESULT_LEFT + 120 + j * 22, y: RESULT_TOP + j * RESULT_H + 52, click: true }));
  });
  return pts;
})();

function pointerAt(f: number) {
  let a = WAYPOINTS[0];
  let b: (typeof WAYPOINTS)[number] | null = null;
  for (const p of WAYPOINTS) {
    if (p.f <= f) a = p;
    else { b = p; break; }
  }
  if (!b) return { x: a.x, y: a.y, press: a.click && f - a.f < 3 ? 1 : 0 };
  const travel = Math.min(9, b.f - a.f);
  const t = interpolate(f, [b.f - travel, b.f], [0, 1], clamp);
  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const press = a.click && f - a.f < 3 ? 1 : 0;
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, press };
}

export const Browser: React.FC = () => {
  const f = useCurrentFrame();
  const st = state(f);
  const isResults = st.page === "results";
  const title = isResults && st.query ? `${st.query} - Google Search` : "Google";
  const tabs = tabsAt(f, title);
  const shown = f >= EN.from ? ENDLESS_QUERIES[Math.max(0, EN.queries.filter((a) => a <= f).length - 1)] : (state(f).page === "results" ? SEARCHES.reduce((q, s) => (f >= s.enter ? s.query : q), "") : "");
  const url = isResults ? `/search?q=${shown.replace(/ /g, "+")}` : "";
  const panic = interpolate(f, [EN.from, EN.to], [0, 1], clamp);
  const zoom = interpolate(f, [0, EN.from], [1, 1.025], clamp) + 0.075 * panic * panic;
  const ptr = pointerAt(f);
  const jitter = panic > 0.5 ? Math.sin(f * 2.1) * 1.4 * panic : 0;
  return (
    <AbsoluteFill style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${jitter}px, ${jitter * 0.6}px)`, transformOrigin: "34% 30%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
        <ChromeWindow tabs={tabs} active="google" host="google.com" url={url} clock={clockText(clockAt(f))}>
          {isResults ? <GoogleResults hits={st.hits} visited={st.visited} flash={st.flash} /> : <GoogleHome />}
          <SearchBox
            box={isResults ? BOX_RESULTS : BOX_HOME}
            text={st.box} caret={st.caret} selected={"selected" in st ? st.selected : false}
            suggestions={"suggestions" in st ? st.suggestions : undefined} typed={"typed" in st ? st.typed : ""}
            highlight={"highlight" in st ? st.highlight : -1} clear={isResults}
          />
        </ChromeWindow>
        {f < EN.from && <Pointer x={ptr.x} y={ptr.y + PAGE_TOP} press={ptr.press} />}
      </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(10,10,12,0.42) 100%)", opacity: panic }} />
    </AbsoluteFill>
  );
};
