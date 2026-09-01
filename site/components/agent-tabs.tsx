"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CopyButton } from "./copy-button";
import { RuntimeLogo, RuntimeLogoTile } from "./runtime-logo";
import { TrackedLink } from "./tracked-link";
import { AGENT_IDS } from "@/lib/agents";
import type { AgentId, Capability, SupportStatus } from "@/lib/catalog";
import {
  createAgentPanelViewModels,
  type AgentPanelViewModel,
} from "@/lib/skill-presentation";

function RequiredAccess({
  section,
}: {
  section: AgentPanelViewModel["capabilitySection"];
}) {
  if (!section.visible) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-[var(--color-heading)]">Required access</p>
      <div className="flex flex-wrap gap-1.5">
        {section.items.map((capability) => (
          <span
            key={capability.id}
            data-capability={capability.id}
            className="border border-[var(--color-border)] px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-text)]"
          >
            {capability.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AgentPanel({
  panel,
  slug,
  selected,
}: {
  panel: AgentPanelViewModel;
  slug: string;
  selected: boolean;
}) {
  return (
    <div
      role="tabpanel"
      id={panel.panelId}
      aria-labelledby={panel.tabId}
      hidden={!selected}
      className="p-4 sm:p-5"
    >
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <RuntimeLogoTile runtime={panel.id} size="sm" decorative />
          <div>
            <p translate="no" className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-heading)]">
              {panel.label}
            </p>
            {panel.install.visible ? (
              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Skills directory: <code className="text-[var(--color-text)]">{panel.globalDirectory}</code>
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {panel.install.visible && panel.install.command ? (
        <div>
          <p className="mb-2 text-xs font-medium text-[var(--color-heading)]">Install globally</p>
          <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-3 font-[family-name:var(--font-mono)] text-xs sm:grid-cols-[auto_minmax(0,1fr)_auto]">
            <span className="select-none text-[var(--color-accent)]">$</span>
            <code className="min-w-0 break-all leading-relaxed text-[var(--color-heading)]">{panel.install.command}</code>
            <CopyButton
              text={panel.install.command}
              className="col-start-2 w-fit shrink-0 sm:col-start-auto"
              analytics={{ name: "install_copy", properties: { agent: panel.id, skill: slug } }}
            />
          </div>

          <div className={`mt-5 grid gap-5 ${panel.capabilitySection.visible ? "sm:grid-cols-2" : ""}`}>
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--color-heading)]">Invoke</p>
              <code className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]">
                {panel.invocation}
              </code>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-muted)]">
                You can also describe the task naturally; runtimes may select the skill from its description.
              </p>
            </div>
            <RequiredAccess section={panel.capabilitySection} />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="border-l-2 border-rose-400/60 bg-rose-400/5 px-4 py-3">
            <p className="text-sm leading-relaxed text-[var(--color-text)]">{panel.unsupportedMessage}</p>
          </div>
          <RequiredAccess section={panel.capabilitySection} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4 font-[family-name:var(--font-mono)] text-xs">
        <TrackedLink
          href={panel.guideRoute}
          eventName="guide_open"
          agent={panel.id}
          skill={slug}
          className="text-[var(--color-accent)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          Setup guide →
        </TrackedLink>
        <TrackedLink
          href={panel.officialDocsUrl}
          eventName="guide_open"
          agent={panel.id}
          skill={slug}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-muted)] hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          Official docs ↗
        </TrackedLink>
      </div>
    </div>
  );
}

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
  const tabsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const panels = createAgentPanelViewModels({ slug, support, capabilities });

  function selectAndFocus(next: AgentId) {
    setSelected(next);
    tabsRef.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = AGENT_IDS.indexOf(selected);
    let next: AgentId | undefined;

    if (event.key === "ArrowRight") next = AGENT_IDS[(index + 1) % AGENT_IDS.length];
    if (event.key === "ArrowLeft") next = AGENT_IDS[(index - 1 + AGENT_IDS.length) % AGENT_IDS.length];
    if (event.key === "Home") next = AGENT_IDS[0];
    if (event.key === "End") next = AGENT_IDS[AGENT_IDS.length - 1];

    if (next) {
      event.preventDefault();
      selectAndFocus(next);
    }
  }

  return (
    <section className="mb-8 overflow-hidden terminal-panel" aria-labelledby="agent-install-heading">
      <div className="border-b border-[var(--color-border)] px-4 pt-4">
        <div className="mb-3">
          <h2 id="agent-install-heading" className="text-sm font-medium text-[var(--color-heading)]">
            Install
          </h2>
        </div>
        <p className="mb-2 text-xs text-[var(--color-muted)] sm:hidden">Swipe for more runtimes.</p>
        <div role="tablist" aria-label="Coding agent. Scroll horizontally for more runtimes." className="-mx-1 flex max-w-full gap-1 overflow-x-auto px-1">
          {panels.map((panel) => {
            const isSelected = selected === panel.id;
            return (
              <button
                key={panel.id}
                ref={(node) => { tabsRef.current[panel.id] = node; }}
                type="button"
                role="tab"
                id={panel.tabId}
                aria-controls={panel.panelId}
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(panel.id)}
                onKeyDown={handleKeyDown}
                className={`relative shrink-0 border-b-2 px-3 py-3 font-[family-name:var(--font-mono)] text-xs transition-colors focus-visible:z-10 focus-visible:bg-[rgba(245,158,11,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--color-accent)] ${
                  isSelected
                    ? "border-[var(--color-accent)] text-[var(--color-heading)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <RuntimeLogo runtime={panel.id} decorative className="h-3.5 w-3.5" />
                  <span translate="no">{panel.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {panels.map((panel) => (
        <AgentPanel key={panel.id} panel={panel} slug={slug} selected={selected === panel.id} />
      ))}
    </section>
  );
}
