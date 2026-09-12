/**
 * npm run why "<term>" — retrieval over the record.
 *
 * DECISION_LOG.md is 30,000+ words and grows every session. AGENTS.md says to
 * read documentation only when `brief` tells you to, and `brief` shows the last
 * five entries. So on 13 September 2026 an agent spent a session re-deriving
 * why the D1 mark was gold, while the answer — "removed every gold treatment
 * from the notebook cover… gold is Leica register" — sat at line 845, recorded
 * correctly and completely, and structurally out of reach.
 *
 * The record did not need more writing. It needed a way in.
 */
import fs from 'fs';

const term = process.argv.slice(2).join(' ').trim();
if (!term) {
  console.error('\nUsage: npm run why "<term>"    e.g. npm run why "gold foil"\n');
  process.exit(1);
}

const words = term.toLowerCase().split(/\s+/);
const hits = (text) => words.every(w => text.toLowerCase().includes(w));
const b = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

// ── The session log, newest first ────────────────────────────────────────────
const entries = [];
if (fs.existsSync('DECISION_LOG.md')) {
  for (const block of fs.readFileSync('DECISION_LOG.md', 'utf8').split(/\n---\n/)) {
    const head = block.match(/###\s+(\d{4}-\d{2}-\d{2})\s+([\d:]+)?\s*—\s*(.+)/);
    if (!head || !hits(block)) continue;
    const body = block.replace(/###.*\n/, '').trim();
    entries.push({ date: head[1], agent: head[3].trim(), body });
  }
}

// The sentence that actually contains the term beats the first sentence.
const relevant = (body) => {
  const sentences = body.split(/(?<=[.!?])\s+/).filter(s => hits(s));
  const picked = (sentences.length ? sentences : [body]).join(' ');
  return picked.length > 420 ? picked.slice(0, 420) + '…' : picked;
};

console.log(`\n${b(`Record of "${term}"`)}\n${'─'.repeat(62)}`);

if (entries.length) {
  console.log(`\n${b('Decisions')}  ${dim(`${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}, newest first`)}\n`);
  for (const e of entries.reverse().slice(0, 6)) {
    console.log(`  ${b(e.date)} ${dim('— ' + e.agent)}`);
    console.log(`  ${relevant(e.body).replace(/\n+/g, ' ')}\n`);
  }
  if (entries.length > 6) console.log(dim(`  …and ${entries.length - 6} older. Narrow the term to see them.\n`));
} else {
  console.log(`\n${dim('  Nothing in DECISION_LOG.md.')}\n`);
}

// ── The governed documents ───────────────────────────────────────────────────
const GOVERNED = ['VISION.md', 'DECISIONS.md', 'FRAMEWORKS.md', 'FOUNDATIONS.md',
                  'AGENTS.md', 'ARCHITECTURE_AUDIT.md', 'WORK_REMAINING.md'];
const doc = [];
for (const file of GOVERNED.filter(f => fs.existsSync(f))) {
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.trim() && hits(line)) doc.push({ file, n: i + 1, line: line.trim() });
  });
}

if (doc.length) {
  console.log(`${b('Governed documents')}  ${dim(`${doc.length} line(s) — these win any conflict`)}\n`);
  for (const d of doc.slice(0, 8)) {
    console.log(`  ${b(d.file + ':' + d.n)}  ${d.line.length > 150 ? d.line.slice(0, 150) + '…' : d.line}`);
  }
  if (doc.length > 8) console.log(dim(`\n  …and ${doc.length - 8} more.`));
  console.log('');
} else {
  console.log(`${dim('No governed document mentions it.')}\n`);
}

if (!entries.length && !doc.length) {
  console.log(dim('Not decided before, as far as the record goes. Decide it, then `npm run log` it.\n'));
}
