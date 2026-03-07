---
name: dodo-webhook
description: Wire Dodo Payments webhooks properly — signature verification using Standard Webhooks spec, idempotency, subscription lifecycle handling, and database sync. Use when the user needs to handle Dodo payment events, set up webhook endpoints, process payments, manage subscription status changes, or sync billing data with their database. Triggers on requests like "Dodo webhook", "Dodo Payments webhook", "payment webhook", "handle Dodo events", "payment lifecycle", "billing sync", or any mention of processing Dodo Payments events.
category: devops
tags: [dodo-payments, webhooks, payments, billing, backend]
author: tushaarmehtaa
---

# Dodo Webhook

Wire Dodo Payments webhooks end-to-end. Signature verification, idempotent processing, full payment lifecycle, database sync. Built from real production usage.

## Why This Exists

Dodo webhooks are easy to get wrong:
- Uses Standard Webhooks spec — NOT the same as raw HMAC verification
- Webhook secret has a `whsec_` prefix that must be stripped and base64-decoded before use
- Using the raw secret string will fail silently in log-only mode — you'll think it works until it doesn't
- Raw body must be forwarded — never let a framework parse it first
- Events can be delivered multiple times — must handle idempotency

## Environment Variables

```bash
DODO_API_KEY=           # Your Dodo API key
DODO_WEBHOOK_SECRET=    # whsec_... format from Dodo dashboard
DODO_PRODUCT_ID=        # Product ID for credit/subscription purchases
APP_URL=                # Your frontend URL
```

## Signature Verification (Critical)

Dodo uses the Standard Webhooks spec. Three headers come with every event:
- `webhook-id` — unique event ID (use for idempotency)
- `webhook-timestamp` — Unix timestamp of when event was sent
- `webhook-signature` — HMAC-SHA256 signature

**The secret gotcha:** `DODO_WEBHOOK_SECRET` is in `whsec_xxxxx` format. You must:
1. Strip the `whsec_` prefix
2. Base64-decode the remainder
3. Use the raw bytes for HMAC verification

```typescript
import { Webhook } from 'standardwebhooks';

function getWebhookVerifier() {
  const secret = process.env.DODO_WEBHOOK_SECRET!;
  // Strip whsec_ prefix — this is the part everyone misses
  const base64Secret = secret.startsWith('whsec_') ? secret.slice(6) : secret;
  return new Webhook(base64Secret);
}
```

## Full Webhook Handler

### Next.js App Router

```typescript
// app/api/webhooks/dodo/route.ts
import { Webhook } from 'standardwebhooks';

export async function POST(req: Request) {
  // CRITICAL: raw body, never parsed JSON
  const body = await req.text();

  const webhookId = req.headers.get('webhook-id')!;
  const webhookTimestamp = req.headers.get('webhook-timestamp')!;
  const webhookSignature = req.headers.get('webhook-signature')!;

  // Verify signature
  let event: any;
  try {
    const secret = process.env.DODO_WEBHOOK_SECRET!;
    const base64Secret = secret.startsWith('whsec_') ? secret.slice(6) : secret;
    const wh = new Webhook(base64Secret);

    event = wh.verify(body, {
      'webhook-id': webhookId,
      'webhook-timestamp': webhookTimestamp,
      'webhook-signature': webhookSignature,
    });
  } catch (err) {
    console.error('Dodo webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotency — check if already processed
  const alreadyProcessed = await checkEventProcessed(webhookId);
  if (alreadyProcessed) {
    return new Response('Already processed', { status: 200 });
  }

  // Process
  try {
    await handleEvent(event);
    await markEventProcessed(webhookId);
  } catch (err) {
    console.error(`Error processing Dodo event ${event.type}:`, err);
    // Always return 200 — otherwise Dodo retries endlessly
  }

  return new Response('OK', { status: 200 });
}
```

Install: `npm install standardwebhooks`

### Python / FastAPI

```python
from standardwebhooks import Webhook
import base64

@app.post("/api/webhooks/dodo")
async def dodo_webhook(request: Request):
    body = await request.body()

    webhook_id = request.headers.get("webhook-id")
    webhook_timestamp = request.headers.get("webhook-timestamp")
    webhook_signature = request.headers.get("webhook-signature")

    # Strip whsec_ prefix and base64-decode
    raw_secret = os.environ["DODO_WEBHOOK_SECRET"]
    base64_secret = raw_secret[6:] if raw_secret.startswith("whsec_") else raw_secret

    try:
        wh = Webhook(base64_secret)
        event = wh.verify(body, {
            "webhook-id": webhook_id,
            "webhook-timestamp": webhook_timestamp,
            "webhook-signature": webhook_signature,
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Idempotency check
    if await event_already_processed(webhook_id):
        return {"received": True}

    try:
        await handle_event(event)
        await mark_event_processed(webhook_id)
    except Exception as e:
        print(f"Error processing {event.get('type')}: {e}")
        # Still return 200

    return {"received": True}
```

