import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { activateLicense, verifyLicenseKey } from '../utils/licenseManager';
import { playSound } from '../utils/audio';

/**
 * Decide One 1-click URL license auto-activation hook.
 * Detects ?key=D1-... (plus legacy keys) or ?license=... upon return from Dodo Payments.
 * Verifies cryptographic checksum, plays audio chime, fires celebratory confetti,
 * and cleans the URL without reloading the page.
 */
export function useLicenseAutoActivation({ isMuted = false, onActivated } = {}) {
  const [justActivated, setJustActivated] = useState(false);
  const [activatedKey, setActivatedKey] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams(window.location.search);
      const candidateKey = params.get('key') || params.get('license') || params.get('license_key');

      if (!candidateKey) return;

      const cleanKey = candidateKey.trim().toUpperCase();

      if (verifyLicenseKey(cleanKey)) {
        const res = activateLicense(cleanKey);
        if (res.success) {
          setJustActivated(true);
          setActivatedKey(cleanKey);

          // Audio chime celebration
          playSound('patron-chime', isMuted);

          // Visual celebration with confetti
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#D4AF37', '#18181B', '#E4E4E7']
            });
          } catch (e) {
            // Ignore confetti errors if not in DOM context
          }

          // Clean URL without reloading page
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          onActivated?.(cleanKey);
        }
      }
    } catch (err) {
      console.warn('License auto-activation check failed:', err);
    }
  }, [isMuted, onActivated]);

  return { justActivated, activatedKey };
}
