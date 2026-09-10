import React from 'react';
import { playSound } from '../utils/audio';

export default function SpineAmbientGlow({
  isActive = false,
  onTriggerClosure,
  isMuted = false
}) {
  if (!isActive) return null;

  return (
    <div
      onClick={() => {
        playSound('click', isMuted);
        onTriggerClosure?.();
      }}
      className="ambient-gold-spine-glow hidden md:block group"
      title="Evening Horizon: Top 3 priorities await review. Click to begin Evening Closure."
    >
      {/* Micro Floating Tooltip on Hover */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50">
        <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg border border-black/10 flex items-center gap-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>Evening Horizon • 3 priorities await closure</span>
        </div>
      </div>
    </div>
  );
}
