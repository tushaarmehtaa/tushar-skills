import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const out = process.argv[2];
if (!out) throw new Error('Usage: node summarize.mjs <results directory>');
const manifest = JSON.parse(readFileSync(resolve(out, 'manifest.json')));
const rows = JSON.parse(readFileSync(resolve(out, 'results.json')));
for (const row of rows) {
  const price = manifest.arms.find(a => row.id.startsWith(`${a.id}-`));
  const details = row.usage.input_tokens_details;
  const cached = details.cached_tokens ?? 0; const written = details.cache_write_tokens;
  const uncached = row.usage.input_tokens - cached - (written ?? 0);
  row.estimated_token_cost_usd = (uncached * price.input + cached * price.cached + (written ?? 0) * price.write + row.usage.output_tokens * price.output) / 1e6;
  row.conservative_cache_write_cost_usd = written == null ? (uncached * price.write + cached * price.cached + row.usage.output_tokens * price.output) / 1e6 : row.estimated_token_cost_usd;
  row.cache_write_accounting = written == null ? 'unknown' : 'reported';
  writeFileSync(resolve(out, `${row.id}.json`), JSON.stringify(row, null, 2));
}
const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.ceil(values.length * p) - 1];
const summary = { scope: manifest.mode, percentile_method: 'nearest rank; with n=3 p95 is the maximum, not a population estimate',
  price_date: manifest.price_date, estimated_completed_run_cost_usd: rows.reduce((s, r) => s + r.estimated_token_cost_usd, 0), billing_verified: false,
  arms: manifest.arms.map(arm => {
    const valid = rows.filter(r => r.id.startsWith(`${arm.id}-`) && r.tier_verified && r.returned_model === arm.model);
    return { model: arm.model, service_tier: arm.tier, completed: valid.length,
      completion_p50_ms: valid.length ? percentile(valid.map(r => r.completion_ms), .5) : null,
      completion_p95_ms: valid.length ? percentile(valid.map(r => r.completion_ms), .95) : null,
      first_text_p50_ms: valid.length ? percentile(valid.map(r => r.first_text_ms), .5) : null,
      estimated_cost_p50_usd: valid.length ? percentile(valid.map(r => r.estimated_token_cost_usd), .5) : null };
  }) };
writeFileSync(resolve(out, 'results.json'), JSON.stringify(rows, null, 2));
writeFileSync(resolve(out, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
