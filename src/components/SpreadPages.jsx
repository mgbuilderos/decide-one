import React from 'react';
import { Check, X, ArrowRight, Star, Minus } from 'lucide-react';
import { DateDisplay, DateNavControls } from './DateHeader';
import ProductivityFrameworks from './ProductivityFrameworks';
import RapidLogSection from './RapidLogSection';
import ExecutionLayer from './ExecutionLayer';
import DayReport from './DayReport';
import { getSession, pauseSession, completeSession, extendSession } from '../utils/executionModel';
import { playSound } from '../utils/audio';
import { formatDateKey } from '../hooks/useJournalStorage';

/**
 * LeftPage: Productivity Frameworks, Rapid Log, Date Header, and Stamped Legend.
 * Spans exact 50% width on bi-fold desktop spread.
 */
export function LeftPage({
  date,
  dailyLog,
  activeFramework,
  onSelectFramework,
  hardTasks,
  onUpdateHardTasks,
  frameworkData,
  onUpdateFrameworkData,
  rapidLog,
  onUpdateRapidLog,
  onUpdateExecution,
  activeFilter,
  setActiveFilter,
  settings,
  updateSettings,
  isPastDay,
  onStepDay,
  setCurrentDate,
  isInteractive = true,
  className = '',
}) {
  return (
    <div className={`flex flex-col h-full w-full min-w-0 min-h-0 justify-between overflow-hidden ${className} ${!isInteractive ? 'pointer-events-none select-none' : ''}`}>
      
      {/* Top Header: Typographic Date Display (Aligns with Right Page Nav Controls) */}
      <header className="w-full h-[48px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] select-none shrink-0">
        <DateDisplay currentDate={date} />

        {/* Mobile-Only Date Navigation Controls */}
        <div className="md:hidden">
          <DateNavControls
            currentDate={date}
            setCurrentDate={setCurrentDate}
            onStepDay={onStepDay}
            isMuted={settings?.isMuted}
          />
        </div>
      </header>

      {/* Main Page Body: the method, then the time it will take. One column,
          because a leaf has one side at a time and it scrolls (P11). */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pocket-scroll">
        <ProductivityFrameworks
          activeFramework={activeFramework}
          onSelectFramework={onSelectFramework}
          hardTasks={hardTasks}
          onUpdateHardTasks={onUpdateHardTasks}
          frameworkData={frameworkData || {}}
          onUpdateFrameworkData={onUpdateFrameworkData}
          isMuted={settings?.isMuted}
          isPastDay={isPastDay}
          isFullPage={false}
        />

        {/* Timeboxes — P11: durations attach per line, on the recto, beside the
            decision. Three tasks at three hours is nine hours, and the day has
            not got nine hours; that is found out here, not on the verso. */}
        <div className="shrink-0 flex flex-col border-t border-black/[0.08] dark:border-white/[0.08] mt-3 pt-1">
          <ExecutionLayer
            dailyLog={dailyLog}
            onUpdateExecution={onUpdateExecution}
            isMuted={settings?.isMuted}
            isInteractive={isInteractive}
          />
        </div>

        {/* 1-Line Blank Space between Top 3 and Today (Exact 24px Cadence Spacer) */}
        {activeFramework === 'rule_of_3' && (
          <div className="h-[24px] shrink-0" aria-hidden="true" />
        )}

        {/* Today Stream (Rendered exclusively for Top 3 / Rule of 3) */}
        {activeFramework === 'rule_of_3' && (
          <RapidLogSection
            rapidLog={rapidLog}
            onUpdateRapidLog={onUpdateRapidLog}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            viewMode={settings?.viewMode || 'stream'}
            setViewMode={(m) => updateSettings?.({ viewMode: m })}
            isMuted={settings?.isMuted}
            isPastDay={isPastDay}
          />
        )}
      </div>

      {/* Bottom Footer: Decide One Journaling System Notation Legend (Exact 24px Baseline, Unified Swiss Typography) */}
      <footer className="shrink-0 h-[24px] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center overflow-x-auto legend-scroll text-[10px] text-neutral-500 dark:text-neutral-400 select-none whitespace-nowrap overflow-hidden px-1">
        <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.14em] shrink-0">
          <span className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors whitespace-nowrap" title="Task To Do">
            <span className="w-2 h-2 rounded-full border border-neutral-400 dark:border-neutral-500 inline-block shrink-0" />
            <span>To Do</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1 progress-ink-green hover:opacity-80 transition-opacity whitespace-nowrap" title="Completed Task">
            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Done</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1 progress-ink-red hover:opacity-80 transition-opacity whitespace-nowrap" title="Missed Task">
            <X className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Missed</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors whitespace-nowrap" title="Carried Over / Moved">
            <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Moved</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors whitespace-nowrap" title="Important Highlight">
            <Star className="w-2.5 h-2.5 fill-current stroke-[1.5]" />
            <span>Star</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors whitespace-nowrap" title="Note or Thought">
            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>Note</span>
          </span>
        </div>
      </footer>

    </div>
  );
}

