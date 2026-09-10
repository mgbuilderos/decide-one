import React from 'react';

/**
 * The clock (R11) — the clock, not a mode. No switcher, no gallery.
 *
 * A face renders duration spatially where digits render an instant: the swept
 * arc is how much of the planned box has gone, at a glance, without arithmetic.
 *
 * R12 governs the styling: a clock face has no protagonist, so it never judges.
 * There is no tree to kill, no rocket to crash, no score to lose. Overrun is
 * drawn as a second, quieter arc past the top — information, not alarm (R8).
 */
export default function AnalogueClock({
  plannedSec = 0,
  elapsedSec = 0,
  state = 'IDLE',
  size = 128
}) {
  const r = size / 2;
  const stroke = Math.max(3, size * 0.045);
  const radius = r - stroke * 1.6;
  const circumference = 2 * Math.PI * radius;

  const planned = Math.max(plannedSec, 0);
  const elapsed = Math.max(elapsedSec, 0);
  const withinBox = planned > 0 ? Math.min(elapsed, planned) : 0;
  const overtime = planned > 0 ? Math.max(elapsed - planned, 0) : 0;

  const sweptFraction = planned > 0 ? withinBox / planned : 0;
  // Overrun keeps sweeping, but wraps rather than growing without limit.
  const overFraction = planned > 0 ? Math.min(overtime / planned, 1) : 0;

  const ticks = Array.from({ length: 12 }, (_, i) => i);
  const isResting = state === 'IDLE' || state === 'BREATHING';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={
        planned > 0
          ? `${Math.round(sweptFraction * 100)} percent of the planned time used`
          : 'No time set'
      }
      className="shrink-0"
    >
      {/* Face */}
      <circle
        cx={r}
        cy={r}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-black/[0.07] dark:text-white/[0.10]"
      />

      {/* Hour ticks — a real face, so duration is read against a familiar dial */}
      {ticks.map(i => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const outer = radius + stroke * 0.1;
        const inner = outer - (i % 3 === 0 ? stroke * 1.5 : stroke * 0.8);
        return (
          <line
            key={i}
            x1={r + Math.cos(angle) * inner}
            y1={r + Math.sin(angle) * inner}
            x2={r + Math.cos(angle) * outer}
            y2={r + Math.sin(angle) * outer}
            stroke="currentColor"
            strokeWidth={i % 3 === 0 ? stroke * 0.4 : stroke * 0.22}
            strokeLinecap="round"
            className="text-black/25 dark:text-white/30"
          />
        );
      })}

      {/* Elapsed arc — the planned box being spent */}
      {sweptFraction > 0 && (
        <circle
          cx={r}
          cy={r}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference * sweptFraction} ${circumference}`}
          transform={`rotate(-90 ${r} ${r})`}
          className={isResting ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100'}
          style={{ transition: 'stroke-dasharray 1s linear' }}
        />
      )}

      {/* Overrun arc — thinner and quieter. Information, never alarm (R8). */}
      {overFraction > 0 && (
        <circle
          cx={r}
          cy={r}
          r={radius - stroke * 1.1}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke * 0.5}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * (radius - stroke * 1.1) * overFraction} ${circumference}`}
          transform={`rotate(-90 ${r} ${r})`}
          className="text-neutral-400 dark:text-neutral-500"
          style={{ transition: 'stroke-dasharray 1s linear' }}
        />
      )}

      {/* Centre pin */}
      <circle cx={r} cy={r} r={stroke * 0.45} fill="currentColor" className="text-neutral-900 dark:text-neutral-100" />
    </svg>
  );
}
