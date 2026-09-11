# Telemetry — what to measure, and what must never be measured

> **Status:** specification, 11 September 2026. Nothing here is built beyond
> §2. This is the brief an agent works from.
>
> It exists because B-37 made the product free and deferred the price to
> "whatever usage shows". That only works if usage is actually recorded, and
> today it is not — the database holds 54 seeded users whose longest tenure is
> eight days.

---

## 0. The one rule that shapes everything

**There are two systems here, not one. They have different rules, and merging
them is how a privacy-first product ships surveillance by accident.**

| | **System A — the site** | **System B — the instrument** |
| :--- | :--- | :--- |
| Who | Visitors on `decideone.app` who have not started | People using the app |
| What is on screen | Marketing copy the founder wrote | **What the person wrote about their own day** |
| Governing promise | None. Normal web analytics apply | `VISION.md` §11.1 — *nothing leaves your device* |
| Heatmaps | **Never** (§0b) | **Never** |
| Session replay | **Never** (§0b) | **Never** |
| Geography, referrer, campaign | Yes | Country only, and only with consent |
| Default | On | **Off. Opt-in. Absence of an answer is not consent** |

A heatmap records where a cursor went. On a landing page that is a design
signal. On the daily page that is a recording of someone's priorities being
typed. The technology is identical; the meaning is not — and since one origin
serves both (§0a), the only safe answer is neither. See §0b.

**Every requirement below is assigned to A or B. If a requirement cannot be
placed, it does not get built until it can.**

### 0a. One origin — decided 12 September 2026

**`decideone.app` serves both. There is no separate host for the app, and there
will not be one.** The founder chose a single site deliberately; this section
records what that costs, so the price is paid knowingly rather than discovered.

**The A/B split above is a rule about surfaces, not about origins.** Anything
loaded on `decideone.app` is loaded everywhere on `decideone.app` — including
the page where a person writes their priorities. So:

1. **No third-party script may be allowed in the CSP. Ever.** Not for the
   landing page, not "only for marketing". Allowing an origin allows it in the
   instrument too, and `a third-party script in the app is a third party
   reading the journal` (§1, rule 3). This is why Cloudflare's Real User
   Monitoring was turned off rather than permitted: it was giving accurate Core
   Web Vitals for free, and it still could not be allowed.
2. **Site measurement must be first-party and route-scoped.** Whatever measures
   the landing page must be code this repository owns, mounted on landing routes
   and never on `?view=daily` or any instrument view. Heatmaps and session
   replay were the obvious candidates and have been cut outright — see §0b.
3. **Performance metrics are now ours to build.** §3.2's LCP, INP, CLS and TTFB
   no longer arrive free from the edge. They come from `PerformanceObserver` in
   first-party code, reported through the existing telemetry pipeline, on
   landing routes.

**What a second origin would have bought**, recorded because it will be proposed
again: `app.decideone.app` would have let the marketing host run full
third-party analytics while the instrument origin stayed clean. It was
considered and declined on 12 September in favour of one site. Reopening it is a
founder decision, not an implementation detail.

### 0b. Heatmaps and session replay are cut — 12 September 2026

**Not deprioritised. Removed.** Neither is to be built, on either surface, and a
proposal to add one is a change to this section rather than a ticket.

**Three reasons, in the order that decided it:**

1. **They cost page weight on the thing the founder is already unhappy with.**
   The entry bundle was 739KB raw and 230KB gzipped on 12 September; halving it
   was the day's most valuable performance work. `VISION.md` §13.3 asks the
   instrument to be fast before it is anything else. Adding tracking script to a
   page whose load time is the live complaint is the wrong trade, and no
   measurement is worth making the product slower to obtain.
2. **The exit-section metric answers the same question for free.** §3.2 already
   records which section was last visible before a visitor left. That is *where
   we lose people* in one number, computed from an IntersectionObserver the page
   needs anyway. A heatmap would render the same answer as a picture and charge
   for it in kilobytes.
3. **One origin makes them permanently risky.** Under §0a the landing page and
   the instrument share `decideone.app`. A replay or heatmap script that is
   ever mis-scoped — by a refactor, a route change, or an agent who does not
   read this file — records a person writing their priorities. The failure is
   silent, total, and exactly what this document exists to prevent. The safest
   version of that script is the one that does not exist.

