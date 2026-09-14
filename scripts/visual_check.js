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
import { spawn, execSync } from 'child_process';
import sharp from 'sharp';

const UPDATE = process.argv.includes('--update');
const DIST = 'dist';
// Baselines are per platform. Fonts rasterise differently on macOS and Linux, so
// a baseline recorded on one can never match the other, and each machine records
// its own on first run. The measurements (contrast, scroll, tracking, console,
// keyboard) are platform-independent and gate everywhere.
const BASELINES = path.join('tests/baselines', process.platform);
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
  { id: 'landing-desktop', url: '/', vp: DESKTOP, fixed: true, quickStart: true },
  { id: 'landing-mobile', url: '/', vp: MOBILE, fixed: true, quickStart: true },
  { id: 'daily-desktop', url: '/?view=daily', vp: DESKTOP, fixed: true },
  { id: 'daily-laptop', url: '/?view=daily', vp: LAPTOP, fixed: true },
  { id: 'daily-mobile', url: '/?view=daily', vp: MOBILE, fixed: true },
  { id: 'weekly-desktop', url: '/?view=weekly', vp: DESKTOP, fixed: true },
  { id: 'monthly-desktop', url: '/?view=monthly', vp: DESKTOP, fixed: true },
  { id: 'yearly-desktop', url: '/?view=yearly', vp: DESKTOP, fixed: true },
  { id: 'guide-desktop', url: '/guides/why-to-do-lists-stop-working/', vp: DESKTOP },
  { id: 'guide-mobile', url: '/guides/why-to-do-lists-stop-working/', vp: MOBILE },
  { id: 'guide-dark', url: '/guides/why-to-do-lists-stop-working/', vp: DESKTOP, dark: true },
  { id: 'faq-desktop', url: '/faq/', vp: DESKTOP },
  // The sizes that were putting the day out of reach until 13 September 2026.
  { id: 'daily-small', url: '/?view=daily', vp: { w: 1280, h: 600 }, fixed: true },
  { id: 'daily-tiny', url: '/?view=daily', vp: { w: 320, h: 568 }, fixed: true },
  { id: 'weekly-tiny', url: '/?view=weekly', vp: { w: 320, h: 568 }, fixed: true },
  // The morning question, held open on purpose, at the size it was hardest to fit.
  { id: 'daily-prompt-tiny', url: '/?view=daily', vp: { w: 320, h: 568 }, fixed: true, prompt: true }
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
// A gate killed from outside leaves its Chrome running, reparented to init, and a
// headless Chrome rendering in software holds whole cores. On 14 September two of
// them — one seven hours old — kept the load near 13, and the next run's keyboard
// pass stalled until Chrome stopped answering. Only orphans (parent pid 1) are
// swept, so a gate another agent is running at the same moment is left alone.
if (process.platform !== 'win32') {
  try {
    const orphans = execSync('ps -Ao pid=,ppid=,command=', { encoding: 'utf8' }).split('\n')
      .map(line => line.trim().match(/^(\d+)\s+1\s+.*--user-data-dir=\/tmp\/decideone-visual-/))
      .filter(Boolean).map(m => Number(m[1]));
    for (const pid of orphans) { try { process.kill(pid); } catch { /* already gone */ } }
    if (orphans.length) process.stderr.write(`  swept ${orphans.length} orphaned Chrome(s) left by an earlier run\n`);
  } catch { /* ps unavailable: nothing to sweep */ }
}
const PROFILE = fs.mkdtempSync('/tmp/decideone-visual-');
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', '--disable-gpu',
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars',
  // Software WebGL, so the 3D scene actually renders here. Without it the
  // page falls back to a static image and the baseline would never cover the
  // geometry — which is exactly where a label was protruding out of the book.
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-gl=angle',
  // A real key press is a user gesture and lifts Chrome's autoplay restriction;
  // an injected one in headless Chrome did not, and the keyboard pass reported
  // dead keys that never reproduced in the app itself.
  '--autoplay-policy=no-user-gesture-required',
  '--force-device-scale-factor=1', '--disable-lcd-text', `--user-data-dir=${PROFILE}`,
  'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
// Every way out of this process takes Chrome with it. Signals do not fire 'exit'
// on their own, so they are turned into an exit first.
process.on('exit', () => { try { chrome.kill(); } catch { /* already gone */ } });
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(signal, () => process.exit(1));
process.on('unhandledRejection', (e) => {
  console.error(red('\n✗ visual') + `  ${e?.message || e}\n`);
  try { chrome.kill(); } catch { /* already gone */ }
  process.exit(1);
});

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
// A page stuck in a loop never answers, and a gate that waits forever reads as
// "still working" to every agent watching it. Every call fails loudly after 30s.
const CDP_TIMEOUT_MS = 30000;
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = nextId++;
  const timer = setTimeout(() => {
    pending.delete(id);
    reject(new Error(`Chrome did not answer ${method}${params && params.expression ? ' (' + String(params.expression).slice(0, 60) + '…)' : ''} within ${CDP_TIMEOUT_MS / 1000}s — the page is likely stuck`));
  }, CDP_TIMEOUT_MS);
  pending.set(id, {
    resolve: (v) => { clearTimeout(timer); resolve(v); },
    reject: (e) => { clearTimeout(timer); reject(e); }
  });
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const call = (m, p) => send(m, p, sessionId);

