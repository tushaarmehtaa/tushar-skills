"use client";

import { useEffect, useRef, useState } from "react";

/** Counts up to `value` once it scrolls into view. Shows the final number without JS or with reduced motion. */
export function CountUp({ value, suffix = "+", duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        setN(Math.round(value * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      setN(0);
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={`${value.toLocaleString("en-US")}${suffix}`} style={{ fontVariantNumeric: "tabular-nums" }}>
      <span aria-hidden="true">{n.toLocaleString("en-US")}{suffix}</span>
    </span>
  );
}
