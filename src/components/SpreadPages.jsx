import React from 'react';
import { DateDisplay, DateNavControls } from './DateHeader';
import ProductivityFrameworks from './ProductivityFrameworks';
import ExecutionLayer from './ExecutionLayer';
import DayReport from './DayReport';
import { getSession, pauseSession, completeSession } from '../utils/executionModel';
import { playSound } from '../utils/audio';

/**
 * LeftPage is the framework and nothing else. The selected method supplies
 * every input line; a second task stream would undo the prioritisation.
 */
export function LeftPage({
  date,
  bookSpread = false,
  dailyLog,
  activeFramework,
  onSelectFramework,
  hardTasks,
  onUpdateHardTasks,
  frameworkData,
  onUpdateFrameworkData,
  onUpdateExecution,
  hasEntry,
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

        {/* On phones each visible page carries date navigation. Desktop uses the right header. */}
        <div className={bookSpread ? 'hidden' : ''}>
          <DateNavControls
            currentDate={date}
            setCurrentDate={setCurrentDate}
            onStepDay={onStepDay}
            hasEntry={hasEntry}
            isMuted={settings?.isMuted}
          />
        </div>
      </header>

      {/* Selection stays on the left; the clock moves here on phones. */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pocket-scroll">
        <ProductivityFrameworks
          activeFramework={activeFramework}
          onSelectFramework={onSelectFramework}
          hardTasks={hardTasks}
          onUpdateHardTasks={onUpdateHardTasks}
          frameworkData={frameworkData || {}}
          onUpdateFrameworkData={onUpdateFrameworkData}
          dailyLog={dailyLog}
          onUpdateExecution={onUpdateExecution}
          isMuted={settings?.isMuted}
          isPastDay={isPastDay}
          isFullPage={false}
          isInteractive={isInteractive}
        />

        {/* Phones show the same elapsed stopwatch as the desktop verso. */}
        {!bookSpread && <div className="shrink-0 flex flex-col border-t border-black/[0.08] dark:border-white/[0.08] mt-3 pt-1 [@media(max-height:760px)]:mt-1 [@media(max-height:760px)]:pt-0">
          <ExecutionLayer
            dailyLog={dailyLog}
            onUpdateExecution={onUpdateExecution}
            isMuted={settings?.isMuted}
            isInteractive={isInteractive}
          />
        </div>}

        {activeFramework !== 'eisenhower' && <div className="min-h-[36px] [@media(max-height:820px)_and_(min-height:761px)]:min-h-0 [@media(max-height:760px)]:min-h-0 flex-1" aria-hidden="true" />}
      </div>

      <footer className="instrument-page-footer">
        <span>Three Choices. One Clear Order.</span>
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
  hasEntry,
  bookSpread = false,
  dailyLog,
  onCloseDay,
  onTurnOver,
  onUpdateExecution,
  paperLabel,
  settings,
  updateSettings,
  onStepDay,
  setCurrentDate,
  isInteractive = true,
  className = ''
}) {
  return (
    <div className={`flex flex-col h-full w-full min-w-0 min-h-0 justify-between overflow-hidden ${className} ${!isInteractive ? 'pointer-events-none select-none' : ''}`}>
      
      {/* Top Header: Date Navigation Controls (Aligns with Left Page Typographic Date) */}
      <header className="w-full min-w-0 h-[48px] flex items-center justify-end border-b border-black/[0.08] dark:border-white/[0.08] select-none shrink-0 overflow-hidden">
        <DateNavControls
          currentDate={date}
          hasEntry={hasEntry}
          setCurrentDate={setCurrentDate}
          onStepDay={onStepDay}
          isMuted={settings?.isMuted}
        />
      </header>

      {bookSpread && <ExecutionLayer dailyLog={dailyLog} onUpdateExecution={onUpdateExecution} isMuted={settings?.isMuted} isInteractive={isInteractive} />}
      {/* The same report follows the single execution clock on desktop. */}
      <DayReport
        reportOnly={bookSpread}
        dailyLog={dailyLog}
        dateLabel={date?.toLocaleDateString(undefined, { weekday: 'long' }) || ''}
        onCloseDay={bookSpread ? onTurnOver : onCloseDay}
        onPause={(id) => onUpdateExecution?.(id, pauseSession(getSession(dailyLog, id)))}
        onComplete={(id) => onUpdateExecution?.(id, completeSession(getSession(dailyLog, id)))}
        isInteractive={isInteractive}
      />

      {/* Bottom Footer: Paper Edition (Exact 24px Baseline, Zero Clutter) */}
      <footer className="instrument-page-footer">
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
            {paperLabel} • DECIDE ONE
          </button>
        </div>
      </footer>

    </div>
  );
}
