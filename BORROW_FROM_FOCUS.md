# Borrowing from Focus / Plan & Do

> September 9, 2026. Study of `~/Documents/Claude/Projects/Plan & Do` (built as **Focus**; its storage key is still `foocus-telemetry`) and an assessment of what should cross into this product's right page.
>
> **Stack warning:** Plan & Do is Next.js + Zustand + PartyKit + Supabase + PostHog. This product is Vite + React + localStorage. **Nothing lifts as code.** What transfers is the *model* — types, state machine, accounting — reimplemented here.

---

## 1. What is actually in there

### 1.1 The data model — directly usable as a concept

```ts
type SubTask = { id, title, durationSec, completed }
type Task    = { id, title, durationSec, completed, subtasks?: SubTask[] }
```

`durationSec` is **planned** duration. This is the timeboxing layer `FRAMEWORKS.md` §3.1 already called for, already modelled.

### 1.2 The session accounting model — the most valuable asset in the repository

```ts
interface SprintSession {
  plannedDurationSec   // what you said it would take
  actualFocusSec       // what it actually took
  pausedDurationSec    // time not spent
  overtimeSec          // how wrong you were
  outcome: 'unrated' | 'done' | 'partial' | 'blocked' | 'abandoned'
  timingAccuracy: 'measured' | 'legacy-estimate'
}
```

**This is planned-versus-actual, and nothing in the Journal App comes close to it.** It answers a question no competitor asks: *are your timeboxes honest?* Note also the discipline — `sprintStartedAt` is documented as "never back-computed", `sessionLogged` guarantees exactly one row, and `timingAccuracy` marks data whose provenance is weaker. That is careful work and the care should come across with the model.

### 1.3 The state machine

`IDLE → BREATHING → RUNNING → PAUSED → FINISHED`

**`BREATHING`** is a deliberate pause between pressing start and the clock running. It is the most *kanso* thing in either codebase and it should survive.

### 1.4 Mechanics worth taking

| Mechanic | What it does | Why it matters |
| :--- | :--- | :--- |
| `finishTaskEarly(elapsedSec)` | Redistributes unused time to later tasks | Finishing early is rewarded rather than wasted |
| `addTimeToCurrentTask(extraSec)` | "Need more time" | **Non-punitive overrun.** Critical — see §3.3 |
| `recordOutcome(outcome, note)` | done / partial / blocked | A closure mechanic better than the one currently planned |
| `repeatSession` / `usePlanReuse` | Reuse a previous plan | Cheap, and it lowers the cost of a daily practice |
| `doneDefinition` | States what "done" looks like before starting | A genuine forcing function |

### 1.5 What is there and should not come

| Asset | Verdict |
| :--- | :--- |
| **Subtasks** | **No.** A subtask is how you have more than three things while telling yourself you have three. It defeats Rule of 3's enforcement, which is the product's central promise. |
| **Visualizer modes** — `SPACE`, `MOUNTAIN`, `RACE` | **No.** See §5 — they are gamification, not visualisation. (`WATCH` is a different matter and is taken; see §5.1.) |
| **Supabase, PostHog, cloud sync, `useCloudSync`** | **No — hard veto.** Breaks the local-first promise, which is the product's central claim and a public commitment. |
| **TeamRoom, RoomChat, PartyKit multiplayer** | **No.** A different product. |
| **The GOAL → SUBTASKS → READY wizard** | **No.** The diagnosis is the entry point now; a second setup flow in front of it is the friction §10.3 exists to prevent. |

---

## 2. Why the timer belongs — the argument that settles it

The founder's three-part combination is coherent, and the third part is not an addition. It is the **mechanism** the other two already required.

`VISION.md` §10.4 demands that frameworks be **enforced, not drawn** — otherwise the product is a theme picker. But enforcement in a paper metaphor is weak: you can draw three lines and the user writes a fourth in the margin.

**A clock is what makes a method binding.**

