import React, { useCallback } from 'react';
import { Lock } from 'lucide-react';
import { playSound } from '../utils/audio';

/** A visual shutter: one truthful message and one way back to the page. */
export default function ExecutivePrivacyOverlay({
  shutterState,
  onResumeFromSoftFrost,
  onUnlockVault,
  isMuted = false
}) {
  const showPage = useCallback(() => {
    playSound('click', isMuted);
    if (shutterState === 'SOFT_FROST') onResumeFromSoftFrost?.();
    else onUnlockVault?.();
  }, [isMuted, onResumeFromSoftFrost, onUnlockVault, shutterState]);

  if (shutterState === 'UNLOCKED') return null;

  return <div className="privacy-screen">
    <section className="privacy-card" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
      <Lock className="privacy-lock" aria-hidden="true" />
      <h1 id="privacy-title" className="type-page-title">DECIDE ONE</h1>
      <p className="type-body">Your page is hidden.</p>
      <button type="button" autoFocus onClick={showPage} className="privacy-show-button type-control">Show My Page</button>
    </section>
  </div>;
}
