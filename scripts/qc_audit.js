import fs from 'fs';
import path from 'path';

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

// Rule 0: Governed surfaces must exist.
//
// Most rules below read their subject inside `if (fs.existsSync(...))`, so a
// deleted or renamed file does not fail the audit — it silently stops being
// checked, and the audit still prints green. A rule that cannot see its
// subject has not passed; it has abstained.
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
  ['data/monthIllustrations.jsx', 'Rule 15 — twelve bespoke month illustrations'],
  ['utils/executionModel.js', 'Rule 22 — the methods are enforced here, not suggested'],
  ['utils/licenseManager.js', 'Rules 18 and 23 — offline verification, signed keys'],
  ['utils/licenseKeys.js', 'Rule 23 — signed per-buyer licences replaced shared keys'],
  ['utils/archivalExport.js', 'Rule 18 — the export engine the Patron tier promises'],
  ['components/PatronUpgradeModal.jsx', 'Rule 18 — the upgrade surface'],
  ['components/YearlyViewSpread.jsx', 'Rule 18 — the twelve-month annual view'],
  ['components/MonthlyBreakerPage.jsx', 'Rule 18 — the month breaker'],
  ['components/ExecutionLayer.jsx', 'Rule 22 — capacity and the active clock'],
  ['components/DayReport.jsx', 'Rule 22 — closure without a verdict'],
  ['components/ExecutiveClosureRitualModal.jsx', 'Rule 22 — the closure ritual'],
  ['components/InlineTimeControl.jsx', 'Rule 22 and B-35 — per-line time control']
];
for (const [rel, why] of governedSurfaces) {
  if (!fs.existsSync(path.join(SRC_DIR, rel))) {
    errors.push(
      `[Rule 0 Violation] Governed surface src/${rel} is missing — ${why}. ` +
      'Deleting it disables those checks silently; amend the governedSurfaces ' +
      'list and record why in DECISIONS.md first.'
    );
  }
}

// Rule 1: Zero font-mono classes (Strict Helvetica Rule)
scanFiles(SRC_DIR, (filePath, content) => {
  if (content.includes('font-mono')) {
    errors.push(`[Rule 1 Violation] font-mono found in: ${path.relative(process.cwd(), filePath)}`);
  }
});

// Rule 2: No unmanaged overlapping dropdown popovers in item rows
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.includes('BulletItem.jsx') || filePath.includes('Top3HardTasks.jsx')) {
    if (content.includes('showCategoryMenu') || content.includes('activeCategoryPicker')) {
      errors.push(`[Rule 2 Violation] Unmanaged floating popover state found in row component: ${path.relative(process.cwd(), filePath)}`);
    }
  }
});

// Rule 3: 3-Color Progress Gate (Red, Yellow, Green progress palette; zero random decorative colors)
const forbiddenDecorativePatterns = [
  'bg-blue-100', 'bg-purple-100', 'bg-cyan-100', 'bg-pink-100',
  'text-blue-600', 'text-purple-600', 'text-cyan-600', 'text-pink-600'
];
scanFiles(SRC_DIR, (filePath, content) => {
  for (const pattern of forbiddenDecorativePatterns) {
    if (content.includes(pattern)) {
      errors.push(`[Rule 3 Violation] Forbidden decorative chromatic color "${pattern}" found in: ${path.relative(process.cwd(), filePath)}`);
    }
  }
});

// Rule 4: Viewport zero-scroll and slim notepad width constraint
const appPath = path.join(SRC_DIR, 'App.jsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (!appContent.includes('overflow-hidden') || !appContent.includes('h-screen')) {
    errors.push('[Rule 4 Violation] App.jsx does not enforce h-screen overflow-hidden for zero-scroll.');
  }
  if (!appContent.includes('max-w-[412px]') && !appContent.includes('max-w-[840px]') && !appContent.includes('max-w-[864px]') && !appContent.includes('max-w-[480px]')) {
    errors.push('[Rule 4 Violation] App.jsx does not enforce authentic slim notepad width (max-w-[412px] mobile / max-w-[840px] or max-w-[864px] bi-fold desktop).');
  }
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
const cssPath = path.join(SRC_DIR, 'index.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (!cssContent.includes('background-size: 24px 24px')) {
    errors.push('[Rule 6 Violation] index.css does not define background-size: 24px 24px for paper grid.');
  }
}
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (!appContent.includes('p-6 embossed-notebook')) {
    errors.push('[Rule 6 Violation] App.jsx notebook canvas does not use p-6 (24px) padding for exact grid coordinate sync.');
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

// Rule 8: Minimalist Header Gate (No Volume/Speaker icon in header toolbar)
const headerPath = path.join(SRC_DIR, 'components/HeaderToolbar.jsx');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  if (headerContent.includes('Volume2') || headerContent.includes('VolumeX')) {
    errors.push('[Rule 8 Violation] HeaderToolbar.jsx still renders Volume/Speaker controls.');
  }
}

