// Render a handful of frames to out/stills for review. usage: node scripts/stills.mjs 30 120 400 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: new URL("../src/index.ts", import.meta.url).pathname });
const composition = await selectComposition({ serveUrl, id: "LaunchWeek" });
mkdirSync("out/stills", { recursive: true });
for (const frame of frames) {
  try { await renderStill({ serveUrl, composition, frame, output: `out/stills/${String(frame).padStart(4, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 85 });
  console.log("frame", frame); } catch (e) { console.log("FAIL", frame, String(e.message).slice(0, 400)); }
}
