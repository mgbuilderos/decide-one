import React from 'react';
import { STATES, elapsedSeconds, remainingSeconds } from '../utils/executionModel';

/**
 * The clock (R11) — the clock, not a mode. No switcher, no gallery.
 *
 * A real face with moving hands, because "a face renders duration spatially
 * where digits render an instant". A progress ring is not a clock: it shows a
 * fraction. Hands show *time*, and the sweep of a second hand is the thing
 * that makes a running box feel like it is running.
 *
 * The hands count the box down. When the box is spent they keep going and the
 * readout turns to overtime — information, never alarm (R8). The face has no
 * protagonist, so it never judges (R12).
 */

function formatClock(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function AnalogueClock({
  session = null,
  plannedSec = 0,
  elapsedSec = 0,
  state = STATES.IDLE,
  size = 128,
  showReadout = false,
  now = Date.now()
}) {
  // Either drive from a live session, or from explicit figures for a static view.
  const planned = session ? (session.plannedDurationSec || 0) : plannedSec;
  const elapsed = session ? elapsedSeconds(session, now) : elapsedSec;
  const activeState = session ? session.state : state;

  const remaining = planned - elapsed;
  const overtime = remaining < 0;
  const shown = Math.abs(remaining);

  // Absolute degrees, so a hand never snaps backwards through 360.
  const secondDeg = (shown / 60) * 360;
  const minuteDeg = (shown / 3600) * 360;
  const hourDeg = (shown / 43200) * 360;

  const isResting = activeState === STATES.IDLE || activeState === STATES.BREATHING;
  const detailed = size >= 64;
  const r = 50;

  const hand = (length, width, deg, className) => (
    <line
      x1="50" y1="50" x2="50" y2={50 - length}
      className={className}
      strokeWidth={width}
      strokeLinecap="round"
      style={{
        transformOrigin: '50px 50px',
        transform: `rotate(${deg}deg)`,
        transition: 'transform 1s linear'
      }}
    />
  );

  return (
    <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label={
          planned === 0
            ? 'No time set'
            : `${formatClock(shown)} ${overtime ? 'over the planned time' : 'remaining'}`
        }
      >
        <circle cx="50" cy="50" r={r - 2} fill="none" strokeWidth="0.8"
          className="stroke-black/15 dark:stroke-white/20" />

        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="50" y1="6" x2="50" y2="10.5"
            strokeWidth="1" strokeLinecap="round"
            className="stroke-black/45 dark:stroke-white/50"
            transform={`rotate(${i * 30} 50 50)`} />
        ))}

        {detailed && Array.from({ length: 60 }).map((_, i) => (
          i % 5 === 0 ? null : (
            <circle key={`m${i}`} cx="50" cy="8" r="0.45"
              className="fill-black/25 dark:fill-white/30"
              transform={`rotate(${i * 6} 50 50)`} />
          )
        ))}

        {hand(22, 2.2, hourDeg, isResting
          ? 'stroke-black/35 dark:stroke-white/35'
          : 'stroke-neutral-900 dark:stroke-neutral-100')}
        {hand(34, 1.5, minuteDeg, isResting
          ? 'stroke-black/30 dark:stroke-white/30'
          : 'stroke-neutral-900/80 dark:stroke-neutral-100/80')}
        {activeState === STATES.RUNNING &&
          hand(38, 0.6, secondDeg, 'stroke-neutral-500 dark:stroke-neutral-400')}

        <circle cx="50" cy="50" r="1.8" strokeWidth="0.6"
          className="fill-white dark:fill-[#141416] stroke-neutral-900 dark:stroke-neutral-100" />
      </svg>

      {showReadout && planned > 0 && (
        <div className="text-center leading-tight select-none">
          <div className="tabular-nums tracking-widest font-semibold text-neutral-800 dark:text-neutral-200"
            style={{ fontSize: Math.max(13, size * 0.16) }}>
            {formatClock(shown)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">
            {overtime ? 'over' : 'left'}
          </div>
        </div>
      )}
    </div>
  );
}
