import fs from 'fs';
import path from 'path';

/**
 * Content gates — the prose half of SEO_CHARTER.md §6.
 *
 * build_content.js gates structure: front-matter, slugs, duplicate intents,
 * broken links, orphans. Those must pass for a page to be generated at all.
 * This gates what the page SAYS, and it runs inside npm run test:qc so it
 * blocks a commit and a deploy rather than only a build.
 *
 * Why mechanically, rather than by review: QC Rule 25 exists because six
 * dashboard metrics were permanently zero and no reviewer noticed for weeks.
 * The same failure in content is a claim nobody agreed to, published under the
 * product's name — and unlike a zero metric, it is visible to every reader and
 * to every model deciding whether this domain can be cited.
 *
 * Every rule here traces to a line in VISION.md §11.3, FRAMEWORKS.md §6.3, or
 * FOUNDATIONS.md §5. None of them are stylistic preference.
 */

// Discovered, not listed. A hardcoded list is how content/pages/faq.md — the
// single most claim-dense page on the site — was written, built and very nearly
// deployed without a single gate running over it. Any directory under content/
// is content, and content is gated.
const DIRS = fs.existsSync('content')
  ? fs.readdirSync('content', { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => `content/${d.name}`).sort()
  : [];
const errors = [];

// VISION.md §11.3 rule 1. Medical structure is fine; medical language invites
// health-claim scrutiny from regulators and app stores.
const CLINICAL = [
  'diagnose', 'diagnoses', 'diagnosis', 'prescribe', 'prescribes', 'prescription',
  'treat', 'treats', 'treated', 'treating', 'treatment', 'therapy', 'therapeutic',
  'clinical', 'clinically', 'cure', 'cures', 'patient', 'symptom', 'symptoms'
];

// VISION.md §11.3 rule 2. The product observes; it does not scold. And the
// fourth rule: never infer failure from a date.
const JUDGMENT = [
  'you failed', 'you are failing', "you're failing", 'you keep failing',
  'streak lost', 'lost your streak', 'broke your streak', 'fell behind',
  'be honest with yourself', 'no excuses', 'stop making excuses',
  'lack of discipline', 'you should have', 'shame'
];

// VISION.md §11.3 rule 3 and FOUNDATIONS.md §5. The methods are time-tested,
// not proven. Little's Law is a theorem about queueing systems and names no
// number; it is not a finding about human cognition.
const UNEARNED = [
  'scientifically proven', 'clinically proven', 'clinically validated',
  'science proves', 'science says', 'research proves', 'proven to increase',
  'studies prove', 'psychologically proven', 'neuroscience shows'
];

// FRAMEWORKS.md §6.3. Trademark exposure. Not in the UI, not in marketing,
// not in metadata, not in help content.
const BLACKLIST = [
  'pomodoro', 'getting things done', 'bullet journal', 'bujo', 'eat that frog',
  '7 habits', 'seven habits', 'quadrant ii', 'big rocks', 'first things first',
  'woop', '12 week year', 'twelve week year', 'entrepreneurial operating system',
  'buffett 5/25', 'deep work method', 'essentialism method'
];

// VISION.md §11.1: the price is free. No tier, no licence, nothing held back.
// QC Rule 24 enforces this in src/; this enforces it in what we publish.
const PRICE = [
  'upgrade to pro', 'paid plan', 'paid tier', 'premium version', 'premium tier',
  'free trial', 'pro version', 'when you upgrade', 'paywall', 'subscribe for',
];

/**
 * The completeness claim, checked against the app rather than banned outright.
 *
 * "Nothing held back" is VISION §11.1's own wording, and on 12 September it was
 * live on twelve pages while UnifiedMenuModal.jsx locked two paper tones, three
 * ink colours, the weekly PDF, Markdown export and the annual print behind
 * isPatron — with no way to obtain a licence, so they were dead ends rather than
 * a paid tier. The audit passed throughout: Rule 18 asserts the Patron machinery
 * exists, Rule 24 asserts the price matches VISION, and nothing compared the two.
 * This is the rule that compares them.
 *
 * The locks were removed, so the claim is true again and is allowed again. If
 * feature gating ever returns, this fails the build the moment any page still
 * claims completeness — which is the whole point of writing it as a cross-check
 * instead of a word ban.
 */
const COMPLETENESS = 'nothing held back';
const gatingPattern = /!\s*isPatron/;
function appStillGatesFeatures() {
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full) : (/\.(jsx?|tsx?)$/.test(d.name) ? [full] : []);
  });
  if (!fs.existsSync('src')) return false;
  return walk('src').some(f => gatingPattern.test(fs.readFileSync(f, 'utf8')));
}
const APP_GATES = appStillGatesFeatures();

