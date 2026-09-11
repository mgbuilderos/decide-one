import React, { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { describeDay } from '../utils/carryForward';

/**
 * Offers to bring still-open priorities into today.
 *
 * The copy is governed by VISION §11.3 and its fourth rule. It states what is
 * open; it never counts what was missed, never names how long the person was
 * away, and never implies a debt. "Start fresh" is a real answer, not a
 * dismissal — which is why it is a button and not an ✕ in the corner.
 */
export default function CarryForwardModal({
  isOpen,
  candidate,
  todayKey,
  onCarry,
  onDismiss
}) {
  const [chosen, setChosen] = useState([]);

  useEffect(() => {
    if (isOpen && candidate) setChosen(candidate.tasks.map((t) => t.id));
  }, [isOpen, candidate]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onEscape = (e) => { if (e.key === 'Escape') onDismiss(); };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isOpen, onDismiss]);

  if (!isOpen || !candidate) return null;

  const when = describeDay(candidate.fromDateKey, todayKey);
  const count = candidate.tasks.length;
  const toggle = (id) =>
    setChosen((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <button className="fixed inset-0 cursor-default" aria-label="Start fresh" onClick={onDismiss} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="carry-forward-title"
        className="relative w-full max-w-md bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="min-h-[56px] px-5 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
          <div>
            <h2 id="carry-forward-title" className="text-sm font-bold tracking-tight">
              {count === 1 ? 'One priority is still open' : `${count} priorities are still open`}
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              From {when}. Bring what still matters into today.
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="w-9 h-9 grid place-items-center rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Start fresh"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-3 flex flex-col gap-1">
          {candidate.tasks.map((task) => {
            const isChosen = chosen.includes(task.id);
            return (
              <label
                key={task.id}
                className="flex items-center gap-3 h-[44px] px-2 -mx-2 rounded-lg cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChosen}
                  onChange={() => toggle(task.id)}
                  className="w-4 h-4 shrink-0 accent-neutral-900 dark:accent-white cursor-pointer"
                />
                <span
                  className={`text-[13px] truncate transition-colors ${
                    isChosen
                      ? 'text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-400 dark:text-neutral-600 line-through'
                  }`}
                >
                  {task.text}
                </span>
              </label>
            );
          })}
        </div>

        <div className="px-5 py-3 flex items-center justify-between gap-3 border-t border-black/[0.08] dark:border-white/[0.08]">
          <button
            type="button"
            onClick={onDismiss}
            className="text-[12px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Start fresh
          </button>
          <button
            type="button"
            disabled={chosen.length === 0}
            onClick={() => onCarry(chosen)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-semibold transition-opacity disabled:opacity-30 disabled:cursor-default cursor-pointer"
          >
            Bring {chosen.length === candidate.tasks.length ? 'them' : chosen.length} to today
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
