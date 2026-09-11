import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Three agents share this working tree, so `git status` is a snapshot of
// something moving. Before concluding that work is broken or abandoned, ask
// when it was last written. Agents write in batches, so several files sharing
// one timestamp is one action, not several.

const QUIET_MINUTES = 5;
const SRC = path.resolve('src');

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(jsx?|css)$/.test(e.name)) files.push([full, fs.statSync(full).mtimeMs]);
  }
})(SRC);

files.sort((a, b) => b[1] - a[1]);
const now = Date.now();
const newest = files[0];
const agoMin = (now - newest[1]) / 60000;

const fmt = (ms) => {
  const m = Math.floor((now - ms) / 60000);
  const s = Math.floor(((now - ms) % 60000) / 1000);
  return m > 0 ? `${m}m ${s}s ago` : `${s}s ago`;
};

const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim();

// A deletion leaves no file, so it has no mtime and the scan above cannot see
// it. On 11 September this reported "quiet, safe to deploy" while a governed
// component had been deleted and the build was broken. Pending deletions and
// new untracked source therefore count as work in progress in their own right,
// however long ago the surviving files were written.
const pendingDeletes = dirty.split('\n').filter(l => /^ ?D /.test(l) && l.includes('src/'));
const untrackedSrc = dirty.split('\n').filter(l => /^\?\? /.test(l) && l.includes('src/'));
const midChange = pendingDeletes.length > 0 || untrackedSrc.length > 0;

console.log('');
if (midChange) {
  console.log('⚠️  WORK IN PROGRESS — the tree has changes git can see but mtimes cannot');
  if (pendingDeletes.length) console.log(`   ${pendingDeletes.length} deleted source file(s) — a deletion has no timestamp to age out`);
  if (untrackedSrc.length) console.log(`   ${untrackedSrc.length} new untracked source file(s)`);
  console.log('   Run npm run test:qc before trusting this tree. Do not deploy blind.\n');
} else if (agoMin < QUIET_MINUTES) {
  console.log(`⚠️  SOMEONE IS WORKING — last edit ${fmt(newest[1])}`);
  console.log('   Do not deploy, do not commit their files, and do not conclude');
  console.log('   anything is broken. Read again once it is quiet.\n');
} else {
  console.log(`✅ Quiet for ${Math.floor(agoMin)}m — safe to read, build and deploy.\n`);
}

console.log('Most recently written:');
for (const [full, ms] of files.slice(0, 5)) {
  console.log(`  ${fmt(ms).padEnd(12)} ${path.relative(process.cwd(), full)}`);
}

console.log(dirty ? `\nUncommitted (${dirty.split('\n').length} paths):\n${dirty.split('\n').map(l => '  ' + l).join('\n')}\n` : '\nTree is clean.\n');
