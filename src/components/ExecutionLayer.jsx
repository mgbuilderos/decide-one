import React, { useEffect, useMemo, useState } from 'react';
import AnalogueClock from './AnalogueClock';
import { playSound } from '../utils/audio';
import {
  STATES,
  getSession,
  formatDuration,
  computeCapacity,
  syncSession,
  reconcileOnReturn,
  getFrameworkItems,
  elapsedSeconds,
  isOvertime,
  beginRunning
} from '../utils/executionModel';

// The instrument holds the whole day on one surface at every height. A
// 1366x768 laptop gives roughly 660px of viewport once browser chrome is
// taken, so short is the common case, not the edge one. Three densities:
// full, compact and tight. Compact faces retain the hands; tight layouts
// omit the duplicate digital readout so controls keep their space.
function useDensity() {
  const read = () => typeof window === 'undefined' ? 'full'
    : window.matchMedia('(max-height: 760px)').matches ? 'tight'
    : window.matchMedia('(max-height: 820px)').matches ? 'compact' : 'full';
  const [density, setDensity] = useState(read);
  useEffect(() => {
    const queries = ['(max-height: 760px)', '(max-height: 820px)'].map(q => window.matchMedia(q));
    const on = () => setDensity(read());
    queries.forEach(q => q.addEventListener('change', on));
    on();
    return () => queries.forEach(q => q.removeEventListener('change', on));
  }, []);
  return density;
}

/**
 * A single clock for the day. Durations and start controls live beside the
 * priorities themselves; this layer shows capacity and the one active task.
 */
