import React, { useEffect, useState } from 'react';
import { X, Compass, Command } from 'lucide-react';
import { FRAMEWORKS } from './ProductivityFrameworks';

const SHORTCUTS = [
  ['1', 'Open Daily'],
  ['2', 'Open Weekly'],
  ['3', 'Open Monthly'],
  ['4', 'Open Yearly'],
  ['T', 'Return To Today'],
  ['← / H', 'Previous Day'],
  ['→ / L', 'Next Day'],
  ['M', 'Open Settings'],
  ['?', 'Open This Guide']
];

export default function QuickLegendModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('methods');

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <button className="fixed inset-0 cursor-default" aria-label="Close Guide" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="min-h-[56px] px-5 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0">
          <div>
            <h2 className="text-sm font-bold tracking-tight">How Decide One Works</h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">Choose a method, order the work, begin with the first item.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer" aria-label="Close Guide">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0" role="tablist" aria-label="Guide Sections">
          {[
            { id: 'methods', label: 'Methods', icon: Compass },
            { id: 'shortcuts', label: 'Shortcuts', icon: Command }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-9 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === tab.id ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pocket-scroll p-5">
          {activeTab === 'methods' ? (
            <div className="grid gap-3">
              {FRAMEWORKS.map((method, index) => (
                <article key={method.id} className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02]">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-sm font-bold">{method.name}</h3>
                    <span className="text-[10px] text-neutral-500 tabular-nums">0{index + 1}</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">{method.description}</p>
                  <p className="text-[11px] text-neutral-500 mt-2"><strong className="text-neutral-600 dark:text-neutral-300">Use It When:</strong> {method.bestFor}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SHORTCUTS.map(([key, description]) => (
                <div key={key} className="min-h-12 px-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between gap-4">
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{description}</span>
                  <kbd className="px-2 py-1 rounded-md border border-black/15 dark:border-white/20 text-[11px] font-bold bg-white dark:bg-[#1A1A1D] shadow-2xs">{key}</kbd>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
