"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";
import {
  AGENTS,
  AGENT_IDS,
  generateInstallCommand,
  type InstallScope,
} from "@/lib/agents";
import type { AgentId } from "@/lib/catalog";

export function InteractiveInstaller({
  skills,
}: {
  skills: readonly { slug: string; name: string }[];
}) {
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentId | "">("codex");
  const [selectedScope, setSelectedScope] = useState<InstallScope | "">("");
  const allSkillsCommand = generateInstallCommand();
  const canGenerateCommand = selectedAgent !== "" && selectedScope !== "";
  const command = canGenerateCommand
    ? generateInstallCommand({
        skill: selectedSkill || undefined,
        agent: selectedAgent,
        scope: selectedScope,
      })
    : null;

  return (
    <section className="terminal-panel install-box overflow-hidden" aria-labelledby="installer-heading">
      <div className="border-b border-[var(--color-border)] px-4 py-3">
        <h2 id="installer-heading" className="text-sm font-medium text-[var(--color-heading)]">
          Install
        </h2>
      </div>
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3 font-[family-name:var(--font-mono)] text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:text-sm">
        <span className="select-none text-[var(--color-accent)]">$</span>
        <code className="min-w-0 break-all leading-relaxed text-[var(--color-heading)]">{allSkillsCommand}</code>
        <CopyButton
          text={allSkillsCommand}
          label="Copy all skills"
          className="col-start-2 w-fit shrink-0 sm:col-start-auto"
          analytics={{ name: "install_copy", properties: { agent: "all", skill: "all" } }}
        />
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_10rem_9rem] sm:items-end">
        <label className="block min-w-0">
          <span className="mb-2 block text-xs text-[var(--color-muted)]">Package</span>
          <select
            value={selectedSkill}
            onChange={(event) => setSelectedSkill(event.target.value)}
            className="min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 text-xs text-[var(--color-heading)] outline-none"
          >
            <option value="">All skills</option>
            {skills.map((skill) => (
              <option key={skill.slug} value={skill.slug}>{skill.name}</option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-2 block text-xs text-[var(--color-muted)]">Runtime</span>
          <select
            value={selectedAgent}
            onChange={(event) => setSelectedAgent(event.target.value as AgentId | "")}
            className="min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 text-xs text-[var(--color-heading)] outline-none"
          >
            <option value="">Choose runtime</option>
            {AGENT_IDS.map((agentId) => (
              <option key={agentId} value={agentId}>
                {AGENTS[agentId].label}{agentId === "codex" ? " (default)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0">
          <span className="mb-2 block text-xs text-[var(--color-muted)]">Scope</span>
          <select
            value={selectedScope}
            onChange={(event) => setSelectedScope(event.target.value as InstallScope | "")}
            className="min-h-11 w-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-2 text-xs text-[var(--color-heading)] outline-none"
          >
            <option value="">Choose scope</option>
            <option value="global">Global</option>
            <option value="project">Project</option>
          </select>
        </label>
      </div>
      <div className="border-t border-[var(--color-border)] p-4">
        {command ? (
          <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 font-[family-name:var(--font-mono)] text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:text-sm">
            <span className="select-none text-[var(--color-accent)]">$</span>
            <code className="min-w-0 break-all leading-relaxed text-[var(--color-heading)]">{command}</code>
            <CopyButton
              text={command}
              label="Copy install command"
              className="col-start-2 w-fit shrink-0 sm:col-start-auto"
              analytics={{
                name: "install_copy",
                properties: { agent: selectedAgent, skill: selectedSkill || "all" },
              }}
            />
          </div>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">Choose a runtime and scope to generate an install command.</p>
        )}
      </div>
    </section>
  );
}
