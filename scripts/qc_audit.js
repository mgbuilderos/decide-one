import { createHash } from 'node:crypto';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { parse } from '@babel/parser';
import vm from 'node:vm';
import { colourViolations } from './style_contract.js';

const SRC_DIR = path.resolve('src');
let errors = [];

function scanFiles(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFiles(fullPath, callback);
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js') || entry.name.endsWith('.css')) {
      callback(fullPath, fs.readFileSync(fullPath, 'utf8'));
    }
  }
}

console.log('🔍 Running Decide One Quality Control (QC) Audit...\n');

// Rule 0: Governed surfaces must exist — and must still be reached.
//
// Most rules below read their subject inside `if (fs.existsSync(...))`, so a
// deleted or renamed file does not fail the audit — it silently stops being
// checked, and the audit still prints green. A rule that cannot see its
// subject has not passed; it has abstained.
//
// Existing is not the same as being reached. On 12 September
// MonthlyBreakerPage.jsx was still on disk, still governed by Rule 18, and had
// no importer at all. What git records is narrow and is worth stating exactly,
// because this comment is the durable account: 4e68de4 rewrote App.jsx across
// 30 files for a month picker and a motion vocabulary, and in doing so removed
// the import AND the render site of both MonthlyBreakerPage and
// DayConditionPrompt, naming neither in its message. `git log -S` on either
// name returns only that commit and the initial one. Git does not record how a
// change was staged, so how the two were swept in is inference, not evidence.
// The file existed, so Rule 0 passed, and a governed surface sat unreachable
// while the audit printed green. So the second clause walks the import graph from
// src/main.jsx — static imports, `React.lazy(() => import(...))` and CSS
// `@import` alike — and fails any surface the running application never
// arrives at.
//
// That walk is transitive on purpose. RapidLogSection imports BulletItem
// imports TaskNaturalLanguageParser; asking only "does something import this"
// clears all three, because each does have an importer. Asking "does the
// application reach this" clears none of them, which is the truth.
//
// This gate names every file the rules depend on. Removing one is then a
// failure with a reason, rather than a quiet gap in the contract between three
// agents. Taking a surface off this list is deliberate work: it means saying
// in DECISIONS.md why the rules that guarded it no longer need to.
const governedSurfaces = [
  ['App.jsx', 'Rules 4 and 20 — viewport lock, slim width, keyboard routing'],
  ['index.css', 'Rules 6 and 9 — the 24px grid cadence'],
  ['components/MonthlyLogSpread.jsx', 'Rule 7 — single-column monthly spread'],
  ['components/HeaderToolbar.jsx', 'Rule 8 — two-tier masthead, no speaker button'],
  ['components/UnifiedMenuModal.jsx', 'Rule 8 — one menu, complete secondary navigation'],
  ['utils/executionModel.js', 'Rule 22 — the methods are enforced here, not suggested'],
  ['utils/licenseManager.js', 'Rules 18 and 23 — offline verification, signed keys'],
  ['utils/licenseKeys.js', 'Rule 23 — signed per-buyer licences replaced shared keys'],
  ['utils/archivalExport.js', 'Rule 18 — the export engine the Patron tier promises'],
  ['components/PatronUpgradeModal.jsx', 'Rule 18 — the upgrade surface'],
  ['components/YearlyViewSpread.jsx', 'Rule 18 — the twelve-month annual view'],
  ['components/ExecutionLayer.jsx', 'Rule 22 — capacity and the active clock'],
  ['components/DayReport.jsx', 'Rule 22 — closure without a verdict'],
  ['components/ExecutiveClosureRitualModal.jsx', 'Rule 22 — the closure ritual'],
  ['components/InlineTimeControl.jsx', 'Rule 22 and B-35 — per-line time control']
];

// The import graph, walked from the one file index.html actually loads.
const ENTRY_POINT = path.join(SRC_DIR, 'main.jsx');
const RESOLVE_SUFFIXES = ['', '.jsx', '.js', '.css', '/index.jsx', '/index.js'];

