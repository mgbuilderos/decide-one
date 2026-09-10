# Work remaining — one list

> Generated 10 September 2026. **This is the single working file.** Everything
> outstanding, in the order it should be done. Decisions live in `DECISIONS.md`;
> this file is what is left to *do* about them.
>
> Status: ⬜ not started · 🔨 in progress · ✅ done · 🔒 blocked on a decision · 👤 needs you

---

## 0. Why the live site looks wrong — read this first

**Nothing is broken. `decideone.app` is running an old build.**

| | Bundle | Contains |
| :--- | :--- | :--- |
| **Live** | `assets/index-DsE169m7.js` | The day-condition prompt. **Not** the execution layer, the leaflet, or the habit removal |
| **Local** | `assets/index-DjF_OwhZ.js` | Everything through B-12 |

Verified by fetching the live bundle: *"Where the time went"* is absent from it, and the habit code is still present. That is why the deployed page still shows **HABITS**, **REFLECT**, a two-page spread and a spine crease. All of that is already gone from the code in this repo.

| # | Task | Status |
| :--- | :--- | :--- |
| **D1** | **Redeploy — yours to run, and here is why I cannot.** `decideone.app` resolves to **Cloudflare** (`cf-ray`, Cloudflare IPs), not to the Sites project named in `.openai/hosting.json`. There is no Cloudflare config in the repo, no `wrangler` installed or declared, no project name recorded, and no credentials — so I cannot tell which account or project serves the domain, and guessing at a deploy target would be wrong. **Tell me the host and I will script it.** If it is Cloudflare Pages: `npx wrangler pages deploy dist --project-name <name>`. | 👤 |
| **D2** | **After deploying, hard-refresh.** `public/sw.js` is a service worker; its cache was bumped to `decideone-priority-v1.0.3`, which evicts the old one, but the currently-open tab may hold the previous worker until it is closed. Safari: ⌥⌘E then ⌘R, or close every `decideone.app` tab first. | 👤 |
| **D3** | **Add a deploy script to `package.json`** so this cannot silently drift again. Blocked on D1: the target has to be known before it can be scripted. Note that `.openai/hosting.json` appears to be **stale** — it names a Sites project while the domain is served by Cloudflare. | 🔒 |

---

## 1. Ship blockers — cannot take money until these are done

From `DECISIONS.md` §6. **B0 is now closed** (the repo is on GitHub, private).

| # | Blocker | What has to change | Status |
| :--- | :--- | :--- | :--- |
| **B0** | No version control | `mgbuilderos/decide-one`, private, pushed | ✅ |
| **B1** | **Checkout is simulated** — a timer, no money requested or taken. Deferred by the founder, Sept 10. The demo path no longer activates a licence key: it writes a record marked `demo: true`, so nothing bundle-readable grants Patron | 👤 |
| **B2** | ~~Six hardcoded licence keys, all readable in the bundle~~ **Done.** Signed per-order licences: `D1.<payload>.<signature>`, ECDSA P-256, verified offline against a public key embedded in the app. **All six promo keys are gone — verified absent from the built bundle.** Anyone who activated with one is migrated to a demo grant rather than dropped. Signing key lives offline and is gitignored; Gate 23 fails the build if a shared key returns or a private key component appears in source. **Deviation from the brief:** P-256 not Ed25519 — Ed25519 in browser WebCrypto only reached Chrome 137, and a buyer on an older browser must never be locked out of software they paid for. | ✅ |
| **B3** | ~~"Zero telemetry" claimed while the SDK is live~~ **Done.** Telemetry needs **two** gates — the build flag *and* stored consent on this device — and defaults to off, because an unanswered question is not consent. A control in the menu turns it on or off. README corrected: no "zero telemetry" claim, three methods not nine, $39/₹999 not $24/₹1,999, live storage stated as **unencrypted**, and the licence key no longer printed in it. | ✅ |
| **B4** | ~~No terms, privacy page, or refund policy~~ **Drafted.** `LegalPages.jsx`, linkable at `?view=legal` and from the landing footer. Terms, Privacy, and a 60-day no-questions refund policy matching M-A rows. **Five bracketed facts are yours to fill: legal entity, registered address, support email, jurisdiction, effective date.** M-A8 still stands — an attorney reviews before the first sale. | 👤 |

---

## 2. The app still contradicts its own decisions

Found while verifying B-12. All pre-existing; none introduced by this week's work.

