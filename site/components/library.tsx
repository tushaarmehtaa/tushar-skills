"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GroupId } from "@/lib/profiles";

export interface LibrarySkill {
  slug: string;
  href: string;
  outcome: string;
  group: GroupId;
  chat: boolean;
  verified: boolean;
  sampleRun: boolean;
  keywords: string;
}

export interface LibraryGroup {
  id: GroupId;
  label: string;
  purpose: string;
}

type Filter = GroupId | "all";

function score(skill: LibrarySkill, terms: string[]) {
  let total = 0;
  for (const term of terms) {
    if (skill.slug.includes(term)) total += 3;
    else if (skill.outcome.toLowerCase().includes(term)) total += 2;
    else if (skill.keywords.includes(term)) total += 1;
    else return 0;
  }
  return total;
}

export function Library({ skills, groups }: { skills: LibrarySkill[]; groups: LibraryGroup[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Restore ?group= and ?q= after hydration so the full list stays in the server HTML.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const group = params.get("group");
    if (groups.some((g) => g.id === group)) setFilter(group as GroupId);
    setQuery(params.get("q") ?? "");
    setReady(true);
  }, [groups]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
    filter !== "all" ? url.searchParams.set("group", filter) : url.searchParams.delete("group");
    window.history.replaceState(window.history.state, "", url);
  }, [query, filter, ready]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || target.closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      input.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = useMemo(
    () =>
      terms.length
        ? skills
            .map((skill) => ({ skill, s: score(skill, terms) }))
            .filter((r) => r.s > 0)
            .sort((a, b) => b.s - a.s)
            .map((r) => r.skill)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, skills],
  );
  const visibleGroups = filter === "all" ? groups : groups.filter((g) => g.id === filter);

  return (
    <section className="library" aria-label="Skills">
      <div className="filter-bar">
        <div className="group-tabs" role="group" aria-label="Filter by stage">
          {[{ id: "all" as const, label: "All" }, ...groups].map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={filter === g.id && !query}
              onClick={() => {
                setFilter(g.id);
                setQuery("");
              }}
            >
              {g.label}
              <span className="count">{g.id === "all" ? skills.length : skills.filter((s) => s.group === g.id).length}</span>
            </button>
          ))}
        </div>
        <label className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="sr-only">Search skills</span>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd aria-hidden="true">/</kbd>
        </label>
      </div>

      {terms.length ? (
        <div className="group">
          <div className="group-head" aria-live="polite">
            <h2>
              {results.length} {results.length === 1 ? "skill" : "skills"} for “{query.trim()}”
            </h2>
          </div>
          {results.length ? (
            <ul className="rows">{results.map((skill) => <Row key={skill.slug} skill={skill} />)}</ul>
          ) : (
            <div className="empty">
              <p>Nothing matches that. Try a job instead of a tool, like “launch”, “payments” or “copy”.</p>
              <button type="button" onClick={() => setQuery("")}>Clear search</button>
            </div>
          )}
        </div>
      ) : (
        visibleGroups.map((g) => {
          const items = skills.filter((s) => s.group === g.id);
          return (
            <div className="group" key={g.id} id={`group-${g.id}`}>
              <div className="group-head">
                <h2>{g.label}</h2>
                <p>{g.purpose}</p>
                <span className="count">{items.length} skills</span>
              </div>
              <ul className="rows">{items.map((skill) => <Row key={skill.slug} skill={skill} />)}</ul>
            </div>
          );
        })
      )}
    </section>
  );
}

function Row({ skill }: { skill: LibrarySkill }) {
  return (
    <li>
      <Link href={skill.href} className="row">
        <span className="row-name">/{skill.slug}</span>
        <span className="row-outcome">{skill.outcome}</span>
        <span className="row-meta">
          {skill.verified && <span className="chip chip-good">Verified in Claude Code</span>}
          {!skill.verified && skill.sampleRun && <span className="chip">Sample run</span>}
          {skill.chat && <span className="chip chip-quiet">Chat too</span>}
        </span>
        <svg className="row-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </li>
  );
}
