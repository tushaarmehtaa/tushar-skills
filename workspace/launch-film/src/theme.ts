import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import schedule from "./schedule.json";

const sans = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const S = schedule;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The site's own tokens, so the film and slashskills.xyz read as one thing.
export const C = {
  bg: "#FFFFFF",
  surface: "#F5F7F5",
  ink: "#17191C",
  text: "#60646C",
  line: "#DCDDE1",
  accent: "#345847",
  accentDim: "#EEF3EF",
  red: "#B3402A",
  redDim: "#F6E3DD",
  term: "#101112",
  termInk: "#E9ECE8",
  termDim: "#7E8580",
  termGreen: "#86BC9F",
};

export const F = {
  sans: `${sans.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
  mono: `${mono.fontFamily}, ui-monospace, Menlo, monospace`,
  // Google and Chrome chrome, drawn in their own type so act 1 reads as the real thing.
  google: "Arial, Helvetica, sans-serif",
  system: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
};

export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
