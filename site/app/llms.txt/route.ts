import { getAllSkills } from '@/lib/skills';
export const dynamic = 'force-static';
export function GET() {
  const lines = [
    '# Slashskills',
    '',
    '> MIT-licensed Agent Skills for software design, implementation, review, and documentation.',
    '',
    '## Installation and requirements',
    '',
    '- [Catalog JSON](https://www.slashskills.xyz/skills.json): descriptions, tool requirements, source links, and install commands.',
    '- [Compatibility](https://www.slashskills.xyz/compatibility): runtime and tool requirements.',
    '- [Source repository](https://github.com/tushaarmehtaa/tushar-skills): inspect packages before installation.',
    '- [Claude Code plugin](https://github.com/tushaarmehtaa/tushar-skills/blob/main/docs/claude-plugin.md): focused release-review and documentation bundle.',
    '',
    'A skill supplies instructions, not model access or tool permissions. Structural validation does not certify security or task performance.',
    '',
    '## Skills',
    '',
    ...getAllSkills().map(skill => `- [${skill.name}](https://www.slashskills.xyz/${skill.slug}): ${skill.description}`),
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
