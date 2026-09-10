import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Check, Lock, Plus } from 'lucide-react';
import AnalogueClock from './AnalogueClock';
import { playSound } from '../utils/audio';
import {
  STATES, BREATHING_SECONDS, DURATION_CHOICES,
  getSession, emptySession, formatDuration, computeCapacity,
  isItemLocked, startSession, beginRunning, pauseSession, syncSession,
  extendSession, completeSession, reconcileOnReturn, getFrameworkItems,
  elapsedSeconds
} from '../utils/executionModel';

/**
 * The right page — the execution layer (R2).
 *
 * Left page: what deserves the day. Right page: how long, and how it went.
 *
 * R3 is the rule that keeps it honest: this page may never introduce objects of
 * its own. Every line here is a line from the left page. Habits and reflection
 * failed precisely because they were separate things sharing a spread.
 */
export default function ExecutionLayer({
  dailyLog,
  onUpdateExecution,
  isMuted = false,
  isInteractive = true
}) {
  const framework = dailyLog?.activeFramework || 'rule_of_3';
  const items = useMemo(() => getFrameworkItems(dailyLog), [dailyLog]);
  const [breathingFor, setBreathingFor] = useState(null);
  const breathTimer = useRef(null);

  const sessions = items.map(item => getSession(dailyLog, item.id));
  const capacity = computeCapacity(sessions);
  const runningItem = items.find(item => getSession(dailyLog, item.id).state === STATES.RUNNING);

  /**
   * R17 — a session left running across a closed laptop is suspended on return
   * and its figure marked inferred. Honest data beats clean data.
   *
   * P-3 is the other half: the instrument then *asks*. Silently banking a
   * guessed number and moving on would be the dishonest version — the person
   * is the only one who knows whether they were still working, so the question
   * goes to them, once, and either answer is fine.
   */
  const [askingAbout, setAskingAbout] = useState([]);

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

  const answerStillOn = (item, stillOn) => {
    const session = getSession(dailyLog, item.id);
    playSound('click', isMuted);
    if (stillOn) {
      // Resume from now. The gap stays inferred — resuming does not retroactively
      // turn a guessed stretch into a measured one.
      onUpdateExecution?.(item.id, beginRunning(session));
    }
    setAskingAbout(prev => prev.filter(id => id !== item.id));
  };

  /**
   * A display tick, not a counter.
   *
   * The elapsed figure is read from the wall clock, so this interval only
   * writes down what is already true. If the tab is backgrounded and the
   * interval stops firing, nothing is lost — which matters, because the app is
   * built to be closed while the work happens (P15).
   */
  useEffect(() => {
    if (!runningItem) return;
    const write = () => onUpdateExecution?.(runningItem.id, syncSession(getSession(dailyLog, runningItem.id)));
    const id = setInterval(write, 1000);
    document.addEventListener('visibilitychange', write);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', write);
    };
  }, [runningItem?.id, dailyLog, onUpdateExecution]);

  // R9 — BREATHING: a deliberate pause between pressing start and the clock running.
  useEffect(() => {
    if (!breathingFor) return;
    breathTimer.current = setTimeout(() => {
      onUpdateExecution?.(breathingFor, beginRunning(getSession(dailyLog, breathingFor)));
      setBreathingFor(null);
    }, BREATHING_SECONDS * 1000);
    return () => clearTimeout(breathTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathingFor]);

  const setDuration = (item, sec) => {
    const session = getSession(dailyLog, item.id);
    playSound('click', isMuted);
    onUpdateExecution?.(item.id, { ...emptySession(sec), ...session, plannedDurationSec: sec });
  };

  const handleStart = (item) => {
    playSound('check', isMuted);
    onUpdateExecution?.(item.id, startSession(getSession(dailyLog, item.id)));
    setBreathingFor(item.id);
  };

  const handlePause = (item) => {
    playSound('click', isMuted);
    onUpdateExecution?.(item.id, pauseSession(getSession(dailyLog, item.id)));
  };

  const handleComplete = (item) => {
    playSound('check', isMuted);
    onUpdateExecution?.(item.id, completeSession(getSession(dailyLog, item.id)));
  };

  const handleExtend = (item, sec) => {
    playSound('click', isMuted);
    onUpdateExecution?.(item.id, extendSession(getSession(dailyLog, item.id), sec));
  };

  // R3 in practice: nothing to execute until the left page says what matters.
  if (items.length === 0) {
    return (
      <div className="w-full min-w-0 flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6 select-none">
        <AnalogueClock size={96} />
        <p className="mt-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Nothing decided yet.
        </p>
        <p className="mt-1 text-[11px] leading-[18px] text-neutral-400 max-w-[220px]">
          Write what deserves today on the left. Time attaches to it here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 flex-1 min-h-0 flex flex-col overflow-hidden">

      {/* Capacity — the clock's real job, done before it ever runs (P14). */}
      <div className="h-[24px] leading-[24px] shrink-0 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] text-[10px] uppercase tracking-wider">
        <span className="font-bold text-neutral-900 dark:text-neutral-100">Time</span>
        <span className="text-neutral-500 dark:text-neutral-400 normal-case tracking-normal">
          {capacity.plannedSec > 0
            ? `${formatDuration(capacity.plannedSec)} planned · ${formatDuration(capacity.remainingSec)} until ${capacity.endHour}:00`
            : 'No time set yet'}
        </span>
      </div>

      {capacity.overcommitted && (
        <p className="shrink-0 text-[11px] leading-[24px] text-neutral-700 dark:text-neutral-300 border-b border-black/[0.08] dark:border-white/[0.08]">
          That is <span className="font-semibold">{formatDuration(capacity.overBySec)}</span> more than the day has left. Something moves to tomorrow.
        </p>
      )}
      {capacity.noSlack && (
        <p className="shrink-0 text-[11px] leading-[24px] text-neutral-500 dark:text-neutral-400 border-b border-black/[0.08] dark:border-white/[0.08]">
          That fills the day back-to-back, with no gap for anything else.
        </p>
      )}

      {askingAbout.length > 0 && (
        <div className="shrink-0 border-b border-black/[0.08] dark:border-white/[0.08] py-2 space-y-2">
          {askingAbout.map(id => {
            const item = items.find(i => i.id === id);
            if (!item) return null;
            const session = getSession(dailyLog, id);
            return (
              <div key={id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                    Still on “{item.text}”?
                  </p>
                  <p className="text-[10px] text-neutral-400 leading-[16px]">
                    It was left running, so {formatDuration(session.actualFocusSec || 0)} is an estimate rather than a measurement.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button type="button" onClick={() => answerStillOn(item, true)}
                    className="text-[10px] font-semibold px-2 py-1 rounded bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer">
                    Still on it
                  </button>
                  <button type="button" onClick={() => answerStillOn(item, false)}
                    className="text-[10px] font-semibold px-2 py-1 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                    I stopped
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.map((item, index) => {
          const session = getSession(dailyLog, item.id);
          const locked = isItemLocked(framework, items, index);
          const isBreathing = breathingFor === item.id;
          const isRunning = session.state === STATES.RUNNING;
          const isDone = item.completed || session.state === STATES.DONE;
          const elapsed = elapsedSeconds(session);
          const planned = session.plannedDurationSec || 0;
          const over = session.overtimeSec || 0;

          return (
            <div
              key={item.id}
              className={`py-3 border-b border-black/[0.05] dark:border-white/[0.07] ${locked ? 'opacity-40' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-[20px] font-medium truncate ${isDone ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                    {locked && <Lock className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                    {item.text}
                  </p>

                  {/* R4 — a duration per line. Setting it is the capacity check. */}
                  {planned === 0 && !locked && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-neutral-400 mr-1">How long?</span>
                      {DURATION_CHOICES.map(mins => (
                        <button
                          key={mins}
                          type="button"
                          disabled={!isInteractive}
                          onClick={() => setDuration(item, mins * 60)}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer"
                        >
                          {mins}m
                        </button>
                      ))}
                    </div>
                  )}

                  {planned > 0 && (
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span>{formatDuration(planned)} planned</span>
                      {elapsed > 0 && <span>· {formatDuration(elapsed)} actual</span>}
                      {over > 0 && <span>· {formatDuration(over)} over</span>}
                      {session.timingAccuracy === 'inferred' && (
                        <span className="italic" title="This session was left running; the figure is estimated, not measured.">
                          · estimated
                        </span>
                      )}
                    </div>
                  )}

                  {/* R8 — overrun is never punitive. More time is information. */}
                  {over > 0 && !isDone && (
                    <button
                      type="button"
                      onClick={() => handleExtend(item, 15 * 60)}
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Need more time
                    </button>
                  )}
                </div>

                {planned > 0 && (
                  <div className="shrink-0 flex items-center gap-2">
                    <AnalogueClock
                      session={isBreathing ? { ...session, state: STATES.BREATHING } : session}
                      size={40}
                    />
                    {!isDone && !locked && (
                      isBreathing ? (
                        <span className="text-[10px] text-neutral-400 w-12">Ready…</span>
                      ) : isRunning ? (
                        <button type="button" onClick={() => handlePause(item)} title="Pause"
                          className="p-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 cursor-pointer">
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button type="button" onClick={() => handleStart(item)} title="Start"
                          className="p-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 cursor-pointer">
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                    {!isDone && !locked && elapsed > 0 && (
                      <button type="button" onClick={() => handleComplete(item)} title="Done"
                        className="p-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 cursor-pointer">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {locked && (
                <p className="mt-1 text-[10px] text-neutral-400 italic">
                  Finish the one above first. That is the method.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
