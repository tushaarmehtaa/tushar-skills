"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// /brand/mascot-sheet.png: 16 poses in 4 columns of 32x36 cells. Source and generator: workspace/redesign/mascot.
const F = { idle: 0, blink: 1, stepL: 2, stepR: 3, waveHigh: 5, waveOut: 6, handsUp: 7, armsOut: 8, disco: 9, grooveL: 10, grooveR: 11, squat: 12, jump: 13, land: 14, look: 15, fly: 16, flyFlicker: 17, swimReach: 18, swimPull: 19, swimGlide: 20, laptop: 21, laptopType: 22, turnRight: 23, back: 24, turnLeft: 25 };
type Seq = [frame: number, ms: number][];
const IDLE: Seq = [[F.idle, 1400], [F.blink, 140], [F.idle, 900], [F.look, 700]];
const WALK: Seq = [[F.stepL, 140], [F.idle, 110], [F.stepR, 140], [F.idle, 110]];
const DANCE: Seq = [[F.armsOut, 260], [F.disco, 260], [F.grooveL, 220], [F.grooveR, 220], [F.grooveL, 220], [F.grooveR, 220], [F.squat, 200], [F.handsUp, 320], [F.disco, 260], [F.armsOut, 260]];
const WAVE: Seq = [[F.waveHigh, 260], [F.waveOut, 260]];
const CHEER: Seq = [[F.squat, 120], [F.jump, 360], [F.land, 140], [F.handsUp, 700]];
const FLY: Seq = [[F.fly, 90], [F.flyFlicker, 90]];
const SWIM: Seq = [[F.swimReach, 240], [F.swimPull, 240], [F.swimGlide, 320]];
const LAPTOP: Seq = [[F.laptop, 220], [F.laptopType, 220]];
const TURN: Seq = [[F.idle, 110], [F.turnRight, 110], [F.back, 110], [F.turnLeft, 110]];
const SPIN: Seq = [...TURN, ...TURN, [F.idle, 200]];
const SCALE = 2;
const W = 32 * SCALE;
const H = 36 * SCALE;
const FOOT = W / 2; // the feet sit in the middle of the cell
const SPEED = 80; // px per second
const HOP_MS = 420;
const FLY_LIFT = 12; // px above the higher level while flying
const SWIM_LIFT = 10;
const START_X = 16;
// Play mode: arrows walk, space jumps, holding up fires the jetpack.
const PLAY_SPEED = 120; // px per second, 1.5x the idle walk
const JUMP_V = 480; // px per second, enough to clear the step from the command bar onto the tabs
const GRAVITY = 1800;
const THRUST = 3000; // upward, while the jetpack fires
const MAX_RISE = 260;
const MAX_FALL = 900;
const CEILING = -40; // px above the tabs
const PLAY_IDLE_MS = 20000;

const sum = (s: Seq) => s.reduce((t, [, ms]) => t + ms, 0);
const frameAt = (s: Seq, t: number) => {
  let left = t % sum(s);
  for (const [f, ms] of s) {
    if (left < ms) return f;
    left -= ms;
  }
  return s[0][0];
};
const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * The pixel astronaut living on top of an install bar: walks, flies, swims, types, spins and dances,
 * waves on hover and cheers on copy.
 * With `upper` and `lower`, it walks on the `upper` pieces (the install tabs) and hops down onto
 * `lower` (the command bar) where the upper pieces end, so it never walks on air.
 * On desktop it is also playable: click it (or Tab to it and press Enter), then arrows walk,
 * space jumps and holding up flies. Esc, clicking away or 20 idle seconds hands it back.
 */
