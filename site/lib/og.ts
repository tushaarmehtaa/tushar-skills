/** Open Graph image entry for a page, drawn by app/api/og as a brand v3 card. */
export function ogImage(params: { skill: string } | { title: string; description?: string }, alt: string) {
  const query = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1])));
  return [{ url: `/api/og?${query}`, width: 1200, height: 630, alt }];
}
