import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Feather, 
  X,
  Sparkles,
  Command
} from 'lucide-react';
import { OmniSearchEngine } from '../utils/omnisearch/OmniSearchEngine';
import { parseNaturalDate } from '../utils/omnisearch/NaturalDateParser';
import { playSound } from '../utils/audio';

const FACET_PILLS = [
  { id: 'all', label: 'All Entries' },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'hardTasks', label: 'Key Priorities', icon: Flame },
  { id: 'decisions', label: 'Notes & Ideas', icon: BookOpen },
];

export default function OmniSearchModal({
  isOpen,
  onClose,
  dailyLogs = {},
  monthlyLogs = {},
  onTeleportToPage,
  isMuted = false,
  onOpenUpgrade
}) {
  const [query, setQuery] = useState('');
  const [selectedFacet, setSelectedFacet] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Initialize Search Engine
  const engine = useMemo(() => {
    const inst = new OmniSearchEngine();
    inst.buildIndex(dailyLogs, monthlyLogs);
    return inst;
  }, [dailyLogs, monthlyLogs]);

  // Check for Natural Language Date Jump
  const naturalDateResult = useMemo(() => {
    return parseNaturalDate(query);
  }, [query]);

  // Execute Omnisearch Query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const facetKey = selectedFacet === 'all' ? null : selectedFacet;
    const response = engine.search(query, { facetFilter: facetKey, limit: 25 });
    return response.results || [];
  }, [engine, query, selectedFacet]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selected index when query or facet changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedFacet]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      const totalItems = (naturalDateResult ? 1 : 0) + searchResults.length;
      if (totalItems === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        playSound('click', isMuted);
        setSelectedIndex(prev => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        playSound('click', isMuted);
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleExecuteSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchResults, naturalDateResult, selectedIndex, isMuted, onClose]);

  const handleExecuteSelection = () => {
    if (naturalDateResult && selectedIndex === 0) {
      playSound('page', isMuted);
      const [y, m, d] = naturalDateResult.dateKey.split('-').map(Number);
      const targetDate = new Date(y, m - 1, d);
      onTeleportToPage?.(targetDate);
      onClose();
      return;
    }

    const itemIdx = naturalDateResult ? selectedIndex - 1 : selectedIndex;
    const item = searchResults[itemIdx];
    if (item) {
      playSound('page', isMuted);
      const [y, m, d] = item.dateKey.split('-').map(Number);
      const targetDate = new Date(y, m - 1, d);
      onTeleportToPage?.(targetDate, item);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-black/50 dark:bg-black/80  animate-in fade-in select-none">
      
      {/* Backdrop Click Dismissal */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#151515] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Input Bar */}
        <div className="h-14 px-4 sm:px-5 flex items-center gap-3 border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dates, priorities, and notes (Cmd+K)..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-black/[0.06] dark:bg-white/[0.08] text-[11px] font-semibold text-neutral-500">
            ESC to close
          </kbd>
        </div>

        {/* Facet Filter Pills */}
        <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto pocket-scroll border-b border-black/[0.04] dark:border-white/[0.06] bg-black/[0.01] dark:bg-white/[0.01]">
          {FACET_PILLS.map((facet) => {
            const isSelected = selectedFacet === facet.id;
            const Icon = facet.icon;
            return (
              <button
                key={facet.id}
                type="button"
                onClick={() => {
                  playSound('click', isMuted);
                  setSelectedFacet(facet.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{facet.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Stream */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto pocket-scroll divide-y divide-black/[0.04] dark:divide-white/[0.04]">
          
          {/* Natural Date Navigation Prompt */}
          {naturalDateResult && (
            <div
              onClick={() => {
                playSound('page', isMuted);
                const [y, m, d] = naturalDateResult.dateKey.split('-').map(Number);
                onTeleportToPage?.(new Date(y, m - 1, d));
                onClose();
              }}
              className={`p-3.5 sm:px-5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                selectedIndex === 0
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedIndex === 0 
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-neutral-900' 
                    : 'bg-black/[0.06] text-neutral-700 dark:bg-white/[0.08] dark:text-neutral-300'
                }`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    Jump to {naturalDateResult.label} ({naturalDateResult.dateKey})
                  </div>
                  <div className={`text-[11px] ${selectedIndex === 0 ? 'opacity-80' : 'text-neutral-500'}`}>
                    Open two-page spread for this date
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold opacity-75">
                <span>Enter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Search Hits */}
          {searchResults.map((item, idx) => {
            const actualIdx = naturalDateResult ? idx + 1 : idx;
            const isSelected = selectedIndex === actualIdx;
            
            return (
              <div
                key={`${item.dateKey}-${item.itemId || idx}`}
                onClick={() => {
                  playSound('page', isMuted);
                  const [y, m, d] = item.dateKey.split('-').map(Number);
                  onTeleportToPage?.(new Date(y, m - 1, d), item);
                  onClose();
                }}
                className={`p-3.5 sm:px-5 flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected 
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-neutral-900' 
                      : 'bg-black/[0.06] text-neutral-700 dark:bg-white/[0.08] dark:text-neutral-300'
                  }`}>
                    {item.section === 'hardTasks' ? (
                      <Flame className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    ) : item.section === 'reflection' ? (
                      <Feather className="w-4 h-4 text-neutral-500" />
                    ) : item.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">
                      {item.snippet}
                    </div>
                    <div className={`text-[11px] mt-0.5 flex items-center gap-2 ${
                      isSelected ? 'opacity-80' : 'text-neutral-400'
                    }`}>
                      <span className="font-semibold">{item.dateKey}</span>
                      <span>•</span>
                      <span className="capitalize">{item.section === 'reflection' ? 'note' : item.category}</span>
                      {item.isCompleted && (
                        <>
                          <span>•</span>
                          <span className="text-neutral-600 dark:text-neutral-400 font-medium">Completed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-xs font-semibold opacity-75">
                  <span className="hidden sm:inline">Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {query.trim() && !naturalDateResult && searchResults.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mx-auto" />
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No matching entries found
              </div>
              <div className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try searching for a different keyword, date, or clear your active facet filter.
              </div>
            </div>
          )}

          {/* Initial Prompt State */}
          {!query.trim() && (
            <div className="p-6 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-1">
                Suggested Actions & Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Jump to Yesterday', cmd: 'Type "yesterday"' },
                  { label: 'Jump to Tomorrow', cmd: 'Type "tomorrow"' },
                  { label: 'Search Notes', cmd: 'Find saved notes' },
                  { label: 'Search Decisions', cmd: 'Filter by Notes & Ideas' }
                ].map((sugg, sIdx) => (
                  <div
                    key={sIdx}
                    onClick={() => {
                      if (sugg.label.includes('Yesterday')) setQuery('yesterday');
                      else if (sugg.label.includes('Tomorrow')) setQuery('tomorrow');
                      else if (sugg.label.includes('Notes')) setSelectedFacet('reflections');
                      else if (sugg.label.includes('Decisions')) setSelectedFacet('decisions');
                    }}
                    className="p-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold">{sugg.label}</span>
                    <span className="text-[11px] text-neutral-500">{sugg.cmd}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Status Bar */}
        <div className="h-10 px-4 sm:px-5 bg-black/[0.02] dark:bg-white/[0.03] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Command className="w-3 h-3" />
            <span>Sub-Millisecond On-Device Index</span>
          </div>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
        </div>

      </div>
    </div>
  );
}
