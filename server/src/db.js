import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'telemetry.sqlite');
export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode and performance pragmas
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA cache_size = -64000; -- 64MB cache
  PRAGMA temp_store = MEMORY;
`);

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT UNIQUE NOT NULL,
    session_id TEXT NOT NULL,
    anonymous_id TEXT NOT NULL,
    event TEXT NOT NULL,
    properties TEXT NOT NULL, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    timestamp TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_events_name ON events(event);
  CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
  CREATE INDEX IF NOT EXISTS idx_events_anon ON events(anonymous_id);

  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    anonymous_id TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    last_heartbeat DATETIME NOT NULL,
    end_time DATETIME,
    active_seconds INTEGER DEFAULT 0,
    idle_seconds INTEGER DEFAULT 0,
    total_events INTEGER DEFAULT 0,
    device_type TEXT,
    initial_view TEXT,
    final_view TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_start ON sessions(start_time);
  CREATE INDEX IF NOT EXISTS idx_sessions_anon ON sessions(anonymous_id);

  CREATE TABLE IF NOT EXISTS user_cohorts (
    anonymous_id TEXT PRIMARY KEY,
    first_seen_date DATE NOT NULL,
    last_seen_date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 1,
    is_patron BOOLEAN DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_cohorts_first_seen ON user_cohorts(first_seen_date);

  CREATE TABLE IF NOT EXISTS friction_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    anonymous_id TEXT NOT NULL,
    friction_type TEXT NOT NULL, -- 'rage_click', 'abandoned_modal', 'client_error'
    details TEXT NOT NULL, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_friction_type ON friction_logs(friction_type);

  CREATE TABLE IF NOT EXISTS pathfinder_transitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    anonymous_id TEXT NOT NULL,
    from_surface TEXT NOT NULL,
    to_surface TEXT NOT NULL,
    exit_type TEXT,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_transitions ON pathfinder_transitions(from_surface, to_surface);

  CREATE TABLE IF NOT EXISTS task_debt_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    anonymous_id TEXT NOT NULL,
    triage_action TEXT NOT NULL,
    task_age_days INTEGER DEFAULT 1,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_task_debt_action ON task_debt_logs(triage_action);

  CREATE TABLE IF NOT EXISTS cognitive_hesitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    anonymous_id TEXT NOT NULL,
    surface TEXT NOT NULL,
    first_keypress_latency_ms INTEGER NOT NULL,
    was_abandoned BOOLEAN DEFAULT 0,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_hesitations_surface ON cognitive_hesitations(surface);

  CREATE TABLE IF NOT EXISTS experiments (
    experiment_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    variants TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS experiment_impressions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experiment_id TEXT NOT NULL,
    variant TEXT NOT NULL,
    anonymous_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    converted BOOLEAN DEFAULT 0,
    timestamp TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_exp_impressions ON experiment_impressions(experiment_id, variant);
`);

console.log(`[Database] SQLite initialized in WAL mode at: ${DB_PATH}`);
