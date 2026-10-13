"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SkillIcon } from "./skill-icon";
import { skillHref } from "@/lib/canvas";

interface Ring { rx: number; ry: number; n: number; size: number; speed: number; dir: 1 | -1 }
interface Tile { slug: string; ring: Ring; phase: number; wob: number }

/** Half the universe: 35 skill icons on three orbits above a crisp horizon. Hover an icon to pause. */
export function FooterScene({ skills }: { skills: { slug: string; flow: string }[] }) {
  const scene = useRef<HTMLDivElement>(null);
  const astro = useRef<HTMLButtonElement>(null);
  const tileEls = useRef<(HTMLAnchorElement | null)[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [decor, setDecor] = useState<{ tw: { x: number; y: number; d: number }[]; dust: { x: number; y: number; s: number }[] }>({ tw: [], dust: [] });
  const [spin, setSpin] = useState(false);
  const sim = useRef({ sMul: 1, sTarget: 1, mx: 0, my: 0, ax: 0, ay: 0, th: 0, visible: false });

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const measure = () => setDims({ w: el.clientWidth, h: el.clientHeight });
    measure();
    let t: number;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(measure, 120);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => {
    const { w, h } = dims;
    if (!w) return null;
    const wide = w >= 900;
    const cx = w / 2;
    const cy = h - (wide ? 150 : 100);
    const ryMax = cy - (wide ? 40 : 30);
    const rings: Ring[] = wide
      ? [
          { rx: w * 0.42, ry: ryMax, n: 14, size: 62, speed: 0.00004, dir: 1 },
          { rx: w * 0.31, ry: ryMax * 0.74, n: 12, size: 56, speed: 0.00006, dir: -1 },
          { rx: w * 0.2, ry: ryMax * 0.48, n: 9, size: 50, speed: 0.00008, dir: 1 },
        ]
      : [
          { rx: w * 0.44, ry: ryMax, n: 11, size: 44, speed: 0.00005, dir: 1 },
          { rx: w * 0.28, ry: ryMax * 0.62, n: 8, size: 38, speed: 0.00008, dir: -1 },
        ];
    const tiles: Tile[] = [];
    let idx = 0;
    rings.forEach((ring, ri) => {
      for (let i = 0; i < ring.n && idx < skills.length; i++, idx++) {
        tiles.push({ slug: skills[idx].slug, ring, phase: (i / ring.n) * Math.PI * 2 + ri * 0.7, wob: ((idx * 37) % 60) / 10 });
      }
    });
    const aw = wide ? 270 : 170;
    return { w, h, cx, cy, rings, tiles, aw, astroTop: cy - aw * (wide ? 0.8 : 0.72) };
  }, [dims, skills]);

  useEffect(() => {
    if (!layout) return;
    setDecor({
      tw: Array.from({ length: 9 }, () => ({ x: Math.random() * layout.w, y: Math.random() * (layout.h - 80), d: Math.random() * 3 })),
      dust: Array.from({ length: 40 }, () => ({ x: Math.random() * layout.w, y: Math.random() * (layout.h - 60), s: 1.5 + Math.random() * 1.8 })),
    });
  }, [layout]);

  useEffect(() => {
    const el = scene.current;
    if (!el || !layout) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const S = sim.current;
    const io = new IntersectionObserver((es) => (S.visible = es[0].isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    let raf = 0;
    let last = performance.now();
    const place = (now: number, dt: number) => {
      S.sMul += (S.sTarget - S.sMul) * Math.min(1, dt / 220);
      S.th += dt * S.sMul;
      layout.tiles.forEach((t, i) => {
        const node = tileEls.current[i];
        if (!node) return;
        const ang = t.phase + S.th * t.ring.speed * t.ring.dir;
        const x = layout.cx + t.ring.rx * Math.cos(ang);
        const y = layout.cy + t.ring.ry * Math.sin(ang);
        const depth = (Math.sin(ang) + 1) / 2;
        const sc = 0.86 + depth * 0.22;
        const rot = Math.sin(now * 0.0009 + t.wob) * 6;
        node.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg) scale(${sc})`;
        node.style.zIndex = depth > 0.5 ? "10" : "1";
      });
      S.ax += (S.mx * 20 - S.ax) * 0.06;
      S.ay += (S.my * 10 - S.ay) * 0.06;
      if (astro.current) astro.current.style.transform = `translate(${S.ax}px,${S.ay}px)`;
    };
    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (S.visible) place(now, dt);
      raf = requestAnimationFrame(frame);
    };
    place(performance.now(), 0);
    if (reduced) S.visible = true;
    else raf = requestAnimationFrame(frame);

    const shoot = window.setInterval(() => {
      if (!S.visible || reduced) return;
      const s = document.createElement("i");
      s.className = "shoot";
      s.style.cssText = `left:${Math.random() * layout.w * 0.5}px;top:${Math.random() * layout.h * 0.35}px`;
      el.appendChild(s);
      s.animate(
        [
          { opacity: 0, transform: "translate(0,0) rotate(24deg)" },
          { opacity: 1, offset: 0.2 },
          { opacity: 0, transform: "translate(420px,190px) rotate(24deg)" },
        ],
        { duration: 1100, easing: "cubic-bezier(0.23,1,0.32,1)" },
      ).onfinish = () => s.remove();
    }, 6500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(shoot);
      io.disconnect();
    };
  }, [layout]);

  function sparkBurst() {
    const el = scene.current;
    const a = astro.current;
    if (!el || !a || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = a.getBoundingClientRect();
    const sr = el.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i");
      s.className = "spark";
      s.style.cssText = `left:${r.left - sr.left + r.width / 2}px;top:${r.top - sr.top + r.height / 2}px;z-index:20`;
      el.appendChild(s);
      const ang = Math.random() * Math.PI * 2;
      const d = 90 + Math.random() * 110;
      s.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${Math.cos(ang) * d}px,${Math.sin(ang) * d}px) scale(.3)`, opacity: 0 },
        ],
        { duration: 900, easing: "cubic-bezier(0.23,1,0.32,1)" },
      ).onfinish = () => s.remove();
    }
  }

  const flowOf = (slug: string) => skills.find((s) => s.slug === slug)?.flow ?? "";

  return (
    <div
      className="scene"
      ref={scene}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        sim.current.mx = (e.clientX - r.left - r.width / 2) / r.width;
        sim.current.my = (e.clientY - r.top - r.height / 2) / r.height;
      }}
      onMouseOver={(e) => {
        if ((e.target as HTMLElement).closest(".tile")) sim.current.sTarget = 0;
      }}
      onMouseOut={(e) => {
        if ((e.target as HTMLElement).closest(".tile")) sim.current.sTarget = 1;
      }}
    >
      {layout && (
        <>
          {decor.dust.map((d, i) => (
            <i key={`d${i}`} className="dust" style={{ width: d.s, height: d.s, left: d.x, top: d.y }} />
          ))}
          <svg className="orbits" viewBox={`0 0 ${layout.w} ${layout.h}`} preserveAspectRatio="none" aria-hidden="true">
            {layout.rings.map((r, i) => (
              <ellipse key={i} cx={layout.cx} cy={layout.cy} rx={r.rx} ry={r.ry} fill="none" stroke={["#D3CCB6", "#E0DAC8", "#E8E3D3"][i]} strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
            ))}
          </svg>
          <button
            type="button"
            ref={astro}
            className={`astro ${spin ? "spin" : ""}`}
            style={{ width: layout.aw, marginLeft: -layout.aw / 2, top: layout.astroTop, marginTop: 0 }}
            aria-label="The slashskills astronaut. Click to spin it."
            onClick={() => {
              setSpin(false);
              requestAnimationFrame(() => setSpin(true));
              window.setTimeout(() => setSpin(false), 950);
              sparkBurst();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/astronaut.png" alt="" width={579} height={564} />
          </button>
          {layout.tiles.map((t, i) => (
            <Link
              key={t.slug}
              href={skillHref(t.slug)}
              ref={(n) => {
                tileEls.current[i] = n;
              }}
              className="tile"
              style={{ width: t.ring.size, height: t.ring.size, margin: `${-t.ring.size / 2}px 0 0 ${-t.ring.size / 2}px` }}
            >
              <SkillIcon slug={t.slug} />
              <span className="tip">
                /{t.slug}
                <em>{flowOf(t.slug)}</em>
              </span>
            </Link>
          ))}
          {decor.tw.map((t, i) => (
            <i key={`t${i}`} className="tw" style={{ left: t.x, top: t.y, animationDelay: `${t.d}s` }} />
          ))}
        </>
      )}
    </div>
  );
}
