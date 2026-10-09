"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CommandBlock } from "./command-block";
import { AGENTS, AGENT_IDS, generateInstallCommand, invocationFor, type InstallScope } from "@/lib/agents";
import type { AgentId, SupportStatus } from "@/lib/catalog";

type Mode = AgentId | "prompt";
const MODES: Mode[] = [...AGENT_IDS, "prompt"];
const STORAGE_KEY = "slashskills:agent";

function remembered(): Mode | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return MODES.includes(value as Mode) ? (value as Mode) : null;
  } catch {
    return null;
  }
}

export function InstallBox({
  slug,
  support,
}: {
  slug: string;
  support: Record<AgentId, SupportStatus>;
}) {
  const [mode, setMode] = useState<Mode>("codex");
  const [scope, setScope] = useState<InstallScope>("global");
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const id = useId();

  useEffect(() => {
    const saved = remembered();
    if (saved) setMode(saved);
  }, []);

  function choose(next: Mode) {
    setMode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const i = MODES.indexOf(mode);
    const next =
      e.key === "ArrowRight" ? MODES[(i + 1) % MODES.length]
      : e.key === "ArrowLeft" ? MODES[(i + MODES.length - 1) % MODES.length]
      : e.key === "Home" ? MODES[0]
      : e.key === "End" ? MODES.at(-1)
      : undefined;
    if (!next) return;
    e.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  }

  const agent: AgentId = mode === "prompt" ? "claude-code" : mode;
  const command = generateInstallCommand({ skill: slug, agent, scope });
  const unsupported = mode !== "prompt" && support[mode] === "unsupported";
  const prompt = `Install the ${slug} agent skill by running \`${generateInstallCommand({ skill: slug, agent: "claude-code", scope: "project" })}\` in this project, then use it for the task I describe next.`;

  return (
    <section className="installer" aria-label={`Install /${slug}`}>
      <div className="install-head">
        <div role="tablist" aria-label="Install for" className="segmented">
          {MODES.map((m) => (
            <button
              key={m}
              ref={(node) => {
                tabs.current[m] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-${m}`}
              aria-controls={`${id}-panel`}
              aria-selected={mode === m}
              tabIndex={mode === m ? 0 : -1}
              onClick={() => choose(m)}
              onKeyDown={onKeyDown}
              className={m === "prompt" ? "segment segment-prompt" : "segment"}
            >
              {m === "prompt" ? (
                <>
                  <span className="seg-long">As a prompt</span>
                  <span className="seg-short">Prompt</span>
                </>
              ) : (
                AGENTS[m].label
              )}
            </button>
          ))}
        </div>
        {mode !== "prompt" && (
          <label className="scope">
            <span>Install for</span>
            <select value={scope} onChange={(e) => setScope(e.target.value as InstallScope)}>
              <option value="global">All projects</option>
              <option value="project">This project</option>
            </select>
          </label>
        )}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${mode}`}>
        {unsupported ? (
          <p className="install-note">This skill has no install path for {AGENTS[mode as AgentId].label}.</p>
        ) : mode === "prompt" ? (
          <>
            <CommandBlock command={prompt} prompt={false} copyLabel="Copy prompt" analytics={{ agent: "prompt", skill: slug }} className="command-prose" />
            <p className="install-note">Paste it into Claude Code, Codex or Cursor. The agent runs the install for you.</p>
          </>
        ) : (
          <>
            <CommandBlock command={command} analytics={{ agent, skill: slug }} />
            <p className="install-note">
              Then type <code>{invocationFor(agent, slug).split(" or ")[0]}</code> in {AGENTS[agent].label}, or describe the task and let it pick the skill.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