export function MascotBar({ children, className = "", upper, lower }: { children: ReactNode; className?: string; upper?: string; lower?: string }) {
  const lane = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const api = useRef<{ wave: (on: boolean) => void; cheer: () => void } | null>(null);
  const [playable, setPlayable] = useState(false);
  const [playing, setPlaying] = useState(false);

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
    let landing: [number, number] = [x, y]; // where an airborne move comes down
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
      landing = [to, toY];
      airborne = true;
      setFrame(F.jump);
      await glide(to, toY, HOP_MS, "ease-in-out", [(x + to) / 2, Math.min(y, toY) - 4]);
      airborne = false;
      if (!alive(g)) return;
      play([[F.land, 160]], false);
      await wait(160);
    };
    const fly = async (to: number, toY: number, g: number) => {
      if (!alive(g)) return;
      const sky = Math.min(y, toY) - FLY_LIFT;
      landing = [to, toY];
      airborne = true;
      play(FLY, true);
      await glide(x, sky, 280, "ease-out");
      if (alive(g)) await glide(to, sky, Math.max(300, (Math.abs(to - x) / (SPEED * 2.5)) * 1000), "ease-in-out");
      if (alive(g)) await glide(to, toY, 320, "ease-in");
      airborne = false;
      if (!alive(g)) return;
      play([[F.land, 160]], false);
      await wait(160);
    };
    const swim = async (g: number) => {
      if (!alive(g)) return;
      landing = [x, y];
      airborne = true;
      play(SWIM, true);
      await glide(x, y - SWIM_LIFT, 500, "ease-out");
      if (alive(g)) await wait(sum(SWIM) * 2);
      if (alive(g)) await glide(...landing, 500, "ease-in");
      airborne = false;
      if (!alive(g)) return;
      play([[F.land, 160]], false);
      await wait(160);
    };
    const travel = async (to: number, g: number) => {
      const { edge, drop } = ground();
      const levelOf = (px: number) => (px + FOOT <= edge ? 0 : drop);
      const r = Math.random();
      if (Math.abs(levelOf(to) - y) < 1) return Math.abs(to - x) > 150 && r < 0.2 ? fly(to, y, g) : walk(to, g);
      if (r < 0.5) return fly(to, levelOf(to), g);
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
        const r = Math.random();
        if (r < 0.25) {
          play(DANCE, false);
          await wait(sum(DANCE));
        } else if (r < 0.4) {
          play(SPIN, false);
          await wait(sum(SPIN));
        } else if (r < 0.55) {
          play(LAPTOP, true);
          await wait(3600);
        } else if (r < 0.7) {
          await swim(g);
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
      endPlay(false);
      running = false;
      gen++;
      window.clearTimeout(brainTimer);
      window.clearTimeout(frameTimer);
      if (airborne) {
        // Land where the hop, flight or swim was heading instead of freezing in the air.
        anim?.cancel();
        airborne = false;
        [x, y] = landing;
        bd.style.transform = at(x, y);
      } else hold();
    };

    // Play mode. The idle life stops where it stands; a frame loop then moves the astronaut
    // from the keys held, with the tabs as a step: it can walk off their end onto the
    // command bar, and needs a jump or the jetpack to get back up.
    let playing = false;
    let raf = 0;
    let vy = 0;
    let onGround = true;
    let landedAt = -1e9;
    let lastInput = 0;
    let last = 0;
    const held = new Set<string>();
    const canPlay = matchMedia("(hover: hover) and (pointer: fine)").matches;
    setPlayable(canPlay);

    const tick = (now: number) => {
      if (!playing) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (now - lastInput > PLAY_IDLE_MS) return endPlay();
      const { width, edge, drop } = ground();
      const levelAt = (px: number) => (px + FOOT <= edge ? 0 : drop);
      const dir = (held.has("ArrowRight") ? 1 : 0) - (held.has("ArrowLeft") ? 1 : 0);
      const flying = held.has("ArrowUp");

      let nx = Math.min(Math.max(0, x + dir * PLAY_SPEED * dt), Math.max(0, width - W));
      // Below the top of the tabs, their right end is a wall.
      if (y > 0.5 && nx + FOOT <= edge && x + FOOT > edge) nx = edge - FOOT + 0.5;
      x = nx;

      if (onGround && (flying || levelAt(x) > y + 0.5)) onGround = false;
      if (!onGround) {
        vy = Math.min(MAX_FALL, vy + (flying ? GRAVITY - THRUST : GRAVITY) * dt);
        if (flying) vy = Math.max(-MAX_RISE, vy); // the jetpack climbs steadily; a jump is a quick pop
        y += vy * dt;
        if (y < CEILING) {
          y = CEILING;
          vy = Math.max(0, vy);
        }
        const floor = levelAt(x);
        if (y >= floor && vy >= 0) {
          y = floor;
          vy = 0;
          onGround = true;
          landedAt = now;
        }
      }
      bd.style.transform = at(x, y);

      if (!onGround) setFrame(flying ? frameAt(FLY, now) : F.jump);
      else if (now - landedAt < 140) setFrame(F.land);
      else if (dir) setFrame(frameAt(WALK, now));
      else setFrame(F.idle);
      raf = requestAnimationFrame(tick);
    };

    const startPlay = () => {
      if (playing || !running) return;
      playing = busy = true;
      waving = false;
      gen++;
      window.clearTimeout(brainTimer);
      window.clearTimeout(frameTimer);
      if (airborne) {
        anim?.cancel();
        airborne = false;
        [x, y] = landing;
        bd.style.transform = at(x, y);
      } else hold();
      vy = 0;
      onGround = true;
      held.clear();
      last = lastInput = performance.now();
      setFrame(F.idle);
      setPlaying(true);
      raf = requestAnimationFrame(tick);
    };
    const endPlay = (resumeAfter = true) => {
      if (!playing) return;
      playing = busy = false;
      cancelAnimationFrame(raf);
      held.clear();
      if (!onGround) {
        // Let go mid-air: come down where it is instead of hanging there.
        const { edge, drop } = ground();
        y = x + FOOT <= edge ? 0 : drop;
        bd.style.transform = at(x, y);
      }
      setPlaying(false);
      if (resumeAfter) resume();
    };

    const KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", " "];
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!playing) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startPlay();
        }
        return;
      }
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        return endPlay();
      }
      if (!KEYS.includes(e.key)) return;
      e.preventDefault(); // no page scrolling while playing
      lastInput = performance.now();
      if (e.key === " ") {
        if (!e.repeat && onGround) {
          vy = -JUMP_V;
          onGround = false;
        }
      } else held.add(e.key);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      held.delete(e.key);
    };
    const onClick = () => (playing ? endPlay() : startPlay());
    const onBlur = () => endPlay();
    if (canPlay) {
      sp.addEventListener("keydown", onKeyDown);
      sp.addEventListener("keyup", onKeyUp);
      sp.addEventListener("click", onClick);
      sp.addEventListener("blur", onBlur);
    }

    api.current = {
      wave(on) {
        if (on) {
          if (airborne || playing) return;
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
        if (airborne || playing) return;
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
      sp.removeEventListener("keydown", onKeyDown);
      sp.removeEventListener("keyup", onKeyUp);
      sp.removeEventListener("click", onClick);
      sp.removeEventListener("blur", onBlur);
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
      <div className="mascot" ref={body} aria-hidden={playable ? undefined : true} style={{ transform: `translate(${START_X}px,0px)` }}>
        <div
          className="mascot-sprite"
          ref={sprite}
          {...(playable && { role: "button", tabIndex: 0, "aria-label": "Play with the astronaut", "aria-pressed": playing })}
          onPointerEnter={() => api.current?.wave(true)}
          onPointerLeave={() => api.current?.wave(false)}
        />
      </div>
      {playable && (
        <p className="mascot-hint" aria-live="polite" hidden={!playing}>
          ← → walk · space jump · ↑ fly · esc done
        </p>
      )}
      {children}
    </div>
  );
}
