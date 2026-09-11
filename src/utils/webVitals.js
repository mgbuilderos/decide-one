/**
 * Core Web Vitals, measured first-party.
 *
 * TELEMETRY_SPEC §3.2 asks for LCP, INP, CLS and TTFB. Those used to arrive
 * free from Cloudflare's Real User Monitoring, which was turned off under B-39:
 * its beacon is a third-party script, one origin serves both the landing page
 * and the instrument, and allowing the origin would have allowed it on the page
 * where people write their priorities.
 *
 * So this replaces it. No dependency, no network fetch, nothing to allow in the
 * CSP. It reads numbers the browser has already computed and sends four of them
 * once, as the page is being left.
 *
 * **Marketing routes only** (§0a item 2). The caller decides; this module does
 * not look at the URL itself.
 *
 * It records timing and nothing else. No coordinates, no element text, no
 * content of any kind.
 */

// Core Web Vitals thresholds, as published by the Chrome team.
const THRESHOLDS = {
  lcp: [2500, 4000],
  inp: [200, 500],
  cls: [0.1, 0.25],
  ttfb: [800, 1800]
};

function rate(metric, value) {
  const t = THRESHOLDS[metric];
  if (!t || value == null) return null;
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'needs-improvement';
  return 'poor';
}

/**
 * Start observing. Returns a stop function.
 *
 * `report` is called at most once, with an object of metrics, when the page is
 * being hidden or unloaded — which is the only moment LCP and CLS are final.
 */
export function observeWebVitals(report) {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  const state = { lcp: null, cls: 0, inp: null, ttfb: null };
  const observers = [];
  let reported = false;

  // TTFB is already measured by the time this runs; no observer needed.
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.responseStart > 0) state.ttfb = Math.round(nav.responseStart);
  } catch {
    // Navigation Timing unavailable. Not knowing is fine; guessing is not.
  }

  const observe = (type, handler, extra = {}) => {
    try {
      const po = new PerformanceObserver((list) => list.getEntries().forEach(handler));
      po.observe({ type, buffered: true, ...extra });
      observers.push(po);
    } catch {
      // This browser does not report this entry type. The metric stays null
      // rather than becoming a zero that would read as a perfect score.
    }
  };

  // LCP: the last candidate before the page is hidden is the real one.
  observe('largest-contentful-paint', (e) => {
    state.lcp = Math.round(e.startTime);
  });

  // CLS: sum of shifts the person did not cause. A running total rather than
  // the windowed maximum the official library uses - simpler, and slightly
  // pessimistic on long sessions, which is the safe direction for a number
  // used to decide whether the page is good enough.
  observe('layout-shift', (e) => {
    if (!e.hadRecentInput) state.cls += e.value;
  });

  // INP: the worst interaction latency seen. True INP is the 98th percentile
  // of interactions; the maximum is the standard approximation and is never
  // flattering, which is the direction an instrument should err in.
  observe('event', (e) => {
    if (e.duration > (state.inp || 0)) state.inp = Math.round(e.duration);
  }, { durationThreshold: 40 });

  const finish = () => {
    if (reported) return;
    reported = true;
    observers.forEach((po) => { try { po.disconnect(); } catch { /* already gone */ } });

    const cls = Math.round(state.cls * 1000) / 1000;
    report({
      lcp_ms: state.lcp,
      lcp: rate('lcp', state.lcp),
      inp_ms: state.inp,
      inp: rate('inp', state.inp),
      cls,
      cls_rating: rate('cls', cls),
      ttfb_ms: state.ttfb,
      ttfb: rate('ttfb', state.ttfb)
    });
  };

  // Hidden is the last reliable moment. pagehide covers the bfcache path that
  // visibilitychange alone misses on iOS.
  const onHide = () => { if (document.visibilityState === 'hidden') finish(); };
  document.addEventListener('visibilitychange', onHide, { once: false });
  window.addEventListener('pagehide', finish, { once: true });

  return () => {
    document.removeEventListener('visibilitychange', onHide);
    window.removeEventListener('pagehide', finish);
    observers.forEach((po) => { try { po.disconnect(); } catch { /* already gone */ } });
  };
}
