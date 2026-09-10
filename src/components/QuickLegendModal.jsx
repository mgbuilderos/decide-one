import React, { useState } from 'react';
import { X, BookOpen, Compass, Layers, Check, Command } from 'lucide-react';
import { POCKET_SYMBOLS, CATEGORIES } from '../types/journal';
import { FRAMEWORKS } from './ProductivityFrameworks';

export default function QuickLegendModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('frameworks'); // 'frameworks' | 'symbols' | 'categories' | 'shortcuts'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl max-h-[88vh] bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="h-[52px] px-5 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              About Decide One & Methodology Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 pb-2 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'frameworks', label: `${FRAMEWORKS.length} Productivity Models`, icon: Compass },
            { id: 'symbols', label: 'Notation & Inks', icon: Check },
            { id: 'categories', label: '10 Context Tags', icon: Layers },
            { id: 'shortcuts', label: 'Executive Shortcuts', icon: Command }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSel
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pocket-scroll p-5 space-y-6">
          
          {/* TAB 1: PRODUCTIVITY MODELS ENCYCLOPEDIA */}
          {activeTab === 'frameworks' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Decide One supports {FRAMEWORKS.length} world-class, open-source / public domain productivity frameworks. Each model addresses a specific cognitive scenario:
              </div>

              <div className="space-y-3">
                {FRAMEWORKS.map((fw, idx) => (
                  <div 
                    key={fw.id}
                    className="p-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">0{idx + 1}.</span>
                        <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                          {fw.name}
                        </h3>
                        <span className="text-[10px] text-neutral-400 italic">
                          ({fw.subtitle})
                        </span>
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] text-neutral-700 dark:text-neutral-300">
                        {fw.cluster}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {fw.description}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-500 border-t border-black/[0.04] dark:border-white/[0.06]">
                      <span><strong className="text-neutral-700 dark:text-neutral-300">Ideal For: </strong>{fw.bestFor}</span>
                      <span className="text-[10px] text-neutral-400 font-medium">Public Domain</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DECIDE ONE JOURNALING SYSTEM & INK PALETTE */}
          {activeTab === 'symbols' && (
            <div className="space-y-5">
              
              {/* Decide One Notation System Symbols */}
              <div className="space-y-2.5">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-500">
                  Decide One Notation System
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {POCKET_SYMBOLS.map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08]">
                      <span className="w-6 h-6 rounded-full bg-black/[0.06] dark:bg-white/[0.08] flex items-center justify-center font-bold text-xs text-neutral-900 dark:text-neutral-100 shrink-0">
                        {b.symbol}
                      </span>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">{b.label}</div>
                        <div className="text-[11px] text-neutral-500">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Color Dynamic Progress System */}
              <div className="p-3.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.03] space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-700 dark:text-neutral-300">
                  3-Color Dynamic Progress System
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Decide One maintains a distraction-free black & white baseline while tracking task momentum and end-of-day completion using three intentional ink colors:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 font-bold progress-ink-green mb-1">
                      <span>✓ Done (Bamboo Green)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">Applied when a task or habit is conquered. Drives mastery & score.</p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 font-bold progress-ink-yellow mb-1">
                      <span>→ Migrated / Priority Core</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">Active progress, carryovers, or focused high-impact tasks.</p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 font-bold progress-ink-red mb-1">
                      <span>✕ Dropped (Crimson)</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">Deliberately eliminated tasks or neglected habit triggers.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: 10 CONTEXT CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-3">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Decide One automatically detects context keywords as you type, organizing your day into 10 smart life categories:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.values(CATEGORIES).map(cat => (
                  <div 
                    key={cat.id} 
                    className="p-2.5 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
                      <span className="font-bold text-neutral-900 dark:text-white">{cat.fullLabel}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-semibold">#{cat.label.toLowerCase()}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-black/[0.02] dark:bg-white/[0.03] rounded-xl text-[11px] text-neutral-500 leading-relaxed border border-black/[0.04] dark:border-white/[0.06]">
                💡 <strong>Auto-Tagging:</strong> Typing words like <span className="font-semibold text-neutral-800 dark:text-neutral-200">"run"</span>, <span className="font-semibold text-neutral-800 dark:text-neutral-200">"code"</span>, <span className="font-semibold text-neutral-800 dark:text-neutral-200">"call"</span>, or <span className="font-semibold text-neutral-800 dark:text-neutral-200">"flight"</span> automatically tags the line with the appropriate category.
              </div>
            </div>
          )}

          {/* TAB 4: EXECUTIVE UNIVERSAL KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Operate Decide One at thought-speed with universal single-key shortcuts (active whenever you are not editing a text field):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: '1', desc: 'Jump to Daily Spread' },
                  { key: '2', desc: 'Open Monthly Log' },
                  { key: '3', desc: 'Open 12-Month Annual Index' },
                  { key: 'T', desc: 'Return to Today' },
                  { key: 'C', desc: 'Toggle Front Leather Cover' },
                  { key: '← / H', desc: 'Flip to Previous Day' },
                  { key: '→ / L', desc: 'Flip to Next Day' },
                  { key: 'M', desc: 'Open Menu & Dashboard' },
                  { key: '?', desc: 'Toggle This Help Guide' }
                ].map((sc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between"
                  >
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{sc.desc}</span>
                    <kbd className="px-2 py-0.5 rounded-md border border-black/15 dark:border-white/20 text-[11px] font-bold bg-white dark:bg-[#1A1A1D] text-neutral-900 dark:text-white shadow-2xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-black/[0.02] dark:bg-white/[0.03] rounded-xl text-[11px] text-neutral-500 leading-relaxed border border-black/[0.04] dark:border-white/[0.06]">
                🔖 <strong>Silk Ribbon Placekeeper:</strong> You can also click the red silk bookmark draped down the center spine anytime to immediately snap back to Today.
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="h-[44px] px-5 bg-black/[0.02] dark:bg-white/[0.03] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
          <span>Decide One Priority Instrument</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
