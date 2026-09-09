import { getAllSkills } from '@/lib/skills';
export const dynamic = 'force-static';
export function GET() {
  return Response.json({
    schemaVersion: 1,
    name: 'Slashskills',
    repository: 'https://github.com/tushaarmehtaa/tushar-skills',
    license: 'MIT',
    note: 'Catalog metadata and installation paths. Listed support is not evidence of successful task execution.',
    skills: getAllSkills().map(({ slug, name, description, category, capabilities, surfaces, support }) => ({
      slug, name, description, category, capabilities, surfaces, support,
      url: `https://www.slashskills.xyz/${slug}`,
      source: `https://github.com/tushaarmehtaa/tushar-skills/tree/main/${slug}`,
      instructions: `https://raw.githubusercontent.com/tushaarmehtaa/tushar-skills/main/${slug}/SKILL.md`,
      install: `npx skills add tushaarmehtaa/tushar-skills --skill ${slug}`,
    })),
  });
}