| Method | How the timer enforces it |
| :--- | :--- |
| **Rule of 3** | Three timeboxes. The day has a stated shape and you can see when it no longer fits. |
| **Ivy Lee** | One clock runs at a time, and #2's clock will not start until #1 is closed. **The sequence stops being advice and becomes a fact.** |
| **Urgent/Important** | The clock runs only on *Do First*. Time spent elsewhere is visibly time not spent on what you classified as important. |

Each framework produces a *different timer behaviour*. That is the difference between a skin and a mechanism, and it is exactly what §10.4 asked for and had no way to deliver.

---

## 3. The team's view

### 3.1 `growth-strategy` — supports, with a category warning

The free/paid line stays clean: **the timer is daily, so it is free; the accumulated planned-versus-actual history is perspective over time, so it is Patron.** That maps onto the existing model without moving anything.

**The warning: a timer moves you into a more crowded category.** "Daily prioritisation instrument" has few direct competitors. "Focus timer" has many — Forest, Session, Flow, Focusmate, and every Pomodoro clone. Positioning must keep the *diagnosis* in front; the timer is how the method is enforced, never the headline. If the product is described as a focus timer, it competes with fifty apps instead of none.

### 3.2 `growth-acquisition` — strongest supporter, and it fixes an earlier problem

Acquisition previously flagged that cutting the right page **weakened the visual pitch** — a static page with three lines does not demo well, while the old bi-fold screenshotted beautifully.

**The timer solves that.** A running clock with a plan visibly emptying is alive; it is a thirty-second video where a still page is not.

And the pitch improves rather than lengthening, because the loop is now complete:

> **It tells you which method fits your problem, holds you to the time you gave yourself, and shows you afterwards whether you were honest.**

Diagnosis → prescription → enforcement → evidence. No competitor runs that whole loop.

### 3.3 `growth-lifecycle` — the biggest win, with one hazard

Lifecycle's standing objection was that **cutting habits removed the retention machinery** — the streak was the reason to return.

**The timer replaces it, and better.** A static page has one daily touchpoint; a running timer has several — start, pause, finish, next. And planned-versus-actual creates a genuine reason to come back: *you find out whether you were right.*

**The hazard: timers create failure states.** Habit trackers die at the broken streak. A timer product dies when a user overruns three days running and starts feeling judged by their own tool. The mitigation is already in the Focus code and must be preserved deliberately: **`addTimeToCurrentTask` — "need more time" — treats overrun as information, not failure.** Never a red alarm, never a lost streak, never a score that falls. The product observes; it does not scold.

### 3.4 `growth-revenue-ops` — one hard veto, one practical note

**Veto: no Supabase, no PostHog, no cloud sync, no PartyKit.** The local-first claim is the product's central public commitment and is already the subject of an open blocker (B3, the telemetry contradiction). Importing a sync layer from another repository would turn a fixable inconsistency into a false claim.

**Practical:** nothing crosses as code. Different framework, different state library, different persistence. What crosses is the model — types, the state machine, the accounting fields — reimplemented against this product's `localStorage` layer. The Focus `foocus-telemetry` model is itself local-first and is the right shape to copy.

---

## 4. Recommendation

### 4.1 Take

1. **`durationSec` per line** — the timebox. Already decided in `FRAMEWORKS.md` §3.1; Focus supplies the model.
2. **The planned / actual / paused / overtime accounting**, with `timingAccuracy` provenance marking.
3. **The state machine, including `BREATHING`** — the pause before the clock starts.
4. **`addTimeToCurrentTask`** — non-punitive overrun. Non-negotiable per §3.3.
5. **`finishTaskEarly` redistribution** — finishing early returns time to the day.
6. **Session outcome** — done / partial / blocked, as the day-closure mechanic.
7. **Plan reuse** — repeat yesterday's shape.

### 4.2 Leave

Subtasks · visualizer modes · cloud sync · Supabase · PostHog · team rooms · the setup wizard.

### 4.3 Consider, undecided

