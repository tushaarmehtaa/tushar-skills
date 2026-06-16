---
name: debug-perf
description: Diagnose and fix performance issues in Next.js dev environments and production apps. Covers hot reload loops, CPU spikes, bundle bloat, slow server components, and missing caches.
category: devops
tags: [performance, nextjs, turbopack, webpack, bundle, caching, cpu]
author: tushaarmehtaa
---

Diagnose slow or overheating Next.js apps. Works in dev and production.

## Steps

### 1. Check for compile loops

```bash
ls -lh /tmp/*.log 2>/dev/null
# If any log is >100MB, a hot reload loop is running
```

Look for repeated module resolution errors in the dev server output. Common culprit: `geist/font/*` imports breaking with Turbopack. Fix by switching to `next/font/google`:

```ts
// layout.tsx — replace geist package imports
import { Geist, Geist_Mono } from "next/font/google";
const GeistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const GeistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
```

### 2. Check file watching scope

If the project reads files outside its own directory at runtime:

```ts
// lib/something.ts
const ROOT = path.join(process.cwd(), ".."); // watches the parent dir
```

Turbopack watches any directory referenced by runtime file reads. Edits to files in `..` trigger full recompiles. Fix: scope reads to the project directory, or use `turbopack: {}` in `next.config.ts` to silence the warning while you plan a proper fix.

### 3. Check for uncached disk reads

```bash
grep -rn "fs.readFileSync\|fs.readdirSync" lib/ app/ src/ 2>/dev/null
```

Any function that reads files and is called from a server component runs on every request. Add a module-level cache:

```ts
let cache: ReturnType<typeof loadData> | null = null;

export function loadData() {
  if (cache) return cache;
  // ... read files ...
  cache = result;
  return cache;
}
```

### 4. Profile the bundle (production)

```bash
npx @next/bundle-analyzer
# or add to next.config.ts:
# bundleAnalyzer: { enabled: process.env.ANALYZE === 'true' }
```

Look for: large client components that could be server components, duplicate packages across chunks, packages that shouldn't be in the client bundle.

### 5. Find expensive server components

Server components re-render on every request in dev unless wrapped with `cache()`. Search for:

```bash
grep -rn "await fetch\|readFileSync\|prisma\.\|supabase\." app/ --include="*.tsx" --include="*.ts"
```

Any expensive call in a server component without `import { cache } from 'react'` wrapping it will run on every page load.

### 6. Report

State:
- Root cause (loop, file watching, uncached reads, bundle)
- Files changed and what changed
- Expected behavior after fix (idle CPU, hot reload time)
