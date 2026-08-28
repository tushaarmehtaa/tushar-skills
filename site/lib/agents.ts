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
  installVerification: string;
  reload: string;
}

export const AGENTS = {
  codex: {
    id: "codex",
    label: "Codex",
    cliTarget: "codex",
    invocation: "$<skill> or /skills",
    guideRoute: "/guides/codex",
    officialDocsUrl: "https://learn.chatgpt.com/docs/build-skills",
    projectDirectory: ".agents/skills",
    globalDirectory: "~/.agents/skills",
    installVerification: "skills CLI 1.5.23 installed the project and global package into the shared .agents/skills location on August 28, 2026.",
    reload: "Codex detects skill changes and newly installed skills automatically. Restart Codex only if an update does not appear.",
  },
  "claude-code": {
    id: "claude-code",
    label: "Claude Code",
    cliTarget: "claude-code",
    invocation: "/<skill>",
    guideRoute: "/guides/claude-code",
    officialDocsUrl: "https://code.claude.com/docs/en/skills",
    projectDirectory: ".claude/skills",
    globalDirectory: "~/.claude/skills",
    installVerification: "skills CLI 1.5.23 installed the project and global runtime copy into .claude/skills on August 28, 2026.",
    reload: "Claude Code detects changes within the current session. Restart only if the top-level skills directory did not exist when the session started.",
  },
  cursor: {
    id: "cursor",
    label: "Cursor",
    cliTarget: "cursor",
    invocation: "/<skill>",
    guideRoute: "/guides/cursor",
    officialDocsUrl: "https://cursor.com/docs/skills",
    projectDirectory: ".agents/skills",
    globalDirectory: "~/.agents/skills",
    installVerification: "skills CLI 1.5.23 installed the project and global package into the shared .agents/skills location on August 28, 2026.",
    reload: "Cursor discovers skills when Agent starts. Start a new Agent conversation if a newly installed skill does not appear.",
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
