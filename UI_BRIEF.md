# UI Brief — Decide One

## Approved final design — 15 September 2026

The founder approved the recovered open-book layout from the Primacy-era design
(visual reference: `screenshot_daily_verified.png`; closest runnable history:
`eaa00d7`) and requested adaptation into the current neutral theme. This decision
supersedes the flat-sheet and one-visible-side-only design instructions in older
briefs, including UI_BRIEF Appendix A, BR8/P11 visual interpretations, and prior
Rules 13/19. Do not flatten the interface or replace round bullet marks with large
square checkboxes again unless the founder explicitly changes this decision.

The final direction is an open two-page spread on desktop, a central fold, subtle
neutral paper depth, rounded paper corners, small circular completion marks with
usable invisible hit areas, and a restrained page-turn transition with reduced
motion support. At phone widths show one readable page at a time. Adapt existing
selection/time/report content to that structure; do not restore habits, reflection,
old payment claims, old branding or retired methods from the historical snapshot.
Keep QuickStart.jsx and its three-step popup content and behavior unchanged. Keep
black/white neutral colours, exactly three methods, current storage and timing,
and closure eligibility. The historical server on 5180 is a reference only; the
current source and its normal development/build commands are authoritative.

Every agent must read `FINAL_DESIGN.md` before interface edits, run the source,
artifact and visual gates, inspect both themes and narrow/populated states, and
preserve the approved geometry. Green checks are evidence only for covered states.
Do not claim that untested or failing states are complete.


**For any agent doing interface work on Decide One — ChatGPT Codex, Antigravity, Claude Code — and for the founder.**
Written 14 September 2026 from `VISION.md`, `DECISIONS.md`, `FRAMEWORKS.md` and `BRAND_BOOK.md`, and from what the code and the live site actually do, checked the same day.

**Precedence.** `VISION.md` §11–§13 outrank this brief. The code outranks every document about what is currently built. If this brief turns out to be wrong, correct it in the same commit as the change that proved it wrong.

**Before anything:** run `npm run brief`, read `AGENTS.md`, then read this file end to end. Sections 0–7 are required before you touch a component.

---

## 0. The sixty-second version

1. **It is a priority instrument — not a journal, a diary or a planner.** One page for today. The person picks a method, writes only what the method allows, gives the first line a real amount of time, and closes the day. Primary line: *"You already know what matters. This helps you choose it."*
2. **The standard is an instrument panel.** It is trusted because it is right: exact alignment, correct numbers, an accurate clock, type readable at arm's length, every state designed, zero console errors. **Ornament is a defect.**
3. **Premium means precise, never ornamental.** Craft that makes it more exact, more legible or more durable is on-brand at any level. Gold, foil, leather, stitching, woven labels, paper-texture cosplay, 3D books, spines, ribbons, glows, gradients and celebration are not.
4. **Frameworks are modes, not skins.** Top 3, Ivy Lee and the Urgent/Important Matrix each change the page's *structure and rules* — how many lines exist, which are locked, where writing may happen. (Capacity and closure are the same in every mode today — see §4.) Type, palette, grid and clock are identical in every mode.
5. **No scroll, on either axis, on any instrument view, from 320×568 to 1440×900.** Measured on every deploy. A container that clips is worse than one that scrolls.
6. **Black and white.** Colour appears only as the red / yellow / green progress marks, and only to mean progress.
7. **Nothing is added.** No new features, surfaces or settings — *"This will look the same in ten years. No features will be added."* (VISION §12.2). Redesign what exists. Remove only what §7 lists as decided; propose any other removal and wait.
8. **Green is not correct.** The gates catch specific, named failures and nothing else (§6). You still have to look — at every size, in both themes, in every state.

---

## 1. What this is, in the founder's words

> *"It is not about costly, it needs to look perfect, precise, and the product should be serious — as it is a priority instrument and not a game. All alignment should be proper, the pixels should be perfectly aligned, there should be no errors, the fonts should be readable, there should be proper space to add everything, the clock should work properly, and every small detail should be perfect."* … *"We are an instrument, not a diary."*
> — 12 September 2026, `VISION.md` §13.1

> *"They don't need to do 1000 things. They need to do 3 things better and complete it, and that is real productivity."* … *"A simple layout that does not require the user to fill everything, like other popular tools."*
> — 11 September 2026, `VISION.md` §12.1a

> *"We do not want someone to feel bad if they did not log in the tool. What matters is the day that is there when they come. If we can make one day productive for one person, that is a win."*
> — `VISION.md` §11.3

In session, 13–14 September 2026 (spelling normalised): *we are not a journal, we are an instrument* · *I need only a black and white, simple tool* · *no horizontal or vertical scroll whatsoever* · *design for someone like Steve Jobs or Elon Musk; the precision should be space-grade* · *premium, built to last, and it should solve the purpose* · *the frameworks are not just a skin but a theme that works accordingly.*

**The compass (VISION §13.2).** The pilot flies; the compass does not. It is trusted because it is right, not because it is pleasant — a compass two degrees off is worse than none, because it is believed. It is read at a glance, under load. It never flies the plane: the choosing stays the person's (P10 — the product is opinionated about *form*, never about content).

**The two tests that outrank taste:**
- *Would someone who could afford anything still choose this, because it does the one job better than anything else does?* (§12.1a)
- *Would a person who depends on instruments — and who could use anything — trust this one, and keep it?* (§13.6)

Armstrong, Jobs and Musk are an internal standard of seriousness. **Their names never appear in anything a user can see** (§13.4).

---

## 2. Which document is true

| Source | Status |
| :-- | :-- |
| `VISION.md` §11 (copy), §12.1a (brand belief), §13 (instrument standard) | Governing. The newest dated section wins any conflict. |
| `FRAMEWORKS.md` §5 and §7 | Governing for the methods, their enforcement and their attribution. |
| `BRAND_BOOK.md` | Governing for every user-facing sentence. |
| `DECISIONS.md` | Current state — with the stale rows below, amended in place on 14 September. |
| Code in `src/` and the live site | The truth about what is built. |
| Code comments that cite a decision | **Not evidence.** A comment said the leaf "scrolls (P11)"; P11 never mentions scrolling. |

**Rows in `DECISIONS.md` that no longer describe reality:**
- **BR4** *"not premium"* — superseded by §12.1a: premium is not forbidden; fluff is.
- **BR5** *"$39 once, forever"* — superseded by §11.1: free, no paid tier.
- **P8** *"no quiz"* — a single skippable morning question shipped (C3/C5), offering named conditions of the day. It never gates the page.
- **C5 / C6** *"six methods ship"* — three ship. All six morning conditions route to Top 3, the Matrix or Ivy Lee.

When a document and the code disagree: verify in `src/`, then run `npm run why "<term>"` — it searches the whole decision record, which `npm run brief` only samples.

---

## 3. The product the interface has to express

**One leaflet, two sides (P11, P12).** The **recto** is what deserves the day: the date, the method's lines, the time beside each line, the clock. The **verso** is where the time went — a report read once, at closure. Turning the sheet over *is* the day-closure gesture. The verso may never introduce objects of its own (R3): every line on it is a line the recto already decided.

