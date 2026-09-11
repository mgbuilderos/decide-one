/**
 * Carrying yesterday's open priorities into today.
 *
 * A priority that did not get done is not a failure and is not a debt. It is
 * simply still true, and the person should not have to retype it to say so.
 * The symbol set already carries the idea (POCKET_SYMBOLS, `moved`, →).
 *
 * VISION §11.3's fourth rule governs everything here: the product never infers
 * failure from a date. So this offers, it does not remind; it names what is
 * open, never how many days were missed; and declining is a complete answer
 * that is not asked again for that day.
 */

const DISMISS_PREFIX = 'decideone_carry_offered_';

/** Slots that can still hold something today. */
function freeSlotCount(todayLog) {
  const tasks = todayLog?.hardTasks || [];
  return tasks.filter((t) => !t?.text || !t.text.trim()).length;
}

/**
 * The most recent earlier day that still has open priorities.
 *
 * Deliberately the most recent day *with a log*, not literally yesterday: if
 * someone was away for a week, the last day they actually used is the one that
 * holds their unfinished intent. Days they never opened have nothing to carry.
 */
export function findCarryForward(dailyLogs, todayKey) {
  if (!dailyLogs || !todayKey) return null;

  const earlier = Object.keys(dailyLogs)
    .filter((k) => k < todayKey)
    .sort()
    .reverse();

  for (const dateKey of earlier) {
    const log = dailyLogs[dateKey];
    const open = (log?.hardTasks || []).filter(
      (t) => t?.text && t.text.trim() && !t.completed && t.status !== 'moved'
    );
    if (open.length > 0) {
      return { fromDateKey: dateKey, tasks: open };
    }
    // A day that was fully closed ends the search. Reaching further back would
    // start presenting a history of absences, which is the thing §11.3 forbids.
    if ((log?.hardTasks || []).some((t) => t?.text && t.text.trim())) return null;
  }
  return null;
}

/** Whether to offer at all — and it is an offer, so it asks once. */
export function shouldOfferCarryForward(dailyLogs, todayKey) {
  if (hasBeenOffered(todayKey)) return null;
  const todayLog = dailyLogs?.[todayKey];
  // Someone already writing today does not want an interruption about yesterday.
  const todayHasContent = (todayLog?.hardTasks || []).some((t) => t?.text && t.text.trim());
  if (todayHasContent) return null;
  if (freeSlotCount(todayLog || { hardTasks: [{}, {}, {}] }) === 0) return null;
  return findCarryForward(dailyLogs, todayKey);
}

export function hasBeenOffered(todayKey) {
  try {
    return localStorage.getItem(DISMISS_PREFIX + todayKey) === '1';
  } catch {
    return false;
  }
}

export function markOffered(todayKey) {
  try {
    localStorage.setItem(DISMISS_PREFIX + todayKey, '1');
  } catch {
    // Storage unavailable. Offering twice is a smaller harm than crashing.
  }
}

/**
 * Place chosen priorities into today's free slots, and mark the originals as
 * moved so they read as forwarded rather than left behind.
 */
export function applyCarryForward(todayLog, sourceLog, chosenIds) {
  const chosen = (sourceLog?.hardTasks || []).filter((t) => chosenIds.includes(t.id));
  const todayTasks = [...(todayLog?.hardTasks || [])];

  let placed = 0;
  for (const task of chosen) {
    const slot = todayTasks.findIndex((t) => !t?.text || !t.text.trim());
    if (slot === -1) break;
    todayTasks[slot] = {
      ...todayTasks[slot],
      text: task.text,
      category: task.category || todayTasks[slot]?.category || 'personal',
      completed: false
    };
    placed += 1;
  }

  const movedIds = chosen.slice(0, placed).map((t) => t.id);
  const sourceTasks = (sourceLog?.hardTasks || []).map((t) =>
    movedIds.includes(t.id) ? { ...t, status: 'moved' } : t
  );

  return { todayTasks, sourceTasks, placed };
}

/** "Wednesday" within the last week, otherwise a plain date. */
export function describeDay(dateKey, todayKey) {
  const from = new Date(dateKey + 'T00:00:00');
  const today = new Date(todayKey + 'T00:00:00');
  if (Number.isNaN(from.getTime())) return dateKey;

  const days = Math.round((today - from) / 86400000);
  if (days === 1) return 'yesterday';
  if (days > 1 && days < 7) {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(from);
  }
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(from);
}
