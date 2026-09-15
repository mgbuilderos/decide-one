import React, { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { playSound } from '../utils/audio';
import InlineTimeControl from './InlineTimeControl';
import { STATES, completeSession, getSession, isItemLocked } from '../utils/executionModel';

export const FRAMEWORKS = [
  // Cluster 1: Focus & Prioritization
  {
    id: 'rule_of_3',
    cluster: 'Focus',
    name: 'Top 3',
    subtitle: 'Choose the three that deserve today',
    description: 'Reduce the day to three priorities and put them in a clear order.',
    bestFor: 'A clear daily starting point'
  },
  {
    id: 'ivy_lee',
    cluster: 'Focus',
    name: 'Ivy Lee Method',
    subtitle: 'Six priorities, one at a time',
    description: 'Order six priorities, then work through them one at a time.',
    bestFor: 'Protecting focus from task switching'
  },

  // Cluster 2: Decision
  {
    id: 'eisenhower',
    cluster: 'Decision',
    // M-A3 — the popular name is a misattribution. Eisenhower quoted the
    // distinction in 1954; Covey built the matrix in 1989. The id stays
    // `eisenhower` so stored days keep loading; only the label changes.
    name: 'The Urgent/Important Matrix',
    subtitle: 'Sort work with two questions',
    description: 'Answer whether a task is urgent and whether it matters; the quadrant follows.',
    bestFor: 'Separating urgency from importance'
  }
];

export default function ProductivityFrameworks({
  activeFramework = 'rule_of_3',
  onSelectFramework,
  hardTasks = [],
  onUpdateHardTasks,
  frameworkData = {},
  onUpdateFrameworkData,
  dailyLog,
  onUpdateExecution,
  isMuted = false,
  isPastDay = false,
  isFullPage = false,
  isInteractive = true
}) {
  // Safe accessor for current framework data
  const currentFwData = frameworkData[activeFramework] || {};

  const updateActiveData = (newData) => {
    onUpdateFrameworkData({
      ...frameworkData,
      [activeFramework]: newData
    });
  };

  const syncCompletion = (itemId, completed) => {
    if (!itemId || !onUpdateExecution) return;
    const session = getSession(dailyLog, itemId);
    if (completed) {
      onUpdateExecution(itemId, completeSession(session));
    } else if (session.state === STATES.DONE) {
      onUpdateExecution(itemId, {
        ...session,
        state: session.actualFocusSec > 0 ? STATES.PAUSED : STATES.IDLE
      });
    }
  };

  // --- 1. RULE OF 3 HANDLERS ---
  const slotLabels = [
    { num: '01', title: 'First', placeholder: 'First' },
    { num: '02', title: 'Next', placeholder: 'Next' },
    { num: '03', title: 'Then', placeholder: 'Then' }
  ];

  const handleToggleHardTask = (index) => {
    const updated = [...hardTasks];
    const task = { ...updated[index] };
    const nextCompleted = !task.completed;
    task.completed = nextCompleted;
    updated[index] = task;

    playSound(nextCompleted ? 'check' : 'click', isMuted);
    onUpdateHardTasks(updated);
    syncCompletion(task.id || `r3_${index}`, nextCompleted);
  };

  const handleHardTaskTextChange = (index, newText) => {
    const updated = [...hardTasks];
    const task = { ...updated[index], text: newText };
    updated[index] = task;
    onUpdateHardTasks(updated);
  };

  // --- 2. EISENHOWER HANDLERS (Multi-Task Array per Quadrant) ---
  const rawQuadrants = currentFwData.quadrants || {};
  const normalizeQuadList = (q, defaultId) => {
    if (!q) return [];
    if (Array.isArray(q)) return q.filter(item => item.text?.trim() || item.classified);
    return q.text?.trim() ? [{ id: defaultId, text: q.text, completed: !!q.completed }] : [];
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
    syncCompletion(list[idx].id || `${qKey}_${idx}`, list[idx].completed);
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
    list.push({ id: `${qKey}_${Date.now()}`, text: '', completed: false, classified: true });
    playSound('check', isMuted);
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
    syncCompletion(list[idx].id || `il_${idx}`, list[idx].completed);
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

  return (
    <section data-method={activeFramework} className={`method-section flex flex-col ${isFullPage ? 'flex-1 min-h-0' : 'shrink-0 border-b border-black/[0.08] dark:border-white/[0.08]'}`}>

      {/* Universal 24px Grid Cadence Header Bar */}
      <div className="h-[36px] leading-[36px] [@media(max-height:760px)]:h-[28px] [@media(max-height:760px)]:leading-[28px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
        <div className="flex items-baseline gap-2 min-w-0">
          <h2 className="type-section-title">
            {currentMeta.name}
          </h2>
          <span className="type-metadata hidden xs:inline truncate">
            {currentMeta.subtitle}
          </span>
        </div>

        {/* Quiet progress only; method selection lives in the icon group above. */}
        <div className="flex items-center gap-2 select-none no-print">
          <span className="hidden sm:inline type-label">Elapsed</span>
          <div className="type-metadata">
            <span className={`font-bold ${
              doneCount === 0
                ? 'text-neutral-500'
                : doneCount === totalTasks
                  ? 'progress-ink-green'
                  : 'progress-ink-yellow'
            }`}>
              {doneCount}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">/{totalTasks} done</span>
          </div>
        </div>
      </div>

      <p className="method-rule">{activeFramework === 'rule_of_3' ? 'Three things for today and no fourth.' : activeFramework === 'ivy_lee' ? 'In order. One at a time.' : 'Classify first'}</p>
      {/* --- RENDER 1: RULE OF 3 --- */}
      {activeFramework === 'rule_of_3' && (
        <div className="space-y-0">
          {[0, 1, 2].map((idx) => {
            const task = hardTasks[idx] || { text: '', completed: false };
            const meta = slotLabels[idx];
            // A date is not a verdict — see Top3HardTasks. Red only where the
            // person marked it, never because the calendar moved on.
            const isMissed = task.status === 'missed';

            return (
              <div
                key={idx}
                className={`priority-row group flex items-center gap-3 transition-all min-h-[48px] [@media(max-height:760px)]:min-h-[36px] px-1 -mx-1 ${
                  task.completed ? '' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                <span className={`type-label select-none w-3.5 ${
                  isMissed ? 'progress-ink-red' : 'text-neutral-400 dark:text-neutral-500'
                }`}>
                  {meta.num}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleHardTask(idx)}
                  disabled={!isInteractive || !task.text?.trim()}
                  aria-label={`${task.completed ? 'Mark incomplete' : 'Complete'} priority ${idx + 1}`}
                  className={`priority-bullet w-6 h-6 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    task.completed
                      ? 'progress-bg-green progress-border-green text-white'
                      : isMissed
                        ? 'progress-border-red progress-ink-red'
                        : 'border-neutral-400 dark:border-neutral-500 hover:border-neutral-700 bg-transparent'
                  }`}
                >
                  {task.completed ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isMissed ? (
                    <span className="text-[11px] font-black leading-none">✕</span>
                  ) : null}
                </button>

                <div className="flex-1 min-w-0 h-full flex items-center">
                  <input
                    type="text"
                    value={task.text || ''}
                    onChange={(e) => handleHardTaskTextChange(idx, e.target.value)}
                    placeholder={meta.placeholder || `Priority ${idx + 1}...`}
                    className={`type-body w-full bg-transparent focus:outline-none transition-all placeholder-neutral-500 h-[48px] [@media(max-height:760px)]:h-[36px] ${
                      task.completed
                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                        : isMissed
                          ? 'progress-ink-red'
                          : 'text-neutral-900 dark:text-neutral-100'
                    }`}
                  />
                </div>

                <InlineTimeControl
                  item={{ ...task, id: task.id || `r3_${idx}` }}
                  dailyLog={dailyLog}
                  onUpdateExecution={onUpdateExecution}
                  isMuted={isMuted}
                  isInteractive={isInteractive}
                />

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
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-white dark:bg-[#151515] border border-black/[0.1] dark:border-white/[0.14] hover:border-black/30 dark:hover:border-white/35 transition-colors cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setClassifier(null)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 px-1 cursor-pointer"
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
        <div className="matrix-grid flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 pt-1">
          {[
            { key: 'q1', title: 'Urgent', tag: 'Important' },
            { key: 'q2', title: 'Not urgent', tag: 'Important' },
            { key: 'q3', title: 'Urgent', tag: 'Not important' },
            { key: 'q4', title: 'Not urgent', tag: 'Not important' }
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
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-500 font-medium whitespace-nowrap">
                      {quad.tag}
                    </span>
                    <span
                      className="text-[11px] text-neutral-500 dark:text-neutral-600 font-semibold tabular-nums"
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
                        className="matrix-row flex items-center gap-2 min-h-[36px] px-1 -mx-1 rounded-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors group"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleEisenhower(quad.key, idx)}
                          aria-label={`${isDone ? 'Mark incomplete' : 'Complete'} ${quad.title.toLowerCase()} item ${idx + 1}`}
                          className={`priority-bullet w-3.5 h-3.5 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
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
                          className={`flex-1 min-w-0 bg-transparent text-xs focus:outline-none placeholder-neutral-500 ${
                            isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-800 dark:text-neutral-200'
                          }`}
                        />
                        <InlineTimeControl
                          item={{ ...item, id: item.id || `${quad.key}_${idx}` }}
                          dailyLog={dailyLog}
                          onUpdateExecution={onUpdateExecution}
                          isMuted={isMuted}
                          isInteractive={isInteractive}
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
            const isLocked = isItemLocked('ivy_lee', ivyTasks, idx);
            return (
              <div
                key={task.id || idx}
                className={`ivy-row flex items-center gap-3 h-[48px] px-1 -mx-1 border-b border-black/[0.04] dark:border-white/[0.04] last:border-b-0 transition-all rounded-xs ${
                  isDone ? '' : isLocked ? '' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.03]'
                }`}
              >
                <span className="type-label w-5 text-neutral-500 dark:text-neutral-500 select-none">
                  0{idx + 1}
                </span>

                <button
                  type="button"
                  disabled={isLocked || !isInteractive}
                  onClick={() => handleToggleIvy(idx)}
                  aria-label={isLocked ? `Priority ${idx + 1} is locked until priority ${idx} is complete` : `${isDone ? 'Mark incomplete' : 'Complete'} priority ${idx + 1}`}
                  className={`priority-bullet w-6 h-6 rounded-full border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isDone
                      ? 'progress-bg-green progress-border-green text-white'
                      : 'border-neutral-400 dark:border-neutral-500 hover:border-neutral-700 bg-transparent'
                  }`}
                >
                  {isLocked ? <Lock className="w-2.5 h-2.5" /> : isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </button>

                <input
                  type="text"
                  disabled={isLocked || !isInteractive}
                  value={task.text || ''}
                  onChange={(e) => handleTextIvy(idx, e.target.value)}
                  placeholder={isLocked ? `After ${idx}` : `Priority ${idx + 1}`}
                  aria-label={isLocked ? `Priority ${idx + 1}, available after priority ${idx}` : `Priority ${idx + 1}`}
                  className={`type-body flex-1 min-w-0 bg-transparent focus:outline-none placeholder-neutral-500 ${
                    isDone ? 'line-through text-neutral-400 dark:text-neutral-500' : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                />
                <InlineTimeControl
                  item={{ ...task, id: task.id || `il_${idx}` }}
                  dailyLog={dailyLog}
                  onUpdateExecution={onUpdateExecution}
                  isMuted={isMuted}
                  isInteractive={isInteractive}
                  locked={isLocked}
                />
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
