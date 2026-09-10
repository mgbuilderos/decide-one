import React from 'react';
import { Mic, Check, X, AlertCircle } from 'lucide-react';

export default function ExecutiveVoiceHUD({
  isListening,
  interimTranscript,
  targetDestination,
  onSelectTarget,
  audioLevel = 0,
  onStop,
  errorState,
  onDismissError
}) {
  if (!isListening && !errorState) return null;

  // Render Permission / Browser Support Notice
  if (errorState) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 no-print">
        <div className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2.5 rounded-full shadow-2xl border border-black/10 dark:border-white/20 flex items-center gap-3 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {errorState === 'permission-denied'
              ? 'Microphone access is blocked. Allow microphone permission in browser settings.'
              : 'Voice input requires Safari, Chrome, or Chromium Edge.'}
          </span>
          <button
            type="button"
            onClick={onDismissError}
            className="p-1 hover:opacity-75 cursor-pointer ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 5-Bar Dynamic Decibel Waveform Multipliers
  const bars = [0.4, 0.75, 1.0, 0.75, 0.4];

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 duration-200 no-print">
      <div className="bg-neutral-900/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-white/10 flex flex-col items-center gap-2.5 w-[360px] sm:w-[420px]">
        
        {/* Top Control Bar: Active Target Routing & Waveform */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-2">
          
          {/* Target Destination Switcher Pill */}
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => onSelectTarget('today')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                targetDestination === 'today'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onSelectTarget('top3')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                targetDestination === 'top3'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Top 3
            </button>
            <button
              type="button"
              onClick={() => onSelectTarget('reflection')}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                targetDestination === 'reflection'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Reflection
            </button>
          </div>

          {/* 5-Bar Amber/Gold Waveform Indicator */}
          <div className="flex items-center gap-1 h-5 px-2">
            {bars.map((mult, idx) => {
              const heightPct = Math.max(20, Math.min(100, (audioLevel * 100 * mult) + 20));
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className="w-1 rounded-full bg-amber-400 transition-all duration-75"
                />
              );
            })}
          </div>

          {/* Done / Stop Action */}
          <button
            type="button"
            onClick={onStop}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-neutral-400 hover:text-white"
            title="Complete Dictation"
          >
            <Check className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Real-time Transcription Stream */}
        <div className="w-full min-h-[42px] max-h-[72px] overflow-hidden flex items-center justify-center px-2 text-center">
          {interimTranscript ? (
            <p className="text-xs text-neutral-200 italic line-clamp-2 leading-relaxed font-normal">
              "{interimTranscript}..."
            </p>
          ) : (
            <p className="text-xs text-neutral-400 tracking-wide font-normal animate-pulse">
              Listening privately on-device... Speak naturally.
            </p>
          )}
        </div>

        {/* Footnote */}
        <div className="w-full flex items-center justify-between text-[10px] text-neutral-400 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>100% On-Device • Zero Cloud</span>
          </span>
          <span className="tabular-nums">Cmd+Shift+V to toggle</span>
        </div>

      </div>
    </div>
  );
}