**Two layers (FRAMEWORKS §1, R1).**
- **Selection** — *which things?* Exactly one method is active: Top 3, Ivy Lee, or the Urgent/Important Matrix.
- **Execution** — *when, and for how long?* It applies on top of whichever method runs: a duration per line (timeboxing, R4), the analogue clock, and the session states below. An optional *when and where* per line is decided (R5) — **check `src/` before designing around it**; do not assume it is built.

**Four views.** **Daily** is the instrument. **Weekly, Monthly and Yearly** are review surfaces that read the days. They never become places to plan more.

**The morning (C3/C5).** On an unanswered today, a single prompt asks *"What does today look like?"* and offers six conditions of the **day** — never of the person — each with a plain line saying what will happen: *There is too much on today → Then today gets three. Nothing else.* The method is not named on the prompt; it is named and credited on the page once chosen (P7). *I already know* skips it. It never blocks, and it closes the moment the person leaves today's page.

**Session states** (`src/utils/executionModel.js`): `IDLE → BREATHING` (a deliberate 3-second pause, R9) `→ RUNNING ⇄ PAUSED → FINISHED → DONE`. Duration choices: 15, 25, 45, 60, 90 and 120 minutes. **Overrun is information, never an alarm** (R8): the verso says *Past the box*; nothing turns red, scolds, or counts a failure. A laptop shut mid-session is reconciled by provenance, never guessed (R17).

**Capacity (P14).** Setting durations is a capacity check, not a stopwatch: *three tasks at three hours is nine hours, and the day has not got nine hours* — discovered at 9am rather than 6pm. The recto shows planned time against the time left in the day, beside the lines, where the decision is.

**Leaving is success (P15).** No countdown anxiety, no notifications pulling the person back, no overrun alarm. The product is built to be closed.

**Returning after a month (§11.3, fourth rule).** The person finds a clean day, not an account of their absence. **The product never infers failure from a date** — an unfinished past line is unfinished, not red. The only look back is an *offer* to carry yesterday's open lines forward (`CarryForwardModal`): once, dismissible.

**Free, and one quiet ask.** No price anywhere in `src/` (Rule 24). A support ask may appear once, at the end of a day actually closed, never blocking, quieter each time it is declined. It names what the person did — *"You closed thirty days"* — never what the product needs.

---

## 4. Frameworks are modes, not skins

Think of a watch's mode button. Same case, same face, same hands — but in stopwatch mode the buttons *do* something different, and the face shows only what that mode needs. That is the model. A framework is a set of **enforced rules** (VISION §10.4, P9: *enforced, not drawn*), and the design exists to make those rules legible at a glance.

**What a mode changes:** which lines exist · which lines accept input · order and locks · where classification happens · the empty state's one sentence.
**What a mode does not change today, verified in code on 14 September:** capacity (`computeCapacity` in `src/utils/executionModel.js` sums every session regardless of mode) and the verso (`DayReport.jsx` reads no framework). Whether they *should* read per mode — Ivy Lee's capacity counting lines in order, the Matrix's verso reporting by quadrant — is a founder decision (§13). Propose it; do not build it unasked.
**What a mode never changes:** typeface · palette · grid and spacing scale · the clock · header, navigation and chrome · motion language.

| | **Top 3** (`rule_of_3`) | **Ivy Lee** (`ivy_lee`) | **Urgent/Important Matrix** (`eisenhower`) |
| :-- | :-- | :-- | :-- |
| The day it is for | *Too much to do.* Overcommitment. | *I keep not finishing things.* Context-switching. | *Everything feels urgent.* Urgency mistaken for importance. |
| The enforced rule | **Three lines. A fourth does not exist** — absent, not disabled. | **Six lines in strict order. A line cannot start until every earlier line is done** (`isItemLocked`). | **Classification before writing.** A line can only be written *inside* a quadrant, so the sorting happens first. **Applied 15 September:** empty rows are created only after both classification answers; existing written rows remain. |
| What the design must make obvious | That three is the whole day. Order carries meaning: *01 First · 02 Next · 03 Then*. Planned time against time left. | Which line is live, and why the next is closed — stated plainly, never as a punishment. The accessible label already reads *"Priority 2 is locked until priority 1 is complete"*. | The two questions — *urgent?* *important?* — as legible axes, so a quadrant reads as an answer rather than a bucket. |
| Credit on the page once chosen (P7, FRAMEWORKS §7) | Rule of 3 — no single author | *Ivy Lee Method · 1918* — devised for Charles Schwab at Bethlehem Steel | *Distinction: Eisenhower, 1954. Matrix: Stephen Covey, 1989.* |
| Never | a fourth line, subtasks (R13), "add more" | skipping ahead, reordering to dodge the lock, red "blocked" styling | Covey's coined vocabulary — *Quadrant II*, *Big Rocks*, *First Things First* |

**Execution sits under every mode, unchanged:** duration per line, the analogue clock, the session states and capacity. Switching mode never resets or hides time already planned for lines that survive the switch.

**A known inconsistency to fix while you are here:** the Matrix quadrant tags mix two grammars — *01 Do first · Urgent*, *02 Schedule · Plan*, *03 Delegate · Offload*, *04 Eliminate · Drop*. Three tags are actions; the first is a classification. Pick one grammar and keep it inside `BRAND_BOOK.md`'s voice.

**The Today stream** (`RapidLogSection`) is not a method. It holds the day's other lines, and it is currently unbounded — which lets it quietly become where a fourth priority lives (B-23). Do not make it more prominent. Whether to bound it is the founder's call (§13).

---

## 5. Design direction — premium means precise

**Register.** An instrument panel, read under load. Typographic, monochrome, exact. The Casio F-91W is the belief behind it — function so good it outranks aspiration — not a costume for it (§12.1a).

**Words on the instrument.** The tagline *Nothing shares first.* is decided (`DECISIONS.md` N30, from the Pauli doctrine in N26): exactly one thing is first, and nothing ties with it. It appears in the morning prompt's footer. Keep it, and never "fix" it as unclear. Every other word follows `BRAND_BOOK.md`.

**What premium *is*, here:**
- One type scale with few sizes, used consistently. Size and weight carry hierarchy; colour never does.
- Hairline rules instead of boxes, and one border weight across the whole product.
- Numbers as the most exact thing on the page: tabular, aligned, never shifting width while a clock runs.
- Optical alignment wherever mathematical alignment reads as wrong (§13.3.1).
- Instant response: feedback within 100ms, no layout shift, no spinner for data that lives on the device.
- A crisp focus state on every control. Touch targets of 44px wherever the density tier allows, never below 36px.
- Motion in the few-hundred-millisecond range, using the existing easing tokens `--ease-out`, `--ease-out-strong` and `--ease-in-out` in `src/index.css`.
- Sharp at 1× and 2×. Icons from one set (`lucide-react`) at one stroke weight.

**Typography.**
- The Helvetica Neue stack everywhere. `tailwind.config.js` maps every family to it; `font-mono` fails the build (Rule 1).
- **Every figure uses tabular numerals** — times, durations, dates, counts.
- **Readable at real size, at arm's length** (§13.3.4). Today the instrument uses 9–10px text in many places. The standard for this work: **no text below 11px**, and 11px only for tracked uppercase labels; body and input text at 13px or above. Where a dense calendar grid cannot hold 11px at 320px wide, show less in the cell — never make the type smaller.
- Negative tracking belongs to display sizes only. Tighter than −0.12em collapses glyphs, and the visual gate fails it.

