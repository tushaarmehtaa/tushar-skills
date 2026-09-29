// Responses API comparison of an explicitly supplied skill, not runtime discovery.
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const fixture = process.argv[2]; const out = process.argv[3];
if (!fixture || !out) throw new Error('Usage: node --env-file=<authorized env> run.mjs <seeded fixture> <fresh output directory>');
const resume = process.argv[4] === '--resume';
if (existsSync(out) && !resume) throw new Error('Output directory already exists; use --resume to continue');
const git = (...args) => execFileSync('git', args, { cwd: fixture, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
const skill = readFileSync(resolve(root, 'changelog/SKILL.md'), 'utf8');
const prompt = readFileSync(resolve(root, 'evals/changelog-normal/prompt.md'), 'utf8');
const evidence = [git('log', '--format=%H%n%B', 'v0.2.0..HEAD'), git('diff', '--stat', 'v0.2.0..HEAD'), git('diff', '--name-status', 'v0.2.0..HEAD'), git('diff', 'v0.2.0..HEAD')].join('\n\n');
const instructions = `Apply this supplied skill to the user's task. All repository evidence below is a pre-captured fixture. No deployment evidence exists. You have no tools in this run; do not claim you executed git commands.\n\n${skill}`;
const input = `${prompt}\n\nCaptured repository evidence:\n${evidence}`;
// Dated short-context prices per million tokens. Source recorded in README.
const arms = [
  { id: 'sol-standard', model: 'gpt-6.1-sol', tier: 'default', input: 2, cached: .1, write: 2.5, output: 10 },
  { id: 'astra-standard', model: 'gpt-6-astra', tier: 'default', input: 10, cached: 1, write: 12.5, output: 50 },
  { id: 'astra-ultrafast', model: 'gpt-6-astra', tier: 'ultrafast', input: 60, cached: 6, write: 75, output: 300 },
];
const settings = { reasoning: { effort: 'medium' }, max_output_tokens: 4096, store: false, stream: true };
const bytes = Buffer.byteLength(instructions + input);
const upperBudget = arms.reduce((sum, a) => sum + 3 * (bytes * a.write + settings.max_output_tokens * a.output) / 1e6, 0);
if (bytes > 20000 || upperBudget > 12) throw new Error('Declared conservative $12/token cap exceeded; review inputs before running');
if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is missing');
mkdirSync(out, { recursive: true });
const manifest = { observed_at: new Date().toISOString(), task: 'changelog-normal', mode: 'skill explicitly supplied; captured evidence; no tools',
  settings, arms, repeats: 3, conservative_token_cost_cap_usd: upperBudget, price_date: '2026-09-30', fixture_head: git('rev-parse', 'HEAD').trim(),
  input_sha256: createHash('sha256').update(instructions + input).digest('hex'), skill_sha256: createHash('sha256').update(skill).digest('hex'), instructions, input };
const manifestPath = resolve(out, 'manifest.json');
if (resume) {
  const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (previous.input_sha256 !== manifest.input_sha256 || JSON.stringify(previous.settings) !== JSON.stringify(settings)) throw new Error('Resume inputs differ');
} else writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
const results = resume && existsSync(resolve(out, 'results.json')) ? JSON.parse(readFileSync(resolve(out, 'results.json'), 'utf8')) : [];
const unavailable = new Set();
for (let repeat = 0; repeat < 3; repeat++) {
  for (let offset = 0; offset < arms.length; offset++) {
    const arm = arms[(offset + repeat) % arms.length];
    const id = `${arm.id}-${repeat + 1}`; const started = performance.now(); let firstText = null; let response; let output = ''; let buffer = '';
    if (results.some(r => r.id === id) || unavailable.has(arm.id)) continue;
    console.log(`Starting ${id}`);
    try {
      const http = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, model: arm.model, service_tier: arm.tier, instructions, input }), signal: AbortSignal.timeout(600000) });
      if (!http.ok) { const error = await http.json(); throw new Error(`API ${http.status}: ${error.error?.code ?? 'request_failed'} (${error.error?.type ?? 'unknown'})`); }
      const decoder = new TextDecoder();
      for await (const chunk of http.body) {
        buffer += decoder.decode(chunk, { stream: true });
        let split;
        while ((split = buffer.indexOf('\n\n')) !== -1) {
          const packet = buffer.slice(0, split); buffer = buffer.slice(split + 2);
          const data = packet.split('\n').filter(line => line.startsWith('data:')).map(line => line.slice(5).trim()).join('\n');
          if (!data || data === '[DONE]') continue;
          const e = JSON.parse(data);
          if (e.type === 'response.output_text.delta') { firstText ??= performance.now() - started; output += e.delta; }
          if (e.type === 'response.completed') response = e.response;
          if (['response.failed', 'response.incomplete', 'error'].includes(e.type)) {
            const detail = JSON.stringify({ type: e.type, code: e.code ?? e.error?.code ?? e.response?.error?.code, message: e.message ?? e.error?.message ?? e.response?.error?.message, reason: e.response?.incomplete_details?.reason });
            throw new Error(detail.replaceAll(process.env.OPENAI_API_KEY, '[redacted]'));
          }
        }
      }
      if (!response || response.status !== 'completed' || !output) throw new Error('Missing completed text response');
      const total = performance.now() - started; const usage = response.usage; const cached = usage.input_tokens_details?.cached_tokens ?? 0;
      const written = usage.input_tokens_details?.cache_write_tokens;
      const noncached = usage.input_tokens - cached - (written ?? 0);
      const returnedTier = response.service_tier;
      const tierVerified = arm.tier === 'ultrafast' ? returnedTier === 'ultrafast' : returnedTier === 'default' || returnedTier === 'standard';
      // No billing invoice: estimate a range if cache-write token accounting is absent.
      const estimate = (noncached * arm.input + cached * arm.cached + (written ?? 0) * arm.write + usage.output_tokens * arm.output) / 1e6;
      const upper = written == null ? (noncached * arm.write + cached * arm.cached + usage.output_tokens * arm.output) / 1e6 : estimate;
      const record = { id, requested_model: arm.model, returned_model: response.model, requested_tier: arm.tier, returned_tier: returnedTier, tier_verified: tierVerified,
        response_id: response.id, request_id: http.headers.get('x-request-id'), status: response.status, first_text_ms: firstText, completion_ms: total, usage,
        estimated_token_cost_usd: estimate, conservative_cache_write_cost_usd: upper, cache_write_accounting: written == null ? 'unknown' : 'reported', billing_verified: false };
      writeFileSync(resolve(out, `${id}.md`), output); writeFileSync(resolve(out, `${id}.json`), JSON.stringify(record, null, 2)); results.push(record);
      writeFileSync(resolve(out, 'results.json'), JSON.stringify(results, null, 2));
      console.log(`Completed ${id}: ${(total / 1000).toFixed(1)}s, tier=${returnedTier}, token estimate=$${estimate.toFixed(4)}`);
      if (!tierVerified) throw new Error('Returned tier differs from requested arm; do not count as a valid comparison');
    } catch (error) {
      writeFileSync(resolve(out, `${id}.failure.json`), JSON.stringify({ id, error: error.message, elapsed_ms: performance.now() - started }, null, 2));
      console.error(error.message); unavailable.add(arm.id);
      if (/API (401|403)|fetch failed/.test(error.message)) { process.exitCode = 1; break; }
    }
  }
  if (process.exitCode) break;
}