**What replaces them**, and is enough: section dwell, scroll-depth milestones,
exit section, CTA clicks by id, and rage/dead clicks. All first-party, all a few
lines, all in §3.2.

---

---

## 1. What is forbidden, stated before what is wanted

These are not preferences. Each is load-bearing for a claim already published
on the live site or in the Terms.

1. **No journal content leaves the device.** Not the text, not a hash of it,
   not its length, not a word count, not an embedding, not a "topic". Event
   properties carry counts and enumerations, never content.
2. **No heatmap, scroll-map or session replay inside the instrument.**
3. **No third-party analytics SDK in the app bundle.** No Google Analytics, no
   Segment, no Hotjar, no Clarity, no PostHog cloud. Every byte of telemetry
   goes to first-party infrastructure the founder controls. A third-party
   script in the app is a third party reading the journal.
4. **No raw IP storage.** Derive country server-side, discard the address in the
   same request. Never write it to a row.
5. **No cross-device or cross-site identity.** No fingerprinting, no cookie
   syncing, no email hashing.
6. **Opt-in stays opt-in.** `VITE_ENABLE_TELEMETRY` at build time *and* stored
   consent on the device. Default off. Silence is not consent. Changing this is
   a `DECISIONS.md` reversal, not a config edit.
7. **Aggregates published to the site must be k-anonymous.** No figure derived
   from fewer than 100 people goes on the landing page.

> **The Linux comparison cuts this way, not the other.** Linux distributions
> that added telemetry — Ubuntu's Amazon lens, Audacity's 2021 policy — met
> revolts that cost more than the data was worth. The projects trusted for
> decades ship *less* measurement than their commercial peers, not more. If
> Decide One is to be the Linux of productivity tools, restraint inside the app
> is the position, not a compromise against it.

---

## 2. What already exists

Do not rebuild these. Verified in the tree on 11 September 2026.

**App events (14):** `archive_gate_hit`, `day_closed`, `day_condition_selected`,
`day_condition_skipped`, `decision_logged`, `dictation_completed`,
`framework_selected`, `framework_task_added`, `habit_created`, `habit_toggled`,
`modal_abandoned`, `rapid_log_created`, `reflection_saved`, `vault_exported`.

**SDK captures automatically:** click targets and rage-click detection,
`window.onerror`, visibility changes, `pagehide` flush, an offline queue that
drains on reconnect, surface transitions, cognitive hesitation (first-keypress
latency), task triage.

**Server analytics (12 methods):** `getOverview`, `getFeatures`, `getFunnels`,
`getDropoffsAndGaps`, `getRetention`, `getLiveEvents`, `getPathfinderJourneys`,
`getCircadianMetrics`, `getTaskDebtMetrics`, `getCognitiveHesitationMetrics`,
`getAnomalies`, `getExperimentResults`.

**Known defects, to fix before trusting any output:**
- `getCircadianMetrics` buckets by `getUTCHours()` — morning and evening are
  wrong for every user outside UTC, including every Indian one, in a product
  designed to be opened first thing. *(Task in flight.)*
- `getFunnels` tests step membership without ordering — a user who did step 4
  before step 3 counts as converted.
- Identity is a `localStorage` key. Cleared site data reads as churn.
  `install_date` now exists to distinguish a reset; wire an `id_reset_suspected`
  event when a fresh id appears on a device that already holds app data.

**The gap, stated plainly:** there is no System A at all. Nothing measures the
landing page. Every question about traffic, source, geography or page behaviour
is currently unanswerable.

---

## 3. System A — the site

Visitors, not users. Build this first; it is unblocked by every constraint
above and it answers the question the free strategy depends on: *where do people
come from, and what makes them start?*

### 3.1 Acquisition — where they came from

| Field | Notes |
| :--- | :--- |
| `referrer_host` | Host only, never the full URL — a referring path can be a private page |
| `utm_source/medium/campaign/content` | Whatever the link carried |
| `country`, `region`, `city_tier` | Derived from IP server-side, IP discarded in the same request |
| `language`, `timezone_offset` | For scheduling and localisation decisions |
| `device_class`, `os`, `browser`, `viewport` | Buckets, not versions to three decimals |
| `is_return_visitor` | First-party cookie, site origin only |
| `landing_path`, `entry_section` | Where they arrived |