// TELEMETRY_SPEC.md and src/utils/telemetry.js. The honest claim is that
// nothing is sent unless the person turns it on, and that journal text never
// leaves the device either way. "Zero telemetry" is not true and may not be
// said — the landing page claimed it once while the SDK was live.
const TELEMETRY = ['zero telemetry', 'no telemetry', 'zero tracking', 'we collect nothing'];

// FOUNDATIONS.md §5 and VISION.md §11.3: exactly one scientific claim is
// permitted anywhere, Gollwitzer & Sheeran (2006), if-then planning only.
// A page reaching for the vocabulary of evidence must be the page that cites it.
const EVIDENCE_VOCAB = ['meta-analysis', 'effect size', 'study found', 'studies found',
  'research found', 'randomised', 'randomized trial', 'p <', 'd = '];
const PERMITTED_CITATION = 'gollwitzer';

const hit = (haystack, needle) => {
  // Word-boundary for single words; plain substring for phrases, which cannot
  // collide the way a short word can.
  const re = /\s/.test(needle)
    ? new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    : new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return re.test(haystack);
};

const check = (file, text, list, label, remedy) => {
  for (const term of list) {
    if (hit(text, term)) errors.push(`${file}: ${label} — "${term}". ${remedy}`);
  }
};

let checked = 0;

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const file = path.join(dir, name);
    const raw = fs.readFileSync(file, 'utf8');
    // Strip URLs and slugs: a link to /methods/x/ is not prose and must not
    // trip a word gate.
    const text = raw.replace(/\]\([^)]*\)/g, ']()').replace(/^links:.*$/gm, '');
    checked++;

    check(file, text, CLINICAL, 'clinical vocabulary (VISION §11.3)',
      'Medical structure is fine; medical language is not. Write "choose a method" or "the problem it fits".');
    check(file, text, JUDGMENT, 'judgment (VISION §11.3)',
      'The product observes; it does not scold. An unfinished task is unfinished, not failed.');
    check(file, text, UNEARNED, 'unearned science (VISION §11.3, FOUNDATIONS §5)',
      'Write "time-tested" or "methods that have worked for a century".');
    check(file, text, BLACKLIST, 'blacklisted name (FRAMEWORKS §6.3)',
      'Trademark exposure. This name may not appear anywhere.');
    check(file, text, PRICE, 'price claim (VISION §11.1)',
      'The price is free. Say it is free to use, with no account.');
    if (APP_GATES && text.includes(COMPLETENESS)) {
      errors.push(`${file}: claims "${COMPLETENESS}", but src/ still gates features on !isPatron. `
        + 'Either the gating goes or the claim does — they may not both ship.');
    }
    check(file, text, TELEMETRY, 'telemetry claim (TELEMETRY_SPEC)',
      'The honest claim is that nothing is sent unless the person turns it on.');

    // Length. A title tag Google truncates is a title tag written for nobody —
    // the template appends " — Decide One", 13 characters, so the front-matter
    // title has 47 to work in. Descriptions are cut around 158. Both were
    // wrong on the first three pages written, at 105 and ~190 characters.
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fm) {
      const get = (k) => (fm[1].match(new RegExp('^' + k + ': (.*)$', 'm')) || [])[1] || '';
      const title = get('title').trim();
      const desc = get('description').trim();
      if (title.length > 47) {
        errors.push(`${file}: title is ${title.length} chars; the rendered tag adds " — Decide One" and Google truncates near 60. Keep it to 47.`);
      }
      if (desc.length > 158) {
        errors.push(`${file}: description is ${desc.length} chars; search results cut near 158. The tail is written for nobody.`);
      }
      if (desc && desc.length < 70) {
        errors.push(`${file}: description is only ${desc.length} chars. Use the space — it is the sentence that decides the click.`);
      }
    }

    const reaches = EVIDENCE_VOCAB.filter(v => hit(text, v));
    if (reaches.length && !hit(text, PERMITTED_CITATION)) {
      errors.push(
        `${file}: uses the vocabulary of evidence (${reaches.map(r => `"${r}"`).join(', ')}) ` +
        `without the one citation permitted on this site. Exactly one scientific claim is allowed ` +
        `anywhere — Gollwitzer & Sheeran (2006), d = 0.65, if-then implementation intentions only. ` +
        `To cite anything else, amend FOUNDATIONS.md first, with the citation, and commit it.`
      );
    }
  }
}

if (errors.length) {
  console.error(`\n\x1b[31m✖ CONTENT GATES FAILED\x1b[0m  (${errors.length} in ${checked} file(s))\n`);
  errors.forEach(e => console.error('  - ' + e));
  console.error('\n  SEO_CHARTER.md §6. Fix the prose, not the gate.\n');
  process.exit(1);
}

console.log(`\x1b[32m✓ content gates\x1b[0m  ${checked} file(s): no clinical, judgment, unearned-science, trademark, price or telemetry violations; titles and descriptions within length`);
