# Safe waitlist implementation

Adapt this design to the detected stack. It defines invariants and failure handling rather than paste-ready framework code.

## Contents

- [Decisions](#decisions)
- [Data model](#data-model)
- [Signup transaction](#signup-transaction)
- [Confirmation and consent](#confirmation-and-consent)
- [Referrals](#referrals)
- [Admin access](#admin-access)
- [Abuse and privacy](#abuse-and-privacy)
- [Verification](#verification)

## Decisions

Infer from the product and ask only unresolved choices:

- fields strictly required for launch;
- single or double opt-in and jurisdiction/product rationale;
- confirmation email and sender setup;
- referral program and fraud tolerance;
- queue position semantics, if positions are shown at all;
- admin/export users and retention/deletion policy.

Email-only is often lower friction, but it is not a universal requirement.

## Data model

Preserve these logical fields as required by the chosen design:

```text
id: random opaque identifier
normalized_email: unique under an explicit normalization policy
display fields: optional, length-limited, safely encoded on output
status: pending | confirmed | unsubscribed | deleted
consent_source / consent_version / consent_at: when required
confirmation_token_hash / expiry: for double opt-in
referral_code: cryptographically random and unique
referred_by_id: validated foreign key
created_at / confirmed_at / unsubscribed_at
source and campaign fields: allowlisted, length-limited
```

Do not expose sequential IDs or derive public referral codes from email. Avoid mutable queue positions unless the product has a clear, concurrency-safe ordering policy.

Use database constraints for uniqueness and referential integrity. Treat the database as the authority under concurrent requests.

## Signup transaction

The handler should:

1. enforce request size/content type and parse safely;
2. validate and normalize the email under a documented policy;
3. validate/limit optional text and attribution fields;
4. apply rate limiting and bot/abuse controls appropriate to exposure;
5. insert with an atomic upsert or catch the unique constraint;
6. validate referral code and record attribution transactionally;
7. return a generic success response that does not reveal whether an arbitrary address is registered;
8. enqueue confirmation delivery after durable storage;
9. emit privacy-minimized success/failure events.

Do not perform “check then insert” as the uniqueness mechanism. Do not increment referral counters separately from the referral record; derive or update them transactionally.

## Confirmation and consent

- Use a cryptographically random, single-use, expiring token; store only its hash.
- Encode user-supplied content in HTML and provide a text version.
- Use a verified sending domain and current provider guidance.
- Handle provider failure asynchronously with retries and idempotency.
- Include required sender identity and preference/opt-out controls.
- Do not activate referrals, queue movement, or campaigns until the chosen confirmation rule is satisfied.
- Keep consent evidence separate from marketing assumptions. Joining a product waitlist does not automatically authorize unrelated messages.

## Referrals

Model each accepted referral as an idempotent relationship. Prevent:

- self-referral;
- repeated credit for the same confirmed signup;
- credit before confirmation when confirmation is required;
- arbitrary client-supplied referrer IDs;
- easily enumerable or guessable codes;
- unbounded rewards without fraud review.

Define what happens when a referrer unsubscribes or a referred user is deleted.

## Admin access

Use the application's real authorization system with a least-privilege admin role. A static secret header is not a substitute for an admin surface.

Admin/export behavior should include:

- server-side authorization on every request;
- pagination and field minimization;
- audit logging for view/export/delete;
- CSV/formula-injection protection on export;
- rate limits and short-lived download links where applicable;
- retention, deletion, unsubscribe, and data-subject workflows;
- no raw PII in application logs or analytics.

## Abuse and privacy

Document data purpose, fields, processors, retention, access, deletion, consent basis, and incident path. Add CSRF protection when cookie-authenticated state changes require it. Review spam traps, disposable addresses, automated signups, and referral gaming in proportion to risk.

## Verification

Test locally and in the deployed environment:

- valid, invalid, Unicode, case, whitespace, and maximum-length addresses;
- concurrent duplicate submissions;
- generic response for existing and new addresses;
- rate-limit and bot-control behavior;
- confirmation token expiry, reuse, and wrong-token cases;
- email HTML/text encoding and deliverability;
- referral validation, idempotency, self-referral, and confirmation gate;
- admin authorization, pagination, export safety, audit log, and deletion;
- analytics events without PII;
- provider outage, retry, and recovery;
- accessibility, loading, error, success, and offline states.
