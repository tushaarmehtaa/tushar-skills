# Resend implementation guide

Read only the sections needed for the selected transactional, lifecycle, or marketing email path. Check the installed Resend SDK and current primary documentation before using API field names.

## Contents

- [Send wrapper](#send-wrapper)
- [Templates and idempotency](#templates-and-idempotency)
- [Durable delivery](#durable-delivery)
- [Campaigns](#campaigns)
- [Webhooks and suppression](#webhooks-and-suppression)
- [Preferences and unsubscribe](#preferences-and-unsubscribe)
- [Copy guidance](#copy-guidance)
- [Verification](#verification)

## Send wrapper

Current Resend Node SDK calls return `{ data, error }` for API failures and may also throw for runtime/transport failures. The SDK uses `replyTo` in Node options.

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendResult =
  | { ok: true; id: string }
  | { ok: false; retryable: boolean; message: string };

export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}): Promise<SendResult> {
  try {
    const { data, error } = await resend.emails.send(
      {
        from: process.env.EMAIL_FROM!,
        replyTo: process.env.EMAIL_REPLY_TO,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      },
      { idempotencyKey: input.idempotencyKey },
    );

    if (error || !data?.id) {
      return classifyResendError(error);
    }
    return { ok: true, id: data.id };
  } catch (error) {
    return classifyTransportError(error);
  }
}
```

Adapt the second-argument/idempotency signature to the installed SDK version. Do not return success merely because the promise resolved.

## Templates and idempotency

Prefer React Email or provider templates for structured escaping. If generating HTML manually, escape every untrusted name, URL, and content value. Include a useful text alternative and one primary action.

Derive idempotency keys from the logical event, for example `welcome:{userId}:{signupEventId}`. Store send intent/status locally when delivery matters beyond Resend’s idempotency retention window.

Use a verified sending domain/subdomain and a monitored reply-to. SPF and DKIM are required for domain verification; add DMARC according to the domain’s delivery policy. Treat dashboard/DNS status as manual until observed.

## Durable delivery

For user actions, write an outbox row in the same transaction as the triggering state change. A worker sends, records the Resend message ID, and retries classified transient failures with backoff. Use a dead-letter/alert path for permanent exhaustion.

Runtime-specific post-response primitives can be acceptable for low-value notifications, but an unawaited promise may be terminated in serverless environments. Do not hold a signup request open for network email delivery unless the email itself is the security transaction and the UX is designed for it.

## Campaigns

Marketing/lifecycle email requires consent or another documented lawful basis and a product preference policy. Before send:

1. materialize/preview the segment and recipient count;
2. require role-based admin authorization and confirmation;
3. create a campaign/run ID;
4. enqueue one idempotent recipient job or use Resend Broadcasts/Contacts for marketing campaigns;
5. filter current preferences and suppression at send time;
6. record sent/skipped/failed counts without returning recipient PII broadly.

Resend’s Batch API can send up to the current documented limit per request and is suited to multiple transactional messages. Current Resend guidance recommends Broadcasts for marketing campaigns. Do not implement a long request loop with `setTimeout` as a campaign queue.

## Webhooks and suppression

Verify Resend/Svix signatures using the raw request body and webhook secret before parsing/processing.

```typescript
export async function POST(req: Request) {
  const payload = await req.text();
  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: req.headers.get('svix-id')!,
        timestamp: req.headers.get('svix-timestamp')!,
        signature: req.headers.get('svix-signature')!,
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET!,
    });
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  await processResendEventIdempotently(event);
  return new Response('OK');
}
```

Use webhook/event ID for deduplication. `data.to` may contain multiple recipients; normalize addresses. Suppress hard bounces and complaints immediately, track transient delivery failures separately, and avoid equating a bounce with a user’s global marketing preference.

## Preferences and unsubscribe

Model preferences by purpose/topic, with a global marketing opt-out and a separate suppression state. Security and essential transactional messages should not be disabled by a marketing opt-out.

Use an opaque, random or signed preference token that resolves server-side rather than placing raw email in the URL. Validate signatures in constant time, support key rotation/expiry policy, and provide a confirmation/preferences page. Add standards-compliant `List-Unsubscribe` and one-click behavior where applicable.

## Copy guidance

- State why the recipient is receiving the message.
- Keep subject lines factual; avoid false urgency or fabricated personalization.
- One primary action is usually enough.
- Re-engagement should mention a real product change or user state, not placeholders.
- Do not infer “power”, “churned”, or “inactive” solely from simplistic percentiles; define segments from product behavior and validate queries.

## Verification

- Test `{ data, error }` and thrown-error paths.
- Confirm idempotency prevents duplicate logical sends.
- Verify HTML escaping, text rendering, sender, reply-to, and test recipient delivery.
- Test valid/invalid/replayed webhooks and multi-recipient payloads.
- Test bounce/complaint suppression and preference/unsubscribe paths.
- Test unauthorized campaign access, segment preview, duplicate run, retry, cancellation, and rate limits.
