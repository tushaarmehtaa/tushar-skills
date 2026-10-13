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
const FOOT = W / 2; // the feet sit in the middle of the cell
const SPEED = 80; // px per second
const HOP_MS = 420;
const START_X = 16;

const sum = (s: Seq) => s.reduce((t, [, ms]) => t + ms, 0);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * The pixel astronaut living on top of an install bar: walks, dances, waves on hover, cheers on copy.
 * With `upper` and `lower`, it walks on the `upper` pieces (the install tabs) and hops down onto
 * `lower` (the command bar) where the upper pieces end, so it never walks on air.
 */
export function MascotBar({ children, className = "", upper, lower }: { children: ReactNode; className?: string; upper?: string; lower?: string }) {
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
    let y = 0;
    let anim: Animation | null = null;
    let frameTimer = 0;
    let brainTimer = 0;
    let running = false;
    let busy = false; // hover or cheer owns the mascot
    let waving = false;
    let airborne = false;
    let gen = 0; // bumps whenever the current plan is abandoned
    const alive = (g: number) => g === gen && running && !busy;

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
    const wait = (ms: number) => new Promise<void>((r) => (brainTimer = window.setTimeout(r, ms)));
    const at = (px: number, py: number) => `translate(${px}px,${py}px)`;
    const glide = (x1: number, y1: number, ms: number, easing = "linear", peak?: [number, number]) => {
      const frames: Keyframe[] = [{ transform: at(x, y) }, ...(peak ? [{ transform: at(...peak), offset: 0.45 }] : []), { transform: at(x1, y1) }];
      anim?.cancel();
      bd.style.transform = at(x1, y1);
      anim = bd.animate(frames, { duration: ms, easing });
      x = x1;
      y = y1;
      return anim.finished.then(
        () => undefined,
        () => undefined,
      );
    };
    const hold = () => {
      // Stop exactly where it is, mid-walk included.
      const m = new DOMMatrixReadOnly(getComputedStyle(bd).transform);
      anim?.cancel();
      x = m.m41;
      y = m.m42;
      bd.style.transform = at(x, y);
    };

    // Where the ground is, measured fresh each trip so resizes and tab changes are handled.
    const ground = () => {
      const lr = ln.getBoundingClientRect();
      const tops = upper ? Array.from(ln.querySelectorAll(upper)).map((n) => n.getBoundingClientRect()) : [];
      const low = lower ? ln.querySelector(lower)?.getBoundingClientRect() : undefined;
      const width = ln.clientWidth;
      if (!tops.length || !low) return { width, edge: width, drop: 0 };
      return { width, edge: Math.max(...tops.map((r) => r.right)) - lr.left, drop: low.top - tops[0].top };
    };

    const walk = async (to: number, g: number) => {
      if (!alive(g) || Math.abs(to - x) < 1) return;
      play(WALK, true);
      await glide(to, y, (Math.abs(to - x) / SPEED) * 1000);
    };
    const hop = async (to: number, toY: number, g: number) => {
      if (!alive(g)) return;
      play([[F.squat, 140]], false);
      await wait(140);
      if (!alive(g)) return;
      airborne = true;
      setFrame(F.jump);
      await glide(to, toY, HOP_MS, "ease-in-out", [(x + to) / 2, Math.min(y, toY) - 4]);
      airborne = false;
      if (!alive(g)) return;
      play([[F.land, 160]], false);
      await wait(160);
    };
    const travel = async (to: number, g: number) => {
      const { edge, drop } = ground();
      const levelOf = (px: number) => (px + FOOT <= edge ? 0 : drop);
      if (Math.abs(levelOf(to) - y) < 1) return walk(to, g);
      const top = edge - FOOT - 6; // feet just inside the last tab
      const bottom = edge - FOOT + 30; // feet clear of the tab edge, down on the bar
      if (y < drop / 2) {
        await walk(top, g);
        await hop(bottom, drop, g);
      } else {
        await walk(bottom, g);
        await hop(top, 0, g);
      }
      await walk(to, g);
    };

    const live = async (g: number) => {
      while (alive(g)) {
        play(IDLE, true);
        await wait(rand(2500, 5000));
        if (!alive(g)) return;
        const max = Math.max(0, ground().width - W);
        let to = rand(0, max);
        if (Math.abs(to - x) < 60) to = x > max / 2 ? rand(0, max / 3) : rand((max * 2) / 3, max);
        await travel(to, g);
        if (!alive(g)) return;
        if (Math.random() < 0.45) {
          play(DANCE, false);
          await wait(sum(DANCE));
        }
      }
    };
    const resume = () => {
      if (!running || busy) return;
      gen++;
      live(gen);
    };
    const start = () => {
      if (running) return;
      running = true;
      resume();
    };
    const stop = () => {
      running = false;
      gen++;
      window.clearTimeout(brainTimer);
      window.clearTimeout(frameTimer);
      if (airborne) {
        // Land where the hop was heading instead of freezing in the air.
        anim?.cancel();
        airborne = false;
      } else hold();
    };

    api.current = {
      wave(on) {
        if (on) {
          if (airborne) return;
          busy = waving = true;
          gen++;
          window.clearTimeout(brainTimer);
          hold();
          play(WAVE, true);
        } else if (waving) {
          busy = waving = false;
          resume();
        }
      },
      cheer() {
        if (airborne) return;
        busy = true;
        waving = false;
        gen++;
        window.clearTimeout(brainTimer);
        hold();
        play(CHEER, false);
        brainTimer = window.setTimeout(() => {
          busy = false;
          resume();
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
  }, [upper, lower]);

  return (
    <div
      className={`mascot-lane ${className}`}
      ref={lane}
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest(".copy")) api.current?.cheer();
      }}
    >
      <div className="mascot" ref={body} aria-hidden="true" style={{ transform: `translate(${START_X}px,0px)` }}>
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
