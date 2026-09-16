# Decide One — governing visual design

> **Typography correction, 16 September 2026:** one semantic Inter hierarchy
> governs the whole instrument: display, page title, section title, body,
> control, label and metadata. `DECIDE ONE` is always uppercase. Local one-off
> font sizes, casing or tracking may not create a competing hierarchy.

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

## Founder correction — 16 September 2026

The open two-page geometry above remains approved. The following interaction and
content decisions supersede every older reference to an analogue wall clock,
countdown, planned-minutes field, capacity panel, or unbounded Today stream:

1. **The selected framework is the complete daily input surface.** Top 3 has
   exactly three rows, Ivy Lee has exactly six ordered rows, and the
   Urgent/Important Matrix has its classified rows. The separate Today/rapid-log
   section is removed; it created a hidden fourth-priority path.
2. **Time means elapsed focus on a task.** Each written framework row has one
   stopwatch control. It starts at `00:00`, advances clockwise, pauses and
   resumes, and records actual focus time. The interface shows no local wall
   time, countdown, planned time, remaining time, end-of-day arithmetic, or
   overtime judgement. Existing stored timing data remains readable.
3. **The right page is the same work seen in time.** It shows the active
   stopwatch and the actual elapsed time recorded against framework rows. It
   introduces no independent task list or planning field.
4. **The privacy shutter has one truthful action.** It identifies `DECIDE ONE`,
   says that the page is hidden, and offers one `Show My Page` button. It makes
   no vault, encryption, biometric, password, security-status, or focus claim.
5. **The header is one fixed-width system.** Its two rows share the book's
   960px width and do not change width between views. The centered wordmark is
   `DECIDE ONE` in capitals. Search and Menu occupy equal side columns.
6. **Paper choice must be visible.** Dot Grid and Square Grid repeat across the
   whole sheet on the 24px cadence beneath content; Plain is white without a
   pattern. No later surface rule may erase the selected pattern.

**Menu refinement, 16 September 2026:** keep the same measured two-row header
geometry. The first row has Search, the centred name and Menu; the second has
four time perspectives. The menu is one compact panel: the three direct method
choices and three labelled paper-grid choices appear first. Work Actions,
preferences, backup and information are lower disclosures. The old
four category tabs are retired, and methods are not duplicated in the header.

Acceptance is behavioral and visual: stopwatch direction and elapsed figures
are checked in a real browser; the privacy shutter has exactly one action; the
Today section is absent; the header and sheet widths are measured; and all three
paper styles are rendered at desktop and phone sizes before release.

## Design baseline — verified 16 September 2026

Checked in the code at `0912ed8`. decideone.app serves this build (`assets/index-Cr16pIku.js`, `npm run verify:live` MATCH on 16 September).

### Arrival
- `/` opens the daily instrument for everyone (DECISIONS B-39). The marketing page, its Three.js scene, demo, CSS and studio renders are deleted; `three` is no longer a dependency. `?view=landing` and `?view=cover` open daily; `?view=legal` and `?view=methods` remain.
- A first visit shows `src/components/QuickStart.jsx`, three steps: *You already know what matters. This helps you choose it.* · *Three methods. One clear order.* (the three methods in one line each; choose at the top of the page, start the stopwatch beside the first line, Turn Over to close the day) · *One page. Nothing leaves your device.* (free, no account; links to Guides, Methods, Questions). Skip, Back, Next/Start; Escape skips; focus is trapped and restored. It shows while `DECIDEONE_QUICK_START_V1` is unset and nothing has been written (`src/utils/quickStart.js`), then the morning question follows. Rule 19 pins the file by hash, because the founder approved it unchanged.

### Header and menu
- `HeaderToolbar.jsx` is two rows on the book's 960px width (`--instrument-width`). Row one: Search · `DECIDE ONE` in capitals (opens Daily) · Menu, in equal side columns. Row two: Daily · Weekly · Monthly · Yearly (Day · Week · Month · Year when narrow). No method icons in the header.
- `UnifiedMenuModal.jsx` is one compact panel. First the three methods as direct choices and the three paper styles, then closed disclosures: Work Actions; Preferences (including the evening closure reminder); Backup & Export; Guides & Legal (Quick Guide, Guides, Questions, Methods & Attributions, Terms, Privacy & Refunds). The four category tabs are retired (Rule 8). Closed disclosures stay out of the Tab order.

