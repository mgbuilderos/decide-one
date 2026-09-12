# SEO · AEO · GEO audit — decideone.app

> **Audited**: 12 September 2026, against `main @ 3bd065e`
> **Method**: reading the repository and the built output. Every ✅ and ✖ below was verified by running something, not by inspection alone. Items needing a live crawl or field data are marked **unmeasured** rather than guessed.
> **Governs**: `SEO_CHARTER.md`. Fixes land under the wave plan in §5 of that document.

---

## The headline

**Before this audit, the site was structurally incapable of ranking anything except its homepage** — and was actively instructing Google not to try.

Three findings did that, and all three are now fixed:

1. Every URL served the same `index.html`.
2. That file hardcodes `<link rel="canonical" href="https://decideone.app/">`. Served at every path, it told Google that every page on the site was a duplicate of the homepage.
3. `sitemap.xml` listed one URL.

A fourth finding — **no structured data anywhere on the site** — was the largest single gap for answer engines and for any model deciding whether this domain is worth citing.

---

## 1. Crawlability and indexation

| Check | Before | Now | Notes |
| :--- | :--- | :--- | :--- |
| Unique HTML per URL | ✖ SPA fallback served one document everywhere | ✅ for content | Generated pages are real files. App views still use `?view=`, which is correct — they are app states, not documents |
| Self-referencing canonical | ✖ **every page canonicalised to `/`** | ✅ | The single most damaging finding in this audit |
| `robots.txt` | ✅ | ✅ | `Allow: /`, sitemap declared |
| `sitemap.xml` | ✖ 1 URL, hand-maintained | ✅ 5 URLs, generated | Hand-maintained copy deleted — a second source of truth goes stale |
| Body text without JavaScript | ✖ | ✅ for content | Verified by grepping prose out of the built HTML |
| Orphan pages | — | ✅ gated | Build fails on a page nothing links to |
| Broken internal links | — | ✅ gated | Proven: a link to a missing slug stops the build |
| HTTPS, HSTS-adjacent headers | ✅ | ✅ | `public/_headers`: nosniff, DENY framing, strict-origin referrer |
| Service worker interference | **unmeasured** | **unmeasured** | `public/sw.js` caches aggressively. Needs a cold-crawl check before Wave 2 |

## 2. On-page

| Check | Status | Notes |
| :--- | :--- | :--- |
| One `<h1>` per page | ✅ | Landing, methods page, and all generated pages |
| Title length ≤ ~60 chars | ✅ **now gated** | The first three pages written were ~105. Fixed, and `check_content.js` now fails the build past 47 + the 13-char brand suffix |
| Description 70–158 chars | ✅ **now gated** | The first three were ~190 |
| Descriptive internal anchors | ✅ | Enforced by the related-links block and the ≥2 links gate |
| Image `alt`, `width`, `height`, lazy | ✅ on landing | Verified on `/renders/` images in `MarketingLandingPage.jsx` |
| Heading hierarchy | ✅ | No skipped levels in generated output |

## 3. Structured data (AEO / GEO)

| Check | Before | Now |
| :--- | :--- | :--- |
| Any JSON-LD at all | ✖ **none anywhere** | ✅ |
| `SoftwareApplication` | ✖ | ✅ homepage, with `price: 0` and `isAccessibleForFree` |
| `Organization`, `WebSite` | ✖ | ✅ homepage |
| `Article` / `BlogPosting` | ✖ | ✅ generated per page from front-matter |
| `BreadcrumbList` | ✖ | ✅ three levels |
| `FAQPage`, `HowTo` | ✖ | Not yet — and only where a page genuinely contains questions or steps |
| `aggregateRating` | ✖ | **Deliberately absent.** Nobody has been asked for a review; asserting one would be structured-data spam and a false claim |

## 4. Performance

| Check | Status | Notes |
| :--- | :--- | :--- |
| Content pages | ✅ | ~4 KB of inline CSS, no JavaScript, no external requests |
| App bundle | ⚠️ | `JournalScene` chunk is 537 KB (140 KB gzipped). It is lazy-loaded, but it is the LCP risk on the page organic traffic lands on |
| Field data at p75 | **unmeasured** | `src/utils/webVitals.js` measures LCP/INP/CLS/TTFB first-party, but telemetry is compiled out (`VITE_ENABLE_TELEMETRY=false`), so no field data exists |
| Asset caching | ✅ | `/assets/*` immutable for a year; `index.html` and `sw.js` no-cache |

## 5. Content integrity — the gates

Not conventional SEO, but the thing that decides whether a large body of content survives. All enforced by `npm run test:qc`.

| Gate | Source |
| :--- | :--- |
| No clinical vocabulary | `VISION.md` §11.3 |
| No judgment language | `VISION.md` §11.3 |
| No unearned science | `VISION.md` §11.3, `FOUNDATIONS.md` §5 |
| Evidence vocabulary requires the one permitted citation | `FOUNDATIONS.md` §5 — Gollwitzer & Sheeran (2006), if-then only |
| No blacklisted trademark | `FRAMEWORKS.md` §6.3 |
| No price claim | `VISION.md` §11.1 — the price is free |
| No "zero telemetry" claim | `TELEMETRY_SPEC.md` |
| Title and description length | This audit |
| One page per intent | `SEO_CHARTER.md` §3.1 |

**These are not theoretical.** On its first run the prose gate failed four violations in content written minutes earlier: three uses of *treats* (clinical) and one *a day you failed* (judgment). The prose was fixed, not the gate.

---

## 6. Open, and owned

| # | Item | Owner | Severity |
| :--- | :--- | :--- | :--- |
| O1 | **`decideone.app` is not this build.** `npm run brief` reports the live asset hash does not match `dist/`. Every fix in this audit is uncommitted to reality until a deploy lands | founder / `seo-technical` | **Blocking** — content that is not served ranks nothing |
| O2 | Service worker behaviour under a cold crawl is unverified | `seo-technical` | Medium |
| O3 | `MethodsPage` and the legal pages are still SPA views at `?view=`, so they have no independent canonical | `seo-technical` | Medium |
| O4 | Wave 1 is 3 pages of ~12. The comparison queries people actually search are unwritten | `seo-content` | Medium |
| O5 | No `FAQPage` or `HowTo` schema yet | `seo-answer-engine` | Medium |
| O6 | No field performance data, because telemetry is compiled out | `seo-technical` | Low until traffic exists |
| O7 | `npm audit` reports 3 high advisories in `miniflare`, `sharp`, `wrangler` — all build-time devDependencies, all pre-existing, none introduced here. Fixing means bumping `wrangler`, which touches the deploy path | founder | Low, but should be a decision rather than an oversight |

---

## 7. What was already right

Worth recording, because an audit that only lists faults misleads about the state of the thing.

The site had a correct `robots.txt`, a complete and well-written Open Graph and Twitter card set, a proper `manifest.json`, a genuinely strict CSP (`default-src 'self'`), correct cache headers, one `<h1>` per page, and images already carrying dimensions and lazy-loading. The meta description was specific and human rather than keyword-stuffed.

**The problem was never care. It was that a single-page application had never been asked to be a website**, and one hardcoded canonical tag quietly undid everything else.