**Colour.**
- Ink on paper. Dark mode is the exact inverse, not a different design.
- Colour carries meaning only: `.progress-{ink,bg,border}-{red,yellow,green}` in `src/index.css` (Rule 3). Nothing else is ever coloured.
- Small grey text is at least `text-neutral-500` on white (4.74:1). `neutral-400` is 2.52:1, and it was unreadable in 96 places until 13 September.

**Space.**
- The 24px cadence at full density: `background-size: 24px 24px` and `p-6` on the notebook (Rule 6).
- Below 820px of viewport height the instrument steps down through density tiers (§6.3). Half-steps of 12px are permitted there; arbitrary values are not.
- Space sufficient, not merely tight (§13.3.5): if a line cannot hold what a person will type, it is unfinished.

**Motion.** Only to explain a change of state — a line unlocking, the sheet turning to the verso, the clock starting after *BREATHING*. Everything honours `prefers-reduced-motion`. Nothing loops for attention.

**The clock.** Analogue, and it is *the* clock (R11): no modes, no switcher, no digital alternative. It must be right to the second (§13.3.3). The hands are driven by the wall clock, never by an accumulating counter. A face renders duration as space, which is why it stays.

**Sound.** Present and muteable (`playSound`, `settings.isMuted`). Quiet, short, and never required to understand anything.

**What premium is not, here — every item below has been built before and removed or rejected:**
gold or amber in any form · foil · leather grain · stitching · woven fabric labels · deckled or textured paper as decoration · a book cover, spine, ribbon or page curl · monthly illustrations · studio lighting · glassmorphism · gradients, glows and stacked drop shadows · confetti, streaks, scores, badges or any celebration · coloured inks.

---

## 6. What fails the build — and what does not

Four gates run inside `npm run deploy`. **Know exactly what each one looks at**, because a passing gate is evidence only about that.

| Gate | Reads | Catches | Does **not** catch |
| :-- | :-- | :-- | :-- |
| `npm run test:qc` — `scripts/qc_audit.js` (26 rules) and `scripts/check_content.js` | `src/`, `content/`, `index.html`, `AGENTS.md`/`CLAUDE.md` | Decisions reversed **by name**: `font-mono`, trademark method names, a fourth framework, a price in `src/`, the telemetry contract, licence secrets, the Ivy Lee lock tokens, prose rules on content pages, the two rulebooks drifting apart | Anything visual. Anything not spelled the way the rule expects. **Rule 3 bans only eight blue/purple/cyan/pink classes** — an amber or emerald class passes. |
| `npm run test:artifact` — `scripts/qc_artifact.js` | `dist/`, `public/`, `worker/` | Broken references, orphaned assets, the home page failing to link a content section, a frozen service-worker cache name, `#root`-scoped critical CSS, Worker syntax | Pixels. |
| `npm run test:visual` — `scripts/visual_check.js` | 23 surfaces rendered in real Chrome at a frozen time, plus a keyboard pass | Console errors · tracking below −0.12em · text under 3:1 · overflow · sideways clipping without an ellipsis · instrument content scrolled or clipped · keys 1–4 and T routing · the morning prompt covering another view · pixel drift over 0.35% against `tests/baselines/` | **Updated 15 September:** written Top 3, six-line Ivy Lee, running, overrun, paused and closed-day verso states are also rendered at 320×568. Full Matrix, carry-forward and month-old return still need coverage. Text size, 24px alignment, dark mode on the instrument, correctness of numbers and tone are not checked. |
| `npm run verify:live` | One bundle hash on decideone.app | That the deploy landed | Whether it is correct. |

### 6.1 How the rules were built, and why that matters to you

Most of the 26 rules check that a string is present or absent. That makes them good at catching a named decision being reversed and blind to everything else. Four were rewritten on 14 September because they asserted things the site was visibly not doing — Rule 4 was green for the life of the project while the day scrolled out of reach. The full classification is in `ARCHITECTURE_AUDIT.md` §7e.

**Three rules still enforce the physical-book chrome:** Rule 10 (`woven-fabric-tag`), Rule 13 (the 3D page leaf) and Rule 19 (`.embossed-notebook`). Rule 15 was rewritten on 14 September to guard the cover's absence. They encode decisions that §7 retires. Retire them by the procedure in §7 — never by weakening them to get a pass.

### 6.2 Rules of engagement with the gates

- **Never weaken a gate to make a change pass.** If a governed decision genuinely changes, update `DECISIONS.md` (and `VISION.md`, if copy or brand is involved) with the reason, *then* change the rule — in the same commit.
- **Break every rule you add or change, once, on purpose,** and watch it fail. Two of five checks written on 13 September could not fire until this was done.
- **Pixel baselines are evidence, not an obstacle.** A redesign changes every baseline. Open each `tests/baselines/*.changed.png`, confirm the change is the one you intended, then run `npm run test:visual -- --update`, and say in the commit which surfaces changed and why.
- **A known-red gate teaches every agent to ignore it.** Do not add a surface that fails; fix it, then add it.
- **Extend the visual gate to the states you design** (§8). Seed `localStorage` key `DECIDEONE_STUDIO_V1` with `Page.addScriptToEvaluateOnNewDocument` before navigating, so three written lines, a running timer, an Ivy Lee lock or a closed day render as surfaces with baselines.

### 6.3 No scroll — the measured contract

Instrument views are checked at eight viewports: 1440×900, 1366×768, 1366×700, 1366×640, 1280×600, 390×844, 360×740 and 320×568. On 13 September all 32 view × viewport combinations were clean. The gate renders `daily-small` (1280×600), `daily-tiny` and `weekly-tiny` (320×568) on every deploy. `daily-prompt-tiny` holds the morning question open at 320×568; every other daily surface dismisses it, so the instrument itself is what gets baselined.

They hold through density tiers chosen by **viewport height, written as non-overlapping ranges**:

| Tier | Height | What steps down |
| :-- | :-- | :-- |
| full | above 820px | nothing |
| compact | 761–820px | execution panel and notebook padding; clock 88 → 60px; the flexible spacer collapses |
| tight | 760px and below | clock removed; priority rows 48 → 36px; section header 36 → 28px; gaps and padding tighten again |
| tiny | 620px and below | the morning prompt tightens leading and padding — keeping both the condition and what it does |

There is also a width step at 400px: the perspective buttons and method icons tighten, and the date header drops from 18px to 15px so the full date fits at 320px.

**Why the ranges must not overlap:** arbitrary Tailwind media variants all carry the same specificity. When `max-height:820px` and `max-height:760px` both match, source order decides — and Tailwind emitted the wider one last, silently killing rules that read correctly in the source. Write the compact tier as `[@media(max-height:820px)_and_(min-height:761px)]`.

A redesign may replace these tiers with a better system. It may not reintroduce scroll or clipping at any of the eight viewports.

### 6.4 Running the visual gate

