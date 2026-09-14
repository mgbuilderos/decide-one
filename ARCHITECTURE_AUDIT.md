# Architecture Audit — why five defects reached production

**Written 13 September 2026, after a front-end forensic pass found five live
defects on `decideone.app` that every gate had passed.**

Read this with `DECISIONS.md`. That file says what is true. This one says why
the machine that is supposed to keep it true did not.

---

## Verdict, up front

There is an architecture issue, and it is one sentence:

> **`npm run test:qc` is a source-code linter that this project has been
> treating as a product-correctness gate.**

It answers *"did an agent reverse a decision in the code?"* — which is what it
was built for, and which it does well across 26 rules. It cannot answer *"is
the published artefact correct?"*, and nothing else asks that question either.

Every one of the five defects lived in the gap between those two questions.

This is not a failure of care by any of the three agents. It is a scope
boundary that was never stated, so all three inherited it, and each one's green
build reinforced the other two's confidence in a check that was not looking.

---

## 1. What escaped, and what each escape proves

| # | Defect | Live for | Where the defect actually lived | Why every gate passed |
|---|---|---|---|---|
| 1 | Gold D1 monogram — the first commit's icon, served to real visitors | ~weeks | `public/sw.js` cache policy + the browser's cache | No gate reads `public/`. The artefact was correct on the server and wrong in delivery. |
| 2 | `PRIMACY` — the pre-rename brand — stamped on a homepage render | since the rename | pixels inside `decideone-studio-v2.webp` | Rule 17 enforces brand purity by grepping source. No gate can read an image. |
| 3 | Homepage linked to **zero** of 41 guides | since the guides shipped | the *relationship* between `src/` and `content/` | Both directories pass their own gates. Nothing asserts anything about the two together. |
| 4 | Spine label protruding above the 3D journal | since it was added | `y=2.08, z=0.075` in `JournalScene.jsx` | The file *is* read by the audit. The defect is geometric — invisible to text analysis. |
| 5 | Unstyled prose flashing before first paint | since the prerender was added | absence of critical CSS in `index.html` | `index.html` is gated for title and description *length*. First paint is a rendered property. |

Two distinct failure modes, and the second is the harder one:

- **A — the surface is never read.** Defects 1 and 2.
- **B — the surface is read, but the property is not textual.** Defects 3, 4, 5.
  You cannot grep your way to *"does this look right"*, *"is this reachable"*,
  or *"what does a human see in the first 500 ms"*.

---

## 2. The verification system as built

2,300 lines across 12 scripts. Measured, not estimated:

| Script | Lines | Reads | Runs before deploy? |
|---|---:|---|---|
| `qc_audit.js` | 865 | **`src/` only** | yes |
| `check_content.js` | 217 | `content/`, `index.html`, walks `src/` | yes |
| `build_content.js` | 566 | `content/` → `dist/` | yes (as build) |
| `verify:live` | 1 line | one bundle hash | yes (after) |
| `launch_check.js` | 46 | `.env` legal facts | **no — orphaned** |
| `test_telemetry.js` | — | `server/` | **no** |

### Coverage map

| Surface | Files | Covered by a pre-deploy gate |
|---|---:|---|
| `src/` | 59 | yes — 26 rules |
| `content/` | 45 | yes — prose gates |
| `index.html` | 1 | partial — title/description length only |
| `public/` | 8 (4 binary) | **no** |
| `worker/` | 2 (175 lines of deployed request handling, writes to D1) | **no** |
| `dist/` — the thing actually published | all | **no** |

### Technique

- 58 regex / string matches. That is the entire method.
- **Zero** rules render, rasterise, fetch, or execute anything. The six matches
  for `canvas` in `qc_audit.js` are the *word* "canvas" in prose.
- No CI. No `.github`. The gates run only when an agent remembers to run them,
  and `predeploy` is the only thing that forces it.
- `verify:live` compares exactly one bundle hash. It proves the deploy landed.
  It proves nothing about whether the deploy is correct.

---

## 3. Root cause: four failure classes

### Class A — surfaces outside the gate's reach
`public/`, `worker/`, `dist/`. The service worker that poisoned every visitor's
icon cache is 100 lines of cache policy that **no gate has ever read**, in a
directory no gate has ever opened.

### Class B — existence checked instead of effect
This is the recurring one, and it is the strongest architectural signal in the
repository, because it has now been found **three times**:

- `DECISION_LOG.md` line 971: *"Rule 25 had the same existence-vs-reachability
  hole Rule 0 did"* — a `track()` call in a file nothing imports counted as an
  emitter.