### The book
- `src/book.css` over `src/tokens.css`. At 768px and wider: an open two-page spread in one sheet, a 48px gutter (24px when the height is 760px or less), a central 1px fold with a faint shadow either side, 16px paper corners and a stacked neutral paper edge (`--paper-depth`). On phones: one page at a time with 12px corners; Turn Over shows the second page.
- Stepping between days changes the date immediately (`stepDate`), then the page settles over 280ms from a 12° turn; with reduced motion it is still (Rule 13).
- Completion marks are 16px circles with a 36px invisible hit area. The visual gate measures size, roundness, hit area, corners, the fold and the side-by-side pages in Chrome (Rule 19).
- Paper is Dot Grid, Square Grid or Plain, chosen in the menu. A grid repeats across the whole sheet on the 24px cadence beneath the content; Plain has no pattern.

### Left page — what deserves the day
- The chosen method is the whole daily input: Top 3 has three rows, Ivy Lee six in strict order with each locked until the previous is done, and the Urgent/Important Matrix classifies before writing. The Today stream (`RapidLogSection`, `BulletItem`) and the natural-language task parser are deleted; stored rapid-log data is kept but not presented as daily work (B-23).
- Each written row has one stopwatch control. The footer reads *Three Choices. One Clear Order.*

### Right page — the same work seen in time
- `FocusStopwatch.jsx` is a classical dial: both hands advance clockwise from `00:00`, the readout is mm:ss (h:mm:ss past an hour), and it redraws every 100ms while running, under a *Focus Time* heading.
- `DayReport.jsx` reads *Nothing Decided Yet*, then *Where The Time Went* (actual elapsed time per row), then *Day Closed*, with a note when time was estimated after the page was left open.
- There is no wall clock, countdown, planned-minutes field, remaining time, capacity arithmetic or overtime message (P13). `AnalogueClock.jsx` is deleted. Stored planned durations stay readable.
- The turn closes the day only when the B-19/P12 conditions hold: today, written work, once, and no running or breathing session (Rule 14 executes them).

### Privacy shutter
- `ExecutivePrivacyOverlay.jsx`: a lock, `DECIDE ONE`, *Your page is hidden.* and one button, *Show My Page*. No vault, encryption, biometric, password or security-status claim.

### Type, colour and motion
- Inter Variable, self-hosted from `public/fonts/` with its licence, replaced Helvetica on 15 September. One hierarchy, as tokens: display 40/44, page title 20/24, section title 15/24, body 14/24, control 13/18, label 11/16, metadata 11/16. Every Tailwind font family maps to Inter (Rule 1).
- Neutral only. Light: ink `#171717`, muted `#737373`, paper `#fff`, canvas `#ededed`, rule `#d4d4d4`. Dark: `#f5f5f5`, `#a3a3a3`, `#171717`, `#0a0a0a`, `#404040`. Rule 3 is an allow-list with a chroma limit of zero (`scripts/style_contract.js`); only the red/yellow/green progress classes carry colour.
- Motion: one 280ms step with shared easing tokens.

### Review views and secondary surfaces
- Weekly has a corrected empty record and larger phone controls, and fits 320px. Monthly is a familiar variable-week calendar with 44px controls; at 320×568 the calendar scrolls inside itself while its event field stays visible — the one scroll exception, while Daily stays no-scroll. Yearly shows all six week rows.
- Search, the decision log (headed *DECISION SPACE*), scratchpad, dictation HUD, and the closure and carry-forward dialogs use the neutral tokens and Inter; what they do is unchanged, pending the founder. The owner name defaults to empty.

