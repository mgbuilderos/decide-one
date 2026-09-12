import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

/**
 * Content build — Markdown in, real HTML pages out.
 *
 * SEO_CHARTER.md §4 fixes the architecture: content pages are pre-rendered
 * static HTML, not React routes and not a CMS. The product is an SPA because
 * the instrument needs to be; a guide is a document, and making documents into
 * an application costs crawlability and buys nothing.
 *
 * What this closes, all verified on 12 September 2026:
 *   - Every URL served identical HTML, so Google saw one page.
 *   - index.html carried a hardcoded canonical pointing at the homepage and was
 *     served at every path, so the site instructed Google to ignore every page
 *     that was not the homepage. Pages built here carry their OWN canonical.
 *   - sitemap.xml listed one URL. It is generated here, from the same source as
 *     the pages, because a sitemap maintained by hand is a sitemap that is wrong.
 *   - There was no structured data anywhere.
 *
 * Runs after `vite build`, writing into dist/. Fails the build on a broken
 * internal link, a duplicate intent, or missing front-matter — a gate that can
 * be checked mechanically is checked mechanically.
 */

const ORIGIN = 'https://decideone.app';
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');

const SECTIONS = [
  { dir: 'content/methods', base: 'methods', label: 'Methods' },
  { dir: 'content/guides', base: 'guides', label: 'Guides' }
];

const REQUIRED = ['title', 'description', 'slug', 'intent', 'published', 'sources'];

const errors = [];
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Front-matter, deliberately not YAML.
 *
 * The schema is fixed, flat, and mine: a handful of known keys, strings and
 * comma-separated lists, no nesting. Parsing that correctly is a few lines.
 * Pulling in a YAML parser to read `title: x` would be a dependency taken for
 * a format we control and never intend to complicate.
 */
function parseFrontMatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) {
    errors.push(`${file}: no front-matter block. Every content file opens with --- ... ---`);
    return null;
  }
  const meta = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const at = line.indexOf(':');
    if (at === -1) continue;
    const key = line.slice(0, at).trim();
    const value = line.slice(at + 1).trim();
    meta[key] = ['sources', 'links', 'keywords'].includes(key)
      ? value.split(',').map(v => v.trim()).filter(Boolean)
      : value;
  }
  return { meta, body: m[2] };
}

// ---------------------------------------------------------------- collect
const pages = [];

for (const section of SECTIONS) {
  const dir = path.join(ROOT, section.dir);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
    const file = path.join(section.dir, name);
    const parsed = parseFrontMatter(fs.readFileSync(path.join(ROOT, file), 'utf8'), file);
    if (!parsed) continue;
    const { meta, body } = parsed;

    for (const key of REQUIRED) {
      if (!meta[key] || (Array.isArray(meta[key]) && meta[key].length === 0)) {
        errors.push(`${file}: missing required front-matter '${key}'`);
      }
    }
    if (meta.slug && meta.slug !== name.replace(/\.md$/, '')) {
      errors.push(`${file}: slug '${meta.slug}' does not match the filename. Keep them identical so a URL is greppable.`);
    }

    pages.push({ file, section, meta, body, url: `/${section.base}/${meta.slug}/` });
  }
}

// ------------------------------------------------------------- validate
const bySlug = new Map();
const byIntent = new Map();

for (const p of pages) {
  if (bySlug.has(p.meta.slug)) {
    errors.push(`${p.file}: duplicate slug '${p.meta.slug}', already used by ${bySlug.get(p.meta.slug).file}`);
  }
  bySlug.set(p.meta.slug, p);

  // One page per intent, never per keyword. Two pages chasing one intent
  // cannibalise each other and neither wins. SEO_CHARTER §3.1.
  const intent = (p.meta.intent || '').toLowerCase();
  if (intent && byIntent.has(intent)) {
    errors.push(`${p.file}: primary intent '${p.meta.intent}' is already claimed by ${byIntent.get(intent).file}. One page per intent.`);
  }
  if (intent) byIntent.set(intent, p);
}

// Internal links are resolved here so a renamed slug fails the build rather
// than producing hundreds of silent 404s later. Failure register F5.
for (const p of pages) {
  for (const target of (p.meta.links || [])) {
    if (!bySlug.has(target)) {
      errors.push(`${p.file}: links to '${target}', which is not a page. Add it or remove the link.`);
    }
  }
  const declared = (p.meta.links || []).length;
  if (pages.length > 2 && declared < 2) {
    errors.push(`${p.file}: declares ${declared} internal link(s). Every page links to at least two others (SEO_CHARTER §10.7).`);
  }
}