export default function ExecutionLayer({
  dailyLog,
  onUpdateExecution,
  isMuted = false,
  isInteractive = true
}) {
  const density = useDensity();
  const items = useMemo(() => getFrameworkItems(dailyLog), [dailyLog]);
  const sessions = items.map(item => getSession(dailyLog, item.id));
  const capacity = computeCapacity(sessions);
  const activeItem = items.find(item => {
    const state = getSession(dailyLog, item.id).state;
    return state === STATES.RUNNING || state === STATES.BREATHING;
  });
  const clockItem = activeItem || items.find(item => getSession(dailyLog, item.id).state === STATES.PAUSED);
  const activeSession = clockItem ? getSession(dailyLog, clockItem.id) : null;
  const [askingAbout, setAskingAbout] = useState([]);

  // A task left running while the app was closed is suspended and identified
  // as an estimate. The user then decides whether to resume from the present.
  useEffect(() => {
    const reconciledIds = [];
    items.forEach(item => {
      const session = getSession(dailyLog, item.id);
      const reconciled = reconcileOnReturn(session);
      if (reconciled !== session) {
        onUpdateExecution?.(item.id, reconciled);
        reconciledIds.push(item.id);
      }
    });
    if (reconciledIds.length) setAskingAbout(reconciledIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeItem || activeSession?.state !== STATES.RUNNING) return undefined;
    const write = () => {
      onUpdateExecution?.(
        activeItem.id,
        syncSession(getSession(dailyLog, activeItem.id))
      );
    };
    const id = window.setInterval(write, 1000);
    document.addEventListener('visibilitychange', write);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', write);
    };
  }, [activeItem?.id, activeSession?.state, dailyLog, onUpdateExecution]);

  const answerStillOn = (item, stillOn) => {
    const session = getSession(dailyLog, item.id);
    playSound('click', isMuted);
    if (stillOn) onUpdateExecution?.(item.id, beginRunning(session));
    setAskingAbout(previous => previous.filter(id => id !== item.id));
  };

  if (items.length === 0 || capacity.plannedSec === 0) {
    return (
      <div className="execution-empty w-full min-w-0 min-h-[168px] [@media(max-height:820px)_and_(min-height:761px)]:min-h-[120px] [@media(max-height:760px)]:min-h-0 flex flex-col items-center justify-center px-6 py-5 [@media(max-height:820px)_and_(min-height:761px)]:py-1 [@media(max-height:760px)]:py-1 text-center select-none">
        <AnalogueClock size={density === 'full' ? 88 : 48} />
        <p className="mt-3 [@media(max-height:760px)]:mt-1 text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
          Set time beside a priority.
        </p>
        <p className="mt-1 max-w-[360px] text-[11px] leading-[16px] text-neutral-500 [@media(max-height:660px)]:hidden">
          Write first. Set minutes beside the line.
        </p>
      </div>
    );
  }

  return (
    <div className="execution-panel w-full min-w-0 min-h-[180px] [@media(max-height:820px)_and_(min-height:761px)]:min-h-[140px] [@media(max-height:760px)]:min-h-0 flex flex-col">
      <div className="h-7 [@media(max-height:760px)]:h-6 shrink-0 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] text-[11px]">
        <span className="font-semibold uppercase tracking-[0.12em] text-neutral-800 dark:text-neutral-200">
          Today’s Time
        </span>
        <span className="text-neutral-500 dark:text-neutral-400 tabular-nums">
          {capacity.plannedSec > 0
            ? `${formatDuration(capacity.plannedSec)} planned · ${formatDuration(capacity.remainingSec)} until ${capacity.endHour}:00`
            : 'Enter minutes beside a priority'}
        </span>
      </div>

      {capacity.overcommitted && (
        <p className="shrink-0 py-1.5 [@media(max-height:760px)]:py-0.5 text-[11px] leading-[16px] text-neutral-600 dark:text-neutral-400 border-b border-black/[0.08] dark:border-white/[0.08]">
          That is <span className="font-semibold">{formatDuration(capacity.overBySec)}</span> more than the day has left. Move something to tomorrow.
        </p>
      )}
      {capacity.noSlack && (
        <p className="shrink-0 py-1.5 [@media(max-height:760px)]:py-0.5 text-[11px] leading-[16px] text-neutral-500 dark:text-neutral-400 border-b border-black/[0.08] dark:border-white/[0.08]">
          That fills the day without room between tasks.
        </p>
      )}

      {askingAbout.length > 0 && (
        <div className="shrink-0 border-b border-black/[0.08] dark:border-white/[0.08] py-2 space-y-2 [@media(max-height:760px)]:py-1 [@media(max-height:760px)]:space-y-1">
          {askingAbout.map(id => {
            const item = items.find(candidate => candidate.id === id);
            if (!item) return null;
            const session = getSession(dailyLog, id);
            return (
              <div key={id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
                    Still on “{item.text}”?
                  </p>
                  <p className="text-[11px] leading-[16px] text-neutral-500">
                    {formatDuration(session.actualFocusSec || 0)} is estimated because the clock was left running.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => answerStillOn(item, true)}
                    className="rounded px-2 py-1 text-[11px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 disabled:opacity-40 transition-colors"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    disabled={!isInteractive}
                    onClick={() => answerStillOn(item, false)}
                    className="rounded px-2 py-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 transition-colors"
                  >
                    Leave Paused
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="execution-clock flex min-h-[132px] flex-1 flex-col items-center justify-center py-2 text-center">
        <AnalogueClock
          session={activeSession}
          plannedSec={activeSession ? 0 : capacity.plannedSec}
          size={density === 'full' ? 88 : 48}
          showReadout={Boolean(activeSession) && density !== 'tight'}
        />

        {clockItem ? (
          <>
            <p className="mt-1.5 max-w-[82%] truncate text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
              {activeSession.state === STATES.BREATHING ? 'Ready for' : activeSession.state === STATES.PAUSED ? 'Paused' : 'Working on'} “{clockItem.text}”
            </p>
            <p className="mt-0.5 text-[11px] text-neutral-500 tabular-nums">
              {formatDuration(elapsedSeconds(activeSession))} used · {formatDuration(activeSession.plannedDurationSec || 0)} planned
            </p>
            {isOvertime(activeSession) && (
              <p className="mt-1 text-[11px] text-neutral-500">The estimate changed. Add time if the task needs it.</p>
            )}
          </>
        ) : (
          <>
            <p className="mt-3 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
              {capacity.plannedSec > 0 ? 'Start from the priority row.' : 'Enter minutes beside a priority.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