### Information pages and sharing
- The static guides, methods and FAQ pages (`scripts/build_content.js`) use the same tokens, and guides gained an *Open Decide One* link at the top.
- The share image is `public/renders/decideone-social.png`, a 1440×900 capture of the instrument, replacing the book render.

## How it got here — 14 to 16 September

| Commit | Date | What changed | Why |
| :--- | :--- | :--- | :--- |
| `577af4f`–`8b9756e` | 14–15 Sep | Confetti, coloured inks and paper tones, the cover and month illustrations and the woven tag removed; the sheet flattened | UI_BRIEF §7 removals |
| `3431d7c` | 15 Sep | Codex hand-off prompt (UI_BRIEF Appendix A) | Founder: all design work to Codex |
| `ed72ae2`, `df85386` | 15 Sep | Direct arrival and the quick start; marketing page, Three.js and renders deleted | Founder, 12 and 15 September (B-39) |
| `f22633e` | 15 Sep | The 3D leaf replaced by an immediate flat day step | Codex brief |
| `4ee0ccc` | 15 Sep | Neutral tokens, readable type, compact rows, classify-first Matrix, shared Ivy Lee lock, empty owner default, square checkboxes, seeded state surfaces | Codex design pass |
| `64650b3` | 15 Sep | The founder **rejected** the flat result and the square checkboxes, and approved the recovered open-book layout (reference `screenshot_daily_verified.png`, history `eaa00d7`); this file written | Founder approval |
| `c5b3a00` | 15 Sep | The book layout built (`book.css`); Monthly calendar and its 320px exception; Weekly empty record; guide link; truthful share image | Recovering the approved design |
| `ee74534`, `7994095` | 15–16 Sep | One sectioned header menu; Inter adopted; stale lock-screen copy removed; deployed 16 September 00:21 | Founder |
| `47ea797` | 16 Sep | The founder's correction recorded before code | Founder |
| `4b5227b` | 16 Sep | Inter hierarchy unified; analogue clock and planned time replaced by the elapsed stopwatch; Today stream removed; one-action privacy shutter; compact navigation | Founder correction |
| `0912ed8` | 16 Sep | Compact menu with methods and paper grids first; duplicate header method icons removed; menu focus order; report footer fit | Founder menu refinement |

## What holds it

