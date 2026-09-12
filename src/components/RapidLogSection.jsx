import React, { useState } from 'react';
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
  isPastDay = false,
  isInteractive = true
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
    <section
      className={`shrink-0 flex flex-col ${!isInteractive ? 'pointer-events-none select-none' : ''}`}
      aria-label="Today"
    >
      
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
      </div>

      {/* Internal Stream Container (24px Line Grid Cadence, Hardcoded Zero-Scroll) */}
      <div className="pr-1">
        <div className="space-y-0">
          {filteredLog.length === 0 ? (
            <div className="h-[24px] leading-[24px] text-xs text-neutral-500 dark:text-neutral-500 px-1">
              Nothing here yet.
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
          className="h-[24px] leading-[24px] text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors flex items-center gap-1.5 px-1 select-none cursor-pointer"
        >
          <span className="text-neutral-400 dark:text-neutral-500 font-bold">+</span>
          <span>Add line (or press Enter on any entry)</span>
        </button>
      </div>

    </section>
  );
}
