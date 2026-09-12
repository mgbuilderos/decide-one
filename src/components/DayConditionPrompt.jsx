import React from 'react';
import { ArrowRight, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-[3px] animate-in fade-in select-none">

      <div className="fixed inset-0" onClick={handleSkip} />

      <div
        className="relative z-10 w-full max-w-[620px] bg-white dark:bg-[#111113] text-neutral-950 dark:text-neutral-100 rounded-[18px] shadow-[0_40px_120px_rgba(0,0,0,0.34)] border border-black/[0.12] dark:border-white/[0.14] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150 font-sans"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="What does today look like?"
      >
        <div className="min-h-[72px] px-5 sm:px-7 py-4 flex items-center justify-between border-b border-black/[0.10] dark:border-white/[0.10] shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-[11px] font-bold tracking-[-0.02em] leading-none border border-black/20 dark:border-white/25 rounded-[4px] px-2 py-1.5">
              D1
            </div>
            <div>
              <div className="text-[13px] font-semibold tracking-[-0.01em] text-neutral-950 dark:text-white">
                What does today look like?
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500">
                {dateLabel || 'Answer once. The instrument does the rest.'}
              </div>
            </div>
          </div>

          <button
            onClick={handleSkip}
            className="w-9 h-9 grid place-items-center rounded-full text-neutral-400 hover:text-neutral-950 hover:bg-black/[0.04] dark:hover:text-white dark:hover:bg-white/[0.06] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            title="Skip"
            aria-label="Skip"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-2">
          <ul className="divide-y divide-black/[0.09] dark:divide-white/[0.09]">
            {DAY_CONDITIONS.map((condition, index) => (
              <li key={condition.id}>
                <button
                  type="button"
                  onClick={() => handleChoose(condition)}
                  className="group w-full min-h-[72px] grid grid-cols-[28px_1fr_20px] items-center gap-3 text-left py-3.5 transition-colors cursor-pointer hover:bg-black/[0.025] dark:hover:bg-white/[0.035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                >
                  <span className="text-[10px] tabular-nums text-neutral-500 dark:text-neutral-500">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block text-[14px] font-medium leading-5 tracking-[-0.01em] text-neutral-950 dark:text-neutral-100">{condition.label}</span>
                    <span className="block mt-1 text-[11px] leading-4 text-neutral-500 dark:text-neutral-400">{condition.effect}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-700 dark:group-hover:text-neutral-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-[56px] px-5 sm:px-7 flex items-center justify-between border-t border-black/[0.10] dark:border-white/[0.10] shrink-0">
          <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-500">
            Nothing shares first.
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] uppercase tracking-[0.12em] font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white px-3 py-2 rounded-full border border-black/[0.10] dark:border-white/[0.12] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            I already know
          </button>
        </div>
      </div>
    </div>
  );
}
