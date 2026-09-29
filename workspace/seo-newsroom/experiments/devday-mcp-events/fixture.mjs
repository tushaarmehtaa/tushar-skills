// Local, single-process experiment. No HTTP listener, OAuth implementation or LLM.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';

const MAX_BODY = 256 * 1024;
const canonical = value => value && typeof value === 'object'
  ? Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]))
  : value;
const equal = (a, b) => { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
function key(secret) {
  if (typeof secret !== 'string' || !/^whsec_[A-Za-z0-9+/]+={0,2}$/.test(secret)) throw new Error('Invalid signing secret');
  const bytes = Buffer.from(secret.slice(6), 'base64');
  if (bytes.length < 24 || bytes.length > 64 || bytes.toString('base64') !== secret.slice(6)) throw new Error('Invalid signing secret');
  return bytes;
}
export function sign(secret, id, at, body) {
  const timestamp = String(Math.floor(at / 1000));
  return { 'content-type': 'application/json', 'webhook-id': id, 'webhook-timestamp': timestamp,
    'webhook-signature': `v1,${createHmac('sha256', key(secret)).update(`${id}.${timestamp}.${body}`).digest('base64')}` };
}
export function verify(secret, headers, body, now) {
  if (typeof headers['webhook-id'] !== 'string' || !headers['webhook-id']) throw new Error('Missing webhook ID');
  const timestamp = headers['webhook-timestamp'];
  if (!/^\d+$/.test(timestamp ?? '') || Math.abs(now / 1000 - Number(timestamp)) > 300) throw new Error('Stale signing timestamp');
  const expected = sign(secret, headers['webhook-id'], Number(timestamp) * 1000, body)['webhook-signature'];
  if (!(headers['webhook-signature'] ?? '').split(' ').some(s => equal(s, expected))) throw new Error('Invalid signature');
}
export class Journal {
  constructor(path, initial) { this.path = path; this.data = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : initial; }
  save() { writeFileSync(`${this.path}.tmp`, JSON.stringify(this.data, null, 2), { mode: 0o600 }); renameSync(`${this.path}.tmp`, this.path); }
}
export function identity(principal, params) {
  return `sub_${createHash('sha256').update(JSON.stringify(canonical([principal, params.delivery.url, params.name, params.arguments]))).digest('hex').slice(0, 24)}`;
}
export class Broker {
  constructor(path, { now, authorized, transport }) {
    this.store = new Journal(path, { subscriptions: {}, deliveries: {} });
    Object.assign(this, { now, authorized, transport });
  }
  active(sub) { return sub && sub.active && sub.expires > this.now() && this.authorized(sub.owner, sub.arguments.project_id); }
  async subscribe(owner, params) {
    if (params.name !== 'task.created' || !params.arguments || Object.keys(params.arguments).length !== 1 || typeof params.arguments.project_id !== 'string') throw new Error('Invalid event filter');
    if (!this.authorized(owner, params.arguments.project_id)) throw new Error('Forbidden');
    // No network is used. Only this controlled destination is accepted by the fixture.
    if (params.delivery?.mode !== 'webhook' || params.delivery.url !== 'https://receiver.example.test/callback') throw new Error('Uncontrolled callback');
    key(params.delivery.secret);
    if (params.cursor != null) throw new Error('Replay unsupported');
    if (params.ttlMs != null && (!Number.isFinite(params.ttlMs) || params.ttlMs <= 0)) throw new Error('Invalid TTL');
    const id = identity(owner, params);
    const challenge = randomBytes(24).toString('base64');
    const body = JSON.stringify({ type: 'verification', challenge });
    const headers = { ...sign(params.delivery.secret, `verification_${randomBytes(12).toString('hex')}`, this.now(), body), 'x-mcp-subscription-id': id };
    let response;
    try { response = await this.transport({ body, headers, verificationSecret: params.delivery.secret }); }
    catch { throw Object.assign(new Error('Callback verification failed'), { code: -32015, reason: 'timeout' }); }
    if (!(response.status >= 200 && response.status < 300) || !equal(response.challenge ?? '', challenge)) throw Object.assign(new Error('Callback verification failed'), { code: -32015, reason: 'challenge_failed' });
    this.store.data.subscriptions[id] = { id, owner, name: params.name, arguments: params.arguments, secret: params.delivery.secret,
      url: params.delivery.url, active: true, expires: this.now() + Math.min(params.ttlMs ?? 3600000, 3600000) };
    this.store.save();
    return { id, refreshBefore: new Date(this.store.data.subscriptions[id].expires).toISOString(), cursor: null, truncated: false };
  }
  unsubscribe(owner, params) {
    const id = identity(owner, params); const sub = this.store.data.subscriptions[id];
    if (sub) { sub.active = false; this.store.save(); } // Keep a tombstone; do not delete pending work.
    return {};
  }
  enqueue(event) {
    if (event.name !== 'task.created' || typeof event.eventId !== 'string' || !event.eventId || typeof event.data?.project_id !== 'string'
      || typeof event.data.task_id !== 'string' || typeof event.data.title !== 'string' || !/^\d{4}-.*(?:Z|[+-]\d\d:\d\d)$/.test(event.timestamp ?? '')
      || !Number.isFinite(Date.parse(event.timestamp)) || event.cursor !== null) throw new Error('Invalid event');
    const body = JSON.stringify(event);
    if (Buffer.byteLength(body) > MAX_BODY) throw new Error('Payload exceeds 256 KiB');
    for (const sub of Object.values(this.store.data.subscriptions)) {
      if (!this.active(sub) || sub.arguments.project_id !== event.data.project_id) continue;
      const id = `${sub.id}:${event.eventId}`;
      this.store.data.deliveries[id] ??= { subscriptionId: sub.id, body, eventId: event.eventId, attempts: 0, nextAt: this.now(), status: 'pending', trace: [] };
    }
    this.store.save();
  }
  async tick() {
    for (const delivery of Object.values(this.store.data.deliveries)) {
      if (delivery.status !== 'pending' || delivery.nextAt > this.now()) continue;
      const sub = this.store.data.subscriptions[delivery.subscriptionId];
      if (!this.active(sub)) { delivery.status = 'cancelled'; this.store.save(); continue; }
      const headers = { ...sign(sub.secret, delivery.eventId, this.now(), delivery.body), 'x-mcp-subscription-id': sub.id };
      let status;
      try { status = (await this.transport({ body: delivery.body, headers })).status; } catch { status = 0; }
      delivery.attempts++;
      delivery.trace.push({ status, signedAt: headers['webhook-timestamp'], id: headers['webhook-id'] });
      const transient = status === 0 || status === 408 || status === 429 || status >= 500;
      delivery.status = status >= 200 && status < 300 ? 'received' : transient && delivery.attempts < 4 ? 'pending' : 'dead';
      delivery.nextAt = this.now() + Math.min(1000 * 2 ** (delivery.attempts - 1), 8000);
      this.store.save();
    }
  }
}
export class Receiver {
  constructor(path, { now, subscription }) { this.store = new Journal(path, { challenges: {}, inbox: {}, drafts: {} }); Object.assign(this, { now, subscription }); }
  receive({ body, headers, verificationSecret }) {
    if (Buffer.byteLength(body) > MAX_BODY) return { status: 413 };
    const sub = this.subscription(headers['x-mcp-subscription-id']);
    try { verify(verificationSecret ?? sub?.secret, headers, body, this.now()); } catch { return { status: 401 }; }
    let event;
    try { event = JSON.parse(body); } catch { return { status: 400 }; }
    if (event.type === 'verification') {
      const id = headers['webhook-id'];
      if (!verificationSecret || typeof event.challenge !== 'string' || this.store.data.challenges[id]) return { status: 409 };
      this.store.data.challenges[id] = this.now(); this.store.save();
      return { status: 200, challenge: event.challenge };
    }
    if (!sub?.active || sub.expires <= this.now()) return { status: 410 };
    if (event.eventId !== headers['webhook-id'] || event.name !== sub.name || event.data?.project_id !== sub.arguments.project_id || typeof event.data?.title !== 'string' || typeof event.data.task_id !== 'string') return { status: 400 };
    const id = `${sub.id}:${event.eventId}`;
    this.store.data.inbox[id] ??= { event, subscriptionId: sub.id, state: 'queued' };
    this.store.save(); // Persist before acknowledgment; draft creation is a later operation.
    return { status: 202 };
  }
  drain(authorized) {
    for (const [id, job] of Object.entries(this.store.data.inbox)) {
      if (job.state !== 'queued') continue;
      const sub = this.subscription(job.subscriptionId);
      if (!sub?.active || sub.expires <= this.now() || !authorized(sub.owner, sub.arguments.project_id)) { job.state = 'cancelled'; continue; }
      // Deliberately deterministic, draft-only output. Untrusted title remains data.
      this.store.data.drafts[id] ??= { taskId: job.event.data.task_id, title: job.event.data.title, status: 'draft', sourceEvent: job.event.eventId };
      job.state = 'completed';
    }
    this.store.save(); // Inbox completion + idempotent output share one local transaction.
  }
}
