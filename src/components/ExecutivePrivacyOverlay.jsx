import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Fingerprint, ShieldCheck, Sun, Moon } from 'lucide-react';
import { playSound } from '../utils/audio';
import { authenticateWithBiometrics } from '../utils/cryptoVault';

export default function ExecutivePrivacyOverlay({
  shutterState, // 'UNLOCKED' | 'SOFT_FROST' | 'HARD_LOCKED'
  ownerName = 'Maulik',
  onResumeFromSoftFrost,
  onUnlockVault,
  isMuted = false,
  currentDate = null,
  settings = {},
  updateSettings = null
}) {
  const [passphrase, setPassphrase] = useState('');
  const [biometricNote, setBiometricNote] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const dateObj = currentDate || new Date();
  const formattedMonth = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  const dayOfMonth = dateObj.getDate();
  const formattedWeekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDateStr = `${formattedWeekday}, ${formattedMonth} ${dayOfMonth}, ${year}`;

  // Digital Swiss Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = useCallback(() => {
    playSound('patron-chime', isMuted);
    onUnlockVault?.();
    setPassphrase('');
  }, [isMuted, onUnlockVault]);

  /**
   * This is a shutter, not a vault.
   *
   * It hides the page from the room — shoulders, screen-shares, a passing
   * colleague. It is not a security boundary and must never be described as
   * one: entries live in this browser's localStorage, so anyone with the
   * unlocked device can read them without going through this screen at all.
   *
   * Where the platform provides real biometrics we use them, because it costs
   * nothing and is a nicer gesture. Where it does not, we say so rather than
   * reporting a check that never ran.
   */
  const handleBiometricUnlock = async () => {
    playSound('click', isMuted);
    const res = await authenticateWithBiometrics(ownerName).catch(() => ({ success: false }));
    if (res?.success) {
      handleUnlock();
      return;
    }
    setBiometricNote(
      res?.reason === 'cancelled'
        ? 'Cancelled.'
        : 'This device has no biometric check available.'
    );
  };

  // Any input reopens the shutter, deliberately: it exists to clear the screen,
  // not to withhold the data. Pretending otherwise would be the dishonest part.
  const handleFormSubmit = (e) => {
    e?.preventDefault();
    handleUnlock();
  };

  const toggleTheme = () => {
    playSound('click', isMuted);
    const nextDark = !settings?.darkMode;
    updateSettings?.({ darkMode: nextDark });
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (shutterState === 'UNLOCKED') return null;

  // 1. Soft Frost View: Minimalist Stationery Card on Frosted Glass
  if (shutterState === 'SOFT_FROST') {
    return (
      <div
        onClick={() => {
          playSound('click', isMuted);
          onResumeFromSoftFrost?.();
        }}
        className="fixed inset-0 z-[150] backdrop-blur-2xl bg-black/40 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none p-4 animate-in fade-in"
      >
        <div className="relative text-center p-8 sm:p-10 rounded-[26px] bg-white/95 dark:bg-[#141416]/95 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-xl max-w-sm w-full mx-4">
          <div 
            className="woven-fabric-tag cursor-default"
            title="Decide One Priority Instrument"
          >
            DECIDE ONE
          </div>
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-black/10 dark:border-white/20 bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center text-neutral-800 dark:text-white/80">
            <Lock className="w-5 h-5" />
          </div>
          <p className="text-[10px] tracking-[0.25em] text-neutral-500 dark:text-white/50 uppercase font-bold">
            Privacy Shutter
          </p>
          <p className="text-sm text-neutral-900 dark:text-white/90 mt-2 font-medium">
            Your screen is protected. Click anywhere to resume.
          </p>
        </div>
      </div>
    );
  }

  // 2. Hard Locked View: Authentic Decide One Priority Instrument on Neutral Stage
  return (
    <div className="fixed inset-0 z-[150] bg-[#EAEAE7] dark:bg-[#0B0B0D] flex flex-col justify-between items-center select-none overflow-y-auto font-sans p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Top Floating Capsule Header */}
      <header className="w-full max-w-[412px] md:max-w-[420px] mx-auto flex items-center justify-between px-1 py-1 shrink-0 z-20 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.12] shadow-xs text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>Decide One Vault</span>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          title="Toggle Dark / Light Mode"
          className="p-2 rounded-full bg-white/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.12] shadow-xs hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer"
        >
          {settings?.darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </header>

      {/* Center Stage: Authentic Stationery Locked Notebook */}
      <div className="w-full max-w-[412px] md:max-w-[420px] mx-auto my-auto flex flex-col justify-center items-center relative">
        <div className="w-full bg-white dark:bg-[#141416] text-neutral-900 dark:text-neutral-100 p-6 sm:p-8 rounded-[26px] flex flex-col justify-between items-center relative shadow-2xl embossed-notebook paper-block-edge border border-black/[0.08] dark:border-white/[0.08] select-none">
          
          {/* Authentic Folded Woven Twill Brand Tag (Tucked under paper edge) */}
          <div 
            className="woven-fabric-tag cursor-default"
            title="Decide One Priority Instrument"
          >
            DECIDE ONE
          </div>

          {/* Subtle Hairline Perimeter Inner Frame */}
          <div className="w-full h-full border border-black/[0.06] dark:border-white/[0.06] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between items-center text-center relative">
            
            {/* Top Monogram Header */}
            <div className="flex flex-col items-center pt-1 sm:pt-2 gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-neutral-500 dark:text-neutral-500">
                Confidential Sanctuary
              </span>
            </div>

            {/* Center Content: Clock, Date, Owner Seal */}
            <div className="my-auto py-2 flex flex-col items-center w-full">
              
              {/* Swiss Tabular Digital Clock */}
              <div className="text-4xl sm:text-5xl font-light tracking-tight tabular-nums text-neutral-900 dark:text-white mb-1">
                {currentTime}
              </div>

              {/* Date Stamp */}
              <div className="text-xs font-semibold tracking-widest text-neutral-500 dark:text-neutral-500 uppercase mb-2">
                {formattedDateStr}
              </div>

              {/* Aspirational Apple Kicker */}
              <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                One priority. Zero noise.
              </div>

              {/* Owner Personalized Monogram & Name */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] mb-3.5">
                <div className="w-5 h-5 rounded-full bg-amber-500/[0.12] border border-amber-500/30 flex items-center justify-center shadow-2xs">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    {(ownerName || 'M').charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {ownerName}'s Decide One
                </span>
              </div>

              {/* Primary Biometric Unlock Action */}
              <button
                type="button"
                onClick={handleBiometricUnlock}
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-md cursor-pointer mb-2.5"
              >
                <Fingerprint className="w-4 h-4 text-amber-400 dark:text-amber-500" />
                <span>Unlock with Touch ID / Face ID</span>
              </button>

              {/* Inline PIN Passcode Form */}
              <form onSubmit={handleFormSubmit} className="w-full space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Press enter to reopen"
                    value={passphrase}
                    onChange={(e) => {
                      setPassphrase(e.target.value);
                    }}
                    className="flex-1 h-10 px-4 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/15 text-center text-xs tracking-widest font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-xl border border-black/15 dark:border-white/20 bg-black/[0.05] dark:bg-white/[0.1] hover:bg-black/[0.1] dark:hover:bg-white/[0.15] text-neutral-900 dark:text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Unlock
                  </button>
                </div>

                <div className="flex items-center justify-center pt-0.5">
                  <button
                    type="button"
                    onClick={handleUnlock}
                    className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Reopen the page"
                  >
                    Reopen
                  </button>
                </div>

                {biometricNote && (
                  <p className="text-neutral-500 dark:text-neutral-400 text-[11px] font-medium pt-0.5">
                    {biometricNote}
                  </p>
                )}
              </form>

            </div>

            {/* Bottom Security Footer: Apple Card Language (User Benefit Focus) */}
            <div className="w-full pt-3 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.14em] px-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                <span>Screen hidden</span>
              </span>
              <span>Uncompromised Focus</span>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Subtle Stationery Edition Mark */}
      <div className="text-[10px] tracking-widest uppercase font-semibold text-neutral-500 dark:text-neutral-500 mt-auto pb-1 shrink-0">
        Decide One Priority Edition
      </div>

    </div>
  );
}
