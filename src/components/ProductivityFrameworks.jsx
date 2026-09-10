import React, { useState } from 'react';
import { Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, detectCategoryFromText } from '../types/journal';
import { playSound } from '../utils/audio';

export const FRAMEWORKS = [
  // Cluster 1: Focus & Prioritization
  {
    id: 'rule_of_3',
    cluster: 'Focus',
    name: 'Top 3',
    subtitle: 'Your 3 most important tasks',
    description: 'Focus exclusively on the 3 highest-leverage outcomes for today.',
    bestFor: 'Daily high-impact clarity without overwhelm'
  },
  {
    id: 'ivy_lee',
    cluster: 'Focus',
    name: 'Ivy Lee Method',
    subtitle: '6 sequential priorities',
    description: 'Execute 6 prioritized tasks strictly one at a time in numerical order.',
    bestFor: 'Eliminating context-switching and procrastination'
  },

  // Cluster 2: Decision
  {
    id: 'eisenhower',
    cluster: 'Decision',
    // M-A3 — the popular name is a misattribution. Eisenhower quoted the
    // distinction in 1954; Covey built the matrix in 1989. The id stays
    // `eisenhower` so stored days keep loading; only the label changes.
    name: 'The Urgent/Important Matrix',
    subtitle: 'Four quadrants, decided by two questions',
    description: 'Answer whether a task is urgent and whether it matters; the quadrant follows.',
    bestFor: 'Separating urgent noise from work that actually matters'
  }
];

