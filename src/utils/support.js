// Support: the channels, the suggested amounts and the quiet ask.
//
// VISION.md §11.1 "Open source and support" decides every figure and sentence
// here. Rule 24 runs this module and compares it with that line, and still
// fails any money figure written into src/ — so amounts live here as plain
// numbers and are formatted at render.
//
// Pure and dependency-free, so the audit can import it under Node.

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

// Each channel appears only when its variable is set, so a fork never shows
// someone else's payment details.
export const SUPPORT_CHANNELS = {
  upiId: String(env.VITE_SUPPORT_UPI_ID || '').trim(),
  upiName: String(env.VITE_SUPPORT_UPI_NAME || 'Decide One').trim(),
  sponsorsUrl: String(env.VITE_SUPPORT_SPONSORS_URL || '').trim(),
  repoUrl: String(env.VITE_SUPPORT_REPO_URL || '').trim()
};

export const UPI_AMOUNTS = [
  { inr: 50, label: 'Chai' },
  { inr: 150, label: 'Lunch' },
  { inr: 500, label: 'Patron' },
  { inr: 1500, label: 'Sponsor' }
];

export const SPONSOR_TIERS = [
  { usd: 3, label: 'Coffee', line: 'A small thank-you.' },
  { usd: 10, label: 'Backer', line: 'Helps the work continue.' },
  { usd: 25, label: 'Patron', line: 'Backs the next year of it.' }
];

export const MAX_UPI_AMOUNT = 100000;

export const formatInr = (amount) => '₹' + Number(amount).toLocaleString('en-IN');
export const formatUsd = (amount) => '$' + Number(amount).toLocaleString('en-US');

/** A whole number of rupees between one and the cap, or null. */
export function validUpiAmount(value) {
  const amount = Number(String(value).trim());
  return Number.isInteger(amount) && amount >= 1 && amount <= MAX_UPI_AMOUNT ? amount : null;
}

/** A upi:// link any UPI app opens with the payee and amount filled in. */
export function upiPaymentUrl(amount, channels = SUPPORT_CHANNELS) {
  const params = new URLSearchParams({ pa: channels.upiId, pn: channels.upiName, cu: 'INR' });
  const valid = validUpiAmount(amount);
  if (valid) params.set('am', String(valid));
  params.set('tn', 'Support Decide One');
  return `upi://pay?${params.toString()}`;
}

/**
 * Whether this visitor is probably in India, decided from the browser's own
 * time zone and languages. Nothing is requested from a server.
 */
export function isLikelyIndiaVisitor() {
  if (typeof window === 'undefined') return false;
  try {
    const zone = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
    if (zone === 'asia/kolkata' || zone === 'asia/calcutta') return true;
    const languages = navigator.languages || [navigator.language || ''];
    return languages.some((lang) => /-IN$/i.test(lang));
  } catch {
    return false;
  }
}

// ── The quiet ask after a closed day ─────────────────────────────────────────
// TELEMETRY_SPEC §7: only after a habit exists. Each "Not now" waits longer.
export const SUPPORT_ASK_MIN_CLOSED_DAYS = 14;
export const SUPPORT_ASK_WAITS = [14, 30, 90];
const ASK_KEY = 'DECIDEONE_SUPPORT_ASK_V1';

export function addDaysToKey(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function hasSupportChannel(channels = SUPPORT_CHANNELS) {
  return Boolean(channels.upiId || channels.sponsorsUrl);
}

export function shouldAskForSupport({ closedDays, todayKey, preference = {}, channels = SUPPORT_CHANNELS }) {
  if (!hasSupportChannel(channels) || preference.off) return false;
  if (closedDays < SUPPORT_ASK_MIN_CLOSED_DAYS) return false;
  if (preference.lastAskedOn === todayKey) return false;
  if (preference.nextAfter && todayKey < preference.nextAfter) return false;
  return true;
}

export function markSupportAsked(preference = {}, todayKey) {
  return { ...preference, lastAskedOn: todayKey };
}

export function declineSupportAsk(preference = {}, todayKey) {
  const declines = (preference.declines || 0) + 1;
  const wait = SUPPORT_ASK_WAITS[Math.min(declines, SUPPORT_ASK_WAITS.length) - 1];
  return { ...preference, declines, lastAskedOn: todayKey, nextAfter: addDaysToKey(todayKey, wait) };
}

export function readSupportPreference() {
  try { return JSON.parse(localStorage.getItem(ASK_KEY)) || {}; } catch { return {}; }
}

export function writeSupportPreference(preference) {
  try { localStorage.setItem(ASK_KEY, JSON.stringify(preference)); } catch { /* usable without storage */ }
}