- Rule 18 asserts the Patron machinery **exists**. It said nothing about whether
  that machinery *gated* anything — which is how "free, with nothing held back"
  shipped live while six features were locked.
- Rule 17 asserts the string `PRIMACY` is absent from source. It says nothing
  about whether the brand is absent from what a person sees.

A defect class found three times is structural, not careless. The pattern:
**a rule that checks a symbol is present is cheap to write and proves almost
nothing.** The expensive, useful form is *"and it is reached, and it has the
effect claimed."*

### Class C — no orphan detection
Four render assets were unreferenced. `FAQ`, five `useState` hooks, and five
icon imports went dead the moment four sections were cut. All found by hand.
Nothing counts references, so dead weight accumulates silently and a *wrong*
reference (`-v2` instead of `-d1`) looks identical to a right one.

### Class D — recorded knowledge that cannot be reached
See §5. The worst of the four, because it is the one that wastes whole sessions.

---

## 4. The three-agent amplifier

Three agents share one working tree: Claude Code, ChatGPT Codex, Antigravity.
`AGENTS.md` states the coordination protocol, and it is good on the problem it
addresses — *concurrent edits*. `npm run tree` answers "is someone writing right
now" well.

What the protocol does **not** address is *sequential handoff of intent*:

1. **The audit is named as the contract.** `AGENTS.md`: *"The audit is the
   contract between agents. It is faster and more reliable than asking another
   agent to review."* That is true within its scope and dangerous outside it.
   A shared contract with an unstated boundary gives three agents the *same*
   blind spot and mutual confidence in it.

2. **No agent owns the artefact.** Each agent owns the change it makes. Nothing
   owns "is the published site coherent". Defect 3 is the pure form of this:
   one agent wrote 41 guides and gated them; another owned the landing page and
   gated it; nobody owned the edge between them, so it did not exist.

3. **Green is read as correct.** After a rename, a cut, or a deletion, a passing
   audit is taken as evidence the work is complete. In all five cases it was
   evidence only that nothing *in `src/`* had regressed textually.

4. **The one agent that cannot be replaced is the one looking at the screen.**
   Four of the five defects were found by a human opening the site — not by any
   agent, and not by any gate. That is the load-bearing verification layer
   today, and it is unpaid, unscheduled, and undocumented.

---

## 5. The knowledge layer — why the gold foil was re-derived

The founder had already ordered the gold foil removed, and it had been done.
That decision is recorded, in full, at **`DECISION_LOG.md` line 845**:

> *"Removed every gold treatment from the notebook cover: the monogram's 24K
> gold foil gradient is now an ink deboss… Gold is Leica register and VISION
> §12.1 chose the Casio F-91W."*

An agent investigating a gold logo the next day did not find it. Not through
carelessness — **through following the documented process correctly**:

- `AGENTS.md`: *"Read documentation only when `brief` tells you to."*
- `DECISION_LOG.md` is 30,593 words.
- `brief` prints the **last five entries**.
- Line 845 is roughly 1,300 lines out of reach.
- There are **49 markdown files** in the root, and `brief` explicitly says not
  to read 40 of them.

**The system recorded the answer and then structurally prevented access to it.**
That is the sharpest architecture finding in this document, and it generalises:
this project does not have a documentation shortage. It has 49 files and a
standing instruction not to read them. Every additional unindexed document makes
the problem measurably worse — *including this one, unless it is registered.*

The log is append-only and grows ~1,000 words a session. Sequential reading was
never going to scale. What is missing is not more writing; it is **retrieval**.

---

## 6. The layers that are missing, ranked by value over cost

| # | Layer | Closes | Status |
|---|---|---|---|
| 1 | **Artefact gate** — `scripts/qc_artifact.js`, reads `public/`, `worker/`, built `dist/` | A | **built**, in `predeploy` |
| 2 | **Link-graph assertion** — the home page must reach every content section | B (3) | **built** |
| 3 | **Orphan detection** — every file in `public/` must be referenced | C | **built** |
| 4 | **Derived cache name** — `CACHE_NAME` stamped from a build hash | A (1), at the root | **built** |
| 5 | **Log retrieval** — `npm run why "<term>"` over the whole record | D | **built** |
| 6 | **Rule-shape review** — audit the 26 existing rules for existence-vs-effect | B | **done** 14 Sep — §7e |
| 7 | **Visual regression** — `scripts/visual_check.js`, 12 surfaces in real Chrome | B (2, 4, 5) | **built**, in `predeploy` |
| 8 | **CI** — run the gates without an agent remembering | all | after 6 |

