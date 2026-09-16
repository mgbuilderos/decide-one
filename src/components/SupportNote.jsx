import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  SUPPORT_CHANNELS,
  UPI_AMOUNTS,
  formatInr,
  upiPaymentUrl,
  isLikelyIndiaVisitor
} from '../utils/support';

/**
 * The quiet ask after a closed day (VISION.md §11.1).
 *
 * Non-modal and never over the closing dialog. It waits 400ms after the day
 * closes so the closed day registers first, and App decides whether it may
 * appear at all (utils/support.js shouldAskForSupport).
 */
const BORDER = 'border border-black/[0.12] dark:border-white/[0.15]';

export default function SupportNote({ onNotNow, onNeverAgain, onOpenSupport, channels = SUPPORT_CHANNELS }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;
  const quickUpi = Boolean(channels.upiId) && isLikelyIndiaVisitor();

  return (
    <aside
      aria-labelledby="support-note-title"
      className={`no-print fixed z-40 bottom-3 inset-x-3 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[344px] bg-white dark:bg-[#171717] text-neutral-900 dark:text-neutral-100 rounded-2xl ${BORDER} p-4 flex flex-col gap-3`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="support-note-title" className="type-section-title">The day is closed.</h2>
          <p className="type-body text-neutral-600 dark:text-neutral-400">If Decide One has been worth something, you can support it.</p>
        </div>
        <button
          type="button"
          onClick={onNotNow}
          aria-label="Not now"
          className="w-10 h-10 -mr-2 -mt-2 shrink-0 grid place-items-center rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {quickUpi && (
        <div className="grid grid-cols-3 gap-2">
          {UPI_AMOUNTS.slice(0, 3).map(({ inr, label }) => (
            <a
              key={inr}
              href={upiPaymentUrl(inr, channels)}
              className={`min-h-11 rounded-lg ${BORDER} hover:bg-black/[0.04] dark:hover:bg-white/[0.06] flex flex-col items-center justify-center`}
            >
              <span className="type-metadata text-neutral-500 dark:text-neutral-400">{label}</span>
              <span className="type-control tabular-nums">{formatInr(inr)}</span>
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button type="button" onClick={onNeverAgain} className="type-control min-h-11 px-2 mr-auto text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
          Don't ask again
        </button>
        <button type="button" onClick={onNotNow} className={`type-control min-h-11 px-3 rounded-lg ${BORDER} hover:bg-black/[0.04] dark:hover:bg-white/[0.06]`}>
          Not now
        </button>
        <button type="button" onClick={onOpenSupport} className="type-control min-h-11 px-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
          Support options
        </button>
      </div>
    </aside>
  );
}
