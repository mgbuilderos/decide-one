import React, { useState } from 'react';
import { 
  X, 
  Sunset, 
  CheckCircle2, 
  ArrowRight, 
  Moon, 
  Sparkles, 
  Trash2, 
  UserCheck, 
  Calendar,
  Lock,
  Award
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { telemetry } from '../utils/telemetry';

export default function ExecutiveClosureRitualModal({
  isOpen,
  onClose,
  dateString,
  dailyLog,
  onMigrateTask,
  onCloseDay,
  onLockShutter,
  isMuted = false,
  ownerName = 'Maulik'
}) {
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [triagedTasks, setTriagedTasks] = useState({}); // taskId -> 'migrated' | 'delegated' | 'dropped'
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  if (!isOpen) return null;

  const hardTasks = dailyLog?.hardTasks || [];
  const completedCount = hardTasks.filter(t => t.completed).length;
  const totalCount = hardTasks.length;
  const incompleteTasks = hardTasks.filter(t => !t.completed && t.text.trim());

  const handleTriageAction = (taskId, action) => {
    playSound('check', isMuted);
    telemetry.recordTaskTriage(action, 1);
    setTriagedTasks(prev => ({
      ...prev,
      [taskId]: action
    }));
  };

  const handleDismiss = () => {
    if (!isShuttingDown) {
      telemetry.track('modal_abandoned', { modal_id: 'closure_ritual' });
    }
    onClose();
  };

  const handleExecuteShutdown = () => {
    setIsShuttingDown(true);
    // 1. Play the authentic Tibetan Singing Bowl & Brass Meditation Bell resonance
    playSound('singing-bowl', isMuted);

    // 2. Perform any task migrations requested
    Object.entries(triagedTasks).forEach(([taskId, action]) => {
      const task = hardTasks.find(t => t.id === taskId);
      if (task && action === 'migrated') {
        onMigrateTask?.(task.text, task.category);
      }
    });

    // 3. Mark the day closed in state
    onCloseDay?.(dateString, {
      completedCount,
      totalCount,
      reflection: reflectionNotes.trim(),
      triagedCount: Object.keys(triagedTasks).length
    });

    // 4. Smooth 1.2s timeout to experience the acoustic resonance before engaging the privacy lock
    setTimeout(() => {
      setIsShuttingDown(false);
      onClose();
      onLockShutter?.();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/70 dark:bg-black/85 backdrop-blur-lg animate-in fade-in select-none">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={handleDismiss} />

      {/* Modal Dialog */}
      <div 
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="h-14 px-5 sm:px-6 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sunset className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Close The Day
              </div>
              <div className="text-[10px] text-neutral-400">
                Cognitive Detachment Ritual • Zero Cognitive Residue
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click', isMuted);
              handleDismiss();
            }}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Section 1: What the day came to. A statement, not a scorecard —
              R8 and R12: no streak, no verdict, no protagonist. */}
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                What today came to
              </div>
              <div className="text-xl font-black text-neutral-900 dark:text-white">
                {completedCount} of {totalCount} finished
              </div>
              <div className="text-[11px] text-neutral-500">
                {totalCount === 0
                  ? 'Nothing was decided today.'
                  : 'Whatever is left is carried, not lost.'}
              </div>
            </div>
          </div>

          {/* Section 2: Unfinished Task Triage (Anti-Zeigarnik Loop) */}
          {incompleteTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Unfinished Task Triage ({incompleteTasks.length})
                </div>
                <div className="text-[10px] text-neutral-400">
                  Choose a destination to clear mental debt
                </div>
              </div>

              <div className="space-y-2">
                {incompleteTasks.map(task => {
                  const currentAction = triagedTasks[task.id];

                  return (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-xl border transition-all ${
                        currentAction 
                          ? 'border-emerald-500/30 bg-emerald-500/[0.02] opacity-75' 
                          : 'border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-black/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                          {task.text}
                        </span>
                        {currentAction && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                            {currentAction === 'migrated' ? '→ Tomorrow' : currentAction === 'delegated' ? 'Delegated' : 'Dropped'}
                          </span>
                        )}
                      </div>

                      {/* 1-Click Triage Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTriageAction(task.id, 'migrated')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            currentAction === 'migrated'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>Move to Tomorrow</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTriageAction(task.id, 'delegated')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            currentAction === 'delegated'
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                              : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Delegate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTriageAction(task.id, 'dropped')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            currentAction === 'dropped'
                              ? 'bg-red-500 text-white'
                              : 'bg-black/[0.04] dark:bg-white/[0.06] hover:bg-red-500/10 hover:text-red-500 text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Drop</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Evening Gratitude & Clarity Insight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Daily Victory or Key Insight
              </label>
              <span className="text-[10px] text-neutral-400 font-serif italic">
                "Simplicity is the ultimate sophistication."
              </span>
            </div>
            <textarea
              rows={2}
              value={reflectionNotes}
              onChange={e => setReflectionNotes(e.target.value)}
              placeholder="What moved the needle most today? What lesson will compound into tomorrow?"
              className="w-full px-3.5 py-2.5 text-xs font-serif leading-relaxed rounded-xl border border-black/[0.12] dark:border-white/[0.15] bg-black/[0.02] dark:bg-white/[0.03] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Nothing is lost — the anti-Zeigarnik promise, stated plainly */}
          <div className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] text-xs text-neutral-500 space-y-1">
            <div className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-neutral-500" />
              <span>Nothing is lost</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Everything unfinished has somewhere to go before the day closes. What was not first today is not deleted — it moves up, and it will be here tomorrow.
            </p>
          </div>

        </div>

        {/* Modal Bottom Bar: closing the day */}
        <div className="p-4 sm:p-5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-neutral-400 font-medium">
            {ownerName} • Day Closure
          </div>

          <button
            type="button"
            disabled={isShuttingDown}
            onClick={handleExecuteShutdown}
            className={`px-5 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 ${
              isShuttingDown ? 'opacity-80 scale-98 pointer-events-none' : ''
            }`}
          >
            <span>{isShuttingDown ? 'Closing…' : 'The day is done'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
