import React from 'react';
import { Layers, ListFilter } from 'lucide-react';
import { CATEGORIES } from '../types/journal';
import { playSound } from '../utils/audio';

export default function CategoryFilterBar({
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
  isMuted = false
}) {
  const handleFilterClick = (catId) => {
    playSound('click', isMuted);
    setActiveFilter(catId);
  };

  const handleModeToggle = () => {
    playSound('click', isMuted);
    setViewMode(viewMode === 'stream' ? 'grouped' : 'stream');
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 no-print">
      
      {/* Category Chips Scroll Area */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none text-xs">
        <button
          onClick={() => handleFilterClick('all')}
          className={`px-3 py-1 rounded-full border transition-all shrink-0 font-medium ${
            activeFilter === 'all'
              ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200/80 dark:border-neutral-700/60 hover:border-neutral-300'
          }`}
        >
          All Items
        </button>

        {Object.values(CATEGORIES).map((cat) => {
          const isSelected = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleFilterClick(cat.id)}
              className={`px-2.5 py-1 rounded-full border transition-all shrink-0 flex items-center gap-1.5 text-xs ${
                isSelected
                  ? 'ring-1 ring-neutral-800 dark:ring-neutral-200 shadow-xs font-semibold'
                  : 'hover:opacity-85'
              }`}
              style={{
                backgroundColor: cat.bgLight,
                color: cat.textLight,
                borderColor: isSelected ? cat.textLight : cat.borderLight
              }}
            >
              <span>{cat.emoji}</span>
              <span className="font-medium">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mode Switcher: Stream vs Grouped */}
      <div className="shrink-0 self-end sm:self-auto">
        <button
          onClick={handleModeToggle}
          className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/60 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all shadow-xs"
          title="Toggle Grouped by Category vs Chronological Stream"
        >
          {viewMode === 'stream' ? (
            <>
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span>Group by Category</span>
            </>
          ) : (
            <>
              <ListFilter className="w-3.5 h-3.5 text-neutral-400" />
              <span>Chronological Stream</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
