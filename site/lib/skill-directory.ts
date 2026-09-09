export interface DirectorySkill {
  slug: string;
  name: string;
  category: string;
  description: string;
  localAvailable: boolean;
  claudeAppReady: boolean;
}

export type SurfaceFilter = "all" | "local" | "chat";

export interface DirectoryFilters {
  query: string;
  category: string;
  surface: SurfaceFilter;
}

export function getDirectoryCategories(skills: readonly DirectorySkill[]): string[] {
  return [...new Set(skills.map((skill) => skill.category))].sort();
}

export function filterDirectorySkills(
  skills: readonly DirectorySkill[],
  filters: DirectoryFilters,
): DirectorySkill[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  const matches = skills.filter((skill) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${skill.name} ${skill.description} ${skill.category}`.toLowerCase().includes(normalizedQuery);
    const matchesCategory = filters.category === "all" || skill.category === filters.category;
    const matchesSurface =
      filters.surface === "all" ||
      (filters.surface === "chat" ? skill.claudeAppReady : skill.localAvailable);

    return matchesQuery && matchesCategory && matchesSurface;
  });
  if (!normalizedQuery) return matches;
  function relevance(skill: DirectorySkill) {
    const name = skill.name.toLowerCase();
    if (name === normalizedQuery || skill.slug === normalizedQuery) return 4;
    if (name.startsWith(normalizedQuery)) return 3;
    if (name.includes(normalizedQuery)) return 2;
    return skill.category.toLowerCase().includes(normalizedQuery) ? 1 : 0;
  }
  return matches.sort((a, b) => relevance(b) - relevance(a));
}
