/**
 * Decide One — product analytics, off unless the person says otherwise.
 *
 * B3 resolved in the user's favour. Two independent gates, both of which must
 * be true before a single event is sent:
 *
 *   1. VITE_ENABLE_TELEMETRY === 'true' at build time (deployment's choice)
 *   2. Stored consent of 'granted' on this device (the person's choice)
 *
 * Default is off. Absence of an answer is not consent, so an unset value keeps
 * everything silent. No claim of "zero telemetry" may be made anywhere while
 * this file exists — the honest claim is that nothing is sent unless asked for,
 * and that journal text never leaves the device either way.
 *
 * - Strictly strips private journal text, reflections, and notes
 * - High-throughput micro-batching with 5-second cadence
 * - Guaranteed delivery via navigator.sendBeacon on tab unload
 * - Real-time active dwell time vs idle detection
 * - Rage-click detection and automatic client error tracking
 * - Offline queueing via localStorage
 */

export const CONSENT_KEY = 'decideone_telemetry_consent';
export const INSTALL_DATE_KEY = 'decideone_install_date';

/**
 * The day this device first opened Decide One, recorded separately from the
 * anonymous id on purpose.
 *
 * Identity here is a localStorage key, so clearing site data reads as churn
 * when it is really a reset. Keeping the install date apart means a fresh id
 * arriving on a device that already has one is visible as a reset rather than
 * being silently counted as a new user who never came back.
 *
 * It is a date, not a timestamp: it answers "how long has this person had the
 * product", which is a question about days.
 */
export function getOrCreateInstallDate() {
  try {
    const existing = localStorage.getItem(INSTALL_DATE_KEY);
    if (existing) return existing;
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(INSTALL_DATE_KEY, today);
    return today;
  } catch {
    // Private browsing, or storage disabled. Not knowing is fine; guessing is not.
    return null;
  }
}

/** Whole days since this device first opened the product, or null if unknown. */
export function getHistoryDepthDays() {
  const installed = getOrCreateInstallDate();
  if (!installed) return null;
  const ms = Date.now() - new Date(installed + 'T00:00:00').getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

/** Consent is explicit or it does not exist. Unset means no. */
export function hasTelemetryConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch (e) {
    return false;
  }
}

export function setTelemetryConsent(granted) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch (e) {
    /* storage unavailable — stays off, which is the safe direction */
  }
}

const INGEST_URL = '/api/v1/telemetry/events';
const HEARTBEAT_URL = '/api/v1/telemetry/heartbeat';
const BATCH_INTERVAL_MS = 5000;
const HEARTBEAT_INTERVAL_MS = 30000;
const IDLE_THRESHOLD_MS = 30000;

// Zero-Knowledge Sensitive Field Guard
const SENSITIVE_PROPS = new Set([
  'text', 'title', 'note', 'reflection', 'content', 'rationale',
  'task_text', 'decision_text', 'search_query', 'raw_transcript', 'password', 'key'
]);

