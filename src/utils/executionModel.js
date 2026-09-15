/**
 * Decide One — the execution model (§1B).
 *
 * Selection answers "which things". Execution records how much focused time
 * the person gives one of those things. This file owns the stopwatch state
 * machine and its measured elapsed time.
 *
 * Ported as a model, not as code (R15): Focus was Next.js + Zustand, this is
 * Vite + localStorage, so the types and the state machine cross and nothing else.
 */

export const STATES = {
  IDLE: 'IDLE',
  BREATHING: 'BREATHING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
  DONE: 'DONE'
};

/** R9 — a deliberate pause between pressing start and the clock running. */
export const BREATHING_SECONDS = 3;

/** A session left running past this without a tick is no longer trustworthy (R17). */
export const STALE_SESSION_SECONDS = 15 * 60;

export function emptySession(plannedDurationSec = 0) {
  return {
    plannedDurationSec,
    // Time banked from previous runs of this item. The current run is measured
    // from runStartedAt against the wall clock rather than counted in ticks.
    accumulatedSec: 0,
    actualFocusSec: 0,
    pausedDurationSec: 0,
    overtimeSec: 0,
    state: STATES.IDLE,
    timingAccuracy: 'measured',
    startedAt: null,
    runStartedAt: null,
    lastTickAt: null
  };
}

/**
 * Elapsed focus for a session, right now.
 *
 * Anchored to the wall clock, not accumulated from ticks. A `setInterval`
 * stops firing when a tab is backgrounded and drifts even when it is not, so a
 * tick-counted timer under-reports exactly when the person has actually gone
 * away to do the work — which is the case this product is built for (P15).
 * Reading the clock instead makes the figure correct whether anyone watched or
 * not, which is also what makes it honest data (R7).
 */
export function elapsedSeconds(session, now = Date.now()) {
  const banked = session?.accumulatedSec || 0;
  if (session?.state !== STATES.RUNNING || !session?.runStartedAt) return banked;
  const live = Math.max(0, Math.floor((now - new Date(session.runStartedAt).getTime()) / 1000));
  return banked + live;
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
 * R6 — the timer is the enforcement mechanism, not a feature. Ivy Lee's #2 will
 * not start until #1 is closed. Order is the whole method; without this it is a
 * numbered list, which is what every other app already ships.
 */
export function isItemLocked(framework, items, index) {
  if (framework !== 'ivy_lee') return false;
  return items.slice(0, index).some(item => !item.completed);
}

export function startSession(session) {
  const now = new Date().toISOString();
  return {
    ...session,
    state: STATES.BREATHING,
    startedAt: session.startedAt || now,
    lastTickAt: now
  };
}

export function beginRunning(session) {
  const now = new Date().toISOString();
  return { ...session, state: STATES.RUNNING, runStartedAt: now, lastTickAt: now };
}

/** Banks the current run's time, so a pause never loses or double-counts it. */
export function pauseSession(session, now = Date.now()) {
  const banked = elapsedSeconds(session, now);
  return {
    ...session,
    state: STATES.PAUSED,
    accumulatedSec: banked,
    actualFocusSec: banked,
    runStartedAt: null,
    lastTickAt: new Date(now).toISOString()
  };
}

/**
 * Recomputes the stored figures from the wall clock. Called on each display
 * tick so what is persisted matches what is shown; the clock is the source of
 * truth and this only writes it down.
 */
export function syncSession(session, now = Date.now()) {
  const elapsed = elapsedSeconds(session, now);
  return {
    ...session,
    actualFocusSec: elapsed,
    overtimeSec: 0,
    reachedEnd: false,
    lastTickAt: new Date(now).toISOString()
  };
}

export function completeSession(session, now = Date.now()) {
  const banked = elapsedSeconds(session, now);
  return {
    ...session,
    state: STATES.DONE,
    accumulatedSec: banked,
    actualFocusSec: banked,
    runStartedAt: null,
    lastTickAt: new Date(now).toISOString()
  };
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
  // The wall clock would happily report five hours on a ninety-minute box.
  // Bank only the time up to the last sign of life, and mark it inferred so a
  // guessed figure is never presented as a measured one (R17).
  const trusted = Math.max(
    0,
    Math.floor((new Date(session.lastTickAt).getTime() - new Date(session.runStartedAt || session.lastTickAt).getTime()) / 1000)
  );
  const banked = (session.accumulatedSec || 0) + trusted;
  return {
    ...session,
    state: STATES.PAUSED,
    accumulatedSec: banked,
    actualFocusSec: banked,
    runStartedAt: null,
    timingAccuracy: 'inferred'
  };
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
