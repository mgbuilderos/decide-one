import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Decide One Executive Privacy Shutter Hook
 * Listens for panic keys (Esc, Cmd+Shift+L), window blur, visibility change,
 * and idle inactivity timeout (e.g. 3 minutes).
 * Provides soft frost (visual blur) and hard lock (cryptographic gate).
 */
export function usePrivacyShutter({
  idleTimeoutMs = 180000, // 3 minutes default
  isVaultUnlocked = true,
  enabled = true,
  onHardLock
} = {}) {
  const [shutterState, setShutterState] = useState('UNLOCKED'); // 'UNLOCKED' | 'SOFT_FROST' | 'HARD_LOCKED'
  const idleTimerRef = useRef(null);
  const blurGraceTimerRef = useRef(null);

  const triggerHardLock = useCallback(() => {
    setShutterState('HARD_LOCKED');
    onHardLock?.();
  }, [onHardLock]);

  const triggerSoftFrost = useCallback(() => {
    setShutterState(prev => {
      if (prev === 'HARD_LOCKED') return prev;
      return 'SOFT_FROST';
    });

    if (blurGraceTimerRef.current) clearTimeout(blurGraceTimerRef.current);
    blurGraceTimerRef.current = setTimeout(() => {
      triggerHardLock();
    }, 20000); // 20s grace period before hard lock
  }, [triggerHardLock]);

  const resumeActive = useCallback(() => {
    if (blurGraceTimerRef.current) {
      clearTimeout(blurGraceTimerRef.current);
      blurGraceTimerRef.current = null;
    }
    setShutterState(prev => {
      if (prev === 'SOFT_FROST') return 'UNLOCKED';
      return prev;
    });
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (!isVaultUnlocked) return;

    idleTimerRef.current = setTimeout(() => {
      triggerHardLock();
    }, idleTimeoutMs);
  }, [idleTimeoutMs, isVaultUnlocked, triggerHardLock]);

  useEffect(() => {
    if (!enabled) {
      setShutterState('UNLOCKED');
      return;
    }

    const handleKeyDown = (e) => {
      // Panic key: Escape (only if not inside an open modal)
      if (e.key === 'Escape') {
        // If a modal is open, let modal close first, handled by modals
      }

      // Executive quick lock shortcut: Cmd + Shift + L or Ctrl + Shift + L
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        triggerHardLock();
        return;
      }

      resetIdleTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerSoftFrost();
      }
    };

    const handleBlur = () => {
      triggerSoftFrost();
    };

    const handleFocus = () => {
      resumeActive();
    };

    const activityEvents = ['pointermove', 'mousedown', 'keydown', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetIdleTimer, { passive: true }));

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (blurGraceTimerRef.current) clearTimeout(blurGraceTimerRef.current);
      activityEvents.forEach(evt => window.removeEventListener(evt, resetIdleTimer));
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, resetIdleTimer, triggerHardLock, triggerSoftFrost, resumeActive]);

  const unlockVaultManually = () => {
    setShutterState('UNLOCKED');
    resetIdleTimer();
  };

  return {
    shutterState,
    triggerHardLock,
    resumeActive,
    unlockVaultManually
  };
}
