# Health endpoints

Read this reference when the selected observability plan needs liveness, readiness, or external uptime monitoring.

## Contents

- [Choose the signal](#choose-the-signal)
- [Next.js pattern](#nextjs-pattern)
- [FastAPI pattern](#fastapi-pattern)
- [Verification](#verification)

## Choose the signal

- **Liveness** answers whether the process can serve. Keep it cheap and independent of downstream services.
- **Readiness** answers whether this instance can perform essential work. Probe only critical dependencies, use short timeouts, and return a non-2xx response when unavailable.
- **Business checks** belong in synthetic monitoring, not a public health response.

Do not expose environment names, versions, connection details, exception text, row counts, or dependency topology publicly. In serverless runtimes, process uptime is instance-local and usually not a useful service metric.

## Next.js pattern

```typescript
// app/api/health/live/route.ts
export async function GET() {
  return Response.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
```

For readiness, inject a project-specific dependency check rather than assuming a `users` table or creating a new service-role client on every request:

```typescript
// app/api/health/ready/route.ts
import { checkDatabase } from '@/lib/health/check-database';

export async function GET() {
  const result = await checkDatabase({ timeoutMs: 1_500 });
  return Response.json(
    { status: result.ok ? 'ok' : 'unavailable' },
    {
      status: result.ok ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    },
  );
}
```

Reuse the application’s server-only database client. The check should be bounded, non-mutating, and inexpensive. Protect readiness with network policy or a monitoring token if exposing dependency status creates risk.

## FastAPI pattern

```python
from datetime import datetime, timezone
from fastapi import Response

@app.get('/health/live')
async def live():
    return {
        'status': 'ok',
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }

@app.get('/health/ready')
async def ready(response: Response):
    ok = await check_database(timeout_seconds=1.5)
    response.status_code = 200 if ok else 503
    return {'status': 'ok' if ok else 'unavailable'}
```

## Verification

- Liveness returns quickly while a downstream dependency is unavailable.
- Readiness returns 200 normally and 503 under a forced dependency failure or timeout.
- Responses contain no sensitive internals and are not cached.
- The external monitor uses the expected path, interval, regions, and alert contacts.
- Record dashboard/monitor configuration as manual until actually observed.
