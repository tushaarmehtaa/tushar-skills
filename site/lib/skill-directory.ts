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

  return skills.filter((skill) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      `${skill.name} ${skill.description} ${skill.category}`.toLowerCase().includes(normalizedQuery);
    const matchesCategory = filters.category === "all" || skill.category === filters.category;
    const matchesSurface =
      filters.surface === "all" ||
      (filters.surface === "chat" ? skill.claudeAppReady : skill.localAvailable);

    return matchesQuery && matchesCategory && matchesSurface;
  });
}
