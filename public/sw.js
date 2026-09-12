/**
 * Decide One offline shell.
 *
 * Local-first, zero server reliance. The FAQ promises the page keeps working
 * without a connection; this is what keeps that true.
 *
 * Rewritten 13 September 2026. The previous version served every same-origin
 * asset cache-first out of a CACHE_NAME that had not changed since the first
 * commit, and `activate` only evicts caches whose name differs. The result was
 * a visitor still being shown the gold D1 monogram from the initial commit,
 * months after the mark became monochrome, with no way for the site to correct
 * it. The rule that prevents a repeat:
 *
 *   Cache-first is only ever correct for a file whose name changes when its
 *   contents change. That is Vite's /assets/* bundles and nothing else.
 *
 * Everything else is network-first, so a changed file is never withheld, and
 * the cache is only ever an offline fallback.
 */

const CACHE_NAME = 'decideone-shell-v2';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/icon.svg'];

// Content-hashed by the build, and marked immutable in public/_headers.
const isImmutable = (url) => url.pathname.startsWith('/assets/');

const putInCache = (request, response) => {
  if (!response || response.status !== 200 || response.type !== 'basic') return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
  return response;
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (isImmutable(url)) {
    event.respondWith(
      caches.match(event.request).then((hit) =>
        hit || fetch(event.request).then((res) => putInCache(event.request, res)))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => putInCache(event.request, res))
      .catch(() => caches.match(event.request).then((hit) => {
        if (hit) return hit;
        if (event.request.mode === 'navigate') return caches.match('/index.html');
        return Response.error();
      }))
  );
});