- **It needs Google Chrome or Chromium** (the paths it looks for are at the top of `scripts/visual_check.js`) and **Node 22 or newer**, for the built-in `WebSocket`.
- **It takes about twenty minutes** for 16 surfaces under software WebGL. Run it in the background and watch its progress lines; a quiet run is not a hung one. Every call to Chrome fails after 30 seconds, so a stuck page fails loudly instead of hanging.
- **Time is frozen** at 09:30 on Monday 14 September 2026, Asia/Kolkata, with the timezone pinned. The instrument shows today's date and the time left in the day, so an unfrozen render changes every day and on every machine.
- **Baselines are per platform**, in `tests/baselines/<platform>/`. Fonts rasterise differently on macOS and Linux, so each platform records its own baselines on first run. The measurements gate on every platform; pixel comparison only applies within one.

---

## 7. Already decided — apply these

These are founder decisions. Apply them; do not re-open them.

1. **Gold is gone, in every form.** Removed on the founder's order on 11 September: the notebook's 24K foil gradient became an ink deboss (`npm run why "gold foil"`). The class `.monogram-gold-foil` still *says* gold and renders `rgba(0,0,0,.72)` ink. Rename it if you touch it; never restyle it towards gold.
2. **Black and white only** (the founder, 13 September). The coloured ink options — `oxblood`, `konpeki` and `sepia` in `src/index.css` and the settings menu — contradict it. Remove them and their menu entries, keep `carbon`, and migrate any stored non-carbon `inkColor` to `carbon` on load so nobody's page breaks. Any paper tone other than neutral goes the same way. **Applied 14 September:** the ink and tone CSS, the two menu rows and the landing demo's tone and ink pickers are gone; `normaliseAppearance` in `src/utils/appearance.js` pins `inkColor` to `carbon` and `paperTone` to `white` on load and on both imports, and Rule 3 runs it and bans the retired names.
3. **An instrument, not a book.** VISION §13.2 (*diary and instrument are different objects*), §13.5 (*a digital instrument rather than a physical book*), P11 (*no spine, no cover, no ribbon, no month illustrations*), and the founder in session: *"we are not a journal, we are an instrument."* **This resolves the open conflict BR8 toward the instrument register.** In your first commit on it:
   - Record the resolution in `DECISIONS.md` rows **BR8** and **B-15**, quoting the statements above and dating it.
   - Retire the book chrome P11 already lists: the notebook cover and its open/close stage (`InteractiveNotebookCover` and `NotebookCover.jsx`, the `.stage-book-*` classes, the `showCover` state and the `?view=cover` URL, `handleToggleCover`, the `C` shortcut and its legend entry), the woven tag, the 3D page curl when stepping between days, the embossed-leather chassis, and the twelve month illustrations (`src/data/monthIllustrations.jsx`).
   - Keep the leaflet's *structure* — recto, verso, and the turn as the closure gesture. A flat, exact turn is the instrument form of it.
   - Rewrite Rules 10, 13, 15 and 19 to guard the new truth — for example, that no book chrome is reachable from `main.jsx` — and break each once to prove it fires. Also update **Rule 0**, whose governed-surface list names `data/monthIllustrations.jsx`, and **Rule 6**, which finds the notebook by its `embossed-notebook` class: rename the class and the rule together. Rule 14's `pendingTurnRef` requirement stays only if the remaining turn still needs it.
   - The landing page must still depict the actual product (§13.5): update `landing/JournalScene.jsx`, `landing/JournalDemo.jsx` and the renders in `public/renders/` so nobody believes a paper notebook is for sale.
   - **Applied in part, 14 September:** the cover (with `showCover`, the C key, the menu and Tools entries and its sounds) and `src/data/monthIllustrations.jsx` are gone, including from the privacy shutter; `?view=cover` opens daily through `src/utils/viewParam.js`; BR8, B-15 and C6 are amended. Rule 0 fails if either module is reached from `main.jsx`, and Rule 15 executes the view mapping. The woven tag and chassis were also removed on 14 September. The day-step curl was replaced by an immediate date update and a flat 160ms fade on 15 September.
4. **No celebration.** **Applied 14 September:** `canvas-confetti` and its call sites were removed; Rule 26 guards their absence. Confetti is congratulation, which `BRAND_BOOK.md` §4 (*closure is observational, never congratulatory*) and R12 (no gamified visualisers) exclude. Find what triggers it and remove it; a verso line like *"4h 10m against 4h 30m planned."* is the whole reward.
5. **There is no landing page** (the founder, 12 September; confirmed 15 September): `/` opens the instrument for everyone, first visit included. A first visit gets a short quick start that explains the page, then the morning question; a returning person opens straight to today. The marketing page, its 3D book scene and its renders are retired. The static guides, methods and FAQ pages, `?view=legal`, `?view=methods` and the `#prerender` summary in `index.html` stay. This replaces "first visits get the landing page" (shipped 13 September). **Arrival applied 15 September:** the marketing route, 3D scene, demo, studio renders and Three.js are removed. `/` and retired links open daily; the three-step quick start is skipped after completion or existing written history. Header links reach guides, methods, FAQ and legal information. Static-template redesign and the social capture remain.
6. **Number keys match the visible order** (fixed 14 September): 1 Daily · 2 Weekly · 3 Monthly · 4 Yearly. Weekly previously had no key at all.

---

## 8. Every state, designed

An unhandled state is a broken instrument, not an edge case (§13.3.6). For each surface, design and verify:

| State | What must be true |
| :-- | :-- |
| First visit, empty day | One sentence of instruction — encouraging, never jolly. The morning prompt appears once. |
| Morning prompt open | Readable at 320×568 with every condition *and* its effect line. Never covers another view or another day. |
| One line / three lines / six lines (Ivy Lee) | Every mode at its minimum and maximum, with nothing truncated mid-word. |
| A locked line (Ivy Lee) | Legible as *not yet*, never as *wrong*. |
| No durations set | Capacity says so plainly; nothing implies a mistake. |
| Over capacity | Stated as information — *that is 1h 20m more than the day has left* — never red. |
| Breathing / running / paused | The clock and the live line are the loudest things on the page; everything else steps back. |
| Past the box (overrun) | Observational. No alarm, no colour change, no counter of failure. |
| All done / the turn / the verso | Planned against actual, stated as fact: *"Planned 6h 10m. Spent 5h 40m."* |
| A past day | Unfinished lines are unfinished — never red, never struck through by the software. |
| Back after a month | A clean today; at most a dismissible offer to carry lines forward. |
| Dark mode | The exact inverse; contrast at 3:1 or better everywhere. |
| Reduced motion | Every transition has a still equivalent. |
| Keyboard only | Every action reachable; focus visible; the legend (`?`) matches the code. |
| Screen reader | Lines, locks, timers and the clock have accurate labels. |
| 320×568 to 1440×900 | No scroll, no clipping, no overflow (§6.3). |

**Defects already visible in the current baselines** (14 September), for the redesign to fix:
- The Top 3 header shows *0/3 done* with the zero in **red** on an untouched morning — the software marking a day as not done, against VISION §11.3's fourth rule.
- The execution panel's hint, *Write the task first, then enter the minutes on the same line.*, breaks onto a second line holding the single word *line.* at 1440×900.
- At 320px wide the priority placeholders are cut mid-word (*What deserves your da…* without the ellipsis), because an input clips its own text — which the sideways-clipping check does not see.
- View-switch speed is unmeasured. A 2.5-second return to Daily was once reported, but it came from a headless Chrome that was crashing and short of CPU, so it proves nothing either way. Measure it in a visible browser; §5 asks for feedback within 100ms.

