import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function PageFlipNavigation({
  onStepDay,
  currentDate,
  isMuted = false
}) {
  // Keyboard Left / Right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onStepDay(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onStepDay(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStepDay]);

  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const prevLabel = prevDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const nextLabel = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <>
      {/* Floating Left Page Turn Button */}
      <aside className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 no-print">
        <button
          onClick={() => {
            playSound('page', isMuted);
            onStepDay(-1);
          }}
          title={`Flip to ${prevLabel} (or press ← key)`}
          className="group relative flex items-center justify-center w-9 h-12 sm:w-11 sm:h-16 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] shadow-lg hover:shadow-xl hover:scale-105 transition-all text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          
          {/* Tooltip on hover */}
          <span className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md hidden sm:block">
            ‹ {prevLabel}
          </span>
        </button>
      </aside>

      {/* Floating Right Page Turn Button */}
      <aside className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 no-print">
        <button
          onClick={() => {
            playSound('page', isMuted);
            onStepDay(1);
          }}
          title={`Flip to ${nextLabel} (or press → key)`}
          className="group relative flex items-center justify-center w-9 h-12 sm:w-11 sm:h-16 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] shadow-lg hover:shadow-xl hover:scale-105 transition-all text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />

          {/* Tooltip on hover */}
          <span className="absolute right-full mr-2 px-2.5 py-1 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md hidden sm:block">
            {nextLabel} ›
          </span>
        </button>
      </aside>
    </>
  );
}
