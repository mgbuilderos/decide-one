import React, { useState, useRef } from 'react';
import { 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  Copy, 
  Share2, 
  Sparkles, 
  Heart,
  Feather
} from 'lucide-react';
import { playSound } from '../utils/audio';

export default function DailyVictoryCardModal({
  isOpen,
  onClose,
  date = new Date(),
  tasks = [],
  activeFrameworkName = 'Top 3',
  isMuted = false,
  ownerName = 'Maulik'
}) {
  const [maskPrivate, setMaskPrivate] = useState(false);
  const [cardTheme, setCardTheme] = useState('cream'); // 'cream' | 'white' | 'dark'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const completedCount = tasks.filter(t => t.completed || t.type === 'done').length;
  const totalCount = tasks.length || 3;
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyText = () => {
    playSound('check', isMuted);
    const textToCopy = `📓 Closed my day with clarity on Decide One.\n✓ ${completedCount}/${totalCount} Key Outcomes Conquered\n\n100% Offline & Private • Zero Subscriptions`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    playSound('click', isMuted);
    const tweet = encodeURIComponent(`Closed my day with clarity on @DecideOneApp.\n✓ ${completedCount}/${totalCount} outcomes conquered.`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    playSound('click', isMuted);
    const shareUrl = encodeURIComponent(window.location.origin);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/55 dark:bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      
      {/* Backdrop Dismissal */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#151518] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Daily Victory Card
            </span>
          </div>
          <button
            onClick={() => {
              playSound('click', isMuted);
              onClose();
            }}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto pocket-scroll">
          
          {/* Controls Bar: Privacy Mask & Card Theme */}
          <div className="flex items-center justify-between text-xs pb-1">
            
            {/* Privacy Redaction Toggle */}
            <button
              type="button"
              onClick={() => {
                playSound('click', isMuted);
                setMaskPrivate(!maskPrivate);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
                maskPrivate
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'border-black/15 dark:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-700 dark:text-neutral-300'
              }`}
              title="Blur out task text to keep private notes confidential"
            >
              {maskPrivate ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{maskPrivate ? 'Notes Masked (Private)' : 'Mask Private Notes'}</span>
            </button>

            {/* Paper Tone Chooser */}
            <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-full border border-black/[0.06] dark:border-white/[0.08]">
              {[
                { id: 'cream', label: 'Vellum' },
                { id: 'white', label: 'White' },
                { id: 'dark', label: 'Ink' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    playSound('click', isMuted);
                    setCardTheme(t.id);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    cardTheme === t.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

          </div>

          {/* =========================================================================
              THE AESTHETIC SHAREABLE VICTORY LEAF
              ========================================================================= */}
          <div 
            className={`rounded-2xl p-5 sm:p-6 border shadow-lg transition-all space-y-4 ${
              cardTheme === 'cream'
                ? 'bg-[#FAF7EE] text-[#1A1815] border-[#E8E2D2]'
                : cardTheme === 'white'
                  ? 'bg-white text-neutral-900 border-black/15'
                  : 'bg-[#141417] text-[#FAF9F5] border-white/15'
            }`}
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.11) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            {/* Top Leaf Masthead */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                  {formattedDate}
                </div>
                <div className="text-xs font-bold tracking-wide mt-0.5">
                  A Day of Clarity
                </div>
              </div>

              {/* Monogram Seal */}
              <div className="w-8 h-8 rounded-full border border-amber-500/40 bg-amber-400/10 flex items-center justify-center font-bold text-xs tracking-wider text-amber-900 dark:text-amber-200">
                {ownerName ? ownerName.substring(0, 2).toUpperCase() : 'PB'}
              </div>
            </div>

            {/* Victory Metrics */}
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-2xl font-black tracking-tight flex items-baseline gap-1">
                  <span>{completedCount}</span>
                  <span className="text-sm font-normal opacity-50">/ {totalCount}</span>
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  Key Outcomes Conquered
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/10">
                  <span>🎯</span>
                  <span>{activeFrameworkName}</span>
                </span>
                <div className="text-[10px] font-medium opacity-60 mt-1">
                  Mental Clarity Protected
                </div>
              </div>
            </div>

            {/* Conquered Outcomes List */}
            <div className="space-y-2 py-1">
              {tasks.length > 0 ? (
                tasks.slice(0, 3).map((task, idx) => {
                  const isDone = task.completed || task.type === 'done';
                  return (
                    <div 
                      key={task.id || idx} 
                      className="flex items-center gap-2.5 text-xs py-1 px-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.03]"
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isDone ? 'progress-ink-green' : 'opacity-40'
                      }`}>
                        {isDone ? '✓' : '•'}
                      </span>
                      <span className={`flex-1 min-w-0 font-medium truncate ${
                        maskPrivate ? 'blur-xs select-none opacity-40' : ''
                      } ${isDone ? 'line-through opacity-70' : ''}`}>
                        {maskPrivate ? 'Strategic outcome confidential' : (task.text || task.title || `Priority outcome 0${idx + 1}`)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs italic opacity-60 py-2 text-center">
                  3 key priorities completed with quiet focus.
                </div>
              )}
            </div>

            {/* Authentic Paper Stamp Footer */}
            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] opacity-60">
              <span className="font-semibold tracking-wider uppercase">DECIDE ONE INSTRUMENT</span>
              <span>100% Offline • Zero SaaS</span>
            </div>

          </div>

          {/* Social Share Actions */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="py-2.5 px-3 rounded-xl border border-black/15 dark:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 progress-ink-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={handleShareX}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share on X / Twitter</span>
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
              >
                Share on LinkedIn
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="h-10 px-5 bg-black/[0.015] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
          <span>End-of-Day Review</span>
          <span>Close with a clear head</span>
        </div>

      </div>

    </div>
  );
}