Layers 1–5 were cheap because they are all *static analysis of things nobody
thought to look at* — the same technique already in use, pointed at the
surfaces it was never pointed at.

Layer 7 was built on 13 September 2026 after a collapsed heading shipped — see §7d. The honest limit is now narrower but real: Defects 2 and 4 — a brand name in a `.webp`, a
label protruding 0.19 units — are **not reachable by any amount of text
analysis**. Until something renders, a human opening the site remains the only
detector for that class, and that should be stated as a known ceiling rather
than quietly hoped away.

---

## 7. Changed on 13 September 2026

- `sw.js` rewritten. Cache-first now applies only to `/assets/*` (content-hashed,
  already `immutable` in `_headers`); everything else is network-first. The
  stale-forever class is closed at the root, not patched.
- Landing page links the writing: a Writing section with six links, plus nav and
  footer. `href="/guides` went from **0** occurrences to 8.
- Critical CSS added to `index.html`, matching the values the bundle sets on
  `body`, so first paint changes no colour.
- The protruding spine label removed. No position could fix it: in front of the
  page planes it covers the writing, behind them it is invisible.
- The `PRIMACY` render replaced with the renamed asset; four orphaned renders
  deleted.
- Entry splits on who you are — a written day opens the instrument; a first
  visit gets the front door.

## 7b. The gate was written wrong the first time, and that is the point

Five assertions were written. Each was then deliberately broken to check that it
fails. **Two of the five did not fire:**

- The broken-reference check scanned `href` and `src` only. `og:image` lives in
  `content=`, so a dead social image would have shipped silently.
- The link-graph check counted `index.html` — **including the prerendered `#root`
  summary that `createRoot` destroys on mount.** A link that exists only there is
  a link no person can click. The gate built to catch defect 3 had reproduced
  defect 3 inside itself.

Both were Class B — an assertion that looks right, passes, and proves nothing.
Writing a check is not the work; **proving the check fails on the defect it
names** is the work. Any rule added here should be broken once before it is
trusted, and `git stash` makes that cheap.

On its first clean run the gate then found a live instance of the class it was
built for: `/methods/` was in the sitemap and linked from nowhere on the home
page. Fixed the same minute.

## 7c. Found while instrumenting

`log_session.js` and `handoff.js` stamped **a UTC date beside a local time** —
`new Date().toISOString().slice(0,10)` with `new Date().toTimeString()`. At
02:00 IST on the 13th that writes `2026-09-12 02:00`: the date and the time in
one line came from two different clocks, entries near midnight landed on the
wrong day, and the log disagreed with git. AGENTS.md's atomic-grade standard
asks for "correct numbers and an accurate clock" and the project's own memory
did not meet it. Both now use one local `now`.

## 7d. The visual layer, and what it found

Chrome driven over CDP with Node's built-in WebSocket; `sharp` does the pixel
diff. No new dependency. 12 surfaces — landing, all four instrument views, a
guide, the FAQ — at desktop, laptop and phone, light and dark, each asserting:
no console errors, no tracking tighter than -0.12em (the collapse signature),
no text under 3:1 against its composited background, nothing overflowing
sideways outside a deliberate scroller, no content out of reach on an
instrument view, and pixels within 0.35% of a committed baseline.

Two of its own checks were wrong before they were right, both found by breaking
them on purpose:

- The background reader took the first non-transparent ancestor, so a 2.5%-alpha
  black overlay on white paper read as pure black and invented contrast failures.
  Backgrounds are composited now.
- **The zero-scroll assertion could never fire.** The app sets `h-screen
  overflow-hidden`, so `documentElement.scrollHeight` is pinned to the viewport
  and content is *clipped* rather than scrolled — which is worse, because it is
  unreachable. Proved dead by rendering the daily view in a 300px viewport and
  watching the check pass. It now measures inner containers for both scrolled
  and clipped content.

That second one is Rule 4's defect exactly: Rule 4 asserts `App.jsx` contains
the strings `overflow-hidden` and `h-screen` and never measures anything, so it
has been green for the entire life of the project while telling nobody anything.
**Fourth instance of the class.**

What the layer found on its first honest run: 18 unreadable text elements
between 1.48:1 and 2.52:1 (fixed — 96 small-text colours raised), and the
instrument pushing up to 97px of the day out of reach on a short laptop.