### 3.2 Behaviour — what they did on the page

- **Section dwell**: seconds visible per `<section id>` (`overview`, `highlights`,
  `approach`, `design`, `craft`, `perspectives`, `devices`, `privacy`, `access`,
  `faq`) via IntersectionObserver. Answers *which section is doing the work and
  which is being skipped.*
- **Scroll depth**: 25/50/75/90/100% milestones with time to reach each.
- **Exit section**: the last section visible before leaving. **This is the single
  most valuable number on the site** — it names where you lose people.
- **Interaction**: CTA clicks by id, FAQ items opened, 3D scene interactions,
  video/animation play or pause, nav use.
- **Rage clicks and dead clicks**: something looks interactive and is not.
- ~~Heatmaps~~ — **cut, see §0b.** Exit section below answers the same question without the script.
- **Performance**: LCP, INP, CLS, TTFB per page and per country. A slow site in
  India is a reach problem disguised as a conversion problem.

### 3.3 Conversion

The only conversion that matters now is **site → first day closed**. Not
signup, not download — there is neither.

```
visit → scrolled past hero → reached #access → clicked Start
      → app first open → first task written → first day closed
```

Every step timestamped. Report time-to-first-close as a distribution, not a
mean — the mean will lie about a bimodal population.

### 3.4 Experiments

`getExperimentResults` already exists; give it a real assignment layer.

- Deterministic bucketing by visitor id, sticky across visits.
- One primary metric declared **before** the test starts, in the test record.
- No peeking: fixed sample size or a sequential test, never "stop when it looks
  good".
- Minimum runtime of one full week, so weekday and weekend are both represented.
- Log the losing variant's result too. A record of what did not work is worth
  more than a record of what did.

First three tests worth running: the hero line (§11.1 has four approved
alternates — test them rather than argue), the presence of a price-adjacent
support ask, and whether the 3D scene helps or hurts (BR8 is unresolved, and
this is the evidence that would resolve it).

---

## 4. System B — the instrument

Everything here is **aggregate, opt-in, and content-free**.

### 4.1 Activation — the first session decides

- `first_open`, `first_task_written`, `first_framework_chosen`,
  `first_day_closed`, each with seconds-since-install.
- **Time-to-first-value = install → first day closed.** The single most
  important activation number.
- Onboarding step drop-off, if onboarding exists.
- `empty_state_abandoned` — opened the app, wrote nothing, left.

### 4.2 Habit — the thing that actually predicts everything

- **Days closed in the first 14.** `growth-lifecycle` identified the
  **7-of-first-14** band as predicting day-30 retention and readable in two
  weeks rather than three months. This is the cheapest early signal available
  and should be the first chart built.
- Current streak length and longest streak — **measured, never displayed.**
  Rule 22 and §11.3 forbid showing streaks to users; that prohibition is about
  the product's voice, not the analyst's instruments.
- Open time-of-day distribution, in **local** time (see the `getUTCHours` bug).
- Gap analysis: length of absences, and the return rate after a gap of 1, 3, 7,
  14, 30 days. *Do people come back after breaking the chain?* That number
  decides whether re-engagement is worth building at all.

### 4.3 Retention

Already rewritten: weekly cohorts, offsets 1/2/7/14/30/60/90, **active =
`day_closed`**, immature cells reported as `null` rather than zero. Keep that
definition. If anyone widens "active" back to "any event", the number becomes
flattering and useless.

### 4.4 Which parts of the app need work

The question the founder actually asked. Answer it with four signals per
surface:

| Signal | What it tells you |
| :--- | :--- |
| **Reach** — % of actives who ever open it | Undiscovered, or not wanted |
| **Repeat** — % who return to it | Tried once and rejected |
| **Friction** — hesitation latency, rage clicks, abandonment | Confusing |
| **Abandon** — entered and left without acting | Broken promise |

A surface with high reach and low repeat is a **disappointment**, and that is a
different bug from one nobody finds. Rank surfaces by `reach × (1 − repeat)` to
get a work queue ordered by how many people are being let down.

Also: `feature_discovered_late` — someone uses a feature for the first time
after 30+ days. That is a discovery failure, not a feature failure, and the fix
is placement, not building.

### 4.5 Friction and failure

