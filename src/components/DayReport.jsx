import React, { useEffect, useState } from 'react';
import { Check, Pause, Play, Plus } from 'lucide-react';
import AnalogueClock from './AnalogueClock';
import {
  STATES, getSession, formatDuration, getFrameworkItems,
  elapsedSeconds, remainingSeconds, isOvertime
} from '../utils/executionModel';

/**
 * The verso — where the time went (P11).
 *
 * The approved desktop spread places this below the execution clock. Phones
 * turn to this same report when the person wants to review the day.
 *
 * R3 holds absolutely here: a verso cannot introduce objects of its own. Every
 * line is a line the recto already decided.
 */
export default function DayReport({
  dailyLog,
  reportOnly = false,
  dateLabel = '',
  onCloseDay,
  onPause,
  onResume,
  onComplete,
  onExtend,
  isInteractive = true
}) {
  const items = getFrameworkItems(dailyLog);

  // Redraw once a second so the hands sweep. The figures come from the wall
  // clock; this only makes the face move.
  const [, setBeat] = useState(0);
  const running = items
    .map(item => ({ item, session: getSession(dailyLog, item.id) }))
    .find(x => x.session.state === STATES.RUNNING || x.session.state === STATES.BREATHING);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setBeat(b => b + 1), 1000);
    return () => clearInterval(id);
  }, [running?.item?.id]);

  /**
   * While something is running, this side is the focus stage: one task, one
   * clock, nothing else. It is not here to hold anyone's attention — P15 says
   * the success case is the person leaving to do the work — but if the window
   * is open, what it shows should be the one thing that matters.
   */
  if (running && !reportOnly) {
    const { item, session } = running;
    const breathing = session.state === STATES.BREATHING;
    const over = isOvertime(session);
    return (
      <div className="w-full min-w-0 flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6 py-8 select-none">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
          {breathing ? 'Getting ready' : over ? 'Past the box' : 'Running'}
        </p>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 max-w-[260px] mb-4 leading-[20px]">
          {item.text}
        </p>

        <AnalogueClock session={session} size={168} showReadout />

        <p className="mt-3 text-[11px] text-neutral-500 dark:text-neutral-400">
          {breathing
            ? 'Starting in a moment.'
            : `${formatDuration(elapsedSeconds(session))} of ${formatDuration(session.plannedDurationSec)}`}
        </p>

        {!breathing && (
          <div className="mt-4 flex items-center gap-2">
            <button type="button" disabled={!isInteractive} onClick={() => onPause?.(item.id)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer">
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
            <button type="button" disabled={!isInteractive} onClick={() => onComplete?.(item.id)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer">
              <Check className="w-3.5 h-3.5" /> Done
            </button>
            {over && (
              <button type="button" disabled={!isInteractive} onClick={() => onExtend?.(item.id, 15 * 60)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> 15 more
              </button>
            )}
          </div>
        )}

        {over && (
          <p className="mt-3 text-[11px] text-neutral-500 max-w-[240px] leading-[18px]">
            The box is spent. Nothing happens automatically — carry on, or give it more time.
          </p>
        )}
      </div>
    );
  }

  const sessions = items.map(item => ({ item, session: getSession(dailyLog, item.id) }));

  const planned = sessions.reduce((s, x) => s + (x.session.plannedDurationSec || 0), 0);
  const actual = sessions.reduce((s, x) => s + (x.session.actualFocusSec || 0), 0);
  const done = items.filter(i => i.completed).length;
  const anyInferred = sessions.some(x => x.session.timingAccuracy === 'inferred');

  if (items.length === 0) {
    return (
      <div className="w-full min-w-0 flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6 py-8 select-none">
        {!reportOnly && <AnalogueClock size={96} />}
        <p className="mt-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Nothing decided yet.</p>
        <p className="mt-1 text-[11px] leading-[18px] text-neutral-500 max-w-[220px]">
          {reportOnly ? 'This page records how the day went.' : 'Turn back and write what deserves today. This side records how it went.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="h-[24px] leading-[24px] shrink-0 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] text-[11px] uppercase tracking-wider">
        <span className="font-bold text-neutral-900 dark:text-neutral-100">Where the time went</span>
        <span className="text-neutral-500 dark:text-neutral-400 normal-case tracking-normal">{dateLabel}</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {sessions.map(({ item, session }) => {
          const p = session.plannedDurationSec || 0;
          const a = session.actualFocusSec || 0;
          const delta = p > 0 ? a - p : 0;
          return (
            <div key={item.id} className="py-3 border-b border-black/[0.05] dark:border-white/[0.07] flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] leading-[20px] font-medium truncate ${item.completed ? 'text-neutral-400 line-through' : 'text-neutral-900 dark:text-neutral-100'}`}>
                  {item.text}
                </p>
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {p === 0
                    ? 'No time was set'
                    : `${formatDuration(a)} spent · ${formatDuration(p)} planned`}
                  {p > 0 && delta !== 0 && (
                    <span className="text-neutral-400">
                      {' '}· {delta > 0 ? `${formatDuration(delta)} over` : `${formatDuration(-delta)} under`}
                    </span>
                  )}
                  {session.timingAccuracy === 'inferred' && <span className="italic"> · estimated</span>}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {dailyLog.closedAt && <p className="text-[13px] py-2">Day closed</p>}
      <div className="shrink-0 border-t border-black/[0.08] dark:border-white/[0.08] pt-2">
        <p className="text-[11px] leading-[18px] text-neutral-600 dark:text-neutral-300">
          {done} of {items.length} finished.{' '}
          {planned > 0 ? `${formatDuration(actual)} against ${formatDuration(planned)} planned.` : 'No time was set today.'}
        </p>
        {anyInferred && (
          <p className="mt-0.5 text-[11px] text-neutral-500 italic">
            Some figures are estimated — a session was left running rather than measured.
          </p>
        )}
        {onCloseDay && !dailyLog.closedAt && !running && (
          <button
            type="button"
            disabled={!isInteractive}
            onClick={onCloseDay}
            className="mt-2 mb-1 w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider py-2 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-200 hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> {reportOnly ? 'Turn Over' : 'The day is done'}
          </button>
        )}
      </div>
    </div>
  );
}
