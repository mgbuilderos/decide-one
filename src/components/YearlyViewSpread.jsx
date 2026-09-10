import React from 'react';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { MONTH_ILLUSTRATIONS } from '../data/monthIllustrations';
import { playSound } from '../utils/audio';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function YearlyViewSpread({
  currentDate = new Date(),
  setCurrentDate,
  onSelectMonth,
  onOpenToday,
  isMuted = false
}) {
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const isCurrentYear = today.getFullYear() === currentYear;
  const currentMonthIdx = today.getMonth();

  const handleMonthCardClick = (monthIdx) => {
    playSound('page', isMuted);
    onSelectMonth?.(monthIdx);
  };

  const handleOpenTodayClick = (e, monthIdx) => {
    e.stopPropagation();
    playSound('click', isMuted);
    if (onOpenToday) {
      onOpenToday(monthIdx);
    } else {
      // If clicking current month, go to today, otherwise 1st of that month
      const target = isCurrentYear && monthIdx === currentMonthIdx
        ? new Date()
        : new Date(currentYear, monthIdx, 1);
      setCurrentDate?.(target);
    }
  };

  const renderMonthCard = (monthIdx) => {
    const isThisMonth = isCurrentYear && monthIdx === currentMonthIdx;
    const daysInMonth = new Date(currentYear, monthIdx + 1, 0).getDate();
    const firstDayWeekday = (new Date(currentYear, monthIdx, 1).getDay() + 6) % 7; // Monday = 0
    const illus = MONTH_ILLUSTRATIONS[monthIdx];

    return (
      <div
        key={monthIdx}
        onClick={() => handleMonthCardClick(monthIdx)}
        className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between h-full min-h-0 relative overflow-hidden ${
          isThisMonth
            ? 'border-neutral-900 bg-black/[0.03] dark:border-white dark:bg-white/[0.04] shadow-xs'
            : 'border-black/[0.08] dark:border-white/[0.08] hover:border-black/25 dark:hover:border-white/25 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]'
        }`}
      >
        {/* Card Header: Month Name & Thumbnail Illustration */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 pr-1">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white truncate">
              {MONTH_NAMES[monthIdx]}
            </div>
            <div className="text-[9px] text-neutral-400 dark:text-neutral-500 truncate">
              {daysInMonth} days
            </div>
          </div>
          <div className="w-6 h-6 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
            {illus?.render('w-6 h-6 text-neutral-800 dark:text-neutral-200')}
          </div>
        </div>

        {/* Micro Calendar Dot-Grid preview */}
        <div className="grid grid-cols-7 gap-0.5 text-center my-auto py-0.5">
          {Array.from({ length: Math.min(daysInMonth + firstDayWeekday, 35) }).map((_, idx) => {
            const dayNum = idx - firstDayWeekday + 1;
            const isValid = dayNum > 0 && dayNum <= daysInMonth;
            const isToday = isThisMonth && dayNum === today.getDate();

            return (
              <span
                key={idx}
                className={`text-[8px] sm:text-[9px] h-3 flex items-center justify-center rounded-xs ${
                  !isValid
                    ? 'opacity-0'
                    : isToday
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                      : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {isValid ? dayNum : ''}
              </span>
            );
          })}
        </div>

        {/* Card Bottom: Quick Jump Action */}
        <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.06] text-[9px] sm:text-[10px]">
          <span className="text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors flex items-center gap-0.5 font-medium">
            <span>Chapter</span>
            <ChevronRight className="w-2.5 h-2.5" />
          </span>

          <button
            type="button"
            onClick={(e) => handleOpenTodayClick(e, monthIdx)}
            className={`px-1.5 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
              isThisMonth
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'bg-black/[0.05] dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900'
            }`}
          >
            {isThisMonth ? 'Open Today' : 'Open 1st'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row gap-0 overflow-hidden select-none">
      
      {/* Left Page: H1 (January to June) */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col md:pr-6 md:border-r border-black/[0.08] dark:border-white/[0.08] bifold-left-page overflow-hidden">
        
        {/* Left Masthead (48px Cadence) */}
        <div className="h-[48px] border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0 mb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>Annual Index</span>
              <span className="opacity-40">•</span>
              <span className="opacity-70">{currentYear}</span>
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
              H1 • January — June
            </div>
          </div>
          <div className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:block">
            Decide One
          </div>
        </div>

        {/* Left 6-Month Grid (Hardcoded Zero-Scroll) */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-2 sm:grid-cols-3 grid-rows-3 sm:grid-rows-2 gap-2 pb-1">
          {[0, 1, 2, 3, 4, 5].map((m) => renderMonthCard(m))}
        </div>

      </div>

      {/* Right Page: H2 (July to December) */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col md:pl-6 bifold-right-page extension-booklet-paper overflow-hidden mt-3 md:mt-0">
        
        {/* Right Masthead (48px Cadence) */}
        <div className="h-[48px] border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0 mb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
              H2 • July — December
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Select any month to view its Chapter Breaker
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-neutral-400">
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">12 Chapters</span>
          </div>
        </div>

        {/* Right 6-Month Grid (Hardcoded Zero-Scroll) */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-2 sm:grid-cols-3 grid-rows-3 sm:grid-rows-2 gap-2 pb-1">
          {[6, 7, 8, 9, 10, 11].map((m) => renderMonthCard(m))}
        </div>

      </div>

    </div>
  );
}