**`doneDefinition`** — stating what "done" looks like before starting is a real forcing function and fits *decide what deserves your day*. But it is a **second question in the morning**, after the symptom question, and §10.3 exists to keep the morning free of gates. Suggested resolution: optional, never required, and never before the first line is written.

### 4.4 The right page, settled

```
LEFT PAGE                          RIGHT PAGE
What deserves the day              How long, and how it actually went
symptom → method → three lines     timebox per line · the clock · planned vs actual
```

The §4.1 rule from `FRAMEWORKS.md` still governs and is now load-bearing: **the right page may only ever operate on the left page's items.** Subtasks are the first thing that would violate it, which is why they are refused above.


---

## 5. The visualiser modes — a correction and a split

§1.5 originally rejected all four modes together. That was too quick: **`WATCH` is an instrument; `SPACE`, `MOUNTAIN` and `RACE` are games.** They are not the same kind of object and do not deserve the same verdict.

`AnalogueClock.tsx` (103 lines) renders a clock face. The other three are gamified progress metaphors: SPACE draws 100 drifting stars and detailed planet SVGs (Mars in a radial orange gradient, Jupiter in yellows, Neptune in blues) that you travel past; MOUNTAIN generates a multi-peak path with a **climber figure**; RACE is a competitive track.

### 5.1 `WATCH` — take it

An analogue face is **functional, not decorative.** It renders *duration* spatially — how much is left — where a digital readout renders an *instant*. For a timebox, duration is the quantity that matters, and a swept angle communicates it faster than digits.

The register is also exact: Swiss, mechanical, precise — the same vocabulary as a luxury stationery instrument. It is monochrome, satisfying Gate 3, and it passes `VISION.md` §9 by making remaining time legible at a glance.

**A clock face is not a theme. It is the instrument reading itself.**

### 5.2 `SPACE`, `MOUNTAIN`, `RACE` — leave them

1. **They are the psychology of the habit streaks just cut.** Extrinsic reward loops — journey, achievement, competition. If habits were removed for belonging to a different product, gamified progress fails on identical grounds.
2. **They contradict the neutrality chosen in `DECISION_LOG.md` §1.34.** A climber celebrating your progress is the software forming an opinion about you. The thesis is that the human executes and the software holds the page steady; a rocket holds nothing steady.
3. **They imply failure states.** Ask what MOUNTAIN does on an overrun — the climber does not reach the peak. That is a judgment rendered as a picture, and it directly violates the non-punitive rule the timer work depends on (§3.3). **A progress metaphor with a protagonist cannot avoid this. A clock face has no protagonist, so it never judges.**
4. **Gate 3 bans chromatic decoration**, and an orange Mars beside a yellow Jupiter is precisely that.

### 5.3 Team view

| Member | Position |
| :--- | :--- |
| **`growth-strategy`** | Rejects modes as a paid tier. "Unlock more themes" is cosmetic monetisation; it cheapens a $39 instrument and breaks *one price, everything*. The clock ships free. |
| **`growth-acquisition`** | The one real argument for them — a climbing animation demos well and Product Hunt rewards visual novelty. But it recruits the wrong audience and sets an expectation the product refuses to meet. **A product that looks playful and behaves austerely churns.** The clock demos well enough, and honestly. |
| **`growth-lifecycle`** | Gamified progress drives *shallow* engagement. This product's retention thesis is depth — the archive compounds. Trading depth for a dopamine loop is the wrong trade for a tool kept for years. |
| **`growth-revenue-ops`** | The visualisers depend on **Framer Motion**, absent from this codebase. An animation library plus 100 animated star elements is dependency weight and render cost for zero functional gain, against a 60fps promise. |

### 5.4 Verdict

**Take `AnalogueClock.tsx` — as *the* clock, not as a mode.**

No mode switcher, no cycling, no gallery. One face, always. Offering four visualisations would repeat the six-frameworks mistake in a different costume: **variety presented as capability.**
