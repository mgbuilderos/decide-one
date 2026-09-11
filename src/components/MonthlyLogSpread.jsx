import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Check, Trash2, Calendar, Target } from 'lucide-react';
import { CATEGORIES } from '../types/journal';
import { playSound } from '../utils/audio';

export default function MonthlyLogSpread({
  currentDate,
  setCurrentDate,
  monthlyLog,
  onUpdateMonthlyLog,
  isMuted = false
}) {
  const [rightPageView, setRightPageView] = useState('calendar'); // 'calendar' | 'goals'
  const [mobileTab, setMobileTab] = useState('side1'); // 'side1' (01-15) | 'side2' (16-30) | 'goals'
  const [newMasterTask, setNewMasterTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('professional');

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Balanced split: exactly half the month on each bi-fold page
  // E.g. for 30 days: 15 days on Left Page, 15 days on Right Page
  // For 31 days: 16 days on Left Page, 15 days on Right Page
  // For 28 days: 14 days on Left Page, 14 days on Right Page
  const splitDay = Math.ceil(daysInMonth / 2);
  const leftDaysCount = splitDay;
  const rightDaysCount = daysInMonth - splitDay;

  const handleStepMonth = (delta) => {
    playSound('page', isMuted);
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const handleEventChange = (dayNumStr, text) => {
    const updatedEvents = { ...monthlyLog.events, [dayNumStr]: text };
    onUpdateMonthlyLog({ ...monthlyLog, events: updatedEvents });
  };

  const handleAddMasterTask = (e) => {
    e.preventDefault();
    if (!newMasterTask.trim()) return;

    playSound('click', isMuted);
    const newTask = {
      id: 'mt_' + Date.now(),
      text: newMasterTask.trim(),
      completed: false,
      category: selectedCategory
    };

    const updatedTasks = [...(monthlyLog.masterTasks || []), newTask];
    onUpdateMonthlyLog({ ...monthlyLog, masterTasks: updatedTasks });
    setNewMasterTask('');
  };

  const handleToggleMasterTask = (taskId) => {
    const updatedTasks = (monthlyLog.masterTasks || []).map(t => {
      if (t.id === taskId) {
        const nextDone = !t.completed;
        playSound(nextDone ? 'check' : 'click', isMuted);
        return { ...t, completed: nextDone };
      }
      return t;
    });
    onUpdateMonthlyLog({ ...monthlyLog, masterTasks: updatedTasks });
  };

  const handleDeleteMasterTask = (taskId) => {
    playSound('click', isMuted);
    const updatedTasks = (monthlyLog.masterTasks || []).filter(t => t.id !== taskId);
    onUpdateMonthlyLog({ ...monthlyLog, masterTasks: updatedTasks });
  };

  const renderDayRow = (dayNum) => {
    const dayNumStr = String(dayNum).padStart(2, '0');
    const dateObj = new Date(year, monthIndex, dayNum);
    const dayOfWeekLetter = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const eventText = monthlyLog.events ? (monthlyLog.events[dayNumStr] || '') : '';

    return (
      <div
        key={dayNum}
        className={`group flex items-center gap-2 py-0 px-1.5 rounded-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors h-[24px] leading-[24px] ${
          isWeekend ? 'bg-black/[0.02] dark:bg-white/[0.03]' : ''
        }`}
      >
        {/* Date & Weekday Initial */}
        <div className="w-9 shrink-0 text-[11px] flex items-baseline justify-between select-none">
          <span className="font-bold text-neutral-900 dark:text-neutral-100">{dayNumStr}</span>
          <span className={`text-[10px] ${isWeekend ? 'font-bold text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'}`}>
            {dayOfWeekLetter}
          </span>
        </div>

        {/* Inline Event Field: Quiet Luxury Stationery Styling */}
        <input
          type="text"
          value={eventText}
          onChange={(e) => handleEventChange(dayNumStr, e.target.value)}
          placeholder={dayNum === 1 && !eventText ? "Event or milestone..." : ""}
          className="flex-1 min-w-0 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none placeholder-neutral-400/30 group-hover:placeholder-neutral-400/40 focus:placeholder-neutral-400/50 truncate"
        />
      </div>
    );
  };

  const masterTasks = monthlyLog.masterTasks || [];
  const completedGoalsCount = masterTasks.filter(t => t.completed).length;

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col overflow-hidden select-none animate-in fade-in duration-300">
      
      {/* Mobile-Only 3-Way Switcher (Hidden on Desktop) */}
      <div className="md:hidden flex items-center justify-between h-[30px] border-b border-black/[0.08] dark:border-white/[0.08] mb-1 shrink-0 no-print">
        <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06] w-full text-xs">
          <button
            onClick={() => setMobileTab('side1')}
            className={`flex-1 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              mobileTab === 'side1'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            01–{String(splitDay).padStart(2, '0')}
          </button>
          <button
            onClick={() => setMobileTab('side2')}
            className={`flex-1 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              mobileTab === 'side2'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            {splitDay + 1}–{daysInMonth}
          </button>
          <button
            onClick={() => setMobileTab('goals')}
            className={`flex-1 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              mobileTab === 'goals'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Priorities ({masterTasks.length})
          </button>
        </div>
      </div>

      {/* Bi-Fold Two-Page Spread (Desktop: Side-by-Side with Center Spine) */}
      <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row gap-0 overflow-hidden">
        
        {/* =========================================================================
            LEFT PAGE: Days 01 to splitDay (15 or 16 rows, Zero Scroll)
            ========================================================================= */}
        <div className={`flex-1 min-w-0 min-h-0 flex flex-col md:pr-6 md:border-r border-black/[0.08] dark:border-white/[0.08] bifold-left-page overflow-hidden justify-between ${
          mobileTab === 'side1' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Left Masthead (Exact 48px Cadence) */}
          <div className="h-[48px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block leading-tight">
                Monthly View
              </span>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-baseline gap-1.5 leading-none">
                <span>{monthName}</span>
                <span className="text-neutral-400 dark:text-neutral-600 font-light text-sm">{year}</span>
              </h1>
            </div>

            {/* Month Navigation Stepper */}
            <div className="flex items-center gap-0.5 bg-black/[0.04] dark:bg-white/[0.06] rounded-full p-0.5 border border-black/[0.06] dark:border-white/[0.08] no-print">
              <button
                onClick={() => handleStepMonth(-1)}
                title="Previous Month"
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                {monthName.slice(0, 3)}
              </span>
              <button
                onClick={() => handleStepMonth(1)}
                title="Next Month"
                className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Left Days List (Zero-Scroll Cadence Locked) */}
          <div className="flex-1 min-h-0 flex flex-col justify-start overflow-hidden py-1">
            {Array.from({ length: leftDaysCount }, (_, i) => renderDayRow(i + 1))}
          </div>

          {/* Left Page Baseline Footer (Exact 24px Cadence) */}
          <footer className="shrink-0 h-[24px] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 select-none whitespace-nowrap">
            <span>Part I • Days 01–{String(splitDay).padStart(2, '0')}</span>
            <span className="uppercase tracking-wider font-semibold">Decide One Index</span>
          </footer>

        </div>

        {/* =========================================================================
            RIGHT PAGE: Days (splitDay+1) to daysInMonth OR Master Goals
            ========================================================================= */}
        <div className={`flex-1 min-w-0 min-h-0 flex flex-col md:pl-6 bifold-right-page extension-booklet-paper overflow-hidden justify-between ${
          mobileTab === 'side2' || mobileTab === 'goals' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Right Masthead (Exact 48px Cadence with View Switcher) */}
          <div className="h-[48px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block leading-tight">
                {rightPageView === 'calendar' ? 'Month At A Glance' : 'Monthly Priorities'}
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50 flex items-baseline gap-1.5 leading-none">
                {rightPageView === 'calendar' ? (
                  <span>Days {splitDay + 1}–{daysInMonth}</span>
                ) : (
                  <span>Priorities</span>
                )}
              </h2>
            </div>

            {/* Desktop Switcher: Calendar Days vs Master Goals */}
            <div className="hidden md:flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] no-print">
              <button
                onClick={() => {
                  playSound('click', isMuted);
                  setRightPageView('calendar');
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  rightPageView === 'calendar'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Days {splitDay + 1}–{daysInMonth}</span>
              </button>

              <button
                onClick={() => {
                  playSound('click', isMuted);
                  setRightPageView('goals');
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                  rightPageView === 'goals'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Target className="w-3 h-3" />
                <span>Priorities ({masterTasks.length})</span>
              </button>
            </div>
          </div>

          {/* Right Page Body */}
          {rightPageView === 'calendar' && mobileTab !== 'goals' ? (
            /* View A: Days 16 to 30/31 (Zero Scroll, Symmetric with Left Page) */
            <div className="flex-1 min-h-0 flex flex-col justify-start overflow-hidden py-1">
              {Array.from({ length: rightDaysCount }, (_, i) => renderDayRow(splitDay + i + 1))}
              
              {/* If right page has fewer days than left, fill with blank cadence guideline lines */}
              {Array.from({ length: Math.max(0, leftDaysCount - rightDaysCount) }, (_, i) => (
                <div key={`blank-${i}`} className="h-[24px] border-b border-black/[0.03] dark:border-white/[0.03]" />
              ))}
            </div>
          ) : (
            /* View B: Master Monthly Goals & Milestones (Cadence-Locked, Zero Scroll) */
            <div className="flex-1 min-h-0 flex flex-col justify-start overflow-hidden py-1 space-y-2">
              
              {/* Add Master Task Form */}
              <form onSubmit={handleAddMasterTask} className="flex gap-1.5 shrink-0 no-print">
                <input
                  type="text"
                  value={newMasterTask}
                  onChange={(e) => setNewMasterTask(e.target.value)}
                  placeholder="Add monthly goal or milestone..."
                  className="flex-1 min-w-0 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.12] dark:border-white/[0.15] rounded-xs px-2.5 py-1 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none placeholder-neutral-400/50"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.12] dark:border-white/[0.15] rounded-xs px-2 py-1 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-medium"
                >
                  {Object.values(CATEGORIES).map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-2.5 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xs text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </form>

              {/* Master Tasks List (Zero Scroll, Up to 9 Tasks) */}
              <div className="flex-1 min-h-0 flex flex-col space-y-1 overflow-hidden">
                {masterTasks.length === 0 ? (
                  <div className="py-10 text-center text-xs text-neutral-400">
                    No monthly goals set yet. Add your core milestones above.
                  </div>
                ) : (
                  masterTasks.slice(0, 9).map((task) => {
                    const cat = Object.values(CATEGORIES).find(c => c.id === task.category) || CATEGORIES.PROFESSIONAL;
                    return (
                      <div
                        key={task.id}
                        className="group flex items-center justify-between gap-2 h-[28px] px-2 rounded-xs border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.015] dark:bg-white/[0.02] hover:border-black/30 dark:hover:border-white/30 transition-all shrink-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => handleToggleMasterTask(task.id)}
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                              task.completed
                                ? 'bg-neutral-900 border-neutral-900 dark:bg-white dark:border-white text-white dark:text-neutral-900'
                                : 'border-neutral-400 dark:border-neutral-500 bg-transparent'
                            }`}
                          >
                            {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </button>

                          <span
                            className={`text-xs font-medium truncate ${
                              task.completed ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100'
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[9px] px-1.5 py-0.2 rounded border border-black/[0.08] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-400 font-medium">
                            {cat.label}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteMasterTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-900 dark:hover:text-white p-0.5 transition-opacity cursor-pointer"
                            title="Delete goal"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* Right Page Baseline Footer (Exact 24px Cadence) */}
          <footer className="shrink-0 h-[24px] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 select-none whitespace-nowrap">
            <span>
              {rightPageView === 'calendar' && mobileTab !== 'goals'
                ? `Part II • Days ${splitDay + 1}–${daysInMonth}`
                : `${completedGoalsCount}/${masterTasks.length} Priorities Complete`
              }
            </span>

            <button
              type="button"
              onClick={() => {
                playSound('click', isMuted);
                setRightPageView(rightPageView === 'calendar' ? 'goals' : 'calendar');
              }}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer font-semibold"
            >
              {rightPageView === 'calendar' && mobileTab !== 'goals' ? `Priorities (${masterTasks.length}) →` : '← Back To Days'}
            </button>
          </footer>

        </div>

      </div>

    </div>
  );
}
