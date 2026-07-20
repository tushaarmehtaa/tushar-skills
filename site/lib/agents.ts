import type { AgentId, Capability, SupportStatus } from "./catalog.ts";

const REPOSITORY = "tushaarmehtaa/tushar-skills";

export interface AgentDefinition {
  id: AgentId;
  label: string;
  cliTarget: AgentId;
  invocation: string;
  guideRoute: `/guides/${string}`;
  officialDocsUrl: string;
  projectDirectory: string;
  globalDirectory: string;
  reload: string;
}

export const AGENTS = {
  "claude-code": {
    id: "claude-code",
    label: "Claude Code",
    cliTarget: "claude-code",
    invocation: "/<skill>",
    guideRoute: "/guides/claude-code",
    officialDocsUrl: "https://code.claude.com/docs/en/skills",
    projectDirectory: ".claude/skills",
    globalDirectory: "~/.claude/skills",
    reload: "Edits are live. Restart only after adding a new top-level skill directory.",
  },
  codex: {
    id: "codex",
    label: "Codex",
    cliTarget: "codex",
    invocation: "$<skill> or /skills",
    guideRoute: "/guides/codex",
    officialDocsUrl: "https://developers.openai.com/codex/skills",
    projectDirectory: ".agents/skills",
    globalDirectory: "~/.codex/skills",
    reload: "Skills reload automatically; restart Codex if a newly added skill is missing.",
  },
  cursor: {
    id: "cursor",
    label: "Cursor",
    cliTarget: "cursor",
    invocation: "/<skill>",
    guideRoute: "/guides/cursor",
    officialDocsUrl: "https://cursor.com/docs/skills",
    projectDirectory: ".agents/skills",
    globalDirectory: "~/.cursor/skills",
    reload: "Start a new agent conversation if a newly installed skill does not appear.",
  },
} as const satisfies Record<AgentId, AgentDefinition>;

export const AGENT_IDS = Object.keys(AGENTS) as AgentId[];

export type InstallScope = "global" | "project";

export function generateInstallCommand({
  skill,
  agent,
  scope = "global",
}: {
  skill?: string;
  agent?: AgentId;
  scope?: InstallScope;
} = {}): string {
  const parts = ["npx", "skills", "add", REPOSITORY];

  if (skill) parts.push("--skill", skill);
  if (agent) {
    if (scope === "global") parts.push("-g");
    parts.push("-a", AGENTS[agent].cliTarget, "-y");
  }

  return parts.join(" ");
}

export function generateUpdateCommand(skill: string, scope: InstallScope = "global"): string {
  return `npx skills update${scope === "global" ? " -g" : ""} ${skill}`;
}

export function generateRemoveCommand(
  skill: string,
  agent: AgentId,
  scope: InstallScope = "global",
): string {
  return `npx skills remove ${skill}${scope === "global" ? " -g" : ""} -a ${AGENTS[agent].cliTarget} -y`;
}

export function invocationFor(agent: AgentId, skill: string): string {
  return AGENTS[agent].invocation.replace("<skill>", skill);
}

export const SUPPORT_LABELS: Record<SupportStatus, string> = {
  tested: "runtime tested",
  untested: "available to install",
  unsupported: "unsupported",
};

export const CAPABILITY_LABELS: Record<Capability, string> = {
  filesystem: "project files",
  shell: "terminal commands",
  browser: "browser access",
  network: "network access",
  "user-files": "files you provide",
};
