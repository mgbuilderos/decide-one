/**
 * Signed licence verification (B2).
 *
 * Replaces the six hardcoded promo keys, one of which was published in the
 * README and all of which were readable in the bundle — anyone could unlock
 * Patron by reading the JavaScript.
 *
 * A licence is now `D1.<payload>.<signature>`: a per-buyer token signed with a
 * private key that exists only on the founder's machine. The app holds the
 * **public** key, so it can verify offline, forever, with no server and no
 * account — and a leaked licence unlocks exactly one order rather than every
 * copy of the software.
 *
 * ECDSA P-256 rather than Ed25519: the requirement is asymmetric offline
 * verification, and P-256 has been in every browser's WebCrypto for a decade
 * while Ed25519 only reached Chrome in 137. A buyer on an older browser must
 * never be locked out of software they paid for.
 *
 * Verification is asynchronous because WebCrypto is. Legacy keys stay
 * synchronous and keep working (N32) — nobody who already paid gets locked out.
 */

/** Public half only. Signing happens offline via scripts/issue-license.mjs. */
const LICENCE_PUBLIC_KEY_JWK = {"kty": "EC", "crv": "P-256", "x": "oSBnqzpGzqADGXgHwDjas-e0igoHqK8vJ_e1EkyR-_s", "y": "KRQZYdNXS3wFPvvp0P81N9YVoimMaymUwJnky1KXfdQ"};

const SIGNED_KEY_PATTERN = /^D1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/;

function fromBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

let cachedKey = null;
async function getVerificationKey() {
  if (cachedKey) return cachedKey;
  cachedKey = await crypto.subtle.importKey(
    'jwk',
    { ...LICENCE_PUBLIC_KEY_JWK, ext: true, key_ops: ['verify'] },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );
  return cachedKey;
}

export function looksLikeSignedKey(key) {
  return typeof key === 'string' && SIGNED_KEY_PATTERN.test(key.trim());
}

/**
 * Verifies a signed licence and returns its claims, or null.
 *
 * Returns null on every failure path — bad signature, malformed payload,
 * unavailable WebCrypto. Failing closed is correct here: the consequence is a
 * buyer seeing the free version and writing in, not a stranger unlocking.
 */
export async function verifySignedLicense(key) {
  const match = SIGNED_KEY_PATTERN.exec(String(key || '').trim());
  if (!match) return null;

  const [, payloadB64, signatureB64] = match;
  try {
    const ok = await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      await getVerificationKey(),
      fromBase64Url(signatureB64),
      new TextEncoder().encode(payloadB64)
    );
    if (!ok) return null;

    const claims = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
    if (!claims || typeof claims.o !== 'string' || !claims.o) return null;

    return { orderId: claims.o, tier: claims.t || 'patron', issuedOn: claims.d || null };
  } catch (e) {
    return null;
  }
}