---

## 9. Learnings — what went wrong here, so it does not happen again

Every item below shipped, or nearly shipped, in September 2026.

1. **Green is not correct.** Five separate times a check asserted that something existed rather than that it worked — Rules 0, 4, 18 and 25, and a set of density rules that were present in the source and dead in the browser. *A rule that is present is not a rule that is in effect.* Only measurement tells them apart.
2. **An ID selector in `index.html` restyled the whole app.** Critical CSS written as `#root h2` outranked every class in the bundle and forced an 86px heading to 18px with −4px tracking. Inline critical CSS styles `#prerender` only — `createRoot` destroys it on mount. `test:artifact` now fails any `#root` descendant selector.
3. **Overlapping media ranges fail silently** (§6.3).
4. **Measure scroll on inner containers.** `h-screen overflow-hidden` pins the document to the viewport, so a document-level check can never see content being clipped inside it.
5. **Composite alpha before measuring contrast.** A 2.5%-alpha black overlay on white paper is near-white, not black.
6. **Count calendar days, not milliseconds.** `Math.floor(ms / 86400000)` put *"Day 181"* on the 182nd day of the year in New York after the clocks changed, and was right in India, which has no daylight saving — which is why nobody saw it. Divide the difference between local midnights, and round.
7. **Test keyboard routing by pressing keys.** A handler can contain every shortcut and still route wrongly. Weekly had no key, and the legend documented the gap as if it were a design.
8. **A dialog belongs to the view that opened it.** The morning prompt stayed mounted when the person switched to Weekly by keyboard, covering a surface it has nothing to do with.
9. **A fixed sleep cannot tell a slow effect from a lost one — and a timeout cannot tell a hung page from a dead browser.** The keyboard pass first reported keys as dead that were only late, then "hung". The hang was headless Chrome crashing on macOS whenever CDP injected a key (a stack overflow in its menu key-equivalent code), and the crash reports sat in `~/Library/Logs/DiagnosticReports` while four theories were tested — the privacy frost, the renderer, audio, CPU. Wait for the effect with a ceiling, look for a crash before diagnosing a stall, and keep only one experiment running at a time: two at once contaminated each other here.
10. **The service worker's cache name is derived by the build** (`scripts/build_content.js`). A hand-maintained name never changed for months, and visitors were served the first commit's gold icon. Cache-first applies to `/assets/*` only.
11. **Brand lives in pixels too.** A fallback render carried the old product name, *PRIMACY*, on the notebook. No text rule can see inside an image; review renders by eye.
12. **Links inside the `#root` prerender reach crawlers only.** The home page linked none of 41 guides for a human until real links were added to the React page.
13. **Comments and old documents mislead.** *"It scrolls (P11)"* cited a decision that never said it. `LANDING_PROTOTYPE.md` — which `AGENTS.md` told every agent to trust — described a product that no longer existed. Verify in `src/`.
14. **The record usually already has the answer.** The gold removal sat about 1,300 lines deep in `DECISION_LOG.md` while `brief` showed five entries. Run `npm run why "<term>"` before re-deriving anything.
15. **`AGENTS.md` and `CLAUDE.md` are two copies of one rulebook** — one read by Codex and Antigravity, the other by Claude Code. Change both identically; `test:qc` now fails if they drift.
16. **The founder is often the only detector for a visual defect.** Four of five defects found on 13 September were found by the founder opening the site. Look at your work at every viewport, in both themes, before calling it done.
17. **Run the gate, not just the parser.** Rewriting Rule 4 deleted a variable that Rules 6 and 19 still used. `node --check` passed, and the whole audit crashed with a `ReferenceError` that a filtered `grep` hid. After any change to a gate script, run it unfiltered and read its exit code — and no rule body may declare a variable that another rule uses.
18. **A baseline of a dialog is not a baseline of the instrument.** Until 14 September every daily surface was a screenshot of the morning question covering a blurred page, because the journal was empty and it was today. Check what a surface actually shows before trusting its pixels.
19. **Anything time-based in a screenshot fails tomorrow.** The date header and the time left in the day made every baseline recorded on the 13th fail on the 14th. Freeze time for rendering, and pin the timezone.

---

## 10. Inventory — what exists, so nothing breaks silently

**The instrument** (`src/App.jsx` routes by `?view=`):
- `HeaderToolbar.jsx` — search, the wordmark (returns to the overview), tools; perspective tabs Daily · Weekly · Monthly · Yearly; method icons on Daily.
- Recto (`SpreadPages.jsx`) — `DateHeader.jsx` · `ProductivityFrameworks.jsx` (the three modes) · `ExecutionLayer.jsx` with `InlineTimeControl.jsx` and `AnalogueClock.jsx` · `RapidLogSection.jsx` (the Today stream) · the footer *"Three choices. One clear order."*
- Verso — `DayReport.jsx`: *Where the time went*.
- Reviews — `WeeklyReviewSpread.jsx`, `MonthlyLogSpread.jsx` (with `MonthPicker.jsx`), `YearlyViewSpread.jsx`.
- Morning and closure — `DayConditionPrompt.jsx` (with `src/data/dayConditions.js`), `CarryForwardModal.jsx`, `ExecutiveClosureRitualModal.jsx`.
- Secondary — `UnifiedMenuModal.jsx` (settings, export, print), `OmniSearchModal.jsx`, `QuickLegendModal.jsx`, `ExecutiveDecisionLogModal.jsx`, `ExecutiveScratchpadModal.jsx`, `ExecutiveVoiceHUD.jsx` (dictation), `ExecutivePrivacyOverlay.jsx` with `usePrivacyShutter.js` (reacts to the window losing focus and to a three-minute idle timeout; ⌘⇧L locks), `PatronUpgradeModal.jsx`.
- Book chrome retired by §7.3 on 14 September — `NotebookCover.jsx` / `InteractiveNotebookCover` and `src/data/monthIllustrations.jsx` are deleted; `?view=cover` opens daily (`src/utils/viewParam.js`).

**Keyboard** (`App.jsx`; the legend is `QuickLegendModal.jsx`): ← / H and → / L step the day · 1 Daily · 2 Weekly · 3 Monthly · 4 Yearly · T today · M menu · / or ⌘K search · ? legend · ⌘N scratchpad · ⌘D decision log · ⌘⇧C closure · ⌘⇧V dictation · ⌘⇧L lock · Esc closes. Shortcuts never fire while focus is in an input.

**Storage.** `localStorage` key `DECIDEONE_STUDIO_V1`: `dailyLogs`, `monthlyLogs`, `weeklyReviews`, `decisions`, `closureLogs`, `habits` (legacy — habits were cut by P2) and `settings` (`paperStyle` plain/dots/square, `paperTone` and `inkColor` (kept for old backups, but always `white` and `carbon`: `normaliseAppearance` pins them on load and on import), `darkMode`, `isMuted`, `viewMode`). Data never leaves the device. Keys under earlier product names are migrated on read; never delete them.

**Separate from the instrument.** The 45 static pages built from `content/` by `scripts/build_content.js`; legal and methods views remain. The marketing components and Three.js were removed 15 September; `QuickStart.jsx` explains the real daily page. Their copy is governed by VISION §11 and `BRAND_BOOK.md`.

