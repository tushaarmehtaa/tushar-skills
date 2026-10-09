"use client";
import { Fragment, useId, useRef, useState, type KeyboardEvent } from "react";
import { CopyButton } from "./copy-button";
import { RuntimeLogo } from "./runtime-logo";
import { TrackedLink } from "./tracked-link";
import {
  AGENTS,
  AGENT_IDS,
  CAPABILITY_LABELS,
  generateInstallCommand,
  invocationFor,
  type InstallScope,
} from "@/lib/agents";
import type { AgentId, Capability, SupportStatus } from "@/lib/catalog";
export function AgentTabs({
  slug,
  support,
  capabilities,
}: {
  slug: string;
  support: Record<AgentId, SupportStatus>;
  capabilities: readonly Capability[];
}) {
  const [selected, setSelected] = useState<AgentId>("codex");
  const [scope, setScope] = useState<InstallScope>("global");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const id = useId();
  function keydown(e: KeyboardEvent<HTMLButtonElement>) {
    const i = AGENT_IDS.indexOf(selected);
    let n: AgentId | undefined;
    if (e.key === "ArrowRight") n = AGENT_IDS[(i + 1) % AGENT_IDS.length];
    if (e.key === "ArrowLeft")
      n = AGENT_IDS[(i + AGENT_IDS.length - 1) % AGENT_IDS.length];
    if (e.key === "Home") n = AGENT_IDS[0];
    if (e.key === "End") n = AGENT_IDS.at(-1);
    if (n) {
      e.preventDefault();
      setSelected(n);
      refs.current[n]?.focus();
    }
  }
  return (
    <section className="agent-installer" aria-label="Install skill">
      <h2>Install skill</h2>
      <div role="tablist" aria-label="Coding agent" className="agent-tablist">
        {AGENT_IDS.map((agent) => (
          <button
            key={agent}
            ref={(n) => {
              refs.current[agent] = n;
            }}
            type="button"
            role="tab"
            id={`${id}-${agent}-tab`}
            aria-controls={`${id}-${agent}-panel`}
            aria-selected={selected === agent}
            tabIndex={selected === agent ? 0 : -1}
            onClick={() => setSelected(agent)}
            onKeyDown={keydown}
          >
            <RuntimeLogo runtime={agent} decorative />
            {AGENTS[agent].label}
          </button>
        ))}
      </div>
      {AGENT_IDS.map((agent) => {
        const command = generateInstallCommand({ skill: slug, agent, scope });
        return (
          <div
            key={agent}
            role="tabpanel"
            id={`${id}-${agent}-panel`}
            aria-labelledby={`${id}-${agent}-tab`}
            hidden={selected !== agent}
            className="agent-panel"
          >
            {support[agent] !== "unsupported" ? (
              <>
                <label className="scope-label">
                  Install for
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as InstallScope)}
                  >
                    <option value="global">All projects (global)</option>
                    <option value="project">This project</option>
                  </select>
                </label>
                <p className="text-xs">
                  {scope === "global"
                    ? "Available across your projects on this computer."
                    : "Available in the current project directory."}
                </p>
                <code className="install-command">
                  {command.split(" ").map((part, i) => (
                    <Fragment key={i}>
                      {i > 0 && " "}
                      <span>{part}</span>
                    </Fragment>
                  ))}
                </code>
                <CopyButton
                  key={command}
                  text={command}
                  className="install-copy"
                  wrapperClassName="w-full"
                  analytics={{
                    name: "install_copy",
                    properties: { agent, skill: slug },
                  }}
                />
              </>
            ) : (
              <p>
                This skill does not offer an install path for{" "}
                {AGENTS[agent].label}.
              </p>
            )}
            <div className="install-notes">
              <p>Paste into your terminal to install.</p>
              <p>
                {AGENTS[agent].label} runtime testing:{" "}
                {support[agent] === "tested"
                  ? "tested"
                  : support[agent] === "unsupported"
                    ? "unsupported"
                    : "unverified"}
                .
              </p>
              <TrackedLink
                href={AGENTS[agent].guideRoute}
                eventName="guide_open"
                agent={agent}
                skill={slug}
                className="text-button"
              >
                Setup guide →
              </TrackedLink>
              <details>
                <summary>Usage and required access</summary>
                <p>
                  Invoke <code>{invocationFor(agent, slug)}</code>, or describe
                  the task naturally.
                </p>
                <p className="mt-3">
                  Required access:{" "}
                  {capabilities.map((c) => CAPABILITY_LABELS[c]).join(", ") ||
                    "none beyond the agent"}
                  .
                </p>
                <a
                  className="text-button"
                  href={AGENTS[agent].officialDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official docs ↗
                </a>
              </details>
            </div>
          </div>
        );
      })}
    </section>
  );
}
