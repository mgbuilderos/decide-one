import { useEffect, useState } from 'react';
import { activateLicense, verifyAnyLicenseKey } from '../utils/licenseManager';
import { looksLikeSignedKey } from '../utils/licenseKeys';
import { playSound } from '../utils/audio';

/**
 * Decide One 1-click URL license auto-activation hook.
 * Detects ?key=D1-... (plus legacy keys) or ?license=... upon return from Dodo Payments.
 * Verifies cryptographic checksum, plays audio chime, and cleans the URL
 * without reloading the page.
 */
export function useLicenseAutoActivation({ isMuted = false, onActivated } = {}) {
  const [justActivated, setJustActivated] = useState(false);
  const [activatedKey, setActivatedKey] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    // Signed keys are verified with WebCrypto, so this is async. The effect
    // itself stays synchronous and the work runs in an inner task, with a
    // cancellation flag so an unmount cannot set state afterwards.
    (async () => {
      try {
      const params = new URLSearchParams(window.location.search);
      const candidateKey = params.get('key') || params.get('license') || params.get('license_key');

      if (!candidateKey) return;
      if (cancelled) return;

      // Signed keys are base64url: upper-casing one breaks its signature, so
      // only legacy keys are normalised.
      const raw = candidateKey.trim();
      const cleanKey = looksLikeSignedKey(raw) ? raw : raw.toUpperCase();

      const check = await verifyAnyLicenseKey(cleanKey);
      if (check.valid) {
        const res = await activateLicense(cleanKey);
        if (res.success && !cancelled) {
          setJustActivated(true);
          setActivatedKey(cleanKey);

          // Audio chime celebration
          playSound('patron-chime', isMuted);

          // Clean URL without reloading page
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          onActivated?.(cleanKey);
        }
      }
      } catch (err) {
        console.warn('License auto-activation check failed:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [isMuted, onActivated]);

  return { justActivated, activatedKey };
}