- First-keypress latency per surface (exists).
- `modal_abandoned` by modal id (exists) — extend with time-before-abandon.
- Client errors with stack, **scrubbed of any content** (exists).
- Slow interactions: any action over 100ms, bucketed.
- **The Ivy Lee lock specifically**: how often does someone try to open line two
  before closing line one? That is the enforcement working, but a high rate may
  mean the lock is misunderstood rather than respected.

---

## 5. The value layer — what the user sees

> *"It should always tell users the real value they have accomplished."*

This is the part with the sharpest trap. Value shown back can either be a
**record** or a **verdict**, and Rule 22 fails the build on the second.

**Allowed — observation:**
- "You have closed 34 days."
- "Planned 6h 10m. Spent 5h 40m."
- "Your first priority was done first on 28 of 34 days."

**Forbidden — judgment:**
- Scores, grades, percentages-of-goal, "Focus Quotient"
- Streak counters, flames, chains to protect
- "You missed 3 days", "you're falling behind", anything comparative
- Any figure a person could feel they are failing

**Design rule:** every number must be true, past-tense, and neither
congratulatory nor disappointed. The test — *could this sentence make someone
feel bad on a day they had a bad day?* If yes, cut it. A person who missed four
days opening this product should meet a record, not an accusation.

This computes **entirely on-device** from local data. It is not telemetry; it
needs no server and must not require consent. Do not implement it by reading
back from the analytics database.

---

## 6. Proof on the landing page

> *"Track how many productive tasks completed, add it automatically to the
> landing page as proof."*

Real, and buildable — with three conditions.

1. **Aggregates only, k-anonymous.** No figure from fewer than 100 people.
2. **Consented users only.** A number built from people who opted out is a
   number built by breaking a promise. State the basis on the page: *"from
   people who chose to share usage."*
3. **Never per-user, never a leaderboard.** "1.2 million priorities closed" is
   proof. "Top users this week" is a different product.

Numbers worth publishing once they clear the floor: priorities closed, days
closed, hours planned against hours spent, countries in use. Publish a
**counter, not a rate** — rates invite comparison.

Recompute nightly, cache as a static JSON the page fetches. Never query the
analytics database from the landing page request path; the site must stay fast
and must not depend on the telemetry service being up.

---

## 7. Reviews

- Ask **after** a day is closed, never on arrival, and only after a habit exists
  (≥ 14 days closed). Same placement discipline as the support ask.
- Two fields: a short free-text and an optional name/handle. **No rating out of
  five** — a star rating is a verdict, and this product does not deal in
  verdicts, including about itself.
- Explicit publication consent, per review, revocable.
- Store with the review: days closed at time of writing. A review from someone
  on day 40 means something a day-2 review does not.
- Never auto-publish. A human approves each one.

---

## 8. Build order

Each step answers a question the next one needs.

1. **Fix what is wrong** — the UTC bucketing, funnel ordering, `id_reset_suspected`.
   Instruments that lie are worse than none.
2. **System A, acquisition + section dwell + exit section.** Unblocked, no
   privacy questions, and it answers where people come from and where they leave.
3. **Activation funnel end-to-end** — site click through to first day closed.
4. **The 7-of-first-14 habit band.** Earliest real signal; readable in a fortnight.
5. **Surface health table** (§4.4) — the work queue for the app itself.
6. **The value layer** (§5). On-device, no server, no consent needed.
7. **Experiments**, properly bucketed, starting with the §11.1 hero alternates.
8. **Proof pipeline** (§6), once any number clears 100 people.
9. **Reviews** (§7), once a population exists that has closed 14 days.

Do not start at 6 because it is the most satisfying. Do not start at 9 because
proof is what the founder wants to see; there is nothing to prove yet.

---

## 9. Performance

> *"The tool should scream performance."*

Telemetry is the most common way an app stops screaming performance. Therefore:

- The SDK is **fire-and-forget**. No telemetry call ever blocks a render, and no
  await in an interaction path.
- Batched, flushed on `pagehide` via `sendBeacon`, queued offline (exists).
- **Hard budget: under 8KB gzipped, under 5ms of main-thread work per minute.**
  If the SDK grows past that it is cut back, not optimised later.
- The app must work perfectly with telemetry entirely disabled — which is the
  default, and is how most users will run it.
- Measure the measurer: track the SDK's own cost and put it on the dashboard.
