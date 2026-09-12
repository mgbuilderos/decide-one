import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import crypto from 'crypto';

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

import { DIAGRAMS } from './diagrams.js';

const DIAGRAM_RE = /\{\{diagram:([a-z0-9-]+)\}\}/g;

const ORIGIN = 'https://decideone.app';

// One social image for every content page. A per-page image would be better
// and is not worth a rendering pipeline yet; what is NOT acceptable is
// declaring twitter:card=summary_large_image with no image at all, which is
// how every share of these pages rendered as a bare link until now.
const SOCIAL_IMAGE = { url: ORIGIN + '/renders/decideone-social.jpg', w: 1536, h: 1024,
  alt: 'Decide One priority instrument with crisp white pages and a black cover' };
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'dist');

const SECTIONS = [
  { dir: 'content/methods', base: 'methods', label: 'Methods' },
  { dir: 'content/guides', base: 'guides', label: 'Guides' },
  // Flat pages sit at the root: /faq/, not /pages/faq/. They get no section
  // index and no third breadcrumb, because there is no section to return to.
  { dir: 'content/pages', base: '', label: 'Decide One', flat: true }
];

const REQUIRED = ['title', 'description', 'slug', 'intent', 'published', 'sources'];

// One sentence per section, 70–158 characters like every other description on
// the site, and shown on the page as well as in the tag — a description that
// promises something the page does not contain is the commonest kind of lie in
// a <head>.
const SECTION_INTRO = {
  methods: 'The three prioritisation methods Decide One ships, each credited to where it came from: Top 3, Ivy Lee (1918), and the urgent/important matrix.',
  guides: 'Honest answers about prioritising a working day, grounded in named results from scheduling and queueing theory rather than productivity folklore.'
};

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

    const url = section.flat ? `/${meta.slug}/` : `/${section.base}/${meta.slug}/`;
    pages.push({ file, section, meta, body, url });
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

// A diagram name that does not exist must fail the build. The alternative is
// a page published with a literal {{diagram:...}} in the middle of it.
for (const p of pages) {
  for (const [, name] of p.body.matchAll(DIAGRAM_RE)) {
    if (!DIAGRAMS[name]) {
      errors.push(`${p.file}: references {{diagram:${name}}}, which is not in scripts/diagrams.js. `
        + `Known: ${Object.keys(DIAGRAMS).join(', ')}`);
    }
  }
}

