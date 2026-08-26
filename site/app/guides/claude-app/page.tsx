import Link from "next/link";
import type { Metadata } from "next";
import { GuideLayout, GuideSection } from "@/components/guide-layout";
import { RuntimeLogo } from "@/components/runtime-logo";
import { TrackedLink } from "@/components/tracked-link";
import { getAllSkills } from "@/lib/skills";
import { supportsClaudeApp } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Claude app skill upload guide",
  description: "Use chat-capable slashskills in the Claude web, desktop, or mobile app without confusing them with local coding workflows.",
  alternates: { canonical: "/guides/claude-app" },
  openGraph: {
    title: "Claude app skill upload guide — slashskills",
    description: "Use chat-capable slashskills in the Claude web, desktop, or mobile app without confusing them with local coding workflows.",
    url: "/guides/claude-app",
  },
};

export default function ClaudeAppGuide() {
  const chatSkills = getAllSkills().filter((skill) => supportsClaudeApp(skill.surfaces));

  return (
    <GuideLayout
      title="Claude app"
      intro="Use chat-capable skills with conversation context and uploaded files."
      mark={<RuntimeLogo runtime="claude-app" decorative className="h-7 w-7 sm:h-9 sm:w-9" />}
    >
      <GuideSection number="01" title="Choose a chat-capable skill">
        <p>The skills below can run in the Claude app.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {chatSkills.map((skill) => (
            <Link
              key={skill.slug}
              href={`/${skill.slug}`}
              className="border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-heading)]"
            >
              {skill.name} →
            </Link>
          ))}
        </div>
      </GuideSection>

      <GuideSection number="02" title="Prepare the Claude upload archive">
        <p>Use the Claude-specific ZIP from a chat-capable skill page. Claude documents an archive with one named skill folder containing lowercase <code className="text-[var(--color-heading)]">skill.md</code> and its bundled resources.</p>
      </GuideSection>

      <GuideSection number="03" title="Upload and enable it">
        <ol className="space-y-2 pl-4">
          <li className="list-decimal marker:text-[var(--color-accent)]">Enable code execution and file creation in Claude Settings → Capabilities if it is not already available.</li>
          <li className="list-decimal marker:text-[var(--color-accent)]">Open <strong className="text-[var(--color-heading)]">Customize → Skills → + Create skill</strong>.</li>
          <li className="list-decimal marker:text-[var(--color-accent)]">Choose <strong className="text-[var(--color-heading)]">Upload a skill</strong>, then select the Claude ZIP.</li>
          <li className="list-decimal marker:text-[var(--color-accent)]">Toggle the installed skill on, then ask for the workflow naturally and provide any source files it needs.</li>
        </ol>
      </GuideSection>

      <GuideSection number="04" title="Understand the boundary">
        <p>
          Claude app can work with conversation context and uploaded files. It does not gain your repository, terminal, local browser, credentials, or deployment environment from a skill upload.
        </p>
        <p>
          Skills without Claude app support still expose a raw ZIP for inspection, but intentionally hide upload instructions and name any runtime-specific requirement on their detail page.
        </p>
        <TrackedLink
          href="https://support.claude.com/en/articles/12512180-use-skills-in-claude"
          eventName="guide_open"
          agent="claude-app"
          skill="all"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <RuntimeLogo runtime="claude-app" decorative className="h-3.5 w-3.5" />
          <span translate="no">Official Claude Skills guide ↗</span>
        </TrackedLink>
      </GuideSection>
    </GuideLayout>
  );
}
