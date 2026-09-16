import React, { useEffect, useState } from 'react';
import { Check, Pause } from 'lucide-react';
import CompactPager from './CompactPager';
import usePageSpace from '../hooks/usePageSpace';
import FocusStopwatch, { formatStopwatch } from './FocusStopwatch';
import { STATES, getSession, getFrameworkItems, elapsedSeconds } from '../utils/executionModel';

/** The verso records only the priorities selected by the active framework. */
export default function DayReport({
  dailyLog,
  reportOnly = false,
  dateLabel = '',
  onCloseDay,
  onPause,
  onComplete,
  isInteractive = true
}) {
  const items = getFrameworkItems(dailyLog);
  const [reportSpaceRef, reportHeight] = usePageSpace();
  const [reportPage, setReportPage] = useState(0);
  const paged = dailyLog?.activeFramework === 'eisenhower';
  const pageSize = paged && items.length * 64 > reportHeight ? Math.max(1, Math.floor((reportHeight - 40) / 64)) : Math.max(1, items.length);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(reportPage, pageCount - 1);
  const [, setBeat] = useState(0);
  const running = items
    .map(item => ({ item, session: getSession(dailyLog, item.id) }))
    .find(entry => entry.session.state === STATES.RUNNING || entry.session.state === STATES.BREATHING);

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => setBeat(beat => beat + 1), 1000);
    return () => window.clearInterval(id);
  }, [running?.item?.id]);

  if (running && !reportOnly) {
    const { item, session } = running;
    const breathing = session.state === STATES.BREATHING;
    return <div className="focus-stage">
      <p className="type-label">{breathing ? 'Getting Ready' : 'Focus Time'}</p>
      <p className="type-section-title focus-stage-task">{item.text}</p>
      <FocusStopwatch session={session} size={168} />
      <p className="type-metadata">{breathing ? 'Starting in a moment.' : `${formatStopwatch(elapsedSeconds(session))} elapsed`}</p>
      {!breathing && <div className="focus-stage-actions">
        <button type="button" disabled={!isInteractive} onClick={() => onPause?.(item.id)} className="type-control">
          <Pause aria-hidden="true" /> Pause
        </button>
        <button type="button" disabled={!isInteractive} onClick={() => onComplete?.(item.id)} className="type-control">
          <Check aria-hidden="true" /> Done
        </button>
      </div>}
    </div>;
  }

  const sessions = items.map(item => ({ item, session: getSession(dailyLog, item.id) }));
  const totalElapsed = sessions.reduce((sum, entry) => sum + elapsedSeconds(entry.session), 0);
  const done = items.filter(item => item.completed).length;
  const anyInferred = sessions.some(entry => entry.session.timingAccuracy === 'inferred');

  if (items.length === 0) {
    return <div className="report-empty">
      {!reportOnly && <FocusStopwatch elapsedSec={0} size={96} />}
      <p className="type-section-title">Nothing Decided Yet</p>
      <p className="type-metadata">Write a priority on the first page to begin.</p>
    </div>;
  }

  return <section className={`day-report ${paged ? 'matrix-time-report' : ''}`} aria-labelledby="day-report-heading">
    <header>
      <h2 id="day-report-heading" className="type-label">Where The Time Went</h2>
      <span className="type-metadata">{dateLabel}</span>
    </header>
    <div className="day-report-pages" ref={reportSpaceRef}>
    <div className="day-report-list">
      {sessions.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(({ item, session }) => <div key={item.id} data-task-id={item.id} className="day-report-row">
        <p title={item.text} className={`type-body ${item.completed ? 'is-complete' : ''}`}>{item.text}</p>
        <p className="type-metadata">
          {formatStopwatch(elapsedSeconds(session))} elapsed
          {session.timingAccuracy === 'inferred' && <span> · estimated</span>}
        </p>
      </div>)}
    </div>
    <CompactPager page={currentPage} count={pageCount} onChange={setReportPage} label="Time report pages" />
    </div>
    <footer>
      {dailyLog.closedAt && <p className="type-control">Day Closed</p>}
      <p className="type-metadata">{done} of {items.length} finished · {formatStopwatch(totalElapsed)} total focus</p>
      {anyInferred && <p className="type-metadata"><em>Some time was estimated after the page was left open.</em></p>}
      {onCloseDay && !dailyLog.closedAt && !running && <button type="button" disabled={!isInteractive} onClick={onCloseDay} className="type-control day-close-button">
        <Check aria-hidden="true" /> {reportOnly ? 'Turn Over' : 'The Day Is Done'}
      </button>}
    </footer>
  </section>;
}
