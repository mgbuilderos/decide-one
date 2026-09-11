import React, { useRef } from 'react';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, detectCategoryFromText } from '../types/journal';
import { playSound } from '../utils/audio';
import { telemetry } from '../utils/telemetry';

export default function Top3HardTasks({
  hardTasks = [],
  onUpdateHardTasks,
  isMuted = false,
  isFocusMode = false,
  isPastDay = false
}) {
  const slotLabels = [
    { num: '01', label: 'FIRST', title: 'First (Nothing Shares First)' },
    { num: '02', label: 'STRATEGIC', title: 'Strategic Core (Deep Focus Pillar)' },
    { num: '03', label: 'ANCHOR', title: 'Essential Anchor (Operational Lock)' }
  ];

  // Cognitive Hesitation & First Keypress Latency (FKL) Tracker
  const focusTimeRef = useRef({});
  const hasTypedRef = useRef({});

  const handleInputFocus = (idx) => {
    focusTimeRef.current[idx] = Date.now();
    hasTypedRef.current[idx] = false;
  };

  const handleInputKeyDown = (idx) => {
    if (!hasTypedRef.current[idx]) {
      const startTime = focusTimeRef.current[idx];
      if (startTime) {
        const latency = Date.now() - startTime;
        telemetry.recordHesitation(`top3_slot_${idx + 1}`, latency);
      }
      hasTypedRef.current[idx] = true;
    }
  };

  const handleInputBlur = (idx, currentVal) => {
    if (!hasTypedRef.current[idx] && (!currentVal || !currentVal.trim())) {
      telemetry.recordHesitation(`top3_slot_${idx + 1}`, 0, true);
    }
  };

  const handleToggle = (index) => {
    const updated = [...hardTasks];
    const task = { ...updated[index] };
    const nextCompleted = !task.completed;
    task.completed = nextCompleted;
    updated[index] = task;

    playSound(nextCompleted ? 'check' : 'click', isMuted);
    onUpdateHardTasks(updated);

    const allDone = updated.every(t => t.text && t.text.trim() !== '' && t.completed);
    if (allDone && nextCompleted) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#16A34A', '#D97706', '#000000', '#FFFFFF']
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleTextChange = (index, newText) => {
    const updated = [...hardTasks];
    const task = { ...updated[index], text: newText };

    const detected = detectCategoryFromText(newText);
    if (detected && (!task.category || task.category === 'personal')) {
      task.category = detected;
    }

    updated[index] = task;
    onUpdateHardTasks(updated);
  };

  const categoryKeys = Object.keys(CATEGORIES);
  const handleCycleCategory = (index) => {
    playSound('click', isMuted);
    const updated = [...hardTasks];
    const task = updated[index] || { text: '', completed: false, category: 'personal' };
    const currentIndex = categoryKeys.findIndex(k => CATEGORIES[k].id === task.category);
    const nextIndex = (currentIndex + 1) % categoryKeys.length;
    task.category = CATEGORIES[categoryKeys[nextIndex]].id;
    updated[index] = task;
    onUpdateHardTasks(updated);
  };

  const completedCount = hardTasks.filter(t => t.text && t.text.trim() && t.completed).length;

  return (
    <section className={isFocusMode ? "flex-1 min-h-0 flex flex-col shrink-0" : "shrink-0 flex flex-col mb-3 pb-2 border-b border-black/[0.08] dark:border-white/[0.08]"}>
      
      {/* Clear Section Partition (Exact 24px Height on Grid Line) */}
      <div className={`h-[24px] leading-[24px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 ${isFocusMode ? 'mb-[24px]' : 'mb-1.5'}`}>
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <span>Decide One Priorities</span>
            {hardTasks[0]?.completed && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                Decide One Secured
              </span>
            )}
          </h2>
        </div>

        {/* 3-Color Dynamic Progress Indicator: Red -> Yellow -> Green */}
        <div className="text-[10px] font-semibold select-none tabular-nums">
          <span className={`font-bold ${
            completedCount === 0 
              ? 'progress-ink-red' 
              : completedCount === 3 
                ? 'progress-ink-green' 
                : 'progress-ink-yellow'
          }`}>
            {completedCount}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">/3 done</span>
        </div>
      </div>

      {/* 3 Priority Boxes (Exact 48px Height, Exact 24px Gap, Crisp Grid-Aligned Borders) */}
      <div className={isFocusMode ? "space-y-[24px]" : "space-y-0"}>
        {[0, 1, 2].map((idx) => {
          const task = hardTasks[idx] || { text: '', completed: false, category: 'personal' };
          const meta = slotLabels[idx];
          const currentCat = Object.values(CATEGORIES).find(c => c.id === task.category) || CATEGORIES.PERSONAL;
          // A date is not a verdict. An unfinished task on a past day is unfinished;
          // it is not failed, and the product does not decide otherwise on the
          // person's behalf. Red is reserved for a mark the person made themselves.
          const isMissed = task.status === 'missed';

          return (
            <div
              key={idx}
              className={`group flex items-center gap-2.5 transition-all ${
                isFocusMode
                  ? `h-[48px] px-3 border border-black/[0.12] dark:border-white/[0.15] bg-black/[0.015] dark:bg-white/[0.02] rounded-xs ${task.completed ? 'opacity-80' : 'hover:border-black/30 dark:hover:border-white/30'}`
                  : `h-[24px] leading-[24px] px-1 -mx-1 ${task.completed ? 'opacity-80' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'}`
              }`}
              title={task.text || ''}
            >
              {/* Slot Index */}
              <span className={`font-bold select-none tabular-nums ${
                isMissed ? 'progress-ink-red' : 'text-neutral-600 dark:text-neutral-400'
              } ${
                isFocusMode ? 'text-xs w-5' : 'text-[10px] w-3.5'
              }`}>
                {meta.num}
              </span>

              {/* 3-Color Adaptive Checkbox with Spring Pop */}
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className={`rounded-full border transition-all active:scale-90 flex items-center justify-center shrink-0 cursor-pointer ${
                  isFocusMode ? 'w-4 h-4' : 'w-3.5 h-3.5'
                } ${
                  task.completed
                    ? 'progress-bg-green progress-border-green text-white'
                    : isMissed
                      ? 'progress-border-red progress-ink-red'
                      : 'border-neutral-500 dark:border-neutral-400 hover:border-neutral-700 bg-transparent'
                }`}
              >
                {task.completed ? (
                  <Check className={`${isFocusMode ? 'w-2.5 h-2.5' : 'w-2 h-2'} stroke-[3]`} />
                ) : isMissed ? (
                  <span className="text-[9px] font-black leading-none">✕</span>
                ) : null}
              </button>

              {/* Text Input strictly aligned to grid row with truncation grace */}
              <div className="flex-1 min-w-0 h-full flex items-center" title={task.text || ''}>
                <input
                  type="text"
                  value={task.text || ''}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                  onFocus={() => handleInputFocus(idx)}
                  onKeyDown={() => handleInputKeyDown(idx)}
                  onBlur={(e) => handleInputBlur(idx, e.target.value)}
                  placeholder={`Priority: ${meta.title}`}
                  className={`w-full bg-transparent font-normal focus:outline-none transition-all truncate focus:truncate-none placeholder-neutral-400/40 ${
                    isFocusMode ? 'text-sm h-[48px] leading-[48px]' : 'text-xs sm:text-[13px] h-[24px] leading-[24px]'
                  } ${
                    task.completed 
                      ? 'line-through strikethrough-anim text-neutral-400 dark:text-neutral-500' 
                      : isMissed 
                        ? 'progress-ink-red' 
                        : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                />
              </div>

              {/* Category Tag */}
              <button
                type="button"
                onClick={() => handleCycleCategory(idx)}
                title={`Category: ${currentCat.label} (Click to change)`}
                className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-1.5 py-0.5 rounded transition-colors select-none shrink-0 cursor-pointer"
              >
                #{currentCat.label.toLowerCase()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Focus Mode Editorial Balancing: Focus Protocol & Execution Guidance (Eliminates Barren Void) */}
      {isFocusMode && (
        <div className="mt-[24px] pt-[24px] border-t border-black/[0.08] dark:border-white/[0.08] flex-1 flex flex-col justify-between">
          
          {/* Executive Wisdom & Focus Principle */}
          <div className="border border-black/[0.10] dark:border-white/[0.12] rounded-xs p-3.5 bg-black/[0.015] dark:bg-white/[0.02]">
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                The Focus Protocol
              </span>
              <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                {completedCount === 3 ? '3/3 Conquered ★' : `${3 - completedCount} remaining`}
              </span>
            </div>
            
            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
              "Focus is not about doing everything; it is the quiet courage of eliminating the non-essential. If you accomplish only these three priorities today, your day has been an unreserved triumph."
            </p>
          </div>

          {/* Strategic Execution Principles */}
          <div className="border border-black/[0.10] dark:border-white/[0.12] rounded-xs p-3.5 bg-black/[0.015] dark:bg-white/[0.02] mt-[24px]">
            <div className="flex items-center justify-between pb-1 mb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Execution Clarity
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                Peak Energy Window
              </span>
            </div>
            
            <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-400 shrink-0 select-none">•</span>
                <span>Tackle Priority 01 before checking messages or inbound demands.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-400 shrink-0 select-none">•</span>
                <span>Clear cognitive clutter: close extraneous browser tabs and silence notifications.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-neutral-400 shrink-0 select-none">•</span>
                <span>Define the single immediate next action for each priority above.</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}