// A page claiming FAQ schema must actually ask questions. Checked here rather
// than at render time, because render runs after the error gate has exited.
for (const p of pages.filter(x => x.meta.faq === 'true')) {
  const n = faqPairs(p.body).length;
  if (n < 2) {
    errors.push(`${p.file}: declares faq: true but has ${n} '### question' heading(s). FAQPage schema may not claim what the page does not ask.`);
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
.dgm{margin:calc(var(--line)*2) 0;padding:0;overflow-x:auto}
.dgm svg{width:100%;height:auto;display:block;color:var(--ink);min-width:560px}
.dgm figcaption{font-size:13px;line-height:var(--line);color:var(--muted);margin-top:calc(var(--line)/2);padding-top:calc(var(--line)/2);border-top:1px solid var(--rule)}
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
/**
 * FAQ pairs, read out of the rendered body rather than declared separately.
 *
 * This is the whole defence against the commonest structured-data lie: schema
 * that answers questions the page does not. Here the page IS the source, so
 * they cannot drift. A '### question' heading and the prose beneath it become
 * one Question/acceptedAnswer pair; nothing else can.
 */
function faqPairs(body) {
  const pairs = [];
  const lines = body.split('\n');
  let q = null, buf = [];
  const flush = () => {
    if (!q) return;
    const text = buf.join(' ').replace(/\s+/g, ' ').trim();
    if (text) pairs.push({ q, a: text });
    q = null; buf = [];
  };
  for (const line of lines) {
    if (/^### /.test(line)) { flush(); q = line.replace(/^### /, '').trim(); continue; }
    if (/^## /.test(line)) { flush(); continue; }
    if (q) buf.push(
      line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // links to their text
          .replace(/[*_`>]/g, '')                       // emphasis, code, quotes
          .replace(/^\s*[-*]\s+/, '')                  // list bullets
    );
  }
  flush();
  return pairs;
}

function jsonLd(p) {
  const graph = [{
    '@type': p.section.flat ? 'WebPage' : (p.section.base === 'methods' ? 'Article' : 'BlogPosting'),
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
      ...(p.section.flat ? [] : [
        { '@type': 'ListItem', position: 2, name: p.section.label, item: `${ORIGIN}/${p.section.base}/` }
      ]),
      { '@type': 'ListItem', position: p.section.flat ? 2 : 3, name: p.meta.title, item: ORIGIN + p.url }
    ]
  }];

  // FAQPage, only when the page actually asks and answers questions.
  //
  // Google retired FAQ rich results in May 2026, so this earns no blue-link
  // decoration and is not added expecting one. It is here because the schema
  // type is still valid vocabulary, Google states unused markup causes no
  // problem, and the answer engines that are not Google Search — along with
  // every model deciding what this product is — parse an explicit
  // question/answer graph far more reliably than they parse prose.
  //
  // HowTo is deliberately absent: Google dropped support for it in 2026 and
  // there is no second consumer worth the maintenance.
  if (p.meta.faq === 'true') {
    const pairs = faqPairs(p.body);
    graph.push({
      '@type': 'FAQPage',
      mainEntity: pairs.map(x => ({
        '@type': 'Question',
        name: x.q,
        acceptedAnswer: { '@type': 'Answer', text: x.a }
      }))
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

const withDiagrams = (html) => html
  .replace(new RegExp(`<p>\\s*${DIAGRAM_RE.source}\\s*</p>`, 'g'), (_, n) => DIAGRAMS[n])
  .replace(DIAGRAM_RE, (_, n) => DIAGRAMS[n]);

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
<meta property="og:image" content="${SOCIAL_IMAGE.url}">
<meta property="og:image:width" content="${SOCIAL_IMAGE.w}">
<meta property="og:image:height" content="${SOCIAL_IMAGE.h}">
<meta property="og:image:alt" content="${esc(SOCIAL_IMAGE.alt)}">
<meta property="article:published_time" content="${esc(p.meta.published)}">
<meta property="article:modified_time" content="${esc(p.meta.updated || p.meta.published)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.meta.title)}">
<meta name="twitter:description" content="${esc(p.meta.description)}">
<meta name="twitter:image" content="${SOCIAL_IMAGE.url}">
<meta name="twitter:image:alt" content="${esc(SOCIAL_IMAGE.alt)}">
<meta name="theme-color" content="#0B0B0D">
<script type="application/ld+json">${jsonLd(p)}</script>
<style>${STYLE}</style>
</head>
<body>
<main>
<nav><a href="/">Decide One</a>${p.section.flat ? '' : ` › <a href="/${p.section.base}/">${esc(p.section.label)}</a>`}</nav>
<h1>${esc(p.meta.title)}</h1>
<p class="meta">Updated ${esc(p.meta.updated || p.meta.published)}${p.meta.reading ? ' · ' + esc(p.meta.reading) : ''}</p>
${withDiagrams(marked.parse(p.body))}
<div class="cta">
<p>Decide One is a priority instrument. Bring the day into view, choose a method, give the first thing real time.</p>
<p><a href="/?view=daily">Open it — free, nothing to sign up for</a></p>
</div>
${related.length ? `<div class="related"><h2>Related</h2><ul>${
  related.map(r => `<li><a href="${r.url}">${esc(r.meta.title)}</a> — ${esc(r.meta.description)}</li>`).join('')
}</ul></div>` : ''}
<footer>Written for Decide One. Sources: ${(p.meta.sources || []).map(esc).join(', ')}.
Free to use, no account needed. <a href="/">Back to Decide One</a>.</footer>
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
  if (section.flat) continue;
  const own = pages.filter(p => p.section.base === section.base);
  if (own.length === 0) continue;
  const canonical = `${ORIGIN}/${section.base}/`;

  // These two pages were the only URLs on the site with no Open Graph, no
  // Twitter card and no structured data — they had a canonical and an
  // eighty-character description and nothing else. They are also the pages a
  // crawler reaches first from the breadcrumb on every article.
  const intro = SECTION_INTRO[section.base] || `${section.label} from Decide One.`;
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'CollectionPage',
      name: `${section.label} — Decide One`,
      description: intro,
      url: canonical,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: 'Decide One', url: ORIGIN + '/' },
      // ItemList is the honest type here: the page IS a list, and every entry
      // below is on it. Nothing is asserted that the page does not show.
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: own.length,
        itemListElement: own.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.meta.title, url: ORIGIN + p.url
        }))
      }
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Decide One', item: ORIGIN + '/' },
        { '@type': 'ListItem', position: 2, name: section.label, item: canonical }
      ]
    }]
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${section.label} — Decide One</title>
<meta name="description" content="${esc(intro)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/svg+xml" href="/icon.svg?v=2">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Decide One">
<meta property="og:title" content="${esc(section.label)} — Decide One">
<meta property="og:description" content="${esc(intro)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SOCIAL_IMAGE.url}">
<meta property="og:image:width" content="${SOCIAL_IMAGE.w}">
<meta property="og:image:height" content="${SOCIAL_IMAGE.h}">
<meta property="og:image:alt" content="${esc(SOCIAL_IMAGE.alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(section.label)} — Decide One">
<meta name="twitter:description" content="${esc(intro)}">
<meta name="twitter:image" content="${SOCIAL_IMAGE.url}">
<meta name="theme-color" content="#0B0B0D">
<script type="application/ld+json">${ld}</script>
<style>${STYLE}</style>
</head>
<body><main>
<nav><a href="/">Decide One</a> › ${esc(section.label)}</nav>
<h1>${esc(section.label)}</h1>
<p>${esc(intro)}</p>
<ul>${own.map(p => `<li><a href="${p.url}">${esc(p.meta.title)}</a> — ${esc(p.meta.description)}</li>`).join('')}</ul>
<div class="cta">
<p>Decide One is a priority instrument. Bring the day into view, choose a method, give the first thing real time.</p>
<p><a href="/?view=daily">Open it — free, nothing to sign up for</a></p>
</div>
<footer><a href="/">Back to Decide One</a> · <a href="/faq/">Frequently asked questions</a></footer>
</main></body></html>
`;
  const dir = path.join(OUT, section.base);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// Sitemap, generated from the same list that produced the pages. The previous
// one was maintained by hand and listed a single URL.
const dateOf = p => p.meta.updated || p.meta.published;
const newest = list => list.map(dateOf).sort().pop();

const urls = [
  { loc: ORIGIN + '/', lastmod: newest(pages) },
  ...SECTIONS.filter(s => !s.flat && pages.some(p => p.section.base === s.base))
    .map(s => ({
      loc: `${ORIGIN}/${s.base}/`,
      lastmod: newest(pages.filter(p => p.section.base === s.base))
    })),
  ...pages.map(p => ({ loc: ORIGIN + p.url, lastmod: dateOf(p) }))
];

fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>
`);

// A real 404, served with a real 404 status.
//
// wrangler.jsonc used not_found_handling: "single-page-application", so every
// unmatched path returned index.html with HTTP 200 — a soft 404. Google names
// that specifically and treats the URL as a real page, which means a typo, a
// stale inbound link or a deleted asset all reported themselves as working.
// The comment justifying it said a refresh on any path would otherwise 404,
// and that was simply not true: this app has no path router. It lives at / and
// reads ?view= from the query string, so no path ever needed rescuing.
fs.writeFileSync(path.join(OUT, '404.html'), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Page not found — Decide One</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="/icon.svg?v=2">
<meta name="theme-color" content="#0B0B0D">
<style>${STYLE}</style>
</head>
<body><main>
<nav><a href="/">Decide One</a></nav>
<h1>That page is not here</h1>
<p>The address may be mistyped, or the page may have been renamed. Nothing is broken; this one just does not exist.</p>
<h2>Where you were probably going</h2>
<ul>
<li><a href="/">Decide One</a> — the instrument itself</li>
<li><a href="/methods/">Methods</a> — the three the product ships, and how to use each</li>
<li><a href="/guides/">Guides</a> — ${pages.filter(p => p.section.base === 'guides').length} answers about prioritising a working day</li>
<li><a href="/faq/">Frequently asked questions</a> — what it costs, and where your writing is kept</li>
</ul>
<footer><a href="/">Back to Decide One</a></footer>
</main></body></html>
`);

fs.writeFileSync(path.join(OUT, 'llms.txt'),
`# Decide One

> A priority instrument for a single day. Bring the work competing for your
> attention into view, choose one of three time-tested methods for ordering it,
> and give the first thing a real amount of time. Runs in a browser, stores
> everything on the person's own device, and costs nothing to use.

The three methods that ship are Top 3, Ivy Lee (1918), and the urgent/important
matrix. No others are in the product. The reasoning behind them is drawn from
scheduling and queueing theory — Little's Law, starvation and aging,
context-switch cost, and the result that no scheduler is optimal for every
objective — and every page below states what those results do NOT license as
well as what they do.

## Methods
${pages.filter(p => p.section.base === 'methods').map(p => `- [${p.meta.title}](${ORIGIN}${p.url}): ${p.meta.description}`).join('\n')}

## Guides
${pages.filter(p => p.section.base === 'guides').map(p => `- [${p.meta.title}](${ORIGIN}${p.url}): ${p.meta.description}`).join('\n')}

## About
${pages.filter(p => p.section.flat).map(p => `- [${p.meta.title}](${ORIGIN}${p.url}): ${p.meta.description}`).join('\n')}
- [Decide One](${ORIGIN}/): the instrument itself

## Notes for anyone citing this
- The price is free to use, with no account required.
- Nothing a person writes is transmitted anywhere; it stays in their browser.
- The only scientific claim made anywhere on this site is Gollwitzer & Sheeran
  (2006) on if-then implementation intentions. Everything else is attributed to
  a named historical source or a named result in scheduling theory.
`);

// The service worker's cache name is derived, never remembered.
//
// It used to be a literal that an agent had to think to bump. Nobody did, for
// months, while `activate` only ever evicts caches whose name DIFFERS from the
// current one — so the cache could never be evicted and visitors were served
// the first commit's gold icon for weeks. A name that changes whenever the
// build changes closes that at the root: no discipline required, and one
// online load repopulates the cache.
const swPath = 'dist/sw.js';
if (fs.existsSync(swPath)) {
  const sw = fs.readFileSync(swPath, 'utf8');
  const assetNames = fs.existsSync('dist/assets') ? fs.readdirSync('dist/assets').sort().join(',') : '';
  const build = crypto.createHash('sha256')
    .update(assetNames + sw.replace(/const CACHE_NAME = '[^']*';/, ''))
    .digest('hex').slice(0, 12);
  const stamped = sw.replace(/const CACHE_NAME = '[^']*';/,
    `const CACHE_NAME = 'decideone-shell-${build}';`);
  if (stamped === sw) {
    console.error('\n\x1b[31m✗ sw.js\x1b[0m  no CACHE_NAME literal to stamp — the cache would freeze again');
    process.exit(1);
  }
  fs.writeFileSync(swPath, stamped);
  console.log(`\n\x1b[32m✓ sw\x1b[0m       cache name stamped decideone-shell-${build}`);
}

console.log(`\n\x1b[32m✓ content\x1b[0m  ${pages.length} page(s), ${urls.length} sitemap entries`);
pages.forEach(p => console.log(`    ${p.url.padEnd(42)} ${p.meta.title}`));