**Stack.** React 18 · Vite 6 · Tailwind 3.4 · `lucide-react` icons · served as a Cloudflare Worker. Add no dependency that a few lines of code or the platform can replace.

---

## 11. How to work in this repository

```bash
npm run brief                  # always first: who is editing, git state, whether live is this build
npm run why "<term>"           # before deciding anything the record may already have decided
npm run build && npm run test:qc && npm run test:artifact && npm run test:visual
npm run log "what you did and why"
npm run deploy                 # the only way to publish; runs every gate, then verifies
```

- **Commit at every working state.** Agents here get cut off mid-task, and uncommitted work in a shared tree is how work is lost.
- **Stage files by name.** Never `git add -A` or `git commit -a`.
- **Never run `wrangler deploy` directly.**
- If `verify:live` says DIFFERENT, run it again before diagnosing — the apex HTML is edge-cached.
- If another agent may be editing at the same time, run `npm run tree` first, or work in a separate worktree (`AGENTS.md`, *When two agents must work at once*).

---

## 12. Done means

- [ ] Every instrument view holds one screen at all eight viewports, in both themes — no scroll, no clipping, no overflow.
- [ ] Every state in §8 is designed, and has been looked at rather than only measured.
- [ ] Each framework reads as a mode: its rule is visible and enforced; type, palette, grid and clock are unchanged across modes.
- [ ] No text below 11px; every figure tabular; every grey at 3:1 or better.
- [ ] Nothing coloured except progress; no gold, texture, book chrome or celebration anywhere.
- [ ] The clock is right to the second; every number shown is correct, including across a daylight-saving change.
- [ ] Zero console errors in any state.
- [ ] BR8 recorded as resolved; Rules 0, 6, 10, 13, 15 and 19 updated, and each changed rule broken once on purpose.
- [ ] The visual gate covers the populated states you designed, with reviewed baselines.
- [ ] The direct instrument arrival, quick start, static information pages and social capture match the redesigned instrument.
- [ ] `npm run deploy` green; `verify:live` reports MATCH; `DECISION_LOG.md` says what changed and why.

---

## 13. Only the founder decides these — ask, do not assume

- **B-23 — the Today stream is unbounded.** Should it be capped, so it cannot become priority four?
- **The secondary surfaces** — decision log, scratchpad, voice dictation, search, the privacy shutter. Keep, demote behind the menu, or remove? Do not promote them.
- **The support ask.** `PatronUpgradeModal` and *Become a Patron* in the menu now grant nothing. VISION §11.1 places the ask at the end of a closed day, not in a menu.
- **R16 — a definition of done per line.** Undecided; do not build it.
- **Landing copy.** The hero's *FREE FOREVER* eyebrow sits uneasily with `BRAND_BOOK.md` §6 (*do not say "free forever!"*). Copy changes go through VISION §11 first.
- **The recto footer** reads *Three choices. One clear order.*, while VISION §11.1's approved alternate is *Three methods. One clear order.* Confirm which is meant before changing either.
- Anything else that would add a surface, a setting, a field or a feature.

---

## Appendix A — the kick-off prompt

Paste this as the first message to the agent doing the design work (ChatGPT Codex). Written 15 September 2026 against commit 8b9756e; where it and older sections of this brief disagree, this prompt is newer.

```text
You are the lead product designer and front-end engineer for Decide One — a free, private, one-page priority instrument (React 18, Vite 6, Tailwind 3.4, served as a Cloudflare Worker at decideone.app). The repository is your working directory. Claude Code and Antigravity also work in it, so follow its rules exactly. You own every design change from here.

MISSION
Make the instrument premium through exactness, never ornament — built to look the same in ten years, and genuinely better at its one job: helping a person choose what deserves today, give it real time, and close the day. The standing test: someone who could afford anything would still choose this, because it does the one job better than anything else. The founder: "We are an instrument, not a diary." "The frameworks are not just a skin but a theme that works accordingly."

READ FIRST, IN THIS ORDER
1. `npm run brief` (always first), then `npm run tree` — if another agent wrote in the last five minutes, wait.
2. AGENTS.md in full.
3. UI_BRIEF.md in full — the vision, constraints, what the gates catch and miss, decisions, learnings. Where it points to VISION.md §11–§13, FRAMEWORKS.md §5/§7, BRAND_BOOK.md or DECISIONS.md, read those sections. Before re-deriving anything: `npm run why "<term>"`. Where a document and the code disagree, the code is the truth.
4. `npm run build && npm run test:qc && npm run test:artifact` must be green before you change anything (they are, at commit 8b9756e). Then run `npm run test:visual` (needs Google Chrome and Node 22+; several minutes; run one at a time). It is EXPECTED to report pixel changes on first run — see "State of the gates". If Chrome is unavailable where you run, say so; do not skip it and do not deploy without it.
5. Run `npm run dev` and look at `/`, `?view=daily`, `weekly`, `monthly`, `yearly` at 1440×900, 1366×768 and 390×844, light and dark. List every defect against UI_BRIEF §5 and §8 before writing code.

FOUNDER DECISIONS THAT OVERRIDE ANYTHING OLDER
- There is no marketing landing page. `/` opens the instrument for everyone (Part 1).
- No `?giftFrom=` links are in circulation; the greeting went with the cover and stays gone.
- Black and white only. Colour appears solely as the red/yellow/green progress marks, and only to mean progress.

This brief has two parts that share one design system and every rule below. PART 1 is the landing — what a person arrives at. PART 2 is the journal — the instrument itself. Do Part 1's decision record and removal first, then design both parts from the same tokens.

PART 1 — THE LANDING: WHAT A VISITOR ARRIVES AT
There is no marketing landing page any more. `/` opens the instrument for everyone, first visit included. The founder (12 September): "instead of sharing the landing page why cannot we just show directly the journal so they can start straight away... we don't want to waste their time by reading this. We can highlight the features across, but then having them directly [start] with a few guidance steps is like a quick start... pop-ups that explain how to use, ask them their state, and then they can start."
   So: a first visit opens the daily instrument with a short quick start — a few steps that say what this is and how the page works — then the existing morning question (`DayConditionPrompt`, "What does today look like?"), then the person starts. A returning person opens straight to today. The quick start is the one new surface you are asked to build; keep it to a few steps, skippable, keyboard-operable, shown once, fitting 320×568 without scroll.
   Record this BEFORE the code, in one commit: amend DECISIONS.md B-39 (it still says decideone.app serves "the landing page and the instrument") — IDs are duplicated in that file, so find the row by line AND content. UI_BRIEF §7.5 already carries the decision.
   What goes: `src/components/MarketingLandingPage.jsx`; `src/components/landing/` (JournalScene.jsx — the 3D book, 801 lines; JournalDemo.jsx; landing.css, 2,687 lines); the `three` dependency (only JournalScene uses it); `public/renders/decideone-studio-d1*.webp`; the menu's "Tour" button (`onOpenLanding` in UnifiedMenuModal.jsx); the `landing-page-active` / `.pm-landing` rules in src/index.css; the landing hash list and hash-sync effect in App.jsx.
   What changes with it, all in src/App.jsx unless named: the initial view (drop the `hasWrittenBefore()` gate and the hash branch — first-visit detection moves to the quick start); `src/utils/viewParam.js` — `landing` becomes a retired view that opens `daily`, and Rule 15 in scripts/qc_audit.js executes the view list including `landing`, so update both together and break the rule once; the URL-sync effect; `usePrivacyShutter({ enabled })`; the scroll-lock effect; the keyboard handler's landing guard; `LegalPages` and `MethodsPage` onBack (to daily); the `web_vitals` entry logic (TELEMETRY_SPEC §0a scopes site measurement to marketing routes — keep only legal/methods, and note it in TELEMETRY_SPEC).
   What stays: `index.html`'s `#prerender` crawlable summary (VISION §11.1 copy and links — search engines and AI crawlers read it; createRoot removes it on mount); the static `/guides/`, `/methods/`, `/faq/` pages; `?view=legal` and `?view=methods`. `scripts/qc_artifact.js` fails unless the app bundle links every content section — link them from inside the instrument (quick start and/or menu). The social image `public/renders/decideone-social.jpg` (index.html:15 and :22, scripts/build_content.js:38) shows the old book: replace it with a capture of the redesigned instrument once the design is final, and update its alt text through VISION §11.
   Quick-start copy: only VISION §11.1 (the statement and its approved alternates) and the method one-liners already in index.html `#prerender`. Any other sentence goes into VISION §11 first, with the reason. Never call the product a journal, diary or planner in the interface.
   Designing the arrival:
   - The first screen IS the product: today's page, ready to write on, with the quick start over it. It must look finished in the first second — no loading shell flashing, no layout shift when the quick start appears, the correct date and a running clock immediately.
   - The quick start is explanation, not onboarding theatre. A few steps (three is the working number), one idea each: (1) what this is — VISION §11.1's primary line and its second sentence; (2) how the page works — bring what is on your mind into view, pick the method that fits the day (Top 3, Ivy Lee, the Urgent/Important Matrix, using the one-liners in index.html `#prerender`), give the first one real time, close the day — pointing at the real controls on the page rather than describing them in the abstract; (3) the promise — one page, nothing leaves your device, free, no account — then hand over to the morning question. Next, Back and Skip; Esc skips; focus is trapped and restored; position shown as a figure (1/3). No mascots, illustrations, animation loops or progress rewards.
   - People also land on the static guides, methods and FAQ pages that `scripts/build_content.js` builds from `content/` (45 pages; its `STYLE` constant and `render()` templates, roughly lines 324–530; every page links "Back to Decide One" to `/`). Restyle that template to the same tokens and type so arriving from search feels like the same instrument. Do not change their words — `scripts/check_content.js` and VISION §11 govern them. Keep `?view=legal` and `?view=methods` (LegalPages.jsx, MethodsPage.jsx) reachable and styled the same; the legal URL must stay stable for the payment provider.
   - The document head in index.html — title, description, og/twitter meta and the `#prerender` summary — stays truthful to the instrument, and the summary keeps its links to the methods, guides and FAQ.

