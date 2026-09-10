import React, { useRef, useEffect } from 'react';
import { Trash2, Copy } from 'lucide-react';
import { POCKET_SYMBOLS, getPocketSymbol, CATEGORIES, detectCategoryFromText } from '../types/journal';
import { playSound } from '../utils/audio';
import { parseNaturalTaskInput } from '../utils/TaskNaturalLanguageParser';

export default function BulletItem({
  item,
  onUpdate,
  onDelete,
  onDuplicate,
  onKeyDownEnter,
  autoFocus = false,
  isMuted = false,
  isPastDay = false
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Cycle through Decide One journaling symbols on click
  const handleCycleBullet = () => {
    const currentSym = getPocketSymbol(item.type);
    const currentIndex = POCKET_SYMBOLS.findIndex(b => b.id === currentSym.id);
    const nextIndex = (currentIndex + 1) % POCKET_SYMBOLS.length;
    const nextType = POCKET_SYMBOLS[nextIndex].id;

    playSound(nextType === 'done' ? 'check' : 'click', isMuted);
    onUpdate({ ...item, type: nextType });
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    const updated = { ...item, text: newText };

    // Auto-detect category and delegation
    const detected = detectCategoryFromText(newText);
    if (detected && (!item.category || item.category === 'personal')) {
      updated.category = detected;
    }

    const delegateMatch = newText.match(/@([a-zA-Z0-9_-]+)/);
    if (delegateMatch) {
      updated.delegate = delegateMatch[1];
    }

    onUpdate(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Natural language parsing on commit if contains special tokens
      if (item.text && (item.text.includes('#') || item.text.includes('@') || item.text.includes('!') || /\b\d{1,2}:\d{2}\b/.test(item.text))) {
        const parsed = parseNaturalTaskInput(item.text);
        if (parsed.cleanText) {
          onUpdate({
            ...item,
            text: parsed.cleanText,
            category: parsed.category,
            type: parsed.type,
            timestamp: parsed.timestamp || item.timestamp,
            delegate: parsed.delegate || item.delegate
          });
        }
      }
      onKeyDownEnter();
    } else if (e.key === 'Backspace' && (!item.text || item.text.trim() === '')) {
      e.preventDefault();
      onDelete();
    }
  };

  // 1-Click category cycle
  const categoryKeys = Object.keys(CATEGORIES);
  const handleCycleCategory = () => {
    playSound('click', isMuted);
    const currentIndex = categoryKeys.findIndex(k => CATEGORIES[k].id === item.category);
    const nextIndex = (currentIndex + 1) % categoryKeys.length;
    const nextCategory = CATEGORIES[categoryKeys[nextIndex]].id;
    onUpdate({ ...item, category: nextCategory });
  };

  const currentBullet = getPocketSymbol(item.type);
  const currentCategory = Object.values(CATEGORIES).find(c => c.id === item.category) || CATEGORIES.PERSONAL;
  const isCompleted = item.type === 'done' || item.type === 'completed';
  const isMissed = item.type === 'missed' || (isPastDay && (item.type === 'todo' || item.type === 'task') && !isCompleted && item.text?.trim());
  const hasCustomCategory = item.category && item.category !== 'personal';

  return (
    <div 
      className="group relative flex items-center gap-2 h-[24px] leading-[24px] py-0 px-1 -mx-1 rounded transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
      title={item.text || ''}
    >
      
      {/* Decide One journaling glyph */}
      <button
        type="button"
        onClick={handleCycleBullet}
        title={`${currentBullet.label} (${currentBullet.desc}) - Click to change`}
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-transform active:scale-90 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
      >
        <span 
          className={`text-xs font-bold leading-none select-none ${
            isCompleted 
              ? 'progress-ink-green' 
              : isMissed 
                ? 'progress-ink-red font-black' 
                : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {isMissed && item.type !== 'missed' ? '✕' : currentBullet.symbol}
        </span>
      </button>

      {/* Text Input strictly aligned to 24px baseline with truncation grace */}
      <div className="flex-1 min-w-0" title={item.text || ''}>
        <input
          ref={inputRef}
          type="text"
          value={item.text || ''}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a task, thought, or idea..."
          className={`w-full bg-transparent text-[13px] leading-[24px] font-normal focus:outline-none transition-colors truncate focus:truncate-none placeholder-transparent group-hover:placeholder-neutral-400/30 focus:placeholder-neutral-400/50 ${
            isCompleted 
              ? 'line-through strikethrough-anim text-neutral-400 dark:text-neutral-500 opacity-60' 
              : isMissed 
                ? 'progress-ink-red opacity-90' 
                : 'text-neutral-900 dark:text-neutral-100'
          }`}
        />
      </div>

      {/* Progressive Disclosure Metadata: Subtle Tag & Actions on Hover/Focus */}
      <div className={`shrink-0 flex items-center gap-1.5 transition-opacity ${
        hasCustomCategory || item.delegate ? 'opacity-40 group-hover:opacity-100 group-focus-within:opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
      }`}>
        {/* Delegation Badge */}
        {item.delegate && (
          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-neutral-600 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-0.5 select-none whitespace-nowrap">
            <span>@{item.delegate}</span>
          </span>
        )}

        {/* Subtle Category Indicator (1-Click Cycle) */}
        <button
          type="button"
          onClick={handleCycleCategory}
          className="text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white px-1.5 py-0.2 rounded transition-colors select-none"
          title={`Category: ${currentCategory.label} (Click to switch)`}
        >
          #{currentCategory.label.toLowerCase()}
        </button>

        {/* 1-Click Duplicate Line */}
        {onDuplicate && (
          <button
            type="button"
            onClick={() => {
              playSound('click', isMuted);
              onDuplicate(item);
            }}
            title="Duplicate line"
            className="text-neutral-300 hover:text-neutral-900 dark:hover:text-white p-0.5 rounded transition-colors select-none cursor-pointer"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}

        {/* Delete on hover */}
        <button
          type="button"
          onClick={onDelete}
          title="Delete line"
          className="text-neutral-300 hover:text-neutral-900 dark:hover:text-white p-0.5 rounded transition-colors select-none cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
}
