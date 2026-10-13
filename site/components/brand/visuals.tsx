"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Wipe } from "./wipe";
import { SkillIcon } from "./skill-icon";

export interface WipeCtl { active: boolean; onPick?: () => void; viaKey?: () => boolean }
const noCtl: WipeCtl = { active: true };

const Slop = ({ children }: { children: ReactNode }) => <span className="slop">{children}</span>;

export function SlopViz({ ctl = noCtl }: { ctl?: WipeCtl }) {
  return (
    <Wipe className="cmp" {...ctl}>
      <div className="card before">
        <span className="pill">✨ Introducing Tallyroom</span>
        <h3><Slop>Revolutionize</Slop> the Way You Manage Shared Expenses</h3>
        <p>
          <Slop>Unlock the power</Slop> of <Slop>seamless</Slop>, <Slop>AI-driven</Slop> expense splitting. Tallyroom is the <Slop>all-in-one platform</Slop> that <Slop>empowers</Slop> you to <Slop>effortlessly elevate</Slop> your financial harmony.
        </p>
        <div className="btns"><span>Get Started Today 🚀</span><span>Learn More</span></div>
        <div className="wire"><i style={{ width: "80%" }} /><i style={{ width: "60%" }} /><i style={{ width: "70%" }} /><i style={{ width: "40%" }} /></div>
      </div>
      <div className="card after">
        <div className="top"><b>Tallyroom</b><span>Pricing · Dashboard</span></div>
        <h3>Track shared bills and see who owes whom.</h3>
        <p>Log what each person paid, split it between the people it was for, and Tallyroom keeps a running balance for the whole group. Free for one group of up to four people.</p>
        <div className="btns"><span>Compare plans</span><span>See a sample group</span></div>
        <table>
          <tbody>
            <tr><th>DATE</th><th>EXPENSE</th></tr>
            <tr><td>Oct 1</td><td>Groceries — Nature&apos;s Basket</td></tr>
            <tr><td>Sep 30</td><td>Electricity bill (Sept)</td></tr>
            <tr><td>Sep 28</td><td>Wi-Fi — ACT Fibernet</td></tr>
            <tr><td>Sep 27</td><td>Dinner at Toit</td></tr>
          </tbody>
        </table>
      </div>
      <div className="sticker" style={{ right: -18, bottom: 96, transform: "rotate(3deg)" }}>3 MB wireframe → table</div>
    </Wipe>
  );
}

const ROWS: [string, string][] = [["Oct 1", "Groceries — Nature's Basket"], ["Sep 30", "Electricity bill (Sept)"], ["Sep 28", "Wi-Fi — ACT Fibernet"], ["Sep 27", "Dinner at Toit"]];
const sk = (w: number): CSSProperties => ({ width: w });

/** Schematic rebuilt from the run's measurements (984px page on a 320px phone, then the fix). */
export function MfViz() {
  return (
    <>
      <div className="mf">
        <div className="mfcol">
          <span className="bdg bad" aria-hidden="true">✗</span>
          <div className="mfph before" role="img" aria-label="Before: the page is 984px wide and scrolls sideways on a phone">
            <div className="scr"><div className="mf-page">
              <div className="nv"><b>Tallyroom</b><span>Home</span><span>Pricing</span><span>Dashboard</span><span>FAQ</span><span>Groups</span><span>Activity</span><span>For Teams</span></div>
              <h5>Flat 4B — Indiranagar</h5>
              <table>
                <tbody>
                  <tr><th style={{ width: 92 }}>DATE</th><th style={{ width: 250 }}>EXPENSE</th><th style={{ width: 130 }}>PAID BY</th><th style={{ width: 190 }}>SPLIT BETWEEN</th><th style={{ width: 110 }}>AMOUNT</th><th>ACTIONS</th></tr>
                  {ROWS.map((r) => (
                    <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><i className="sk" style={sk(60)} /></td><td><i className="sk" style={sk(120)} /></td><td><i className="sk" style={sk(64)} /></td><td><span className="tb">Edit</span><span className="tb">Delete</span></td></tr>
                  ))}
                </tbody>
              </table>
              <span className="tag20" style={{ left: 812, top: 116 }}>20px taps</span>
            </div><div className="scrollbar"><i /></div></div>
          </div>
          <div className="meas"><div className="big bad"><s>984px</s></div><div className="rule bad"><i /></div><div className="cap">scrolls sideways</div></div>
        </div>
        <div className="mfcol">
          <span className="bdg ok" aria-hidden="true">✓</span>
          <div className="mfph after" role="img" aria-label="After: everything fits in 320px, tables scroll in their own box">
            <div className="scr"><div className="mf-page">
              <div className="nv"><b>Tallyroom</b><span /></div>
              <h5>Flat 4B — Indiranagar</h5>
              {ROWS.slice(0, 3).map((r, i) => (
                <div className="card2" key={r[0]}>
                  <div className="t">{r[1]}<em>{r[0]}</em></div>
                  <i className="sk" />
                  <div className="bt"><i>Edit</i><i>Delete</i></div>
                  {i === 0 && <span className="tag44">44px taps</span>}
                </div>
              ))}
            </div></div>
          </div>
          <div className="meas"><div className="big">320px ✓</div><div className="rule" /><div className="cap">fits. tables scroll in their own box</div></div>
        </div>
      </div>
      <div className="note">schematic rebuilt from the run&apos;s measurements</div>
    </>
  );
}

export function ImgWipe({ before, after, tl = "before", tr = "after", ctl = noCtl }: { before: string; after: string; tl?: string; tr?: string; ctl?: WipeCtl }) {
  return (
    <Wipe className="wimg" {...ctl}>
      <div className="frame">
        <div className="bar3"><i /><i /><i /></div>
        <div className="layers">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="b" src={before} alt="" loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="a" src={after} alt="" loading="lazy" />
        </div>
        <span className="v-tag l">{tl}</span>
        <span className="v-tag r">{tr}</span>
      </div>
    </Wipe>
  );
}

