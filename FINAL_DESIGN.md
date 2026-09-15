# Decide One — governing visual design

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

Acceptance is behavioral and visual: stopwatch direction and elapsed figures
are checked in a real browser; the privacy shutter has exactly one action; the
Today section is absent; the header and sheet widths are measured; and all three
paper styles are rendered at desktop and phone sizes before release.

## Verification record

Implementation and measured results will be appended with the working checkpoint.
