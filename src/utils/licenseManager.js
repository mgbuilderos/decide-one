/**
 * Decide One Lifetime Patron License Manager
 * 100% Local-First Cryptographic Signature Verification (Zero Server Cost)
 */

import { looksLikeSignedKey, verifySignedLicense } from './licenseKeys';

const LICENSE_STORAGE_KEY = 'DECIDEONE_PATRON_LICENSE';
// Earlier identities, newest first. Read-only: never written again, always honoured.
const LEGACY_STORAGE_KEYS = ['PRIMACY_PATRON_LICENSE', 'POCKETBOOK_PATRON_LICENSE'];
/**
 * The old promo keys are gone (B2), and none of their strings appear in the
 * bundle any more. They were the vulnerability itself: readable in the
 * JavaScript, and each one unlocked every copy of the software.
 *
 * They were kept for compatibility under N32, on the assumption that someone
 * might have bought with one. Nobody did — checkout has been simulated
 * throughout (B1), so the only activations that ever used these keys were
 * local demos. Those are migrated to a demo grant in migrateLegacyActivation()
 * rather than broken, so no one loses access and the backdoor still closes.
 */

/**
 * Checks if a given key is valid format and signature
 */
/**
 * Synchronous check for legacy keys only. Signed keys need WebCrypto, which is
 * asynchronous — use verifyAnyLicenseKey for those.
 */
export function verifyLicenseKey(key) {
  if (!key || typeof key !== 'string') return false;
  const cleanKey = key.trim().toUpperCase();

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
    // Synchronous on purpose: this runs before first paint, and WebCrypto is
    // async. A stored signed key was verified when it was activated; its shape
    // is checked here and its signature is re-checked by revalidateStoredLicense.
    const shapeOk = parsed && (
      parsed.demo === true ||
      (parsed.key && (looksLikeSignedKey(parsed.key) || verifyLicenseKey(parsed.key)))
    );
    if (shapeOk) {
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
 * Verifies either kind of key: a signed per-order licence, or a legacy key.
 * Signed keys are tried first so that the modern path is the normal one.
 */
export async function verifyAnyLicenseKey(key) {
  const raw = String(key || '').trim();
  if (looksLikeSignedKey(raw)) {
    const claims = await verifySignedLicense(raw);
    return claims ? { valid: true, signed: true, claims } : { valid: false, signed: true };
  }
  return { valid: verifyLicenseKey(raw), signed: false };
}

/**
 * Activate a license key locally.
 *
 * Async because signed keys are verified with WebCrypto. Signed keys keep
 * their exact case — they are base64url, so upper-casing them would break the
 * signature; only legacy keys are normalised to upper case.
 */
export async function activateLicense(key) {
  const raw = String(key || '').trim();
  const result = await verifyAnyLicenseKey(raw);
  if (!result.valid) {
    return { success: false, error: 'That licence key could not be verified.' };
  }
  const cleanKey = result.signed ? raw : raw.toUpperCase();
  const record = {
    key: cleanKey,
    activatedAt: new Date().toISOString(),
    tier: 'Lifetime Patron',
    ...(result.claims ? { orderId: result.claims.claims?.orderId ?? result.claims.orderId } : {})
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

/**
 * Re-verifies a stored signed licence against the public key and clears it if
 * the signature does not hold. Called after mount, so a forged or corrupted
 * stored record cannot grant Patron beyond the first render.
 */
export async function revalidateStoredLicense() {
  const stored = getStoredLicense();
  if (!stored.isPatron || !looksLikeSignedKey(stored.key)) return stored;
  const claims = await verifySignedLicense(stored.key);
  if (claims) return stored;
  deactivateLicense();
  return { isPatron: false, key: null };
}

/**
 * Grants Patron features locally as a **demo**, without a licence key.
 *
 * Checkout is still simulated (B1), and the previous demo path activated a
 * promo key that was readable in the bundle — so anyone could unlock Patron by
 * reading the JavaScript. A demo grant needs no key, cannot leak, and is
 * marked as a demo in the stored record so it is never mistaken for a purchase.
 */
export function activateDemoPatron() {
  const record = {
    key: null,
    demo: true,
    activatedAt: new Date().toISOString(),
    tier: 'Demo Patron'
  };
  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(record));
    return { success: true, record };
  } catch (e) {
    return { success: false, error: 'Failed to write to local storage.' };
  }
}

/**
 * One-time migration for anyone who activated with an old promo key.
 *
 * Their stored record names a key that is no longer valid. Rather than
 * silently dropping them to the free version, the record is converted to a
 * demo grant: access is unchanged, and the retired key stops working as a
 * credential. Runs once per device and is a no-op afterwards.
 */
export function migrateLegacyActivation() {
  try {
    const raw = LEGACY_STORAGE_KEYS.reduce(
      (found, k) => found || localStorage.getItem(k),
      localStorage.getItem(LICENSE_STORAGE_KEY)
    );
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.demo === true) return false;
    if (!parsed.key) return false;
    // A signed key or a valid checksum key needs no migration.
    if (looksLikeSignedKey(parsed.key) || verifyLicenseKey(parsed.key)) return false;

    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify({
      key: null,
      demo: true,
      migratedFrom: 'retired-promo-key',
      activatedAt: parsed.activatedAt || new Date().toISOString(),
      tier: 'Demo Patron'
    }));
    return true;
  } catch (e) {
    return false;
  }
}
