import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function HabitTracker({
  habits = [],
  completedHabits = [],
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
  isMuted = false,
  isFocusMode = false,
  isFoldMode = false
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleToggle = (habitId) => {
    const isCompleted = completedHabits.includes(habitId);
    playSound(isCompleted ? 'click' : 'check', isMuted);
    onToggleHabit(habitId);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    playSound('click', isMuted);
    onAddHabit({
      id: 'h_' + Date.now(),
      label: newLabel.trim()
    });

    setNewLabel('');
    setIsAdding(false);
  };

  const total = habits.length;
  const doneCount = completedHabits.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <section className="w-full min-w-0 flex-1 min-h-0 flex flex-col shrink-0 overflow-hidden">
      
      {/* Clear Section Partition (Exact 24px Height on Grid Line) */}
      <div className={`w-full min-w-0 h-[24px] leading-[24px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0`}>
        <div className="flex items-baseline gap-2 min-w-0 truncate">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 shrink-0">
            Habits
          </h2>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 italic hidden xs:inline truncate">
            Daily wellness & routines
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Dynamic Segmented Progress Indicator */}
          <div className="flex items-center gap-1 select-none">
            <div className="flex items-center gap-0.5">
              {habits.map((h, idx) => {
                const done = completedHabits.includes(h.id);
                return (
                  <span
                    key={h.id || idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      done ? 'progress-bg-green scale-110' : 'bg-black/[0.12] dark:bg-white/[0.15]'
                    }`}
                    title={h.label}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-semibold ml-1">
              <span className={percent < 40 ? 'progress-ink-red font-bold' : percent >= 80 ? 'progress-ink-green font-bold' : 'progress-ink-yellow font-bold'}>
                {doneCount}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500">/{total}</span>
            </span>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors no-print flex items-center gap-0.5"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Inline Form to Add Ritual */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="h-[36px] px-2.5 mb-2 rounded-xs bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.12] dark:border-white/[0.15] flex items-center gap-2 no-print animate-in fade-in">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New habit (e.g. 3-4L Water, 10k Steps)..."
            className="flex-1 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none placeholder-neutral-400"
            autoFocus
          />

          <button
            type="submit"
            className="px-2.5 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xs text-[11px] font-semibold hover:opacity-90"
          >
            Save
          </button>
        </form>
      )}

      {/* Clean Unboxed Habits List (Zero Table Boxes, Direct on Paper) */}
      <div className="flex-1 min-h-0 flex flex-col justify-start overflow-x-hidden">
        {/* Clean Open Rows directly on stationery with zero overflow */}
        <div className="flex-1 min-h-0 overflow-hidden space-y-0">
          {habits.map((habit) => {
            const isDone = completedHabits.includes(habit.id);
            return (
              <div
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                className={`group h-[24px] leading-[24px] px-1 flex items-center justify-between transition-all cursor-pointer select-none border-b border-black/[0.04] dark:border-white/[0.04] last:border-b-0 ${
                  isDone
                    ? 'opacity-40'
                    : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'progress-bg-green progress-border-green text-white'
                        : 'border-neutral-400 dark:border-neutral-500 hover:border-neutral-700 bg-transparent'
                    }`}
                  >
                    {isDone && <Check className="w-2 h-2 stroke-[3]" />}
                  </div>
                  <span className={`text-xs truncate ${isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'}`}>
                    {habit.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteHabit(habit.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-opacity no-print shrink-0"
                  title="Remove habit"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
