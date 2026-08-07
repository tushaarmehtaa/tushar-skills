---
name: performance-diagnosis
description: Diagnose web-app performance across build, server, browser, database, and network paths. Use when investigating slowness, resource spikes, reload loops, regressions, bloat, or poor Web Vitals.
license: MIT
---

# Performance diagnosis

Measure a reproducible slow path before changing it. Diagnosis does not authorize a fix unless the user requested implementation.

## Workflow

1. Establish the symptom, affected environment, route/action, regression window, expected threshold, and a repeatable reproduction. Infer these from traces/issues/code when possible; ask only for missing facts that change the investigation.
2. Detect framework/runtime/version, deploy topology, package manager, data stores, observability, and recent relevant diffs. Separate development-only behavior from production behavior.
3. Attribute resource symptoms before profiling the application. For heat, fan, battery, or system-wide spikes, use a short, thermally safe reproduction and sample process CPU, memory, energy, and GPU where available. Isolate the browser tab from extensions, the Node/dev server, compiler watchers, database, and unrelated processes. Stop the reproduction if temperature, power draw, or system stability becomes unsafe.
4. Capture a baseline with the tool suited to the symptom:
   - dev/build: timed cold and warm start/build, compiler logs, watcher scope;
   - server: route spans, CPU/memory profile, cold start, event-loop delay, query timing;
   - browser: tab/task-manager isolation, performance trace, network waterfall, long tasks, hydration, animation/compositor/GPU load, polling/timers, and Core Web Vitals;
   - bundle: framework-supported analyzer and route-level client/server composition;
   - database/network: query plans, connection waits, downstream latency and payload size.
5. Form ranked hypotheses and test the cheapest discriminating one first. A large log, expensive-looking call, or large package is evidence to investigate, not proof of root cause.
6. For Next.js, detect the major version and caching model before recommending `React.cache`, `use cache`, fetch caching, or Turbopack settings. `React.cache` deduplicates within a request; it is not a cross-request cache. Configure `turbopack.root` only when the project truly resolves linked files outside the detected root.
7. If implementation is authorized, make one narrow change at a time. Protect user/tenant isolation, freshness, invalidation, memory bounds, and failure behavior when caching. Preserve a before/after artifact and revert changes that do not improve the target metric.

## Verification

Repeat the same reproduction under the same conditions. Compare median and tail values where possible, test cold/warm behavior separately, run correctness tests for changed caching/concurrency, and run project lint/type/test/build. For browser performance, pair local lab results with field data when available.

## Output

Report symptom and reproduction, baseline, evidence, root cause or ranked remaining hypotheses, files changed only if authorized, before/after metrics, correctness checks, confidence level, and next measurement. Do not claim a cause or improvement without observed evidence.
