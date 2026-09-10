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
| **D1** | **Redeploy `dist/` to the Sites project** in `.openai/hosting.json` (`appgprj_6aa060ea93fc819198302b9398806888`). Run `npm run build` first. **I cannot do this — there is no deploy CLI in this repo, so it is yours to run.** | 👤 |
| **D2** | **After deploying, hard-refresh.** `public/sw.js` is a service worker; its cache was bumped to `decideone-priority-v1.0.3`, which evicts the old one, but the currently-open tab may hold the previous worker until it is closed. Safari: ⌥⌘E then ⌘R, or close every `decideone.app` tab first. | 👤 |
| **D3** | **Add a deploy script to `package.json`** so this cannot silently drift again. Nothing in the repo currently records how the site is published. | ⬜ |

---

## 1. Ship blockers — cannot take money until these are done

From `DECISIONS.md` §6. **B0 is now closed** (the repo is on GitHub, private).

| # | Blocker | What has to change | Status |
| :--- | :--- | :--- | :--- |
| **B0** | No version control | `mgbuilderos/decide-one`, private, pushed | ✅ |
| **B1** | **Checkout is simulated** — a 1.5s timer, no money requested or taken | Real Dodo Payments checkout. **Needs your merchant account and keys.** | 👤 |
| **B2** | **Six hardcoded licence keys**, one published in the README, all readable in the bundle | Ed25519-signed per-buyer keys, verified offline against a public key in the app. The legacy keys must keep working (N32) | ⬜ |
| **B3** | **"Zero telemetry" claimed while the SDK is live** | Resolve in the user's favour: make it opt-in and default off, then correct every claim. This is the honesty item `LANDING_PROTOTYPE.md` already flagged | ⬜ |
| **B4** | **No terms, privacy page, or refund policy** | A merchant of record requires all three | ⬜ |

---

## 2. The app still contradicts its own decisions

Found while verifying B-12. All pre-existing; none introduced by this week's work.

| # | Contradiction | Decision it breaks | Status |
| :--- | :--- | :--- | :--- |
| **C-1** | **The landing hero pictures a habit grid** — a notebook captioned *Progress* with M–S checkboxes, advertising a feature that no longer exists. **The asset is a Blender render (`decideone-studio-d1.png`); fixing it means re-rendering, which is craft work §8 step 4 puts behind BR8.** Interim option: drop the still and let the live 3D scene carry the hero, since it renders the actual app | P2 | 🔒 |
| **C-2** | ~~The closure ritual speaks in streaks~~ **Done.** The streak badge, *Conquered*, *Flawless 100% execution*, *Needle-Movers*, *Shutdown Complete* and the Mental Shutdown Guarantee are gone. It now says **"What today came to — N of M finished"** and **"Nothing is lost: what was not first today is not deleted, it moves up."** Gate 22 extended to the closure ritual and the verso, and negative-tested. | R8, R12 | ✅ |
| **C-3** | **Render assets still named `decideone-*` but depict the old bifold notebook** with habit columns | P2, P11 | ⬜ |
| **C-4** | **`archivalExport.js` still writes a Habit Consistency section.** Deliberately left so old journals stay exportable — but it must be conditional on legacy data only, never offered as a feature | P2 | ⬜ |
| **C-5** | **Twenty stale documents** overstate what is built. `LANDING_PROTOTYPE.md` is the honest one. §8 step 2 says archive them | — | ⬜ |

---

## 3. Blocked on a decision only you can make

| # | Item | What is blocked | Status |
| :--- | :--- | :--- | :--- |
| **BR8** | **Leica register or Casio register** | The cover, the 3D scene, the monthly artwork, and the rest of P11's chrome (no cover, no ribbon, no month illustrations). **Blocks further craft work either way** | 🔒 👤 |
| **N34 / N5** | **Professional trademark clearance**, Classes 9 and 42, with `D1 DECISIONONE` as the known flag | Legally safe launch. **N6: the window closes at the first sale** | 🔒 👤 |
| **M-A8** | IP attorney review of method names and marketing copy | Same review, same appointment | 🔒 👤 |

---

## 4. Product work, in dependency order

| # | Task | Status |
| :--- | :--- | :--- |
| **P-1** | **R16 `doneDefinition`** — stating what "done" looks like. Optional, never required, never before the first line is written | ⬜ |
| **P-2** | **M-A7 Methods & Attributions page** — each method, its originator, date and licence status. Required before launch: the product's whole claim is that these are public-domain methods used honestly | ⬜ |
| **P-3** | **R17 return prompt** — the model marks abandoned sessions `inferred`, but nothing yet *asks* "still on this?" on return. The provenance is honest; the prompt is missing | ⬜ |
| **P-4** | **Rule of 3 hard cap** — P9 says three lines with no fourth. The recto still allows a fourth line through the Today stream | ⬜ |
| **P-5** | **Eisenhower classification-before-writing** — P9 requires it; currently you can type into any quadrant freely | ⬜ |

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
