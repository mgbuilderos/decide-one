/**
 * Visual regression — the layer ARCHITECTURE_AUDIT.md §6 named as missing.
 *
 * Every other gate here is static text analysis, which is why a heading that
 * collapsed into overlapping letters, a link pinned to invisible, and a tool
 * that had started scrolling all shipped green. This one opens the built site
 * in a real browser and measures what a person would actually see.
 *
 * No new dependency: Chrome is driven over CDP using Node's built-in WebSocket,
 * and sharp (already present) does the pixel diff.
 *
 *   npm run test:visual            check against tests/baselines
 *   npm run test:visual -- --update   re-record the baselines
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import sharp from 'sharp';

const UPDATE = process.argv.includes('--update');
const DIST = 'dist';
const BASELINES = 'tests/baselines';
const CHROME = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                '/Applications/Chromium.app/Contents/MacOS/Chromium',
                '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => fs.existsSync(p));

const errors = [];
const notes = [];
const red = s => `\x1b[31m${s}\x1b[0m`;

if (!CHROME) {
  console.error(red('\n✗ visual') + '  no Chrome or Chromium found. Install one, or set it in scripts/visual_check.js\n');
  process.exit(1);
}
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error(red('\n✗ visual') + '  no dist/ — run the build first\n');
  process.exit(1);
}

// ── The surfaces under test ──────────────────────────────────────────────────
// `fixed` means the viewport is the whole surface: this is an instrument, and
// an instrument that scrolls to show you today has already failed.
const DESKTOP = { w: 1440, h: 900 };
const LAPTOP = { w: 1366, h: 768 };
const MOBILE = { w: 390, h: 844 };

const SURFACES = [
  { id: 'landing-desktop', url: '/?view=landing', vp: DESKTOP },
  { id: 'landing-mobile', url: '/?view=landing', vp: MOBILE },
  { id: 'daily-desktop', url: '/?view=daily', vp: DESKTOP, fixed: true },
  { id: 'daily-laptop', url: '/?view=daily', vp: LAPTOP, fixed: true },
  { id: 'daily-mobile', url: '/?view=daily', vp: MOBILE, fixed: true },
  { id: 'weekly-desktop', url: '/?view=weekly', vp: DESKTOP, fixed: true },
  { id: 'monthly-desktop', url: '/?view=monthly', vp: DESKTOP, fixed: true },
  { id: 'yearly-desktop', url: '/?view=yearly', vp: DESKTOP, fixed: true },
  { id: 'guide-desktop', url: '/guides/why-to-do-lists-stop-working/', vp: DESKTOP },
  { id: 'guide-mobile', url: '/guides/why-to-do-lists-stop-working/', vp: MOBILE },
  { id: 'guide-dark', url: '/guides/why-to-do-lists-stop-working/', vp: DESKTOP, dark: true },
  { id: 'faq-desktop', url: '/faq/', vp: DESKTOP }
];

// ── A static server for dist/, so the check runs against the real artefact ────
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(DIST, p);
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

// ── Chrome over CDP ──────────────────────────────────────────────────────────
const PROFILE = fs.mkdtempSync('/tmp/decideone-visual-');
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
  // Software WebGL, so the 3D scene actually renders here. Without it the
  // page falls back to a static image and the baseline would never cover the
  // geometry — which is exactly where a label was protruding out of the book.
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-gl=angle',
  '--force-device-scale-factor=1', '--disable-lcd-text', `--user-data-dir=${PROFILE}`,
  'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });

const wsUrl = await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('Chrome did not report a debugging port in 20s')), 20000);
  let buf = '';
  chrome.stderr.on('data', d => {
    buf += d;
    const m = buf.match(/ws:\/\/[^\s]+/);
    if (m) { clearTimeout(t); resolve(m[0]); }
  });
});

let nextId = 1;
const pending = new Map();
const listeners = [];
const ws = new WebSocket(wsUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else if (msg.method) {
    listeners.forEach(fn => fn(msg));
  }
};
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const call = (m, p) => send(m, p, sessionId);

await call('Page.enable');
await call('Runtime.enable');

let consoleErrors = [];
listeners.push((msg) => {
  if (msg.sessionId !== sessionId) return;
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(msg.params.exceptionDetails.exception?.description
      || msg.params.exceptionDetails.text);
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(msg.params.args.map(a => a.value ?? a.description ?? '').join(' '));
  }
});

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await call('Runtime.evaluate',
    { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description || ''));
  return result.value;
};

// ── What "looks right" means, expressed as measurements ──────────────────────
// Everything here is a number a browser can produce, so it is checkable rather
// than a matter of taste. Each one exists because something shipped without it.
const PROBE = `(() => {
  const vis = el => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight * 3;
  };
  const rgb = c => (c.match(/[\\d.]+/g) || []).slice(0, 3).map(Number);
  const lum = ([r, g, b]) => {
    const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(r) + .7152 * f(g) + .0722 * f(b);
  };
  // Backgrounds must be composited, not taken from the first non-transparent
  // ancestor. A 2.5%-alpha black overlay on white paper is near-white; reading
  // it as pure black invents contrast failures that are not there.
  const bgOf = el => {
    const layers = [];
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const p = (getComputedStyle(n).backgroundColor.match(/[\\d.]+/g) || []).map(Number);
      if (p.length < 3) continue;
      const a = p.length > 3 ? p[3] : 1;
      if (a === 0) continue;
      layers.push([p[0], p[1], p[2], a]);
      if (a === 1) break;
    }
    let out = layers.length && layers[layers.length - 1][3] === 1
      ? layers.pop().slice(0, 3) : [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) {
      const [r, g, b, a] = layers[i];
      out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)];
    }
    return out;
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const name = el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
    ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');

  const all = [...document.querySelectorAll('body *')].filter(vis);
  const texty = all.filter(el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2));

  // 1. Tracking so tight the glyphs collide. -4px is right at 86px and ruinous
  //    at 18px, which is exactly how a display heading collapsed into mush.
  const tracking = texty.map(el => {
    const s = getComputedStyle(el);
    const ls = parseFloat(s.letterSpacing), fs = parseFloat(s.fontSize);
    return (!isNaN(ls) && fs > 0 && ls / fs < -0.12)
      ? { el: name(el), fontSize: Math.round(fs), letterSpacing: +ls.toFixed(1), em: +(ls / fs).toFixed(3) } : null;
  }).filter(Boolean);

  // 2. Text the eye cannot separate from what is behind it.
  const contrast = texty.map(el => {
    const s = getComputedStyle(el);
    const r = ratio(rgb(s.color), bgOf(el));
    return r < 3 ? { el: name(el), text: el.textContent.trim().slice(0, 34), color: s.color, ratio: +r.toFixed(2) } : null;
  }).filter(Boolean);

  // 3. Anything sticking out sideways. A page that scrolls horizontally on a
  //    phone is broken regardless of how it looks on a desktop.
  const inScroller = el => {
    for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      const ox = getComputedStyle(n).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
    }
    return false;
  };
  const overflow = all.map(el => {
    const r = el.getBoundingClientRect();
    return (r.right > innerWidth + 2 || r.left < -2)
      && getComputedStyle(el).position !== 'fixed' && !inScroller(el)
      ? { el: name(el), left: Math.round(r.left), right: Math.round(r.right) } : null;
  }).filter(Boolean).slice(0, 5);

  // An instrument that sets h-screen overflow-hidden can never report document
  // scroll: the content is CLIPPED instead, which is worse — the person cannot
  // reach it at all. Checking documentElement.scrollHeight alone is an
  // assertion that can never fire, which is how this shipped once already.
  const boxes = all.filter(el => el.clientHeight > 120 && el.scrollHeight > el.clientHeight + 24);
  const scrollers = boxes.filter(el => /auto|scroll/.test(getComputedStyle(el).overflowY))
    .map(el => ({ el: name(el), hidden: el.scrollHeight - el.clientHeight, kind: 'scrolls' }));
  const clipped = boxes.filter(el => getComputedStyle(el).overflowY === 'hidden')
    .map(el => ({ el: name(el), hidden: el.scrollHeight - el.clientHeight, kind: 'clipped' }));

  const d = document.documentElement;
  return {
    vpH: innerHeight, docH: d.scrollHeight,
    scrolls: d.scrollHeight > innerHeight + 2,
    hScroll: d.scrollWidth > innerWidth + 2,
    unreachable: [...scrollers, ...clipped].sort((a, b) => b.hidden - a.hidden).slice(0, 3),
    tracking, contrast, overflow,
    elements: all.length
  };
})()`;

// ── Run ──────────────────────────────────────────────────────────────────────
const settle = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(BASELINES, { recursive: true });
const diffs = [];

for (const s of SURFACES) {
  consoleErrors = [];
  await call('Emulation.setDeviceMetricsOverride',
    { width: s.vp.w, height: s.vp.h, deviceScaleFactor: 1, mobile: s.vp.w < 768 });
  await call('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' },
                 { name: 'prefers-reduced-motion', value: 'reduce' }] });

  await call('Page.navigate', { url: ORIGIN + s.url });
  await settle(2600);                       // fonts, lazy chunks, WebGL fallback

  let m;
  try {
    m = await evaluate(PROBE);
  } catch (e) {
    errors.push(`${s.id}: the page could not be measured — ${e.message}`);
    continue;
  }

  const at = `${s.id} (${s.vp.w}×${s.vp.h})`;
  for (const c of consoleErrors.slice(0, 2)) errors.push(`${at}: console error — ${c.slice(0, 140)}`);
  if (s.fixed && m.scrolls) {
    errors.push(`${at}: the instrument scrolls — ${m.docH}px of content in a ${m.vpH}px viewport. `
      + 'VISION §12.1a: it does three things and completes them on one surface.');
  }
  if (s.fixed) for (const u of m.unreachable) {
    errors.push(`${at}: ${u.el} ${u.kind === 'clipped' ? 'clips' : 'scrolls'} ${u.hidden}px of content `
      + `out of a ${m.vpH}px viewport — the instrument must hold the day on one surface`);
  }
  if (m.hScroll) errors.push(`${at}: the page scrolls horizontally (${m.overflow[0]?.el || 'unknown'})`);
  for (const t of m.tracking.slice(0, 3)) {
    errors.push(`${at}: ${t.el} has ${t.letterSpacing}px tracking at ${t.fontSize}px (${t.em}em) — `
      + 'glyphs collide below -0.12em');
  }
  for (const c of m.contrast.slice(0, 3)) {
    errors.push(`${at}: ${c.el} "${c.text}" is ${c.color} at ${c.ratio}:1 against its background — unreadable`);
  }
  for (const o of m.overflow.slice(0, 2)) {
    if (!m.hScroll) errors.push(`${at}: ${o.el} extends to ${o.right}px, past the ${s.vp.w}px viewport`);
  }

  // ── Pixels ─────────────────────────────────────────────────────────────────
  const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const png = Buffer.from(shot.data, 'base64');
  const baseline = path.join(BASELINES, `${s.id}.png`);

  if (UPDATE || !fs.existsSync(baseline)) {
    fs.writeFileSync(baseline, png);
    notes.push(`${s.id} recorded`);
    continue;
  }

  const [a, b] = await Promise.all([
    sharp(baseline).raw().ensureAlpha().toBuffer({ resolveWithObject: true }),
    sharp(png).raw().ensureAlpha().toBuffer({ resolveWithObject: true })
  ]);
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    errors.push(`${at}: screenshot is ${b.info.width}×${b.info.height}, baseline is ${a.info.width}×${a.info.height}`);
    continue;
  }
  let changed = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    if (Math.abs(a.data[i] - b.data[i]) > 12 || Math.abs(a.data[i + 1] - b.data[i + 1]) > 12
      || Math.abs(a.data[i + 2] - b.data[i + 2]) > 12) changed++;
  }
  const pct = (changed / (a.data.length / 4)) * 100;
  if (pct > 0.35) {
    const out = path.join(BASELINES, `${s.id}.changed.png`);
    fs.writeFileSync(out, png);
    diffs.push(`${s.id}: ${pct.toFixed(2)}% of pixels changed — see ${out}`);
  }
}

// ── Down ─────────────────────────────────────────────────────────────────────
ws.close(); chrome.kill(); server.close();
// Chrome keeps writing to its profile for a moment after SIGTERM. Cleaning it
// up is housekeeping, not a result — it must never fail the check.
await settle(400);
try { fs.rmSync(PROFILE, { recursive: true, force: true }); } catch { /* it is in /tmp */ }

if (diffs.length) {
  errors.push(...diffs.map(d => d + '\n      If the change is intended: npm run test:visual -- --update'));
}
if (errors.length) {
  console.error(red(`\n✗ visual regression`) + `  ${errors.length} problem(s) across ${SURFACES.length} surfaces:\n`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.error('');
  process.exit(1);
}
console.log(`\x1b[32m✓ visual\x1b[0m   ${SURFACES.length} surfaces rendered in Chrome: no console errors, no `
  + `collapsed type, no unreadable text, no overflow, instruments hold one screen`
  + (notes.length ? `; ${notes.length} baseline(s) recorded` : '; pixels match baseline'));
