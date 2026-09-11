import { db } from './db.js';
import crypto from 'node:crypto';

// Prepared statements for high-throughput execution
const insertEventStmt = db.prepare(`
  INSERT OR IGNORE INTO events (event_id, session_id, anonymous_id, event, properties, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const getSessionStmt = db.prepare(`
  SELECT session_id, active_seconds, idle_seconds, total_events FROM sessions WHERE session_id = ?
`);

const insertSessionStmt = db.prepare(`
  INSERT INTO sessions (session_id, anonymous_id, start_time, last_heartbeat, device_type, initial_view)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const updateSessionHeartbeatStmt = db.prepare(`
  UPDATE sessions 
  SET last_heartbeat = ?, active_seconds = active_seconds + ?, idle_seconds = idle_seconds + ?, final_view = ?
  WHERE session_id = ?
`);

const incrementSessionEventStmt = db.prepare(`
  UPDATE sessions
  SET total_events = total_events + 1
  WHERE session_id = ?
`);

const upsertCohortStmt = db.prepare(`
  INSERT INTO user_cohorts (anonymous_id, first_seen_date, last_seen_date, total_sessions, is_patron)
  VALUES (?, ?, ?, 1, ?)
  ON CONFLICT(anonymous_id) DO UPDATE SET
    last_seen_date = excluded.last_seen_date,
    total_sessions = total_sessions + 1,
    is_patron = MAX(user_cohorts.is_patron, excluded.is_patron)
`);

const insertFrictionStmt = db.prepare(`
  INSERT INTO friction_logs (session_id, anonymous_id, friction_type, details)
  VALUES (?, ?, ?, ?)
`);

const insertPathfinderStmt = db.prepare(`
  INSERT INTO pathfinder_transitions (session_id, anonymous_id, from_surface, to_surface, exit_type, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertTaskDebtStmt = db.prepare(`
  INSERT INTO task_debt_logs (session_id, anonymous_id, triage_action, task_age_days, timestamp)
  VALUES (?, ?, ?, ?, ?)
`);

const insertHesitationStmt = db.prepare(`
  INSERT INTO cognitive_hesitations (session_id, anonymous_id, surface, first_keypress_latency_ms, was_abandoned, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertExpImpressionStmt = db.prepare(`
  INSERT INTO experiment_impressions (experiment_id, variant, anonymous_id, session_id, converted, timestamp)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const convertExpStmt = db.prepare(`
  UPDATE experiment_impressions SET converted = 1 WHERE session_id = ?
`);

// Strict Zero-Knowledge Telemetry Sanitizer
// Strips any potential raw text properties to guarantee zero private user content is stored
// Matched as substrings, so `taskText`, `noteBody` and `decision_rationale` are
// all caught. Exact-match missed every camelCase spelling and stored the value.
// Over-redaction is the safe direction here: a wrongly redacted prop costs one
// metric, a wrongly kept one stores what someone wrote.
const SENSITIVE_SUBSTRINGS = [
  'text', 'title', 'note', 'reflection', 'content', 'rationale',
  'query', 'transcript', 'password', 'secret'
];
// Short and ambiguous, so exact only: `key` as a substring would redact
// `first_keypress_latency_ms` and take the hesitation metric with it.
const SENSITIVE_EXACT = new Set(['key', 'token']);

function isSensitiveKey(lowerKey) {
  if (SENSITIVE_EXACT.has(lowerKey)) return true;
  return SENSITIVE_SUBSTRINGS.some(s => lowerKey.includes(s));
}

const MAX_HEARTBEAT_SECONDS = 3600;

function clampSeconds(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(Math.round(n), MAX_HEARTBEAT_SECONDS);
}

function sanitizeProperties(properties) {
  if (!properties || typeof properties !== 'object') return {};
  const clean = {};
  for (const [key, value] of Object.entries(properties)) {
    const lowerKey = key.toLowerCase();
    if (isSensitiveKey(lowerKey)) {
      clean[`${key}_length`] = typeof value === 'string' ? value.length : 0;
      continue;
    }
    // Allow numbers, booleans, safe enums/strings (under 100 chars)
    if (typeof value === 'boolean' || typeof value === 'number') {
      clean[key] = value;
    } else if (typeof value === 'string') {
      // Truncate non-sensitive strings to avoid payload bloat
      clean[key] = value.slice(0, 100);
    } else if (Array.isArray(value)) {
      clean[`${key}_count`] = value.length;
    }
  }
  return clean;
}

export const TelemetryService = {
  /**
   * Ingest a batch of telemetry events
   */
  ingestBatch(events) {
    if (!Array.isArray(events) || events.length === 0) {
      return { ingested: 0, errors: 0 };
    }

    let ingested = 0;
    let errors = 0;

    for (const evt of events) {
      try {
        const {
          event_id = crypto.randomUUID(),
          session_id,
          anonymous_id,
          event,
          properties = {},
          timestamp = new Date().toISOString()
        } = evt;

        if (!session_id || !anonymous_id || !event) {
          errors++;
          continue;
        }

        const cleanProps = sanitizeProperties(properties);
        const propsJson = JSON.stringify(cleanProps);

        // Record event
        insertEventStmt.run(event_id, session_id, anonymous_id, event, propsJson, timestamp);
        incrementSessionEventStmt.run(session_id);

        // Handle specific behavioral events
        if (event === 'session_start') {
          const deviceType = cleanProps.device_type || 'desktop';
          const initialView = cleanProps.view_mode || 'daily';
          const isPatron = cleanProps.is_patron ? 1 : 0;
          const today = timestamp.slice(0, 10);

          try {
            insertSessionStmt.run(session_id, anonymous_id, timestamp, timestamp, deviceType, initialView);
          } catch (e) {
            // Ignore if session already exists
          }
          upsertCohortStmt.run(anonymous_id, today, today, isPatron);
        } else if (event === 'rage_click_detected') {
          insertFrictionStmt.run(session_id, anonymous_id, 'rage_click', propsJson);
        } else if (event === 'modal_abandoned') {
          insertFrictionStmt.run(session_id, anonymous_id, 'abandoned_modal', propsJson);
        } else if (event === 'client_error') {
          insertFrictionStmt.run(session_id, anonymous_id, 'client_error', propsJson);
        } else if (event === 'surface_transition') {
          insertPathfinderStmt.run(session_id, anonymous_id, cleanProps.from_surface || 'unknown', cleanProps.to_surface || 'unknown', cleanProps.exit_type || 'normal', timestamp);
        } else if (event === 'exit_breadcrumbs') {
          // Read the trail from the raw properties, not the sanitized copy.
          // sanitizeProperties turns every array into `<key>_count` and drops
          // the values, so `cleanProps.trail` was always undefined and this
          // loop never ran once - exit paths recorded nothing. They are surface
          // names, not written content, so they are bounded rather than
          // redacted: 50 hops, 64 chars each.
          const trail = Array.isArray(properties?.trail) ? properties.trail.slice(0, 50) : [];
          for (let i = 0; i < trail.length - 1; i++) {
            insertPathfinderStmt.run(
              session_id, anonymous_id,
              String(trail[i]).slice(0, 64), String(trail[i + 1]).slice(0, 64),
              'exit_trail', timestamp
            );
          }
        } else if (event === 'cognitive_hesitation') {
          insertHesitationStmt.run(session_id, anonymous_id, cleanProps.surface || 'input', cleanProps.first_keypress_latency_ms || 0, cleanProps.was_abandoned ? 1 : 0, timestamp);
        } else if (event === 'task_triage') {
          insertTaskDebtStmt.run(session_id, anonymous_id, cleanProps.triage_action || 'migrated', cleanProps.task_age_days || 1, timestamp);
        } else if (event === 'experiment_impression') {
          insertExpImpressionStmt.run(cleanProps.experiment_id || 'exp_evening_prompt', cleanProps.variant || 'control', anonymous_id, session_id, 0, timestamp);
        } else if (event === 'day_closed') {
          convertExpStmt.run(session_id);
        }

        ingested++;
      } catch (err) {
        console.error('[TelemetryService] Ingest error:', err.message);
        errors++;
      }
    }

    return { ingested, errors };
  },

  /**
   * Record a session heartbeat (tracks active dwell time vs idle)
   */
  recordHeartbeat({ session_id, anonymous_id, active_seconds = 30, idle_seconds = 0, current_view = 'daily' }) {
    if (typeof session_id !== 'string' || session_id.length === 0) {
      return { success: false, error: 'Missing session_id' };
    }
    // These land in `active_seconds + ?`, so an unvalidated value is written
    // straight into standard app time. A non-number used to throw on bind and
    // surface as a 500; a large one silently inflated the average for good.
    // ponytail: 3600 per beat is generous for a 30s heartbeat - a backgrounded
    // tab catching up is the case it leaves room for.
    active_seconds = clampSeconds(active_seconds, 30);
    idle_seconds = clampSeconds(idle_seconds, 0);
    const now = new Date().toISOString();

    const existing = getSessionStmt.get(session_id);
    if (!existing) {
      // Create session on first heartbeat if session_start was missed
      try {
        insertSessionStmt.run(session_id, anonymous_id || 'anonymous', now, now, 'unknown', current_view);
      } catch (e) {}
    }

    updateSessionHeartbeatStmt.run(now, active_seconds, idle_seconds, current_view, session_id);
    return { success: true, session_id, active_seconds, idle_seconds };
  }
};
