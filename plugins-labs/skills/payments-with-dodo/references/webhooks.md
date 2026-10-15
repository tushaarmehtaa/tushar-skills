# Dodo webhook ingestion

Read this reference before implementing Dodo event handling. Prefer the installed official `dodopayments` SDK’s `webhooks.unwrap()` over manual Standard Webhooks logic. Verify current event names/payloads against Dodo primary documentation.

## Contents

- [Delivery contract](#delivery-contract)
- [Verify and ingest](#verify-and-ingest)
- [Transactional processing](#transactional-processing)
- [Payload privacy and retention](#payload-privacy-and-retention)
- [Event state machine](#event-state-machine)
- [Retries and ordering](#retries-and-ordering)
- [Local testing](#local-testing)
- [Verification](#verification)

## Delivery contract

Dodo signs the raw request and retries failed deliveries. Its documentation recommends fast acknowledgement when processing asynchronously. That is safe only after the event is durably stored/enqueued. A synchronous handler should return non-2xx on transient database failure so retry remains possible.

Do not parse then reserialize the body, manually strip/decode secrets when using the official helper, or swallow an unreachable backend with `200` before durable ingestion.

## Verify and ingest

```typescript
import { dodo } from '@/lib/dodo';

export async function POST(req: Request) {
  const payload = await req.text();
  let event;
  try {
    event = dodo.webhooks.unwrap(payload, {
      headers: {
        'webhook-id': req.headers.get('webhook-id')!,
        'webhook-signature': req.headers.get('webhook-signature')!,
        'webhook-timestamp': req.headers.get('webhook-timestamp')!,
      },
    });
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  await insertWebhookInbox({
    provider: 'dodo',
    eventId: req.headers.get('webhook-id')!,
    eventType: event.type,
    payload: event,
  });

  await enqueueWebhookProcessing(req.headers.get('webhook-id')!);
  return new Response('Accepted', { status: 200 });
}
```

`insertWebhookInbox` uses a unique `(provider, event_id)` constraint and returns the prior record on replay. If no durable queue exists, process in the same request and return failure when the transaction fails.

## Payload privacy and retention

Store only the provider fields required to replay or reconcile the business transition. If the implementation keeps the signed raw body or full decoded payload, treat it as sensitive operational data: encrypt it at rest where the platform supports field-level protection, restrict access to the billing worker and audited operators, scrub it from logs and error trackers, and define a short retention/deletion policy after successful processing. Keep a minimized diagnostic projection—event ID/type, provider object IDs, environment, timestamps, status, and safe error code—for longer-lived operations.

Check current Dodo event schemas for email, address, tax, payment, or other personal fields before selecting the stored projection. Never copy secrets, full payment details, or unneeded customer metadata into the inbox. Document any provider or legal retention requirement separately from the application default.

## Transactional processing

```sql
create table billing_webhook_inbox (
  provider text not null,
  event_id text not null,
  event_type text not null,
  payload jsonb not null,
  provider_created_at timestamptz,
  status text not null default 'pending',
  attempts integer not null default 0,
  last_error_code text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  primary key (provider, event_id)
);
```

In one database transaction:

1. lock/claim the pending inbox row;
2. resolve account from stored provider IDs and stable server-created metadata;
3. validate environment, product, currency/amount where relevant;
4. update normalized payment/subscription/entitlement rows;
5. write an audit transition/outbox notification;
6. mark the inbox row processed.

The unique inbox insert and business update must make concurrent workers/replays harmless. A “check then update then mark” sequence without a transaction races.

## Event state machine

Handle only events relevant to the commercial model, but cover their complete lifecycle. Current Dodo documentation includes:

- payment success/failure/processing/cancellation;
- subscription active/updated/on-hold/renewed/plan-changed/cancelled/failed/expired;
- refund success/failure;
- dispute opened/won/lost and other dispute transitions;
- dunning/recovery, entitlement-grant, and credit events where used.

Map provider status to normalized billing state. Store `cancel_at_next_billing_date`, current period/end or expiry, scheduled changes, and provider IDs. Do not reduce every subscription event to `users.plan = 'pro' | 'free'`.

For one-time credits, resolve the credit amount from the immutable server catalog/product mapping; never default missing metadata to 100 credits.

## Retries and ordering

Classify failures:

- permanent invalid/unmapped events: mark `needs_review` with safe diagnostics and alert;
- transient database/network failures: retry with backoff and dead-letter monitoring;
- unknown event types: store and acknowledge, then alert only when relevant.

Use provider creation/update timestamps or fetched current resource state to prevent an older delivery from overwriting newer state. Periodic reconciliation should compare active local subscriptions with Dodo API state.

## Local testing

Use Dodo test mode and current Dodo CLI webhook listener for signed live test events. Offline triggered payloads may be unsigned; use unsafe parsing only in an isolated test harness, never a production-reachable bypass.

## Verification

- Valid and invalid signatures behave correctly.
- Duplicate and concurrent deliveries apply one business transition.
- A forced database/queue failure remains retryable and is not lost behind `200`.
- Older events cannot overwrite newer subscription state.
- Purchase, renewal, scheduled cancellation, expiration, on-hold/recovery, plan change, refund, and unknown-customer paths match policy.
- Reconciliation detects and repairs a deliberately drifted fixture.
- Stored payload fields, access controls, log redaction, encryption choice, and retention/deletion behavior match the documented privacy policy.