| # | Contradiction | Decision it breaks | Status |
| :--- | :--- | :--- | :--- |
| **C-1** | **The landing hero pictures a habit grid** — a notebook captioned *Progress* with M–S checkboxes, advertising a feature that no longer exists. **The asset is a Blender render (`decideone-studio-d1.png`); fixing it means re-rendering, which is craft work §8 step 4 puts behind BR8.** Interim option: drop the still and let the live 3D scene carry the hero, since it renders the actual app | P2 | 🔒 |
| **C-2** | ~~The closure ritual speaks in streaks~~ **Done.** The streak badge, *Conquered*, *Flawless 100% execution*, *Needle-Movers*, *Shutdown Complete* and the Mental Shutdown Guarantee are gone. It now says **"What today came to — N of M finished"** and **"Nothing is lost: what was not first today is not deleted, it moves up."** Gate 22 extended to the closure ritual and the verso, and negative-tested. | R8, R12 | ✅ |
| **C-3** | **Render assets still named `decideone-*` but depict the old bifold notebook** with habit columns | P2, P11 | ⬜ |
| **C-6** | ⚠️ **The privacy shutter was decorative and the README sold it as security.** Empty input reopened it; `authenticateWithBiometrics` returned success on unsupported hardware, on unexpected errors, and unconditionally at the end. **Fixed:** the function now reports what actually happened, the shutter is described as a shutter, and the default PIN is no longer printed on screen. | ✅ |
| **C-4** | **`archivalExport.js` still writes a Habit Consistency section.** Deliberately left so old journals stay exportable — but it must be conditional on legacy data only, never offered as a feature | P2 | ⬜ |
| **C-5** | **Twenty stale documents** overstate what is built. `LANDING_PROTOTYPE.md` is the honest one. §8 step 2 says archive them | — | ⬜ |

---

## 3. Blocked on a decision only you can make

| # | Item | What is blocked | Status |
| :--- | :--- | :--- | :--- |
| **BR8** | **Leica register or Casio register** | The cover, the 3D scene, the monthly artwork, and the rest of P11's chrome (no cover, no ribbon, no month illustrations). **Blocks further craft work either way** | 🔒 👤 |
| **N5** | ~~Professional trademark clearance~~ **Declined by the founder, Sept 10 — not a blocker.** The knock-out search found no product, company or app named *Decide One* (N28). A paid clearance search is a separate decision from filing, and remains available at any time; neither is commissioned. **The accepted trade: the risk of a forced rename is carried, not removed.** | ✅ |
| **M-A8** | IP attorney review of method names and marketing copy | Same review, same appointment | 🔒 👤 |

---

## 4. Product work, in dependency order

| # | Task | Status |
| :--- | :--- | :--- |
| **P-1** | **R16 `doneDefinition`** — stating what "done" looks like. Optional, never required, never before the first line is written | ⬜ |
| **P-2** | ~~Methods & Attributions page~~ **Done.** `?view=methods`, linked from the landing footer. Each method with originator, date, the problem it treats and its legal standing; the §102(b) reasoning; and the single evidence claim scoped strictly to if-then planning. **Corrects the Eisenhower misattribution rather than repeating it**, and observes the M-A5 blacklist throughout. | ✅ |
| **P-3** | ~~R17 return prompt~~ **Done.** On return: *Still on "X"?* with Still on it / I stopped, stating that the figure is an estimate. Only the trusted interval is banked — a five-hour absence banked one hour, not five. | ✅ |
| **P-4** | ~~Rule of 3 hard cap~~ **Was my error — already enforced.** The slots are hardcoded to exactly three. What is genuinely open is **B-23**: the Today stream beneath is unbounded and can become where priority #4 lives. Needs a ruling on what that stream is for, not code. | 👤 |
| **P-5** | ~~Eisenhower classification before writing~~ **Done.** One *Add a task* control asks *Is it urgent?* then *Does it actually matter?* and places the result. The per-quadrant `+` buttons are gone — the quadrant is a consequence of a judgment, not a destination you pick. | ✅ |

---

## 5. After launch

| # | Task | Status |
| :--- | :--- | :--- |
| **L-1** | **Ship to one real stranger** and hear what they say. §8 says this is worth more than steps 1–6 combined | ⬜ 👤 |
| **L-2** | **The five-stranger name test** — say `DECIDE ONE` to five people, have them spell it back and guess what it does (N24) | ⬜ 👤 |
| **L-3** | **G6 framework SEO** — one interactive page per method, compounding at zero cost | ⬜ |
| **L-4** | **G7 native apps** via Capacitor or Tauri around the existing React app | ⬜ |
| **L-5** | **M7 regional pricing** beyond India | ⬜ |

---

## 6. Housekeeping

| # | Task | Status |
| :--- | :--- | :--- |
| **H-1** | **N27 numbering defect** — N18 and N19 are each used twice in `DECISIONS.md` §2 | ⬜ |
| **H-2** | **`pm-` CSS prefix** still stands for Primacy throughout the landing page. Internal only, invisible to users; rename only if it ever stops being cheap to leave | ⬜ |
| **H-3** | **`.claude/launch.json` uses autoPort** because port 3000 is occupied by another process on this machine; `vite.config.js` still hardcodes 3000 | ⬜ |
