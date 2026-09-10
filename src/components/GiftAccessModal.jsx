import React, { useState } from 'react';
import { X, Heart, Copy, Check, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function GiftAccessModal({
  isOpen,
  onClose,
  ownerName = 'Maulik',
  isMuted = false
}) {
  const [senderName, setSenderName] = useState(ownerName || 'Maulik');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const giftUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?giftFrom=${encodeURIComponent(senderName.trim() || 'A Friend')}`
    : `https://decideone.app/?giftFrom=${encodeURIComponent(senderName.trim() || 'A Friend')}`;

  const handleCopyLink = () => {
    playSound('check', isMuted);
    navigator.clipboard.writeText(giftUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/55 dark:bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div 
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#151518] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-5 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Gift a Day of Focus
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
        <div className="p-5 space-y-4">
          
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Give someone the gift of quiet focus.
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Generate a personalized link. When your friend opens it, their notebook cover will greet them with a personal gift message from you.
            </p>
          </div>

          {/* Sender Name Input */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
              Your Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your name or initials..."
              className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-black/[0.12] dark:border-white/[0.15] bg-black/[0.02] dark:bg-white/[0.03] text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
            />
          </div>

          {/* Live Preview of Recipient's Greeting Ribbon */}
          <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/[0.04] text-amber-950 dark:text-amber-200 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Recipient's Cover Preview</span>
            </div>
            <div className="text-xs font-serif italic">
              "A quiet day gifted by {senderName.trim() || 'a friend'}. Open to begin your focus."
            </div>
          </div>

          {/* Link Copy Box */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={giftUrl}
                className="flex-1 px-3 py-2 text-[11px] rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 truncate focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Gift Link'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="h-10 px-5 bg-black/[0.015] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
          <span>Thoughtful Referral Loop</span>
          <span>Zero Ads • Pure Goodwill</span>
        </div>

      </div>

    </div>
  );
}
