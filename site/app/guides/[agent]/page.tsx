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

const CURSOR_SOURCES = {
  skills: "https://cursor.com/docs/skills",
  prompting: "https://cursor.com/docs/agent/prompting",
  rules: "https://cursor.com/docs/rules",
  plugins: "https://cursor.com/docs/plugins",
  specification: "https://agentskills.io/specification",
} as const;

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
  const agentId = agentParam as AgentId;
  const agent = AGENTS[agentId];
  const title = agentId === "cursor"
    ? "How to install and use Cursor Agent Skills"
    : `${agent.label} Agent Skills guide`;
  const description = agentId === "cursor"
    ? "Install Cursor Agent Skills, choose project or global scope, invoke a skill once or keep it active as a Custom Mode, and understand skills versus rules."
    : `Install, invoke, update, and remove slashskills in ${agent.label}.`;
  return {
    title,
    description,
    alternates: { canonical: agent.guideRoute },
    openGraph: {
      title: `${title} — slashskills`,
      description,
      url: agent.guideRoute,
    },
  };
}

function GuideSourceLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <TrackedLink
      href={href}
      eventName="guide_open"
      agent="cursor"
      skill="all"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-accent)] underline decoration-[var(--color-border)] underline-offset-4 hover:text-[var(--color-heading)]"
    >
      {children}
    </TrackedLink>
  );
}

