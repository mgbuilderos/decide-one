import React from 'react';

export default function EveningReflection({
  reflection = '',
  onUpdateReflection,
  textColor = 'text-neutral-800 dark:text-neutral-200',
  isFocusMode = false
}) {
  return (
    <section className="w-full min-w-0 flex-1 min-h-0 flex flex-col shrink-0 overflow-hidden">
      
      {/* Clear Section Partition (Exact 24px Height on Grid Line) */}
      <div className="w-full min-w-0 h-[24px] leading-[24px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
        <div className="flex items-baseline gap-2 min-w-0 truncate">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-neutral-800 dark:text-neutral-200 shrink-0">
            Reflect
          </h2>
        </div>
      </div>


      <textarea
        value={reflection || ''}
        onChange={(e) => onUpdateReflection(e.target.value)}
        placeholder="Write your thoughts, learnings, and gratitude..."
        rows={isFocusMode ? 10 : 3}
        className={`w-full min-w-0 flex-1 min-h-0 bg-transparent p-0 m-0 pt-0 leading-[24px] placeholder-neutral-400/50 focus:outline-none transition-all resize-none overflow-hidden no-scrollbar ${
          isFocusMode 
            ? 'px-3 py-0 border border-black/[0.12] dark:border-white/[0.15] rounded-xs bg-black/[0.015] dark:bg-white/[0.02] text-sm' 
            : 'text-xs sm:text-[13px]'
        } ${textColor}`}
      />
    </section>
  );
}
