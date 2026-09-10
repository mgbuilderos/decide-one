#!/usr/bin/env node
/**
 * Mint one signed licence key for one buyer. Run offline.
 *
 *   node scripts/issue-license.mjs <order-id> [tier]
 *
 * Reads the private key from licence-signing-key.json (gitignored), or from
 * the LICENCE_SIGNING_KEY environment variable.
 *
 * The key carries an order reference, a tier and an issue date — deliberately
 * no email and no name. A licence key travels through inboxes and support
 * threads; it should not carry personal data (see the privacy page).
 */
import { webcrypto } from 'node:crypto';
import { readFileSync } from 'node:fs';

const b64u = (bytes) =>
  Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const orderId = process.argv[2];
const tier = process.argv[3] || 'patron';
if (!orderId) {
  console.error('Usage: node scripts/issue-license.mjs <order-id> [tier]');
  process.exit(1);
}

let jwk;
try {
  jwk = JSON.parse(process.env.LICENCE_SIGNING_KEY || readFileSync('licence-signing-key.json', 'utf8'));
} catch (e) {
  console.error('No signing key. Run scripts/license-keypair.mjs and save the private key to licence-signing-key.json.');
  process.exit(1);
}

const privateKey = await webcrypto.subtle.importKey(
  'jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
);

const payload = { o: orderId, t: tier, d: new Date().toISOString().slice(0, 10) };
const payloadB64 = b64u(new TextEncoder().encode(JSON.stringify(payload)));
const signature = await webcrypto.subtle.sign(
  { name: 'ECDSA', hash: 'SHA-256' },
  privateKey,
  new TextEncoder().encode(payloadB64)
);

console.log(`D1.${payloadB64}.${b64u(new Uint8Array(signature))}`);
