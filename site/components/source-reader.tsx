"use client";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "./copy-button";

export interface ReaderFile {
  path: string;
  anchor: string;
  contentHtml: string;
  rawContent: string;
  sourceUrl: string;
}
function headings(html: string) {
  return [...html.matchAll(/<h[23] id="([^"]+)">([\s\S]*?)<\/h[23]>/g)].map(
    (m) => ({
      id: m[1],
      text: m[2]
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'"),
    }),
  );
}
export function SourceReader({
  files,
  license,
}: {
  files: ReaderFile[];
  license: string;
}) {
  const [selected, setSelected] = useState(files[0].anchor);
  const [mode, setMode] = useState<"read" | "raw">("read");
  const [target, setTarget] = useState("");
  const mobileContents = useRef<HTMLDetailsElement>(null);
  const file = files.find((f) => f.anchor === selected) ?? files[0];
  const toc = headings(file.contentHtml);
  useEffect(() => {
    function sync() {
      let hash: string;
      try {
        hash = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const match = files.find(
        (f) => hash === f.anchor || hash.startsWith(f.anchor + "-"),
      );
      if (match) {
        setSelected(match.anchor);
        setMode("read");
        setTarget(hash);
        if (mobileContents.current) mobileContents.current.open = false;
      }
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [files]);
  useEffect(() => {
    if (!target) return;
    const frame = requestAnimationFrame(() => {
      const element = document.getElementById(target);
      if (element) {
        element.tabIndex = -1;
        element.focus({ preventScroll: true });
        const fileRoot = files.some((f) => f.anchor === target);
        (fileRoot ? element.closest(".reader-main") : element)?.scrollIntoView({
          block: "start",
        });
      }
      setTarget("");
    });
    return () => cancelAnimationFrame(frame);
  }, [target, selected, mode, files]);
  function choose(anchor: string) {
    if (location.hash === "#" + anchor) {
      setMode("read");
      setTarget(anchor);
    } else location.hash = anchor;
  }
  const contents = (
    <nav aria-label="On this file">
      {toc.map((h) => (
        <a key={h.id} href={`#${h.id}`}>
          {h.text}
        </a>
      ))}
    </nav>
  );
  return (
    <section
      id="package-skill-md"
      className="source-reader"
      aria-labelledby="reader-heading"
    >
      <div className="reader-heading-row">
        <h2 id="reader-heading" className="reader-heading">
          Instructions & references
        </h2>
        <a href="#main-content" className="text-button">
          Back to overview ↑
        </a>
      </div>
      <div className="reader-layout">
        <aside className="reader-sidebar">
          <h3>
            Package files <span>{files.length}</span>
          </h3>
          <nav aria-label="Package files">
            {files.map((f) => (
              <a
                key={f.anchor}
                href={`#${f.anchor}`}
                aria-current={f.anchor === selected ? "true" : undefined}
                onClick={() => {
                  if (location.hash === "#" + f.anchor) {
                    setMode("read");
                    setTarget(f.anchor);
                  }
                }}
              >
                {f.path}
              </a>
            ))}
          </nav>
          <h3>On this page</h3>
          {contents}
          <a
            className="text-button"
            href={file.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub ↗
          </a>
        </aside>
        <div className="reader-main">
          <div className="reader-mobile-files">
            <label>
              Package file
              <select value={selected} onChange={(e) => choose(e.target.value)}>
                {files.map((f) => (
                  <option key={f.anchor} value={f.anchor}>
                    {f.path}
                  </option>
                ))}
              </select>
            </label>
            <details ref={mobileContents}>
              <summary>
                On this page <span>{toc.length} sections</span>
              </summary>
              {contents}
            </details>
          </div>
          <div className="reader-toolbar">
            <span className="reader-filename" translate="no">
              {file.path} <span>· {license}</span>
            </span>
            <div className="reader-actions">
              <div role="group" aria-label="Source view">
                <button
                  aria-pressed={mode === "read"}
                  onClick={() => setMode("read")}
                >
                  Read
                </button>
                <button
                  aria-pressed={mode === "raw"}
                  onClick={() => setMode("raw")}
                >
                  Raw
                </button>
              </div>
              <CopyButton
                key={file.path}
                text={file.rawContent}
                label="Copy source"
              />
            </div>
          </div>
          {files.map((f) => (
            <div
              key={f.anchor}
              id={f.anchor}
              hidden={f.anchor !== selected}
              className="reader-file"
              tabIndex={-1}
            >
              <div
                hidden={mode !== "read"}
                className="prose"
                dangerouslySetInnerHTML={{ __html: f.contentHtml }}
              />
              {f.anchor === selected && mode === "raw" && (
                <pre
                  className="reader-raw"
                  tabIndex={0}
                  aria-label={`Raw ${f.path}`}
                >
                  <code>{f.rawContent}</code>
                </pre>
              )}
            </div>
          ))}
          <a
            className="reader-mobile-source text-button"
            href={file.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>
    </section>
  );
}
