"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CmdBar } from "./copy-button";
import { AgentMark } from "./logos";
import { AGENTS, generateInstallCommand, invocationFor, type InstallScope } from "@/lib/agents";
import { AGENT_TABS, type Agent } from "@/lib/brand-shared";
import type { AgentId, SupportStatus } from "@/lib/catalog";

export const AGENT_STORAGE_KEY = "slashskills:agent";
export type Mode = Agent | "prompt";

export function rememberedAgent(): Mode | null {
  try {
    const v = window.localStorage.getItem(AGENT_STORAGE_KEY);
    return v === "claude-code" || v === "codex" || v === "cursor" || v === "prompt" ? v : null;
  } catch {
    return null;
  }
}
export function rememberAgent(mode: Mode) {
  try {
    window.localStorage.setItem(AGENT_STORAGE_KEY, mode);
  } catch {}
}

/** Text that cross-fades when its value changes (blur masks the swap). */
function Seg({ value }: { value: string }) {
  const [shown, setShown] = useState(value);
  const [out, setOut] = useState(false);
  useEffect(() => {
    if (value === shown) return;
    setOut(true);
    const t = window.setTimeout(() => {
      setShown(value);
      setOut(false);
    }, 150);
    return () => window.clearTimeout(t);
  }, [value, shown]);
  return <span className={`seg ${out ? "sw" : ""}`}>{shown}</span>;
}

/**
 * The install block: agent tabs, one command, one copy button.
 * The homepage drives `skill` from the demo strip. A skill page adds a prompt tab, scope and support notes.
 */
export function InstallPanel({
  skill,
  mode,
  onMode,
  rich = false,
  support,
  className = "",
}: {
  /** Omit to install the whole library. */
  skill?: string;
  mode: Mode;
  onMode: (m: Mode) => void;
  rich?: boolean;
  support?: Record<AgentId, SupportStatus>;
  className?: string;
}) {
  const [scope, setScope] = useState<InstallScope>("global");
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const id = useId();
  const modes: Mode[] = rich ? [...AGENT_TABS.map((t) => t.id), "prompt"] : AGENT_TABS.map((t) => t.id);
  const agent: Agent = mode === "prompt" ? "claude-code" : mode;
  const command = generateInstallCommand({ skill, agent, scope });
  const unsupported = rich && mode !== "prompt" && support?.[mode] === "unsupported";
  const prompt = skill ? `Install the ${skill} agent skill by running \`${generateInstallCommand({ skill, agent: "claude-code", scope: "project" })}\` in this project, then use it for the task I describe next.` : `Install every slashskills agent skill by running \`${generateInstallCommand({ agent: "claude-code", scope: "project" })}\` in this project, then tell me which ones fit what we are building.`;

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const i = modes.indexOf(mode);
    const next =
      e.key === "ArrowRight" ? modes[(i + 1) % modes.length]
      : e.key === "ArrowLeft" ? modes[(i + modes.length - 1) % modes.length]
      : e.key === "Home" ? modes[0]
      : e.key === "End" ? modes.at(-1)
      : undefined;
    if (!next) return;
    e.preventDefault();
    onMode(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className={`install ${className}`} aria-label={skill ? `Install /${skill}` : "Install all skills"} id={rich ? undefined : "install"}>
      <div className="tabs" role="tablist" aria-label="Install for">
        {modes.map((m) => (
          <button
            key={m}
            ref={(n) => {
              tabs.current[m] = n;
            }}
            type="button"
            role="tab"
            id={`${id}-${m}`}
            aria-controls={`${id}-panel`}
            aria-selected={mode === m}
            tabIndex={mode === m ? 0 : -1}
            className="tab"
            onClick={() => onMode(m)}
            onKeyDown={onKeyDown}
          >
            {m === "prompt" ? (
              <>
                <span className="ipseg-l">As a prompt</span>
                <span className="ipseg-s">Prompt</span>
              </>
            ) : (
              <>
                <AgentMark agent={m} />
                {AGENTS[m].label}
              </>
            )}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${mode}`}>
        {unsupported ? (
          <p className="ipnote">This skill has no install path for {AGENTS[mode as AgentId].label}.</p>
        ) : mode === "prompt" ? (
          <>
            <CmdBar text={prompt} analytics={{ agent: "prompt", skill: skill ?? "all" }}>
              <div className="cmd cmd-prose">{prompt}</div>
            </CmdBar>
            <p className="ipnote">Paste it into Claude Code, Codex or Cursor. The agent runs the install for you.</p>
          </>
        ) : (
          <>
            <CmdBar text={command} analytics={{ agent, skill: skill ?? "all" }}>
              <div className="cmd" data-command={command}>
                <span className="p">$</span>
                npx skills add tushaarmehtaa/tushar-skills {skill ? <>--skill <Seg value={skill} /> </> : null}{scope === "global" ? "-g " : ""}-a <Seg value={agent} /> -y
              </div>
            </CmdBar>
            {rich && (
              <div className="install-foot">
                <p className="ipnote">
                  Then type <code>{invocationFor(agent, skill ?? "skill-name").split(" or ")[0]}</code> in {AGENTS[agent].label}, or describe the task and let it pick the skill.
                </p>
                <label className="ipscope">
                  <span>Install for</span>
                  <select value={scope} onChange={(e) => setScope(e.target.value as InstallScope)}>
                    <option value="global">All projects</option>
                    <option value="project">This project</option>
                  </select>
                </label>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
