"use client";

import { TrackedLink } from "./tracked-link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useMemo } from "react";
import { SkillLogo } from "./skill-logo";
import {
  filterDirectorySkills,
  getDirectoryCategories,
  type DirectoryFilters,
  type DirectorySkill,
  type SurfaceFilter,
} from "@/lib/skill-directory";

const SURFACE_FILTERS = new Set<SurfaceFilter>(["all", "local", "chat"]);

export function SkillDirectory({ skills }: { skills: readonly DirectorySkill[] }) {
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey || target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categories = useMemo(() => getDirectoryCategories(skills), [skills]);
  const filters = useMemo<DirectoryFilters>(() => {
    const query = searchParams.get("q") ?? "";
    const requestedCategory = searchParams.get("category") ?? "all";
    const requestedSurface = searchParams.get("surface") ?? "all";

    return {
      query,
      category: requestedCategory === "all" || categories.includes(requestedCategory)
        ? requestedCategory
        : "all",
      surface: SURFACE_FILTERS.has(requestedSurface as SurfaceFilter)
        ? requestedSurface as SurfaceFilter
        : "all",
    };
  }, [categories, searchParams]);
  const filteredSkills = filterDirectorySkills(skills, filters);
  const hasFilters = filters.query.trim().length > 0 || filters.category !== "all" || filters.surface !== "all";

  function updateFilters(next: DirectoryFilters) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.query.trim()) params.set("q", next.query); else params.delete("q");
    if (next.category !== "all") params.set("category", next.category); else params.delete("category");
    if (next.surface !== "all") params.set("surface", next.surface); else params.delete("surface");
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  function clearFilters() {
    updateFilters({ query: "", category: "all", surface: "all" });
  }

  return (
    <section className="pb-20" aria-labelledby="skill-index-heading">
      <h2 id="skill-index-heading" className="mb-5 text-xl font-semibold text-[var(--color-heading)]">Skills</h2>

      <div className="mb-3 border-y border-[var(--color-border)]">
        <label className="flex items-center gap-4 py-2">
          <span className="sr-only">Search skills</span>
          <input
            ref={searchRef}
            type="search"
            value={filters.query}
            onChange={(event) => updateFilters({ ...filters, query: event.target.value })}
            placeholder="Find a skill…"
            className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-base text-[var(--color-heading)] outline-none placeholder:text-[var(--color-muted)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-accent)]"
          />
          <kbd aria-hidden="true" className="hidden text-xs text-[var(--color-muted)] sm:block">/</kbd>
        </label>
        <div role="group" aria-label="Skill categories" className="flex gap-5 overflow-x-auto border-t border-[var(--color-border)]">
          {["all", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={filters.category === category}
              onClick={(event) => {
                updateFilters({ ...filters, category });
                event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
              }}
              className={`min-h-11 shrink-0 border-b-2 py-3 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${filters.category === category ? "border-[var(--color-accent)] text-[var(--color-heading)]" : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-heading)]"}`}
            >
              {category === "all" ? "All skills" : category}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-start justify-between gap-x-5 text-xs text-[var(--color-muted)]">
        <p aria-live="polite" aria-atomic="true" className="py-3">
          {filteredSkills.length} {filteredSkills.length === 1 ? "skill" : "skills"}
        </p>
        <div className="flex items-start gap-5">
          {hasFilters ? (
            <button type="button" onClick={clearFilters} className="min-h-11 hover:text-[var(--color-heading)] focus-visible:outline focus-visible:outline-[var(--color-accent)]">Clear filters</button>
          ) : null}
          <details className="max-w-56">
            <summary className="min-h-11 cursor-pointer py-3 hover:text-[var(--color-heading)]">
              {filters.surface === "all" ? "Platform" : filters.surface === "local" ? "Local agents" : "Chat + local"}
            </summary>
            <fieldset className="flex flex-col gap-1 pb-3">
              <legend className="sr-only">Runs in</legend>
              {([ ["all", "All platforms"], ["local", "Local agents"], ["chat", "Chat + local"] ] as const).map(([value, label]) => (
                <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input type="radio" name="platform" value={value} checked={filters.surface === value} onChange={() => updateFilters({ ...filters, surface: value })} className="accent-[var(--color-accent)]" />
                  {label}
                </label>
              ))}
            </fieldset>
          </details>
        </div>
      </div>

      <div className="terminal-rule mb-3 hidden grid-cols-[minmax(11rem,1fr)_8rem_minmax(15rem,1.5fr)_5rem] gap-4 px-3 pt-3 text-xs text-[var(--color-muted)] sm:grid">
        <span>Skill</span>
        <span>Category</span>
        <span>What it does</span>
        <span className="text-right">Runs in</span>
      </div>

      {filteredSkills.length > 0 ? (
        <div className="terminal-panel p-1">
          {filteredSkills.map((skill) => (
            <TrackedLink
              key={skill.slug}
              href={`/${skill.slug}`}
              eventName="skill_open" skill={skill.slug} agent="all"
              className="skill-row group grid gap-2 border-b border-[var(--color-border)] px-3 py-4 last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] sm:grid-cols-[minmax(11rem,1fr)_8rem_minmax(15rem,1.5fr)_5rem] sm:items-center sm:gap-4"
            >
              <span className="skill-row-command relative z-10 flex min-w-0 items-center gap-2 font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--color-heading)] transition-colors sm:text-base">
                <SkillLogo slug={skill.slug} className="h-3.5 w-3.5 shrink-0 opacity-35 transition-opacity group-hover:opacity-70" />
                <span className="min-w-0 break-words">{skill.name}</span>
              </span>
              <span className="relative z-10 w-fit border border-[var(--color-border)] px-1.5 py-0.5 text-xs text-[var(--color-muted)] transition-colors group-hover:border-[var(--color-accent-dim)] group-hover:text-[var(--color-text)]">
                {skill.category}
              </span>
              <p className="relative z-10 font-[family-name:var(--font-sans)] text-sm leading-relaxed text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-text)]">
                {skill.description.split(/\s+Use when\b/)[0]}
              </p>
              <span className="relative z-10 text-right text-xs text-[var(--color-muted)]">
                {skill.claudeAppReady ? "Chat + local" : "Local"}
              </span>
            </TrackedLink>
          ))}
        </div>
      ) : (
        <div className="terminal-panel px-5 py-10 text-center">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-heading)]">No skills match these filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 min-h-11 border border-[var(--color-border)] px-3 font-[family-name:var(--font-mono)] text-xs text-[var(--color-accent)] transition-colors hover:border-[var(--color-border-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
