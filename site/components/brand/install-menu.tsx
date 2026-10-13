"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CmdBar } from "./copy-button";
import { AgentMark } from "./logos";
import { rememberAgent, rememberedAgent } from "./install-panel";
import { generateInstallCommand } from "@/lib/agents";
import { AGENT_TABS, type Agent } from "@/lib/brand-shared";

/** Header install: a popover with the real command. On a skill page it defaults to that skill, anywhere else to the whole library. Press I to open. */
export function InstallMenu({ slugs }: { slugs: string[] }) {
  const pathname = usePathname();
  const seg = pathname === "/skills/changelog" ? "changelog" : pathname.slice(1);
  const current = slugs.includes(seg) ? seg : null;
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState<Agent>("claude-code");
  const [all, setAll] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const saved = rememberedAgent();
    if (saved && saved !== "prompt") setAgent(saved);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      } else if (e.key.toLowerCase() === "i" && !e.metaKey && !e.ctrlKey && !e.altKey && !t?.matches?.("input,textarea,select,[contenteditable]")) {
        setOpen((v) => !v);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (open && root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const skill = current && !all ? current : undefined;
  const command = generateInstallCommand({ skill, agent });

  return (
    <div className="imenu" ref={root}>
      <button ref={button} type="button" className="btn" aria-expanded={open} aria-controls="install-menu" onClick={() => setOpen((v) => !v)}>
        Install <span className="kbd" aria-hidden="true">I</span>
      </button>
      <div id="install-menu" className="imenu-panel" role="dialog" aria-label="Install" hidden={!open}>
        <div className="tabs" role="tablist" aria-label="Agent">
          {AGENT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className="tab"
              aria-selected={agent === t.id}
              onClick={() => {
                setAgent(t.id);
                rememberAgent(t.id);
              }}
            >
              <AgentMark agent={t.id} />
              {t.label}
            </button>
          ))}
        </div>
        <CmdBar text={command} analytics={{ agent, skill: skill ?? "all" }}>
          <div className="cmd" data-command={command}>
            <span className="ln"><span className="p">$</span>npx skills add tushaarmehtaa/tushar-skills</span>
            <span className="ln">{`${skill ? `--skill ${skill} ` : ""}-g -a ${agent} -y`}</span>
          </div>
        </CmdBar>
        <div className="imenu-foot">
          {current ? (
            <button type="button" className="imenu-swap" onClick={() => setAll((v) => !v)}>
              {all ? `Just /${current} →` : "Install all 35 instead →"}
            </button>
          ) : (
            <span>Installs all 35 skills. Pick one in the list below.</span>
          )}
        </div>
      </div>
    </div>
  );
}
