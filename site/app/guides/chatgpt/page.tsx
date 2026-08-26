import Link from "next/link";
import type { Metadata } from "next";
import { GuideLayout, GuideSection } from "@/components/guide-layout";
import { RuntimeLogo } from "@/components/runtime-logo";
import { TrackedLink } from "@/components/tracked-link";
import { getAllSkills } from "@/lib/skills";
import { supportsChatGPT } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "ChatGPT Skills upload guide",
  description: "Use chat-capable slashskills in ChatGPT without conflating ChatGPT Skills, Codex local skills, and plugins.",
  alternates: { canonical: "/guides/chatgpt" },
  openGraph: {
    title: "ChatGPT Skills upload guide — slashskills",
    description: "Use chat-capable slashskills in ChatGPT without conflating ChatGPT Skills, Codex local skills, and plugins.",
    url: "/guides/chatgpt",
  },
};

export default function ChatGPTGuide() {
  const chatSkills = getAllSkills().filter((skill) => supportsChatGPT(skill.surfaces));

  return (
    <GuideLayout
      title="ChatGPT Skills"
      intro="Use chat-capable workflows in ChatGPT with the files and context you provide."
      mark={<RuntimeLogo runtime="chatgpt" decorative className="h-7 w-7 sm:h-9 sm:w-9" />}
    >
      <GuideSection number="01" title="Choose a chat-capable skill">
        <p>These workflows are suitable for a chat-based Skills surface. They do not require your local repository or terminal.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {chatSkills.map((skill) => (
            <Link key={skill.slug} href={`/${skill.slug}`} className="border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-[family-name:var(--font-mono)] text-xs text-[var(--color-text)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-heading)]">
              {skill.name} →
            </Link>
          ))}
        </div>
      </GuideSection>

      <GuideSection number="02" title="Create or upload a Skill">
        <ol className="space-y-2 pl-4">
          <li className="list-decimal marker:text-[var(--color-accent)]">Open <strong className="text-[var(--color-heading)]">Plugins → Skills</strong> in ChatGPT.</li>
          <li className="list-decimal marker:text-[var(--color-accent)]">Choose <strong className="text-[var(--color-heading)]">Create</strong>, then select <strong className="text-[var(--color-heading)]">Upload from your computer</strong>.</li>
          <li className="list-decimal marker:text-[var(--color-accent)]">Follow the uploader&apos;s accepted-file prompt. ChatGPT scans uploaded Skills before they become available.</li>
        </ol>
      </GuideSection>

      <GuideSection number="03" title="Do not reuse a Claude upload archive blindly">
        <p>Claude and ChatGPT both support Skills, but their public upload documentation does not promise the same archive format. A Claude-formatted ZIP is not presented here as a supported ChatGPT upload.</p>
        <p>Codex local skills and Plugins are separate product surfaces. A plugin can include Skills, but a Skill is not automatically a plugin.</p>
      </GuideSection>

      <GuideSection number="04" title="Understand workspace controls">
        <p>Personal Skills are available in supported ChatGPT Business, Enterprise, Healthcare, and Edu workspaces. Enterprise and Edu administrators may need to enable Skills before members can create, upload, or install them.</p>
        <TrackedLink href="https://help.openai.com/en/articles/20001066-skills-in-chatgpt" eventName="guide_open" agent="chatgpt" skill="all" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]">
          <RuntimeLogo runtime="chatgpt" decorative className="h-3.5 w-3.5" />
          <span>Official ChatGPT Skills guide ↗</span>
        </TrackedLink>
      </GuideSection>
    </GuideLayout>
  );
}
