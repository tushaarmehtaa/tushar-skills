# Health Endpoint Implementation

Read this reference when the project needs an uptime endpoint for Next.js or FastAPI, an optional database probe, or external monitoring.

## Contents

- [Next.js endpoint](#nextjs--appapistatusroutets)
- [FastAPI endpoint](#python-fastapi)
- [Monitoring checks](#what-to-monitor)

A single endpoint that tells you if the app is alive. Use it for uptime monitoring (Vercel cron, UptimeRobot, Better Uptime).

### Next.js — `app/api/status/route.ts`:

```typescript
import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  // Basic health check
  const health: Record<string, any> = {
    status: 'ok',
    uptime: `${uptime}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'dev',
  };

  // Database check (if applicable)
  try {
    // Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { error } = await supabase.from('users').select('id').limit(1);
      health.database = error ? 'error' : 'ok';
    }

    // Prisma
    // const count = await prisma.user.count();
    // health.database = 'ok';
  } catch {
    health.database = 'error';
  }

  const isHealthy = health.database !== 'error';

  return NextResponse.json(health, {
    status: isHealthy ? 200 : 503,
  });
}
```

### Python (FastAPI):

```python
from datetime import datetime
import time

START_TIME = time.time()

@app.get("/api/status")
async def health_check():
    uptime = int(time.time() - START_TIME)
    return {
        "status": "ok",
        "uptime": f"{uptime}s",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "development"),
    }
```

### What to monitor

Set up a cron or external service to hit `/api/status` every 5 minutes. Alert if:
- Response status is not 200
- Response time exceeds 5 seconds
- Database field is "error"

**Free options:** UptimeRobot (free tier), Better Uptime, or Vercel's built-in cron.
