"use client";

import { useEffect, useRef, type ReactNode } from "react";

const HANDLE = (
  <div className="handle">
    <div className="k">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10.5 24.5 L21.5 7.5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" /></svg>
    </div>
  </div>
);

/** Drag-to-compare. Plays a reveal each time it becomes `active`. Keyboard: left/right arrows. */
export function Wipe({
  active = true,
  className = "",
  onPick,
  viaKey,
  children,
  label = "Before and after",
}: {
  active?: boolean;
  className?: string;
  onPick?: () => void;
  viaKey?: () => boolean;
  children: ReactNode;
  label?: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const pos = useRef(100);
  const key = useRef(viaKey);
  key.current = viaKey;

  const set = (v: number) => {
    const node = el.current;
    if (!node) return;
    pos.current = Math.max(0, Math.min(100, v));
    node.style.setProperty("--pos", `${pos.current}%`);
    node.setAttribute("aria-valuenow", String(Math.round(pos.current)));
  };

  const play = () => {
    cancelAnimationFrame(raf.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return set(100);
    set(0);
    const instant = key.current?.() ?? false;
    const t0 = performance.now() + (instant ? 0 : 520);
    const dur = instant ? 1 : 1500;
    const step = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - t0) / dur));
      set((1 - Math.pow(1 - k, 4)) * 100);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (active) play();
    else {
      cancelAnimationFrame(raf.current);
      set(0);
    }
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const dragging = useRef(false);
  const move = (e: React.PointerEvent) => {
    const r = el.current!.getBoundingClientRect();
    set(((e.clientX - r.left) / r.width) * 100);
  };

  return (
    <div
      ref={el}
      className={`wipe ${className}`}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      style={{ ["--pos" as string]: "0%" }}
      tabIndex={0}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest(".replay")) return;
        dragging.current = true;
        cancelAnimationFrame(raf.current);
        onPick?.();
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => dragging.current && move(e)}
      onPointerUp={() => (dragging.current = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") set(pos.current - 5);
        if (e.key === "ArrowRight") set(pos.current + 5);
      }}
    >
      {children}
      {HANDLE}
      <div className="legend">
        <span>before</span>
        <button
          type="button"
          className="replay"
          onClick={(e) => {
            e.stopPropagation();
            onPick?.();
            play();
          }}
        >
          ↺ replay
        </button>
        <span>after</span>
      </div>
    </div>
  );
}
