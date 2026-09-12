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

*Revised 12 September 2026, after the technical pass. Items closed are kept with
their evidence rather than deleted, so a later reader can tell the difference
between "was never a problem" and "was fixed".*

| # | Item | Owner | Severity | State |
| :--- | :--- | :--- | :--- | :--- |
| ~~O8~~ | the site claimed "nothing held back" while the app held six things back | founder | — | **closed — locks removed 12 Sep** |
| O3 | `?view=` app views have no independent canonical | `seo-technical` | Low | **closed — not a defect** |
| O6 | No field performance data | `seo-technical` | Low | open, blocked on traffic |
| O7 | `npm audit` reports 3 high advisories in `miniflare`, `sharp`, `wrangler` — build-time devDependencies, pre-existing. Fixing means bumping `wrangler`, which touches the deploy path | founder | Low | open, should be a decision rather than an oversight |
| ~~O9~~ | Search Console verification | founder | — | **closed 12 Sep** — verified as a Domain property via Cloudflare's domain-name-provider integration, owner `maulik.payment@gmail.com` (deliberate). TXT `google-site-verification=f3Cw_TF3C-LEZLF_9vCAMBloZn-wE1KEue1bjfwqvZQ` confirmed on the authoritative nameserver. Googlebot fetches `sitemap.xml` 200 and `robots.txt` 200. **Baseline, 12 Sep 2026:** sitemap submitted and already read the same day, status Success, **26 discovered pages** — every URL the generator emits, so discovery is complete and nothing is being missed at the crawl stage. Indexed count at this point: 0, which is correct for day zero. **Bing Webmaster Tools** also live, imported from Search Console on the same day (no second verification). Bing matters here disproportionately: its index is what ChatGPT search and Copilot draw on, so it is the measurement surface for the GEO half of this work, where Search Console only covers Google |
| ~~O1~~ | live site is not this build | — | — | closed — four deploys landed, `verify:live` MATCH each time |
| ~~O2~~ | service worker under cold crawl unverified | — | — | **closed — verified.** `curl` *is* a cold crawl: no service worker, no JS, no prior registration. All 16 URLs returned correct server-rendered HTML that way. Googlebot does not run service workers either, so the worker cannot affect indexation |
| ~~O4~~ | Wave 1 was 3 pages of ~12 | — | — | closed — 13 pages live |
| ~~O5~~ | no `FAQPage` or `HowTo` schema | — | — | closed, and the item was partly obsolete when written: Google deprecated FAQ rich results in May 2026 and dropped `HowTo` support. `FAQPage` ships for the answer engines that are not Google Search; `HowTo` is deliberately absent |

### O8 — the claim and the code disagreed (resolved)

**What the site says.** `index.html` meta description: *"Free, with nothing held
back."* `MarketingLandingPage.jsx` pricing section, as a headline: *"Everything,
from today. **Nothing held back.**"* Its feature list includes *"Device-local
storage, protected exports, and print."* Its disclosure: *"No account, no
subscription, nothing held back."*

**What the code does.** `UnifiedMenuModal.jsx` gates six things behind
`isPatron`: paper tones Vellum and Washi, ink colours Oxblood, Kon-peki and
Sepia, the Weekly Review PDF, the Markdown export, and the annual print. Each
renders a padlock. **Two of those — the Markdown export and the print — are
named on the landing page as included.**

**Why nobody can unlock them.** `isPatron` comes only from a signed licence key.
`useLicenseAutoActivation.js` activates one from a `?key=` parameter "upon return
from Dodo Payments". `PatronUpgradeModal.jsx` offers key entry and nothing else —
no price, no purchase, no link out. QC Rule 24 forbids any price appearing in
`src/` while `VISION.md` §11.1 declares the product free, and it passes, correctly.

So the locks are not a paid tier. **They are dead ends**: a person clicks a
padlock, a modal opens, and there is nothing they can do in it.

