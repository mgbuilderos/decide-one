import React, { useEffect, useState } from 'react';
import { STATES } from '../utils/executionModel';

export function formatStopwatch(totalSeconds) {
  const whole = Math.max(0, Math.floor(totalSeconds || 0));
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;
  const pad = value => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

function preciseElapsed(session, now) {
  const banked = session?.accumulatedSec || 0;
  if (session?.state !== STATES.RUNNING || !session?.runStartedAt) return banked;
  return banked + Math.max(0, (now - new Date(session.runStartedAt).getTime()) / 1000);
}

/** A classical elapsed-time instrument. Both hands advance clockwise. */
export default function FocusStopwatch({ session = null, elapsedSec = 0, size = 104, showReadout = true }) {
  const running = session?.state === STATES.RUNNING;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = session ? preciseElapsed(session, now) : elapsedSec;
  const secondsAngle = (elapsed % 60) * 6;
  const minutesAngle = ((elapsed / 60) % 60) * 6;
  const readout = formatStopwatch(elapsed);

  const hand = (length, width, angle, className) => (
    <line
      x1="50" y1="50" x2="50" y2={50 - length}
      className={className}
      strokeWidth={width}
      vectorEffect="non-scaling-stroke"
      strokeLinecap="round"
      style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}
    />
  );

  return (
    <div
      className="focus-stopwatch"
      style={{ width: size }}
      data-elapsed-seconds={Math.floor(elapsed)}
      data-second-hand-angle={secondsAngle.toFixed(2)}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${readout} elapsed`}>
        <circle cx="50" cy="50" r="47" className="stopwatch-face" />
        {Array.from({ length: 60 }).map((_, index) => (
          <line
            key={index}
            x1="50"
            y1={index % 5 === 0 ? 5 : 7}
            x2="50"
            y2={index % 5 === 0 ? 11 : 9.5}
            className={index % 5 === 0 ? 'stopwatch-tick stopwatch-tick-major' : 'stopwatch-tick'}
            transform={`rotate(${index * 6} 50 50)`}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {hand(27, 1.35, minutesAngle, 'stopwatch-minute-hand')}
        {hand(36, 0.65, secondsAngle, 'stopwatch-second-hand')}
        <circle cx="50" cy="50" r="1.65" className="stopwatch-pin" />
      </svg>
      {showReadout && <span className="type-numeric-display">{readout}</span>}
    </div>
  );
}
