import React, { useState } from 'react';
import { 
  Calendar, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { MONTH_ILLUSTRATIONS } from '../data/monthIllustrations';
import { playSound } from '../utils/audio';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthlyBreakerPage({
  monthIndex = 8, // Default September (0-indexed = 8)
  year = 2026,
  onOpenToday,
  onOpenMonthlyLog,
  onBackToYearly,
  isMuted = false
}) {
  const currentMonthIdx = Math.max(0, Math.min(11, monthIndex));
  const monthName = MONTH_NAMES[currentMonthIdx];
  const illus = MONTH_ILLUSTRATIONS[currentMonthIdx] || MONTH_ILLUSTRATIONS[0];
  const chapterNumber = String(currentMonthIdx + 1).padStart(2, '0');

  const today = new Date();
  const isThisCurrentMonth = today.getFullYear() === year && today.getMonth() === currentMonthIdx;

  // Local state for 3 chapter intentions
  const [intentions, setIntentions] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`DECIDEONE_BREAKER_INTENTIONS_${year}_${currentMonthIdx}`) || localStorage.getItem(`PRIMACY_BREAKER_INTENTIONS_${year}_${currentMonthIdx}`) || localStorage.getItem(`POCKETBOOK_BREAKER_INTENTIONS_${year}_${currentMonthIdx}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // Fallback to defaults
      }
    }
    return [
      'Maintain deep creative focus during morning hours',
      'Execute high-leverage milestones with deliberate calm',
      'Reflect daily with honest evening clarity'
    ];
  });

  const handleUpdateIntention = (idx, val) => {
    const next = [...intentions];
    next[idx] = val;
    setIntentions(next);
    try {
      localStorage.setItem(`DECIDEONE_BREAKER_INTENTIONS_${year}_${currentMonthIdx}`, JSON.stringify(next));
    } catch (e) {
      // Ignored
    }
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row gap-0 overflow-hidden select-none">
      
      {/* Left Page: Museum-Grade Chapter Art Spread */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col md:pr-6 md:border-r border-black/[0.08] dark:border-white/[0.08] bifold-left-page overflow-hidden justify-between">
        
        {/* Left Masthead (48px Cadence) */}
        <div className="h-[48px] border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0 mb-2">
          <button
            type="button"
            onClick={() => {
              playSound('click', isMuted);
              onBackToYearly?.();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Annual Index</span>
          </button>
          
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
            Chapter {chapterNumber} • {year}
          </div>
        </div>

        {/* Center Illustration Hero */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-2 sm:py-4">
          <div className="relative p-3 sm:p-6 flex items-center justify-center">
            {illus?.render('w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 text-neutral-900 dark:text-neutral-100 transition-all')}
          </div>
          <div className="text-center space-y-1 mt-1 px-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500">
              {illus?.theme || 'Equinox Solitude'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">
              {monthName}
            </h1>
          </div>
        </div>

        {/* Left Page Footer Baseline */}
        <div className="h-[36px] border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
          <span>Decide One Archival Edition</span>
          <span>Plate No. {chapterNumber}</span>
        </div>

      </div>

      {/* Right Page: Chapter Intentions & Gateway into Today */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col md:pl-6 bifold-right-page extension-booklet-paper overflow-hidden justify-between mt-3 md:mt-0">
        
        {/* Right Masthead (48px Cadence) */}
        <div className="h-[48px] border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between shrink-0 mb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
              Chapter Intentions
            </div>
            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Guiding priorities for {monthName}
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">
            <Compass className="w-3 h-3" />
            <span>Monthly Anchor</span>
          </div>
        </div>

        {/* Right Page Content (Hardcoded Zero-Scroll) */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between py-1">
          
          {/* 3 Guiding Pillars */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              3 Strategic Pillars
            </div>
            {intentions.map((intent, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={intent}
                  onChange={(e) => handleUpdateIntention(idx, e.target.value)}
                  placeholder={`Pillar ${idx + 1} focus...`}
                  className="flex-1 text-xs font-semibold bg-transparent text-neutral-900 dark:text-white border-none focus:outline-none placeholder:text-neutral-400"
                />
              </div>
            ))}
          </div>

          {/* Seasonal Note */}
          <div className="p-3 rounded-xl border border-dashed border-black/[0.12] dark:border-white/[0.15] bg-black/[0.01] dark:bg-white/[0.01] text-center space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Quiet Rhythm</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 italic">
              "Great works are performed not by strength, but by perseverance."
            </p>
          </div>

        </div>

        {/* Primary Actions: Open Today & Open Monthly Log */}
        <div className="pt-3 border-t border-black/[0.08] dark:border-white/[0.08] space-y-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              playSound('click', isMuted);
              onOpenToday?.(currentMonthIdx);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>{isThisCurrentMonth ? 'Open Today' : `Open 1st of ${monthName}`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                playSound('click', isMuted);
                onOpenMonthlyLog?.();
              }}
              className="py-1.5 px-2.5 rounded-lg border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3 h-3" />
              <span>Monthly Log</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('click', isMuted);
                onBackToYearly?.();
              }}
              className="py-1.5 px-2.5 rounded-lg border border-black/[0.1] dark:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Annual Index</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