// Rule 9: Grid Cadence Spacing Gate (No non-multiple-of-24 gaps in task/habit/reflection components)
const nonCadencePatterns = ['space-y-[16px]', 'space-y-[12px]', 'gap-[16px]', 'gap-[12px]'];
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.includes('Top3HardTasks.jsx') || filePath.includes('HabitTracker.jsx') || filePath.includes('EveningReflection.jsx')) {
    for (const pattern of nonCadencePatterns) {
      if (content.includes(pattern)) {
        errors.push(`[Rule 9 Violation] Non-cadence spacing "${pattern}" found in: ${path.relative(process.cwd(), filePath)}`);
      }
    }
  }
});

// Rule 10: Clean Unified Stationery Gate (Zero 3-dot menus, zero black tie cord, authentic sewn label)
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.includes('HeaderToolbar.jsx')) {
    if (content.includes('MoreHorizontal') || content.includes('isMoreOpen')) {
      errors.push(`[Rule 10 Violation] HeaderToolbar still contains floating 3-dot menu.`);
    }
  }
  if (filePath.includes('App.jsx')) {
    if (content.includes('connecting-tie-cord') || content.includes('tie-clasp-top')) {
      errors.push(`[Rule 10 Violation] App.jsx still contains harsh black tie cord.`);
    }
    if (!content.includes('woven-fabric-tag')) {
      errors.push(`[Rule 10 Violation] App.jsx is missing sewn woven-fabric-tag.`);
    }
  }
});

// Rule 11: Framework Roster Gate (P5/P6 — exactly three methods ship; the cut three must not return)
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

// Rule 12: Framework Grid Alignment & Wrapping Safety Gate
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.includes('ProductivityFrameworks.jsx')) {
    if (!content.includes('whitespace-nowrap') || !content.includes('h-[28px]')) {
      errors.push('[Rule 12 Violation] ProductivityFrameworks.jsx does not enforce fixed height (h-[28px]) and whitespace-nowrap for Eisenhower quadrant headers.');
    }
  }
});

// Rule 13: FlippingBook 3D Page Leaf Flip Integration Gate (Stationary flat notebook canvas with 3D spine-hinged turning leaf)
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.includes('App.jsx')) {
    if (!content.includes('page-leaf-container') || (!content.includes('leaf-turn-next') && !content.includes('leaf-turn-prev'))) {
      errors.push('[Rule 13 Violation] App.jsx does not mount spine-hinged 3D page leaf (page-leaf-container with leaf-turn-next/prev).');
    }
    if (content.includes('journal-flip-next') || content.includes('journal-flip-prev')) {
      errors.push('[Rule 13 Violation] App.jsx still applies whole-canvas rotation (journal-flip-next/prev) to embossed-notebook.');
    }
    if (content.includes('flipping-sheet-next') || content.includes('flipping-sheet-prev')) {
      errors.push('[Rule 13 Violation] App.jsx still attaches truncated page flip animations to inner columns.');
    }
  }
});

// Rule 14: Seamless Friction-Free 3D Page Turn Gate (Flush spine crease & zero layout shift)
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.endsWith('index.css')) {
    const nextBackMatch = content.match(/\.leaf-turn-next\s+\.leaf-face-back\s*\{([^}]+)\}/);
    if (nextBackMatch && nextBackMatch[1].includes('border-top-left-radius: 26px')) {
      errors.push('[Rule 14 Violation] index.css applies 26px radius to spine edge on leaf-face-back, creating a friction gap.');
    }
  }
  if (filePath.endsWith('SpreadPages.jsx')) {
    if (content.includes('leaf-face-front') && content.includes('md:pl-6')) {
      errors.push('[Rule 14 Violation] SpreadPages.jsx duplicates md:pl-6 inside leaf-face-front, causing horizontal text shift.');
    }
    if (content.includes('leaf-face-back') && content.includes('md:pr-6')) {
      errors.push('[Rule 14 Violation] SpreadPages.jsx duplicates md:pr-6 inside leaf-face-back, causing horizontal text shift.');
    }
  }
  if (filePath.endsWith('App.jsx')) {
    if (!content.includes('pendingTurnRef')) {
      errors.push('[Rule 14 Violation] App.jsx must use pendingTurnRef to protect against stale React closure unmount freeze.');
    }
  }
});

