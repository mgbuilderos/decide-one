/**
 * Artefact gate — the layer qc_audit.js never had.
 *
 * qc_audit.js reads src/. check_content.js reads content/ and index.html.
 * Nothing had ever read public/, worker/, or dist/ — which is where, on
 * 13 September 2026, five live defects turned out to be hiding. See
 * ARCHITECTURE_AUDIT.md for the full failure taxonomy.
 *
 * This runs AFTER the build, on the thing that actually gets published.
 * It is static analysis, like everything else here — it cannot see a brand
 * name rendered into a .webp or a label protruding in 3D. That ceiling is
 * stated in the audit rather than pretended away.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const DIST = 'dist';
const errors = [];
const notes = [];

if (!fs.existsSync(DIST)) {
  console.error('\x1b[31m✗ artefact\x1b[0m  no dist/ — run the build first');
  process.exit(1);
}

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    e.isDirectory() ? walk(full, out) : out.push(full);
  }
  return out;
};

const distFiles = walk(DIST);
const distSet = new Set(distFiles.map(f => '/' + path.relative(DIST, f).split(path.sep).join('/')));

// A referenced path resolves if it is a file, or a directory index.
const resolves = (p) => {
  const clean = p.split('?')[0].split('#')[0];
  if (distSet.has(clean)) return true;
  if (clean.endsWith('/') && distSet.has(clean + 'index.html')) return true;
  return distSet.has(clean + '/index.html');
};

// ── 1. Every same-origin reference in published HTML must resolve ────────────
const htmlFiles = distFiles.filter(f => f.endsWith('.html'));
const ASSET_RE = /\/[\w./-]+\.(?:webp|png|jpe?g|svg|json|txt|xml|ico|woff2?|css|js)\b/g;
const CONTENT_RE = /"(\/(?:guides|methods|faq)\/[\w/-]*)"/g;
// Inside a bundle only a QUOTED absolute path is a real reference. Unquoted
// matches are the bundler's own relative chunk imports ("./index-abc.js"),
// which resolve under /assets/ and are the bundler's business, not ours.
const JS_ASSET_RE = /["'`](\/(?!\/)[\w./-]*\.(?:webp|png|jpe?g|svg|json|txt|xml|ico|woff2?))(?:\?[\w=.-]*)?["'`]/g;
const JS_CONTENT_RE = /["'`](\/(?:guides|methods|faq)\/[\w/-]*)["'`]/g;

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const refs = new Set();
  // content= carries og:image and twitter:image. poster= carries video stills.
  // Scanning only href/src is how a dead social image would ship unnoticed.
  for (const m of html.matchAll(/(?:href|src|content|poster)="([^"]+)"/g)) refs.add(m[1]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) refs.add(part.trim().split(/\s+/)[0]);
  }
  for (const ref of refs) {
    if (!ref.startsWith('/') || ref.startsWith('//')) continue;
    if (!resolves(ref)) {
      errors.push(`${path.relative(DIST, file) || 'index.html'} references ${ref}, which is not in dist/`);
    }
  }
}

// ── 2. Asset and content paths inside the bundles must resolve ───────────────
for (const file of distFiles.filter(f => f.endsWith('.js'))) {
  const js = fs.readFileSync(file, 'utf8');
  const refs = new Set([...js.matchAll(JS_ASSET_RE)].map(m => m[1]));
  for (const m of js.matchAll(JS_CONTENT_RE)) refs.add(m[1]);
  for (const ref of refs) {
    if (ref.startsWith('/assets/')) continue;          // emitted by the bundler
    if (!resolves(ref)) {
      errors.push(`${path.relative(DIST, file)} references ${ref}, which is not in dist/`);
    }
  }
}

// ── 3. No orphaned public/ assets ────────────────────────────────────────────
// Served by convention rather than by reference, so absence of a link is fine.
const BY_CONVENTION = new Set(['sw.js', '_headers', 'robots.txt', 'manifest.json', 'sitemap.xml']);
const searchable = [...walk('src'), 'index.html', ...(fs.existsSync('public') ? walk('public') : []),
                    ...(fs.existsSync('content') ? walk('content') : [])]
  .filter(f => /\.(jsx?|tsx?|css|html|json|md)$/.test(f))
  .map(f => fs.readFileSync(f, 'utf8')).join('\n');

for (const file of fs.existsSync('public') ? walk('public') : []) {
  const name = path.basename(file);
  if (BY_CONVENTION.has(name)) continue;
  const ref = '/' + path.relative('public', file).split(path.sep).join('/');
  if (!searchable.includes(ref)) {
    errors.push(`${file} is in the deploy but nothing references it — delete it or use it`);
  }
}

// ── 4. The home page must reach every content section ────────────────────────
// Defect 3 of the audit: 41 guides shipped, gated, and linked from nowhere a
// person could click. Both subsystems passed their own gates; the edge between
// them was owned by nobody, so it did not exist.
const sections = fs.readdirSync(DIST, { withFileTypes: true })
  .filter(e => e.isDirectory() && e.name !== 'assets' && e.name !== 'renders')
  .filter(e => fs.existsSync(path.join(DIST, e.name, 'index.html')))
  .map(e => `/${e.name}/`);

// Deliberately the bundle ONLY, not index.html. The crawlable summary inside
// #root is destroyed by createRoot the moment React mounts, so a link that
// exists only there is a link no person can ever click — which is the exact
// defect this check exists to prevent. Counting index.html here would have
// reproduced the bug inside the gate meant to catch it.
const homeReach = distFiles.filter(f => /\/assets\/index-[^/]+\.js$/.test(f))
  .map(f => fs.readFileSync(f, 'utf8')).join('\n');

for (const section of sections) {
  if (!homeReach.includes(`"${section}"`) && !homeReach.includes(`href="${section}"`)) {
    errors.push(`the home page does not link /${section.replace(/\//g, '')}/ — `
      + 'content nothing links to is content nobody reaches');
  }
}
if (sections.length) notes.push(`${sections.length} content section(s) reached from the home page`);

// ── 5. The service worker's cache name must be build-derived ─────────────────
if (fs.existsSync(path.join(DIST, 'sw.js'))) {
  const sw = fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8');
  const name = sw.match(/const CACHE_NAME = '([^']*)';/)?.[1];
  if (!name) {
    errors.push('dist/sw.js has no CACHE_NAME — the build could not stamp it');
  } else if (!/^decideone-shell-[a-f0-9]{12}$/.test(name)) {
    errors.push(`dist/sw.js CACHE_NAME is "${name}", not a build hash. A literal `
      + 'freezes, and activate only evicts caches whose name differs — that is how '
      + "the first commit's icon was served for weeks.");
  } else {
    notes.push(`service worker cache derived from the build (${name.slice(-12)})`);
  }
}

// ── 6. The deployed Worker must parse ────────────────────────────────────────
// 175 lines of request handling that writes to D1, read by no gate until now.
const main = fs.readFileSync('wrangler.jsonc', 'utf8').match(/"main":\s*"([^"]+)"/)?.[1];
if (main && fs.existsSync(main)) {
  try {
    execFileSync(process.execPath, ['--check', main], { stdio: 'pipe' });
    notes.push(`${main} parses`);
  } catch (e) {
    errors.push(`${main} does not parse: ${String(e.stderr || e.message).split('\n')[0]}`);
  }
} else if (main) {
  errors.push(`wrangler.jsonc points main at ${main}, which does not exist`);
}

// ── 7. Critical CSS must not outrank the application stylesheet ─────────────
// On 13 September 2026 the inline <style> in index.html was scoped to #root.
// An ID selector (0,1,0,1) beats every class in the bundle, so `#root h2`
// re-sized every heading in the app while the bundle's negative tracking
// stayed, collapsing display type into overlapping letters, and `#root a`
// pinned link colour past the light/dark toggle. Inline critical CSS may
// style the prerender and the document, never the mounted application.
const indexHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
for (const style of indexHtml.match(/<style>[\s\S]*?<\/style>/g) || []) {
  const css = style.replace(/\/\*[\s\S]*?\*\//g, '');   // comments are not selectors
  const leaks = [...css.matchAll(/(#root|#[\w-]+)\s+[.#\w[][^{]*\{/g)]
    .map(m => m[0].replace(/\s*\{$/, '').trim())
    .filter(sel => sel.startsWith('#root'));
  for (const sel of leaks) {
    errors.push(`index.html critical CSS has "${sel}" — an ID selector that outranks `
      + 'the bundle and restyles the mounted app. Scope it to #prerender, which '
      + 'createRoot destroys.');
  }
}

// Celebration cannot hide in a prebuilt or vendored bundle (Rule 26).
for (const file of distFiles.filter(f=>f.endsWith('.js'))) {
  const code = fs.readFileSync(file, 'utf8');
  if (/canvas-confetti|react-confetti|confetti-js|party-js|confetti\.create|confettiCannon/i.test(code)) errors.push(`Rule 26: celebration package signature in ${file}`);
}

// ── Report ───────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`\n\x1b[31m✗ artefact gate\x1b[0m  ${errors.length} problem(s) in what would be published:\n`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.error('');
  process.exit(1);
}
console.log(`\x1b[32m✓ artefact\x1b[0m  ${distFiles.length} published file(s): every reference resolves, `
  + `no orphans; ${notes.join('; ')}`);
