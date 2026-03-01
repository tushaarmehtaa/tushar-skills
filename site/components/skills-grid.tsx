"use client";

import { useState, useMemo } from "react";
import { CategoryFilter } from "./category-filter";
import { SkillCard } from "./skill-card";
import type { Skill } from "@/lib/skills";

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [category, setCategory] = useState("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    skills.forEach((s) => {
      c[s.category] = (c[s.category] || 0) + 1;
    });
    return c;
  }, [skills]);

  const filtered =
    category === "all"
      ? skills
      : skills.filter((s) => s.category === category);

  return (
    <>
      <div className="mb-10 animate-fade-up delay-1">
        <CategoryFilter active={category} counts={counts} onChange={setCategory} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2" key={category}>
        {filtered.map((skill, i) => (
          <SkillCard key={skill.slug} skill={skill} index={i} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-muted)]">
            No skills in this category yet.
          </p>
          <p className="mt-2 text-xs text-[var(--color-border-hover)]">
            Want to add one?{" "}
            <a
              href="https://github.com/tushaarmehtaa/tushar-skills"
              className="text-[var(--color-accent)] hover:underline"
            >
              Contribute on GitHub
            </a>
          </p>
        </div>
      )}
    </>
  );
}