function getOrCreateId(storage, key, prefix, legacyKey) {
  try {
    let id = storage.getItem(key);
    if (!id && legacyKey) {
      id = storage.getItem(legacyKey);
      if (id) storage.setItem(key, id);
    }
    if (!id) {
      id = `${prefix}_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      storage.setItem(key, id);
    }
    return id;
  } catch (e) {
    return `${prefix}_fallback_${Date.now()}`;
  }
}

class TelemetrySDK {
  constructor() {
    // Both gates, every time. A build with the flag on still sends nothing
    // until this person, on this device, has said yes.
    this.isBrowser =
      typeof window !== 'undefined' &&
      import.meta.env.VITE_ENABLE_TELEMETRY === 'true' &&
      hasTelemetryConsent();
    if (!this.isBrowser) return;

    this.anonymousId = getOrCreateId(localStorage, 'decideone_anon_id', 'usr', 'pocketbook_anon_id');
    this.installDate = getOrCreateInstallDate();
    this.sessionId = getOrCreateId(sessionStorage, 'decideone_sess_id', 'sess', 'pocketbook_sess_id');

    this.queue = [];
    this.isFlushing = false;
    this.lastInteractionTime = Date.now();
    this.activeSecondsAccumulator = 0;
    this.idleSecondsAccumulator = 0;
    this.currentView = 'daily';

    this.lastClickTarget = null;
    this.lastClickTime = 0;
    this.clickCountOnTarget = 0;

    // Trailing 10-action breadcrumb ring buffer for pathfinder drop-off analysis
    this.breadcrumbs = [];

    this.init();
  }

  init() {
    // 1. Drain any offline queue from previous sessions
    this.drainOfflineQueue();

    // 2. Setup periodic batch flusher
    setInterval(() => this.flush(), BATCH_INTERVAL_MS);

    // 3. Setup heartbeat for dwell time tracking
    setInterval(() => this.sendHeartbeat(), HEARTBEAT_INTERVAL_MS);

    // 4. Setup user activity listeners (active vs idle)
    const recordActivity = () => {
      this.lastInteractionTime = Date.now();
    };

    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evtName => {
      window.addEventListener(evtName, recordActivity, { passive: true });
    });

    // 5. Rage Click Detector (>= 3 clicks within 500ms on same target)
    window.addEventListener('click', (e) => {
      const target = e.target;
      const now = Date.now();

      if (this.lastClickTarget === target && (now - this.lastClickTime) < 500) {
        this.clickCountOnTarget++;
        if (this.clickCountOnTarget === 3) {
          this.track('rage_click_detected', {
            target_tag: target.tagName,
            target_class: (target.className && typeof target.className === 'string') ? target.className.slice(0, 50) : '',
            click_count: this.clickCountOnTarget
          });
        }
      } else {
        this.lastClickTarget = target;
        this.clickCountOnTarget = 1;
      }
      this.lastClickTime = now;
    }, { passive: true });

    // 6. Unhandled Error Catcher
    window.addEventListener('error', (err) => {
      this.track('client_error', {
        error_message: (err.message || 'Unknown').slice(0, 100),
        lineno: err.lineno,
        colno: err.colno
      });
    });

    // 7. Guaranteed delivery on unload / backgrounding via sendBeacon
    const handleUnload = () => {
      if (this.breadcrumbs.length > 1) {
        this.track('exit_breadcrumbs', { trail: [...this.breadcrumbs] });
      }
      this.sendHeartbeat();
      this.flushBeacon();
    };

    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleUnload();
      }
    });
    window.addEventListener('pagehide', handleUnload);

    // 8. Drain offline queue on reconnect
    window.addEventListener('online', () => this.drainOfflineQueue());

    // 9. Emit initial session_start
    this.track('session_start', {
      view_mode: this.currentView,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      referrer: document.referrer ? 'external' : 'direct'
    });
  }

  setCurrentView(viewName) {
    if (this.currentView !== viewName) {
      this.track('view_changed', {
        from_view: this.currentView,
        to_view: viewName
      });
      this.recordTransition(this.currentView, viewName);
      this.currentView = viewName;
    }
  }

  /**
   * Record a surface transition for pathfinder analysis
   */
  recordTransition(fromSurface, toSurface, exitType = 'normal') {
    this.track('surface_transition', {
      from_surface: fromSurface,
      to_surface: toSurface,
      exit_type: exitType
    });
  }

  /**
   * Record cognitive hesitation / First Keypress Latency (FKL)
   */
  recordHesitation(surface, fklMs, wasAbandoned = false) {
    this.track('cognitive_hesitation', {
      surface,
      first_keypress_latency_ms: Math.round(fklMs),
      was_abandoned: wasAbandoned
    });
  }

  /**
   * Record task debt triage in evening closure ritual
   */
  recordTaskTriage(triageAction, ageDays = 1) {
    this.track('task_triage', {
      triage_action: triageAction,
      task_age_days: ageDays
    });
  }

  /**
   * Track a telemetry event with zero-knowledge sanitization
   */
  track(eventName, rawProperties = {}) {
    if (!this.isBrowser) return;

    // Buffer into breadcrumbs trail for pathfinder drop-off modeling
    if (eventName !== 'exit_breadcrumbs' && eventName !== 'session_heartbeat') {
      this.breadcrumbs.push(eventName);
      if (this.breadcrumbs.length > 10) this.breadcrumbs.shift();
    }

    // Sanitize properties: strip any sensitive journal content
    const sanitizedProps = {};
    for (const [key, val] of Object.entries(rawProperties)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_PROPS.has(lowerKey)) {
        sanitizedProps[`${key}_length`] = typeof val === 'string' ? val.length : 0;
      } else if (typeof val === 'string') {
        sanitizedProps[key] = val.slice(0, 80);
      } else if (typeof val === 'number' || typeof val === 'boolean') {
        sanitizedProps[key] = val;
      } else if (Array.isArray(val)) {
        sanitizedProps[`${key}_count`] = val.length;
      }
    }

    const payload = {
      event_id: `evt_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      session_id: this.sessionId,
      anonymous_id: this.anonymousId,
      event: eventName,
      properties: sanitizedProps,
      timestamp: new Date().toISOString()
    };

    this.queue.push(payload);

    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Flush queue via asynchronous HTTP POST
   */
  async flush() {
    if (!this.isBrowser || this.isFlushing || this.queue.length === 0) return;

    this.isFlushing = true;
    const batch = [...this.queue];
    this.queue = [];

    try {
      const res = await fetch(INGEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch),
        keepalive: true
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      // Network failure: save to offline queue
      this.saveToOfflineQueue(batch);
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Flush queue synchronously via navigator.sendBeacon on tab close
   */
  flushBeacon() {
    if (!this.isBrowser || this.queue.length === 0) return;
    const batch = [...this.queue];
    this.queue = [];

    try {
      const blob = new Blob([JSON.stringify(batch)], { type: 'application/json' });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(INGEST_URL, blob);
      } else {
        fetch(INGEST_URL, {
          method: 'POST',
          body: blob,
          keepalive: true
        });
      }
    } catch (e) {
      this.saveToOfflineQueue(batch);
    }
  }

  /**
   * Send heartbeat to record active dwell vs idle duration
   */
  sendHeartbeat() {
    if (!this.isBrowser) return;

    const now = Date.now();
    const isIdle = (now - this.lastInteractionTime) > IDLE_THRESHOLD_MS;

    const deltaActive = isIdle ? 0 : 30;
    const deltaIdle = isIdle ? 30 : 0;

    const payload = {
      session_id: this.sessionId,
      anonymous_id: this.anonymousId,
      active_seconds: deltaActive,
      idle_seconds: deltaIdle,
      current_view: this.currentView
    };

    try {
      if (navigator.sendBeacon && document.visibilityState === 'hidden') {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(HEARTBEAT_URL, blob);
      } else {
        fetch(HEARTBEAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {}
  }

  saveToOfflineQueue(batch) {
    try {
      const existing = JSON.parse(localStorage.getItem('pb_telemetry_offline') || '[]');
      const combined = [...existing, ...batch].slice(-200); // keep at most 200 events
      localStorage.setItem('pb_telemetry_offline', JSON.stringify(combined));
    } catch (e) {}
  }

  async drainOfflineQueue() {
    try {
      const saved = localStorage.getItem('pb_telemetry_offline');
      if (!saved) return;
      const batch = JSON.parse(saved);
      if (batch.length === 0) return;

      const res = await fetch(INGEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch)
      });

      if (res.ok) {
        localStorage.removeItem('pb_telemetry_offline');
      }
    } catch (e) {}
  }
}

export const telemetry = new TelemetrySDK();
