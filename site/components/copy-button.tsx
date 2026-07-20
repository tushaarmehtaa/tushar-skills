"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";

interface AnalyticsEvent {
  name: "install_copy";
  properties: {
    agent: string;
    skill: string;
  };
}

type CopyStatus = "idle" | "copied" | "failed";

export function CopyButton({
  text,
  label = "Copy command",
  className,
  analytics,
}: {
  text: string;
  label?: string;
  className?: string;
  analytics?: AnalyticsEvent;
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const resetTimer = useRef<number | null>(null);

  function showStatus(nextStatus: Exclude<CopyStatus, "idle">) {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    setStatus(nextStatus);
    if (nextStatus === "copied") buttonRef.current?.classList.add("copy-success");
    resetTimer.current = window.setTimeout(() => {
      setStatus("idle");
      buttonRef.current?.classList.remove("copy-success");
    }, 2500);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      if (analytics) track(analytics.name, analytics.properties);
      showStatus("copied");
    } catch {
      showStatus("failed");
    }
  }

  const buttonLabel = status === "copied" ? "Copied" : status === "failed" ? "Copy failed. Try again" : label;
  const statusMessage = status === "copied"
    ? "Command copied."
    : status === "failed"
      ? "Copy failed. Select the command and copy it manually."
      : "";

  return (
    <span className="inline-flex items-center">
      <button
        type="button"
        ref={buttonRef}
        onClick={handleCopy}
        aria-label={buttonLabel}
        className={`inline-flex min-h-11 items-center gap-1.5 rounded border px-2.5 py-1 text-xs transition-[border-color,color,background-color,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
          status === "copied"
            ? "border-[var(--color-accent)] bg-[var(--color-accent-dim)] text-[var(--color-accent)]"
            : status === "failed"
              ? "border-rose-400/60 text-rose-300 hover:border-rose-300"
              : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-heading)]"
        } ${className || ""}`}
      >
        {status === "copied" ? "copied" : status === "failed" ? "retry" : label}
      </button>
      <span aria-live="polite" className="sr-only">{statusMessage}</span>
    </span>
  );
}