function CursorGuideSections() {
  return (
    <>
      <GuideSection number="04" title="Keep a skill active with Custom Mode">
        <p>
          A slash-menu invocation attaches the skill to one message. For a workflow that should guide the whole session, select the skill and choose <strong className="font-medium text-[var(--color-heading)]">Use as Mode</strong>.
        </p>
        <p>
          The shortcut is <code className="text-[var(--color-heading)]">Option+Enter</code> on Mac or <code className="text-[var(--color-heading)]">Alt+Enter</code> on Windows. Cursor keeps the skill in context until you leave the mode.
        </p>
        <p>
          Use one-message invocation for a bounded task. Use Custom Mode for a working method—such as TDD, code review, or UI polish—that should survive every turn of a longer feature.
        </p>
        <p>
          Cursor documents Custom Modes for both the Agents Window and CLI in its <GuideSourceLink href={CURSOR_SOURCES.prompting}>prompting guide</GuideSourceLink>.
        </p>
      </GuideSection>

      <GuideSection number="05" title="Choose a skill, rule, command, or plugin">
        <p>These tools overlap, but they solve different jobs. Pick the smallest mechanism that matches how the instruction should load.</p>
        <p className="text-xs text-[var(--color-muted)] sm:hidden">Swipe horizontally to compare all three columns.</p>
        <div
          role="region"
          aria-label="Cursor workflow mechanism comparison"
          tabIndex={0}
          className="overflow-x-auto border border-[var(--color-border)]"
        >
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <thead className="bg-[var(--color-surface)] text-[var(--color-heading)]">
              <tr>
                <th className="px-4 py-3 font-medium">Use</th>
                <th className="px-4 py-3 font-medium">Best for</th>
                <th className="px-4 py-3 font-medium">How it loads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--color-heading)]">Skill</th>
                <td className="px-4 py-3">Portable, multi-step knowledge or a workflow with scripts and references.</td>
                <td className="px-4 py-3">Agent selects it by relevance, or you invoke it with <code>/skill-name</code>.</td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--color-heading)]">Rule</th>
                <td className="px-4 py-3">Project constraints such as code style, architecture, or file-specific guidance.</td>
                <td className="px-4 py-3">Always, by relevance, by file pattern, or when you <code>@</code>-mention it.</td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--color-heading)]">Command</th>
                <td className="px-4 py-3">A Cursor-specific prompt or action that should run only when requested.</td>
                <td className="px-4 py-3">Explicitly from the <code>/</code> menu.</td>
              </tr>
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--color-heading)]">Plugin</th>
                <td className="px-4 py-3">Distribution that bundles skills with MCP servers, rules, hooks, or other components.</td>
                <td className="px-4 py-3">Installed through Customize or a team marketplace.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Slashskills installs direct Agent Skills. Use <GuideSourceLink href={CURSOR_SOURCES.rules}>Cursor Rules</GuideSourceLink> for persistent project constraints and <GuideSourceLink href={CURSOR_SOURCES.plugins}>plugins</GuideSourceLink> when the package needs more than a skill.
        </p>
      </GuideSection>

      <GuideSection number="06" title="Keep portable fields separate from Cursor extensions">
        <p>
          The open Agent Skills format defines <code>name</code>, <code>description</code>, <code>license</code>, <code>compatibility</code>, <code>metadata</code>, and experimental <code>allowed-tools</code>.
        </p>
        <p>
          Cursor additionally accepts <code>paths</code>, <code>disable-model-invocation</code>, <code>icon</code>, and <code>color</code>. Those fields can improve Cursor behavior, but another runtime may ignore or reject them.
        </p>
        <p>
          Keep the shared <code>SKILL.md</code> on the portable core unless the package is intentionally Cursor-only. Compare Cursor's <GuideSourceLink href={CURSOR_SOURCES.skills}>skill reference</GuideSourceLink> with the <GuideSourceLink href={CURSOR_SOURCES.specification}>open specification</GuideSourceLink> before adding extensions.
        </p>
        <p>
          Building a new portable workflow? Start with the <TrackedLink href="/skill-creator" eventName="guide_open" agent="cursor" skill="skill-creator" className="text-[var(--color-accent)] underline decoration-[var(--color-border)] underline-offset-4 hover:text-[var(--color-heading)]">skill-creator package</TrackedLink> and verify runtime differences on <TrackedLink href="/compatibility" eventName="guide_open" agent="cursor" skill="all" className="text-[var(--color-accent)] underline decoration-[var(--color-border)] underline-offset-4 hover:text-[var(--color-heading)]">compatibility</TrackedLink>.
        </p>
      </GuideSection>
    </>
  );
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
      title={agentId === "cursor" ? "Cursor Agent Skills" : agent.label}
      intro={agentId === "cursor"
        ? "Install Cursor skills, choose the right scope, invoke a workflow once or keep it active for a full session, and know when a rule or command fits better."
        : `Install, invoke, update, and remove Agent Skills in ${agent.label}.`}
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
        {agentId === "cursor" ? (
          <>
            <p>
              Cursor also reads project skills from <code>.cursor/skills</code> and global skills from <code>~/.cursor/skills</code>. Slashskills uses <code>.agents/skills</code> so the same package can serve multiple compatible runtimes.
            </p>
            <p>
              Local global skills are not copied to Cloud Agents, remote SSH sessions, or managed workers. Commit a project-scoped skill to the repository when remote agents need it.
            </p>
          </>
        ) : null}
      </GuideSection>

      <GuideSection number="03" title="Invoke the workflow">
        <p>
          Explicit invocation: <code className="text-[var(--color-accent)]">{invocationFor(agentId, EXAMPLE_SKILL)}</code>
        </p>
        <p>
          Natural-language requests can also trigger a skill when its description matches. Use explicit invocation when you want deterministic selection.
        </p>
      </GuideSection>

      {agentId === "cursor" ? <CursorGuideSections /> : null}

      <GuideSection number={agentId === "cursor" ? "07" : "04"} title="Update and remove">
        <p>Update the global copy:</p>
        <CommandLine command={generateUpdateCommand(EXAMPLE_SKILL)} agent={agentId} skill={EXAMPLE_SKILL} />
        <p>Remove it only from {agent.label}:</p>
        <CommandLine command={generateRemoveCommand(EXAMPLE_SKILL, agentId)} agent={agentId} skill={EXAMPLE_SKILL} />
      </GuideSection>

      <GuideSection number={agentId === "cursor" ? "08" : "05"} title="Reload after changes">
        <p>{agent.reload}</p>
        <p>
          If discovery still looks stale, verify the folder contains <code className="text-[var(--color-heading)]">SKILL.md</code> at its top level before restarting the runtime.
        </p>
      </GuideSection>

      <GuideSection number={agentId === "cursor" ? "09" : "06"} title="Known runtime limits">
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
        {agentId === "cursor" ? (
          <p>
            Primary references: <GuideSourceLink href={CURSOR_SOURCES.skills}>Agent Skills</GuideSourceLink>, <GuideSourceLink href={CURSOR_SOURCES.prompting}>Custom Modes</GuideSourceLink>, <GuideSourceLink href={CURSOR_SOURCES.rules}>Rules</GuideSourceLink>, and the <GuideSourceLink href={CURSOR_SOURCES.specification}>Agent Skills specification</GuideSourceLink>.
          </p>
        ) : null}
      </GuideSection>
    </GuideLayout>
  );
}
