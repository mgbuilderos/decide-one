import React from 'react';
import { X, Target, CheckCircle2, CalendarDays } from 'lucide-react';

export default function ProductivityDrawer({ isOpen, onClose, dailyMetrics = {}, monthlyStats = {} }) {
  if (!isOpen) return null;

  const completedToday = dailyMetrics.hardDone || 0;
  const listedToday = dailyMetrics.hardTotal || 0;
  const completedThisMonth = monthlyStats.totalCompleted || 0;
  const monthlyRate = monthlyStats.monthlyRate || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 dark:bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <button className="absolute inset-0 cursor-default" aria-label="Close Priority Review" onClick={onClose} />
      <aside className="relative w-full max-w-sm bg-white dark:bg-neutral-900 h-full shadow-2xl p-6 overflow-y-auto border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300" aria-label="Priority Review">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Priority Review</h2>
            <p className="text-xs text-neutral-500 mt-1">See what moved. Decide what deserves another day.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors" aria-label="Close Priority Review">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <section className="rounded-2xl border border-neutral-200/80 dark:border-neutral-700/60 p-5 bg-neutral-50 dark:bg-neutral-800/50">
            <div className="flex items-center gap-2 text-neutral-500">
              <Target className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Today</span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <strong className="text-4xl tracking-tight text-neutral-900 dark:text-white">{completedToday}<span className="text-lg text-neutral-400"> / {listedToday || 3}</span></strong>
              <span className="text-xs text-neutral-500 text-right">Priorities<br />complete</span>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200/80 dark:border-neutral-700/60 p-5">
            <div className="flex items-center gap-2 text-neutral-500">
              <CalendarDays className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">This Month</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <strong className="text-2xl text-neutral-900 dark:text-white">{completedThisMonth}</strong>
                <p className="text-[11px] text-neutral-500 mt-1">Completed priorities</p>
              </div>
              <div>
                <strong className="text-2xl text-neutral-900 dark:text-white">{monthlyRate}%</strong>
                <p className="text-[11px] text-neutral-500 mt-1">Of listed priorities</p>
              </div>
            </div>
          </section>

          <div className="rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 p-5">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-semibold mt-3">Completion is information, not a grade.</p>
            <p className="text-xs opacity-70 mt-1 leading-relaxed">Use this view to notice your choices and choose what comes first next.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
