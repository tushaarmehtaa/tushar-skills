import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSkill } from '../../../../scripts/check-skill.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const destination = process.argv[2];
if (!destination) throw new Error('Usage: node build.mjs <new-output-directory>');
const output = path.resolve(destination);
// A fresh directory prevents mixing this fixture with an existing package.
if (fs.existsSync(output)) throw new Error('Output directory already exists; choose a new directory');
const checked = checkSkill(path.join(repo, 'decision-doc'));
if (checked.errors.length) throw new Error(checked.errors.join('\n'));
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'plugin.json'), JSON.stringify({
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  name: 'slashskills-decision-doc',
  version: '0.1.0',
  description: 'Write an evidence-based decision record from supplied context.',
  author: { name: 'Tushar Mehta', url: 'https://github.com/tushaarmehtaa' },
  license: 'MIT',
}, null, 2) + '\n');
fs.cpSync(path.join(repo, 'decision-doc'), path.join(output, 'skills/decision-doc'), { recursive: true });
fs.copyFileSync(path.join(repo, 'LICENSE'), path.join(output, 'LICENSE'));
console.log(JSON.stringify({ output, skill: checked.name, structure: 'passed', runtime: 'untested' }, null, 2));