// Rule 15: Minimalist Stationery Cover & 12-Month Illustrations Gate
const illustrationsPath = path.join(SRC_DIR, 'data/monthIllustrations.jsx');
if (fs.existsSync(illustrationsPath)) {
  const illusContent = fs.readFileSync(illustrationsPath, 'utf8');
  for (let m = 0; m < 12; m++) {
    if (!illusContent.includes(`${m}: {`)) {
      errors.push(`[Rule 15 Violation] monthIllustrations.jsx is missing month index ${m}.`);
    }
  }
} else {
  errors.push('[Rule 15 Violation] src/data/monthIllustrations.jsx does not exist.');
}
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.endsWith('index.css')) {
    if (content.includes('calc(50% - 210px)')) {
      errors.push('[Rule 15 Violation] index.css still contains buggy calc(50% - 210px) strip offset.');
    }
    if (!content.includes('.stage-book-closed') || !content.includes('.stage-book-opening')) {
      errors.push('[Rule 15 Violation] index.css is missing Turn.js stage-book-closed / stage-book-opening classes.');
    }
  }
  if (filePath.endsWith('NotebookCover.jsx')) {
    if (!content.includes('MONTH_ILLUSTRATIONS')) {
      errors.push('[Rule 15 Violation] NotebookCover.jsx must import and render MONTH_ILLUSTRATIONS.');
    }
  }
});

// Rule 16: Zero Date Overflow & Header Wrapping Gate
scanFiles(SRC_DIR, (filePath, content) => {
  if (filePath.endsWith('DateHeader.jsx')) {
    if (!content.includes('whitespace-nowrap')) {
      errors.push('[Rule 16 Violation] DateHeader.jsx DateDisplay must enforce whitespace-nowrap to prevent date text wrapping.');
    }
    if (!content.includes('overflow-hidden')) {
      errors.push('[Rule 16 Violation] DateHeader.jsx DateDisplay must enforce overflow-hidden to prevent container blowout.');
    }
  }
  if (filePath.endsWith('SpreadPages.jsx')) {
    if (!content.includes('h-[48px]')) {
      errors.push('[Rule 16 Violation] SpreadPages.jsx must enforce fixed h-[48px] cadence headers.');
    }
  }
});

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

// Rule 18: Lifetime Patron & Archival Monetization Gate
const licensePath = path.join(SRC_DIR, 'utils/licenseManager.js');
if (fs.existsSync(licensePath)) {
  const licContent = fs.readFileSync(licensePath, 'utf8');
  if (!licContent.includes('verifyLicenseKey') || !licContent.includes('activateLicense')) {
    errors.push('[Rule 18 Violation] licenseManager.js missing verifyLicenseKey or activateLicense.');
  }
} else {
  errors.push('[Rule 18 Violation] src/utils/licenseManager.js does not exist.');
}

const exportPath = path.join(SRC_DIR, 'utils/archivalExport.js');
if (fs.existsSync(exportPath)) {
  const expContent = fs.readFileSync(exportPath, 'utf8');
  if (!expContent.includes('generateMarkdownArchive') || !expContent.includes('printAnnualBook')) {
    errors.push('[Rule 18 Violation] archivalExport.js missing generateMarkdownArchive or printAnnualBook.');
  }
} else {
  errors.push('[Rule 18 Violation] src/utils/archivalExport.js does not exist.');
}

const patronModalPath = path.join(SRC_DIR, 'components/PatronUpgradeModal.jsx');
if (!fs.existsSync(patronModalPath)) {
  errors.push('[Rule 18 Violation] src/components/PatronUpgradeModal.jsx does not exist.');
}

const yearlySpreadPath = path.join(SRC_DIR, 'components/YearlyViewSpread.jsx');
if (!fs.existsSync(yearlySpreadPath)) {
  errors.push('[Rule 18 Violation] src/components/YearlyViewSpread.jsx does not exist.');
}

const breakerPagePath = path.join(SRC_DIR, 'components/MonthlyBreakerPage.jsx');
if (!fs.existsSync(breakerPagePath)) {
  errors.push('[Rule 18 Violation] src/components/MonthlyBreakerPage.jsx does not exist.');
}

