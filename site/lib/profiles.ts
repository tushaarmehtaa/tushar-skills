import profiles from "./skill-profiles.json";
import history from "./skill-history.json";
import proof from "./skill-proof.json";
import results from "./skill-results.json";

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
  images?: { before: string; after: string; caption: string; wide?: boolean; alt?: { before: string; after: string } };
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

type Tone = "good" | "bad" | "open" | "warn";

export interface SkillResult {
  ask: string;
  type: "findings" | "verdict" | "built" | "rewrite" | "screenshots";
  headline: string;
  bars?: { label: string; rows: { label: string; value: number; display: string; tone?: Tone }[] };
  stats?: { value: string; label: string }[];
  notes?: { tone: Tone; title: string; text: string }[];
  verdict?: { label: string; tone: Tone };
  reasons?: { tone: Tone; title: string; text?: string }[];
  groups?: { title: string; rows: { label: string; value: string }[] }[];
  chips?: string[];
  rewrite?: { beforeTitle?: string; before: string; afterTitle?: string; after: string; cut?: string[]; note?: string };
}

export interface SkillHistory {
  added: string;
  updated: string;
  changes: number;
}

const PROFILES = profiles.skills as Record<string, SkillProfile>;
const PROOF = proof as Record<string, SkillProof>;
const HISTORY = history as Record<string, SkillHistory>;
const RESULTS = results as Record<string, SkillResult>;

export const GROUP_ORDER = profiles.groupOrder as Record<GroupId, string[]>;

export function getProfile(slug: string): SkillProfile {
  const profile = PROFILES[slug];
  if (!profile) throw new Error(`Missing skill profile: ${slug}`);
  return profile;
}

export function getProof(slug: string): SkillProof | null {
  return PROOF[slug] ?? null;
}

export function getResult(slug: string): SkillResult | null {
  return RESULTS[slug] ?? null;
}

export function getHistory(slug: string): SkillHistory | null {
  return HISTORY[slug] ?? null;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
