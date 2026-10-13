import icons from "./skill-icons.json";
import type { GroupId } from "./profiles";

export type Agent = "claude-code" | "codex" | "cursor";

export interface BrandSkill {
  slug: string;
  group: GroupId;
  flow: string;
  outcome: string;
  installs: number;
  isNew: boolean;
  popular: boolean;
  /** Also works in the Claude app (chat), not only in a coding agent. */
  chat: boolean;
  /** Lower-case description, tags and category, for search. */
  keywords: string;
}

export const SKILL_ICONS = icons as Record<string, { vb: string; svg: string }>;

export const AGENT_TABS: { id: Agent; label: string }[] = [
  { id: "claude-code", label: "Claude Code" },
  { id: "codex", label: "Codex" },
  { id: "cursor", label: "Cursor" },
];
