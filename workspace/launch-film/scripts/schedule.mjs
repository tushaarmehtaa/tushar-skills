// One schedule for picture and sound. Every keystroke, Enter, tab and scene boundary lives here,
// so the video (src/schedule.json) and the score (audio/score.py) can never drift apart.
// usage: node scripts/schedule.mjs
import { writeFileSync } from "node:fs";

const FPS = 30;
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Act 1: what you type (prefix), what Google finishes it to, how many tabs you open from it.
const SEARCHES = [
  { typed: "clerk vs auth", query: "clerk vs auth.js vs supabase auth", tabs: 3, pace: 2.7 },
  { typed: "nextjs subscr", query: "nextjs subscriptions webhook not firing", tabs: 4, pace: 2.5 },
  { typed: "is it safe to dep", query: "is it safe to deploy tonight", tabs: 4, pace: 2.3 },
];

// Keystroke times (fractional frames) for a string typed at `pace` frames per key, with a human wobble.
function keystrokes(text, start, pace) {
  const keys = [];
  let t = start;
  for (const ch of text) {
    keys.push({ t: +t.toFixed(2), ch });
    let gap = pace * (0.65 + rand() * 0.7);
    if (ch === " ") gap += pace * 0.5;
    t += gap;
  }
  return { keys, end: t };
}

const searches = [];
let t = 16;
for (const s of SEARCHES) {
  const { keys, end } = keystrokes(s.typed, t, s.pace);
  const pick = Math.round(end + 5); // arrow down onto the suggestion
  const enter = pick + 6;
  const tabs = Array.from({ length: s.tabs }, (_, j) => enter + 16 + j * 5);
  searches.push({ ...s, at: t, keys, pick, enter, tabsAt: tabs });
  t = tabs[tabs.length - 1] + 12;
}

// The spiral: searches and tabs pile up faster and faster until the hard cut.
const BROWSER_END = 400;
const endless = { from: Math.round(t), to: BROWSER_END - 4 };
const ENDLESS_QUERIES = 24;
const ENDLESS_TABS = 118;
const span = endless.to - endless.from;
const endlessQueries = Array.from({ length: ENDLESS_QUERIES }, (_, k) => endless.from + span * Math.sqrt(k / ENDLESS_QUERIES));
const endlessTabs = Array.from({ length: ENDLESS_TABS }, (_, k) => Math.round(endless.from + 6 + (span - 8) * Math.sqrt(k / ENDLESS_TABS)));

// Scenes, in frames.
const scenes = {};
let at = 0;
for (const [name, dur] of [
  ["browser", BROWSER_END],
  ["line", 75],
  ["turn", 100],
  ["auth-implementation", 102],
  ["payments-with-dodo", 102],
  ["mobile-first", 102],
  ["deploy-check", 150],
  ["skills", 140],
  ["works", 75],
  ["end", 117],
]) {
  scenes[name] = { from: at, duration: dur };
  at += dur;
}

// Inside a skill beat: headline in, the card, then the wipe that shows the change.
// A beat is one bar (102 frames, about 70 bpm); the wipe lands on beat three.
const BAR = 102;
const beat = { bar: BAR, headlineAt: 3, cardAt: 8, wipeAt: 42, proofAt: 58 };
// Launch night: the question gets typed into the agent, then the verdict streams in.
const deploy = { typeAt: 8, pace: 2.3, text: "is it safe to ship tonight?" };
const deployKeys = keystrokes(deploy.text, deploy.typeAt, deploy.pace);
deploy.keys = deployKeys.keys;
deploy.enter = Math.round(deployKeys.end + 8);
deploy.blockedAt = deploy.enter + 12;
deploy.reasonsAt = [0, 5, 10].map((d) => deploy.blockedAt + 4 + d);
deploy.proofAt = deploy.blockedAt + 16;
// The end card: the install command gets pasted, the way people actually run it, then Enter.
const end = { commandAt: 40, text: "npx skills add tushaarmehtaa/tushar-skills" };
end.enter = end.commandAt + 14;

const out = { fps: FPS, total: at, scenes, searches, endless: { ...endless, queries: endlessQueries, tabs: endlessTabs }, beat, deploy, end };
writeFileSync(new URL("../src/schedule.json", import.meta.url), JSON.stringify(out, null, 1));
console.log(`total ${at} frames (${(at / FPS).toFixed(1)}s), searches end ${endless.from}, endless ${span} frames`);
