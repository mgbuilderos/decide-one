import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// The first thing any agent runs. It exists because reading this repository's
// documentation costs ~140,000 tokens, and almost none of that answers the
// question an agent actually has at the start of a session: what is true right
// now. Computed state cannot drift the way a written file can.

const sh = (cmd, fallback = '?') => {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim(); }
  catch { return fallback; }
};

const ago = (ms) => {
  const m = Math.floor((Date.now() - ms) / 60000);
  return m < 1 ? `${Math.floor((Date.now() - ms) / 1000)}s` : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

console.log('\n\x1b[1mDECIDE ONE — state right now\x1b[0m');
console.log('─'.repeat(62));

// 1. Is anyone else working?
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(jsx?|css)$/.test(e.name)) files.push([f, fs.statSync(f).mtimeMs]);
  }
})(path.resolve('src'));
files.sort((a, b) => b[1] - a[1]);
const quiet = (Date.now() - files[0][1]) / 60000 >= 5;
console.log(quiet
  ? `TREE      quiet ${ago(files[0][1])} — safe to build and deploy`
  : `TREE      \x1b[33mAN AGENT IS WORKING\x1b[0m — last edit ${ago(files[0][1])} ago. Wait.`);

// 2. Where is git
const dirty = sh('git status --porcelain');
console.log(`GIT       ${sh('git rev-parse --abbrev-ref HEAD')} @ ${sh('git log -1 --format=%h')} — ${dirty ? `\x1b[33m${dirty.split('\n').length} uncommitted\x1b[0m` : 'clean'}`);
if (dirty) dirty.split('\n').forEach(l => console.log(`            ${l}`));

// 3. Is the live site this build
const local = (fs.existsSync('dist/assets') ? fs.readdirSync('dist/assets').find(f => /^index-.*\.js$/.test(f)) : null);
const live = sh(`curl -s --max-time 8 https://decideone.app/`, '').match(/assets\/index-[A-Za-z0-9_-]+\.js/)?.[0];
console.log(`LIVE      ${!live ? 'unreachable' : live === 'assets/' + local ? 'decideone.app matches dist' : `\x1b[33mdecideone.app is NOT this build\x1b[0m (${live})`}`);

// 4. Recent decisions — what changed and why, without reading 28k words
console.log('\n\x1b[1mLast 5 commits\x1b[0m');
console.log(sh('git log -5 --format="  %h  %ad  %s" --date=format:%d-%b').split('\n').join('\n'));

// 5. The documentation, in the three layers it actually has
console.log('\n\x1b[1mDocumentation — three layers, not a pile\x1b[0m');
for (const [f, why] of [
  ['AGENTS.md', 'the rules. Start here'],
  ['VISION.md', 'WHY. §11 governs all copy and wins any conflict'],
  ['DECISIONS.md', 'WHAT IS TRUE NOW. One page, current state'],
  ['DECISION_LOG.md', 'HOW WE GOT HERE. Append-only; npm run log adds to it'],
  ['WORK_REMAINING.md', 'what is left'],
  ['DEPLOY.md', 'one command: npm run deploy'],
  ['FRAMEWORKS.md', 'which methods ship, and their attribution'],
  ['FOUNDATIONS.md', 'why the methods are sound'],
  ['LANDING_PROTOTYPE.md', 'the honest description of what is built'],
  ['TELEMETRY_SPEC.md', 'what to measure, and what must never be measured'],
  ['BRAND_BOOK.md', 'the voice. Read before writing any user-facing sentence'],
  ['BRAND_KEY.md', 'positioning: target, insight, discriminator'],
  ['BRAND_HOUSE.md', 'purpose, pillars, and what this brand is not']
]) {
  if (!fs.existsSync(f)) continue;
  const w = fs.readFileSync(f, 'utf8').split(/\s+/).length;
  console.log(`  ${f.padEnd(21)}${String(w).padStart(6)} w   ${why}`);
}
console.log('\n  The other ~33 root .md files are working history from the build-out.');
console.log('  Do not read them unless asked for something specific.');

// 6. What the last sessions actually did — the cheap read of a 17,000-word log
if (fs.existsSync('DECISION_LOG.md')) {
  const heads = fs.readFileSync('DECISION_LOG.md', 'utf8')
    .split('\n').filter(l => /^#{2,3} /.test(l)).slice(-4);
  if (heads.length) {
    console.log('\n\x1b[1mLast entries in the session log\x1b[0m');
    heads.forEach(h => console.log('  ' + h.replace(/^#+ /, '')));
  }
}

console.log('\n\x1b[1mCommands\x1b[0m');
console.log('  npm run tree      is anyone else editing right now');
console.log('  npm run test:qc   23 rules + Rule 0 (governed surfaces exist)');
console.log('  npm run deploy    audit, build, publish, verify — one command');
console.log('  npm run log "…"   append what you did to DECISION_LOG.md\n');
