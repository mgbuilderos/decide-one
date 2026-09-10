/**
 * Executive Cryptographic Vault & Biometric Security Engine
 * 100% Client-Side Zero-Knowledge Cryptography (WebCrypto API)
 * - AES-GCM-256 Encryption
 * - PBKDF2 Key Derivation (100,000 iterations, SHA-256)
 * - Hardware biometrics via WebAuthn, where the platform actually provides them.
 *   Where it does not, this reports failure rather than pretending to have checked.
 * - Air-Gapped Sovereign Vault (.vault) Export / Import
 * Zero Cloud Servers • Zero Third-Party Telemetry
 */

// Utility: Uint8Array <-> Hex conversions
function toHex(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hexString) {
  const match = hexString.match(/.{1,2}/g);
  if (!match) return new Uint8Array(0);
  return new Uint8Array(match.map(byte => parseInt(byte, 16)));
}

/**
 * Derive AES-GCM-256 Key from user passphrase via PBKDF2
 */
export async function deriveKeyFromPassphrase(passphrase, saltUint8) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('WebCrypto API is not supported in this environment.');
  }

  const enc = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltUint8,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt arbitrary JSON serializable object into an air-gapped cryptographic envelope
 */
export async function encryptVaultData(payloadObject, passphrase) {
  if (!passphrase || passphrase.length < 4) {
    throw new Error('Passphrase must be at least 4 characters.');
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKeyFromPassphrase(passphrase, salt);

  const enc = new TextEncoder();
  const encodedData = enc.encode(JSON.stringify(payloadObject));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );

  return {
    version: 1,
    algorithm: 'AES-GCM-256',
    kdf: 'PBKDF2-SHA256-100K',
    salt: toHex(salt),
    iv: toHex(iv),
    ciphertext: toHex(ciphertextBuffer),
    createdAt: new Date().toISOString()
  };
}

/**
 * Decrypt an air-gapped cryptographic envelope using the user passphrase
 */
export async function decryptVaultData(envelope, passphrase) {
  if (!envelope || !envelope.salt || !envelope.iv || !envelope.ciphertext) {
    throw new Error('Invalid cryptographic envelope structure.');
  }

  const salt = fromHex(envelope.salt);
  const iv = fromHex(envelope.iv);
  const ciphertext = fromHex(envelope.ciphertext);

  const key = await deriveKeyFromPassphrase(passphrase, salt);

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const jsonString = dec.decode(decryptedBuffer);
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Decryption failed. Incorrect passphrase or corrupted vault envelope.');
  }
}

/**
 * Check if the user's platform supports hardware biometrics (Touch ID / Face ID / Windows Hello)
 */
export async function checkBiometricHardwareSupport() {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return false;
  }
  try {
    if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }
  } catch (e) {
    console.warn('Biometric support check error:', e);
  }
  return false;
}

/**
 * WebAuthn Hardware Biometric Authentication (Touch ID / Face ID / Windows Hello)
 * Completely on-device: creates a local verification challenge without needing an external server.
 */
export async function authenticateWithBiometrics(username = 'Executive Owner') {
  if (!window.PublicKeyCredential) {
    throw new Error('Hardware biometrics not supported on this browser.');
  }

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  // This function reports what actually happened. It previously returned
  // success when no authentication had taken place — on unsupported hardware,
  // on any unexpected error, and unconditionally at the end — which made every
  // caller believe a check had passed that never ran.
  try {
    const isAvailable = await checkBiometricHardwareSupport();
    if (!isAvailable) {
      return { success: false, reason: 'unsupported', method: 'none' };
    }

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
        rpId: window.location.hostname || 'localhost'
      }
    });

    if (credential) {
      return { success: true, credentialId: credential.id, method: 'webauthn-hardware' };
    }
    return { success: false, reason: 'no-credential', method: 'none' };
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      return { success: false, reason: 'cancelled', method: 'none' };
    }
    return { success: false, reason: err.name || 'error', method: 'none' };
  }
}

/**
 * Download the encrypted vault as an air-gapped sovereign backup (.vault file)
 */
export function downloadEncryptedVaultFile(envelope, volumeName = 'Executive') {
  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `Executive-Vault-${volumeName.toLowerCase().replace(/\s+/g, '-')}-${dateStr}.vault`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
