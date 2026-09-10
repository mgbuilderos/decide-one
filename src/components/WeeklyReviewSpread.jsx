import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ArrowRight, 
  Users, 
  Archive, 
  Printer, 
  Calendar,
  Sparkles,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { getWeekDates, getISOWeekNumber, generateExecutiveWeeklyBriefingPDF } from '../utils/weeklyBriefingPDF';
import { playSound } from '../utils/audio';

export default function WeeklyReviewSpread({
  currentDate,
  setCurrentDate,
  data,
  getDailyLog,
  saveDailyLog,
  getWeeklyReview,
  saveWeeklyReview,
  habits = [],
  settings = {},
  isMuted = false,
  onBackToDaily
}) {
  const [mobileTab, setMobileTab] = useState('alignment'); // 'alignment' | 'retrospective'

  // Calculate current week dates (Mon - Sun)
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const weekNum = useMemo(() => getISOWeekNumber(weekStart.dateObj), [weekStart]);
  const year = weekStart.dateObj.getFullYear();
  const weekKey = `${year}-W${String(weekNum).padStart(2, '0')}`;

  // Current weekly review data
  const reviewData = getWeeklyReview(weekKey);

  // Step week navigation
  const handleStepWeek = (delta) => {
    playSound('page', isMuted);
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + delta * 7);
    setCurrentDate(nextDate);
  };

  const handleJumpToday = () => {
    playSound('page', isMuted);
    setCurrentDate(new Date());
  };

  // Aggregate metrics for this week
  const { 
    totalPriorities, 
    completedPriorities, 
    priorityRate,
    totalHabitChecks,
    maxHabitChecks,
    habitRate,
    compositeScore,
    pendingTasks
  } = useMemo(() => {
    let totalP = 0;
    let compP = 0;
    let habitChecks = 0;
    const uncompleted = [];

    weekDates.forEach(({ dateKey, dayName, monthDay }) => {
      const log = (data.dailyLogs && data.dailyLogs[dateKey]) || {};
      
      // Hard priorities
      const hard = log.hardTasks || [];
      hard.forEach(t => {
        if (t.text && t.text.trim()) {
          totalP++;
          if (t.completed) {
            compP++;
          } else {
            uncompleted.push({
              ...t,
              sourceDateKey: dateKey,
              sourceDayLabel: `${dayName} ${monthDay}`,
              itemType: 'hard'
            });
          }
        }
      });

      // Stream items
      const rapid = log.rapidLog || [];
      rapid.forEach(r => {
        if (r.type === 'task' || r.type === 'completed') {
          totalP++;
          if (r.type === 'completed') {
            compP++;
          } else {
            uncompleted.push({
              ...r,
              sourceDateKey: dateKey,
              sourceDayLabel: `${dayName} ${monthDay}`,
              itemType: 'stream'
            });
          }
        }
      });

      // Habits
      const compH = log.completedHabits || [];
      habitChecks += compH.length;
    });

    const maxH = Math.max(1, habits.length * 7);
    const pRate = totalP > 0 ? Math.round((compP / totalP) * 100) : 0;
    const hRate = Math.round((habitChecks / maxH) * 100);
    const compScore = totalP > 0 ? Math.round(pRate * 0.6 + hRate * 0.4) : hRate;

    return {
      totalPriorities: totalP,
      completedPriorities: compP,
      priorityRate: pRate,
      totalHabitChecks: habitChecks,
      maxHabitChecks: maxH,
      habitRate: hRate,
      compositeScore: compScore,
      pendingTasks: uncompleted
    };
  }, [weekDates, data.dailyLogs, habits.length]);

  // Review fields update handlers
  const handleUpdateVictory = (index, value) => {
    const currentVictories = [...(reviewData.victories || ['', '', ''])];
    currentVictories[index] = value;
    saveWeeklyReview(weekKey, { victories: currentVictories });
  };

  const handleUpdateBottleneck = (value) => {
    saveWeeklyReview(weekKey, { bottleneck: value });
  };

  const handleUpdateNonNegotiable = (index, value) => {
    const currentList = [...(reviewData.nonNegotiables || ['', '', ''])];
    currentList[index] = value;
    saveWeeklyReview(weekKey, { nonNegotiables: currentList });
  };

  // Triage actions for carryover tasks
  const handleTriageAction = (task, action) => {
    playSound('check', isMuted);
    const triaged = { ...(reviewData.triagedTasks || {}) };
    triaged[task.id] = action;
    saveWeeklyReview(weekKey, { triagedTasks: triaged });

    // If migrating to next Monday:
    if (action === 'migrate') {
      // Find next Monday dateKey
      const nextMon = new Date(weekEnd.dateObj);
      nextMon.setDate(nextMon.getDate() + 1);
      const y = nextMon.getFullYear();
      const m = String(nextMon.getMonth() + 1).padStart(2, '0');
      const d = String(nextMon.getDate()).padStart(2, '0');
      const targetDateKey = `${y}-${m}-${d}`;

      const targetLog = (data.dailyLogs && data.dailyLogs[targetDateKey]) || {
        dateString: targetDateKey,
        completedHabits: [],
        hardTasks: [],
        rapidLog: [],
        reflection: ''
      };

      const existingRapid = targetLog.rapidLog || [];
      const isAlreadyAdded = existingRapid.some(item => item.text === task.text);
      if (!isAlreadyAdded) {
        saveDailyLog(targetDateKey, {
          rapidLog: [
            ...existingRapid,
            {
              id: `mig_${Date.now()}`,
              type: 'task',
              text: task.text,
              category: task.category || 'professional',
              timestamp: '09:00'
            }
          ]
        });
      }
    }
  };

  // PDF Export Trigger
  const handleExportPDF = async () => {
    playSound('click', isMuted);
    try {
      await generateExecutiveWeeklyBriefingPDF({
        startDate: weekStart.dateObj,
        data,
        settings,
        habits,
        pageSize: 'a4'
      });
    } catch (e) {
      console.error('Failed to generate weekly PDF', e);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100">
      
      {/* Top Header Strip: Week Navigation & Actions */}
      <div className="h-10 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between px-1 mb-2 shrink-0 no-print">
        {/* Week Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => handleStepWeek(-1)}
              className="p-1 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleStepWeek(1)}
              className="p-1 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Week {weekNum}
            </span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline">
              {weekStart.monthDay} – {weekEnd.monthDay}, {year}
            </span>
          </div>

          <button
            onClick={handleJumpToday}
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer ml-1"
          >
            Today
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            title="Export 2-Page Executive Weekly Briefing PDF"
          >
            <Printer className="w-3 h-3" />
            <span className="hidden sm:inline">Briefing PDF</span>
          </button>

          <button
            onClick={() => {
              playSound('page', isMuted);
              onBackToDaily?.();
            }}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
          >
            Back to Today
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (< md screens) */}
      <div className="md:hidden flex items-center justify-between h-[28px] border-b border-black/[0.08] dark:border-white/[0.08] mb-2 shrink-0 no-print">
        <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full w-full text-xs">
          <button
            onClick={() => setMobileTab('alignment')}
            className={`flex-1 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              mobileTab === 'alignment'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Alignment & Compounding
          </button>
          <button
            onClick={() => setMobileTab('retrospective')}
            className={`flex-1 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
              mobileTab === 'retrospective'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            Strategic Retrospective
          </button>
        </div>
      </div>

      {/* Two-Fold Spread Stage (Bi-Fold on Desktop, Tabbed on Mobile) */}
      <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row gap-0 overflow-hidden">
        
        {/* Left Page: Weekly Alignment, Habits & Carryover Triage */}
        <div className={`flex-1 min-w-0 min-h-0 flex flex-col md:pr-6 md:border-r border-black/[0.08] dark:border-white/[0.08] overflow-y-auto pocket-scroll ${
          mobileTab === 'alignment' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Executive KPI Bar */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] mb-3 shrink-0">
            <div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500">
                Throughput
              </div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                {completedPriorities} / {totalPriorities}
              </div>
              <div className="text-[10px] text-neutral-500">
                {priorityRate}% Completed
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500">
                Habit Compounding
              </div>
              <div className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                {totalHabitChecks} / {maxHabitChecks}
              </div>
              <div className="text-[10px] text-neutral-500">
                {habitRate}% Consistency
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500">
                Focus Quotient
              </div>
              <div className={`text-sm font-bold mt-0.5 ${
                compositeScore >= 80 
                  ? 'progress-ink-green' 
                  : compositeScore >= 40 
                    ? 'progress-ink-yellow' 
                    : 'progress-ink-red'
              }`}>
                {compositeScore}%
              </div>
              <div className="text-[10px] text-neutral-500">
                {compositeScore >= 80 ? 'Peak Flow' : compositeScore >= 40 ? 'Steady Cadence' : 'Restoration'}
              </div>
            </div>
          </div>

          {/* 7-Day Compounding Habit Heatmap */}
          <div className="mb-3 shrink-0">
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                7-Day Compounding Matrix
              </span>
              <span className="text-[10px] text-neutral-400">
                {habits.length} Monitored
              </span>
            </div>

            <div className="border border-black/[0.08] dark:border-white/[0.08] rounded-xl overflow-hidden bg-white/50 dark:bg-black/20">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
                    <th className="py-1 px-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Habit</th>
                    {weekDates.map(d => (
                      <th key={d.dateKey} className="py-1 px-1 text-center text-[10px] font-bold text-neutral-500">
                        {d.dayName.slice(0, 2)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                  {habits.slice(0, 5).map(h => (
                    <tr key={h.id} className="h-6">
                      <td className="py-0.5 px-2 text-xs truncate font-medium text-neutral-700 dark:text-neutral-300 max-w-[110px]">
                        <span className="mr-1">{h.emoji || '•'}</span>
                        <span>{h.label}</span>
                      </td>
                      {weekDates.map(d => {
                        const log = (data.dailyLogs && data.dailyLogs[d.dateKey]) || {};
                        const done = (log.completedHabits || []).includes(h.id);
                        return (
                          <td key={d.dateKey} className="py-0.5 px-1 text-center">
                            <span className={`inline-block w-3.5 h-3.5 rounded-full transition-all ${
                              done 
                                ? 'bg-neutral-900 dark:bg-white shadow-2xs' 
                                : 'border border-black/15 dark:border-white/15'
                            }`} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Carryover Triage */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-1.5 px-0.5 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                Carryover Triage ({pendingTasks.length})
              </span>
              <span className="text-[10px] text-neutral-400">
                Uncompleted from Mon–Sun
              </span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="p-3 text-center rounded-xl bg-black/[0.01] dark:bg-white/[0.02] border border-dashed border-black/10 dark:border-white/10 text-neutral-400 text-xs italic">
                Zero carryover tasks. Every strategic commitment of the week was completed.
              </div>
            ) : (
              <div className="space-y-1.5 overflow-y-auto pocket-scroll pr-1 flex-1 min-h-0">
                {pendingTasks.map(task => {
                  const currentAction = reviewData.triagedTasks ? reviewData.triagedTasks[task.id] : null;
                  return (
                    <div 
                      key={task.id} 
                      className={`p-2 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                        currentAction
                          ? 'bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.04] opacity-70'
                          : 'bg-white dark:bg-neutral-900/60 border-black/[0.08] dark:border-white/[0.08] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`leading-tight font-medium ${currentAction ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}`}>
                          {task.text}
                        </span>
                        <span className="text-[9px] font-bold uppercase text-neutral-400 shrink-0">
                          {task.sourceDayLabel}
                        </span>
                      </div>

                      {/* 1-Click Triage Action Buttons */}
                      <div className="flex items-center gap-1.5 self-end">
                        <button
                          type="button"
                          onClick={() => handleTriageAction(task, 'migrate')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            currentAction === 'migrate'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'border border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                          title="Migrate to next Monday's daily log"
                        >
                          <ArrowRight className="w-2.5 h-2.5" />
                          <span>Migrate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTriageAction(task, 'delegate')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            currentAction === 'delegate'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'border border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                          title="Delegate to team lead or colleague"
                        >
                          <Users className="w-2.5 h-2.5" />
                          <span>Delegate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTriageAction(task, 'drop')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            currentAction === 'drop'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'border border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                          }`}
                          title="Drop task cleanly without guilt"
                        >
                          <Archive className="w-2.5 h-2.5" />
                          <span>Drop</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Page: Strategic Retrospective & Next Week Horizon */}
        <div className={`flex-1 min-w-0 min-h-0 flex flex-col md:pl-6 overflow-y-auto pocket-scroll ${
          mobileTab === 'retrospective' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Section 1: The 3 Strategic Victories */}
          <div className="mb-4 shrink-0">
            <div className="flex items-center gap-1.5 mb-2 px-0.5">
              <Trophy className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                3 Strategic Victories
              </span>
            </div>

            <div className="space-y-1.5">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-4 text-center text-xs font-bold text-neutral-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={(reviewData.victories && reviewData.victories[idx]) || ''}
                    onChange={(e) => handleUpdateVictory(idx, e.target.value)}
                    placeholder={
                      idx === 0 ? 'Major commercial or product release completed...' :
                      idx === 1 ? 'High-stakes architectural breakthrough achieved...' :
                      'Personal health, focus, or relationship win...'
                    }
                    className="flex-1 px-2.5 py-1.5 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] focus:border-neutral-900 dark:focus:border-white focus:outline-hidden transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Core Bottleneck & Friction Point */}
          <div className="mb-4 shrink-0">
            <div className="flex items-center gap-1.5 mb-2 px-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                Core Bottleneck & Friction Point
              </span>
            </div>

            <textarea
              rows={2}
              value={reviewData.bottleneck || ''}
              onChange={(e) => handleUpdateBottleneck(e.target.value)}
              placeholder="What created avoidable cognitive drain or delayed progress this week? What structural change solves this permanently?"
              className="w-full px-2.5 py-2 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] focus:border-neutral-900 dark:focus:border-white focus:outline-hidden transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Section 3: Next Week's 3 Non-Negotiables */}
          <div className="flex-1 min-h-0 flex flex-col mb-3">
            <div className="flex items-center gap-1.5 mb-2 px-0.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                Next Week's 3 Non-Negotiables
              </span>
            </div>

            <div className="space-y-1.5 flex-1 min-h-0">
              {[0, 1, 2].map(idx => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-4 text-center text-xs font-bold text-neutral-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={(reviewData.nonNegotiables && reviewData.nonNegotiables[idx]) || ''}
                    onChange={(e) => handleUpdateNonNegotiable(idx, e.target.value)}
                    placeholder={
                      idx === 0 ? 'Keystone priority for next week...' :
                      idx === 1 ? 'High-leverage deliverable...' :
                      'Critical health or family commitment...'
                    }
                    className="flex-1 px-2.5 py-1.5 rounded-xl text-xs bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] focus:border-neutral-900 dark:focus:border-white focus:outline-hidden transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Executive Seal Footer */}
          <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
            <span>Executive Retrospective Seal</span>
            <span>100% On-Device Audit</span>
          </div>

        </div>

      </div>

    </div>
  );
}
