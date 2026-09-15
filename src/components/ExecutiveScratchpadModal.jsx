import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CornerDownLeft, X } from 'lucide-react';
import { playSound } from '../utils/audio';

const SCRATCHPAD_STORAGE_KEY = 'DECIDEONE_FAST_SCRATCHPAD_BUFFER';
const LEGACY_SCRATCHPAD_STORAGE_KEYS = ['PRIMACY_FAST_SCRATCHPAD_BUFFER', 'POCKETBOOK_FAST_SCRATCHPAD_BUFFER'];

export default function ExecutiveScratchpadModal({
  isOpen,
  onClose,
  onCommitToDailyLog,
  onCommitToTop3,
  onCommitToDecisions,
  isMuted = false
}) {
  const [content, setContent] = useState(() => {
    try {
      const current = localStorage.getItem(SCRATCHPAD_STORAGE_KEY);
      const legacy = LEGACY_SCRATCHPAD_STORAGE_KEYS.reduce((found, k) => found || localStorage.getItem(k), null);
      if (!current && legacy) localStorage.setItem(SCRATCHPAD_STORAGE_KEY, legacy);
      return current || legacy || '';
    } catch {
      return '';
    }
  });
  const [targetDestination, setTargetDestination] = useState('today'); // 'today' | 'top3' | 'decision'
  const textareaRef = useRef(null);

  // Auto-save scratchpad buffer so thoughts are never lost
  useEffect(() => {
    try {
      localStorage.setItem(SCRATCHPAD_STORAGE_KEY, content);
    } catch {}
  }, [content]);

  // Focus on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  const handleCommit = () => {
    if (!content.trim()) return;

    playSound('check', isMuted);
    const trimmed = content.trim();

    if (targetDestination === 'top3') {
      onCommitToTop3?.(trimmed);
    } else if (targetDestination === 'decision') {
      onCommitToDecisions?.(trimmed);
    } else {
      onCommitToDailyLog?.(trimmed);
    }

    setContent('');
    try {
      localStorage.removeItem(SCRATCHPAD_STORAGE_KEY);
      LEGACY_SCRATCHPAD_STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
    } catch {}
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/35 dark:bg-black/65  animate-in fade-in duration-150 no-print">
      <div 
        onKeyDown={handleKeyDown}
        className="w-full max-w-[520px] bg-white/95 dark:bg-[#1d1d1d]/95  rounded-2xl shadow-2xl border border-black/10 dark:border-white/12 p-4 text-neutral-900 dark:text-neutral-100 animate-in zoom-in-95 duration-150"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Quick Thought Capture
            </span>
          </div>

          {/* Destination Selector */}
          <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setTargetDestination('today')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                targetDestination === 'today'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setTargetDestination('top3')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                targetDestination === 'top3'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Top 3
            </button>
            <button
              type="button"
              onClick={() => setTargetDestination('decision')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                targetDestination === 'decision'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Decision
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rapid Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Capture a priority, decision, or note..."
          rows={4}
          className="w-full bg-transparent resize-none text-sm leading-relaxed focus:outline-none placeholder-neutral-400/50"
        />

        {/* Footer Bar */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/[0.06] dark:border-white/[0.06] text-[11px] text-neutral-500">
          <span>Esc to close • Cmd+Enter to dispatch</span>

          <button
            type="button"
            onClick={handleCommit}
            disabled={!content.trim()}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full font-semibold cursor-pointer disabled:opacity-30 transition-all text-xs"
          >
            <span>Dispatch</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
