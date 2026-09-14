import React, { useEffect } from 'react';
import { 
  X, 
  Check, 
  Moon, 
  Sun, 
  Download, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  FileText, 
  Feather, 
  Printer, 
  Target,
  Flame,
  ListOrdered,
  Compass,
  Shield,
  Upload
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { hasTelemetryConsent, setTelemetryConsent } from '../utils/telemetry';
import { FRAMEWORKS } from './ProductivityFrameworks';

export default function UnifiedMenuModal({
  isOpen,
  onClose,
  settings,
  updateSettings,
  activeFramework = 'rule_of_3',
  onSelectFramework,
  onExport,
  onOpenGuide,
  isPatron = false,
  onOpenUpgrade,
  onExportMarkdown,
  onPrintAnnual,
  onPrintWeeklyBriefing,
  onExportEncryptedVault,
  onImportEncryptedVault,
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  const toggleDarkMode = () => {
    playSound('click', settings.isMuted);
    const newDark = !settings.darkMode;
    updateSettings({ darkMode: newDark });
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // B3 — the person decides, and can change their mind. Default is off, and
  // an unanswered question counts as no.
  const [analyticsOn, setAnalyticsOn] = React.useState(() => hasTelemetryConsent());
  const toggleAnalytics = () => {
    const next = !analyticsOn;
    playSound('click', settings.isMuted);
    setTelemetryConsent(next);
    setAnalyticsOn(next);
  };

  const toggleSound = () => {
    playSound('click', false);
    updateSettings({ isMuted: !settings.isMuted });
  };

  if (!isOpen) return null;

  const currentFw = FRAMEWORKS.find(f => f.id === activeFramework) || FRAMEWORKS[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/45 dark:bg-black/75 backdrop-blur-sm animate-in fade-in select-none">
      
      {/* Backdrop Dismissal */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div 
        className="relative z-10 w-full max-w-lg bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.10] dark:border-white/[0.12] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Clean Minimalist Header */}
        <div className="h-12 px-5 sm:px-6 flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] shrink-0 bg-black/[0.01] dark:bg-white/[0.015]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
              Decide One Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Subtle Patron Pill */}
            {isPatron ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs whitespace-nowrap">
                Lifetime Access
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.isMuted);
                  onClose();
                  onOpenUpgrade?.();
                }}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-black/15 dark:border-white/20 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer whitespace-nowrap"
              >
                Lifetime Access
              </button>
            )}

            <button
              onClick={() => {
                playSound('click', settings.isMuted);
                onClose();
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pocket-scroll p-4 sm:p-5 space-y-4">

          {/* Workspace library */}
          {/* Direct method selection */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Choose Method
                </span>
              </div>
              <div className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-500 whitespace-nowrap">
                Active: <span className="text-neutral-900 dark:text-white font-bold">{currentFw.name}</span>
              </div>
            </div>

            {/* Three direct method controls */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                {
                  id: 'rule_of_3',
                  label: 'Top 3',
                  sub: 'Choose three',
                  icon: Target
                },
                {
                  id: 'eisenhower',
                  label: 'Matrix',
                  sub: 'Urgent / Important',
                  icon: Flame
                },
                {
                  id: 'ivy_lee',
                  label: 'Ivy Lee',
                  sub: 'Work in order',
                  icon: ListOrdered
                }
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = activeFramework === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      playSound('check', settings.isMuted);
                      onSelectFramework?.(m.id);
                    }}
                    className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[56px] ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'border-black/[0.08] dark:border-white/[0.08] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-0.5 shrink-0" />
                    <span className="text-[11px] font-bold leading-tight whitespace-nowrap">
                      {m.label}
                    </span>
                    <span className={`text-[9px] whitespace-nowrap mt-0.5 ${
                      isSelected ? 'text-white/80 dark:text-neutral-700' : 'text-neutral-400 dark:text-neutral-500'
                    }`}>
                      {m.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1 flex items-center justify-end gap-3 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    playSound('click', settings.isMuted);
                    onClose();
                    onOpenGuide?.();
                  }}
                  className="font-semibold text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>Guide</span>
                </button>
            </div>
          </div>

          {/* Section 2: Stationery (page grid, closure reminder, theme and audio) */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Stationery
                </span>
              </div>
            </div>

            {/* Row 1: Paper Texture */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">Paper Grid</span>
              <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.06] p-0.5 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
                {[
                  { id: 'dots', label: 'Dot-Grid' },
                  { id: 'square', label: 'Square' },
                  { id: 'plain', label: 'Plain' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playSound('click', settings.isMuted);
                      updateSettings({ paperStyle: p.id });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      settings.paperStyle === p.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 5: Ambient Nudges & Evening Closure */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white">Evening Closure Reminder</div>
                <div className="text-[10px] text-neutral-500">Local notification & gold spine glow</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={settings.closureReminderTime || '20:30'}
                  onChange={(e) => updateSettings({ closureReminderTime: e.target.value })}
                  className="px-2 py-0.5 text-xs font-semibold rounded-lg border border-black/[0.1] dark:border-white/[0.15] bg-transparent text-neutral-900 dark:text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    playSound('click', settings.isMuted);
                    updateSettings({ ambientRemindersEnabled: settings.ambientRemindersEnabled !== false ? false : true });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    settings.ambientRemindersEnabled !== false
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs'
                      : 'border border-black/[0.1] dark:border-white/[0.15] text-neutral-400'
                  }`}
                >
                  {settings.ambientRemindersEnabled !== false ? 'Enabled' : 'Off'}
                </button>
              </div>
            </div>

            {/* Row 6: Controls (Theme & Audio) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="py-1.5 px-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {settings.darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{settings.darkMode ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              <button
                type="button"
                onClick={toggleSound}
                className="py-1.5 px-2 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {settings.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{settings.isMuted ? 'Muted' : 'Audio On'}</span>
              </button>
            </div>
          </div>

          {/* Anonymous usage — off unless asked for (B3) */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Anonymous usage
                </div>
                <p className="mt-1 text-[11px] leading-[16px] text-neutral-500 dark:text-neutral-400">
                  {analyticsOn
                    ? 'Sharing which features get used. No task text is ever sent — only that something happened, never what you wrote.'
                    : 'Off. Nothing about how you use this leaves the device.'}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleAnalytics}
                aria-pressed={analyticsOn}
                className="shrink-0 py-1.5 px-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.06] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {analyticsOn ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {/* Section 3: Archival Vault Export & Print (Single Clean Row) */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Backup & Export
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Free JSON Backup */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.isMuted);
                  onExport();
                }}
                className="py-2 px-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[11px] font-bold whitespace-nowrap">JSON Backup</span>
                <span className="text-[9px] text-neutral-500 whitespace-nowrap">Full JSON</span>
              </button>

              {/* Weekly Briefing PDF */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.isMuted);
                  onPrintWeeklyBriefing?.();
                }}
                className="py-2 px-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                </div>
                <span className="text-[11px] font-bold whitespace-nowrap">Weekly Review</span>
                <span className="text-[9px] text-neutral-500 whitespace-nowrap">Weekly PDF</span>
              </button>

              {/* Patron Markdown Export */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.isMuted);
                  onExportMarkdown?.();
                }}
                className="py-2 px-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                </div>
                <span className="text-[11px] font-bold whitespace-nowrap">Markdown Vault</span>
                <span className="text-[9px] text-neutral-500 whitespace-nowrap">Obsidian / Notion</span>
              </button>

              {/* Patron Print Engine */}
              <button
                type="button"
                onClick={() => {
                  playSound('click', settings.isMuted);
                  onPrintAnnual?.();
                }}
                className="py-2 px-1.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-xs font-medium flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                </div>
                <span className="text-[11px] font-bold whitespace-nowrap">Annual Archive</span>
                <span className="text-[9px] text-neutral-500 whitespace-nowrap">Full Year PDF</span>
              </button>
            </div>

            {/* Air-Gapped Encrypted Vault (.vault) */}
            <div className="pt-2.5 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">
                    Air-Gapped Encrypted Vault (.vault)
                  </div>
                  <div className="text-[9px] text-neutral-500 truncate">
                    AES-GCM-256 • PBKDF2 100K Iterations • Zero Cloud
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <label className="py-1 px-2 rounded-lg border border-black/[0.08] dark:border-white/[0.1] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer flex items-center gap-1">
                  <Upload className="w-2.5 h-2.5" />
                  <span>Restore</span>
                  <input
                    type="file"
                    accept=".vault"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImportEncryptedVault?.(file);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    playSound('clasp-lock', settings.isMuted);
                    onExportEncryptedVault?.();
                  }}
                  className="py-1 px-2.5 rounded-lg text-[10px] font-bold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
                >
                  Export .vault
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Bar (Nameplate + Done Action) */}
        <div className="h-12 px-5 sm:px-6 bg-black/[0.015] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-500 whitespace-nowrap">Owner:</span>
            <input
              type="text"
              value={settings.ownerName || 'Maulik'}
              onChange={(e) => updateSettings({ ownerName: e.target.value })}
              placeholder="Name..."
              className="px-2 py-0.5 text-xs font-bold rounded-lg border border-black/[0.12] dark:border-white/[0.15] bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white w-28 sm:w-36"
            />
          </div>

          <button
            onClick={() => {
              playSound('click', settings.isMuted);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-2xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
