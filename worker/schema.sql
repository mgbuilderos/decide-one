-- Decide One telemetry, production schema (Cloudflare D1).
--
-- Mirrors server/src/db.js, which stays the development database, and adds the
-- System A fields TELEMETRY_SPEC §3.1 asks for. Three columns exist to close
-- defects the local schema has:
--
--   received_at  - server time. Every metric today keys off the CLIENT's
--                  `timestamp`, which any client can set to anything, so a
--                  skewed clock quietly moves DAU. Keep both: `timestamp` is
--                  what the browser believed, `received_at` is what is true.
--   local_hour   - the hour as the PERSON experienced it. getCircadianMetrics
--                  buckets by getUTCHours, which files a Delhi morning under
--                  afternoon and is why the dual-visit loop reads 0%.
--   country/…    - resolved by Cloudflare at the edge from the connecting IP.
--                  §3.1 asks for the IP to be "discarded in the same request";
--                  this is stronger - it never enters our process at all.

CREATE TABLE IF NOT EXISTS events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id      TEXT UNIQUE NOT NULL,
  session_id    TEXT NOT NULL,
  anonymous_id  TEXT NOT NULL,
  event         TEXT NOT NULL,
  properties    TEXT NOT NULL,          -- JSON, already sanitized
  timestamp     TEXT NOT NULL,          -- client clock, untrusted
  received_at   TEXT NOT NULL,          -- server clock, authoritative
  local_hour    INTEGER,                -- 0-23 in the visitor's own timezone
  -- Where they were, resolved at the edge. Country only is guaranteed; region
  -- and city are best-effort and may be null.
  country       TEXT,
  region        TEXT,
  city          TEXT,
  -- How they got here. Client-supplied, because the Referer on a same-origin
  -- POST is this site. Host only, never a full URL: a referring path can
  -- itself be private.
  referrer_host TEXT,
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  -- Buckets, not versions to three decimals.
  device_class  TEXT,
  entry_view    TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_received ON events(received_at);
CREATE INDEX IF NOT EXISTS idx_events_name     ON events(event);
CREATE INDEX IF NOT EXISTS idx_events_session  ON events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_anon     ON events(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_events_country  ON events(country);
CREATE INDEX IF NOT EXISTS idx_events_source   ON events(utm_source, referrer_host);

CREATE TABLE IF NOT EXISTS sessions (
  session_id     TEXT PRIMARY KEY,
  anonymous_id   TEXT NOT NULL,
  start_time     TEXT NOT NULL,
  last_heartbeat TEXT NOT NULL,
  active_seconds INTEGER DEFAULT 0,
  idle_seconds   INTEGER DEFAULT 0,
  -- total_events is deliberately absent. It existed here, nothing in the
  -- Worker ever wrote it, and it would have read 0 for every session forever —
  -- the exact shape QC Rule 25 was written for. It is also derivable:
  --   SELECT COUNT(*) FROM events WHERE session_id = ?
  -- and idx_events_session makes that cheap. A stored counter adds a way for
  -- the number to be WRONG (a replayed batch double-counts) in exchange for a
  -- speed-up nothing needed. Derive it; do not store it.
  device_class   TEXT,
  initial_view   TEXT,
  final_view     TEXT,
  local_hour     INTEGER,
  country        TEXT,
  region         TEXT,
  city           TEXT,
  referrer_host  TEXT,
  utm_source     TEXT,
  utm_medium     TEXT,
  utm_campaign   TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_start   ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON sessions(country);
