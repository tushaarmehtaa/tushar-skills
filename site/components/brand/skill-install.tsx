"use client";

import { useEffect, useState } from "react";
import { InstallPanel, rememberAgent, rememberedAgent, type Mode } from "./install-panel";
import type { AgentId, SupportStatus } from "@/lib/catalog";

export function SkillInstall({ slug, support }: { slug: string; support: Record<AgentId, SupportStatus> }) {
  const [mode, setMode] = useState<Mode>("claude-code");
  useEffect(() => {
    const saved = rememberedAgent();
    if (saved) setMode(saved);
  }, []);
  return (
    <InstallPanel
      skill={slug}
      mode={mode}
      rich
      support={support}
      onMode={(m) => {
        setMode(m);
        rememberAgent(m);
      }}
    />
  );
}
