import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkSkill } from './check-skill.mjs';
function fixture(t, body) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-check-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const root = path.join(dir, 'example'); fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, 'SKILL.md'), body);
  return root;
}
const front = '---\nname: example\ndescription: Check a sample workflow.\nlicense: MIT\n---\n';
test('valid package and bundled references pass without network', t => {
  const dir = fixture(t, front + '[Notes](notes.md) [Remote](https://example.invalid)');
  fs.writeFileSync(path.join(dir, 'notes.md'), '# Notes');
  assert.deepEqual(checkSkill(dir).errors, []);
});
test('missing references and package escape fail', t => {
  const dir = fixture(t, front + '[Missing](missing.md) [Escape](../outside.md)');
  assert.equal(checkSkill(dir).errors.length, 2);
});
test('malformed frontmatter fails', t => {
  assert.ok(checkSkill(fixture(t, '---\nname: [\n---\nBody')).errors.length);
});
test('symlinked content is rejected without following it', t => {
  const dir = fixture(t, front + '[External](outside.md)');
  fs.symlinkSync('/etc/hosts', path.join(dir, 'outside.md'));
  assert.ok(checkSkill(dir).errors.some(e => /symlink/i.test(e)));
});
test('CLI runs through the symlink used by package managers', t => {
  const dir = fixture(t, front + 'Instructions.');
  const executable = path.join(path.dirname(dir), 'slashskills-check');
  fs.symlinkSync(fileURLToPath(new URL('./check-skill.mjs', import.meta.url)), executable);
  const result = spawnSync(process.execPath, [executable, dir, '--json'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).results[0].name, 'example');
});
