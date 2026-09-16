import React, { useEffect, useMemo, useState } from 'react';
import FocusStopwatch, { formatStopwatch } from './FocusStopwatch';
import { playSound } from '../utils/audio';
import {
  STATES,
  BREATHING_SECONDS,
  getSession,
  syncSession,
  reconcileOnReturn,
  getFrameworkItems,
  elapsedSeconds,
  beginRunning
} from '../utils/executionModel';

/** One elapsed-time instrument for the currently selected priority. */
export default function ExecutionLayer({ dailyLog, onUpdateExecution, isMuted = false, isInteractive = true }) {
  const items = useMemo(() => getFrameworkItems(dailyLog), [dailyLog]);
  const activeItem = items.find(item => {
    const state = getSession(dailyLog, item.id).state;
    return state === STATES.RUNNING || state === STATES.BREATHING;
  });
  const stopwatchItem = activeItem || items.find(item => getSession(dailyLog, item.id).state === STATES.PAUSED);
  const activeSession = stopwatchItem ? getSession(dailyLog, stopwatchItem.id) : null;
  const [askingAbout, setAskingAbout] = useState([]);
  const [, setBeat] = useState(0);

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
      setBeat(beat => beat + 1);
      onUpdateExecution?.(activeItem.id, syncSession(getSession(dailyLog, activeItem.id)));
    };
    const id = window.setInterval(write, 1000);
    document.addEventListener('visibilitychange', write);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', write);
    };
  }, [activeItem?.id, activeSession?.state, dailyLog, onUpdateExecution]);

  // This transition belongs to the session, so paging its row away cannot cancel it.
  useEffect(() => {
    if (!activeItem || activeSession?.state !== STATES.BREATHING) return undefined;
    const id = window.setTimeout(() => {
      onUpdateExecution?.(activeItem.id, beginRunning(getSession(dailyLog, activeItem.id)));
    }, BREATHING_SECONDS * 1000);
    return () => window.clearTimeout(id);
    // Deliberately keep one timer through ordinary row edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem?.id, activeSession?.state]);

  const answerStillOn = (item, stillOn) => {
    const session = getSession(dailyLog, item.id);
    playSound('click', isMuted);
    if (stillOn) onUpdateExecution?.(item.id, beginRunning(session));
    setAskingAbout(previous => previous.filter(id => id !== item.id));
  };

  // The stopwatch is an instrument attached to real work, not an empty-state
  // card. Until somebody starts or pauses a priority, the framework owns the
  // whole page.
  if (!stopwatchItem && askingAbout.length === 0) return null;

  return (
    <section className={`execution-panel ${askingAbout.length ? 'execution-needs-answer' : ''}`} aria-labelledby="focus-time-heading">
      <header className="execution-panel-header">
        <h2 id="focus-time-heading" className="type-label">Focus Time</h2>
        {activeSession && <span className="execution-header-elapsed type-metadata">{formatStopwatch(elapsedSeconds(activeSession))} elapsed</span>}
      </header>

      {askingAbout.length > 0 && <div className="execution-return-questions">
        {askingAbout.map(id => {
          const item = items.find(candidate => candidate.id === id);
          if (!item) return null;
          const session = getSession(dailyLog, id);
          return <div key={id} className="execution-return-question">
            <div>
              <p className="type-control">Still Working On “{item.text}”?</p>
              <p className="type-metadata">{formatStopwatch(session.actualFocusSec || 0)} is estimated.</p>
            </div>
            <div>
              <button type="button" disabled={!isInteractive} onClick={() => answerStillOn(item, true)} className="type-control">Resume</button>
              <button type="button" disabled={!isInteractive} onClick={() => answerStillOn(item, false)} className="type-control">Leave Paused</button>
            </div>
          </div>;
        })}
      </div>}

      <div className="execution-clock">
        <FocusStopwatch session={activeSession} size={88} />
        <div className="execution-clock-copy">
          {stopwatchItem && <>
            <p className="type-control">
              {activeSession.state === STATES.BREATHING ? 'Getting Ready' : activeSession.state === STATES.PAUSED ? 'Paused' : 'Focusing On'}
            </p>
            <p className="type-body execution-task-name">{stopwatchItem.text}</p>
          </>}
        </div>
      </div>
    </section>
  );
}
