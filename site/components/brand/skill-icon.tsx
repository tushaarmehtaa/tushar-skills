import { SKILL_ICONS } from "@/lib/brand-shared";

/** One of the 35 skill icons. Strokes use currentColor so the tile decides the colour. */
export function SkillIcon({ slug, className = "" }: { slug: string; className?: string }) {
  const icon = SKILL_ICONS[slug];
  if (!icon) return null;
  return <svg className={`si ${className}`} viewBox={icon.vb} aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon.svg }} />;
}
