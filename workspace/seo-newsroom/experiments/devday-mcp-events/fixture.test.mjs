import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Broker, Receiver, sign, verify } from './fixture.mjs';

const SECRET = `whsec_${Buffer.alloc(32, 7).toString('base64')}`; // Public synthetic test key.
const params = () => ({ name: 'task.created', arguments: { project_id: 'project-a' }, delivery: { mode: 'webhook', url: 'https://receiver.example.test/callback', secret: SECRET }, cursor: null });
const event = (id = 'evt-1', at = '2026-09-30T00:00:00Z') => ({ eventId: id, name: 'task.created', timestamp: at, data: { project_id: 'project-a', task_id: id, title: 'Draft a decision record' }, cursor: null });
test('signer matches the upstream Standard Webhooks known-answer vector', () => {
  // MIT-licensed upstream fixture: libraries/javascript/src/webhook.test.ts, "sign function works".
  const headers = sign('whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw', 'msg_p5jXN8AQM9LWM0D4loKWxJek', 1614265330000, '{"test": 2432232314}');
  assert.equal(headers['webhook-signature'], 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=');
});
function setup(t) {
  const dir = mkdtempSync(join(tmpdir(), 'slashskills-events-')); t.after(() => rmSync(dir, { recursive: true, force: true }));
  let clock = Date.parse('2026-09-30T00:00:00Z'); let permission = true; let intercept;
  const options = { now: () => clock, authorized: owner => owner === 'alice' && permission, transport: req => intercept ? intercept(req) : receiver.receive(req) };
  let broker = new Broker(join(dir, 'broker.json'), options);
  let receiver = new Receiver(join(dir, 'receiver.json'), { now: options.now, subscription: id => broker.store.data.subscriptions[id] });
  return { get broker() { return broker; }, get receiver() { return receiver; }, options, advance: ms => { clock += ms; }, revoke: () => { permission = false; }, intercept: fn => { intercept = fn; },
    restart: () => { broker = new Broker(join(dir, 'broker.json'), options); receiver = new Receiver(join(dir, 'receiver.json'), { now: options.now, subscription: id => broker.store.data.subscriptions[id] }); } };
}
test('signature binds exact bytes, id and attempt timestamp; accepts rotated signature list', () => {
  const at = 1790726400000; const body = '{"value":1}'; const headers = sign(SECRET, 'evt-1', at, body);
  verify(SECRET, headers, body, at);
  verify(SECRET, { ...headers, 'webhook-signature': `v1,invalid ${headers['webhook-signature']}` }, body, at);
  for (const mutation of [{ body: '{ "value":1}' }, { headers: { ...headers, 'webhook-id': 'other' } }, { headers: { ...headers, 'webhook-timestamp': String(at / 1000 + 1) } }]) {
    assert.throws(() => verify(SECRET, mutation.headers ?? headers, mutation.body ?? body, at));
  }
  assert.throws(() => verify(SECRET, headers, body, at + 301000), /Stale/);
  assert.throws(() => verify(SECRET, headers, body, at - 301000), /Stale/);
  assert.throws(() => verify(SECRET, { ...headers, 'webhook-id': '' }, body, at), /Missing/);
});
test('failed callback challenge never activates a subscription', async t => {
  const h = setup(t); h.intercept(() => ({ status: 200, challenge: 'wrong' }));
  await assert.rejects(h.broker.subscribe('alice', params()), e => e.code === -32015 && e.reason === 'challenge_failed');
  assert.deepEqual(h.broker.store.data.subscriptions, {});
});
test('verification is single-use and no application event is queued', t => {
  const h = setup(t); const body = JSON.stringify({ type: 'verification', challenge: 'challenge' });
  const req = { body, headers: { ...sign(SECRET, 'verify-1', h.options.now(), body), 'x-mcp-subscription-id': 'unregistered' }, verificationSecret: SECRET };
  assert.equal(h.receiver.receive(req).status, 200); assert.equal(h.receiver.receive(req).status, 409);
  assert.equal(Object.keys(h.receiver.store.data.inbox).length, 0);
});
test('filters, authorization, secret, callback, TTL and non-replay cursor are checked', async t => {
  const h = setup(t);
  for (const p of [{ ...params(), name: 'unknown' }, { ...params(), arguments: { project_id: 'a', extra: 'bad' } }, { ...params(), ttlMs: -1 }, { ...params(), cursor: 'unsupported' },
    { ...params(), delivery: { ...params().delivery, url: 'http://127.0.0.1/' } }, { ...params(), delivery: { ...params().delivery, secret: 'whsec_YQ==' } }]) await assert.rejects(h.broker.subscribe('alice', p));
  await assert.rejects(h.broker.subscribe('bob', params()), /Forbidden/);
});
test('refresh keeps identity and subscription survives reconstruction', async t => {
  const h = setup(t); const original = await h.broker.subscribe('alice', params()); h.advance(10000);
  const refreshed = await h.broker.subscribe('alice', params()); assert.equal(original.id, refreshed.id); assert.notEqual(original.refreshBefore, refreshed.refreshBefore);
  assert.equal(refreshed.cursor, null); h.restart(); assert.equal(Object.keys(h.broker.store.data.subscriptions).length, 1);
  h.broker.enqueue(event()); await h.broker.tick(); assert.equal(Object.keys(h.receiver.store.data.inbox).length, 1);
});
test('receipt persists before completion; replay after receiver restart creates one draft', async t => {
  const h = setup(t); const sub = await h.broker.subscribe('alice', params()); h.broker.enqueue(event()); await h.broker.tick();
  assert.equal(Object.keys(h.receiver.store.data.drafts).length, 0); h.restart();
  const body = JSON.stringify(event()); const req = { body, headers: { ...sign(SECRET, event().eventId, h.options.now(), body), 'x-mcp-subscription-id': sub.id } };
  assert.equal(h.receiver.receive(req).status, 202); h.receiver.drain(h.options.authorized); h.restart(); h.receiver.drain(h.options.authorized);
  assert.equal(Object.keys(h.receiver.store.data.drafts).length, 1);
});
test('distinct out-of-order events each create their own draft without overwriting', async t => {
  const h = setup(t); await h.broker.subscribe('alice', params()); h.broker.enqueue(event('new', '2026-09-30T00:00:10Z')); h.broker.enqueue(event('old'));
  await h.broker.tick(); h.receiver.drain(h.options.authorized); assert.equal(Object.keys(h.receiver.store.data.drafts).length, 2);
});
test('transient retry retains event ID and body, refreshes timestamp and survives restart', async t => {
  const h = setup(t); await h.broker.subscribe('alice', params()); h.intercept(() => ({ status: 503 })); h.broker.enqueue(event());
  await h.broker.tick(); h.restart(); h.advance(1000); h.intercept(undefined); await h.broker.tick();
  const d = Object.values(h.broker.store.data.deliveries)[0]; assert.equal(d.status, 'received'); assert.equal(d.attempts, 2);
  assert.equal(d.trace[0].id, d.trace[1].id); assert.notEqual(d.trace[0].signedAt, d.trace[1].signedAt); assert.equal(d.body, JSON.stringify(event()));
});
test('retry exhaustion is bounded to four attempts', async t => {
  const h = setup(t); await h.broker.subscribe('alice', params()); h.intercept(() => { throw new Error('synthetic network failure'); }); h.broker.enqueue(event());
  for (let i = 0; i < 6; i++) { await h.broker.tick(); h.advance(10000); }
  const d = Object.values(h.broker.store.data.deliveries)[0]; assert.equal(d.status, 'dead'); assert.equal(d.attempts, 4);
});
for (const status of [410, 413]) test(`${status} is terminal after one attempt`, async t => {
  const h = setup(t); await h.broker.subscribe('alice', params()); h.intercept(() => ({ status })); h.broker.enqueue(event()); await h.broker.tick(); h.advance(10000); await h.broker.tick();
  const d = Object.values(h.broker.store.data.deliveries)[0]; assert.equal(d.status, 'dead'); assert.equal(d.attempts, 1);
});
test('revocation stops pending delivery and already received work', async t => {
  const h = setup(t); await h.broker.subscribe('alice', params()); h.broker.enqueue(event('received')); await h.broker.tick(); h.broker.enqueue(event('pending')); h.revoke();
  await h.broker.tick(); h.receiver.drain(h.options.authorized); assert.equal(Object.keys(h.receiver.store.data.drafts).length, 0);
  assert.equal(Object.values(h.broker.store.data.deliveries).find(d => d.eventId === 'pending').status, 'cancelled');
});
test('unsubscribe is owner-scoped, idempotent and cancels queued work across restart', async t => {
  const h = setup(t); await h.broker.subscribe('alice', params()); h.broker.unsubscribe('bob', params()); h.broker.enqueue(event()); await h.broker.tick();
  h.broker.unsubscribe('alice', params()); h.broker.unsubscribe('alice', params()); h.restart(); h.receiver.drain(h.options.authorized);
  h.broker.enqueue(event('after-stop')); await h.broker.tick(); assert.equal(Object.keys(h.receiver.store.data.drafts).length, 0); assert.equal(Object.keys(h.broker.store.data.deliveries).length, 1);
});
test('expiration, unmatched filters and oversized bodies produce no delivery', async t => {
  const h = setup(t); await h.broker.subscribe('alice', { ...params(), ttlMs: 1000 });
  h.broker.enqueue({ ...event(), data: { ...event().data, project_id: 'other' } }); assert.equal(Object.keys(h.broker.store.data.deliveries).length, 0);
  assert.throws(() => h.broker.enqueue({ ...event(), data: { ...event().data, title: 'a'.repeat(262144) } }), /256 KiB/);
  h.advance(1001); h.broker.enqueue(event()); assert.equal(Object.keys(h.broker.store.data.deliveries).length, 0);
});
