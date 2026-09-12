import fs from 'fs';
import { execSync } from 'child_process';

// DECISION_LOG.md is append-only by convention: every session adds what it did,
// nothing is rewritten, and corrections arrive as new entries saying what they
// supersede. The convention was sound and got skipped because appending by hand
// meant opening a 17,000-word file. This makes it one command.
//
//   npm run log "what I did and why"
//   AGENT=codex npm run log "what I did and why"

const message = process.argv.slice(2).join(' ').trim();
if (!message) {
  console.error('\nUsage:  npm run log "what you did and why"');
  console.error('        AGENT=codex npm run log "..."\n');
  process.exit(1);
}

// Attribution. The four most recent entries in DECISION_LOG.md all read
// 'unattributed' because nothing was setting AGENT, and a log that cannot say
// who did something answers half the question it exists to answer.
//
// The fallback chain never blocks the write: a refused log is a lost log, which
// is worse than an unattributed one. Agents set AGENT explicitly (their
// definitions in .claude/agents/ say so); a human session falls back to the git
// identity, which is already configured and is a real answer.
function gitIdentity() {
  try {
    return execSync('git config user.name', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch {
    return null;  // no git, or no identity configured
  }
}

const agent = process.env.AGENT || process.env.CLAUDE_AGENT || gitIdentity() || 'unattributed';
const date = new Date().toISOString().slice(0, 10);
const time = new Date().toTimeString().slice(0, 5);
const file = 'DECISION_LOG.md';

const entry = `\n---\n\n### ${date} ${time} — ${agent}\n\n${message}\n`;
fs.appendFileSync(file, entry);

console.log(`\n✅ Appended to ${file}\n`);
console.log(`   ${date} ${time} — ${agent}`);
console.log(`   ${message.length > 68 ? message.slice(0, 68) + '…' : message}\n`);
console.log(`   Commit it with the work it describes:`);
console.log(`   git add ${file} <your files> && git commit\n`);
