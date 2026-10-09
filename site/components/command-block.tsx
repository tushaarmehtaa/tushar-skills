"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

type Status = "idle" | "copied" | "failed";

/** A terminal command on ink with one copy action. Tokens never break mid-word. */
export function CommandBlock({
  command,
  copyLabel = "Copy",
  prompt = true,
  analytics,
  className = "",
}: {
  command: string;
  copyLabel?: string;
  prompt?: boolean;
  analytics?: { agent: string; skill: string };
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | null>(null);
  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      if (analytics) track("install_copy", analytics);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div className={`command ${className}`}>
      {prompt && <span className="command-prompt" aria-hidden="true">$</span>}
      <code className="command-text">
        {command.split(" ").map((part, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span>{part}</span>
          </Fragment>
        ))}
      </code>
      <button
        type="button"
        className="command-copy"
        onClick={copy}
        data-status={status}
        aria-label={status === "copied" ? "Copied" : status === "failed" ? "Select and copy" : copyLabel}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {status === "copied" ? (
            <path d="m5 12 5 5L20 7" />
          ) : (
            <>
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </>
          )}
        </svg>
        <span>{status === "copied" ? "Copied" : status === "failed" ? "Select and copy" : copyLabel}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === "copied" ? "Copied to clipboard." : status === "failed" ? "Copy failed. Select the command and copy it manually." : ""}
      </span>
    </div>
  );
}
