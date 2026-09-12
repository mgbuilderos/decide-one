/**
 * What is actually in production.
 *
 * This exists because of a gap nothing else in the repository would have shown:
 * the Worker writes telemetry to Cloudflare D1, and `server/src/analyticsService.js`
 * — all 712 lines of it — reads a local SQLite file at `server/data/telemetry.sqlite`
 * that production never touches. Nothing read D1 at all. Switching telemetry on
 * would have produced write-only data, while the dashboard carried on showing
 * seeded development rows that look exactly like real ones.
 *
 * That is the failure VISION.md §13 is about: an instrument is trusted because
 * it is right, and a compass two degrees off is worse than no compass.
 *
 * DELIBERATELY SMALL. It prints counts and distributions, and does not
 * re-implement a single derived metric. Computing the circadian dual-visit rate
 * here as well as in analyticsService.js would create two implementations of one
 * number, and the one that drifts is always the one nobody is looking at — the
 * same reasoning shared/telemetrySanitize.js gives for existing once.
 *
 *   npm run metrics
 *
 * Read-only. Every statement is a SELECT.
 */

import { execFileSync } from 'node:child_process';

const DB = 'decide-one-telemetry';

// --local reads the wrangler dev database instead of production. It exists so
// the populated branch of this script can be exercised without writing rows to
// the real one: an unrun code path first runs on the day telemetry is switched
// on, which is the worst possible moment to discover a typo in it.
const WHERE = process.argv.includes('--local') ? '--local' : '--remote';

function q(sql) {
  const out = execFileSync('npx', [
    'wrangler', 'd1', 'execute', DB, WHERE, '--json', '--command', sql
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 16 * 1024 * 1024 });
  return JSON.parse(out)[0].results;
}

const table = (rows, cols) => {
  if (rows.length === 0) return '    (none)';
  const w = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length)));
  const line = r => '    ' + cols.map((c, i) => String(r[c] ?? '').padEnd(w[i])).join('  ');
  return [line(Object.fromEntries(cols.map(c => [c, c]))), ...rows.map(line)].join('\n');
};

console.log(`\n\x1b[1mDECIDE ONE — telemetry (Cloudflare D1, ${WHERE.slice(2)})\x1b[0m`);
console.log('─'.repeat(62));

const totals = q(`
  SELECT (SELECT COUNT(*) FROM events)                        AS events,
         (SELECT COUNT(*) FROM sessions)                      AS sessions,
         (SELECT COUNT(DISTINCT anonymous_id) FROM events)    AS visitors,
         (SELECT COUNT(*) FROM sessions WHERE local_hour IS NOT NULL) AS with_local_hour,
         (SELECT MIN(received_at) FROM events)                AS first_seen,
         (SELECT MAX(received_at) FROM events)                AS last_seen
`)[0];

console.log(`  events        ${totals.events}`);
console.log(`  sessions      ${totals.sessions}`);
console.log(`  visitors      ${totals.visitors}`);
console.log(`  first / last  ${totals.first_seen || '—'}  ${totals.last_seen || '—'}`);

if (totals.events === 0 && totals.sessions === 0) {
  console.log('\n  Empty, which is correct while telemetry is compiled out.');
  console.log('  VITE_ENABLE_TELEMETRY is unset, so the client sends nothing and');
  console.log('  consent is never even asked for. This is the expected state.\n');
  process.exit(0);
}

// The honesty line. If sessions exist and none carries a local hour, the client
// is not sending it and any hour-of-day reading is really a reading of UTC.
if (totals.sessions > 0) {
  const pct = ((totals.with_local_hour / totals.sessions) * 100).toFixed(1);
  const bad = totals.with_local_hour === 0;
  console.log(`  local_hour    ${totals.with_local_hour}/${totals.sessions} sessions (${pct}%)` +
    (bad ? '  \x1b[31m← none: any hour-of-day figure describes UTC, not people\x1b[0m' : ''));
}

console.log('\n\x1b[1mEvents by name\x1b[0m');
console.log(table(q(`SELECT event, COUNT(*) AS n FROM events GROUP BY event ORDER BY n DESC LIMIT 25`), ['event', 'n']));

console.log('\n\x1b[1mSessions by hour the person was living\x1b[0m');
console.log(table(q(`
  SELECT local_hour AS hour, COUNT(*) AS n FROM sessions
  WHERE local_hour IS NOT NULL GROUP BY local_hour ORDER BY local_hour
`), ['hour', 'n']));

console.log('\n\x1b[1mCountry\x1b[0m');
console.log(table(q(`SELECT COALESCE(country,'(unknown)') AS country, COUNT(*) AS n FROM sessions GROUP BY country ORDER BY n DESC LIMIT 15`), ['country', 'n']));

console.log('\n\x1b[1mAcquisition\x1b[0m');
console.log(table(q(`
  SELECT COALESCE(utm_source, referrer_host, '(direct)') AS source, COUNT(*) AS n
  FROM sessions GROUP BY source ORDER BY n DESC LIMIT 15
`), ['source', 'n']));

console.log('\n\x1b[1mEvents per session\x1b[0m  (derived, never stored — see worker/schema.sql)');
console.log(table(q(`
  SELECT s.session_id, COUNT(e.id) AS events
  FROM sessions s LEFT JOIN events e ON e.session_id = s.session_id
  GROUP BY s.session_id ORDER BY events DESC LIMIT 10
`), ['session_id', 'events']));

console.log('');
