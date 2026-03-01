"use client";

import { useState, useRef } from "react";

export function CopyButton({
  text,
  label = "Copy install",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    btnRef.current?.classList.add("copy-success");
    setTimeout(() => {
      setCopied(false);
      btnRef.current?.classList.remove("copy-success");
    }, 2000);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 font-[family-name:var(--font-mono)] text-xs font-medium transition-all duration-300 ${
        copied
          ? "border-[var(--color-accent)] bg-[var(--color-accent-glow)] text-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent-glow)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:border-[var(--color-accent-dim)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-glow)]"
      } ${className || ""}`}
    >
      {copied ? (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
