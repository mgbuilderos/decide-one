import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import BulletItem from './BulletItem';
import { CATEGORIES } from '../types/journal';
import { playSound } from '../utils/audio';

export default function RapidLogSection({
  rapidLog = [],
  onUpdateRapidLog,
  activeFilter = 'all',
  setActiveFilter,
  viewMode = 'stream',
  setViewMode,
  isMuted = false,
  isPastDay = false
}) {
  const [newlyAddedId, setNewlyAddedId] = useState(null);

  const handleAddNewItem = (category = 'personal', type = 'task') => {
    playSound('click', isMuted);
    const id = 'r_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newItem = {
      id,
      type,
      text: '',
      category,
      timestamp
    };

    onUpdateRapidLog([...rapidLog, newItem]);
    setNewlyAddedId(id);
  };

  const handleUpdateItem = (index, updatedItem) => {
    const nextList = [...rapidLog];
    nextList[index] = updatedItem;
    onUpdateRapidLog(nextList);
  };

  const handleDeleteItem = (index) => {
    playSound('click', isMuted);
    const nextList = rapidLog.filter((_, i) => i !== index);
    onUpdateRapidLog(nextList);
  };

  const handleDuplicateItem = (itemToDup) => {
    playSound('click', isMuted);
    const id = 'r_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newItem = {
      ...itemToDup,
      id,
      text: itemToDup.text
    };
    const idx = rapidLog.findIndex(r => r.id === itemToDup.id);
    const nextList = [...rapidLog];
    if (idx !== -1) {
      nextList.splice(idx + 1, 0, newItem);
    } else {
      nextList.push(newItem);
    }
    onUpdateRapidLog(nextList);
    setNewlyAddedId(id);
  };

  const handleEnterKeyOnItem = (currentIndex) => {
    const id = 'r_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const currentItem = rapidLog[currentIndex];
    const category = currentItem ? currentItem.category : 'personal';
    
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newItem = {
      id,
      type: 'task',
      text: '',
      category,
      timestamp
    };

    const nextList = [...rapidLog];
    nextList.splice(currentIndex + 1, 0, newItem);
    onUpdateRapidLog(nextList);
    setNewlyAddedId(id);
  };

  // Filter items
  const filteredLog = activeFilter === 'all'
    ? rapidLog
    : rapidLog.filter(item => item.category === activeFilter);

  return (
    <section className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden" aria-label="Today Rapid Log">
      
      {/* Section Partition (Exact 24px Line Grid Cadence) */}
      <div className="h-[24px] leading-[24px] flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 mb-1.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-neutral-800 dark:text-neutral-200">
            Today
          </h2>
          <span className="text-[10px] font-normal text-neutral-500 dark:text-neutral-400 tabular-nums">
            ({rapidLog.length})
          </span>
        </div>

        {/* Quiet Controls: Add Line */}
        <div className="flex items-center gap-1.5 no-print">
          <button
            type="button"
            onClick={() => handleAddNewItem('personal')}
            className="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Line</span>
          </button>
        </div>
      </div>

      {/* Internal Stream Container (24px Line Grid Cadence, Hardcoded Zero-Scroll) */}
      <div className="flex-1 min-h-0 overflow-hidden pr-1">
        <div className="space-y-0">
          {filteredLog.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
              Nothing logged yet. Click "+ Line" or press Enter on any line.
            </div>
          ) : (
            filteredLog.map((item) => {
              const actualIndex = rapidLog.findIndex(r => r.id === item.id);
              return (
                <BulletItem
                  key={item.id}
                  item={item}
                  autoFocus={item.id === newlyAddedId}
                  onUpdate={(updated) => handleUpdateItem(actualIndex, updated)}
                  onDelete={() => handleDeleteItem(actualIndex)}
                  onDuplicate={handleDuplicateItem}
                  onKeyDownEnter={() => handleEnterKeyOnItem(actualIndex)}
                  isMuted={isMuted}
                  isPastDay={isPastDay}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Subtle Add Affordance (Exact 24px Cadence Row) */}
      <div className="h-[24px] leading-[24px] flex items-center shrink-0 no-print">
        <button
          type="button"
          onClick={() => handleAddNewItem('personal')}
          className="h-[24px] leading-[24px] text-xs text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors flex items-center gap-1.5 px-1 select-none cursor-pointer"
        >
          <span className="text-neutral-400 dark:text-neutral-500 font-bold">+</span>
          <span>Add line (or press Enter on any entry)</span>
        </button>
      </div>

    </section>
  );
}
