import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/audio';

/**
 * The month picker.
 *
 * Replaces `<input type="date">`, which handed the whole panel to the
 * browser's own chrome — a different shape on every platform, and never the
 * one this product is drawn in.
 *
 * Deliberately plain: a month, a grid, and a mark under the days that already
 * have something written on them. No range select, no shortcuts, no
 * decoration. It is a way to reach a day, not a feature.
 */

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const sameDay = (a, b) => a && b && key(a) === key(b);

/** Monday-first grid, always six rows so the panel never changes height. */
function buildGrid(viewDate) {
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function MonthPicker({ currentDate, onSelect, onClose, hasEntry, isMuted = false }) {
  const [viewDate, setViewDate] = useState(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const root = useRef(null);
  const today = new Date();

  const days = useMemo(() => buildGrid(viewDate), [viewDate]);

  useEffect(() => {
    const onDown = (e) => { if (!root.current?.contains(e.target)) onClose?.(); };
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const stepMonth = (delta) => {
    playSound('click', isMuted);
    setViewDate(v => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  };

  const choose = (d) => {
    playSound('page', isMuted);
    onSelect?.(d);
    onClose?.();
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-label="Choose a day"
      className="absolute right-0 top-full mt-2 z-50 w-[248px] p-3 rounded-2xl bg-white dark:bg-[#141416] border border-black/[0.1] dark:border-white/[0.14] shadow-[0_12px_36px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] select-none"
    >
      <div className="h-[24px] flex items-center justify-between">
        <button
          type="button"
          onClick={() => stepMonth(-1)}
          aria-label="Previous month"
          className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[12px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 tabular-nums">
          {viewDate.toLocaleDateString('en-US', { month: 'long' })} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => stepMonth(1)}
          aria-label="Next month"
          className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-0.5">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="h-[20px] flex items-center justify-center text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
            {w}
          </span>
        ))}

        {days.map((d) => {
          const outside = d.getMonth() !== viewDate.getMonth();
          const isToday = sameDay(d, today);
          const isSelected = sameDay(d, currentDate);
          const written = hasEntry?.(key(d));
          return (
            <button
              key={key(d)}
              type="button"
              onClick={() => choose(d)}
              aria-label={d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              aria-current={isSelected ? 'date' : undefined}
              className={`relative h-[30px] rounded-lg text-[12px] tabular-nums transition-colors cursor-pointer flex items-center justify-center
                ${outside ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-700 dark:text-neutral-200'}
                ${isSelected
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                  : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'}
                ${isToday && !isSelected ? 'font-semibold text-neutral-900 dark:text-white' : ''}`}
            >
              {d.getDate()}
              {/* A day with something written on it. Not a streak, not a score
                  — just where the work already is (R12). */}
              {written && !isSelected && (
                <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-neutral-400 dark:bg-neutral-500" />
              )}
              {isToday && !isSelected && (
                <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/15 dark:ring-white/20 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => choose(new Date())}
        className="mt-2 w-full h-[28px] rounded-lg text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
      >
        Today
      </button>
    </div>
  );
}
