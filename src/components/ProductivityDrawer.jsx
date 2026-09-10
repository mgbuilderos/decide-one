import React from 'react';
import { X, Flame, Target, CheckCircle2, TrendingUp, Compass, Award } from 'lucide-react';

export default function ProductivityDrawer({
  isOpen,
  onClose,
  dailyMetrics,
  categoryDistribution,
  streak,
  monthlyStats,
  reflection = ''
}) {
  if (!isOpen) return null;

  const { score, hardDone, hardTotal, rapidDone, rapidTotal, status, statusColor, eventsCount, notesCount, migratedCount } = dailyMetrics;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 dark:bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-neutral-900 h-full shadow-2xl p-6 overflow-y-auto border-l border-neutral-200 dark:border-neutral-800 space-y-6 animate-in slide-in-from-right duration-300"
      >
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-neutral-900 dark:text-white" />
            <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
              Productivity & Life Balance
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apple-Style Activity Score Card */}
        <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
              Daily Score
            </span>
            <div className={`text-3xl font-extrabold ${
              score < 40 
                ? 'progress-ink-red' 
                : score >= 80 
                  ? 'progress-ink-green' 
                  : 'progress-ink-yellow'
            }`}>
              {score}%
            </div>
            <div className={`text-xs mt-1 ${statusColor}`}>
              {status}
            </div>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-neutral-200 dark:text-neutral-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-700 ${
                  score < 40 
                    ? 'progress-ink-red' 
                    : score >= 80 
                      ? 'progress-ink-green' 
                      : 'progress-ink-yellow'
                }`}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className={`absolute text-xs font-bold ${
              score < 40 
                ? 'progress-ink-red' 
                : score >= 80 
                  ? 'progress-ink-green' 
                  : 'progress-ink-yellow'
            }`}>
              {score}%
            </div>
          </div>
        </div>

        {/* Streak & Consistency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl">
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Streak</span>
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </div>
            <span className="text-[10px] text-neutral-400">Consecutive logging</span>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl">
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Month Rate</span>
            </div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">
              {monthlyStats.monthlyRate}%
            </div>
            <span className="text-[10px] text-neutral-400">{monthlyStats.totalCompleted} tasks completed</span>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
            Daily Execution Metrics
          </h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
              <span className="text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-neutral-500" />
                <span>Top 3 Priorities</span>
              </span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {hardDone} / {hardTotal || 3}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
              <span className="text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>Rapid Tasks Completed</span>
              </span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {rapidDone} / {rapidTotal}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
              <span className="text-neutral-600 dark:text-neutral-300">Events & Notes Captured</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {eventsCount} events • {notesCount} notes
              </span>
            </div>

            {migratedCount > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40">
                <span className="text-neutral-600 dark:text-neutral-300">Migrated (&gt;) to next log</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {migratedCount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Life Harmony (Category Distribution) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Life Harmony & Allocation</span>
            </h3>
            <span className="text-[10px] text-neutral-400">
              {categoryDistribution.totalTasks} Total items
            </span>
          </div>

          <div className="space-y-2">
            {categoryDistribution.breakdown.length === 0 ? (
              <div className="text-xs text-neutral-400 text-center py-4">
                Log tasks with category markers to view your life balance distribution.
              </div>
            ) : (
              categoryDistribution.breakdown.map(cat => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-neutral-700 dark:text-neutral-300">
                      <span>{cat.emoji}</span>
                      <span>{cat.fullLabel}</span>
                    </span>
                    <span className="text-neutral-500">{cat.percentage}% ({cat.count})</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.textLight
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Evening Reflection Preview */}
        {reflection && (
          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
              Today's Reflection Note
            </span>
            <p className="text-xs italic text-neutral-700 dark:text-neutral-300">
              "{reflection}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
