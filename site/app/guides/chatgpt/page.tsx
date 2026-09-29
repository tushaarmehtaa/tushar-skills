import Link from "next/link";
import type { Metadata } from "next";
import { GuideLayout, GuideSection } from "@/components/guide-layout";
import { RuntimeLogo } from "@/components/runtime-logo";
import { TrackedLink } from "@/components/tracked-link";
import { getAllSkills } from "@/lib/skills";
import { supportsChatGPT } from "@/lib/catalog";
import { GuideCode } from "@/components/guide-code";

export const metadata: Metadata = {
  title: "ChatGPT Skills and plugin packaging guide",
  description: "Choose a ChatGPT skill, upload it, or package a reusable workflow as a plugin with a checked decision-doc example and sharing guidance.",
  alternates: { canonical: "/guides/chatgpt" },
  openGraph: {
    title: "ChatGPT Skills and plugin packaging guide — slashskills",
    description: "Choose a ChatGPT skill, upload it, or package a reusable workflow as a plugin with a checked decision-doc example and sharing guidance.",
    url: "/guides/chatgpt",
  },
};

export default function ChatGPTGuide() {
  const chatSkills = getAllSkills().filter((skill) => supportsChatGPT(skill.surfaces));

  return (
    <GuideLayout
      title="ChatGPT Skills and plugins"
      intro="Choose a workflow for the context you provide, then upload it as a Skill or package it as a plugin to share."
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

      <GuideSection number="05" title="Package a workflow as a plugin">
        <p>A skill can be distributed inside a plugin with its instructions and supporting files. For a workflow that uses only supplied context, start with a skill-only package. Add an MCP server when the workflow needs connected data or controlled actions.</p>
        <p>The portable package has a root <code>plugin.json</code> and a <code>skills/</code> directory. Here is a minimal manifest for our <Link href="/decision-doc" className="text-[var(--color-accent)] underline underline-offset-4">decision-doc workflow</Link>:</p>
        <div className="guide-prose">
        <GuideCode language="json" html={`{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "slashskills-decision-doc",
  "version": "0.1.0",
  "description": "Write a decision record from supplied context."
}`} />
        </div>
        <p>Place the complete decision-doc package at <code>skills/decision-doc/</code>, keeping <code>SKILL.md</code> and its supporting files together. We built and checked this layout locally; installation and activation in ChatGPT remain untested.</p>
        <GuideCode language="text" html={`slashskills-decision-doc/
├── plugin.json
├── LICENSE
└── skills/
    └── decision-doc/
        └── SKILL.md`} />
        <p>Use our <a href="https://github.com/tushaarmehtaa/tushar-skills/tree/main/workspace/seo-newsroom/experiments/devday-skill-plugin" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline underline-offset-4">package builder and three-case test fixture ↗</a> to reproduce the package from the original skill.</p>
        <p><a href="https://developers.openai.com/plugins/build/plugins" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline underline-offset-4">Follow OpenAI&apos;s packaging and local-testing instructions ↗</a> to add the package to a local marketplace and test it in a new session. Check direct invocation, an indirect request, and missing evidence before sharing it.</p>
      </GuideSection>

      <GuideSection number="06" title="Choose how to share it">
        <p>Share an individual Skill with people or groups in your workspace from its Skills menu. Use a local or repository marketplace to test a plugin bundle. Workspace plugin publishing requires an administrator; public directory submission is a separate review process.</p>
        <p>A workspace share does not make a package publicly installable. Confirm the recipient&apos;s access and test the installed copy before treating it as available to your team.</p>
        <p className="text-[var(--color-muted)]">Packaging guidance checked September 29, 2026. <a href="https://developers.openai.com/plugins/build/skills" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] underline underline-offset-4">Official skill authoring documentation ↗</a></p>
      </GuideSection>
    </GuideLayout>
  );
}
