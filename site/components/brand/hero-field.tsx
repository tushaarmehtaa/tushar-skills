"use client";

import { useEffect, useRef, useState } from "react";

const GLITCH = "*#%<>[]=+_~^";

/**
 * The first fold's texture: every skill name, set in mono and faint. Names flicker, glow near the pointer,
 * and jump to the skill row when clicked. Hidden from assistive tech: the directory below is the real list.
 */
export function HeroField({ names, foldRef, onPick }: { names: string[]; foldRef: React.RefObject<HTMLElement | null>; onPick: (slug: string) => void }) {
  const field = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    const fold = foldRef.current;
    if (!fold) return;
    const build = () => {
      const h = fold.clientHeight;
      const w = fold.clientWidth;
      const count = Math.max(8, Math.round(h / 34));
      const per = w < 560 ? 2 : Math.max(3, Math.min(8, Math.floor(w / 200)));
      setRows(
        Array.from({ length: count }, (_, r) =>
          Array.from({ length: per }, (_, c) => names[(r * 11 + c * 7 + (r % 3) * 5) % names.length]),
        ),
      );
    };
    build();
    let t: number;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 150);
    });
    ro.observe(fold);
    return () => ro.disconnect();
  }, [names, foldRef]);

  useEffect(() => {
    const root = field.current;
    const fold = foldRef.current;
    if (!root || !fold || !rows.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tokens = Array.from(root.querySelectorAll<HTMLElement>(".tk"));
    const glitching = new WeakSet<HTMLElement>();
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const t = tokens[(Math.random() * tokens.length) | 0];
      if (!t || glitching.has(t)) return;
      glitching.add(t);
      const orig = `/${t.dataset.slug}`;
      const arr = orig.split("");
      const n = 1 + ((Math.random() * 2) | 0);
      for (let k = 0; k < n; k++) arr[2 + ((Math.random() * (arr.length - 3)) | 0)] = GLITCH[(Math.random() * GLITCH.length) | 0];
      t.textContent = arr.join("");
      t.classList.add("hot");
      window.setTimeout(() => {
        t.textContent = orig;
        t.classList.remove("hot");
        glitching.delete(t);
      }, 320);
    }, 380);
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const hr = fold.getBoundingClientRect();
        if (e.clientY < hr.top - 40 || e.clientY > hr.bottom + 40) return;
        tokens.forEach((t) => {
          const r = t.getBoundingClientRect();
          const d = Math.hypot(r.left + r.width / 2 - e.clientX, r.top + r.height / 2 - e.clientY);
          t.style.color = d < 120 && !glitching.has(t) ? `color-mix(in srgb, var(--amber) ${Math.round((1 - d / 120) * 100)}%, var(--faint))` : "";
        });
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [rows, foldRef]);

  return (
    <div className="field" ref={field} aria-hidden="true">
      {rows.map((row, r) => (
        <div className="frow" key={r}>
          {row.map((slug, c) => (
            <a
              key={c}
              className="tk"
              href={`#skill-${slug}`}
              data-slug={slug}
              tabIndex={-1}
              onClick={(e) => {
                e.preventDefault();
                onPick(slug);
              }}
            >
              /{slug}
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}