ALREADY DONE — DO NOT REDO (commits 577af4f..8b9756e, not yet deployed)
- Confetti removed; `canvas-confetti` uninstalled; Rule 26 keeps celebration packages out.
- Coloured inks and paper tones removed; `src/utils/appearance.js` `normaliseAppearance` pins carbon on white on load and on both imports; Rule 3 executes it and bans the retired names.
- Notebook cover, `showCover`, the C shortcut, cover sounds and the twelve month illustrations removed; `?view=cover` opens daily; BR8 resolved toward the instrument in DECISIONS.md.
- Woven "DECIDE ONE" tag removed; Rule 10 inverted.
- The sheet is flat: `.instrument-sheet` is one hairline, no shadow or chassis; Rules 6 and 19 share that anchor.
UI_BRIEF §7.1–§7.4 still describe some of these as to-do; mark them applied when you next edit the brief.

PART 2 — THE JOURNAL: THE INSTRUMENT ITSELF
1. The 3D page curl between days. 66 references remain — `flipState`, `PageTurnLeaf`, `flippingbook-stage`, `mobile-fold-turn`, `preserve-3d`, `rotateY`, `kindle-turn`, `bifold` — in src/App.jsx, SpreadPages.jsx, YearlyViewSpread.jsx and src/index.css. Replace with a flat, exact day step that honours `prefers-reduced-motion`. Keep the leaflet's structure — recto, verso, and the turn as the closure gesture — and every B-19, P11 and P12 condition. Rules 13 and 14 still require the "FlippingBook 3D page leaf": rewrite them for the flat step and break each once. The snapper ResizeObserver in App.jsx depends on `[activeView]`; decide its deps with evidence.
2. Colour. About 60 chromatic Tailwind classes remain in OmniSearchModal, ExecutivePrivacyOverlay, ExecutiveDecisionLogModal, UnifiedMenuModal, ExecutiveClosureRitualModal, ExecutiveVoiceHUD, PatronUpgradeModal and ExecutiveScratchpadModal; the daily count renders a red "0/3"; ExecutiveVoiceHUD has a looping `animate-ping` dot (§5: nothing loops for attention); src/index.css has an olive-tinted dark header; index.html uses `bg-[#E1E1E6]` and `#3f3f46`; UnifiedMenuModal still says "gold spine glow". Neutralise — recolour only; keeping, demoting or removing those surfaces is the founder's call. Then turn Rule 3 from a deny list into an allow-list (black/white/neutral/transparent/current, one chroma threshold for literals, index.html in scope, only the `.progress-*` blocks exempt), green on arrival.
3. The founder's first name is the hardcoded default owner name in src/utils/archivalExport.js, src/utils/weeklyBriefingPDF.js, ExecutivePrivacyOverlay.jsx, UnifiedMenuModal.jsx and ExecutiveClosureRitualModal.jsx. Default to empty and make every render site read correctly when empty.
4. The premium redesign itself: a design system as tokens in one place (type scale, spacing on the 24px cadence, neutral colour tokens, motion), used by both parts. Then the daily recto (the header, date and day-of-year, the method's lines, the execution layer's time controls, the clock, the footer) and the verso (the day report and the closure turn); each of the three modes, so the rule of the mode is visible in the page itself; weekly, monthly and yearly; and the secondary surfaces (menu, search, decision log, scratchpad, dictation HUD, privacy shutter, closure and carry-forward dialogs) restyled to the same system without changing what they do. Light and dark are one design, not two.
5. UI_BRIEF §8 defects: the execution hint's one-word widow at 1440×900; priority placeholders clipped mid-word at 320px; DayReport says "The day is done" on an already-closed day; six fixed 48px Ivy Lee rows unmeasured at 1366×768 and 1280×600; view-switch speed unmeasured — measure it in a visible browser against §5's 100ms.
6. Gate weaknesses found in review — fix while you are in those rules: Rule 3's normaliseAppearance call-site check is fooled by a trailing `//` comment; Rule 15's App.jsx wiring check is a text grep that an unused call satisfies; Rule 10 is a name grep; Rule 26 reads src imports only (add a dist check to qc_artifact.js); Rule 18 is redundant with Rule 0. Add seeded visual surfaces for the populated states you design: three lines written, an Ivy Lee lock, a running timer, overrun, the verso, a past day, the quick start.

