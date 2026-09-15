import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart3, BookOpen, ChevronDown, Download, FileText, Grid2X2,
  ListOrdered, Lock, Mic, Moon, Printer, Scale, Shield, Sun, Sunset,
  Target, Upload, Volume2, VolumeX, X
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { hasTelemetryConsent, setTelemetryConsent } from '../utils/telemetry';
import { FRAMEWORKS } from './ProductivityFrameworks';

export default function UnifiedMenuModal({
  isOpen, onClose, settings, updateSettings, activeFramework,
  onSelectFramework, onExport, onOpenGuide,
  onExportMarkdown, onPrintAnnual, onPrintWeeklyBriefing,
  onExportEncryptedVault, onImportEncryptedVault, onOpenDecisions, onOpenAnalytics,
  onOpenClosure, onToggleDictation, isListening = false,
  onLockVault, onOpenMethods, onOpenLegal
}) {
  const closeButtonRef = useRef(null);
  const restoreMenuTriggerRef = useRef(true);
  const [analyticsOn, setAnalyticsOn] = useState(() => hasTelemetryConsent());

  useEffect(() => {
    if (!isOpen) return undefined;
    restoreMenuTriggerRef.current = true;
    closeButtonRef.current?.focus();
    return () => {
      if (restoreMenuTriggerRef.current) {
        requestAnimationFrame(() => document.getElementById('instrument-menu-trigger')?.focus());
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleDialogKeys = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = document.getElementById('unified-menu');
      const focusable = [...(dialog?.querySelectorAll('button, a[href], input, summary') || [])]
        .filter((element) => !element.disabled
          && element.getClientRects().length > 0
          && (element.tagName === 'SUMMARY' || !element.closest('details:not([open])')));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleDialogKeys);
    return () => window.removeEventListener('keydown', handleDialogKeys);
  }, [isOpen, onClose]);

  const runAndClose = (action) => {
    playSound('click', settings.isMuted);
    restoreMenuTriggerRef.current = false;
    onClose();
    action?.();
  };

  const toggleDarkMode = () => {
    playSound('click', settings.isMuted);
    const darkMode = !settings.darkMode;
    updateSettings({ darkMode });
    document.documentElement.classList.toggle('dark', darkMode);
  };

  const toggleSound = () => {
    playSound('click', false);
    updateSettings({ isMuted: !settings.isMuted });
  };

  const toggleAnalytics = () => {
    const next = !analyticsOn;
    playSound('click', settings.isMuted);
    setTelemetryConsent(next);
    setAnalyticsOn(next);
  };

  if (!isOpen) return null;

  const quickActions = [
    ['DECISION SPACE', Scale, onOpenDecisions],
    ['Review Progress', BarChart3, onOpenAnalytics],
    ['Close Day', Sunset, onOpenClosure],
    [isListening ? 'Stop Dictation' : 'Dictate', Mic, onToggleDictation],
    ['Privacy Shutter', Lock, onLockVault]
  ];
  const methodIcons = { rule_of_3: Target, ivy_lee: ListOrdered, eisenhower: Grid2X2 };
  const methodLabels = { rule_of_3: 'Top 3', ivy_lee: 'Ivy Lee', eisenhower: 'Matrix' };
  const exports = [
    ['JSON Backup', Download, onExport],
    ['Weekly Review', Printer, onPrintWeeklyBriefing],
    ['Markdown Vault', FileText, onExportMarkdown],
    ['Annual Archive', BookOpen, onPrintAnnual],
    ['Export .vault', Shield, onExportEncryptedVault]
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/45 dark:bg-black/75 select-none">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div id="unified-menu" role="dialog" aria-modal="true" aria-labelledby="unified-menu-title"
        className="relative z-10 w-full max-w-[440px] max-h-[calc(100dvh-24px)] bg-white dark:bg-[#151515] text-neutral-900 dark:text-neutral-100 border border-black/[0.12] dark:border-white/[0.15] rounded-xl flex flex-col overflow-hidden"
        onClick={(event) => event.stopPropagation()}>
        <div className="min-h-12 px-4 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.10] shrink-0">
          <h1 id="unified-menu-title" className="type-section-title">Menu</h1>
          <button ref={closeButtonRef} type="button" onClick={onClose}
            className="w-10 h-10 inline-flex items-center justify-center" aria-label="Close Menu"><X size={17} /></button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pocket-scroll p-4 space-y-3">
          <section aria-labelledby="menu-methods-heading">
            <h2 id="menu-methods-heading" className="type-label mb-2">Choose Method</h2>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Prioritization Methods">
              {FRAMEWORKS.map((method) => {
                const Icon = methodIcons[method.id];
                return (
                  <button key={method.id} type="button"
                    aria-label={method.name} title={`${method.name} — ${method.subtitle}`}
                    aria-pressed={activeFramework === method.id}
                    onClick={() => {
                      restoreMenuTriggerRef.current = false;
                      onClose();
                      onSelectFramework?.(method.id);
                    }}
                    className="menu-method-choice type-control min-h-14 px-2 py-2 flex flex-col items-center justify-center gap-1 text-center">
                    <Icon size={17} aria-hidden="true" /><span>{methodLabels[method.id]}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="border-t border-black/[0.08] dark:border-white/[0.10] pt-3" aria-labelledby="menu-paper-heading">
            <h2 id="menu-paper-heading" className="type-label mb-2">Paper Grid</h2>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Paper Style">
              {[['dots', 'Dot Grid'], ['square', 'Square Grid'], ['plain', 'Plain']].map(([id, label]) => (
                <button key={id} type="button" aria-label={`${label} Paper`} aria-pressed={settings.paperStyle === id}
                  onClick={() => { playSound('click', settings.isMuted); updateSettings({ paperStyle: id }); }}
                  className="menu-paper-choice type-control min-h-14 px-2 py-2 flex flex-col items-center justify-center gap-1 text-center">
                  <span className={`paper-style-swatch paper-style-${id}`} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          <details className="menu-disclosure border-t border-black/[0.08] dark:border-white/[0.10] pt-1">
            <summary className="type-control min-h-11 flex items-center justify-between cursor-pointer">
              <span>Work Actions</span><ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="grid grid-cols-3 gap-2 pb-2">
              {quickActions.map(([label, Icon, action]) => (
                <button key={label} type="button" onClick={() => runAndClose(action)}
                  className="type-control min-h-14 px-2 py-2 border border-black/[0.10] dark:border-white/[0.12] flex flex-col items-center justify-center gap-1 text-center hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                  <Icon size={17} aria-hidden="true" /><span>{label}</span>
                </button>
              ))}
            </div>
          </details>

          <details className="menu-disclosure border-t border-black/[0.08] dark:border-white/[0.10] pt-1">
            <summary className="type-control min-h-11 flex items-center justify-between cursor-pointer">
              <span>Preferences</span><ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="space-y-4 pb-2">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={toggleDarkMode}
                  className="type-control min-h-10 border border-black/[0.10] dark:border-white/[0.12] flex items-center justify-center gap-2">
                  {settings.darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{settings.darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                </button>
                <button type="button" onClick={toggleSound}
                  className="type-control min-h-10 border border-black/[0.10] dark:border-white/[0.12] flex items-center justify-center gap-2">
                  {settings.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{settings.isMuted ? 'Sound Off' : 'Sound On'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="menu-owner" className="type-control shrink-0">Name</label>
                <input id="menu-owner" type="text" value={settings.ownerName || ''}
                  onChange={(event) => updateSettings({ ownerName: event.target.value })} placeholder="Optional"
                  className="type-control min-w-0 w-full min-h-9 px-2 bg-transparent border border-black/[0.12] dark:border-white/[0.15]" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <label htmlFor="menu-reminder-time" className="type-control block">Evening Closure Reminder</label>
                  <span className="type-metadata text-neutral-500 dark:text-neutral-400">Local notification</span>
                </div>
                <input id="menu-reminder-time" type="time" value={settings.closureReminderTime || '20:30'}
                  onChange={(event) => updateSettings({ closureReminderTime: event.target.value })}
                  className="type-control w-[92px] min-h-9 px-1 bg-transparent border border-black/[0.12] dark:border-white/[0.15]" />
                <button type="button" aria-label="Toggle Evening Closure Reminder"
                  aria-pressed={settings.ambientRemindersEnabled !== false}
                  onClick={() => updateSettings({ ambientRemindersEnabled: settings.ambientRemindersEnabled === false })}
                  className="type-control min-h-9 px-2 border border-black/[0.12] dark:border-white/[0.15]">
                  {settings.ambientRemindersEnabled !== false ? 'On' : 'Off'}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="type-control block">Anonymous Usage</span>
                  <p className="type-metadata text-neutral-500 dark:text-neutral-400">
                    {analyticsOn
                      ? 'Sharing which features get used. No task text is ever sent — only that something happened, never what you wrote.'
                      : 'Off. Nothing about how you use this leaves the device.'}
                  </p>
                </div>
                <button type="button" onClick={toggleAnalytics} aria-pressed={analyticsOn}
                  className="type-control shrink-0 min-h-9 px-3 border border-black/[0.12] dark:border-white/[0.15]">
                  {analyticsOn ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </details>

          <details className="menu-disclosure border-t border-black/[0.08] dark:border-white/[0.10] pt-1">
            <summary className="type-control min-h-11 flex items-center justify-between cursor-pointer">
              <span>Backup &amp; Export</span><ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div className="grid grid-cols-2 gap-2 pb-3">
              {exports.map(([label, Icon, action]) => (
                <button key={label} type="button" onClick={() => runAndClose(action)}
                  className="type-control min-h-11 px-2 border border-black/[0.10] dark:border-white/[0.12] flex items-center gap-2 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                  <Icon size={16} className="shrink-0" aria-hidden="true" /><span>{label}</span>
                </button>
              ))}
              <label className="type-control min-h-11 px-2 border border-black/[0.10] dark:border-white/[0.12] flex items-center gap-2 cursor-pointer hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                <Upload size={16} className="shrink-0" aria-hidden="true" /><span>Restore .vault</span>
                <input type="file" accept=".vault" className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) { onImportEncryptedVault?.(file); event.target.value = ''; }
                  }} />
              </label>
            </div>
          </details>

          <details className="menu-disclosure border-t border-black/[0.08] dark:border-white/[0.10] pt-1">
            <summary className="type-control min-h-11 flex items-center justify-between cursor-pointer">
              <span>Guides &amp; Legal</span><ChevronDown size={16} aria-hidden="true" />
            </summary>
            <nav className="grid grid-cols-2 gap-x-3 pb-2" aria-label="Guides And Legal">
              <button type="button" className="type-control min-h-10 text-left" onClick={() => runAndClose(onOpenGuide)}>Quick Guide</button>
              <a className="type-control min-h-10 inline-flex items-center" href="/guides/">Guides</a>
              <a className="type-control min-h-10 inline-flex items-center" href="/faq/">Questions</a>
              <button type="button" className="type-control min-h-10 text-left" onClick={() => runAndClose(onOpenMethods)}>Methods &amp; Attributions</button>
              <button type="button" className="type-control min-h-10 text-left" onClick={() => runAndClose(onOpenLegal)}>Terms, Privacy &amp; Refunds</button>
            </nav>
          </details>
        </div>
      </div>
    </div>
  );
}
