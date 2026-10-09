import profiles from "./skill-profiles.json";
import history from "./skill-history.json";
import proof from "./skill-proof.json";

export type GroupId = "shape" | "build" | "ship" | "grow";

export const GROUPS: Record<GroupId, { label: string; purpose: string }> = {
  shape: { label: "Shape", purpose: "Decide what to make before you make it." },
  build: { label: "Build", purpose: "Wire the parts every product needs." },
  ship: { label: "Ship", purpose: "Get a release out and keep it healthy." },
  grow: { label: "Grow", purpose: "Find people, earn trust, and learn what works." },
};

export const GROUP_IDS = Object.keys(GROUPS) as GroupId[];

export interface SkillProfile {
  group: GroupId;
  outcome: string;
  useWhen: string;
  skipWhen: string;
  why: string;
  next: string | null;
  outputContract: string;
  outputSource: string;
  proofTier: "run" | "contract";
  checks: string[];
}

export interface ProofSide {
  label: string;
  text?: string;
  image?: string;
}

export interface SkillProof {
  request: string;
  summary: string;
  excerpt: string[];
  table?: { head: string[]; rows: string[][] };
  images?: { before: string; after: string; caption: string };
  pair?: {
    kind: "screenshots" | "text" | "code" | "data";
    before: ProofSide;
    after: ProofSide;
  };
  run: {
    agent: string;
    version: string;
    date: string;
    durationSec: number;
    triggered: "auto" | "explicit";
    filesChanged: number | null;
  };
  caveat?: string;
  still?: string;
}

export interface SkillHistory {
  added: string;
  updated: string;
  changes: number;
}

const PROFILES = profiles.skills as Record<string, SkillProfile>;
const PROOF = proof as Record<string, SkillProof>;
const HISTORY = history as Record<string, SkillHistory>;

export const GROUP_ORDER = profiles.groupOrder as Record<GroupId, string[]>;

export function getProfile(slug: string): SkillProfile {
  const profile = PROFILES[slug];
  if (!profile) throw new Error(`Missing skill profile: ${slug}`);
  return profile;
}

export function getProof(slug: string): SkillProof | null {
  return PROOF[slug] ?? null;
}

export function getHistory(slug: string): SkillHistory | null {
  return HISTORY[slug] ?? null;
}

/** "Use when x" → "Use it when x", matching how the page speaks to the reader. */
export function speak(line: string): string {
  return line.replace(/^Use when\b/, "Use it when").replace(/^Skip when\b/, "Skip it when");
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
