"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { SkillIcon } from "./skill-icon";
import { RowCopy } from "./copy-button";
import { KEY_EVENT } from "./key-nav";
import { generateInstallCommand } from "@/lib/agents";
import { skillHref } from "@/lib/canvas";
import type { Agent, BrandSkill } from "@/lib/brand-shared";

const GROUPS = ["all", "shape", "build", "ship", "grow"] as const;
type Group = (typeof GROUPS)[number];
const FIRST_PAGE = 12;

export function Directory({
  skills,
  agent,
  onReady,
  lastKey,
}: {
  skills: BrandSkill[];
  agent: Agent;
  onReady: (reveal: (slug: string) => void) => void;
  lastKey: MutableRefObject<number>;
}) {
  const [group, setGroup] = useState<Group>("all");
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [line, setLine] = useState({ x: 0, w: 0 });

  const counts = (g: Group) => (g === "all" ? skills.length : skills.filter((s) => s.group === g).length);
  const q = query.trim().toLowerCase();
  const relevance = (s: BrandSkill) => (s.slug === q ? 4 : s.slug.startsWith(q) ? 3 : s.slug.includes(q) ? 2 : 0);
  const matches = skills
    .filter((s) => (group === "all" || s.group === group) && (!q || `${s.slug} ${s.outcome} ${s.keywords}`.toLowerCase().includes(q)))
    .sort((a, b) => (q ? relevance(b) - relevance(a) : 0));
  const limited = group === "all" && !q && !expanded;
  const items = limited ? matches.slice(0, FIRST_PAGE) : matches;
  const rank = (slug: string) => skills.findIndex((s) => s.slug === slug) + 1;

  const openSearch = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => input.current?.focus());
  }, []);

  const reveal = useCallback(
    (slug: string) => {
      const present = document.getElementById(`skill-${slug}`);
      if (!present) {
        setGroup("all");
        setExpanded(true);
        setQuery("");
        setInstant(true);
      }
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(`skill-${slug}`);
          if (!el) return;
          el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
          setFlash(null);
          requestAnimationFrame(() => setFlash(slug));
        }),
      );
    },
    [],
  );
  useEffect(() => {
    onReady(reveal);
  }, [onReady, reveal]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get("group");
    if (g && (GROUPS as readonly string[]).includes(g)) setGroup(g as Group);
    const initial = params.get("q");
    if (initial) {
      setQuery(initial);
      setOpen(true);
      setInstant(true);
    } else if (params.get("search")) openSearch();
    const onKey = (e: Event) => {
      const d = (e as CustomEvent).detail as { type: string };
      if (d.type === "search") openSearch();
      if (d.type === "load") {
        setExpanded(true);
        setInstant(true);
      }
    };
    window.addEventListener(KEY_EVENT, onKey);
    return () => window.removeEventListener(KEY_EVENT, onKey);
  }, [openSearch]);

  const measure = useCallback(() => {
    const t = tabs.current[group];
    if (t) setLine({ x: t.offsetLeft, w: t.offsetWidth });
  }, [group]);
  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function syncUrl(next: { group?: Group; q?: string }) {
    const url = new URL(window.location.href);
    if (next.group !== undefined) {
      if (next.group === "all") url.searchParams.delete("group");
      else url.searchParams.set("group", next.group);
    }
    if (next.q !== undefined) {
      if (next.q) url.searchParams.set("q", next.q);
      else url.searchParams.delete("q");
    }
    url.searchParams.delete("search");
    window.history.replaceState(null, "", url);
  }

  function chooseGroup(g: Group) {
    setGroup(g);
    setQuery("");
    setOpen(false);
    setInstant(false);
    syncUrl({ group: g, q: "" });
  }

  const instantNow = instant || (typeof window !== "undefined" && performance.now() - lastKey.current < 400);

  return (
    <section className="dir" id="skills">
      <div className="wrap">
        <aside className="rail">
          <h2>skills</h2>
          <p>Every skill has a page with its requirements and source.</p>
        </aside>
        <div>
          <div className="bar2">
            <div className="ftabs" role="tablist" aria-label="Skill groups">
              {GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="tab"
                  className="ftab"
                  aria-selected={group === g}
                  ref={(n) => {
                    tabs.current[g] = n;
                  }}
                  onClick={() => chooseGroup(g)}
                >
                  {g}
                  <sup>{counts(g)}</sup>
                </button>
              ))}
              <i className="uline" style={{ width: line.w, transform: `translateX(${line.x}px)` }} />
            </div>
            <label className={`srch ${open || query ? "open" : ""}`} onClick={() => !open && openSearch()}>
              <b>[/]</b>
              <span>Search</span>
              <input
                ref={input}
                type="search"
                role="searchbox"
                placeholder="type to filter"
                aria-label="Search skills"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setInstant(true);
                  syncUrl({ q: e.target.value.trim() });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setQuery("");
                    syncUrl({ q: "" });
                    setOpen(false);
                    input.current?.blur();
                  }
                }}
                onBlur={() => !query && setOpen(false)}
              />
            </label>
          </div>
          <div className={`list ${instantNow ? "instant" : ""}`} role="tabpanel">
            {items.length ? (
              items.map((s, i) => (
                <div
                  key={`${group}:${s.slug}`}
                  className={`v-row ${flash === s.slug ? "flash" : ""}`}
                  id={`skill-${s.slug}`}
                  style={{ ["--i" as string]: Math.min(i, 14) }}
                  onAnimationEnd={(e) => e.animationName === "rowFlash" && setFlash(null)}
                >
                  <span className="ix">{String(rank(s.slug)).padStart(2, "0")}</span>
                  <span className="ico"><SkillIcon slug={s.slug} /></span>
                  <span className="nm">
                    <Link className="rl" href={skillHref(s.slug)}>{s.slug}</Link>
                    {s.isNew && <span className="badge">NEW</span>}
                    {s.chat && <span className="badge tagchat" title="Also works in the Claude app">chat too</span>}
                    {s.popular && <span className="badge pop" title={s.installs ? `${s.installs} installs` : undefined}>POPULAR</span>}
                  </span>
                  <span className="ds">{s.outcome}</span>
                  <span className="fl">{s.flow}</span>
                  <RowCopy slug={s.slug} agent={agent} text={generateInstallCommand({ skill: s.slug, agent })} />
                </div>
              ))
            ) : (
              <div className="v-empty">
                <p>Nothing matches that.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    syncUrl({ q: "" });
                    setOpen(false);
                  }}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
          {limited && (
            <div className="more">
              <button type="button" onClick={() => { setExpanded(true); setInstant(false); }}>Load more</button>
              <span>
                <span className="keyhint">Press L to load more · </span>
                {matches.length - FIRST_PAGE} left
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
