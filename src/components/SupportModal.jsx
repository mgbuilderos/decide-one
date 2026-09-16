import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import {
  SUPPORT_CHANNELS,
  UPI_AMOUNTS,
  SPONSOR_TIERS,
  formatInr,
  formatUsd,
  upiPaymentUrl,
  validUpiAmount,
  isLikelyIndiaVisitor
} from '../utils/support';

/**
 * Support Decide One — UPI in India, GitHub Sponsors everywhere else.
 *
 * Copy and suggested amounts are VISION.md §11.1 "Open source and support".
 * Nothing unlocks, no payment code loads, and nothing about who supports is
 * recorded: the QR code and the upi:// link hand off to the person's own app.
 */
const BORDER = 'border border-black/[0.12] dark:border-white/[0.15]';
const PRIMARY = 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900';
const QUIET = 'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]';

export default function SupportModal({ isOpen, onClose, channels = SUPPORT_CHANNELS }) {
  const hasUpi = Boolean(channels.upiId);
  const hasGitHub = Boolean(channels.sponsorsUrl || channels.repoUrl);
  const [tab, setTab] = useState(() => (hasUpi && (!hasGitHub || isLikelyIndiaVisitor()) ? 'upi' : 'github'));
  const [preset, setPreset] = useState(UPI_AMOUNTS[1].inr);
  const [custom, setCustom] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const [copied, setCopied] = useState(false);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const amount = (custom === '' ? null : validUpiAmount(custom)) ?? preset;
  const upiUrl = upiPaymentUrl(amount, channels);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    // Captured and stopped, so Escape closes this dialog rather than reaching
    // the privacy shutter's own Escape handler.
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onCloseRef.current();
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (previous?.isConnected) previous.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !hasUpi || tab !== 'upi') return undefined;
    let live = true;
    import('qrcode')
      .then((mod) => (mod.default || mod).toString(upiUrl, {
        type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#171717', light: '#ffffff' }
      }))
      .then((svg) => { if (live) setQrSvg(svg); })
      .catch(() => { if (live) setQrSvg(''); });
    return () => { live = false; };
  }, [isOpen, hasUpi, tab, upiUrl]);

  if (!isOpen) return null;

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(channels.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* the ID stays on screen to copy by hand */ }
  };

  const tabButton = (id, label) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={`type-control flex-1 min-h-10 [@media(max-height:620px)]:min-h-9 rounded-md transition-colors ${
        tab === id
          ? `bg-white dark:bg-[#171717] text-neutral-900 dark:text-neutral-100 ${BORDER}`
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={`fixed inset-0 z-50 bg-black/40 dark:bg-black/70 flex items-center justify-center p-3 [@media(max-height:620px)]:p-0 select-none`}>
      <button type="button" tabIndex={-1} className="fixed inset-0 cursor-default" aria-label="Close" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        className={`support-dialog relative w-full max-w-[560px] bg-white dark:bg-[#171717] text-neutral-900 dark:text-neutral-100 rounded-2xl [@media(max-height:620px)]:rounded-none ${BORDER} flex flex-col`}
      >
        <header className={`min-h-14 [@media(max-height:620px)]:min-h-11 px-5 [@media(max-height:620px)]:px-4 flex items-center justify-between gap-3 border-b border-black/[0.08] dark:border-white/[0.10]`}>
          <h2 id="support-title" className="type-section-title">Support Decide One</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 -mr-2 grid place-items-center rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>

        <div className={`px-5 [@media(max-height:620px)]:px-4 py-4 [@media(max-height:620px)]:py-3 flex flex-col gap-4 [@media(max-height:620px)]:gap-2`}>
          <div>
            <p className={`type-body`}>
              Decide One is free, for everyone, with nothing held back. If it has been worth something to you, this is how to say so.
            </p>
            <p className="type-metadata text-neutral-500 dark:text-neutral-400 mt-1">Nothing unlocks. Declining is a complete answer.</p>
          </div>

          {!hasUpi && !hasGitHub && (
            <p className="type-body text-neutral-500 dark:text-neutral-400">Support is not set up on this copy of Decide One.</p>
          )}

          {hasUpi && hasGitHub && (
            <div role="tablist" aria-label="Ways to support" className="flex gap-1 p-1 rounded-lg bg-neutral-100 dark:bg-neutral-900">
              {tabButton('upi', 'India · UPI')}
              {tabButton('github', 'Worldwide · GitHub')}
            </div>
          )}

          {hasUpi && tab === 'upi' && (
            <div role="tabpanel" aria-label="India · UPI" className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className={`flex flex-col gap-3 [@media(max-height:620px)]:gap-2`}>
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-2">
                  {UPI_AMOUNTS.map(({ inr, label }) => {
                    const selected = custom === '' && preset === inr;
                    return (
                      <button
                        key={inr}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => { setPreset(inr); setCustom(''); }}
                        className={`min-h-12 [@media(max-height:620px)]:min-h-11 px-1 sm:px-3 rounded-lg flex flex-col sm:flex-row items-center sm:items-baseline justify-center sm:justify-between gap-0.5 sm:gap-2 transition-colors ${
                          selected ? `${PRIMARY} border border-transparent` : `${BORDER} ${QUIET}`
                        }`}
                      >
                        <span className="type-metadata">{label}</span>
                        <span className="type-control tabular-nums">{formatInr(inr)}</span>
                      </button>
                    );
                  })}
                </div>

                <label className="flex flex-col">
                  <span className="sr-only">Another amount</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={custom}
                    onChange={(event) => setCustom(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Another amount"
                    className={`type-control min-h-11 px-3 rounded-lg ${BORDER} bg-transparent tabular-nums select-text placeholder:text-neutral-500`}
                  />
                </label>

                <a href={upiUrl} className={`sm:hidden type-control min-h-11 rounded-lg ${PRIMARY} flex items-center justify-center tabular-nums`}>
                  Pay {formatInr(amount)} in a UPI app
                </a>

                <div className={`min-h-11 pl-3 pr-1 rounded-lg ${BORDER} flex items-center justify-between gap-2`}>
                  <span className="min-w-0 flex items-baseline gap-2">
                    <span className="type-label text-neutral-500 dark:text-neutral-400 shrink-0">UPI ID</span>
                    <span className="type-control truncate select-text">{channels.upiId}</span>
                  </span>
                  <button type="button" onClick={copyUpiId} className={`type-control min-h-9 px-2 rounded-md flex items-center gap-1.5 shrink-0 ${QUIET}`}>
                    {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <figure className="hidden sm:flex flex-col items-center gap-2 m-0">
                <div
                  role="img"
                  aria-label={`UPI QR code for ${formatInr(amount)}`}
                  className="w-40 h-40 p-2 rounded-lg bg-white border border-black/[0.12] [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <figcaption className="type-metadata text-neutral-500 dark:text-neutral-400 text-center">
                  Scan with any UPI app
                  <span className="block type-control tabular-nums text-neutral-900 dark:text-neutral-100">{formatInr(amount)}</span>
                </figcaption>
              </figure>
            </div>
          )}

          {hasGitHub && tab === 'github' && (
            <div role="tabpanel" aria-label="Worldwide · GitHub" className={`flex flex-col gap-3 [@media(max-height:620px)]:gap-2`}>
              {channels.sponsorsUrl && (
                <ul className="grid gap-2 sm:grid-cols-3">
                  {SPONSOR_TIERS.map(({ usd, label, line }) => (
                    <li key={usd}>
                      <a
                        href={channels.sponsorsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`h-full min-h-11 p-3 [@media(max-height:620px)]:py-2 rounded-lg ${BORDER} ${QUIET} flex sm:flex-col items-center sm:items-start justify-between gap-2 transition-colors`}
                      >
                        <span className="flex sm:flex-col items-baseline gap-2 sm:gap-0">
                          <span className="type-control">{label}</span>
                          <span className="type-section-title tabular-nums">{formatUsd(usd)}</span>
                        </span>
                        <span className="type-metadata text-neutral-500 dark:text-neutral-400 text-right sm:text-left">{line}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2">
                {channels.sponsorsUrl && (
                  <a href={channels.sponsorsUrl} target="_blank" rel="noopener noreferrer" className={`type-control min-h-11 px-4 rounded-lg ${PRIMARY} inline-flex items-center gap-1.5`}>
                    Sponsor on GitHub <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
                {channels.repoUrl && (
                  <a href={channels.repoUrl} target="_blank" rel="noopener noreferrer" className={`type-control min-h-11 px-4 rounded-lg ${BORDER} ${QUIET} inline-flex items-center gap-1.5`}>
                    See the code on GitHub <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
              <p className="type-metadata text-neutral-500 dark:text-neutral-400">Open source under the MIT licence.</p>
            </div>
          )}
        </div>

        {(hasUpi || hasGitHub) && (
          <footer className={`px-5 [@media(max-height:620px)]:px-4 py-3 [@media(max-height:620px)]:py-2 border-t border-black/[0.08] dark:border-white/[0.10] type-metadata text-neutral-500 dark:text-neutral-400`}>
            Payments happen in your UPI app or on GitHub. Decide One never sees them.
          </footer>
        )}
      </section>
    </div>
  );
}
