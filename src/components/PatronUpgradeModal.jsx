import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  KeyRound, 
  ShieldCheck, 
  Feather, 
  Printer,
  Search,
  Lock,
  BookOpen
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { activateLicense } from '../utils/licenseManager';

export default function PatronUpgradeModal({
  isOpen,
  onClose,
  isMuted = false,
  onLicenseUpdated
}) {
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [activationError, setActivationError] = useState('');
  const [activationSuccess, setActivationSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleActivate = async (keyToTry = null) => {
    const key = (keyToTry || licenseKeyInput).trim();
    if (!key) {
      setActivationError('Please enter your license key.');
      return;
    }

    const res = await activateLicense(key);
    if (res.success) {
      playSound('patron-chime', isMuted);
      setActivationSuccess(true);
      setActivationError('');
      onLicenseUpdated?.();
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      playSound('click', isMuted);
      setActivationError('That licence key could not be verified. Check it was pasted in full.');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      
      {/* Backdrop Click Dismissal */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="relative z-10 w-full max-w-lg max-h-[92vh] bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-black/[0.12] dark:border-white/[0.15] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="h-14 px-5 sm:px-6 flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] shrink-0 bg-black/[0.015] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-900 dark:text-neutral-100">
              Decide One Access
            </span>
          </div>
          <button
            onClick={() => {
              playSound('click', isMuted);
              onClose();
            }}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto pocket-scroll p-5 sm:p-6 space-y-5">
          
          {/* Hero Banner */}
          <div className="text-center space-y-1.5 pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              <Sparkles className="w-3 h-3" />
              <span>Lifetime Access</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Keep Decide One Forever.
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Everything here is free and stays free. If it earns it, you will be asked once at the end of a day you have closed — never before, and never in the way.
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl border border-black/[0.12] dark:border-white/[0.15] bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Lifetime License
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">Free</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">No account, no subscription</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Perpetual</span>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 px-1">
              Included With Lifetime Access
            </div>

            <div className="space-y-2">
              {[
                {
                  icon: BookOpen,
                  title: 'Separate Workspaces',
                  desc: 'Keep priorities for work, projects, and personal life in distinct on-device spaces.'
                },
                {
                  icon: Search,
                  title: 'Search Your Work',
                  desc: 'Use Cmd+K to find anything you have written, across every date.'
                },
                {
                  icon: Lock,
                  title: 'Privacy Shutter & Protected Exports',
                  desc: 'Hide the workspace from view and create a passphrase-protected export. Work stored in this browser is not encrypted at rest.'
                },
                {
                  icon: Printer,
                  title: 'Weekly Review PDF',
                  desc: 'Create a printable weekly summary for review or a personal backup.'
                },
                {
                  icon: Feather,
                  title: 'Page & Ink Appearance',
                  desc: 'Choose ink and page styles. Export your work in portable formats.'
                }
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {feat.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal mt-0.5">
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout is deliberately absent until the payment integration is complete. */}
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-black/[0.035] dark:bg-white/[0.055] border border-black/[0.10] dark:border-white/[0.12] flex items-start gap-3">
              <Lock className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">Checkout Connection Pending</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">No payment is requested or processed in this build. Existing licence holders can still activate below.</div>
              </div>
            </div>

            {/* In-App License Activation Dialog */}
            <div className="p-3.5 rounded-xl border border-dashed border-black/[0.15] dark:border-white/[0.15] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Enter Custom Key
                  </span>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-neutral-400">
                  From your receipt
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseKeyInput}
                  onChange={(e) => {
                    setLicenseKeyInput(e.target.value);
                    setActivationError('');
                  }}
                  placeholder="Paste the licence key from your receipt"
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-black/[0.12] dark:border-white/[0.15] bg-transparent text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white uppercase placeholder:normal-case"
                />
                <button
                  type="button"
                  onClick={() => handleActivate()}
                  disabled={activationSuccess}
                  className="px-3 py-1.5 rounded-lg border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                >
                  Activate
                </button>
              </div>

              {activationError && (
                <div className="text-[11px] text-red-500 dark:text-red-400 font-medium">
                  {activationError}
                </div>
              )}

              {activationSuccess && (
                <div className="text-[11px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Lifetime Access Activated.</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="h-11 px-6 bg-black/[0.02] dark:bg-white/[0.03] border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-400 shrink-0">
          <span>On-Device By Default</span>
          <span>Version 2.0</span>
        </div>

      </div>
    </div>
  );
}
