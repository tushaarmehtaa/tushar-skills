"use client";

import { useRef, useState } from "react";

export function GuideCode({ html, language }: { html: string; language: string }) {
  const code = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.current?.textContent ?? "");
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="guide-code not-prose">
      <div className="guide-code-toolbar">
        <span>{language === "yaml" ? "Edit record · YAML" : "Instruction example"}</span>
        <button type="button" onClick={copy} aria-label="Copy example">
          {status === "copied" ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre tabIndex={0} aria-label="Code example"><code ref={code} dangerouslySetInnerHTML={{ __html: html }} /></pre>
      <span role="status" className={status === "failed" ? "block px-4 pb-3 text-sm" : "sr-only"}>
        {status === "failed" ? "Copy unavailable. Select and copy the example above." : status === "copied" ? "Example copied to clipboard." : ""}
      </span>
    </div>
  );
}
