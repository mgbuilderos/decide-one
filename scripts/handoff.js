import fs from 'fs';
import { execSync } from 'child_process';

// A handoff note, for when work stops with something still in flight.
//
// CLAUDE.md documents at length what to do when an agent is cut off mid-task —
// it has happened repeatedly, and on 11 September one left a deleted component,
// a broken build and an hour of silence. It left no note, because it did not
// know it was stopping. Nothing in this repository wrote that note, so every
// arriving agent re-diagnosed from scratch and twice read a delete-and-rewrite
// as a deletion.
//
// This is not npm run log. `log` records what you finished. `handoff` records
// what you did NOT finish, and it captures the tree state automatically,
// because the state is the part an agent gets wrong when reconstructing it.
//
//   npm run handoff "rewriting the canonical tag; index.html done, sitemap not"
//   AGENT=seo-technical npm run handoff "…"
//
// npm run brief surfaces the most recent one.

const message = process.argv.slice(2).join(' ').trim();
if (!message) {
  console.error('\nUsage:  npm run handoff "what is in flight, and what the next agent should do first"');
  console.error('        AGENT=seo-technical npm run handoff "…"\n');
  console.error('  Use this when you stop with work unfinished.');
  console.error('  Use npm run log "…" when you stop at a clean, committed state.\n');
  process.exit(1);
}

const git = (cmd, fallback = 'unknown') => {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
};

const agent = process.env.AGENT || process.env.CLAUDE_AGENT || git('git config user.name', '') || 'unattributed';
const branch = git('git rev-parse --abbrev-ref HEAD');
const head = git('git rev-parse --short HEAD');
const dirty = git('git status --short', '').split('\n').filter(Boolean);

// Files written in the last 30 minutes. A half-applied batch write is what made
// a rewrite look like a deletion; naming the files removes the guess.
const recent = git(
  `find src worker server shared scripts content -type f -newermt '-30 minutes' -not -path '*/node_modules/*' 2>/dev/null | head -10`,
  ''
).split('\n').filter(Boolean);

const date = new Date().toISOString().slice(0, 10);
const time = new Date().toTimeString().slice(0, 5);

const lines = [
  '',
  '---',
  '',
  `### ${date} ${time} — ${agent} — HANDOFF`,
  '',
  `**In flight:** ${message}`,
  '',
  `**Tree:** \`${branch}\` @ \`${head}\` — ${dirty.length ? `${dirty.length} file(s) uncommitted` : 'clean'}`
];

if (dirty.length) {
  lines.push('', '```');
  dirty.slice(0, 20).forEach(l => lines.push(l));
  if (dirty.length > 20) lines.push(`… and ${dirty.length - 20} more`);
  lines.push('```');
}

if (recent.length) {
  lines.push('', `**Written in the last 30 minutes** (a shared batch write, not separate changes, if the timestamps match):`, '');
  recent.forEach(f => lines.push(`- \`${f}\``));
}

lines.push('', `**Gates:** run \`npm run build && npm run test:qc\` before trusting any of the above.`, '');

fs.appendFileSync('DECISION_LOG.md', lines.join('\n'));

console.log(`\n✅ Handoff appended to DECISION_LOG.md`);
console.log(`   ${date} ${time} — ${agent}`);
console.log(`   ${message.length > 68 ? message.slice(0, 68) + '…' : message}`);
console.log(`   ${branch} @ ${head} — ${dirty.length ? `${dirty.length} uncommitted` : 'clean'}\n`);
console.log(`   npm run brief will show this to the next agent.`);
console.log(`   Commit it now, with whatever does build:`);
console.log(`   git add DECISION_LOG.md <your files> && git commit\n`);
