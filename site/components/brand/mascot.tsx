"use client";

import { useEffect, useRef, type ReactNode } from "react";

// /brand/mascot-sheet.png: 16 poses in 4 columns of 32x36 cells. Source and generator: workspace/redesign/mascot.
const F = { idle: 0, blink: 1, stepL: 2, stepR: 3, waveHigh: 5, waveOut: 6, handsUp: 7, armsOut: 8, disco: 9, grooveL: 10, grooveR: 11, squat: 12, jump: 13, land: 14, look: 15 };
type Seq = [frame: number, ms: number][];
const IDLE: Seq = [[F.idle, 1400], [F.blink, 140], [F.idle, 900], [F.look, 700]];
const WALK: Seq = [[F.stepL, 140], [F.idle, 110], [F.stepR, 140], [F.idle, 110]];
const DANCE: Seq = [[F.armsOut, 260], [F.disco, 260], [F.grooveL, 220], [F.grooveR, 220], [F.grooveL, 220], [F.grooveR, 220], [F.squat, 200], [F.handsUp, 320], [F.disco, 260], [F.armsOut, 260]];
const WAVE: Seq = [[F.waveHigh, 260], [F.waveOut, 260]];
const CHEER: Seq = [[F.squat, 120], [F.jump, 360], [F.land, 140], [F.handsUp, 700]];
const SCALE = 2;
const W = 32 * SCALE;
const H = 36 * SCALE;
const SPEED = 70; // px per second
const START_X = 16;

const sum = (s: Seq) => s.reduce((t, [, ms]) => t + ms, 0);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/** The pixel astronaut living on top of an install bar: walks, dances, waves on hover, cheers on copy. */
export function MascotBar({ children }: { children: ReactNode }) {
  const lane = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const api = useRef<{ wave: (on: boolean) => void; cheer: () => void } | null>(null);

  useEffect(() => {
    const ln = lane.current;
    const bd = body.current;
    const sp = sprite.current;
    if (!ln || !bd || !sp || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = START_X;
    let frameTimer = 0;
    let brainTimer = 0;
    let running = false;
    let busy = false; // hover or cheer owns the mascot

    const setFrame = (i: number) => {
      sp.style.backgroundPosition = `${-(i % 4) * W}px ${-Math.floor(i / 4) * H}px`;
    };
    const play = (seq: Seq, loop: boolean) => {
      window.clearTimeout(frameTimer);
      let i = 0;
      const step = () => {
        if (i === seq.length) {
          if (!loop) return;
          i = 0;
        }
        const [f, ms] = seq[i++];
        setFrame(f);
        frameTimer = window.setTimeout(step, ms);
      };
      step();
    };
    const hold = () => {
      // Stop mid-walk where it stands.
      x = new DOMMatrixReadOnly(getComputedStyle(bd).transform).m41;
      bd.style.transition = "none";
      bd.style.transform = `translateX(${x}px)`;
    };
    const next = (phase: "idle" | "walk" | "dance") => {
      if (!running || busy) return;
      if (phase === "idle") {
        play(IDLE, true);
        brainTimer = window.setTimeout(() => next("walk"), rand(2500, 5000));
      } else if (phase === "walk") {
        const max = Math.max(0, ln.clientWidth - W);
        let to = rand(0, max);
        if (Math.abs(to - x) < 60) to = x > max / 2 ? rand(0, max / 3) : rand((max * 2) / 3, max);
        const dur = Math.abs(to - x) / SPEED;
        bd.style.transition = `transform ${dur}s linear`;
        bd.style.transform = `translateX(${to}px)`;
        x = to;
        play(WALK, true);
        brainTimer = window.setTimeout(() => next(Math.random() < 0.45 ? "dance" : "idle"), dur * 1000);
      } else {
        play(DANCE, false);
        brainTimer = window.setTimeout(() => next("idle"), sum(DANCE));
      }
    };
    const start = () => {
      if (running) return;
      running = true;
      next("idle");
    };
    const stop = () => {
      running = false;
      window.clearTimeout(brainTimer);
      window.clearTimeout(frameTimer);
      hold();
    };

    api.current = {
      wave(on) {
        if (on) {
          busy = true;
          window.clearTimeout(brainTimer);
          hold();
          play(WAVE, true);
        } else {
          busy = false;
          next("idle");
        }
      },
      cheer() {
        busy = true;
        window.clearTimeout(brainTimer);
        hold();
        play(CHEER, false);
        brainTimer = window.setTimeout(() => {
          busy = false;
          next("idle");
        }, sum(CHEER));
      },
    };

    let onScreen = false;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(ln);
    const onVis = () => (onScreen && !document.hidden ? start() : stop());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      stop();
      api.current = null;
    };
  }, []);

  return (
    <div
      className="mascot-lane"
      ref={lane}
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest(".copy")) api.current?.cheer();
      }}
    >
      <div className="mascot" ref={body} aria-hidden="true" style={{ transform: `translateX(${START_X}px)` }}>
        <div
          className="mascot-sprite"
          ref={sprite}
          onPointerEnter={() => api.current?.wave(true)}
          onPointerLeave={() => api.current?.wave(false)}
        />
      </div>
      {children}
    </div>
  );
}
