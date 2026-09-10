import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateKey } from '../hooks/useJournalStorage';
import { playSound } from '../utils/audio';

export function DateDisplay({ currentDate }) {
  const formattedWeekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const dayOfMonth = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Calculate day of the year
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="flex items-baseline gap-2 sm:gap-2.5 min-w-0 whitespace-nowrap overflow-hidden tabular-nums">
      <h1 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-none flex items-baseline gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
        <span className="whitespace-nowrap">{formattedMonth} {dayOfMonth}</span>
        <span className="text-neutral-600 dark:text-neutral-400 font-normal text-sm sm:text-base whitespace-nowrap tabular-nums">
          {year}
        </span>
      </h1>

      <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
        <span className="px-1.5 sm:px-2 py-0.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full text-[9px] sm:text-[10px] text-neutral-700 dark:text-neutral-300 font-bold tracking-wide whitespace-nowrap">
          {formattedWeekday}
        </span>
        <span className="opacity-30 hidden xs:inline">•</span>
        <span className="text-[9px] sm:text-[10px] tracking-wider uppercase hidden xs:inline whitespace-nowrap tabular-nums">
          Day {dayOfYear}
        </span>
      </div>
    </div>
  );
}

export function DateNavControls({
  currentDate,
  setCurrentDate,
  onStepDay,
  isMuted = false
}) {
  const handleStepDay = (delta) => {
    if (onStepDay) {
      onStepDay(delta);
    } else {
      playSound('crown-ratchet', isMuted);
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + delta);
      setCurrentDate(newDate);
    }
  };

  const handleGoToday = () => {
    if (isToday) return;
    playSound('page', isMuted);
    const today = new Date();
    if (onStepDay) {
      const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const curMid = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const delta = Math.round((todayMid - curMid) / (1000 * 60 * 60 * 24));
      if (delta !== 0) {
        onStepDay(delta > 0 ? 1 : -1, today);
        return;
      }
    }
    setCurrentDate(today);
  };

  const handleDateSelect = (e) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split('-').map(Number);
    const selected = new Date(y, m - 1, d);
    setCurrentDate(selected);
  };

  const dateInputVal = formatDateKey(currentDate);
  const isToday = formatDateKey(new Date()) === dateInputVal;

  return (
    <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] rounded-full p-0.5 border border-black/[0.06] dark:border-white/[0.08] no-print">
      <button
        type="button"
        onClick={() => handleStepDay(-1)}
        title="Previous Day (or Left Arrow)"
        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={handleGoToday}
        className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
          isToday 
            ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-semibold' 
            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
        }`}
      >
        Today
      </button>

      <button
        type="button"
        onClick={() => handleStepDay(1)}
        title="Next Day (or Right Arrow)"
        className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Native Calendar Picker Overlay */}
      <div className="relative pl-1 border-l border-black/[0.08] dark:border-white/[0.08]">
        <label className="cursor-pointer p-1 text-neutral-400 hover:text-neutral-800 dark:hover:text-white block rounded-full transition-colors" title="Select Date">
          <CalendarIcon className="w-3 h-3" />
          <input
            type="date"
            value={dateInputVal}
            onChange={handleDateSelect}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  );
}

export default function DateHeader({
  currentDate,
  setCurrentDate,
  onStepDay,
  isMuted = false
}) {
  return (
    <header className="w-full h-[48px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] mb-3 pb-1 select-none shrink-0">
      <DateDisplay currentDate={currentDate} />
      <DateNavControls
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        onStepDay={onStepDay}
        isMuted={isMuted}
      />
    </header>
  );
}