// An orphan is a page nothing links to. It will not be found and it will not
// pass equity to anything.
const linkedTo = new Set(pages.flatMap(p => p.meta.links || []));
for (const p of pages) {
  if (pages.length > 2 && !linkedTo.has(p.meta.slug)) {
    errors.push(`${p.file}: orphan — no other page links to '${p.meta.slug}'.`);
  }
}

if (errors.length) {
  console.error('\n\x1b[31m✖ CONTENT BUILD FAILED\x1b[0m\n');
  errors.forEach(e => console.error('  - ' + e));
  console.error('\n  These are the gates in SEO_CHARTER.md §6. Fix the source, not the gate.\n');
  process.exit(1);
}

// --------------------------------------------------------------- render
marked.setOptions({ mangle: false, headerIds: true, gfm: true });

const STYLE = `
:root{--ink:#0B0B0D;--paper:#FFFFFF;--rule:#E4E4E7;--muted:#52525B;--line:24px}
*{box-sizing:border-box}
body{margin:0;background:#E1E1E6;color:var(--ink);
  font:16px/var(--line) -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased}
main{max-width:680px;margin:0 auto;padding:calc(var(--line)*2) var(--line) calc(var(--line)*4);
  background:var(--paper);min-height:100vh}
nav{font-size:13px;line-height:var(--line);color:var(--muted);margin-bottom:var(--line)}
nav a{color:var(--muted)}
h1{font-size:32px;line-height:calc(var(--line)*1.5);margin:0 0 var(--line);letter-spacing:-.02em;font-weight:700}
h2{font-size:21px;line-height:calc(var(--line)*1.25);margin:calc(var(--line)*2) 0 var(--line);letter-spacing:-.01em;font-weight:700}
h3{font-size:17px;line-height:var(--line);margin:calc(var(--line)*1.5) 0 0;font-weight:700}
p,ul,ol,blockquote,table{margin:0 0 var(--line)}
ul,ol{padding-left:var(--line)}
li{margin-bottom:calc(var(--line)/3)}
a{color:var(--ink);text-underline-offset:3px}
blockquote{border-left:2px solid var(--ink);padding-left:var(--line);margin-left:0;color:var(--muted)}
img{max-width:100%;height:auto;display:block;margin:0 0 var(--line)}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{text-align:left;padding:8px 12px 8px 0;border-bottom:1px solid var(--rule);vertical-align:top}
code{font:13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;background:#F4F4F5;padding:2px 5px}
hr{border:0;border-top:1px solid var(--rule);margin:calc(var(--line)*2) 0}
.meta{font-size:13px;color:var(--muted);margin:0 0 calc(var(--line)*2);padding-bottom:var(--line);border-bottom:1px solid var(--rule)}
.related{margin-top:calc(var(--line)*2);padding-top:var(--line);border-top:1px solid var(--rule);font-size:14px}
.related h2{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 calc(var(--line)/2)}
.cta{margin:calc(var(--line)*2) 0;padding:var(--line);border:1px solid var(--ink)}
.cta p{margin:0 0 calc(var(--line)/2)}
.cta a{font-weight:700}
footer{margin-top:calc(var(--line)*2);padding-top:var(--line);border-top:1px solid var(--rule);font-size:13px;color:var(--muted)}
@media(prefers-color-scheme:dark){
  :root{--ink:#FAFAFA;--paper:#0B0B0D;--rule:#27272A;--muted:#A1A1AA}
  body{background:#000}
  code{background:#18181B}
}
`.replace(/\n\s*/g, '');

/**
 * Structured data, emitted from front-matter rather than hand-written.
 *
 * The rule that outranks every tactic here: never assert in schema something
 * the page does not contain. No HowTo without steps, no FAQPage without
 * questions, and no aggregateRating on a product that has never asked anyone
 * for a review.
 */
