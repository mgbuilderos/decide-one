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
        <circle cx="50" cy="50" r={r - 2} fill="none" strokeWidth="0.55"
          className="stroke-black/25 dark:stroke-white/25" />
        <circle cx="50" cy="50" r={r - 5} fill="none" strokeWidth="0.25"
          className="stroke-black/10 dark:stroke-white/10" />

        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="50" y1={i % 3 === 0 ? '6' : '7.5'} x2="50" y2={i % 3 === 0 ? '12' : '11.5'}
            strokeWidth={i % 3 === 0 ? '1.1' : '0.65'} strokeLinecap="round"
            className="stroke-black/50 dark:stroke-white/55"
            transform={`rotate(${i * 30} 50 50)`} />
        ))}

        {/* No duration set means no hands.
            Both hands at zero degrees point at twelve, so an unset dial used to
            read as "12:00" - a clock appearing to tell the wrong time. VISION
            §13.3 item 3 puts a correct clock above everything else on the list,
            and §13.2 is why: an instrument two degrees out is worse than no
            instrument, because it is believed.
            A dial with markers and a centre pin and no hands cannot be misread
            as a time. It reads as an instrument at rest, which is what it is.
            The aria-label already said "No time set"; only the picture lied. */}
        {planned > 0 && hand(21, 1.5, hourDeg, isResting
          ? 'stroke-black/35 dark:stroke-white/35'
          : 'stroke-neutral-900 dark:stroke-neutral-100')}
        {planned > 0 && hand(32, 0.95, minuteDeg, isResting
          ? 'stroke-black/30 dark:stroke-white/30'
          : 'stroke-neutral-900/80 dark:stroke-neutral-100/80')}
        {activeState === STATES.RUNNING &&
          hand(37, 0.45, secondDeg, 'stroke-neutral-500 dark:stroke-neutral-400')}

        <circle cx="50" cy="50" r="1.35" strokeWidth="0.45"
          className="fill-white dark:fill-[#141416] stroke-neutral-900 dark:stroke-neutral-100" />
        <circle cx="50" cy="50" r="0.38" className="fill-neutral-900 dark:fill-neutral-100" />
      </svg>

      {showReadout && planned > 0 && (
        <div className="text-center leading-tight select-none">
          <div className="tabular-nums tracking-[0.08em] font-medium text-neutral-800 dark:text-neutral-200"
            style={{ fontSize: Math.max(12, size * 0.1) }}>
            {formatClock(shown)}
          </div>
          <div className="mt-0.5 text-[9px] tracking-[0.08em] text-neutral-500">
            {overtime ? 'over' : 'remaining'}
          </div>
        </div>
      )}
    </div>
  );
}
