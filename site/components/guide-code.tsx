"use client";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "./copy-button";
export function GuideCode({
  html,
  language,
}: {
  html: string;
  language: string;
}) {
  const code = useRef<HTMLElement>(null);
  const [text, setText] = useState("");
  useEffect(() => {
    setText(code.current?.textContent ?? "");
  }, [html]);
  return (
    <div className="guide-code not-prose">
      <div className="guide-code-toolbar">
        <span>
          {language === "yaml" ? "Edit record · YAML" : "Instruction example"}
        </span>
        <CopyButton
          text={text}
          label="Copy example"
          successMessage="Example copied to clipboard."
        />
      </div>
      <pre tabIndex={0} aria-label="Code example">
        <code ref={code} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
