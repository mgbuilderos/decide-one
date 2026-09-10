/**
 * Decide One — the execution model (§1B).
 *
 * Selection answers "which things". Execution answers "when and how long".
 * This file is the second half: durations, the timer state machine, and the
 * planned-versus-actual accounting that makes the question *are your timeboxes
 * honest?* answerable.
 *
 * Ported as a model, not as code (R15): Focus was Next.js + Zustand, this is
 * Vite + localStorage, so the types and the state machine cross and nothing else.
 */

export const STATES = {
  IDLE: 'IDLE',
  BREATHING: 'BREATHING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  DONE: 'DONE'
};

/** R9 — a deliberate pause between pressing start and the clock running. */
export const BREATHING_SECONDS = 3;

/** A session left running past this without a tick is no longer trustworthy (R17). */
export const STALE_SESSION_SECONDS = 15 * 60;

export const DURATION_CHOICES = [15, 25, 45, 60, 90, 120];

export function emptySession(plannedDurationSec = 0) {
  return {
    plannedDurationSec,
    actualFocusSec: 0,
    pausedDurationSec: 0,
    overtimeSec: 0,
    state: STATES.IDLE,
    timingAccuracy: 'measured',
    startedAt: null,
    lastTickAt: null
  };
}

export function getSession(dailyLog, itemId) {
  return dailyLog?.execution?.[itemId] || emptySession();
}

export function formatDuration(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

/**
 * P14 — the capacity check, which is the clock's main job and happens before
 * it ever runs. Three tasks at three hours is nine hours, and the day has not
 * got nine hours. Little's Law made visible: the cap is only real if it caps
 * time rather than line count.
 */
export function computeCapacity(sessions, now = new Date()) {
  const plannedSec = sessions.reduce((sum, s) => sum + (s.plannedDurationSec || 0), 0);
  const endOfWorkingDay = new Date(now);
  endOfWorkingDay.setHours(18, 0, 0, 0);
  const remainingSec = Math.max(0, (endOfWorkingDay - now) / 1000);

  return {
    plannedSec,
    remainingSec,
    endHour: 18,
    // Literally impossible: more planned time than clock left.
    overcommitted: plannedSec > remainingSec && remainingSec > 0,
    overBySec: Math.max(0, plannedSec - remainingSec),
    /**
     * Descriptive, not a verdict. Planning nine hours into nine remaining hours
     * is arithmetically fine and practically a fiction — it leaves no gap for
     * lunch, travel, or a single interruption. We state that fact and let the
     * person judge (Rule 5). We deliberately assert no focus-hours ceiling:
     * FOUNDATIONS.md §5 forbids claiming research this product does not have.
     */
    noSlack: remainingSec > 0 && plannedSec > remainingSec * 0.8 && plannedSec <= remainingSec
  };
}

/**
 * R6 — the timer is the enforcement mechanism, not a feature. Ivy Lee's #2 will
 * not start until #1 is closed. Order is the whole method; without this it is a
 * numbered list, which is what every other app already ships.
 */
export function isItemLocked(framework, items, index) {
  if (framework !== 'ivy_lee') return false;
  return items.slice(0, index).some(item => !item.completed);
}

export function startSession(session) {
  return {
    ...session,
    state: STATES.BREATHING,
    startedAt: session.startedAt || new Date().toISOString(),
    lastTickAt: new Date().toISOString()
  };
}

export function beginRunning(session) {
  return { ...session, state: STATES.RUNNING, lastTickAt: new Date().toISOString() };
}

export function pauseSession(session) {
  return { ...session, state: STATES.PAUSED, lastTickAt: new Date().toISOString() };
}

/** One second of measured focus. Overtime accrues separately so it stays legible. */
export function tick(session) {
  const planned = session.plannedDurationSec || 0;
  const nextFocus = session.actualFocusSec + 1;
  return {
    ...session,
    actualFocusSec: nextFocus,
    overtimeSec: planned > 0 ? Math.max(0, nextFocus - planned) : 0,
    lastTickAt: new Date().toISOString()
  };
}

/** R8 — overrun is never punitive. More time is added as information. */
export function extendSession(session, extraSec) {
  return { ...session, plannedDurationSec: (session.plannedDurationSec || 0) + extraSec, overtimeSec: 0 };
}

export function completeSession(session) {
  return { ...session, state: STATES.DONE, lastTickAt: new Date().toISOString() };
}

/**
 * R17 — abandoned sessions are handled by provenance, not by guessing.
 * A laptop shut at 11am and reopened at 4pm must not report five hours of focus.
 * The session is suspended and marked inferred; a figure that was guessed is
 * never presented as one that was measured.
 */
export function reconcileOnReturn(session, now = new Date()) {
  if (session.state !== STATES.RUNNING || !session.lastTickAt) return session;
  const gapSec = (now - new Date(session.lastTickAt)) / 1000;
  if (gapSec < STALE_SESSION_SECONDS) return session;
  return { ...session, state: STATES.PAUSED, timingAccuracy: 'inferred' };
}

/** Flattens the active method's items into one ordered list the right page can render. */
export function getFrameworkItems(dailyLog) {
  const framework = dailyLog?.activeFramework || 'rule_of_3';
  const data = dailyLog?.frameworkData || {};
  const named = (arr, prefix) =>
    (arr || [])
      .map((t, i) => ({ id: t?.id || `${prefix}_${i}`, text: (t?.text || '').trim(), completed: !!t?.completed }))
      .filter(t => t.text);

  if (framework === 'rule_of_3') return named(dailyLog?.hardTasks, 'r3');
  if (framework === 'ivy_lee') return named(data.ivy_lee?.tasks, 'il');
  if (framework === 'eisenhower') {
    const quadrants = data.eisenhower?.quadrants || {};
    return Object.entries(quadrants).flatMap(([key, arr]) => named(arr, key));
  }
  return [];
}