NON-NEGOTIABLES
- No vertical or horizontal scroll and no clipped content on any instrument view or the quick start at 1440×900, 1366×768, 1366×700, 1366×640, 1280×600, 390×844, 360×740 and 320×568.
- Black and white only. No ornament: no gold, foil, leather, stitching, woven labels, decorative paper texture, covers, spines, ribbons, page curls, illustrations, glass, gradients, glows, confetti, streaks, scores or badges.
- The Helvetica Neue stack only (Rule 1). Tabular numerals for every figure. No text below 11px. Every grey at 3:1 contrast or better.
- Exactly three methods, and they are MODES, not skins: Top 3 (three lines, no fourth), Ivy Lee (six in strict order, each locked until the previous is done — `isItemLocked`), the Urgent/Important Matrix (classify before writing). Capacity (`src/utils/executionModel.js` computeCapacity) and closure (DayReport.jsx) are identical in every mode today, and the Matrix's default rows can be written without classifying. Make each mode's rule visible and enforced; if capacity or closure should differ per mode, put it in your plan and wait for the founder. Typography, palette, grid and clock never change between modes.
- The analogue clock is the only clock and is right to the second. Every number shown is correct.
- Never judge: no red on past days, no failure states; overrun is information. Copy follows VISION §11 and BRAND_BOOK.md. Never use the method names FRAMEWORKS.md §6.3 restricts. Never name real people in the interface.
- Zero console errors in any state. Every state in UI_BRIEF §8 designed, including empty and returning-after-a-month.
- Add no dependency that a few lines or the platform can replace. Add no feature, setting or field beyond the quick start.

STATE OF THE GATES (as of 8b9756e)
- Green: `npm run build`, `npm run test:qc` (Rule 0 and Rules 1–26 plus content gates), `npm run test:artifact`.
- `npm run test:visual` will report pixel changes: the baselines in tests/baselines/darwin/ predate the removals (woven tag, chassis shadow, the FAQ's deleted supporter paragraph, the landing demo's removed pickers). Open every `*.changed.png` next to its baseline, confirm each difference is intended, and record with `npm run test:visual -- --update` in the same commit as the change that caused it, naming each surface and why. Baselines are per platform: on Linux the directory is empty and the first run records instead of comparing — then review the recorded images by eye before trusting them.
- The visual gate renders 16 surfaces in headless Chrome with time frozen at 2026-09-14 09:30 Asia/Kolkata. Its keyboard pass dispatches key events inside the page, because CDP key injection crashes headless Chrome on macOS — keep it that way. `landing-desktop` and `landing-mobile` must become first-visit `/` surfaces showing the quick start; the daily surfaces and the keyboard pass currently dismiss only the morning question ("I already know") and must also skip the quick start. Rules 4, 12, 16 and 20 check for literals in scripts/visual_check.js (`fixed: true`, `unreachable`, `clipped_x`, `320, h: 568`, `dispatchEvent(new KeyboardEvent(type`, `waitForView(expected)`); keep them.
- Never weaken a gate to make a change pass. If a decision changes, change DECISIONS.md or VISION.md first, then the rule, in one commit. Break every rule you add or change once, on purpose, and watch it fail.

HOW TO WORK
- Plan first: a short plan (screens, components, tokens, order of work) recorded with `npm run log "..."`. Suggested order: decision records → landing removal and quick start → flat day step → tokens → instrument restyle → secondary surfaces neutral → Rule 3 allow-list and gate fixes → seeded surfaces and baselines → docs → deploy.
- Commit at every working state; you may be cut off at any time. Stage files by name — never `git add -A` or `git commit -a`. `npm run log "..."` with each commit, saying what changed and why.
- Before each commit: `npm run build && npm run test:qc` (and `npm run test:artifact` when files are added or removed).
- Do not merge the branches `claude/great-snyder-b287a3` (it re-adds confetti) or `claude/inspiring-satoshi-f0fb27`; they are the founder's to decide.
- Publish only with `npm run deploy` (audit, build, artefact check, visual gate, publish, verify). Never run `wrangler deploy` directly. If verify reports DIFFERENT, run `npm run verify:live` again before diagnosing — the edge caches the home page for a few minutes.
- Update UI_BRIEF.md, DECISIONS.md, WORK_REMAINING.md, ARCHITECTURE_AUDIT.md §7e and LANDING_PROTOTYPE.md (retire it) to match what you shipped. AGENTS.md and CLAUDE.md must stay byte-identical (Rule 0 checks).

ONLY THE FOUNDER DECIDES — ASK, DO NOT ASSUME
- Everything in UI_BRIEF §13: the Today stream cap (B-23); keeping, demoting or removing the decision log, scratchpad, voice dictation, search and privacy shutter; the support ask — PatronUpgradeModal still advertises "Page & Ink Appearance", a feature that no longer exists; R16; the recto footer wording ("Three choices" vs "Three methods").
- Any replacement for the deleted FAQ supporter paragraph.
- The patron-chime and singing-bowl sounds; the score, streak and status code; the Trophy icon; the weekly PDF heading.
- Changing the Top 3 count from x/3 to x/written.
- A Turn Over control at 640px and wider, so the verso is reachable on desktop.
- Whether the owner-name setting survives.
- Archiving the ~33 legacy root documents.
- Anything else that adds a surface, setting, field or feature.

DONE MEANS
Every box in UI_BRIEF §12 ticked; Part 1 and Part 2 shipped; `npm run deploy` green; `npm run verify:live` reports MATCH.

REPORT BACK
The design system you set; every surface and state you changed, with before-and-after screenshots at 1440×900 and 390×844; every rule you rewrote and how you proved it fires; anything UI_BRIEF.md got wrong, with your correction; and every open question for the founder.
```


## Layout checkpoint — 15 September 2026

The resumed pass preserves the inherited neutral/type changes, short placeholders,
shared Ivy Lee lock, Matrix classification gate and six-week yearly calendars.
The header and sheet now use the shared neutral tokens and flat controls. At short
heights the sheet snaps to 12px half-steps; full-height cadence stays 24px. Only
Daily reserves the mobile side-switch bar. The small yearly cards place their
open action beside the month; a small-card overflow check covers the previously
missed clipped actions. Minute fields and start/pause controls have 36px height.

The idle face reads labelled local time; a paused session keeps its own clock
and elapsed figure. With no planned time the page uses one empty-clock instruction,
including after priorities have been written. Empty Today retains its count and
Add line control without a duplicate empty-state sentence.

**Not a completed redesign or a release.** The Matrix's 16 possible tasks and the
unbounded Today/carry-forward lists cannot fit together at readable sizes on the
smallest screen. The founder has been asked to choose compact paging, list scroll,
or a pass scoped to short lists. No cap or paging has been introduced. The opt-in
`npm run test:visual -- --layout` diagnostic includes the unresolved populated
Matrix cases; they are not claimed as passing default regression surfaces.
Rules 3, 10, 15, 18 and 26 have been repaired: neutral colour allow-list with parsed migration calls; rendered decorated-brand-label measurement; the actual initial-view function executed; archive/licence exports; and celebration signatures in built JavaScript. Social capture and the remaining populated/dialog measurements from Appendix A remain.
