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
- Profile the 3D hero on mid-range mobile hardware. The scene is lazy-loaded, but the Three.js asset remains the largest optional chunk.

## The instrument does not hold one screen on a short laptop

Measured 13 September 2026 by `npm run test:visual`, which is the first thing
here that could see it. At 1366 wide, the daily column pushes content out of
reach below roughly 740px of viewport height:

| Viewport height | Out of reach |
|---:|---:|
| 900, 820, 800, 768 | none |
| 720 | 25px |
| 700 | 25px |
| 660 | 73px |
| 640 | 97px |

A 1366x768 laptop gives about 660px of viewport once browser chrome is taken,
so this is a common real size, not an edge case. Two steps are already in:
below 820px the execution panel tightens and the flexible spacer collapses;
below 740px the clock steps from 88px to 60px. That fixed 768 and above and
took 720 from 77px to 25px.

**Closing the rest means reducing the height of the three priority rows**, which
is the core content and a design decision rather than a bug fix. It needs the
founder's call on what the instrument looks like on a short screen before
anyone changes it.

These heights are deliberately NOT in the visual gate's surface list yet. A gate
that is known-red teaches every agent to ignore it, which is the failure this
whole layer exists to prevent. Add `{ id: 'daily-short', url: '/?view=daily',
vp: { w: 1366, h: 660 }, fixed: true }` to `scripts/visual_check.js` the moment
it passes.
