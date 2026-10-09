"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useMemo, useState } from "react";
import { TrackedLink } from "./tracked-link";
import { SkillVisual } from "./skill-visual";
import { CanvasIcon } from "./canvas-icon";
import { AgentTabs } from "./agent-tabs";
import { CATALOG, isSkillSlug } from "@/lib/catalog";
import {
  TASK_LABELS,
  TASK_TITLES,
  SKILL_DISPLAY,
  matchesTask,
  skillHref,
} from "@/lib/canvas";
import {
  filterDirectorySkills,
  getDirectoryCategories,
  type DirectoryFilters,
  type DirectorySkill,
  type SurfaceFilter,
} from "@/lib/skill-directory";
const icons: Record<string, string> = {
  design: "design",
  ai: "ai",
  auth: "auth",
  planning: "idea",
  marketing: "launch",
  monetization: "growth",
  payments: "growth",
  analytics: "growth",
  workflow: "route",
  infrastructure: "database",
  devops: "code",
  seo: "search",
  meta: "file",
};
export function SkillDirectory({
  skills,
}: {
  skills: readonly DirectorySkill[];
}) {
  const topicRef = useRef<HTMLDetailsElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const params = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    try {
      setSelected(sessionStorage.getItem("skills-selected"));
    } catch {}
  }, []);
  useEffect(() => {
    const dismiss = (e: KeyboardEvent) => {
      if (e.key === "Escape" && topicRef.current?.open) {
        topicRef.current.open = false;
        topicRef.current.querySelector("summary")?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (
        topicRef.current?.open &&
        !topicRef.current.contains(e.target as Node)
      )
        topicRef.current.open = false;
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", outside);
    };
  }, []);
  const categories = useMemo(() => getDirectoryCategories(skills), [skills]);
  const task = params.get("task") ?? "all";
  const filters: DirectoryFilters = {
    query: params.get("q") ?? "",
    category: categories.includes(params.get("category") ?? "")
      ? params.get("category")!
      : "all",
    surface: ["local", "chat"].includes(params.get("surface") ?? "")
      ? (params.get("surface") as SurfaceFilter)
      : "all",
  };
  useEffect(() => {
    document.documentElement.classList.toggle(
      "is-searching",
      Boolean(filters.query.trim()),
    );
    return () => document.documentElement.classList.remove("is-searching");
  }, [filters.query]);
  const found = filterDirectorySkills(skills, filters).filter((s) =>
    matchesTask(s.slug, task),
  );
  const preview = found.find((s) => s.slug === selected) ?? found[0];
  const constraints =
    filters.category !== "all" || filters.surface !== "all" || task !== "all";
  function update(values: Record<string, string>) {
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(values)) {
      if (v && v !== "all") next.set(k, v);
      else next.delete(k);
    }
    window.history.replaceState(
      null,
      "",
      next.size ? `${pathname}?${next}` : pathname,
    );
  }
  function remember(slug: string) {
    try {
      sessionStorage.setItem("skills-selected", slug);
      sessionStorage.setItem(
        "skills-return",
        `${pathname}${params.size ? `?${params}` : ""}`,
      );
    } catch {}
  }
  useEffect(() => {
    const focus = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !t.isContentEditable &&
        !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focus);
    return () => window.removeEventListener("keydown", focus);
  }, []);
  return (
    <section className="skill-directory discovery-directory" aria-labelledby="skill-index-heading">
      <h2 id="skill-index-heading" className="sr-only">
        Skills
      </h2>
      <div className="search-heading">
        <label className="search-label" htmlFor="skill-search">
          Search skills
        </label>
        <a href="#library-install" className="text-button">
          Install collection <CanvasIcon name="download" />
        </a>
      </div>
      <div className="search-control">
        <CanvasIcon name="search" />
        <input
          ref={searchRef}
          id="skill-search"
          type="search"
          name="q"
          autoComplete="off"
          spellCheck={false}
          value={filters.query}
          onChange={(e) => update({ q: e.target.value })}
          placeholder='Try “interface” or “payments”'
        />
        <kbd aria-hidden="true">/</kbd>
      </div>
      <div className="directory-filters">
        <div
          role="group"
          aria-label="Skill categories"
          className="task-buttons"
        >
          <span>What are you working on?</span>
          {[["all", "All skills"], ...Object.entries(TASK_LABELS)].map(
            ([key, label]) => (
              <button
                key={key}
                aria-pressed={task === key}
                onClick={() => update({ task: key, category: "all" })}
              >
                <span>{label}</span><span className="category-count">{skills.filter(s => matchesTask(s.slug, key)).length}</span>
              </button>
            ),
          )}
        </div>
        <label className="mobile-category">
          <span>Category</span>
          <select
            aria-label="Category"
            value={task in TASK_LABELS ? task : "all"}
            onChange={(e) => update({ task: e.target.value, category: "all" })}
          >
            <option value="all">All skills</option>
            {Object.entries(TASK_LABELS).map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="platform-filter">
          <CanvasIcon name="filter" />
          <span className="sr-only">Platform</span>
          <select
            aria-label="Platform"
            value={filters.surface}
            onChange={(e) => update({ surface: e.target.value })}
          >
            <option value="all">All platforms</option>
            <option value="local">Local agents</option>
            <option value="chat">Chat apps</option>
          </select>
        </label>
      </div>
      <div className="directory-meta">
        <h2>{filters.query ? "Search results" : TASK_LABELS[task] ?? "Find your next move"}</h2>
        <p aria-live="polite" aria-atomic="true">
          {found.length} {found.length === 1 ? "skill" : "skills"}
          {filters.query ? ` for “${filters.query}”` : ""}
        </p>
        <details ref={topicRef} className="topic-filter">
          <summary>
            Topics{filters.category !== "all" ? `: ${filters.category}` : ""}
          </summary>
          <label>
            <span className="sr-only">Topic</span>
            <select
              aria-label="Topic"
              value={filters.category}
              onChange={(e) => update({ category: e.target.value })}
            >
              <option value="all">All topics</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </details>
        {constraints && (
          <button
            onClick={() =>
              update({ category: "all", surface: "all", task: "all" })
            }
          >
            Clear filters
          </button>
        )}
      </div>
      <div
        className={
          filters.query && preview
            ? "directory-workbench has-preview"
            : "directory-workbench"
        }
      >
        <div className={`skill-results ${!filters.query ? "visual-catalog" : ""}`}>
          {found.map((skill) => (
            <div
              key={skill.slug}
              className={`result-wrap ${filters.query && preview?.slug === skill.slug ? "is-selected" : ""}`}
            >
              <TrackedLink
                href={skillHref(skill.slug)}
                eventName="skill_open"
                skill={skill.slug}
                agent="all"
                className="skill-row"
                onClick={() => remember(skill.slug)}
              >
                <span className="workflow-mark"><CanvasIcon name={SKILL_DISPLAY[skill.slug]?.icon ?? icons[skill.category] ?? "file"} /></span>
                <div className="result-copy">
                  <h3>
                    <CanvasIcon
                      name={
                        SKILL_DISPLAY[skill.slug]?.icon ??
                        icons[skill.category] ??
                        "file"
                      }
                    />
                    {TASK_TITLES[skill.slug] ?? skill.name}
                  </h3>
                  <p>
                    {SKILL_DISPLAY[skill.slug]?.summary ??
                      skill.description.split(/\s+Use when\b/)[0]}
                  </p>
                  <span className="skill-pill">{skill.slug}</span>
                </div>
                <span className="result-platform">
                  <span className="result-flow">
                    {SKILL_DISPLAY[skill.slug]?.flow}
                  </span>
                  <span>
                    {skill.claudeAppReady ? "Local + chat" : "Local agent"}
                  </span>
                </span>
                <CanvasIcon name="arrow" className="result-arrow" />
              </TrackedLink>
              {filters.query && (
                <button
                  className="preview-trigger"
                  title={`Preview ${skill.slug}`}
                  aria-label={`Preview ${skill.slug}`}
                  aria-pressed={preview?.slug === skill.slug}
                  onClick={() => setSelected(skill.slug)}
                >
                  <CanvasIcon name="panel" />
                  <span>Preview</span>
                </button>
              )}
            </div>
          ))}
          {!found.length && (
            <div className="empty-results">
              <CanvasIcon name="search" width="32" height="32" />
              <h3>
                {constraints
                  ? "No skills match these filters."
                  : "No skills match your search."}
              </h3>
              <p>
                {constraints
                  ? "Keep your search and clear the filters, or try a different task."
                  : "Try a skill name or a task, such as interface or payments."}
              </p>
              <div>
                <button
                  className="primary-button"
                  onClick={() =>
                    constraints
                      ? update({ category: "all", surface: "all", task: "all" })
                      : update({ q: "" })
                  }
                >
                  {constraints ? "Clear filters" : "Clear search"}
                </button>
                <button
                  className="text-button"
                  onClick={() => searchRef.current?.focus()}
                >
                  Edit search
                </button>
              </div>
            </div>
          )}
        </div>
        {filters.query && preview && isSkillSlug(preview.slug) && (
          <aside className="skill-inspector" aria-label="Skill preview">
            <span className="skill-pill">{preview.slug}</span>
            <h2>{TASK_TITLES[preview.slug] ?? preview.name}</h2>
            <p>{preview.description.split(/\s+Use when\b/)[0]}</p>
            <div className="inspector-visual"><SkillVisual slug={preview.slug} /><span>Illustrative workflow</span></div>
            <AgentTabs
              key={preview.slug}
              slug={preview.slug}
              support={CATALOG[preview.slug].support}
              capabilities={CATALOG[preview.slug].capabilities}
            />
            <TrackedLink
              href={skillHref(preview.slug)}
              eventName="skill_open"
              skill={preview.slug}
              agent="all"
              onClick={() => remember(preview.slug)}
              className="text-button"
            >
              Read the skill & source <CanvasIcon name="arrow" />
            </TrackedLink>
          </aside>
        )}
      </div>
    </section>
  );
}
