import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import MonthPicker from './MonthPicker';
import { formatDateKey } from '../hooks/useJournalStorage';
import { playSound } from '../utils/audio';

export function DateDisplay({ currentDate }) {
  const formattedWeekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const dayOfMonth = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Day of the year, counted in calendar days rather than milliseconds.
  //
  // The old form divided the raw millisecond difference by 86,400,000. In any
  // timezone that observes DST one day of the year is 23 hours long, so after
  // the spring change the elapsed time is an hour short of a whole number of
  // days and Math.floor lands one low: in New York, 1 July 2026 read "Day 181"
  // when it is day 182. It was right in IST, which has no DST, which is why it
  // was never seen. VISION §13 — correct numbers, or the instrument is a
  // compass two degrees off.
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const midnightToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const dayOfYear = Math.round((midnightToday - startOfYear) / 86400000) + 1;

  return (
    <div className="date-display flex items-baseline gap-2 sm:gap-2.5 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis tabular-nums" title={currentDate.toLocaleDateString('en-US', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}>
      <h1 className="type-page-title flex items-baseline gap-1.5 sm:gap-2 whitespace-nowrap shrink-0">
        <span className="date-month-full whitespace-nowrap">{formattedMonth} {dayOfMonth}</span>
        <span className="date-month-short whitespace-nowrap">{currentDate.toLocaleDateString('en-US', {month:'short'})} {dayOfMonth}</span>
        <span className="date-year">
          {year}
        </span>
      </h1>

      <div className="date-meta type-metadata">
        <span className="date-weekday">
          {formattedWeekday}
        </span>
        <span className="opacity-30 hidden xs:inline">•</span>
        <span className="date-day-number">
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
  hasEntry,
  isMuted = false
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
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
        className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={handleGoToday}
        className={`px-2.5 min-h-[24px] text-[11px] font-medium rounded-full transition-all cursor-pointer ${
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
        className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* The month picker. A native date input handed this panel to the
          browser's own chrome, which is a different shape on every platform
          and never the one this product is drawn in. */}
      <div className="relative pl-1 border-l border-black/[0.08] dark:border-white/[0.08]">
        <button
          type="button"
          onClick={() => setPickerOpen(o => !o)}
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          aria-label="Choose a day"
          title="Choose a day"
          className="min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer text-neutral-400 hover:text-neutral-800 dark:hover:text-white rounded-full transition-colors"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
        </button>
        {pickerOpen && (
          <MonthPicker
            currentDate={currentDate}
            hasEntry={hasEntry}
            isMuted={isMuted}
            onClose={() => setPickerOpen(false)}
            onSelect={(d) => setCurrentDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()))}
          />
        )}
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
