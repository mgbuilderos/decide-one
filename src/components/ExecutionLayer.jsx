import React, { useEffect, useMemo, useState } from 'react';
import { Check, Pause, Plus } from 'lucide-react';
import AnalogueClock from './AnalogueClock';
import { playSound } from '../utils/audio';
import {
  STATES,
  getSession,
  formatDuration,
  computeCapacity,
  syncSession,
  pauseSession,
  completeSession,
  extendSession,
  reconcileOnReturn,
  getFrameworkItems,
  elapsedSeconds,
  isOvertime,
  beginRunning
} from '../utils/executionModel';

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
  const items = useMemo(() => getFrameworkItems(dailyLog), [dailyLog]);
  const sessions = items.map(item => getSession(dailyLog, item.id));
  const capacity = computeCapacity(sessions);
  const activeItem = items.find(item => {
    const state = getSession(dailyLog, item.id).state;
    return state === STATES.RUNNING || state === STATES.BREATHING;
  });
  const activeSession = activeItem ? getSession(dailyLog, activeItem.id) : null;
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

  const handlePause = () => {
    if (!activeItem) return;
    playSound('click', isMuted);
    onUpdateExecution?.(activeItem.id, pauseSession(getSession(dailyLog, activeItem.id)));
  };

  const handleComplete = () => {
    if (!activeItem) return;
    playSound('check', isMuted);
    onUpdateExecution?.(activeItem.id, completeSession(getSession(dailyLog, activeItem.id)));
  };

  const handleExtend = () => {
    if (!activeItem) return;
    playSound('click', isMuted);
    onUpdateExecution?.(activeItem.id, extendSession(getSession(dailyLog, activeItem.id), 15 * 60));
  };

  if (items.length === 0) {
    return (
      <div className="w-full min-w-0 min-h-[168px] flex flex-col items-center justify-center px-6 py-5 text-center select-none">
        <AnalogueClock size={88} />
        <p className="mt-3 text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
          Set time beside a priority.
        </p>
        <p className="mt-1 max-w-[250px] text-[10px] leading-[16px] text-neutral-400">
          Write the task first, then enter the minutes on the same line.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 min-h-[180px] flex flex-col">
      <div className="h-7 shrink-0 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] text-[10px]">
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
        <p className="shrink-0 py-1.5 text-[10px] leading-[16px] text-neutral-600 dark:text-neutral-400 border-b border-black/[0.08] dark:border-white/[0.08]">
          That is <span className="font-semibold">{formatDuration(capacity.overBySec)}</span> more than the day has left. Move something to tomorrow.
        </p>
      )}
      {capacity.noSlack && (
        <p className="shrink-0 py-1.5 text-[10px] leading-[16px] text-neutral-500 dark:text-neutral-400 border-b border-black/[0.08] dark:border-white/[0.08]">
          That fills the day without room between tasks.
        </p>
      )}

      {askingAbout.length > 0 && (
        <div className="shrink-0 border-b border-black/[0.08] dark:border-white/[0.08] py-2 space-y-2">
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
                  <p className="text-[10px] leading-[16px] text-neutral-400">
                    {formatDuration(session.actualFocusSec || 0)} is estimated because the clock was left running.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => answerStillOn(item, true)}
                    className="rounded px-2 py-1 text-[10px] font-semibold bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => answerStillOn(item, false)}
                    className="rounded px-2 py-1 text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Leave Paused
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex min-h-[148px] flex-1 flex-col items-center justify-center py-4 text-center">
        <AnalogueClock
          session={activeSession}
          plannedSec={activeSession ? 0 : capacity.plannedSec}
          size={activeSession ? 112 : 88}
          showReadout={Boolean(activeSession)}
        />

        {activeItem ? (
          <>
            <p className="mt-2 max-w-[82%] truncate text-[12px] font-semibold text-neutral-800 dark:text-neutral-200">
              {activeSession.state === STATES.BREATHING ? 'Ready for' : 'Working on'} “{activeItem.text}”
            </p>
            <p className="mt-0.5 text-[10px] text-neutral-400 tabular-nums">
              {formatDuration(elapsedSeconds(activeSession))} used · {formatDuration(activeSession.plannedDurationSec || 0)} planned
            </p>
            {isOvertime(activeSession) && (
              <p className="mt-1 text-[10px] text-neutral-500">The estimate changed. Add time if the task needs it.</p>
            )}
            {activeSession.state === STATES.RUNNING && isInteractive && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePause}
                  aria-label={`Pause ${activeItem.text}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/[0.1] dark:border-white/[0.12] px-3 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 hover:border-black/30 dark:hover:border-white/35 transition-colors"
                >
                  <Pause className="h-3 w-3" /> Pause
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  aria-label={`Complete ${activeItem.text}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/[0.1] dark:border-white/[0.12] px-3 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 hover:border-black/30 dark:hover:border-white/35 transition-colors"
                >
                  <Check className="h-3 w-3" /> Done
                </button>
                <button
                  type="button"
                  onClick={handleExtend}
                  aria-label={`Add 15 minutes to ${activeItem.text}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/[0.1] dark:border-white/[0.12] px-3 text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 hover:border-black/30 dark:hover:border-white/35 transition-colors"
                >
                  <Plus className="h-3 w-3" /> 15 min
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mt-3 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
              {capacity.plannedSec > 0 ? 'Start from the priority row.' : 'Enter minutes beside a priority.'}
            </p>
            <p className="mt-1 text-[10px] leading-[16px] text-neutral-400">
              One clock appears here when the work begins.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