**Why the audit never caught it.** Rule 18 requires the Patron machinery to
exist. Rule 24 requires the price to match `VISION.md`, which says free. No rule
compares *feature gating* against the claim of completeness, so both rules pass
while contradicting each other. This is the same shape as Rule 25's origin: two
things each locally correct, and nothing checking them against each other.

**What was done about it here.** The twelve content pages published this session
carried the same sentence; it was corrected to *"free to use, with no account"*,
which is verifiable, and `nothing held back` was added to the content price gate
so it cannot be republished by accident. **The landing page and `index.html` were
not touched**, because `CLAUDE.md` rule 5 governs that copy: §11 wins, and
changing it means changing §11 first and saying why.

**The decision, which is the founder's.** Either:

1. **Remove the locks.** `VISION.md` §11.1 becomes true as written and the copy
   needs no change. This will fail QC Rule 18, which asserts the Patron gating
   exists — so Rule 18 has to be amended in the same change.
2. **Amend §11.1** to say what actually ships — free to use, with some finishes
   reserved — and bring the landing page copy in line with it.

Doing neither leaves a claim on the homepage that the product contradicts two
clicks later, and `VISION.md` §13 is explicit about what that costs: *an
instrument is trusted because it is right, and a compass two degrees off is
worse than no compass, because it is believed.*

### Resolution — option 1, 12 September 2026

**The founder chose the recommendation, and the locks were removed.** All six
things are now available to everyone: paper tones Vellum and Washi, ink colours
Oxblood, Kon-peki and Sepia, the Weekly Review PDF, the Markdown export and the
annual print. 31 lines deleted from `UnifiedMenuModal.jsx`; every padlock, every
`!isPatron` guard, and the now-unused `isFree` fields went with them.

**Rule 18 did not have to be amended.** The earlier claim here that it would —
made in this document — was wrong. Rule 18 asserts that `licenseManager.js`,
`archivalExport.js`, `PatronUpgradeModal.jsx` and `YearlyViewSpread.jsx` exist
and export certain functions. It says nothing about whether anything is *gated*,
so removing the gating left it passing untouched. The full audit passes.

**Verified in a browser, not by inspection:** the menu opens with no padlock on
any control, and clicking a previously-locked paper tone (Washi) applies it
rather than opening the upgrade modal — confirmed by reading the button's
selected state from the DOM, not by looking at a screenshot. Zero console errors.

**The copy was left as it is.** "Free to use, with no account" is true and is
better writing than the original; there was no reason to churn 23 pages back.

**What replaced the word ban.** The phrase `nothing held back` was briefly
blacklisted outright. That was the wrong instrument — it blocks a sentence that
is now true. It is replaced by a **cross-check**: `check_content.js` fails the
build only if a page claims completeness *and* `src/` still gates on
`!isPatron`. That is precisely the comparison whose absence caused this — Rule 18
and Rule 24 each passed while contradicting each other, because nothing compared
them. Proven to fire in both directions before it was committed.

**One thing left open.** `PatronUpgradeModal.jsx` still exists and the menu still
offers "Become a Patron", which now leads to a licence-key field that grants
nothing. It is no longer a *lock* and no longer contradicts any claim, so it is
not urgent — but VISION §11.1 describes the support ask as happening *"at the end
of a day the person has actually closed"*, not as a menu item, and the two should
be reconciled.

---

## 7. What was already right

Worth recording, because an audit that only lists faults misleads about the state of the thing.

The site had a correct `robots.txt`, a complete and well-written Open Graph and Twitter card set, a proper `manifest.json`, a genuinely strict CSP (`default-src 'self'`), correct cache headers, one `<h1>` per page, and images already carrying dimensions and lazy-loading. The meta description was specific and human rather than keyword-stuffed.

**The problem was never care. It was that a single-page application had never been asked to be a website**, and one hardcoded canonical tag quietly undid everything else.