export interface Reason { tone: string; title: string; text?: string }
export function VerdictViz({ reasons, stamp = "BLOCKED", go = true }: { reasons: Reason[]; stamp?: string; go?: boolean }) {
  return (
    <div className={`v-verdict ${go ? "go" : ""}`}>
      <div className="stamp">{stamp}</div>
      <ul className="v-reasons">
        {reasons.map((r) => (
          <li key={r.title} className={r.tone}><b>{r.title}</b>{r.text && <span>{r.text}</span>}</li>
        ))}
      </ul>
    </div>
  );
}

/** `code` and **bold** from the proof excerpts, rendered as nodes (no HTML injection). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? <code key={i}>{p.slice(1, -1)}</code>
        : p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

export function ExcerptViz({ items }: { items: string[] }) {
  return (
    <ul className="exc">
      {items.slice(0, 4).map((t) => (
        <li key={t}><Inline text={t} /></li>
      ))}
    </ul>
  );
}

export function SingleFrame({ src }: { src: string }) {
  return (
    <div className="wimg">
      <div className="frame">
        <div className="bar3"><i /><i /><i /></div>
        <div className="layers">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src} alt="" loading="lazy" style={{ position: "static" }} /></div>
      </div>
    </div>
  );
}

export function OgPair({ a, b }: { a: string; b: string }) {
  return (
    <div className="two2">
      {/* eslint-disable @next/next/no-img-element */}
      <div className="og"><img src={a} alt="" loading="lazy" /></div>
      <div className="og"><img src={b} alt="" loading="lazy" /></div>
    </div>
  );
}

const CHECK = (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
);

export interface PaneData {
  slug: string;
  ask: string;
  said: string;
  ok: string[];
  meta: string[];
  /** Built with `go` once the result should appear and start playing. */
  viz: (go: boolean) => ReactNode;
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One demo, played like a real session: the request is typed at a human pace, the skill kicks in,
 * its checks tick off, then the result lands. Phases: 0 typing, 1 skill, 2 checks, 3 result, 4 done.
 * Starts when the pane is on screen. Keyboard switches and reduced motion skip straight to the end.
 */
export function Pane({ d, on, instant = false, index, project = "tallyroom" }: { d: PaneData; on: boolean; instant?: boolean; index?: number; project?: string }) {
  const root = useRef<HTMLDivElement>(null);
  // Decided while rendering: passive effects can run after the instant flag has already been cleared.
  const wasOn = useRef(false);
  const skip = useRef(false);
  if (on && !wasOn.current) skip.current = instant;
  if (!on) skip.current = false;
  wasOn.current = on;
  const [seen, setSeen] = useState(false);
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el || !on) return setSeen(false);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [on]);

  useEffect(() => {
    if (!on) {
      setPhase(0);
      setTyped(0);
      return;
    }
    if (skip.current || reducedMotion()) {
      setTyped(d.ask.length);
      setPhase(4);
      return;
    }
    if (!seen) return;
    let dead = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(() => !dead && fn(), ms));
    setPhase(0);
    setTyped(0);
    let i = 0;
    const tick = () => {
      i++;
      setTyped(i);
      if (i < d.ask.length) {
        const ch = d.ask[i - 1];
        later(tick, ch === "." || ch === "," ? 90 : 7 + Math.random() * 12);
      } else {
        later(() => setPhase(1), 200);
        later(() => setPhase(2), 800);
        later(() => setPhase(3), 1600);
        later(() => setPhase(4), 2200);
      }
    };
    later(tick, 250);
    return () => {
      dead = true;
      timers.forEach(clearTimeout);
    };
  }, [on, seen, d.ask]);

  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 5}deg`);
    e.currentTarget.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 4}deg`);
  };

  return (
    <div ref={root} className={`pane ${on ? "on" : ""} ${[1, 2, 3, 4].filter((n) => phase >= n).map((n) => `s${n}`).join(" ")}`} data-i={index} role="tabpanel" aria-hidden={!on}>
      <div className="chat">
        <div className="awin">
          <div className="abar"><i /><i /><i /><span>claude · {project}</span></div>
          <div className="abody">
            <p className="aprompt" aria-label={d.ask}>
              <span className="ghost" aria-hidden="true">❯ {d.ask}</span>
              <span className="live" aria-hidden="true">
                <span className="pr">❯</span> {d.ask.slice(0, typed)}
                <span className={`caret ${typed >= d.ask.length ? "idle" : ""}`} />
              </span>
            </p>
            <div className="using">
              <i className="spin" aria-hidden="true" />
              <i className="ico"><SkillIcon slug={d.slug} /></i>
              <span>Using <b>/{d.slug}</b></span>
            </div>
            {d.ok.length > 0 && (
              <ul className="ok-list">
                {d.ok.map((t, k) => (
                  <li key={t} style={{ ["--k" as string]: k }}><b>{CHECK}</b>{t}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="said">{d.said}</div>
        <div className="meta">
          {d.meta.map((m, i) => (<Fragment key={m}>{i > 0 && <i>·</i>}<span>{m}</span></Fragment>))}
        </div>
      </div>
      <div className="viz" onPointerMove={tilt} onPointerLeave={(e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }}>
        <span className={`vz-chip ${phase >= 3 ? "done" : ""}`} aria-hidden="true">
          <i />
          {phase >= 3 ? `done · ${d.slug}` : `running /${d.slug}`}
        </span>
        <div className="vzin">{d.viz(phase >= 3)}</div>
        <span className="vz-slash" aria-hidden="true" />
      </div>
    </div>
  );
}
