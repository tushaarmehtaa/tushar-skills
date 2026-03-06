"use client";

import { useState, useRef } from "react";

export function CopyButton({
  text,
  label = "copy",
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
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-[family-name:var(--font-mono)] text-xs transition-all ${
        copied
          ? "border-[var(--color-accent)] text-[var(--color-accent)]"
          : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-heading)]"
      } ${className || ""}`}
    >
      {copied ? "copied" : label}
    </button>
  );
}