- **Source rules:** Rule 1 (Inter), Rule 3 (neutral allow-list), Rule 8 (compact menu), Rule 13 (immediate day step, book transition, reduced motion), Rule 14 (closure conditions, executed), Rule 15 (direct arrival, executed), Rule 19 (book geometry measured in Chrome, the quick start's hash, and AGENTS/CLAUDE/UI_BRIEF pointing here), Rule 22 (elapsed stopwatch), Rule 26 (no celebration, with a built-bundle check in `qc_artifact.js`).
- **Visual gate** (`npm run test:visual`): 27 surfaces plus nine seeded states at 320×568 (written, Ivy Lee, running, overrun, paused, closed, Matrix, long Matrix and Matrix report) — the arrival with its quick start, Daily at five sizes and both grids, the menu (desktop, tiny, dark tiny), the privacy shutter, Weekly/Monthly/Yearly at desktop, phone and tiny, a guide in both themes, the FAQ and the morning question. `--layout` sweeps eight sizes × two themes × four views plus nine populated states; `--review` opens seven secondary surfaces in both themes. Baselines are held in `tests/baselines/darwin/`.
- Green checks cover only the states they render. Populated Matrix lists, 28-task lists and their paged time report are now in the default gate as well as the `--layout` sweep. Every page is traversed and its task identities and row bounds are checked.

## Still open

- The left-page footer says *Three Choices*; VISION §11.1's approved alternate says *Three methods*.
- `PatronUpgradeModal` still lists *Page & Ink Appearance*; the weekly PDF heading still reads *DAILY VICTORY & EVENING REFLECTIONS ANTHOLOGY*; the `patron-chime` and `singing-bowl` sounds remain. Founder decisions.
- The secondary surfaces — decision log, scratchpad, dictation, search, privacy shutter — keep, demote or remove. Founder decision.
- Unmerged branches with worktrees: `claude/great-snyder-b287a3` (re-adds confetti) and `claude/inspiring-satoshi-f0fb27`.
- Untracked and uncommitted: `output/` (the 15 September design checkpoint and browser captures), `.playwright-cli/` and `screenshot_v3_overview.png`.

## Older text this file supersedes

Where these still say otherwise, this file wins:

- DECISIONS **P11** (single leaflet, one side visible), **B-12** (desktop spread gone), **BR8** and **B-15** (the chrome stays retired; the book geometry returned), and **B-6, B-7, B-8, B-13, B-35** (capacity, planned minutes, the analogue clock). Each row carries a dated note pointing here.
- UI_BRIEF §3–§4 (duration per line, the analogue clock, capacity), §7.3 (a flat turn), §8 (capacity and planned-time states), §10 (AnalogueClock, RapidLogSection, BulletItem), §13 B-23 (resolved) and Appendix A (the 15 September prompt).
- TELEMETRY_SPEC's *"Planned 6h 10m. Spent 5h 40m."* example and its planned-against-spent proof; ARCHITECTURE_AUDIT's note that Rules 6 and 19 anchor a flat sheet.

## Matrix paging — founder approval, 16 September 2026

The founder chose compact Previous/Next paging for long Matrix lists on small screens. Size pages to the space available, retain all quadrant assignments and entries, reveal newly classified entries, and keep the same work reachable in the time report. Never silently cap or discard stored entries to make the page fit. Preserve the approved book, current stopwatch and initial popup.

## Final refinement — 16 September 2026

Use the current source, not the historical 5180 preview. The book geometry,
Inter hierarchy, stopwatch and compact menu above remain the governing design.
`QuickStart.jsx` is unchanged by this refinement and remains hash-pinned.

- Matrix pages adapt to the actual space after headers, the stopwatch and footers.
  Small circular marks and 40px task rows stay readable. Previous/Next and
  “Page X of Y” appear only when necessary. Quadrant headings repeat on split
  pages. Every stored entry remains reachable, including older oversized lists.
- Classification still precedes entry. Adding reveals and focuses the new task.
  Editing, completing or deleting an empty row uses its original identity/index,
  never its position on the visible page. A full quadrant no longer silently
  ignores an Add action. An empty Matrix reports zero written tasks accurately.
- The Matrix time report uses the same paging principle and totals all tasks,
  including those on other pages. Paging during the start delay cannot stop a
  session: the shared execution panel owns that transition.
- Phones use the short month plus day and full year so the date and all date
  navigation controls fit together. The full date remains available as a title.
  The icon-only Menu button keeps an explicit accessible name.
- The closure dialog keeps every existing task action and its optional note.
  Short-screen spacing is compact; duplicate reassurance/instruction text was
  removed. Its carry-forward, closure and storage behavior is unchanged.
- The share-image description no longer claims planned-time controls exist.

These choices supersede the older Matrix-overflow exception. Do not restore a
silent item cap, list scrolling, small text, flattened paper or square marks to
make a viewport pass. Preserve the first-visit popup unless the founder explicitly
changes it. Baseline changes require visible review, not automatic acceptance.

Verification results are recorded below when the final run completes. This
refinement is local until explicitly deployed; the earlier live-build record
above does not refer to these changes.


## Mobile refinement — 16 September 2026, founder screenshot review

Preserve the desktop spread. On phones, retain a single readable book page,
use the dynamic viewport height, and keep Search/Menu as labelled accessible
icons around the centred DECIDE ONE name. The recovered short date remains.
At heights above 620px, task rows are 48px and stopwatch/page-turn buttons have
44px targets; the shortest phone retains the compact density.

The focus panel shows its elapsed readout once, below the dial. On return after
an interrupted session, the estimated-time question and two actions replace the
redundant paused dial until answered. Timing calculations are unchanged.

Close The Day uses ruled task rows instead of nested cards on phones. Each
existing triage action exposes its selected state, the optional note has an
associated label, and the full-width closing action stays outside the scroll
body. The initial popup, methods, stored data and desktop book are unchanged.
