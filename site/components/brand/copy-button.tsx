"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";

const REDUCED = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Nine amber squares thrown from the button. Skipped for reduced motion. */
function burst(btn: HTMLElement) {
  if (REDUCED()) return;
  const host = (btn.offsetParent as HTMLElement | null) ?? document.body;
  const r = btn.getBoundingClientRect();
  const hr = host.getBoundingClientRect();
  for (let i = 0; i < 9; i++) {
    const s = document.createElement("i");
    s.className = "spark";
    s.style.left = `${r.left - hr.left + r.width / 2 - 3}px`;
    s.style.top = `${r.top - hr.top + r.height / 2 - 3}px`;
    host.appendChild(s);
    const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.4;
    const d = 26 + Math.random() * 22;
    s.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`, opacity: 0 },
      ],
      { duration: 520, easing: "cubic-bezier(0.23,1,0.32,1)" },
    ).onfinish = () => s.remove();
  }
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    t.remove();
    return ok;
  }
}

/** Copy action with the sweep + spark + check effect. `bar` flashes the command bar it sits in. */
export function useCopy(text: string, analytics?: { agent: string; skill: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);
  async function copy(btn: HTMLElement | null, bar?: HTMLElement | null) {
    const ok = await writeClipboard(text);
    setFailed(!ok);
    setCopied(ok);
    if (ok) {
      if (analytics) track("install_copy", analytics);
      if (btn) burst(btn);
      if (bar) {
        bar.classList.remove("flash");
        void bar.offsetWidth;
        bar.classList.add("flash");
      }
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 1900);
  }
  return { copied, failed, copy };
}

const CopyIcon = () => (
  <span className="ic">
    <svg className="cp" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></svg>
    <svg className="ok" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
  </span>
);

export function CopyButton({
  text,
  label = "copy",
  ariaLabel = "Copy install command",
  analytics,
  barRef,
  className = "",
}: {
  text: string;
  label?: string;
  ariaLabel?: string;
  analytics?: { agent: string; skill: string };
  barRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const { copied, failed, copy } = useCopy(text, analytics);
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={ref}
        type="button"
        className={`copy ${copied ? "copied" : ""} ${className}`}
        aria-label={copied ? "Copied" : failed ? "Select the command and copy it" : ariaLabel}
        onClick={() => copy(ref.current, barRef?.current)}
      >
        <CopyIcon />
        <span className="lb">
          <span className="idle">{failed ? "select + copy" : label}</span>
          <span className="done">copied</span>
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr">{copied ? "Copied to clipboard." : failed ? "Copy failed. Select the command and copy it manually." : ""}</span>
    </>
  );
}

/** Small icon-only copy used on directory rows. */
export function RowCopy({ text, slug, agent }: { text: string; slug: string; agent: string }) {
  const { copied, copy } = useCopy(text, { agent, skill: slug });
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={ref}
      type="button"
      className={`cp ${copied ? "copied" : ""}`}
      aria-label={`Copy install command for ${slug}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        copy(ref.current);
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {copied ? <path d="m5 12 4.5 4.5L19 7" /> : (<><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>)}
      </svg>
    </button>
  );
}

export function CmdBar({ children, text, analytics, id }: { children: ReactNode; text: string; analytics?: { agent: string; skill: string }; id?: string }) {
  const bar = useRef<HTMLDivElement>(null);
  return (
    <div className="cmdbar" id={id} ref={bar}>
      {children}
      <CopyButton text={text} analytics={analytics} barRef={bar} />
    </div>
  );
}
