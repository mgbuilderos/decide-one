import React from 'react';
import { BookOpen, Briefcase, Heart, Lightbulb, ShieldCheck } from 'lucide-react';
import { playSound } from '../utils/audio';

const VOLUME_ICONS = {
  vol_strategy: Briefcase,
  vol_personal: Heart,
  vol_creative: Lightbulb,
  vol_reflections: ShieldCheck
};

export default function VolumeSwitcherBar({
  volumes = [],
  activeVolumeId = 'vol_strategy',
  onSelectVolume,
  isMuted = false
}) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl backdrop-blur-md shadow-xs select-none">
      {volumes.map((vol, idx) => {
        const isSelected = vol.id === activeVolumeId;
        const Icon = VOLUME_ICONS[vol.id] || BookOpen;
        const hotkey = idx + 1;

        return (
          <button
            key={vol.id}
            type="button"
            onClick={() => {
              if (isSelected) return;
              playSound('page', isMuted);
              onSelectVolume?.(vol.id);
            }}
            title={`${vol.name}: ${vol.subtitle} (Cmd+${hotkey})`}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              isSelected
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">{vol.name}</span>
            <span className="inline md:hidden">Vol {vol.volumeNumber}</span>
            <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${
              isSelected ? 'bg-white/20 dark:bg-black/20 text-white dark:text-neutral-900' : 'text-neutral-400'
            }`}>
              ⌘{hotkey}
            </span>
          </button>
        );
      })}
    </div>
  );
}
