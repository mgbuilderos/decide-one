import React from 'react';
import { Sunrise, X } from 'lucide-react';
import { DAY_CONDITIONS } from '../data/dayConditions';
import { playSound } from '../utils/audio';
import { telemetry } from '../utils/telemetry';

/**
 * The morning opening ritual — counterpart to the evening closure.
 *
 * Asks what today looks like, then routes silently to the method suited to
 * that condition. No method is named on this screen; the user meets the name
 * only after the method is already working for them.
 *
 * Rule 5 holds throughout: the instrument helps, the person decides. Every
 * path out of this dialog is available, including declining to answer.
 */
export default function DayConditionPrompt({
  isOpen,
  onClose,
  onChooseCondition,
  dateLabel = '',
  isMuted = false
}) {
  if (!isOpen) return null;

  const handleChoose = (condition) => {
    playSound('check', isMuted);
    telemetry.track('day_condition_selected', {
      condition_id: condition.id,
      framework_id: condition.framework
    });
    onChooseCondition?.(condition);
  };

  const handleSkip = () => {
    playSound('click', isMuted);
    telemetry.track('day_condition_skipped', {});
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/70 dark:bg-black/85 backdrop-blur-lg animate-in fade-in select-none">

      <div className="fixed inset-0" onClick={handleSkip} />

      <div
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="What does today look like?"
      >
        {/* Header — 24px cadence pair inside a 56px bar */}
        <div className="h-14 px-5 sm:px-6 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                What does today look like?
              </div>
              <div className="text-[10px] text-neutral-400">
                {dateLabel || 'Answer once. The instrument does the rest.'}
              </div>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Skip"
            aria-label="Skip"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conditions */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4">
          <ul className="flex flex-col gap-2">
            {DAY_CONDITIONS.map(condition => (
              <li key={condition.id}>
                <button
                  type="button"
                  onClick={() => handleChoose(condition)}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.015] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:border-black/20 dark:hover:border-white/25 transition-colors cursor-pointer"
                >
                  <span className="block text-sm font-semibold leading-[24px] text-neutral-900 dark:text-neutral-100">
                    {condition.label}
                  </span>
                  <span className="block text-[11px] leading-[24px] text-neutral-500 dark:text-neutral-400">
                    {condition.effect}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer — the person always keeps the decision */}
        <div className="h-[48px] px-5 sm:px-6 flex items-center justify-between border-t border-black/[0.08] dark:border-white/[0.08] shrink-0">
          <span className="text-[10px] text-neutral-400">
            Nothing shares first.
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-1 rounded bg-black/[0.04] dark:bg-white/[0.06] transition-colors cursor-pointer"
          >
            I already know
          </button>
        </div>
      </div>
    </div>
  );
}