function jsonLd(p) {
  const graph = [{
    '@type': p.section.base === 'methods' ? 'Article' : 'BlogPosting',
    headline: p.meta.title,
    description: p.meta.description,
    datePublished: p.meta.published,
    dateModified: p.meta.updated || p.meta.published,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': ORIGIN + p.url },
    author: { '@type': 'Organization', name: 'Decide One', url: ORIGIN },
    publisher: { '@type': 'Organization', name: 'Decide One', url: ORIGIN },
    isAccessibleForFree: true
  }, {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Decide One', item: ORIGIN + '/' },
      { '@type': 'ListItem', position: 2, name: p.section.label, item: `${ORIGIN}/${p.section.base}/` },
      { '@type': 'ListItem', position: 3, name: p.meta.title, item: ORIGIN + p.url }
    ]
  }];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function render(p) {
  const canonical = ORIGIN + p.url;
  const related = (p.meta.links || []).map(s => bySlug.get(s)).filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.meta.title)} — Decide One</title>
<meta name="description" content="${esc(p.meta.description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="icon" type="image/svg+xml" href="/icon.svg?v=2">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Decide One">
<meta property="og:title" content="${esc(p.meta.title)}">
<meta property="og:description" content="${esc(p.meta.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.meta.title)}">
<meta name="twitter:description" content="${esc(p.meta.description)}">
<meta name="theme-color" content="#0B0B0D">
<script type="application/ld+json">${jsonLd(p)}</script>
<style>${STYLE}</style>
</head>
<body>
<main>
<nav><a href="/">Decide One</a> › <a href="/${p.section.base}/">${esc(p.section.label)}</a></nav>
<h1>${esc(p.meta.title)}</h1>
<p class="meta">Updated ${esc(p.meta.updated || p.meta.published)}${p.meta.reading ? ' · ' + esc(p.meta.reading) : ''}</p>
${marked.parse(p.body)}
<div class="cta">
<p>Decide One is a priority instrument. Bring the day into view, choose a method, give the first thing real time.</p>
<p><a href="/?view=daily">Open it — free, nothing to sign up for</a></p>
</div>
${related.length ? `<div class="related"><h2>Related</h2><ul>${
  related.map(r => `<li><a href="${r.url}">${esc(r.meta.title)}</a> — ${esc(r.meta.description)}</li>`).join('')
}</ul></div>` : ''}
<footer>Written for Decide One. Sources: ${(p.meta.sources || []).map(esc).join(', ')}.
Free, for everyone, with nothing held back. <a href="/">Back to Decide One</a>.</footer>
</main>
</body>
</html>
`;
}

// ---------------------------------------------------------------- write
if (!fs.existsSync(OUT)) {
  console.error('\n✖ dist/ does not exist. This runs after `vite build`.\n');
  process.exit(1);
}

for (const p of pages) {
  const dir = path.join(OUT, p.section.base, p.meta.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p));
}

// Section index pages, so /methods/ and /guides/ are not 404s that the
// breadcrumbs point at.
for (const section of SECTIONS) {
  const own = pages.filter(p => p.section.base === section.base);
  if (own.length === 0) continue;
  const canonical = `${ORIGIN}/${section.base}/`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${section.label} — Decide One</title>
<meta name="description" content="${esc(section.label)} from Decide One — the methods the instrument ships, and how to use them.">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="/icon.svg?v=2">
<meta name="theme-color" content="#0B0B0D">
<style>${STYLE}</style>
</head>
<body><main>
<nav><a href="/">Decide One</a> › ${esc(section.label)}</nav>
<h1>${esc(section.label)}</h1>
<ul>${own.map(p => `<li><a href="${p.url}">${esc(p.meta.title)}</a> — ${esc(p.meta.description)}</li>`).join('')}</ul>
<footer><a href="/">Back to Decide One</a></footer>
</main></body></html>
`;
  const dir = path.join(OUT, section.base);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// Sitemap, generated from the same list that produced the pages. The previous
// one was maintained by hand and listed a single URL.
const urls = [
  { loc: ORIGIN + '/', priority: '1.0', changefreq: 'weekly' },
  ...SECTIONS.filter(s => pages.some(p => p.section.base === s.base))
    .map(s => ({ loc: `${ORIGIN}/${s.base}/`, priority: '0.8', changefreq: 'weekly' })),
  ...pages.map(p => ({
    loc: ORIGIN + p.url,
    lastmod: p.meta.updated || p.meta.published,
    priority: p.section.base === 'methods' ? '0.9' : '0.7',
    changefreq: 'monthly'
  }))
];

fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);

console.log(`\n\x1b[32m✓ content\x1b[0m  ${pages.length} page(s), ${urls.length} sitemap entries`);
pages.forEach(p => console.log(`    ${p.url.padEnd(42)} ${p.meta.title}`));
