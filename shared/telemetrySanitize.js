/**
 * The zero-knowledge property filter, shared by every ingestion path.
 *
 * It lives here rather than in either server because there are now two - the
 * Cloudflare Worker in production and the Node service in development - and a
 * privacy filter that exists twice is a privacy filter that drifts. The copy
 * that drifts is the one that stores what somebody wrote.
 *
 * Pure, dependency-free, and importable from both runtimes.
 */

// Matched as substrings, so `taskText`, `noteBody` and `decision_rationale` are
// all caught. Exact matching missed every camelCase spelling and stored the
// value. Over-redaction is the safe direction: a wrongly redacted property
// costs one metric, a wrongly kept one stores a private sentence.
export const SENSITIVE_SUBSTRINGS = [
  'text', 'title', 'note', 'reflection', 'content', 'rationale',
  'query', 'transcript', 'password', 'secret'
];

// Short and ambiguous, so exact only: `key` as a substring would redact
// `first_keypress_latency_ms` and take the hesitation metric with it.
export const SENSITIVE_EXACT = new Set(['key', 'token']);

export function isSensitiveKey(lowerKey) {
  if (SENSITIVE_EXACT.has(lowerKey)) return true;
  return SENSITIVE_SUBSTRINGS.some(s => lowerKey.includes(s));
}

/**
 * Arrays whose values are structure, not content, and are kept.
 *
 * `trail` is a list of surface names - `daily_spread`, `settings` - and is the
 * whole substance of exit-path analysis. Counting it instead of keeping it is
 * what made exit_breadcrumbs record nothing: the client replaced it with
 * `trail_count` before sending, and the server then looked for a `trail` that
 * had never arrived. Bounded rather than trusted: 50 hops, 64 characters each.
 */
export const STRUCTURAL_ARRAY_KEYS = new Set(['trail']);
const MAX_ARRAY_ITEMS = 50;
const MAX_ARRAY_ITEM_CHARS = 64;

export function sanitizeProperties(properties) {
  if (!properties || typeof properties !== 'object') return {};
  const clean = {};
  for (const [key, value] of Object.entries(properties)) {
    if (isSensitiveKey(key.toLowerCase())) {
      clean[`${key}_length`] = typeof value === 'string' ? value.length : 0;
      continue;
    }
    if (typeof value === 'boolean' || typeof value === 'number') {
      clean[key] = value;
    } else if (typeof value === 'string') {
      clean[key] = value.slice(0, 100);
    } else if (Array.isArray(value)) {
      if (STRUCTURAL_ARRAY_KEYS.has(key)) {
        clean[key] = value.slice(0, MAX_ARRAY_ITEMS).map(v => String(v).slice(0, MAX_ARRAY_ITEM_CHARS));
      }
      clean[`${key}_count`] = value.length;
    }
  }
  return clean;
}