/**
 * RightPage: the execution layer (R2) — how long each decided item takes, and
 * how it actually went. Habits (P2) and evening reflection (P3) were cut: both
 * were separate products sharing a spread, which is exactly what R3 forbids.
 * Spans exact 50% width on bi-fold desktop spread.
 */
export function RightPage({
  date,
  dailyLog,
  onCloseDay,
  onUpdateExecution,
  paperLabel,
  settings,
  updateSettings,
  onStepDay,
  setCurrentDate,
  isInteractive = true,
  className = '',
  onOpenVictoryCard
}) {
  return (
    <div className={`flex flex-col h-full w-full min-w-0 min-h-0 justify-between overflow-hidden ${className} ${!isInteractive ? 'pointer-events-none select-none' : ''}`}>
      
      {/* Top Header: Date Navigation Controls (Aligns with Left Page Typographic Date) */}
      <header className="w-full min-w-0 h-[48px] flex items-center justify-end border-b border-black/[0.08] dark:border-white/[0.08] select-none shrink-0 overflow-hidden">
        <DateNavControls
          currentDate={date}
          setCurrentDate={setCurrentDate}
          onStepDay={onStepDay}
          isMuted={settings?.isMuted}
        />
      </header>

      {/* Main Page Body: the execution layer for the left page's items */}
      <DayReport
        dailyLog={dailyLog}
        dateLabel={date?.toLocaleDateString(undefined, { weekday: 'long' }) || ''}
        onCloseDay={onCloseDay}
        onPause={(id) => onUpdateExecution?.(id, pauseSession(getSession(dailyLog, id)))}
        onComplete={(id) => onUpdateExecution?.(id, completeSession(getSession(dailyLog, id)))}
        onExtend={(id, sec) => onUpdateExecution?.(id, extendSession(getSession(dailyLog, id), sec))}
        isInteractive={isInteractive}
      />

      {/* Bottom Footer: Paper Edition (Exact 24px Baseline, Zero Clutter) */}
      <footer className="shrink-0 h-[24px] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 select-none whitespace-nowrap px-1 overflow-hidden">
        {/* Paper Edition Indicator */}
        <div className="flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] shrink-0">
          <button
            type="button"
            onClick={() => {
              if (!isInteractive) return;
              const next = settings?.paperStyle === 'dots' ? 'square' : settings?.paperStyle === 'square' ? 'plain' : 'dots';
              playSound('crown-ratchet', settings?.isMuted);
              updateSettings?.({ paperStyle: next });
            }}
            className="hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            title="Click to cycle paper style (Dots, Square, Plain)"
          >
            {paperLabel} • Decide One
          </button>
        </div>
      </footer>

    </div>
  );
}

/**
 * PageTurnLeaf: FlippingBook-Grade 3D Physical Turning Page Sheet.
 * Anchored to the central spine and curls 180 degrees in 3D perspective space.
 */