export default function ProductivityFrameworks({
  activeFramework = 'rule_of_3',
  onSelectFramework,
  hardTasks = [],
  onUpdateHardTasks,
  frameworkData = {},
  onUpdateFrameworkData,
  isMuted = false,
  isPastDay = false,
  isFullPage = false
}) {
  // Trigger celebration
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#D97706', '#000000', '#FFFFFF']
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Safe accessor for current framework data
  const currentFwData = frameworkData[activeFramework] || {};

  const updateActiveData = (newData) => {
    onUpdateFrameworkData({
      ...frameworkData,
      [activeFramework]: newData
    });
  };

  // --- 1. RULE OF 3 HANDLERS ---
  const slotLabels = [
    { num: '01', title: 'Needle Mover', placeholder: 'Priority 1: Highest-leverage outcome...' },
    { num: '02', title: 'Strategic Core', placeholder: 'Priority 2: Strategic focus goal...' },
    { num: '03', title: 'Essential Anchor', placeholder: 'Priority 3: Essential anchor task...' }
  ];

  const handleToggleHardTask = (index) => {
    const updated = [...hardTasks];
    const task = { ...updated[index] };
    const nextCompleted = !task.completed;
    task.completed = nextCompleted;
    updated[index] = task;

    playSound(nextCompleted ? 'check' : 'click', isMuted);
    onUpdateHardTasks(updated);

    const allDone = updated.every(t => t.text && t.text.trim() !== '' && t.completed);
    if (allDone && nextCompleted) triggerCelebration();
  };

  const handleHardTaskTextChange = (index, newText) => {
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

  // --- 2. EISENHOWER HANDLERS (Multi-Task Array per Quadrant) ---
  const rawQuadrants = currentFwData.quadrants || {};
  const normalizeQuadList = (q, defaultId) => {
    if (!q) return [{ id: defaultId, text: '', completed: false }];
    if (Array.isArray(q)) return q.length > 0 ? q : [{ id: defaultId, text: '', completed: false }];
    return [{ id: defaultId, text: q.text || '', completed: !!q.completed }];
  };

  const eData = {
    q1: normalizeQuadList(rawQuadrants.q1, 'q1_1'),
    q2: normalizeQuadList(rawQuadrants.q2, 'q2_1'),
    q3: normalizeQuadList(rawQuadrants.q3, 'q3_1'),
    q4: normalizeQuadList(rawQuadrants.q4, 'q4_1')
  };

  const handleToggleEisenhower = (qKey, idx) => {
    const list = [...eData[qKey]];
    list[idx] = { ...list[idx], completed: !list[idx].completed };
    playSound(list[idx].completed ? 'check' : 'click', isMuted);
    const updated = { ...eData, [qKey]: list };
    updateActiveData({ quadrants: updated });

    const allTasks = Object.values(updated).flat().filter(t => t.text.trim() !== '');
    if (list[idx].completed && allTasks.length > 0 && allTasks.every(t => t.completed)) {
      triggerCelebration();
    }
  };

  const handleTextEisenhower = (qKey, idx, text) => {
    const list = [...eData[qKey]];
    list[idx] = { ...list[idx], text };
    updateActiveData({ quadrants: { ...eData, [qKey]: list } });
  };

  /**
   * P9 — classification is required before writing.
   *
   * Eisenhower asks two questions — is it urgent, does it matter — and the
   * quadrant *falls out* of the answers. Choosing a box directly skips the only
   * judgment the matrix exists to force, which turns the method into four
   * labelled lists. So the instrument asks, and places the result: it decides
   * the form, never the content (P10).
   */
  const [classifier, setClassifier] = useState(null);

  const QUADRANT_FOR = {
    'true|true': 'q1',    // urgent and important  -> do first
    'false|true': 'q2',   // important, not urgent -> schedule
    'true|false': 'q3',   // urgent, not important -> delegate
    'false|false': 'q4'   // neither               -> eliminate
  };

  const classifyAndAdd = (urgent, important) => {
    const qKey = QUADRANT_FOR[`${urgent}|${important}`];
    const list = [...(eData[qKey] || [])];
    if (list.length >= 4) return;
    list.push({ id: `${qKey}_${Date.now()}`, text: '', completed: false });
    playSound('check', isMuted);
    updateActiveData({ quadrants: { ...eData, [qKey]: list } });
  };

  const handleAddTaskEisenhower = (qKey) => {
    const list = [...eData[qKey]];
    if (list.length >= 4) return;
    list.push({ id: `${qKey}_${Date.now()}`, text: '', completed: false });
    playSound('click', isMuted);
    updateActiveData({ quadrants: { ...eData, [qKey]: list } });
  };

  const handleDeleteTaskEisenhower = (qKey, idx) => {
    const list = [...eData[qKey]];
    if (list.length <= 1) {
      list[0] = { ...list[0], text: '', completed: false };
    } else {
      list.splice(idx, 1);
    }
    updateActiveData({ quadrants: { ...eData, [qKey]: list } });
  };

  // --- 3. IVY LEE HANDLERS ---
  const defaultIvy = [
    { id: 'il_1', text: '', completed: false },
    { id: 'il_2', text: '', completed: false },
    { id: 'il_3', text: '', completed: false },
    { id: 'il_4', text: '', completed: false },
    { id: 'il_5', text: '', completed: false },
    { id: 'il_6', text: '', completed: false }
  ];
  const ivyTasks = currentFwData.tasks || defaultIvy;

  const handleToggleIvy = (idx) => {
    const list = [...ivyTasks];
    list[idx] = { ...list[idx], completed: !list[idx].completed };
    playSound(list[idx].completed ? 'check' : 'click', isMuted);
    updateActiveData({ tasks: list });

    const activeList = list.filter(t => t.text.trim() !== '');
    if (list[idx].completed && activeList.length > 0 && activeList.every(t => t.completed)) {
      triggerCelebration();
    }
  };

  const handleTextIvy = (idx, text) => {
    const list = [...ivyTasks];
    list[idx] = { ...list[idx], text };
    updateActiveData({ tasks: list });
  };

  // --- DYNAMIC PROGRESS COMPUTATION ---
  let totalTasks = 1;
  let doneCount = 0;

  if (activeFramework === 'rule_of_3') {
    totalTasks = 3;
    doneCount = hardTasks.filter(t => t.text && t.text.trim() && t.completed).length;
  } else if (activeFramework === 'eisenhower') {
    const all = Object.values(eData).flat().filter(t => t && t.text && t.text.trim());
    totalTasks = Math.max(all.length, 1);
    doneCount = all.filter(t => t.completed).length;
  } else if (activeFramework === 'ivy_lee') {
    const all = ivyTasks.filter(t => t && t.text && t.text.trim());
    totalTasks = Math.max(all.length, 1);
    doneCount = all.filter(t => t.completed).length;
  }

  const currentMeta = FRAMEWORKS.find(f => f.id === activeFramework) || FRAMEWORKS[0];

  const handleCycleFramework = () => {
    playSound('click', isMuted);
    const idx = FRAMEWORKS.findIndex(f => f.id === activeFramework);
    const nextIdx = (idx + 1) % FRAMEWORKS.length;
    onSelectFramework(FRAMEWORKS[nextIdx].id);
  };

  return (
    <section className={`flex flex-col ${isFullPage ? 'flex-1 min-h-0' : 'shrink-0 border-b border-black/[0.08] dark:border-white/[0.08]'}`}>
      
      {/* Universal 24px Grid Cadence Header Bar */}
      <div className="h-[24px] leading-[24px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            {currentMeta.name}
          </h2>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 italic hidden xs:inline">
            {currentMeta.subtitle}
          </span>
        </div>

        {/* Right Switcher & Progress */}
        <div className="flex items-center gap-2 select-none no-print">
          <button
            type="button"
            onClick={handleCycleFramework}
            className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-1.5 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] transition-colors cursor-pointer"
            title="Switch method"
          >
            Switch ▾
          </button>

          <div className="text-[10px] font-semibold">
            <span className={`font-bold ${
              doneCount === 0 
                ? 'progress-ink-red' 
                : doneCount === totalTasks 
                  ? 'progress-ink-green' 
                  : 'progress-ink-yellow'
            }`}>
              {doneCount}
            </span>
            <span className="text-neutral-400 dark:text-neutral-500">/{totalTasks} done</span>
          </div>
        </div>
      </div>

      {/* --- RENDER 1: RULE OF 3 --- */}
      {activeFramework === 'rule_of_3' && (
        <div className="space-y-0">
          {[0, 1, 2].map((idx) => {
            const task = hardTasks[idx] || { text: '', completed: false, category: 'personal' };
            const meta = slotLabels[idx];
            const currentCat = Object.values(CATEGORIES).find(c => c.id === task.category) || CATEGORIES.PERSONAL;
            const isMissed = !task.completed && isPastDay && task.text && task.text.trim() !== '';

            return (
              <div
                key={idx}
                className={`group flex items-center gap-2.5 transition-all h-[24px] leading-[24px] px-1 -mx-1 ${
                  task.completed ? 'opacity-40' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                <span className={`font-bold select-none text-[10px] w-3.5 ${
                  isMissed ? 'progress-ink-red' : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {meta.num}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleHardTask(idx)}
                  className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    task.completed
                      ? 'progress-bg-green progress-border-green text-white'
                      : isMissed
                        ? 'progress-border-red progress-ink-red'
                        : 'border-neutral-400 dark:border-neutral-500 hover:border-neutral-700 bg-transparent'
                  }`}
                >
                  {task.completed ? (
                    <Check className="w-2 h-2 stroke-[3]" />
                  ) : isMissed ? (
                    <span className="text-[9px] font-black leading-none">✕</span>
                  ) : null}
                </button>

                <div className="flex-1 min-w-0 h-full flex items-center">
                  <input
                    type="text"
                    value={task.text || ''}
                    onChange={(e) => handleHardTaskTextChange(idx, e.target.value)}
                    placeholder={meta.placeholder || `Priority ${idx + 1}...`}
                    className={`w-full bg-transparent font-normal focus:outline-none transition-all placeholder-neutral-400/40 text-xs sm:text-[13px] h-[24px] leading-[24px] ${
                      task.completed 
                        ? 'line-through text-neutral-400 dark:text-neutral-500' 
                        : isMissed 
                          ? 'progress-ink-red' 
                          : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleCycleCategory(idx)}
                  title={`Category: ${currentCat.label} (Click to cycle)`}
                  className="text-[10px] font-semibold text-neutral-400 hover:text-neutral-900 dark:hover:text-white px-1.5 py-0.5 rounded transition-colors select-none shrink-0 cursor-pointer"
                >
                  #{currentCat.label.toLowerCase()}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* --- RENDER 2: EISENHOWER MATRIX (Unboxed Symmetrical Quadrants with Multi-Task Support) --- */}
      {activeFramework === 'eisenhower' && (
        <div className="shrink-0 pt-1">
          {classifier === null ? (
            <button
              type="button"
              onClick={() => { playSound('click', isMuted); setClassifier({}); }}
              className="w-full h-[28px] rounded-lg border border-dashed border-black/[0.14] dark:border-white/[0.16] text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-black/25 dark:hover:border-white/30 transition-colors cursor-pointer"
            >
              + Add a task
            </button>
          ) : (
            <div className="h-[28px] flex items-center justify-between gap-3 px-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.06]">
              <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                {classifier.urgent === undefined ? 'Is it urgent?' : 'Does it actually matter?'}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {[['Yes', true], ['No', false]].map(([label, value]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (classifier.urgent === undefined) {
                        playSound('click', isMuted);
                        setClassifier({ urgent: value });
                      } else {
                        classifyAndAdd(classifier.urgent, value);
                        setClassifier(null);
                      }
                    }}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-white dark:bg-[#141416] border border-black/[0.1] dark:border-white/[0.14] hover:border-black/30 dark:hover:border-white/35 transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setClassifier(null)}
                  className="text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 px-1 cursor-pointer"
                  title="Cancel"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeFramework === 'eisenhower' && (
        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 pt-1">
          {[
            { key: 'q1', title: '01. DO FIRST', tag: 'Urgent' },
            { key: 'q2', title: '02. SCHEDULE', tag: 'Plan' },
            { key: 'q3', title: '03. DELEGATE', tag: 'Offload' },
            { key: 'q4', title: '04. ELIMINATE', tag: 'Drop' }
          ].map((quad) => {
            const tasks = eData[quad.key] || [];

            return (
              <div key={quad.key} className="flex flex-col min-h-0">
                {/* Quadrant Header: Exact 28px height, whitespace-nowrap guarantees 100% horizontal alignment */}
                <div className="flex items-center justify-between h-[28px] pb-1 mb-1 border-b border-black/[0.08] dark:border-white/[0.08] select-none">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                    {quad.title}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium whitespace-nowrap">
                      {quad.tag}
                    </span>
                    <span
                      className="text-[9px] text-neutral-300 dark:text-neutral-600 font-semibold tabular-nums"
                      title="Tasks arrive here by being classified, not by choosing this box"
                    >
                      {tasks.filter(t => t.text && t.text.trim()).length}
                    </span>
                  </div>
                </div>

                {/* Quadrant Tasks List */}
                <div className="space-y-0.5 flex-1 min-h-0 overflow-hidden">
                  {tasks.map((item, idx) => {
                    const isDone = item.completed;
                    return (
                      <div
                        key={item.id || idx}
                        className="flex items-center gap-2 h-[28px] px-1 -mx-1 rounded-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors group"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleEisenhower(quad.key, idx)}
                          className={`w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                            isDone
                              ? 'progress-bg-green progress-border-green text-white'
                              : 'border-neutral-400 dark:border-neutral-500 hover:border-neutral-700 bg-transparent'
                          }`}
                        >
                          {isDone && <Check className="w-2 h-2 stroke-[3]" />}
                        </button>

                        <input
                          type="text"
                          value={item.text || ''}
                          onChange={(e) => handleTextEisenhower(quad.key, idx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              // Not another line in this box: the next task gets
                              // classified like the first one did (P9).
                              setClassifier({});
                            } else if (e.key === 'Backspace' && item.text === '' && tasks.length > 1) {
                              e.preventDefault();
                              handleDeleteTaskEisenhower(quad.key, idx);
                            }
                          }}
                          placeholder={idx === 0 ? "Decision outcome..." : "Next item..."}
                          className={`flex-1 min-w-0 bg-transparent text-xs focus:outline-none placeholder-neutral-400/40 ${
                            isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- RENDER 3: IVY LEE METHOD (Spacious 6 Sequential Priorities) --- */}
      {activeFramework === 'ivy_lee' && (
        <div className="flex-1 min-h-0 space-y-1 pt-1">
          {ivyTasks.map((task, idx) => {
            const isDone = task.completed;
            return (
              <div
                key={task.id || idx}
                className={`flex items-center gap-3 h-[36px] sm:h-[40px] px-1 -mx-1 border-b border-black/[0.04] dark:border-white/[0.04] last:border-b-0 transition-all rounded-xs ${
                  isDone ? 'opacity-40' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                <span className="font-bold text-xs sm:text-sm w-5 text-neutral-400 dark:text-neutral-500 select-none">
                  0{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleIvy(idx)}
                  className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isDone
                      ? 'progress-bg-green progress-border-green text-white'
                      : 'border-neutral-400 dark:border-neutral-500 hover:border-neutral-700 bg-transparent'
                  }`}
                >
                  {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </button>

                <input
                  type="text"
                  value={task.text || ''}
                  onChange={(e) => handleTextIvy(idx, e.target.value)}
                  placeholder={`Sequential Priority 0${idx + 1}...`}
                  className={`flex-1 min-w-0 bg-transparent text-xs sm:text-[13px] focus:outline-none placeholder-neutral-400/40 ${
                    isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
