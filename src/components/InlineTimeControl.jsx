import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { playSound } from '../utils/audio';
import {
  STATES,
  BREATHING_SECONDS,
  getSession,
  emptySession,
  startSession,
  beginRunning,
  pauseSession
} from '../utils/executionModel';

/**
 * Time belongs to the priority it constrains. This compact control therefore
 * lives in the task row instead of repeating the task in a second section.
 */
export default function InlineTimeControl({
  item,
  dailyLog,
  onUpdateExecution,
  isMuted = false,
  isInteractive = true,
  locked = false
}) {
  const itemId = item?.id;
  const session = getSession(dailyLog, itemId);
  const plannedMinutes = session.plannedDurationSec
    ? Math.round(session.plannedDurationSec / 60)
    : '';
  const [draft, setDraft] = useState(plannedMinutes === '' ? '' : String(plannedMinutes));
  const hasTask = Boolean(item?.text?.trim());
  const running = session.state === STATES.RUNNING;
  const breathing = session.state === STATES.BREATHING;
  const done = item?.completed || session.state === STATES.DONE;

  useEffect(() => {
    setDraft(plannedMinutes === '' ? '' : String(plannedMinutes));
  }, [plannedMinutes]);

  useEffect(() => {
    if (!breathing || !itemId) return undefined;
    const id = window.setTimeout(() => {
      onUpdateExecution?.(itemId, beginRunning(getSession(dailyLog, itemId)));
    }, BREATHING_SECONDS * 1000);
    return () => window.clearTimeout(id);
    // A breathing state is deliberately a single three-second transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathing, itemId]);

  const commitDuration = () => {
    if (!itemId || !hasTask) return;
    const parsed = Number(draft);
    const minutes = draft === '' || !Number.isFinite(parsed)
      ? 0
      : Math.min(720, Math.max(1, Math.round(parsed)));
    setDraft(minutes ? String(minutes) : '');
    if (minutes === plannedMinutes) return;
    playSound('click', isMuted);
    onUpdateExecution?.(itemId, {
      ...emptySession(minutes * 60),
      ...session,
      plannedDurationSec: minutes * 60
    });
  };

  const handleStart = () => {
    if (!itemId || !hasTask || !session.plannedDurationSec) return;
    playSound('check', isMuted);
    onUpdateExecution?.(itemId, startSession(session));
  };

  const handlePause = () => {
    playSound('click', isMuted);
    onUpdateExecution?.(itemId, pauseSession(session));
  };

  const inputDisabled = !isInteractive || !hasTask || locked || done || running || breathing;
  const actionDisabled = !isInteractive || locked || done;
  const taskLabel = item?.text?.trim() || 'this priority';

  return (
    <div className="inline-time-control inline-flex shrink-0 items-center gap-1.5">
      <label
        className={`inline-flex h-7 items-center rounded-md border px-1.5 transition-colors ${
          inputDisabled
            ? 'border-black/[0.06] dark:border-white/[0.08] text-neutral-500 dark:text-neutral-500'
            : 'border-black/[0.12] dark:border-white/[0.14] text-neutral-700 dark:text-neutral-300 focus-within:border-black/35 dark:focus-within:border-white/35'
        }`}
        title={hasTask ? `Planned minutes for ${taskLabel}` : 'Write the priority before setting its time'}
      >
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max="720"
          step="5"
          value={draft}
          disabled={inputDisabled}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDuration}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') {
              setDraft(plannedMinutes === '' ? '' : String(plannedMinutes));
              event.currentTarget.blur();
            }
          }}
          placeholder="—"
          aria-label={`Minutes planned for ${taskLabel}`}
          className="w-8 bg-transparent text-right text-[11px] font-semibold tabular-nums outline-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600 disabled:cursor-default"
        />
        <span className="ml-0.5 text-[11px] uppercase tracking-[0.08em]">min</span>
      </label>

      {session.plannedDurationSec > 0 && !done && (
        breathing ? (
          <span className="w-7 text-center text-[11px] text-neutral-500" aria-live="polite">Ready</span>
        ) : (
          <button
            type="button"
            disabled={actionDisabled}
            onClick={running ? handlePause : handleStart}
            aria-label={`${running ? 'Pause' : 'Start'} ${taskLabel}`}
            title={running ? 'Pause' : 'Start'}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.1] dark:border-white/[0.12] text-neutral-700 dark:text-neutral-300 hover:border-black/30 hover:text-black dark:hover:border-white/35 dark:hover:text-white disabled:cursor-default disabled:opacity-40 transition-colors"
          >
            {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 translate-x-px" />}
          </button>
        )
      )}
    </div>
  );
}