export function PageTurnLeaf({
  direction, // 'next' | 'prev' | 'leaf-turn-next' | 'leaf-turn-prev'
  currentDate,
  targetDate,
  currentDailyLog,
  targetDailyLog,
  currentFramework,
  targetFramework,
  onSelectFramework,
  onUpdateHardTasks,
  onUpdateFrameworkData,
  onUpdateRapidLog,
  onUpdateExecution,
  activeFilter,
  setActiveFilter,
  paperClass,
  paperLabel,
  settings,
  updateSettings,
  onStepDay,
  setCurrentDate,
  todayKey,
}) {
  const currentKey = formatDateKey(currentDate);
  const targetKey = formatDateKey(targetDate);
  const currentIsPast = currentKey < todayKey;
  const targetIsPast = targetKey < todayKey;

  if (direction === 'next' || direction === 'leaf-turn-next') {
    return (
      <>
        {/* Front Face: Outgoing Right Page (lifts from right fore-edge) */}
        <div className={`leaf-face leaf-face-front ${paperClass} bg-white dark:bg-[#141416]`}>
          <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bifold-right-page overflow-hidden">
            <RightPage
              date={currentDate}
              dailyLog={currentDailyLog}
              paperLabel={paperLabel}
              settings={settings}
              updateSettings={updateSettings}
              onStepDay={onStepDay}
              setCurrentDate={setCurrentDate}
              isInteractive={false}
            />
          </div>
        </div>

        {/* Back Face: Incoming Left Page (lands flat onto left page at -180deg) */}
        <div className={`leaf-face leaf-face-back ${paperClass} bg-white dark:bg-[#141416]`}>
          <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bifold-left-page overflow-hidden">
            <LeftPage
              date={targetDate}
              dailyLog={targetDailyLog}
              activeFramework={targetFramework}
              onSelectFramework={onSelectFramework}
              hardTasks={targetDailyLog?.hardTasks}
              onUpdateHardTasks={onUpdateHardTasks}
              frameworkData={targetDailyLog?.frameworkData || {}}
              onUpdateFrameworkData={onUpdateFrameworkData}
              rapidLog={targetDailyLog?.rapidLog}
              onUpdateRapidLog={onUpdateRapidLog}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              settings={settings}
              updateSettings={updateSettings}
              isPastDay={targetIsPast}
              onStepDay={onStepDay}
              setCurrentDate={setCurrentDate}
              isInteractive={false}
            />
          </div>
        </div>
      </>
    );
  }

  // direction === 'prev' || direction === 'leaf-turn-prev'
  return (
    <>
      {/* Front Face: Outgoing Left Page (lifts from left fore-edge) */}
      <div className={`leaf-face leaf-face-front ${paperClass} bg-white dark:bg-[#141416]`}>
        <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bifold-left-page overflow-hidden">
          <LeftPage
            date={currentDate}
            dailyLog={currentDailyLog}
            activeFramework={currentFramework}
            onSelectFramework={onSelectFramework}
            hardTasks={currentDailyLog?.hardTasks}
            onUpdateHardTasks={onUpdateHardTasks}
            frameworkData={currentDailyLog?.frameworkData || {}}
            onUpdateFrameworkData={onUpdateFrameworkData}
            rapidLog={currentDailyLog?.rapidLog}
            onUpdateRapidLog={onUpdateRapidLog}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            settings={settings}
            updateSettings={updateSettings}
            isPastDay={currentIsPast}
            onStepDay={onStepDay}
            setCurrentDate={setCurrentDate}
            isInteractive={false}
          />
        </div>
      </div>

      {/* Back Face: Incoming Right Page (lands flat onto right page at +180deg) */}
      <div className={`leaf-face leaf-face-back ${paperClass} bg-white dark:bg-[#141416]`}>
        <div className="flex-1 w-full min-w-0 min-h-0 flex flex-col bifold-right-page overflow-hidden">
          <RightPage
            date={targetDate}
            dailyLog={targetDailyLog}
            paperLabel={paperLabel}
            settings={settings}
            updateSettings={updateSettings}
            onStepDay={onStepDay}
            setCurrentDate={setCurrentDate}
            isInteractive={false}
          />
        </div>
      </div>
    </>
  );
}
