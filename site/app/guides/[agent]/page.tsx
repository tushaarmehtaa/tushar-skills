import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CommandLine } from "@/components/command-line";
import { GuideLayout, GuideSection } from "@/components/guide-layout";
import { RuntimeLogo } from "@/components/runtime-logo";
import { TrackedLink } from "@/components/tracked-link";
import {
  AGENTS,
  AGENT_IDS,
  generateInstallCommand,
  generateRemoveCommand,
  generateUpdateCommand,
  invocationFor,
} from "@/lib/agents";
import type { AgentId } from "@/lib/catalog";

const EXAMPLE_SKILL = "remove-ai-slop";

const LIMITATIONS: Record<AgentId, readonly string[]> = {
  "claude-code": [
    "Tool use still follows your Claude Code permission settings; installing a skill does not grant silent shell or network access.",
    "The agent-instructions skill can maintain CLAUDE.md alongside shared or runtime-specific project instructions.",
    "Claude app uploads are a separate chat surface and do not replace local project execution.",
  ],
  codex: [
    "Tool availability and approvals depend on the Codex environment. A skill can request a capability but cannot grant it.",
    "A skill can be disabled in ~/.codex/config.toml if you need to keep it installed but out of discovery.",
    "OpenAI recommends plugins for reusable distribution. Slashskills v1 intentionally uses direct local Agent Skills instead of plugin packaging.",
  ],
  cursor: [
    "Agent Skills require Cursor 2.4 or newer. Use Agent mode when a workflow needs files, commands, or browser tools.",
    "A skill can describe required tools but cannot bypass Cursor approvals or workspace trust.",
    "Cursor also supports .cursor/skills and compatibility locations, but the generated Slashskills installer currently targets the shared .agents/skills path.",
  ],
};

export function generateStaticParams() {
  return AGENT_IDS.map((agent) => ({ agent }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agent: string }>;
}): Promise<Metadata> {
  const { agent: agentParam } = await params;
  if (!(agentParam in AGENTS)) return {};
  const agent = AGENTS[agentParam as AgentId];
  return {
    title: `${agent.label} Agent Skills guide`,
    description: `Install, invoke, update, and remove slashskills in ${agent.label}.`,
    alternates: { canonical: agent.guideRoute },
    openGraph: {
      title: `${agent.label} Agent Skills guide — slashskills`,
      description: `Install, invoke, update, and remove slashskills in ${agent.label}.`,
      url: agent.guideRoute,
    },
  };
}

export default async function CodingAgentGuide({
  params,
}: {
  params: Promise<{ agent: string }>;
}) {
  const { agent: agentParam } = await params;
  if (!(agentParam in AGENTS)) notFound();
  const agentId = agentParam as AgentId;
  const agent = AGENTS[agentId];
  const oneGlobal = generateInstallCommand({ skill: EXAMPLE_SKILL, agent: agentId });
  const allGlobal = generateInstallCommand({ agent: agentId });
  const oneProject = generateInstallCommand({ skill: EXAMPLE_SKILL, agent: agentId, scope: "project" });

  return (
    <GuideLayout
      title={agent.label}
      intro={`Install, invoke, update, and remove Agent Skills in ${agent.label}.`}
      mark={<RuntimeLogo runtime={agentId} decorative className="h-7 w-7 sm:h-9 sm:w-9" />}
    >
      <GuideSection number="01" title="Install one skill or the full library">
        <p>Install one workflow globally:</p>
        <CommandLine command={oneGlobal} agent={agentId} skill={EXAMPLE_SKILL} trackInstall />
        <p>Or install every catalog skill globally:</p>
        <CommandLine command={allGlobal} agent={agentId} skill="all" trackInstall />
      </GuideSection>

      <GuideSection number="02" title="Choose global or project scope">
        <p>
          Global skills are available across projects from <code className="text-[var(--color-heading)]">{agent.globalDirectory}</code>. Project skills live in <code className="text-[var(--color-heading)]">{agent.projectDirectory}</code> and can be reviewed with the repository.
        </p>
        <p>
          These are the runtime-facing destinations observed from the generated <code className="text-[var(--color-heading)]">npx skills</code> commands: {agent.installVerification}
        </p>
        <p>Omit <code className="text-[var(--color-heading)]">-g</code> for project scope:</p>
        <CommandLine command={oneProject} agent={agentId} skill={EXAMPLE_SKILL} trackInstall />
      </GuideSection>

      <GuideSection number="03" title="Invoke the workflow">
        <p>
          Explicit invocation: <code className="text-[var(--color-accent)]">{invocationFor(agentId, EXAMPLE_SKILL)}</code>
        </p>
        <p>
          Natural-language requests can also trigger a skill when its description matches. Use explicit invocation when you want deterministic selection.
        </p>
      </GuideSection>

      <GuideSection number="04" title="Update and remove">
        <p>Update the global copy:</p>
        <CommandLine command={generateUpdateCommand(EXAMPLE_SKILL)} agent={agentId} skill={EXAMPLE_SKILL} />
        <p>Remove it only from {agent.label}:</p>
        <CommandLine command={generateRemoveCommand(EXAMPLE_SKILL, agentId)} agent={agentId} skill={EXAMPLE_SKILL} />
      </GuideSection>

      <GuideSection number="05" title="Reload after changes">
        <p>{agent.reload}</p>
        <p>
          If discovery still looks stale, verify the folder contains <code className="text-[var(--color-heading)]">SKILL.md</code> at its top level before restarting the runtime.
        </p>
      </GuideSection>

      <GuideSection number="06" title="Known runtime limits">
        <ul className="space-y-2 pl-4">
          {LIMITATIONS[agentId].map((limitation) => (
            <li key={limitation} className="list-disc marker:text-[var(--color-accent)]">{limitation}</li>
          ))}
        </ul>
        <TrackedLink
          href={agent.officialDocsUrl}
          eventName="guide_open"
          agent={agentId}
          skill="all"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <RuntimeLogo runtime={agentId} decorative className="h-3.5 w-3.5" />
          <span translate="no">Official {agent.label} skill docs ↗</span>
        </TrackedLink>
      </GuideSection>
    </GuideLayout>
  );
}
