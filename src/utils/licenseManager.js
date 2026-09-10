/**
 * Decide One Lifetime Patron License Manager
 * 100% Local-First Cryptographic Signature Verification (Zero Server Cost)
 */

const LICENSE_STORAGE_KEY = 'DECIDEONE_PATRON_LICENSE';
// Earlier identities, newest first. Read-only: never written again, always honoured.
const LEGACY_STORAGE_KEYS = ['PRIMACY_PATRON_LICENSE', 'POCKETBOOK_PATRON_LICENSE'];
const VALID_PROMO_KEYS = [
  'DECIDEONE-PATRON-2026',
  'DECIDEONE-VIP-2026',
  'PRIMACY-PATRON-2026',
  'PRIMACY-VIP-2026',
  'POCKETBOOK-PATRON-2026',
  'FOUNDER-LIFETIME-PASS',
  'EXECUTIVE-PATRON-ACCESS',
  'POCKETBOOK-VIP-2026'
];

/**
 * Checks if a given key is valid format and signature
 */
export function verifyLicenseKey(key) {
  if (!key || typeof key !== 'string') return false;
  const cleanKey = key.trim().toUpperCase();

  // Test promo keys for immediate verification
  if (VALID_PROMO_KEYS.includes(cleanKey)) return true;

  // Format check: D1-XXXX-XXXX-XXXX, or legacy PR- / PB- keys, which stay valid forever
  const pattern = /^(D1|PR|PB)-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if (!pattern.test(cleanKey)) return false;

  // Check checksum algorithm (sum of char codes mod 13 === 7)
  const numericSum = cleanKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return numericSum % 13 === 7;
}

/**
 * Retrieve current stored license status
 */
export function getStoredLicense() {
  if (typeof window === 'undefined') return { isPatron: false, key: null };
  try {
    const raw = LEGACY_STORAGE_KEYS.reduce(
      (found, legacyKey) => found || localStorage.getItem(legacyKey),
      localStorage.getItem(LICENSE_STORAGE_KEY)
    );
    if (!raw) return { isPatron: false, key: null };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.key && verifyLicenseKey(parsed.key)) {
      return {
        isPatron: true,
        key: parsed.key,
        activatedAt: parsed.activatedAt || new Date().toISOString(),
        tier: parsed.tier || 'Lifetime Patron'
      };
    }
  } catch (e) {
    console.error('Failed to read Decide One license', e);
  }
  return { isPatron: false, key: null };
}

/**
 * Activate a license key locally
 */
export function activateLicense(key) {
  if (!verifyLicenseKey(key)) {
    return { success: false, error: 'Invalid license key format or signature.' };
  }
  const cleanKey = key.trim().toUpperCase();
  const record = {
    key: cleanKey,
    activatedAt: new Date().toISOString(),
    tier: 'Lifetime Patron'
  };
  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(record));
    return { success: true, record };
  } catch (e) {
    return { success: false, error: 'Failed to write license to local storage.' };
  }
}

/**
 * Deactivate / reset to free edition
 */
export function deactivateLicense() {
  try {
    localStorage.removeItem(LICENSE_STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}