Install: `pip install standardwebhooks`

## Event Router

```typescript
async function handleEvent(event: any) {
  const { type, data } = event;

  switch (type) {
    case 'payment.succeeded':
      return handlePaymentSucceeded(data);
    case 'payment.failed':
      return handlePaymentFailed(data);
    case 'subscription.active':
      return handleSubscriptionActivated(data);
    case 'subscription.cancelled':
      return handleSubscriptionCancelled(data);
    case 'subscription.on_hold':
      return handleSubscriptionOnHold(data);
    default:
      console.log(`Unhandled Dodo event: ${type}`);
  }
}
```

## Event Handlers

| Event | What to Do |
|-------|-----------|
| `payment.succeeded` | Find user by `metadata.userId`, add credits or activate plan, clear any payment-failed flags |
| `payment.failed` | Flag account, optionally send payment-failed email |
| `subscription.active` | Set user plan to subscribed tier, store Dodo customer ID |
| `subscription.cancelled` | Downgrade to free tier, keep data |
| `subscription.on_hold` | Flag account as on-hold, restrict access to paid features |

### payment.succeeded Handler

```typescript
async function handlePaymentSucceeded(data: any) {
  const userId = data.metadata?.userId;
  if (!userId) {
    console.error('No userId in payment metadata — cannot update user');
    return;
  }

  const creditsToAdd = parseInt(data.metadata?.credits || '100');

  await db.user.update({
    where: { id: userId },
    data: {
      credits: { increment: creditsToAdd },
      dodoCustomerId: data.customer?.id,
    },
  });
}
```

## Idempotency Layer

```typescript
// Store processed webhook IDs to prevent duplicate processing
// Table: processed_webhooks (webhook_id TEXT PRIMARY KEY, processed_at TIMESTAMP)

async function checkEventProcessed(webhookId: string): Promise<boolean> {
  const existing = await db.processedWebhook.findUnique({
    where: { webhookId }
  });
  return !!existing;
}

async function markEventProcessed(webhookId: string): Promise<void> {
  await db.processedWebhook.create({
    data: { webhookId, processedAt: new Date() }
  });
}
```

## Next.js Proxy Pattern

If your Next.js frontend proxies to a separate backend (like tweetbuzz), the Next.js route should forward raw body and all three webhook headers:

```typescript
// app/api/webhooks/dodo/route.ts (proxy version)
export async function POST(request: Request) {
  const body = await request.text(); // raw — never parse

  const headersToForward: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  for (const header of ['webhook-id', 'webhook-timestamp', 'webhook-signature']) {
    const value = request.headers.get(header);
    if (value) headersToForward[header] = value;
  }

  const response = await fetch(`${process.env.BACKEND_URL}/api/webhooks/dodo`, {
    method: 'POST',
    headers: headersToForward,
    body,
  });

  return new Response(await response.text(), { status: response.status });
}
```

## Local Testing

Use the Dodo dashboard's test mode and manually trigger events, or use ngrok to expose your local server:

```bash
# Expose local server
ngrok http 3000

# Add the ngrok URL as webhook endpoint in Dodo dashboard (test mode)
# https://your-ngrok-id.ngrok.io/api/webhooks/dodo
```

## Common Mistakes This Prevents

| Mistake | How This Skill Handles It |
|---------|--------------------------|
| Using raw `whsec_` secret | Strips prefix + base64-decodes |
| Parsing body as JSON before verification | Uses raw text body throughout |
| No idempotency — processes duplicates | `processed_webhooks` table |
| Returning non-200 on errors | Always returns 200, logs separately |
| Missing `userId` in metadata | Documented as critical in checkout setup |

## Checklist

- [ ] `standardwebhooks` package installed
- [ ] `whsec_` prefix stripped before verification
- [ ] Raw body used — not parsed JSON
- [ ] All three Standard Webhooks headers forwarded
- [ ] Idempotency check before processing
- [ ] `payment.succeeded` handler updates user in DB
- [ ] `subscription.cancelled` downgrades to free tier
- [ ] Always returns 200 (even on processing errors)
- [ ] `DODO_WEBHOOK_SECRET` in .env.example
- [ ] `userId` attached in checkout metadata (see `/pricing-page` skill)