function stripComments(content) {
  // A commented-out import is not an import, and the specifier pattern below
  // cannot tell the difference on its own — which is how the first version of
  // this check passed its own negative test by accident. Only whole-line `//`
  // comments are cut: a `//` in the middle of a line is far more often a URL
  // than a disabled import, and halving one would leave an unterminated string
  // for the pattern to misread.
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

function importSpecifiers(rawContent, isCss) {
  const content = stripComments(rawContent);
  // `from '…'`, bare `import '…'` and `import('…')` all reduce to a quoted
  // specifier following `from` or `import`. CSS states its own `@import`.
  const pattern = isCss
    ? /@import\s+(?:url\()?['"]([^'"]+)['"]/g
    : /(?:from\s*|import\s*\(?\s*)['"]([^'"]+)['"]/g;
  const found = [];
  let match;
  while ((match = pattern.exec(content)) !== null) found.push(match[1]);
  return found;
}

function resolveSpecifier(fromFile, specifier) {
  if (!specifier.startsWith('.')) return null; // node_modules — not ours to walk
  const base = path.resolve(path.dirname(fromFile), specifier);
  for (const suffix of RESOLVE_SUFFIXES) {
    const candidate = base + suffix;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function filesReachableFromEntry() {
  const reached = new Set();
  const queue = [ENTRY_POINT];
  while (queue.length > 0) {
    const file = queue.pop();
    if (reached.has(file)) continue;
    reached.add(file);
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const specifier of importSpecifiers(content, file.endsWith('.css'))) {
      const resolved = resolveSpecifier(file, specifier);
      if (resolved !== null && !reached.has(resolved)) queue.push(resolved);
    }
  }
  return reached;
}

const entryExists = fs.existsSync(ENTRY_POINT);
if (!entryExists) {
  errors.push(
    '[Rule 0 Violation] src/main.jsx is missing — it is the entry point every ' +
    'reachability check starts from, and index.html loads nothing else.'
  );
}
const reachedFiles = entryExists ? filesReachableFromEntry() : new Set();

for (const [rel, why] of governedSurfaces) {
  const fullPath = path.join(SRC_DIR, rel);
  if (!fs.existsSync(fullPath)) {
    errors.push(
      `[Rule 0 Violation] Governed surface src/${rel} is missing — ${why}. ` +
      'Deleting it disables those checks silently; amend the governedSurfaces ' +
      'list and record why in DECISIONS.md first.'
    );
  } else if (entryExists && !reachedFiles.has(fullPath)) {
    errors.push(
      `[Rule 0 Violation] Governed surface src/${rel} exists but nothing reaches ` +
      `it from src/main.jsx — ${why}. Vite tree-shakes it, so it never reaches ` +
      'the bundle: the rule above is asserting a guarantee about something the ' +
      'product does not contain. Either wire it back into the running ' +
      'application, or take it off governedSurfaces and record in DECISIONS.md ' +
      'why those rules no longer need to guard anything.'
    );
  }
}

// Retired surfaces are the inverse of the list above: modules a decision took
// out of the product, which must stay out. They are checked the same way, by
// walking the import graph from src/main.jsx, because that is the question
// that matters. A retired file reached by any path ships all of itself,
// whatever imports it. One that is only back on disk ships nothing yet, but is
// one import away, so it fails too.
//
// Both entries were retired on 14 September 2026, when BR8 was resolved toward
// the instrument register (DECISIONS.md BR8, UI_BRIEF §7.3). Until then the
// illustrations were a governed surface here, required by Rule 15. Bringing
// either back is a decision to reverse in DECISIONS.md first; git history
// holds both files.
const retiredSurfaces = [
  ['components/NotebookCover.jsx', 'the notebook cover and its open/close stage (P11; BR8 resolved toward the instrument register)'],
  ['data/monthIllustrations.jsx', 'the twelve month illustrations (P11; BR8 resolved toward the instrument register)']
];

for (const [rel, why] of retiredSurfaces) {
  const fullPath = path.join(SRC_DIR, rel);
  if (entryExists && reachedFiles.has(fullPath)) {
    errors.push(
      `[Rule 0 Violation] Retired surface src/${rel} is reached from src/main.jsx, so it ships in ` +
      `the bundle — ${why}. Remove the import that reaches it, or reverse the decision in ` +
      'DECISIONS.md first.'
    );
  } else if (fs.existsSync(fullPath)) {
    errors.push(
      `[Rule 0 Violation] Retired surface src/${rel} is back on disk — ${why}. Nothing reaches it ` +
      'yet, but one import would ship it. Delete it, or reverse the decision in DECISIONS.md first.'
    );
  }
}

// Rules below name their subjects inline rather than on governedSurfaces, and
// an inline subject has the same failure mode Rule 0 was written for: when the
// named file is absent or unreachable, the rule stops applying and says nothing.
// Rule 9 is how that looks in practice - two of its three subjects, HabitTracker
// and EveningReflection, were deliberately cut by P2 and P3, so the rule has
// been printing green while guarding nothing at all.
//
// Declaring subjects through this makes the abstention audible.
function requireLiveSubjects(rule, subjects, why) {
  for (const rel of subjects) {
    const full = path.join(SRC_DIR, rel);
    if (!fs.existsSync(full)) {
      errors.push(
        `[${rule} Violation] Subject src/${rel} does not exist, so ${rule} is ` +
        `guarding nothing - ${why}. Point the rule at what carries this now, or ` +
        'retire it in DECISIONS.md.'
      );
    } else if (entryExists && !reachedFiles.has(full)) {
      errors.push(
        `[${rule} Violation] Subject src/${rel} exists but nothing reaches it ` +
        `from src/main.jsx, so ${rule} is grading a dead file - ${why}. Point the ` +
        'rule at what carries this now, or retire it in DECISIONS.md.'
      );
    }
  }
  return subjects.filter(rel => fs.existsSync(path.join(SRC_DIR, rel)));
}

// AGENTS.md is read by Codex and Antigravity; CLAUDE.md by Claude Code. They are
// two copies of one rulebook with nothing keeping them identical, so an edit to
// one would silently give the agents different rules. Found 14 September 2026.
if (fs.existsSync('AGENTS.md') && fs.existsSync('CLAUDE.md')
    && fs.readFileSync('AGENTS.md', 'utf8') !== fs.readFileSync('CLAUDE.md', 'utf8')) {
  errors.push('[Rule 0 Violation] AGENTS.md and CLAUDE.md have drifted apart. They are the same rulebook '
    + 'for different agents; make every edit in both.');
}

// Shared by Rules 6, 19 and others. It used to be declared inside Rule 4's body;
// rewriting Rule 4 on 13 September removed it and the whole audit crashed with a
// ReferenceError, which `node --check` cannot see. No rule body may own a variable
// another rule depends on. cssPath sat at the top of Rule 6's body for the same
// reason until 15 September, when Rules 6 and 19 were rewritten together.
const appPath = path.join(SRC_DIR, 'App.jsx');
const cssPath = path.join(SRC_DIR, 'index.css');

// The instrument sheet: the one element the day, week, month and year are drawn
// on. Rules 6 and 19 both grade it, and both find it by this one class on a
// className attribute, so they cannot disagree about which element is the sheet
// and a comment naming the class cannot stand in for it. Before 15 September
// 2026 four plans pointed at it three ways (embossed-notebook, instrument-sheet,
// data-sheet); this is the one anchor.
const SHEET_TOKEN = /(?<![\w-])instrument-sheet(?![\w-])/;
function sheetClassLines(content) {
  return content.split('\n')
    .map((text, index) => ({ text: text.replace(/\/\*.*?\*\//g, ''), line: index + 1 }))
    .filter(({ text }) => /className=/.test(text) && SHEET_TOKEN.test(text));
}

const visualGate = fs.existsSync('scripts/visual_check.js') ? fs.readFileSync('scripts/visual_check.js', 'utf8') : '';

// Rule 1: One self-hosted Inter system, with no font-mono escape hatch.
scanFiles(SRC_DIR, (filePath, content) => {
  if (content.includes('font-mono')) {
    errors.push(`[Rule 1 Violation] font-mono found in: ${path.relative(process.cwd(), filePath)}`);
  }
});
const typeTokens = fs.readFileSync(path.join(SRC_DIR, 'tokens.css'), 'utf8');
const tailwindConfig = fs.readFileSync(path.join(process.cwd(), 'tailwind.config.js'), 'utf8');
for (const asset of [
  'public/fonts/inter-latin-variable-normal.woff2',
  'public/fonts/inter-latin-variable-italic.woff2',
  'public/fonts/INTER-LICENSE.txt'
]) {
  if (!fs.existsSync(path.join(process.cwd(), asset))) {
    errors.push(`[Rule 1 Violation] Missing self-hosted Inter asset: ${asset}`);
  }
}
if (!/--font-instrument:\s*"Inter Variable", Inter, sans-serif/.test(typeTokens)) {
  errors.push('[Rule 1 Violation] --font-instrument must use the self-hosted Inter Variable face.');
}
if (!/sans:\s*\['"Inter Variable"', 'Inter', 'sans-serif'\]/.test(tailwindConfig)) {
  errors.push('[Rule 1 Violation] Tailwind sans utilities must resolve to Inter Variable.');
}

// Rule 2: No unmanaged overlapping dropdown popovers in item rows.
//
// It named BulletItem.jsx and Top3HardTasks.jsx. Top3HardTasks has not been
// reachable since 4e68de4, and neither forbidden pattern appears anywhere in
// src at all, so the rule could not fail for two independent reasons. It is a
// tripwire against a regression, not a statement that anything is currently
// wrong - but a tripwire across a doorway nobody uses is not a tripwire.
// Repointed at the components that actually draw a row today.
const rowSurfaces = requireLiveSubjects(
  'Rule 2',
  ['components/BulletItem.jsx', 'components/ProductivityFrameworks.jsx', 'components/InlineTimeControl.jsx'],
  'these are the item rows a person clicks, and a floating menu opened from one of them is the thing this forbids'
);
scanFiles(SRC_DIR, (filePath, content) => {
  if (rowSurfaces.some(rel => filePath.endsWith(path.join('src', rel)))) {
    if (content.includes('showCategoryMenu') || content.includes('activeCategoryPicker')) {
      errors.push(`[Rule 2 Violation] Unmanaged floating popover state found in row component: ${path.relative(process.cwd(), filePath)}`);
    }
  }
});

// Rule 3: neutral palette and literal colours, including the first paint.
const checkColours = (file, source) => {
  for (const value of colourViolations(source)) errors.push(`[Rule 3 Violation] ${path.relative(process.cwd(), file)} contains chromatic or unsupported colour ${value}`);
};
scanFiles(SRC_DIR, checkColours);
checkColours(path.resolve('index.html'), fs.readFileSync('index.html', 'utf8'));

// Rule 3, continued: the retired inks and paper tones stay retired (UI_BRIEF §7.2).
//
// The founder ruled black and white only on 13 September. The eight classes
// above never named what that ruling removed, so three coloured inks and two
// paper tones passed this rule while the settings menu still offered them.
// There are two halves, because either alone can be satisfied by something
// false. The names must be gone from src/, and a person who picked one before
// must still get carbon on white. The second half is executed, not grepped:
// the migration is imported and run here, and each path that brings settings
// in from outside the running page is checked to call it.
const RETIRED_APPEARANCE = /(?<![\w-])(?:oxblood|kon-?peki|sepia|washi|paper-tone-[a-z]+|ink-(?:oxblood|konpeki|sepia|blue|burgundy|graphite)|inkClass|paperToneClass|pm-ink-[a-z]+|pm-paper-(?:white|slate|ivory|swatch))\b/i;
scanFiles(SRC_DIR, (filePath, content) => {
  content.split('\n').forEach((line, index) => {
    const retired = line.match(RETIRED_APPEARANCE);
    if (retired) {
      errors.push(
        `[Rule 3 Violation] Retired ink or paper tone "${retired[0]}" at ` +
        `${path.relative(process.cwd(), filePath)}:${index + 1}. Black and white only ` +
        '(UI_BRIEF §7.2): carbon on white is the one appearance.'
      );
    }
  });
});

const appearanceSubjects = requireLiveSubjects(
  'Rule 3',
  ['utils/appearance.js', 'hooks/useJournalStorage.js'],
  'a stored ink or paper tone must be migrated to carbon on white on load and on import'
);
if (appearanceSubjects.includes('utils/appearance.js')) {
  const canonical = (value) => JSON.stringify(Object.keys(value || {}).sort().map(key => [key, value[key]]));
  try {
    const { normaliseAppearance } = await import(pathToFileURL(path.join(SRC_DIR, 'utils/appearance.js')).href);
    const legacy = Object.freeze({ inkColor: 'sepia', paperTone: 'washi', darkMode: true, paperStyle: 'square' });
    const migrated = normaliseAppearance(legacy);
    const expected = { inkColor: 'carbon', paperTone: 'white', darkMode: true, paperStyle: 'square' };
    const fromNothing = normaliseAppearance(undefined);
    if (migrated === legacy || canonical(migrated) !== canonical(expected)) {
      errors.push(
        `[Rule 3 Violation] normaliseAppearance(${JSON.stringify(legacy)}) returned ` +
        `${JSON.stringify(migrated)}; it must return a new object equal to ${JSON.stringify(expected)}. ` +
        'Anyone who picked a coloured ink or paper tone would keep it.'
      );
    }
    if (canonical(fromNothing) !== canonical({ inkColor: 'carbon', paperTone: 'white' })) {
      errors.push(
        `[Rule 3 Violation] normaliseAppearance(undefined) returned ${JSON.stringify(fromNothing)}; ` +
        'a backup with no settings must still import as carbon on white.'
      );
    }
  } catch (e) {
    errors.push(
      `[Rule 3 Violation] src/utils/appearance.js could not be run (${e.message}). The migration ` +
      'must stay a pure, dependency-free module that returns a new object, so this audit can execute it.'
    );
  }
}
if (appearanceSubjects.includes('hooks/useJournalStorage.js')) {
  const ast = parse(fs.readFileSync(path.join(SRC_DIR, 'hooks/useJournalStorage.js'), 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  const visit = (node, fn) => {
    if (!node || typeof node !== 'object') return;
    if (node.type) fn(node);
    for (const [key, child] of Object.entries(node)) if (!['comments','leadingComments','trailingComments'].includes(key)) {
      if (Array.isArray(child)) child.forEach(n=>visit(n,fn)); else if (child && typeof child === 'object') visit(child,fn);
    }
  };
  for (const route of ['loadVolumeDataFromStorage','importJSON','importEncryptedVault']) {
    let root;
    visit(ast, n=>{ if ((n.type === 'FunctionDeclaration' || n.type === 'VariableDeclarator') && n.id?.name === route) root = n; });
    let migrated = false;
    visit(root, n=>{ if (n.type === 'CallExpression' && n.callee?.name === 'normaliseAppearance') migrated = true; });
    if (!migrated) errors.push(`[Rule 3 Violation] ${route} does not call normaliseAppearance; comments are not calls.`);
  }
}

// Rule 4: The instrument holds one screen — no scroll on either axis.
//
// This rule used to assert that App.jsx contained the strings 'overflow-hidden'
// and 'h-screen'. It was green for the life of the project while the daily view
// pushed up to 97px of the day out of reach on a laptop, because a string being
// present says nothing about what the page does. Proved dead on 13 September
// 2026 by rendering the daily view in a 300px viewport and watching it pass.
//
// The measurement now lives in scripts/visual_check.js, which renders every
// instrument view in Chrome at eight viewports and fails if any container
// scrolls or clips. This rule guards that the measurement still exists.
if (!/fixed:\s*true/.test(visualGate)) {
  errors.push('[Rule 4 Violation] scripts/visual_check.js declares no `fixed: true` surface. '
    + 'Nothing is measuring whether the instrument holds one screen.');
}
if (!/unreachable/.test(visualGate)) {
  errors.push('[Rule 4 Violation] scripts/visual_check.js no longer checks for unreachable content. '
    + 'A container that clips is worse than one that scrolls, and neither may ship.');
}


// Rule 5: Consumer-Friendly Language Gate (Prohibits technical jargon in user-facing UI)
const forbiddenJargon = [
  'Rapid Log',
  'Hard Tasks',
  'Daily Rituals',
  'BuJo Syntax'
];
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.endsWith('.jsx')) {
    for (const term of forbiddenJargon) {
      // Check for user-facing string literals or JSX text
      if (content.includes(`>${term}<`) || content.includes(`'${term}'`) || content.includes(`"${term}"`)) {
        errors.push(`[Rule 5 Violation] Forbidden jargon "${term}" found in: ${path.relative(process.cwd(), filePath)}`);
      }
    }
  }
});

// Rule 6: 24px Universal Grid Cadence Gate
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (!cssContent.includes('background-size: 24px 24px')) {
    errors.push('[Rule 6 Violation] index.css does not define background-size: 24px 24px for paper grid.');
  }
}
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  // The check was the literal string 'p-6 embossed-notebook', which tested
  // that two class names sat next to each other in the source rather than that
  // the padding was 24px. On 13 September 2026 density steps were added for
  // short viewports — below 820px the notebook padding tightens so the day
  // stays reachable — and the rule failed on the adjacency while the 24px
  // full-density padding it exists to protect was untouched. It now asserts
  // the property: the notebook element carries p-6, whatever follows it.
  //
  // On 15 September the embossed chassis was flattened and the class renamed
  // from embossed-notebook to instrument-sheet (UI_BRIEF §7.3). The rule now
  // finds the sheet by SHEET_TOKEN on a className, shared with Rule 19, and
  // requires exactly one: with two, it would grade whichever came first.
  const sheets = sheetClassLines(appContent);
  if (sheets.length !== 1) {
    errors.push(
      `[Rule 6 Violation] App.jsx has ${sheets.length} className attributes carrying instrument-sheet; ` +
      'there must be exactly one sheet, or the 24px padding cannot be checked on it.'
    );
  } else if (!/\bp-6\b/.test(sheets[0].text)) {
    errors.push(`[Rule 6 Violation] App.jsx:${sheets[0].line} the instrument sheet does not use p-6 (24px) padding for exact grid coordinate sync.`);
  }
}

// Rule 7: Single-column monthly layout gate (No multi-column collision in 480px canvas)
const monthlyPath = path.join(SRC_DIR, 'components/MonthlyLogSpread.jsx');
if (fs.existsSync(monthlyPath)) {
  const monthlyContent = fs.readFileSync(monthlyPath, 'utf8');
  if (monthlyContent.includes('grid-cols-12') || monthlyContent.includes('col-span-5')) {
    errors.push('[Rule 7 Violation] MonthlyLogSpread.jsx still contains multi-column grid layout classes.');
  }
}

// Rule 8: One clear header and one complete secondary menu.
const headerPath = path.join(SRC_DIR, 'components/HeaderToolbar.jsx');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  if (headerContent.includes('Volume2') || headerContent.includes('VolumeX')) {
    errors.push('[Rule 8 Violation] HeaderToolbar.jsx still renders Volume/Speaker controls.');
  }
  if (headerContent.includes('instrument-popover') || headerContent.includes('All Settings')) {
    errors.push('[Rule 8 Violation] The header has restored the old menu-inside-a-menu pattern.');
  }
  if (!headerContent.includes('aria-haspopup="dialog"') || !headerContent.includes('<span>Menu</span>')) {
    errors.push('[Rule 8 Violation] The header must expose one Menu control that opens the unified dialog.');
  }
  const unifiedMenuPath = path.join(SRC_DIR, 'components/UnifiedMenuModal.jsx');
  const unifiedMenuContent = fs.readFileSync(unifiedMenuPath, 'utf8');
  for (const requiredLabel of ['DECISION SPACE', "['work', 'Work']", "['settings', 'Settings']", "['export', 'Export']", "['about', 'About']"]) {
    if (!unifiedMenuContent.includes(requiredLabel)) {
      errors.push(`[Rule 8 Violation] Unified menu is missing ${requiredLabel}.`);
    }
  }
  if (unifiedMenuContent.includes('Lifetime Access')) {
    errors.push('[Rule 8 Violation] The free instrument menu must not advertise a paid access tier.');
  }
}

// Rule 9: Grid Cadence Spacing Gate (No non-multiple-of-24 gaps in task/habit/reflection components)
//
// HabitTracker.jsx and EveningReflection.jsx were named here and are absent -
// P2 and P3 cut them, B-1 records it - and Top3HardTasks.jsx is unreachable.
// All three subjects were gone, so the rule was entirely vacuous. The 24px
// cadence still matters; it is these components that carry it now.
const nonCadencePatterns = ['space-y-[16px]', 'space-y-[12px]', 'gap-[16px]', 'gap-[12px]'];
const cadenceSurfaces = requireLiveSubjects(
  'Rule 9',
  [
    'components/ProductivityFrameworks.jsx',
    'components/ExecutionLayer.jsx',
    'components/InlineTimeControl.jsx',
    'components/RapidLogSection.jsx',
    'components/BulletItem.jsx',
    'components/DayReport.jsx'
  ],
  'the 24px line cadence is what makes the page read as ruled paper rather than a form'
);
scanFiles(SRC_DIR, (filePath, content) => {
  if (cadenceSurfaces.some(rel => filePath.endsWith(path.join('src', rel)))) {
    for (const pattern of nonCadencePatterns) {
      if (content.includes(pattern)) {
        errors.push(`[Rule 9 Violation] Non-cadence spacing "${pattern}" found in: ${path.relative(process.cwd(), filePath)}`);
      }
    }
  }
});

// Rule 10: visual measurement plus cheap guards against retired chrome.
const visualRule10 = fs.readFileSync('scripts/visual_check.js', 'utf8');
for (const anchor of ['const brandChrome =', 's.backgroundImage', 's.boxShadow', 'm.brandChrome']) {
  if (!visualRule10.includes(anchor)) errors.push(`[Rule 10 Violation] visual badge measurement missing ${anchor}`);
}
//
// Until 15 September 2026 this rule required App.jsx to carry the woven
// "DECIDE ONE" twill tag. BR8 was resolved toward the instrument register on
// 14 September (DECISIONS.md BR8, UI_BRIEF §7.3), and the tag was removed from
// App.jsx, from both privacy-shutter cards and from index.css. So the rule is
// inverted: a woven tag anywhere under src/ fails, in markup or in CSS.
//
// It matches `woven`, not the "DECIDE ONE" label, because that label is also
// the weekly PDF's heading, which is not book chrome. Comments are stripped
// first, so a note about the tag is not the tag. The message says whether
// src/main.jsx reaches the file, which is the difference between shipping it
// and being one import away from shipping it.
scanFiles(SRC_DIR, (filePath, content) => {
  if (/woven/i.test(stripComments(content))) {
    const reach = reachedFiles.has(filePath)
      ? 'src/main.jsx reaches this file, so the tag ships.'
      : 'Nothing reaches this file from src/main.jsx yet; one import would ship it.';
    errors.push(
      `[Rule 10 Violation] ${path.relative(process.cwd(), filePath)} carries the woven tag, which was retired ` +
      `with the book chrome (P11; BR8 resolved toward the instrument register). ${reach} ` +
      'Remove it, or reverse the decision in DECISIONS.md first.'
    );
  }
  if (filePath.includes('HeaderToolbar.jsx')) {
    if (content.includes('MoreHorizontal') || content.includes('isMoreOpen')) {
      errors.push(`[Rule 10 Violation] HeaderToolbar still contains floating 3-dot menu.`);
    }
  }
  if (filePath.includes('App.jsx')) {
    if (content.includes('connecting-tie-cord') || content.includes('tie-clasp-top')) {
      errors.push(`[Rule 10 Violation] App.jsx still contains harsh black tie cord.`);
    }
  }
});

// Rule 11: Framework Roster Gate (P5/P6 — exactly three methods ship; the cut three must not return)
requireLiveSubjects(
  'Rule 11',
  ['components/ProductivityFrameworks.jsx'],
  'Rules 11 and 12 both read it, and nothing on governedSurfaces covers it'
);
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.includes('ProductivityFrameworks.jsx')) {
    const shipped = (content.match(/^\s*id: '(rule_of_3|ivy_lee|eisenhower)',/gm) || []).length;
    if (shipped !== 3) {
      errors.push(`[Rule 11 Violation] Expected exactly 3 shipped frameworks; found ${shipped}.`);
    }
    for (const cut of ['moscow', 'one_three_five', 'pareto']) {
      if (content.includes(`id: '${cut}'`)) {
        errors.push(`[Rule 11 Violation] Framework "${cut}" was cut by P6 and must not return.`);
      }
    }
    if (content.includes('handleToggleEisenhower = (qKey) =>') || content.includes('eData[quad.key][0]')) {
      errors.push('[Rule 11 Violation] ProductivityFrameworks.jsx hardcodes single-item access for Eisenhower Matrix (multi-task array required).');
    }
  }
});

// Rule 12: Framework grid alignment and wrapping safety.
//
// Was: ProductivityFrameworks.jsx must contain 'whitespace-nowrap' and
// 'h-[28px]' somewhere in a thousand lines. That is satisfied by a comment.
// Wrapping and misalignment are visible properties, so they are measured:
// visual_check.js fails on any element that overflows its viewport or clips
// content sideways without an ellipsis.
if (!/clipped_x/.test(visualGate)) {
  errors.push('[Rule 12 Violation] scripts/visual_check.js no longer checks for sideways clipping. '
    + 'Text cut with text-overflow: clip gives no sign anything is missing.');
}


// Rules 13/14: flat day movement; date and closure never depend on animation.
{
  const { stepDate, shouldOfferClosure } = await import('../src/utils/dayNavigation.js');
  for (const [start, delta, expected] of [['2026-01-31T12:00:00', 1, 1], ['2026-03-01T12:00:00', -1, 28], ['2028-02-28T12:00:00', 1, 29]]) {
    if (stepDate(new Date(start), delta).getDate() !== expected) errors.push('[Rule 13 Violation] day step fails a calendar boundary');
  }
  scanFiles(SRC_DIR, (file, content) => {
    if (/PageTurnLeaf|flipState|pendingTurnRef|flippingbook-stage|mobile-fold-turn|preserve-3d|kindle-turn|bifold/.test(stripComments(content))) errors.push('[Rule 13 Violation] retired 3D day chrome in ' + file);
  });
  const app = stripComments(fs.readFileSync(path.join(SRC_DIR, 'App.jsx'), 'utf8'));
  if (!app.includes('setCurrentDate(current => stepDate(current, delta, directTargetDate))')) errors.push('[Rule 13 Violation] date must update immediately from current state');
  const css = stripComments(fs.readFileSync(path.join(SRC_DIR, 'book.css'), 'utf8'));
  if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\.book-day-step\s*\{\s*animation:\s*none/.test(css)) errors.push('[Rule 13 Violation] book step needs a still reduced-motion equivalent');
  const yes = { turningToVerso: true, hasSomethingToClose: true, alreadyClosedToday: false, somethingRunning: false, dateKey: '2026-09-15', todayKey: '2026-09-15' };
  if (!shouldOfferClosure(yes)) errors.push('[Rule 14 Violation] eligible turn must offer closure');
  for (const patch of [{turningToVerso:false},{hasSomethingToClose:false},{alreadyClosedToday:true},{somethingRunning:true},{dateKey:'2026-09-14'}]) {
    if (shouldOfferClosure({...yes,...patch})) errors.push('[Rule 14 Violation] closure offered for ' + JSON.stringify(patch));
  }
  if (!app.includes('if (shouldOfferClosure({ turningToVerso, hasSomethingToClose, alreadyClosedToday, somethingRunning, dateKey, todayKey }))') || !app.includes("x.state === 'RUNNING' || x.state === 'BREATHING'")) errors.push('[Rule 14 Violation] actual turn must use the guarded closure predicate');
}

// Rule 15: No notebook cover, and an old ?view=cover link opens the instrument.
//
// Was: monthIllustrations.jsx had to hold all twelve months, index.css had to
// carry .stage-book-closed and .stage-book-opening, and NotebookCover.jsx had to
// render the illustrations. BR8 was resolved toward the instrument register on
// 14 September 2026 (DECISIONS.md BR8, UI_BRIEF §7.3) and all three went, so the
// rule now guards the absence.
//
// Rule 0 fails if either retired module is reached from src/main.jsx. That
// catches the files coming back under their own names. This catches the cover
// coming back under another name, in any file main.jsx reaches: its state and
// props, its stage and transition classes, its open and close sounds, and the
// monogram styles only it used. Comments are stripped first, so a sentence
// about the cover is not the cover.
//
// It also executes viewFromParam, the function App.jsx passes ?view= through.
// Without the retired-view mapping, a ?view=cover bookmark from someone with no
// written days would open the landing page instead of the instrument.
{
  const COVER_REMNANTS = [
    /\bshowCover\b/, /\bonToggleCover\b/, /\bonViewCover\b/, /\bhandleToggleCover\b/,
    /\bcoverAnimation\b/, /NotebookCover\b/, /\bMONTH_ILLUSTRATIONS\b/,
    /stage-book-/, /cover-(?:opening|closing)-transition/, /book-cover-3d-leaf/, /\bcover-leaf-/,
    /['"]book-(?:open|close)['"]/, /monogram-(?:gold-foil|blind-deboss)/
  ];
  for (const file of reachedFiles) {
    let content;
    try {
      content = stripComments(fs.readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    for (const pattern of COVER_REMNANTS) {
      const match = content.match(pattern);
      if (!match) continue;
      errors.push(
        `[Rule 15 Violation] ${path.relative(process.cwd(), file)} carries "${match[0]}", part of the ` +
        'retired notebook cover, and src/main.jsx reaches it. The cover was retired when BR8 was ' +
        'resolved toward the instrument register (UI_BRIEF §7.3).'
      );
    }
  }

  const viewSubjects = requireLiveSubjects(
    'Rule 15',
    ['utils/viewParam.js'],
    'it decides where a ?view= link opens, including an old cover bookmark'
  );
  if (viewSubjects.includes('utils/viewParam.js')) {
    try {
      const { viewFromParam, initialView } = await import(pathToFileURL(path.join(SRC_DIR, 'utils/viewParam.js')).href);
      for (const retired of ['cover', 'landing']) {
      const opened = viewFromParam(retired);
      if (opened !== 'daily') {
        errors.push(
          `[Rule 15 Violation] viewFromParam('${retired}') returned ${JSON.stringify(opened)}; it must return ` +
          '"daily". A ?view=cover bookmark has to open the instrument, not the landing page.'
        );
      }
      }
      for (const view of ['daily', 'weekly', 'monthly', 'yearly', 'legal', 'methods']) {
        if (viewFromParam(view) !== view) {
          errors.push(`[Rule 15 Violation] viewFromParam('${view}') no longer opens ${view}.`);
        }
      }
    } catch (e) {
      errors.push(
        `[Rule 15 Violation] src/utils/viewParam.js could not be run (${e.message}). It must stay a ` +
        'pure, dependency-free module so this audit can execute it.'
      );
    }
    // Execute the actual activeView useState initializer. An unused resolver call
    // or a comment cannot satisfy this check. Babel already ships with Vite.
    try {
      const source = fs.readFileSync(path.join(SRC_DIR, 'App.jsx'), 'utf8');
      const ast = parse(source, { sourceType: 'module', plugins: ['jsx'] });
      const app = ast.program.body.find(n => n.type === 'ExportDefaultDeclaration').declaration;
      const binding = app.body.body.filter(n => n.type === 'VariableDeclaration')
        .flatMap(n => n.declarations).find(n => n.id.type === 'ArrayPattern' && n.id.elements[0]?.name === 'activeView');
      if (binding?.init?.callee?.name !== 'useState') throw new Error('activeView must be initialized with useState');
      const init = binding.init.arguments[0];
      const imported = ast.program.body.find(n => n.type === 'ImportDeclaration' && n.source.value === './utils/viewParam');
      if (!imported?.specifiers.some(n => n.imported?.name === 'initialView' && n.local.name === 'initialView')) throw new Error('initialView is not imported from viewParam');
      const { initialView } = await import(pathToFileURL(path.join(SRC_DIR, 'utils/viewParam.js')).href);
      for (const [search, expected] of [['', 'daily'], ['?view=landing', 'daily'], ['?view=cover', 'daily'], ['?view=unknown', 'daily'], ...['daily','weekly','monthly','yearly','legal','methods'].map(v => ['?view=' + v, v])]) {
        const actual = vm.runInNewContext('(' + source.slice(init.start, init.end) + ')()', { initialView, window: { location: { search } } }, { timeout: 1000 });
        if (actual !== expected) throw new Error(search + ' opens ' + actual + ' instead of ' + expected);
      }
      for (const retired of ['components/MarketingLandingPage.jsx', 'components/landing/JournalScene.jsx', 'components/landing/JournalDemo.jsx']) {
        if (fs.existsSync(path.join(SRC_DIR, retired))) throw new Error(retired + ' is retired');
      }
    } catch (e) { errors.push('[Rule 15 Violation] actual App activeView initializer: ' + e.message); }
  }

  const css = fs.readFileSync(path.join(SRC_DIR, 'index.css'), 'utf8');
  if (css.includes('calc(50% - 210px)')) {
    errors.push('[Rule 15 Violation] index.css still contains buggy calc(50% - 210px) strip offset.');
  }
}

// Rule 16: Zero date overflow and header wrapping.
//
// Was: DateHeader.jsx must contain 'whitespace-nowrap' and 'overflow-hidden',
// and SpreadPages.jsx must contain 'h-[48px]'. All three were present on
// 13 September 2026 while the date header silently cut 23px off "September 13
// 2026 · Sunday · Day 256" at 320px wide — the strings were there, the header
// still lost text. The visual gate caught it by rendering at 320px, which is
// why that viewport is now a permanent surface.
if (!/320,\s*h:\s*568/.test(visualGate)) {
  errors.push('[Rule 16 Violation] scripts/visual_check.js no longer renders a 320px-wide surface. '
    + 'That is the width the date header was being clipped at.');
}


// Rule 17: Zero "Bullet Journal" & Ryder Carroll Gate + Right Page Containment
const forbiddenBrands = ['bullet journal', 'ryder carroll', 'bujo'];
scanFiles(SRC_DIR, (filePath, content) => {
  const lower = content.toLowerCase();
  for (const phrase of forbiddenBrands) {
    if (lower.includes(phrase)) {
      errors.push(`[Rule 17 Violation] Prohibited phrase "${phrase}" found in: ${path.relative(process.cwd(), filePath)}`);
    }
  }
  // R3 — the right page may never introduce objects of its own. Habits (P2) and
  // evening reflection (P3) were cut precisely because they were separate
  // products sharing a spread; re-importing either reopens that failure.
  if (filePath.endsWith('SpreadPages.jsx')) {
    if (!content.includes('overflow-hidden')) {
      errors.push('[Rule 17 Violation] SpreadPages.jsx RightPage must enforce overflow-hidden.');
    }
    if (content.includes('HabitTracker') || content.includes('EveningReflection')) {
      errors.push('[Rule 17 Violation] RightPage must not reintroduce habits or reflection (P2, P3, R3).');
    }
  }
});

// Rule 22: Execution Layer Enforcement Gate — frameworks must be enforced, not
// drawn (P9). A method that can be ignored is a theme, which is the thing this
// product exists not to be.
const execModelPath = path.join(SRC_DIR, 'utils/executionModel.js');
if (!fs.existsSync(execModelPath)) {
  errors.push('[Rule 22 Violation] executionModel.js is missing — it is what enforces the methods (R6).');
} else {
  const execModel = fs.readFileSync(execModelPath, 'utf8');
  const required = {
    'export function isItemLocked': 'Ivy Lee order enforcement missing — without it the method is a numbered list (R6).',
    BREATHING: 'BREATHING state missing (R9).',
    timingAccuracy: 'timingAccuracy provenance missing — inferred figures must never read as measured (R7, R17).',
    'export function extendSession': 'extendSession missing — overrun must add time as information, never punish (R8).',
    'export function computeCapacity': 'computeCapacity missing — setting a duration is the capacity check (P14).'
  };
  for (const [token, message] of Object.entries(required)) {
    if (!execModel.includes(token)) errors.push(`[Rule 22 Violation] ${message}`);
  }
}
// R8 and R12 — the product observes; it does not scold, and it does not
// congratulate on a curve. Streaks went out with habit tracking, and a
// progress metaphor with a protagonist implies a failure state.
const surfacesThatMustNotGamify = [
  'components/ExecutionLayer.jsx',
  'components/InlineTimeControl.jsx',
  'components/DayReport.jsx',
  'components/ExecutiveClosureRitualModal.jsx'
];
const forbiddenTone = [
  'You failed', 'Try harder', 'You are late',
  'Day Streak', 'streak lost', 'Conquered', 'Flawless',
  'Shutdown Complete', 'Needle-Movers'
];
for (const rel of surfacesThatMustNotGamify) {
  const full = path.join(SRC_DIR, rel);
  if (!fs.existsSync(full)) {
    // Rule 0 reports this too. Kept here so the check does not quietly reopen
    // if the surface is ever taken off that list.
    errors.push(`[Rule 22 Violation] ${rel} is missing — its tone cannot be checked.`);
    continue;
  }
  const body = fs.readFileSync(full, 'utf8');
  for (const phrase of forbiddenTone) {
    if (body.includes(phrase)) {
      errors.push(`[Rule 22 Violation] Gamified or punitive language "${phrase}" in ${rel} — R8/R12 forbid streaks, verdicts and scolding.`);
    }
  }
}

// Rule 23: Licence Integrity Gate (B2) — no shared secret may unlock Patron,
// and the signing key must never reach the repository or the bundle.
const licKeysPath = path.join(SRC_DIR, 'utils/licenseKeys.js');
const licMgrPath = path.join(SRC_DIR, 'utils/licenseManager.js');
if (!fs.existsSync(licKeysPath)) {
  errors.push('[Rule 23 Violation] licenseKeys.js is missing — signed per-buyer licences are what replaced the shared promo keys.');
} else {
  const keys = fs.readFileSync(licKeysPath, 'utf8');
  if (!keys.includes('verifySignedLicense')) {
    errors.push('[Rule 23 Violation] verifySignedLicense is missing.');
  }
  // A JWK private key carries a "d" member. It must never appear in source.
  if (/"d"\s*:/.test(keys)) {
    errors.push('[Rule 23 Violation] A private key component ("d") appears in licenseKeys.js — the signing key must stay offline.');
  }
}
if (fs.existsSync(licMgrPath)) {
  const mgr = fs.readFileSync(licMgrPath, 'utf8');
  // The retired promo keys unlocked every copy and were readable in the bundle.
  // Substring match, not quote-adjacent: 'DECIDEONE-PATRON-2026' must trip the
  // 'PATRON-2026' check. Comments in this file deliberately never name a key.
  for (const retired of ['PATRON-2026', 'VIP-2026', 'FOUNDER-LIFETIME-PASS', 'EXECUTIVE-PATRON-ACCESS']) {
    if (mgr.includes(retired)) {
      errors.push(`[Rule 23 Violation] Shared promo key containing "${retired}" is back in licenseManager.js — one leaked string would unlock every copy.`);
    }
  }
}
// The signing key file must be ignored by git if it exists at all.
const signingKeyPath = path.join(process.cwd(), 'licence-signing-key.json');
if (fs.existsSync(signingKeyPath)) {
  const gitignore = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
  if (!gitignore.includes('licence-signing-key.json')) {
    errors.push('[Rule 23 Violation] licence-signing-key.json exists but is not gitignored.');
  }
}

// Rule 18: Rule 0 owns existence/reachability; verify the public entry points.
for (const [rel, names] of [['utils/licenseManager.js',['verifyLicenseKey','activateLicense']], ['utils/archivalExport.js',['generateMarkdownArchive','printAnnualBook']]]) {
  if (!fs.existsSync(path.join(SRC_DIR, rel))) continue; // Rule 0 reports this.
  const ast = parse(fs.readFileSync(path.join(SRC_DIR, rel), 'utf8'), {sourceType:'module'});
  const exports = ast.program.body.filter(n=>n.type === 'ExportNamedDeclaration').map(n=>n.declaration?.id?.name);
  for (const name of names) if (!exports.includes(name)) errors.push(`[Rule 18 Violation] ${rel} must export ${name}`);
}

// Rule 19: founder-approved book geometry, measured in Chrome.
const approvedQuickStart = '8d3d0d6ac631cddb3f2aba452f34ec143ce3688354e5380f4b36f2c2259d9282';
if (createHash('sha256').update(fs.readFileSync('src/components/QuickStart.jsx')).digest('hex') !== approvedQuickStart) errors.push('[Rule 19 Violation] the founder requested the initial popup remain unchanged');
for (const anchor of ['const bookGeometry =', 'm.bookGeometry', 'borderRadius', 'sheetStyle.boxShadow', 'bulletSize']) {
  if (!visualGate.includes(anchor)) errors.push(`[Rule 19 Violation] approved book measurement missing ${anchor}`);
}
const finalDesign = fs.readFileSync('FINAL_DESIGN.md', 'utf8');
for (const doc of ['AGENTS.md', 'CLAUDE.md']) {
  if (!fs.readFileSync(doc, 'utf8').includes('FINAL_DESIGN.md')) errors.push(`[Rule 19 Violation] ${doc} must point agents to FINAL_DESIGN.md`);
}
if (!finalDesign.includes('open two-page spread')) errors.push('[Rule 19 Violation] final design contract missing');

// Rule 20: Executive keyboard navigation — 1/2/3/4/T routing.
//
// Was: App.jsx must contain the strings "e.key === '1'" and so on. A handler
// can contain all five and be attached to nothing. visual_check.js now presses
// the keys in Chrome and asserts the view actually changes. It dispatches them
// inside the page, because CDP's injected keys crash headless Chrome on macOS.
if (!/dispatchEvent\(new KeyboardEvent\(type/.test(visualGate) || !/waitForView\(expected\)/.test(visualGate)) {
  errors.push('[Rule 20 Violation] scripts/visual_check.js no longer presses keys. '
    + 'A key handler that exists in source is not a key handler that is reached.');
}


// Rule 21: Zero IP Infringement / Trademark / Living Person Rights Gate (Strictly 0 Eat That Frog, 0 Buffett, 0 Pomodoro, 0 BuJo)
const strictlyForbiddenIP = [
  'eat_that_frog',
  'tackle the frog',
  'the frog',
  'frog',
  'buffett',
  'pomodoro',
  'bullet journal',
  'bujo',
  'ryder carroll'
];
scanFiles(SRC_DIR, (filePath, content) => {
  const lower = content.toLowerCase();
  for (const term of strictlyForbiddenIP) {
    if (lower.includes(term)) {
      errors.push(`[Rule 21 Violation] Strictly prohibited IP/trademark term "${term}" detected in: ${path.relative(process.cwd(), filePath)}`);
    }
  }
});

// Rule 24: Price Consistency Gate.
//
// B-28 is the record of why this exists: the landing page went live selling
// $24 / ₹1,999 while the decided price was $39 / ₹999, and nothing caught it.
// The price lives in four files and no rule checked that they agreed.
//
// VISION.md §11.1 is the single source of truth, because CLAUDE.md rule 5
// says §11 wins any conflict. Everything else must agree with it — the app
// especially, since that is what a buyer actually sees.
const visionPath = path.resolve("VISION.md");
if (!fs.existsSync(visionPath)) {
  errors.push("[Rule 24 Violation] VISION.md is missing — it is the canonical source of the price.");
} else {
  const vision = fs.readFileSync(visionPath, "utf8");
  const priceRe = new RegExp("\\$(\\d[\\d,]*) once", "g");
  const canonical = [...vision.matchAll(priceRe)].map((m) => m[1]);
  const unique = [...new Set(canonical)];

  // "Free" is a canonical price too, and the one in force since B-37. When
  // VISION declares it, no price may appear in the app at all - a number on a
  // screen is a promise, and this one would be a promise VISION did not make.
  const declaresFree = /Canonical price: free/i.test(vision);

  if (unique.length === 0 && declaresFree) {
    const anyMoney = new RegExp("(\\$|₹)(\\d[\\d,]*)", "g");
    scanFiles(SRC_DIR, (filePath, content) => {
      for (const hit of content.matchAll(anyMoney)) {
        errors.push(
          "[Rule 24 Violation] " + path.relative(process.cwd(), filePath) +
          " shows " + hit[1] + hit[2] + ", but VISION.md §11.1 declares the product free. " +
          "There is no price to display; asking for one is done in the closure ritual, not on a price tag."
        );
      }
    });
  } else if (unique.length === 0) {
    errors.push("[Rule 24 Violation] VISION.md states neither a canonical price nor that the product is free. Nothing else has anything to agree with.");
  } else if (unique.length > 1) {
    errors.push("[Rule 24 Violation] VISION.md disagrees with itself on the price: " + unique.join(" vs ") + ".");
  } else {
    const price = unique[0];

    // The app must never show a price VISION did not decide. This is B-28.
    const anyDollar = new RegExp("\\$(\\d[\\d,]*)", "g");
    scanFiles(SRC_DIR, (filePath, content) => {
      for (const hit of content.matchAll(anyDollar)) {
        if (hit[1] !== price) {
          errors.push(
            "[Rule 24 Violation] " + path.relative(process.cwd(), filePath) +
            " shows $" + hit[1] + " but VISION.md decided $" + price +
            ". This is B-28: the page selling a price the founder had not agreed."
          );
        }
      }
    });

    // Regional prices are decided in VISION or they do not ship. Under B-36
    // there is one worldwide price, so VISION names no rupee figure and none
    // may appear in the app. Reinstating one means changing VISION first.
    const anyRupee = new RegExp("₹(\\d[\\d,]*)", "g");
    const visionRupees = new Set([...vision.matchAll(anyRupee)].map((m) => m[1]));
    scanFiles(SRC_DIR, (filePath, content) => {
      for (const hit of content.matchAll(anyRupee)) {
        if (!visionRupees.has(hit[1])) {
          errors.push(
            "[Rule 24 Violation] " + path.relative(process.cwd(), filePath) +
            " shows ₹" + hit[1] + ", which VISION.md does not decide. " +
            "Regional pricing was removed by B-36; reinstating it changes VISION first."
          );
        }
      }
    });

    // The documents a buyer or an agent reads must not contradict the app.
    // Only meaningful when VISION names a number; under "free" there is none.
    const mustState = [
      ["README.md", "the first thing anyone reads"],
      ["MONETIZATION_PLAN.md", "the plan the price is decided in"]
    ];
    for (const [file, why] of mustState) {
      const full = path.resolve(file);
      if (!fs.existsSync(full)) {
        errors.push("[Rule 24 Violation] " + file + " is missing — " + why + ".");
      } else if (!fs.readFileSync(full, "utf8").includes("$" + price)) {
        errors.push(
          "[Rule 24 Violation] " + file + " does not state the canonical price $" +
          price + " — " + why + "."
        );
      }
    }
  }
}

// Rule 25: Telemetry Contract Gate.
//
// Six dashboard metrics were a permanent zero because the server analysed
// events that src/ never emitted, and nobody could tell the difference between
// "nothing happened" and "nothing was ever wired". A number that cannot move is
// worse than a missing one: it reads as a measurement and reports a fact.
//
// This binds the two halves together. Every event the analytics layer counts
// must be emitted somewhere in src/, or be named below as deliberately dormant.
{
  const analyticsFile = path.join(process.cwd(), 'server/src/analyticsService.js');
  const telemetryFile = path.join(process.cwd(), 'server/src/telemetryService.js');

  // Dormant on purpose. Each needs a reason, so removing one is a decision.
  const DORMANT = {
    experiment_impression: 'No assignment layer yet - TELEMETRY_SPEC §3.4 lists it as work, not a defect.'
  };

  if (fs.existsSync(analyticsFile) && fs.existsSync(telemetryFile)) {
    const serverSrc = fs.readFileSync(analyticsFile, 'utf8') + fs.readFileSync(telemetryFile, 'utf8');

    // Event names the server branches on or filters by.
    const expected = new Set();
    for (const m of serverSrc.matchAll(/event\s*(?:===?|=)\s*'([a-z0-9_]+)'/g)) expected.add(m[1]);
    for (const m of serverSrc.matchAll(/event\s+IN\s*\(([^)]*)\)/gi)) {
      for (const n of m[1].matchAll(/'([a-z0-9_]+)'/g)) expected.add(n[1]);
    }

    // Event names the app actually emits — and, separately, the ones it can
    // actually reach. This rule was written against emitters that did not
    // exist; an emitter sitting in a file nothing imports is the same defect
    // wearing a disguise, and the first version of this walk could not see the
    // difference. `emittedLive` is the honest set: a track() call the
    // application never executes emits nothing, whatever the grep says.
    const emitted = new Set();
    const emittedLive = new Set();
    const walkSrc = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkSrc(full);
        else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
          const body = fs.readFileSync(full, 'utf8');
          for (const m of body.matchAll(/track\(\s*'([a-zA-Z0-9_]+)'/g)) {
            emitted.add(m[1]);
            if (reachedFiles.has(full)) emittedLive.add(m[1]);
          }
        }
      }
    };
    walkSrc(path.join(process.cwd(), 'src'));

    // Direction 1: analysed but never emitted - a metric that cannot move.
    for (const name of [...expected].sort()) {
      if (emittedLive.has(name) || DORMANT[name]) continue;
      const orphanEmitter = emitted.has(name);
      errors.push(
        "[Rule 25 Violation] server/src analyses the event '" + name +
        (orphanEmitter
          ? "', and src/ contains a track() call for it, but only in a file the "
            + "application never reaches — so it emits nothing and the metric is a "
            + "permanent zero presented as a measurement. Wire the emitter back in, "
          : "' but nothing in src/ emits it, so every metric built on it is a "
            + "permanent zero presented as a measurement. Emit it, ") +
        "stop analysing it, or add it to DORMANT in this rule with the reason."
      );
    }

    // Direction 2: emitted but undocumented. Not every event needs a dedicated
    // metric - they all feed getFeatures' top_events distribution - so the test
    // is not "is it analysed" but "is it declared". TELEMETRY_SPEC.md §2 is the
    // registry, and an event absent from it is one nobody agreed to collect.
    const specFile = path.join(process.cwd(), 'TELEMETRY_SPEC.md');
    if (!fs.existsSync(specFile)) {
      errors.push("[Rule 25 Violation] TELEMETRY_SPEC.md is missing — it is the event registry.");
    } else {
      const spec = fs.readFileSync(specFile, 'utf8');
      for (const name of [...emitted].sort()) {
        if (new RegExp('`' + name + '`').test(spec)) continue;
        errors.push(
          "[Rule 25 Violation] src/ emits the event '" + name +
          "' but TELEMETRY_SPEC.md §2 does not list it. Every event collected " +
          "from someone must be written down before it is collected — add it to " +
          "the registry in §2, or stop emitting it."
        );
      }
    }
  } else {
    errors.push("[Rule 25 Violation] server/src/analyticsService.js or telemetryService.js is missing — the telemetry contract cannot be checked.");
  }
}

// Rule 26: No celebration — UI_BRIEF §7.4.
//
// Ticking the last line confirms the tick; the verso's "X against Y planned" is
// the whole acknowledgement. Until 14 September confetti fired in two places:
// ProductivityFrameworks, whenever every written line was ticked, and the
// licence hook after activation, whose static import put the library in the
// entry bundle. An unmerged branch (claude/great-snyder-b287a3, abb1ab4) re-adds
// it as a lazy import, which is why this rule exists rather than a deletion alone.
//
// It fails on each way back in. A dependency is how the library gets installed.
// An import anywhere under src/ is how it gets used. When src/main.jsx reaches
// the importing file, through the same walk Rule 0 uses, the library ships, and
// the message says so. A dynamic `import('…')` counts, because Vite still emits
// the chunk. A commented-out import is not an import.
{
  const CELEBRATION_PACKAGES = new Set(['fireworks-js', 'party-js', 'react-rewards']);
  const isCelebrationPackage = name => /confetti/i.test(name) || CELEBRATION_PACKAGES.has(name);
  const packageNameOf = specifier => specifier.split('/').slice(0, specifier.startsWith('@') ? 2 : 1).join('/');

  const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
    for (const name of Object.keys(manifest[field] || {})) {
      if (!isCelebrationPackage(name)) continue;
      errors.push(
        `[Rule 26 Violation] package.json ${field} lists ${name}. Completion confirms; ` +
        'it does not celebrate (UI_BRIEF §7.4). Uninstall it.'
      );
    }
  }

  scanFiles(SRC_DIR, (file, content) => {
    if (file.endsWith('.css')) return;
    for (const specifier of importSpecifiers(content, false)) {
      if (specifier.startsWith('.') || !isCelebrationPackage(packageNameOf(specifier))) continue;
      const rel = path.relative(process.cwd(), file);
      const reach = reachedFiles.has(file)
        ? 'src/main.jsx reaches this file, so the library ships in the bundle.'
        : 'Nothing reaches this file from src/main.jsx yet; wiring it in would ship the library.';
      errors.push(
        `[Rule 26 Violation] ${rel} imports '${specifier}'. ${reach} ` +
        'Completion confirms; it does not celebrate (UI_BRIEF §7.4).'
      );
    }
  });
}

// Summary Report
if (errors.length === 0) {
  console.log('✅ ALL STRUCTURAL QC CHECKS PASSED (not security or legal certification):');
  console.log('  - Rule 1: Self-hosted Inter everywhere; zero font-mono escapes');
  console.log('  - Rule 2: Zero unmanaged overlapping dropdown popovers in the item rows that ship');
  console.log('  - Rule 3: Neutral palette allow-list, achromatic literals and parsed appearance migration calls');
  console.log('  - Rule 4: Zero-scroll viewport lock & slim notepad proportions (max-w-[412px])');
  console.log('  - Rule 5: Consumer-friendly language gate (zero technical jargon in UI labels)');
  console.log('  - Rule 0: Governed surfaces exist AND are reached from main.jsx (a deleted or orphaned file fails rather than skipping its rules); retired surfaces are neither');
  console.log('  - Rule 6: Strict 24px universal grid cadence alignment (paper grid, and p-6 on the one instrument-sheet)');
  console.log('  - Rule 7: Single-column full-width monthly spread (no 2-column desktop squishing)');
  console.log('  - Rule 8: One header menu with four complete sections; no nested settings menu');
  console.log('  - Rule 9: 24px grid cadence in the components that ship it, each asserted reachable');
  console.log('  - Rule 10: Zero 3-dot menus, zero black tie cord, and no woven tag anywhere under src/ (retired with the book chrome)');
  console.log('  - Rule 11: Framework Roster Gate (exactly 3 methods ship; MoSCoW, 1-3-5 and Pareto stay cut)');
  console.log('  - Rule 12: Framework Grid Alignment & Wrapping Safety Gate (fixed header heights & whitespace-nowrap)');
  console.log('  - Rule 13: Immediate day selection, book transition and reduced motion');
  console.log('  - Rule 14: Closure turn conditions executed: today, written work, once, no running/breathing session');
  console.log('  - Rule 15: Direct instrument arrival: actual App initializer executed for first, retired and information links; no marketing or cover modules');
  console.log('  - Rule 16: Zero Date Overflow & Header Wrapping Gate (whitespace-nowrap & fixed 48px header boundary)');
  console.log('  - Rule 17: Zero "Bullet Journal" / Ryder Carroll Gate (100% Decide One brand purity & right page flex containment)');
  console.log('  - Rule 18: Archive and licence public exports (Rule 0 owns reachability)');
  console.log('  - Rule 19: Approved book geometry measured in Chrome; agent design contract preserved');
  console.log('  - Rule 20: Executive Universal Keyboard Navigation Gate (1/2/3/4/T routing, pressed in Chrome)');
  console.log('  - Rule 21: Restricted Naming Token Check (not trademark or copyright clearance)');
  console.log('  - Rule 22: Execution Layer Enforcement Gate (Ivy Lee order lock, breathing state, non-punitive overrun, timing provenance)');
  console.log('  - Rule 23: Licence Integrity Gate (signed per-buyer keys; no shared secret, no private key in source)');
  console.log('  - Rule 24: Price Consistency Gate (VISION §11.1 is the price - including when that price is free)');
  console.log('  - Rule 25: Telemetry Contract Gate (analysed events are emitted; emitted events are in the TELEMETRY_SPEC §2 registry)');
  console.log('  - Rule 26: No celebration (no confetti package in package.json, none imported under src/, none shipped from main.jsx)\n');
  process.exit(0);
} else {
  console.error(`❌ QC AUDIT FAILED with ${errors.length} error(s):\n`);
  errors.forEach(err => console.error(`  ${err}`));
  console.log('');
  process.exit(1);
}
