"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeroField } from "./hero-field";
import { InstallPanel, rememberAgent, rememberedAgent, type Mode } from "./install-panel";
import { MascotBar } from "./mascot";
import { HOME_DEMOS, homePane } from "./demos";
import { Pane } from "./visuals";
import { Directory } from "./directory";
import { CountUp } from "./count-up";
import { KEY_EVENT } from "./key-nav";
import type { BrandSkill } from "@/lib/brand-shared";

/** Homepage: texture fold with the install, five runs you can switch between, then the directory. */
export function Home({ skills, installs }: { skills: BrandSkill[]; installs: number }) {
  const foldRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripEnd, setStripEnd] = useState(false);
  const [mode, setMode] = useState<Mode>("claude-code");
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [calm, setCalm] = useState(false);
  const lastKey = useRef(0);
  const reveal = useRef<(slug: string) => void>(() => {});
  const setReveal = useCallback((fn: (slug: string) => void) => {
    reveal.current = fn;
  }, []);
  const names = useMemo(() => skills.map((s) => s.slug), [skills]);
  const agent = mode === "prompt" ? "claude-code" : mode;

  useEffect(() => {
    setCalm(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = document.getElementById("demo");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const saved = rememberedAgent();
    if (saved && saved !== "prompt") setMode(saved);
  }, []);

  const choose = (m: Mode) => {
    setMode(m);
    rememberAgent(m);
  };
  const show = useCallback((i: number, quick = false) => {
    setInstant(quick);
    setCur(i);
  }, []);
  // Cleared after the commit that used it; clearing inside the handler batches away the true.
  useEffect(() => {
    if (!instant) return;
    const r = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(r);
  }, [instant]);
  const pick = useCallback(() => setAuto(false), []);

  useEffect(() => {
    const onKey = (e: Event) => {
      const d = (e as CustomEvent).detail as { type: string; index?: number };
      lastKey.current = performance.now();
      if (d.type === "demo" && d.index !== undefined && d.index < HOME_DEMOS.length) {
        setAuto(false);
        show(d.index, true);
      }
    };
    window.addEventListener(KEY_EVENT, onKey);
    return () => window.removeEventListener(KEY_EVENT, onKey);
  }, [show]);

  // On narrow screens the strip scrolls sideways: keep the active tab fully in view
  // (moving only the strip, never the page) and drop the edge fade at the end.
  const syncStripEnd = useCallback(() => {
    const el = stripRef.current;
    if (el) setStripEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    const el = stripRef.current;
    const tab = el?.querySelectorAll<HTMLElement>(".stab")[cur];
    if (!el || !tab || el.scrollWidth <= el.clientWidth) {
      syncStripEnd();
      return;
    }
    // Next frame: the pane swap re-lays out the page and cancels a smooth scroll started in the same frame.
    const r = requestAnimationFrame(() => {
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const box = el.getBoundingClientRect();
      const t = tab.getBoundingClientRect();
      if (t.left < box.left + pad || t.right > box.right - 56) {
        el.scrollBy({ left: t.left - box.left - pad, behavior: calm ? "auto" : "smooth" });
      }
      syncStripEnd();
    });
    return () => cancelAnimationFrame(r);
  }, [cur, calm, syncStripEnd]);

  const ctlFor = (i: number) => ({ active: i === cur, onPick: pick, viaKey: () => performance.now() - lastKey.current < 400 });

  return (
    <>
      <section className="fold" id="fold" ref={foldRef}>
        <HeroField names={names} foldRef={foldRef} onPick={(slug) => reveal.current(slug)} />
        <div className="wrap hero-inner">
          <h1 className="hero-h1" aria-label="good work starts with a useful skill.">
            <span className="l in" style={{ animationDelay: "40ms" }}>good work starts with</span>
            <span className="l in" style={{ animationDelay: "110ms" }}>a useful skill<i className="dot" /></span>
          </h1>
          <p className="sub in" style={{ animationDelay: "200ms" }}>One command to get them all.</p>
          <MascotBar className="hero-mascot" upper=".tab" lower=".cmdbar">
            <InstallPanel mode={mode} onMode={choose} className="in" />
          </MascotBar>
          <div className="v-proof in" style={{ animationDelay: "360ms" }}>
            <div className="n"><b><CountUp value={installs} /></b><span>installs on skills.sh</span></div>
          </div>
        </div>
        <div className="wrap strip-wrap">
          <div
            className={`stage-wrap ${paused ? "paused" : ""}`}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
          >
            <div
              className={`strip ${stripEnd ? "end" : ""}`}
              role="tablist"
              aria-label="Examples"
              ref={stripRef}
              onScroll={syncStripEnd}
            >
              {HOME_DEMOS.map((d, i) => (
                <button
                  key={d.slug}
                  type="button"
                  role="tab"
                  className="stab"
                  aria-selected={i === cur}
                  onClick={() => {
                    setAuto(false);
                    show(i);
                  }}
                >
                  <b>[{i + 1}]</b>
                  {d.slug}
                  <span
                    className={`bar ${i === cur && auto && seen && !calm ? "run" : ""}`}
                    key={`${i}-${cur === i ? "on" : "off"}`}
                    onAnimationEnd={() => auto && i === cur && show((cur + 1) % HOME_DEMOS.length)}
                  />
                </button>
              ))}
              <span className="shint">press 1–5</span>
            </div>
          </div>
        </div>
      </section>

      <section className="demo" id="demo" aria-label="Examples">
        <div className="wrap">
          <div className={`stage-wrap ${paused ? "paused" : ""}`} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
            <div className={`stage ${instant ? "instant" : ""}`}>
              {HOME_DEMOS.map((d, i) => (
                <Pane key={d.slug} d={homePane(d, ctlFor(i))} on={i === cur} instant={instant} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Directory skills={skills} agent={agent} onReady={setReveal} lastKey={lastKey} />
    </>
  );
}