await call('Page.enable');
await call('Runtime.enable');

// Freeze the clock and the timezone. The instrument renders today's date and the
// time left in the day, so an unfrozen render changes daily and per machine: a
// baseline recorded on 13 September failed on the 14th, and one recorded in India
// would fail in a UTC container. Every surface renders at 09:30 on Monday
// 14 September 2026, Asia/Kolkata.
const FROZEN_ISO = '2026-09-14T09:30:00+05:30';
await call('Emulation.setTimezoneOverride', { timezoneId: 'Asia/Kolkata' });
await call('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
  const Real = Date;
  const fixed = Real.parse('${FROZEN_ISO}');
  class Frozen extends Real {
    constructor(...args) { super(...(args.length ? args : [fixed])); }
    static now() { return fixed; }
  }
  Frozen.parse = Real.parse;
  Frozen.UTC = Real.UTC;
  globalThis.Date = Frozen;
})();` });

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

// A native alert or confirm blocks every CDP call until it is answered, which hangs
// the gate — and a browser dialog inside an instrument is a defect in its own right.
listeners.push((msg) => {
  if (msg.sessionId !== sessionId || msg.method !== 'Page.javascriptDialogOpening') return;
  errors.push(`a native ${msg.params.type} dialog opened: "${String(msg.params.message).slice(0, 100)}"`);
  send('Page.handleJavaScriptDialog', { accept: false }, sessionId).catch(() => {});
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

  const clipped_x = all.filter(e => e.clientWidth > 100 && e.scrollWidth > e.clientWidth + 8
      // hidden only: with auto or scroll the reader can still reach it. An
      // instrument view forbids scrolling outright via the check below, so
      // this is about content that is silently gone, not merely off-screen.
      && getComputedStyle(e).overflowX === 'hidden'
      && getComputedStyle(e).textOverflow !== 'ellipsis')
    .map(e => ({ el: name(e), over: e.scrollWidth - e.clientWidth }))
    .sort((a, b) => b.over - a.over).slice(0, 2);

  const d = document.documentElement;
  return {
    clipped_x,
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
  process.stderr.write(`  rendering ${s.id} (${s.vp.w}×${s.vp.h})\n`);
  consoleErrors = [];
  await call('Emulation.setDeviceMetricsOverride',
    { width: s.vp.w, height: s.vp.h, deviceScaleFactor: 1, mobile: s.vp.w < 768 });
  await call('Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' },
                 { name: 'prefers-reduced-motion', value: 'reduce' }] });

  const seed = await call('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.removeItem('DECIDEONE_STUDIO_V1'); localStorage.${s.quickStart ? "removeItem('DECIDEONE_QUICK_START_V1')" : "setItem('DECIDEONE_QUICK_START_V1', 'done')"};` });
  await call('Page.navigate', { url: ORIGIN + s.url });
  await call('Page.removeScriptToEvaluateOnNewDocument', { identifier: seed.identifier });
  await settle(2600);                       // fonts, lazy chunks, WebGL fallback
  // Daily surfaces measure and baseline the instrument itself. On an empty today the
  // morning question covers it — until 14 September every daily baseline was a
  // picture of that dialog — so dismiss it as a person would, except on the one
  // surface that exists to show the question.
  if (s.url.includes('view=daily') && !s.prompt) {
    await evaluate('[...document.querySelectorAll("button")].find(b => /already know/i.test(b.textContent))?.click(); 1');
    await settle(700);
  }

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
  for (const c of m.clipped_x) {
    errors.push(`${at}: ${c.el} cuts ${c.over}px of content off sideways with no ellipsis — `
      + 'nothing on screen says anything is missing');
  }
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