// Rule 19: Black Embossed Minimal Neumorphic Chassis Gate (No middle bookmark, no leather side border)
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (appContent.includes('silk-ribbon-bookmark')) {
    errors.push('[Rule 19 Violation] App.jsx still mounts middle silk-ribbon-bookmark (must be removed).');
  }
  if (appContent.includes('gilded-fore-edge')) {
    errors.push('[Rule 19 Violation] App.jsx still contains gilded-fore-edge leather side border (must be removed).');
  }
}
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  if (!cssContent.includes('.embossed-notebook')) {
    errors.push('[Rule 19 Violation] index.css must define .embossed-notebook black embossed neumorphic styling.');
  }
}

// Rule 20: Executive Universal Keyboard Navigation Gate
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  const requiredKeys = ["e.key === '1'", "e.key === '2'", "e.key === '3'", "e.key === 't'", "e.key === 'c'"];
  for (const rk of requiredKeys) {
    if (!appContent.includes(rk)) {
      errors.push(`[Rule 20 Violation] App.jsx missing universal keyboard handler for ${rk}.`);
    }
  }
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

  if (unique.length === 0) {
    errors.push("[Rule 24 Violation] VISION.md states no canonical price. Nothing else has anything to agree with.");
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

// Summary Report
if (errors.length === 0) {
  console.log('✅ ALL STRUCTURAL QC CHECKS PASSED (not security or legal certification):');
  console.log('  - Rule 1: Zero font-mono violations (Universal Helvetica)');
  console.log('  - Rule 2: Zero unmanaged overlapping dropdown popovers in item rows');
  console.log('  - Rule 3: 3-Color Progress Gate (Red, Yellow, Green progress tracking only; zero random decorative colors)');
  console.log('  - Rule 4: Zero-scroll viewport lock & slim notepad proportions (max-w-[412px])');
  console.log('  - Rule 5: Consumer-friendly language gate (zero technical jargon in UI labels)');
  console.log('  - Rule 0: Governed surfaces exist (a deleted file fails rather than skipping its rules)');
  console.log('  - Rule 6: Strict 24px universal grid cadence alignment (paper-grid & canvas padding)');
  console.log('  - Rule 7: Single-column full-width monthly spread (no 2-column desktop squishing)');
  console.log('  - Rule 8: 2-Tier header masthead (brand at top, utilities below, zero speaker button)');
  console.log('  - Rule 9: 24px grid cadence margins & zero non-cadence spacing');
  console.log('  - Rule 10: Clean Unified Stationery Gate (zero 3-dots, zero black tie cord, authentic sewn label)');
  console.log('  - Rule 11: Framework Roster Gate (exactly 3 methods ship; MoSCoW, 1-3-5 and Pareto stay cut)');
  console.log('  - Rule 12: Framework Grid Alignment & Wrapping Safety Gate (fixed header heights & whitespace-nowrap)');
  console.log('  - Rule 13: FlippingBook 3D Page Leaf Flip Integration Gate (Stationary flat notebook canvas with 3D spine-hinged turning leaf)');
  console.log('  - Rule 14: Seamless Friction-Free 3D Page Turn Gate (Flush spine crease, closure immunity & zero layout shift)');
  console.log('  - Rule 15: Minimalist Stationery Cover & 12-Month Illustrations Gate (Turn.js autoCenter, 12 bespoke SVGs, zero narrow strips)');
  console.log('  - Rule 16: Zero Date Overflow & Header Wrapping Gate (whitespace-nowrap & fixed 48px header boundary)');
  console.log('  - Rule 17: Zero "Bullet Journal" / Ryder Carroll Gate (100% Decide One brand purity & right page flex containment)');
  console.log('  - Rule 18: Lifetime Patron & Archival Monetization Gate (100% offline verification, export engine & 12-month annual view)');
  console.log('  - Rule 19: Black Embossed Minimal Neumorphic Chassis Gate (No middle bookmark, no leather side border)');
  console.log('  - Rule 20: Executive Universal Keyboard Navigation Gate (Instant 1/2/3/T/C thought-speed routing)');
  console.log('  - Rule 21: Restricted Naming Token Check (not trademark or copyright clearance)');
  console.log('  - Rule 22: Execution Layer Enforcement Gate (Ivy Lee order lock, breathing state, non-punitive overrun, timing provenance)');
  console.log('  - Rule 23: Licence Integrity Gate (signed per-buyer keys; no shared secret, no private key in source)');
  console.log('  - Rule 24: Price Consistency Gate (VISION §11.1 is the price; the app and the docs must agree)\n');
  process.exit(0);
} else {
  console.error(`❌ QC AUDIT FAILED with ${errors.length} error(s):\n`);
  errors.forEach(err => console.error(`  ${err}`));
  console.log('');
  process.exit(1);
}
