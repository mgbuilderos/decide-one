/**
 * Decide One — the production edge.
 *
 * Until now this Worker ran no code at all: `dist` was uploaded and served
 * directly, which is why the app has been posting telemetry to a relative path
 * with no handler behind it. Every event the SDK ever sent in production went
 * to the SPA fallback and was answered with an HTML page.
 *
 * This adds exactly one thing - an ingestion endpoint - and passes everything
 * else straight to the assets, so the static-first behaviour is unchanged.
 *
 * B-39 is intact: same origin, first-party, no script added to any page and
 * nothing new in the CSP.
 */

import { sanitizeProperties } from '../shared/telemetrySanitize.js';

const MAX_BATCH = 100;
const MAX_BODY_BYTES = 256 * 1024;
const MAX_HEARTBEAT_SECONDS = 3600;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      // Same-origin only. There is no case for another site posting here, and
      // a wildcard would invite exactly that.
      'cache-control': 'no-store'
    }
  });

/**
 * Geography, resolved by Cloudflare before the request reaches this code.
 * `request.cf` is absent in `wrangler dev` without --remote, so every field is
 * optional and a missing one stays null rather than becoming 'unknown' - a
 * placeholder that later gets counted as a country.
 */
function edgeGeo(request) {
  const cf = request.cf || {};
  return {
    country: typeof cf.country === 'string' ? cf.country : null,
    region: typeof cf.region === 'string' ? cf.region : null,
    city: typeof cf.city === 'string' ? cf.city : null
  };
}

const str = (v, max = 100) => (typeof v === 'string' && v ? v.slice(0, max) : null);

function localHour(props) {
  // The browser sends its own hour. Deriving it here from a UTC timestamp is
  // what produced a circadian metric that calls a Delhi morning 'evening'.
  const h = Number(props?.local_hour);
  return Number.isInteger(h) && h >= 0 && h <= 23 ? h : null;
}

const clampSeconds = (value, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(Math.round(n), MAX_HEARTBEAT_SECONDS);
};

async function readJson(request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) throw new Error('Payload too large');
  if (!raw) return {};
  return JSON.parse(raw);
}

async function ingestEvents(request, env) {
  const body = await readJson(request);
  const incoming = Array.isArray(body) ? body : (body.events || []);
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return json({ success: true, ingested: 0, errors: 0 });
  }

  const geo = edgeGeo(request);
  const receivedAt = new Date().toISOString();
  const statements = [];
  let errors = 0;

  const insert = env.DB.prepare(`
    INSERT OR IGNORE INTO events (
      event_id, session_id, anonymous_id, event, properties, timestamp,
      received_at, local_hour, country, region, city,
      referrer_host, utm_source, utm_medium, utm_campaign, device_class, entry_view
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const evt of incoming.slice(0, MAX_BATCH)) {
    const { session_id, anonymous_id, event, properties = {} } = evt || {};
    if (!session_id || !anonymous_id || !event) { errors++; continue; }

    const clean = sanitizeProperties(properties);
    statements.push(insert.bind(
      str(evt.event_id, 64) || crypto.randomUUID(),
      str(session_id, 64),
      str(anonymous_id, 64),
      str(event, 64),
      JSON.stringify(clean),
      str(evt.timestamp, 32) || receivedAt,
      receivedAt,
      localHour(clean),
      geo.country, geo.region, geo.city,
      str(clean.referrer_host, 253),
      str(clean.utm_source), str(clean.utm_medium), str(clean.utm_campaign),
      str(clean.device_class, 32), str(clean.entry_view, 32)
    ));
  }

  if (statements.length === 0) return json({ success: true, ingested: 0, errors });

  // One round trip. D1 charges per statement but batches atomically, and the
  // per-event loop the Node service uses would be one network hop each here.
  await env.DB.batch(statements);
  return json({ success: true, ingested: statements.length, errors });
}

async function recordHeartbeat(request, env) {
  const body = await readJson(request);
  const sessionId = str(body.session_id, 64);
  if (!sessionId) return json({ success: false, error: 'Missing session_id' }, 400);

  const geo = edgeGeo(request);
  const now = new Date().toISOString();
  const active = clampSeconds(body.active_seconds, 30);
  const idle = clampSeconds(body.idle_seconds, 0);

  await env.DB.prepare(`
    INSERT INTO sessions (
      session_id, anonymous_id, start_time, last_heartbeat,
      active_seconds, idle_seconds, final_view, local_hour, country, region, city
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      last_heartbeat = excluded.last_heartbeat,
      active_seconds = active_seconds + excluded.active_seconds,
      idle_seconds   = idle_seconds + excluded.idle_seconds,
      final_view     = excluded.final_view
  `).bind(
    sessionId,
    str(body.anonymous_id, 64) || 'anonymous',
    now, now, active, idle,
    str(body.current_view, 32) || 'daily',
    localHour(body),
    geo.country, geo.region, geo.city
  ).run();

  return json({ success: true, session_id: sessionId, active_seconds: active, idle_seconds: idle });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/v1/telemetry/')) {
      if (request.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
      // Without a database bound, say so rather than accepting the data and
      // dropping it. Silently succeeding is how this went unnoticed for weeks.
      if (!env.DB) return json({ error: 'Telemetry storage is not configured' }, 503);

      try {
        if (url.pathname === '/api/v1/telemetry/events') return await ingestEvents(request, env);
        if (url.pathname === '/api/v1/telemetry/heartbeat') return await recordHeartbeat(request, env);
        return json({ error: 'Not Found' }, 404);
      } catch (err) {
        // The message is deliberately not echoed: it can carry column names and
        // fragments of the payload.
        console.error('[telemetry]', err && err.message);
        return json({ error: 'Telemetry write failed' }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
