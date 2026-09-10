#!/usr/bin/env node
/**
 * Generate the licence signing keypair. Run this once, offline.
 *
 *   node scripts/license-keypair.mjs
 *
 * The PUBLIC key is embedded in the app so it can verify licences with no
 * server. The PRIVATE key signs them and must never enter the repository, the
 * bundle, or a support email. Keep it in a password manager.
 *
 * ECDSA P-256, not Ed25519: the requirement is asymmetric verification that
 * works offline, and P-256 has been in every browser's WebCrypto for a decade
 * while Ed25519 only reached Chrome in version 137. A buyer on an older
 * browser must never be locked out of software they paid for.
 */
import { webcrypto } from 'node:crypto';

const { publicKey, privateKey } = await webcrypto.subtle.generateKey(
  { name: 'ECDSA', namedCurve: 'P-256' },
  true,
  ['sign', 'verify']
);

const pub = await webcrypto.subtle.exportKey('jwk', publicKey);
const priv = await webcrypto.subtle.exportKey('jwk', privateKey);

const compactPublic = { kty: pub.kty, crv: pub.crv, x: pub.x, y: pub.y };

console.log('\n=== PUBLIC KEY — paste into src/utils/licenseKeys.js ===\n');
console.log(JSON.stringify(compactPublic, null, 2));
console.log('\n=== PRIVATE KEY — store offline, never commit ===\n');
console.log(JSON.stringify(priv));
console.log('\nWrite the private key to licence-signing-key.json (gitignored) to use scripts/issue-license.mjs.\n');
