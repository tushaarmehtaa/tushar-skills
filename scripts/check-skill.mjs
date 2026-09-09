#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { extractMarkdownLinks } from './markdown-links.mjs';

export function checkSkill(directory) {
  const root = path.resolve(directory);
  const errors = [], warnings = [];
  const result = { path: root, name: path.basename(root), errors, warnings };
  try {
    if (fs.lstatSync(root).isSymbolicLink()) throw new Error('Skill directory must not be a symlink');
    const realRoot = fs.realpathSync(root);
    const file = path.join(root, 'SKILL.md');
    if (!fs.lstatSync(file).isFile()) throw new Error('SKILL.md must be a regular file');
    const source = fs.readFileSync(file, 'utf8');
    if (!/^---\r?\n/.test(source)) throw new Error('SKILL.md must start with YAML frontmatter');
    const { data, content } = matter(source);
    if (typeof data.name !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name) || data.name.length > 64) errors.push('name must be a lowercase hyphenated identifier, at most 64 characters');
    if (data.name !== path.basename(root)) errors.push('name must match the skill directory name');
    if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) errors.push('description must contain 1–1024 characters');
    if (!content.trim()) errors.push('Skill instructions are empty');
    if (!data.license) warnings.push('No license declared in frontmatter; check the repository license');
    function walk(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const absolute = path.join(dir, entry.name);
        if (entry.isSymbolicLink()) { errors.push(`Symlink not inspected: ${path.relative(root, absolute)}`); continue; }
        if (entry.isDirectory()) { walk(absolute); continue; }
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
        for (const { target } of extractMarkdownLinks(fs.readFileSync(absolute, 'utf8'))) {
          if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue;
          let relative;
          try { relative = decodeURIComponent(target.split(/[?#]/)[0]); } catch { errors.push(`Invalid URL encoding in ${path.relative(root, absolute)}`); continue; }
          if (!relative) continue;
          const resolved = path.resolve(path.dirname(absolute), relative);
          if (resolved !== root && !resolved.startsWith(root + path.sep)) { errors.push(`Reference escapes package: ${target}`); continue; }
          if (!fs.existsSync(resolved)) { errors.push(`Missing reference in ${path.relative(root, absolute)}: ${target}`); continue; }
          const real = fs.realpathSync(resolved);
          if (real !== realRoot && !real.startsWith(realRoot + path.sep)) errors.push(`Reference follows symlink outside package: ${target}`);
        }
      }
    }
    walk(root);
  } catch (error) { errors.push(error.message); }
  return result;
}

export function main(args) {
  if (args.includes('--help') || args.length === 0) {
    console.log('Usage: slashskills-check <skill-directory> [--json]\n       slashskills-check <collection-directory> --collection [--json]\n\nChecks package structure and local references. Does not execute skills, access the network, certify security, or test runtime behavior.');
    return 0;
  }
  const invalid = args.find(a => a.startsWith('--') && !['--json', '--collection'].includes(a));
  const targets = args.filter(a => !a.startsWith('--'));
  if (invalid || targets.length !== 1) { console.error('Provide one directory and only --json or --collection flags.'); return 2; }
  let directories;
  try {
    directories = args.includes('--collection') ? fs.readdirSync(targets[0], { withFileTypes: true }).filter(e => e.isDirectory() && fs.existsSync(path.join(targets[0], e.name, 'SKILL.md'))).map(e => path.join(targets[0], e.name)) : targets;
    if (!directories.length) throw new Error('No immediate skill directories found');
  } catch (error) { console.error(error.message); return 2; }
  const results = directories.map(checkSkill);
  if (args.includes('--json')) console.log(JSON.stringify({ scope: 'structure-and-local-references', results }, null, 2));
  else for (const r of results) {
    console.log(`${r.errors.length ? 'FAIL' : 'PASS'} ${r.name}`);
    for (const e of r.errors) console.log(`  error: ${e}`);
    for (const w of r.warnings) console.log(`  warning: ${w}`);
  }
  return results.some(r => r.errors.length) ? 1 : 0;
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main(process.argv.slice(2));
