# Sentry Implementation

Read this reference when the project needs Sentry installation, runtime configuration, React error boundaries, or structured exception logging.

## Contents

- [Install](#31-install)
- [Configuration](#32-configuration)
- [React error boundaries](#33-error-boundary-react)
- [Structured error logging](#34-structured-error-logging)

### 3.1 Install

**Next.js:**
```bash
npx @sentry/wizard@latest -i nextjs
```

This auto-creates `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and updates `next.config.ts`. Review the generated files.

**React SPA (Vite):**
```bash
npm install @sentry/react
```

**Python (FastAPI):**
```bash
pip install sentry-sdk[fastapi]
```

### 3.2 Configuration

**Next.js** — the wizard generates most of this. Review and adjust:

`sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});
```

Key settings:
- `tracesSampleRate: 0.1` — sample 10% of transactions in prod (controls cost)
- `replaysOnErrorSampleRate: 1.0` — always capture session replay when errors happen
- `enabled: false` in development — don't pollute Sentry with dev errors

**React SPA:**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  enabled: import.meta.env.PROD,
});
```

**Python (FastAPI):**
```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=0.1,
    profiles_sample_rate=0.1,
    environment=os.getenv("ENVIRONMENT", "development"),
    enabled=os.getenv("ENVIRONMENT") == "production",
)
```

### 3.3 Error Boundary (React)

Create a global error boundary that catches rendering errors:

**Next.js App Router** — `app/global-error.tsx`:
```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>something went wrong</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            the error has been reported automatically.
          </p>
          <button
            onClick={reset}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            try again
          </button>
        </div>
      </body>
    </html>
  );
}
```

**Also add `app/error.tsx`** for non-fatal page errors:
```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>something went wrong</h2>
      <button onClick={reset}>try again</button>
    </div>
  );
}
```

### 3.4 Structured Error Logging

Create a helper for logging errors with context:

```typescript
// lib/logger.ts
import * as Sentry from '@sentry/nextjs';

interface ErrorContext {
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export function logError(error: unknown, context?: ErrorContext) {
  const err = error instanceof Error ? error : new Error(String(error));

  if (context) {
    Sentry.withScope((scope) => {
      if (context.userId) scope.setUser({ id: context.userId });
      if (context.action) scope.setTag('action', context.action);
      if (context.metadata) scope.setExtras(context.metadata);
      Sentry.captureException(err);
    });
  } else {
    Sentry.captureException(err);
  }

  // Also log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error]', err.message, context);
  }
}
```

Usage:
```typescript
try {
  await generateContent(prompt);
} catch (error) {
  logError(error, {
    userId: user.id,
    action: 'generate_content',
    metadata: { promptLength: prompt.length },
  });
}
```