The founder then made the requirement absolute — no scroll on either axis,
anywhere in the instrument — and it now holds across **32 combinations**: four
views at eight viewports from 1440x900 down to 320x568. Getting there exposed a
fifth instance of the class, this time in the fix rather than the gate:
**arbitrary Tailwind media variants all carry the same specificity**, so
`[@media(max-height:820px)]` and `[@media(max-height:760px)]` both matching
meant source order decided, and Tailwind emitted the wider one last. Several
density rules were dead while reading as correct — found only by measuring a
box at 120px whose only child was 20px. The tiers are non-overlapping ranges
now. The lesson generalises past CSS: **a rule that is present is not a rule
that is in effect**, and only measurement tells them apart.

## 7e. Rule-by-rule audit — 14 September 2026

Every one of the 26 rules in `scripts/qc_audit.js`, classified by what a pass can actually prove.

| Kind | Rules | What a pass means |
| :-- | :-- | :-- |
| **Effect** — measures behaviour, or a relationship between two sources | 0 (the import graph from `main.jsx` reaches every governed surface), 11 (exactly three frameworks, and the cut ones absent), 23 (no private key or retired shared secret in source), 24 (the price in `VISION.md` matches `src/`), 25 (emitted, analysed and registered events agree) | Something true about the system. |
| **Guard of a measurement** — rewritten 14 September | 4 (no scroll), 12 (sideways clipping), 16 (the 320px surface that caught the date header), 20 (keys pressed in Chrome) | That `scripts/visual_check.js` still takes the measurement. The measurement itself runs in `test:visual`. |
| **Deny by name** — fails if a named reversal returns | 1, 2, 3, 5, 7, 8, 9, 14, 17, 21, and the phrase half of 22 | That exact string is absent. A reversal spelled differently passes. **Rule 3 bans eight colour classes; every other hue passes.** |
| **Presence only** — a string or a file exists | 6, 10, 13, 15, 18, 19, and the token half of 22 | Very little. |

**Rule 18 is redundant.** It asserts that the licence, export, Patron and yearly files exist and contain certain function names. Rule 0 already asserts those same files are *reached* from `main.jsx`, which is strictly stronger — and the Patron gating Rule 18 was written to protect no longer exists.

**Rules 10, 13, 15 and 19 enforce the physical-book chrome** — the woven tag, the 3D page leaf, twelve month illustrations with the cover stage, and the embossed chassis — which P11 and `VISION.md` §13.5 reject and BR8 left unresolved. `UI_BRIEF.md` §7.3 retires them.

**Rule 20's rewrite found two live defects on its first run.** The number keys skipped Weekly — pressing 2 while looking at Weekly in second position opened Monthly, and the legend documented the gap as if it were a design. And the morning prompt stayed mounted over Weekly after a keyboard switch. The string check had been green throughout. Both were fixed on 14 September. The same pass also reported keys as dead that were only late. It slept a fixed second after each press, while switching back to Daily took up to 2.5 seconds in headless Chrome, and occasionally longer under the surfaces' emulation. The pass now runs in its own un-emulated tab and waits up to six seconds for each view, failing only when a key never arrives.

**`AGENTS.md` and `CLAUDE.md` were two identical copies of one rulebook with nothing keeping them identical** — one read by Codex and Antigravity, the other by Claude Code. `test:qc` now fails if they drift.

**The rewrite itself broke the audit.** Rule 4's old body declared `appPath`, which Rules 6 and 19 also used. Replacing the body removed the declaration; `node --check` passed, and the audit crashed with a `ReferenceError` on every run until it was found on 14 September by running the script unfiltered. `appPath` is now declared at module scope. Every rule changed here was then broken on purpose and seen to fail: the drift check, Rule 4's two guards, and Rules 12, 16 and 20.

**Recommended next:** replace Rule 3's deny-list with an allow-list (neutral, black, white and the progress classes only); fold Rule 18 into Rule 0; and give Rules 6, 10, 13, 15 and 19 the treatment Rules 4, 12, 16 and 20 received — a guard in front of a real measurement.

## 8. Deliberately not done

- **`.monogram-gold-foil` not renamed.** It renders `rgba(0,0,0,.72)` ink and
  has since the foil was removed. Renaming it would reset every person's stored
  `gold`/`blind` choice for no visual change. The name is misleading and cost
  this session ten minutes; that is cheaper than a migration.
- **Visual regression not built.** It is the only thing that would have caught
  defects 2 and 4, and it is also the most expensive layer here. Named as a
  known ceiling instead of half-built.
- **CI not added.** Worth doing, but after the gates cover the artefact — CI
  around a gate that does not look at `public/` just automates the blind spot.