process.stderr.write('  keyboard pass\n');
// ── Keyboard routing, pressed rather than grepped ───────────────────────────
// Rule 20 used to assert App.jsx contained the string "e.key === '1'". A handler
// can contain every shortcut and still route wrongly — Weekly had no key at all.
//
// It runs in its own tab with no emulation: it tests routing, not rendering. It
// waits for each view instead of sleeping a fixed time, and fails only when a key
// never arrives.
//
// Keys are dispatched inside the page, not through CDP's Input.dispatchKeyEvent.
// On macOS an injected key the page does not consume is handed back to Chrome's
// browser process, which walks AppKit's menu key-equivalents; headless Chrome 152
// overflows its stack there and dies (SIGSEGV in -[NSMenu _enableItems], crash
// reports 15:45, 20:37 and 20:48 on 14 September). Every later call then looked
// like a hung page — which was first blamed on the privacy frost, then on the
// renderer, then on CPU, and was none of them. App.jsx listens on window and
// filters by the focused element, so a bubbling keydown from the focused element
// reaches the same handler, router and render. The ceiling: it is not a trusted
// event, so it proves routing, not the browser's own key delivery.
const kbTarget = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: kbSession } = await send('Target.attachToTarget', { targetId: kbTarget.targetId, flatten: true });
await send('Target.closeTarget', { targetId }).catch(() => {});
await send('Target.activateTarget', { targetId: kbTarget.targetId }).catch(() => {});
const kbCall = (method, params) => send(method, params, kbSession);
const kbEval = async (expression) => {
  const { result, exceptionDetails } = await kbCall('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description || ''));
  return result.value;
};
await kbCall('Page.enable');
await kbCall('Runtime.enable');
await kbCall('Emulation.setFocusEmulationEnabled', { enabled: true });
await kbCall('Emulation.setDeviceMetricsOverride', { width: DESKTOP.w, height: DESKTOP.h, deviceScaleFactor: 1, mobile: false });

const kbProblems = [];
listeners.push((msg) => {
  if (msg.sessionId !== kbSession) return;
  if (msg.method === 'Runtime.exceptionThrown') {
    kbProblems.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    kbProblems.push(msg.params.args.map(x => x.value ?? x.description ?? '').join(' '));
  }
  if (msg.method === 'Page.javascriptDialogOpening') {
    kbProblems.push(`a native ${msg.params.type} dialog opened: ${msg.params.message}`);
    send('Page.handleJavaScriptDialog', { accept: false }, kbSession).catch(() => {});
  }
});

const press = async (key) => {
  await kbEval(`(() => { const t = document.activeElement || document.body;
    for (const type of ['keydown', 'keyup']) t.dispatchEvent(new KeyboardEvent(type, { key: ${JSON.stringify(key)}, bubbles: true, cancelable: true }));
    return 1; })()`);
  await settle(250);
};
const viewNow = () => kbEval('new URLSearchParams(location.search).get("view")');
const promptOpen = () => kbEval('document.body.innerText.includes("What does today look like")');
const waitForView = async (expected, ceilingMs = 6000) => {
  const started = Date.now();
  while (Date.now() - started < ceilingMs) {
    if (await viewNow() === expected) return Date.now() - started;
    await settle(150);
  }
  return null;
};

await kbCall('Page.navigate', { url: ORIGIN + '/?view=daily' });
await settle(2600);

// The morning prompt belongs to today's page. Switching view must close it, or it
// covers a surface it has nothing to do with — found 14 September 2026, when it
// stayed mounted over Weekly after a keyboard switch.
if (await promptOpen()) {
  await press('2', 50);
  await waitForView('weekly');
  if (await promptOpen()) {
    errors.push('keyboard: the morning prompt stayed open over the weekly view — '
      + 'a question about today must not cover another surface');
  }
  await press('1', 49);
  await waitForView('daily');
  await kbEval('document.querySelector(".quick-start footer button")?.click(); 1');
  await settle(100);
  await kbEval('[...document.querySelectorAll("button")].find(b => /already know/i.test(b.textContent))?.click(); 1');
  await settle(600);
}

const routes = [['2', 50, 'weekly'], ['3', 51, 'monthly'], ['4', 52, 'yearly'], ['1', 49, 'daily']];
for (const [key, code, expected] of routes) {
  await kbEval('document.activeElement?.blur(); 1');
  await press(key, code);
  const ms = await waitForView(expected);
  if (ms === null) {
    errors.push(`keyboard: pressing "${key}" never reached ${expected} within 6s (the view is ${await viewNow()}) — the key was dropped`);
  } else if (ms > 1500) {
    notes.push(`"${key}" reached ${expected} after ${ms}ms`);
  }
}
await press('4', 52);
await waitForView('yearly');
await press('t', 84);
await waitForView('daily');
const afterT = JSON.parse(await kbEval('JSON.stringify({view:new URLSearchParams(location.search).get("view"),'
  + ' today:document.body.innerText.includes(String(new Date().getDate()))})'));
if (afterT.view !== 'daily' || !afterT.today) {
  errors.push(`keyboard: pressing "t" left the view on ${afterT.view} (today shown: ${afterT.today}) `
    + '— it must return the instrument to today');
}
for (const problem of kbProblems.slice(0, 2)) errors.push(`keyboard: ${String(problem).slice(0, 140)}`);
await send('Target.closeTarget', { targetId: kbTarget.targetId }).catch(() => {});
if (!errors.some(e => e.startsWith('keyboard'))) notes.push('keyboard routing 1/2/3/4/T verified by pressing');

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
const recorded = notes.filter(n => n.endsWith(' recorded'));
const others = notes.filter(n => !n.endsWith(' recorded'));
console.log(`\x1b[32m✓ visual\x1b[0m   ${SURFACES.length} surfaces rendered in Chrome: no console errors, no `
  + `collapsed type, no unreadable text, no overflow, instruments hold one screen`
  // notes also carry the keyboard result and late arrivals, so only "recorded"
  // entries are baselines — counting all of them once reported a baseline that
  // was never written.
  + (recorded.length ? `; ${recorded.length} baseline(s) recorded` : '; pixels match baseline')
  + (others.length ? `\n           ${others.join('; ')}` : ''));
