import {
  AGENTS,
  AGENT_IDS,
  CAPABILITY_LABELS,
  generateInstallCommand,
  invocationFor,
} from "./agents.ts";
import {
  supportsClaudeApp,
  type AgentId,
  type Capability,
  type SupportStatus,
  type Surface,
} from "./catalog.ts";

export interface AgentPanelViewModel {
  id: AgentId;
  tabId: string;
  panelId: string;
  label: string;
  globalDirectory: string;
  guideRoute: string;
  officialDocsUrl: string;
  install: {
    visible: boolean;
    command: string | null;
  };
  invocation: string;
  capabilitySection: {
    visible: boolean;
    label: string;
    items: readonly {
      id: Capability;
      label: string;
    }[];
  };
  unsupportedMessage: string | null;
}

export function createAgentPanelViewModel({
  slug,
  agentId,
  support,
  capabilities,
}: {
  slug: string;
  agentId: AgentId;
  support: Record<AgentId, SupportStatus>;
  capabilities: readonly Capability[];
}): AgentPanelViewModel {
  const agent = AGENTS[agentId];
  const status = support[agentId];
  const canInstall = status !== "unsupported";

  return {
    id: agentId,
    tabId: `agent-tab-${agentId}`,
    panelId: `agent-panel-${agentId}`,
    label: agent.label,
    globalDirectory: agent.globalDirectory,
    guideRoute: agent.guideRoute,
    officialDocsUrl: agent.officialDocsUrl,
    install: {
      visible: canInstall,
      command: canInstall ? generateInstallCommand({ skill: slug, agent: agentId }) : null,
    },
    invocation: invocationFor(agentId, slug),
    capabilitySection: {
      visible: capabilities.length > 0,
      label: "required access",
      items: capabilities.map((capability) => ({
        id: capability,
        label: CAPABILITY_LABELS[capability],
      })),
    },
    unsupportedMessage: canInstall
      ? null
      : `${slug} does not offer an install path for ${agent.label}.`,
  };
}

export function createAgentPanelViewModels({
  slug,
  support,
  capabilities,
}: {
  slug: string;
  support: Record<AgentId, SupportStatus>;
  capabilities: readonly Capability[];
}): AgentPanelViewModel[] {
  return AGENT_IDS.map((agentId) =>
    createAgentPanelViewModel({ slug, agentId, support, capabilities }),
  );
}

export interface ClaudeAppViewModel {
  available: boolean;
  state: "available" | "unavailable";
  heading: string;
  description: string;
  downloadLabel: string;
  analyticsAgent: "claude-app" | "inspection";
  showUploadInstructions: boolean;
}

export function createClaudeAppViewModel(
  {
    surfaces,
    capabilities,
    support,
  }: {
    surfaces: readonly Surface[];
    capabilities: readonly Capability[];
    support: Record<AgentId, SupportStatus>;
  },
): ClaudeAppViewModel {
  const available = supportsClaudeApp(surfaces);

  if (available) {
    return {
      available: true,
      state: "available",
      heading: "Claude app",
      description:
        "This workflow can run in chat using the files and context you provide. Download its complete ZIP, then upload it from Claude's Skills settings.",
      downloadLabel: "↓ download ZIP",
      analyticsAgent: "claude-app",
      showUploadInstructions: true,
    };
  }

  const supportedAgents = AGENT_IDS.filter(
    (agentId) => support[agentId] !== "unsupported",
  );
  const onlySupportedAgent =
    supportedAgents.length === 1 ? AGENTS[supportedAgents[0]] : null;
  const capabilityLabels = capabilities.map(
    (capability) => CAPABILITY_LABELS[capability],
  );
  const accessList = new Intl.ListFormat("en", {
    style: "long",
    type: "conjunction",
  }).format(capabilityLabels);
  const accessRequirement = accessList
    ? ` and requires ${accessList}`
    : "";
  const description = onlySupportedAgent
    ? `This workflow runs only in ${onlySupportedAgent.label}${accessRequirement}. Uploading it to a chat app does not provide equivalent execution.`
    : `This skill requires ${accessList || "a local coding agent"}. Uploading it to a chat app does not provide equivalent execution.`;

  return {
    available: false,
    state: "unavailable",
    heading: onlySupportedAgent
      ? `${onlySupportedAgent.label} required`
      : "local coding agent required",
    description,
    downloadLabel: "↓ download raw ZIP for inspection",
    analyticsAgent: "inspection",
    showUploadInstructions: false,
  };
}
