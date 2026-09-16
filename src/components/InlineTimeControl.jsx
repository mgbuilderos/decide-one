import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { playSound } from '../utils/audio';
import { formatStopwatch } from './FocusStopwatch';
import {
  STATES,
  getSession,
  startSession,
  pauseSession,
  elapsedSeconds
} from '../utils/executionModel';

/**
 * Elapsed focus belongs to the priority that received it. The stopwatch lives
 * on that row and starts without asking the person to predict a duration.
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
  const [beat, setBeat] = useState(() => Date.now());
  const hasTask = Boolean(item?.text?.trim());
  const running = session.state === STATES.RUNNING;
  const breathing = session.state === STATES.BREATHING;
  const done = item?.completed || session.state === STATES.DONE;

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => setBeat(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const handleStart = () => {
    if (!itemId || !hasTask) return;
    playSound('check', isMuted);
    onUpdateExecution?.(itemId, startSession({
      ...session,
      plannedDurationSec: 0,
      overtimeSec: 0,
      reachedEnd: false
    }));
  };

  const handlePause = () => {
    playSound('click', isMuted);
    onUpdateExecution?.(itemId, pauseSession(session));
  };

  const actionDisabled = !isInteractive || !hasTask || locked || done;
  const taskLabel = item?.text?.trim() || 'this priority';
  const elapsed = elapsedSeconds(session, beat);

  return (
    <div className={`inline-time-control ${hasTask ? '' : 'inline-time-control-empty'}`}>
      {hasTask && <span className="inline-stopwatch-readout type-metadata" aria-label={`${formatStopwatch(elapsed)} elapsed`}>
        {formatStopwatch(elapsed)}
      </span>}
      {hasTask && !done && (
        breathing ? <span className="type-metadata" aria-live="polite">Ready</span> : (
          <button
            type="button"
            disabled={actionDisabled}
            onClick={running ? handlePause : handleStart}
            aria-label={`${running ? 'Pause focus timer for' : 'Start focus timer for'} ${taskLabel}`}
            title={running ? 'Pause Focus Timer' : 'Start Focus Timer'}
          >
            {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 translate-x-px" />}
          </button>
        )
      )}
    </div>
  );
}
