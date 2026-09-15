# Work Remaining

Updated 12 September 2026. Item 3 closed; the hosting move is no longer outstanding.

## Before Public Launch

1. Provide the five production legal facts in `.env.production`: legal entity, registered address, support email, jurisdiction, and effective date. `npm run test:launch` blocks release while any are missing.
2. Have the legal pages and method naming reviewed by qualified counsel. The repository contains a practical first-pass review and method attributions, not professional legal advice.
3. ~~Choose the production path documented in `DEPLOY.md`.~~ **Done, 11 September 2026.** `decideone.app` moved to the Cloudflare Worker; the apex CNAME was recorded in `DEPLOY.md` and deleted. `npm run deploy` is the whole publish, and `verify:live` runs as its step 4 rather than being a thing to remember.

## Before telemetry is switched on

`VITE_ENABLE_TELEMETRY` is unset, so the client is compiled without it and
production D1 holds zero rows. Everything below is inert until that changes, and
must be settled before it does — each one produces a number a person would read
and believe.

1. **Nothing reads production D1 except `npm run metrics`.** The Worker writes to
   D1; `server/src/analyticsService.js` (712 lines) reads a local SQLite file at
   `server/data/telemetry.sqlite` that production never touches. `npm run metrics`
   was written on 12 September to close the gap and is deliberately small — counts
   and distributions, no derived metrics. **The open decision is what happens to
   the Node analytics service**: point it at D1, or retire it. Leaving it as-is
   means a dashboard that shows seeded development rows while looking authoritative,
   which is `VISION.md` §13's compass two degrees off.
2. **The two schemas have diverged.** `server/src/db.js` has `device_type` and
   `end_time`; `worker/schema.sql` has `device_class`, `received_at`, `country`,
   `region`, `city`, the `utm_*` fields and `entry_view`. `analyticsService.js`
   reads none of the production-only columns. Whatever is decided in (1) has to
   reconcile these.
3. **The Node service increments `total_events` on a session row that may not
   exist yet**, so the count runs short. The column was removed from D1 entirely
   on 12 September because it is derivable; the dev schema still has it. Same
   decision, not yet applied here.

## Deliberately Excluded

- Payment checkout and webhook handling. The interface states that checkout is not connected and contains no simulated purchase path.

## Post-Launch Measurement

- Test the first-use flow with five people who have not seen the product.
- Measure whether they can explain the product, choose a method, enter priorities, and begin the first item without help.
- The 3D hero and Three.js dependency were removed on 15 September; no hero profiling remains.

## The instrument holds one screen — resolved 13 September 2026

The founder's instruction was absolute: no horizontal or vertical scroll
anywhere in the instrument. Measured across four views and eight viewports —
1440x900, 1366x768, 1366x700, 1366x640, 1280x600, 390x844, 360x740, 320x568 —
**all 32 combinations are clean**: nothing scrolls, nothing is clipped.

Three densities, chosen by viewport height and deliberately non-overlapping:

| Tier | Range | What changes |
| :--- | :--- | :--- |
| full | above 820px | as designed |
| compact | 761–820px | execution panel and notebook padding step down; the clock goes 88px to 60px; the flexible spacer collapses |
| tight | 760px and below | the clock goes; priority rows 48px to 36px, header 36px to 28px; block gaps and notebook padding tighten again |
| tiny | 620px and below | the day-condition dialog tightens leading and padding — keeping both the label and what it does, because dropping the explanation would make the choice harder |

Narrow widths get their own step at 400px: the perspective buttons and method
icons tighten, and the date header drops from 18px to 15px so the full date
still fits at 320px rather than being cut mid-word.

**The ranges must stay non-overlapping.** Arbitrary media variants all have the
same specificity, so when `max-height:820px` and `max-height:760px` both match,
source order decides and Tailwind's order is not narrowest-last. That silently
killed several of these rules while they looked correct in the source. This is
why the compact tier is written `(max-height:820px) and (min-height:761px)`.

Locked in by `npm run test:visual`, which now renders `daily-small` (1280x600),
`daily-tiny` and `weekly-tiny` (320x568) on every deploy.



## Layout follow-through — amended 16 September 2026

The unbounded Today stream was removed by founder decision on 16 September, so it
can no longer become a hidden fourth priority. Resolve small-screen navigation
for populated Matrix tasks, then extend coverage to all secondary dialogs and
returning after a month.
Retain the existing founder-only choices in UI_BRIEF Appendix A. The colour
allow-list and named gate repairs are implemented and mutation-tested. Social
capture, complete populated-state verification and guarded deployment remain
outstanding. Earlier zero-scroll claims above describe the empty-state
measurements of 13 September, not every possible populated list.
