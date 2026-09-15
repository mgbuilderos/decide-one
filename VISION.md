# Vision — Why This Tool Exists

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


> Stated by the founder, September 9, 2026, in their own framing. This is the root document. Where any other document in this repository conflicts with it, this one wins.

---

## 1. The one sentence

**We are building a tool that helps executives decide what to focus on.**

That is the ultimate thing. Everything else — the paper, the page turn, the illustrations, the privacy, the price — exists to serve it.

---

## 2. The problem, as the user actually experiences it

**Confusion.**

Not laziness, not lack of tools, not missing features. A person with real responsibility has too many things in their head at once, and the volume itself destroys their ability to tell what matters. They are not short of tasks. They are short of **certainty about which task**.

That confusion is the enemy. Every other symptom — procrastination, busywork, the day that disappears, the important thing that keeps sliding — is downstream of it.

---

## 3. The arc the product moves the user through

```
CONFUSION  →  jot down what is most important  →  prioritise  →  CLARITY
```

Four steps, and the two that matter are the first and the last. The middle is mechanism.

1. **Confusion** — too much, all at once, no order.
2. **Jot down** — get it out of the head and onto the page. The writing is not the product; it is the act that makes the thinking visible.
3. **Prioritise** — decide what deserves the day. *Decide*, not choose: from Latin *decidere*, to cut off. The alternatives are cut away.
4. **Clarity** — the user knows what to focus on. **This is what we sell.**

---

## 4. What we are actually selling

**Clarity.** Not productivity, not organisation, not a journal, not a system.

A person opens this confused and closes it certain. That transformation, repeated daily, is the entire product. If a feature does not serve that transformation it does not belong, however beautiful it is.

---

## 5. Who it is for

**Executives and founders** — people whose days are genuinely contested, where choosing wrong is expensive and where nobody else can make the choice for them.

By extension, anyone carrying more than they can hold at once. The register speaks to the executive; the product excludes no one. (See `SCALE_PLAN.md` §1.2 — reaching a million people requires that the copy never shut a student out, even while the tone stays serious.)

---

## 6. Why we are building it

- Because the tools that exist add to the confusion instead of resolving it. They offer more fields, more views, more configuration — more decisions, when the user came in drowning in decisions.
- Because the act of deciding what matters is **the human's work**, and software should hold the page steady rather than pretend to do the deciding. *Software does not execute; the human executes.*
- Because a person's private thinking should stay theirs — no cloud, no account, no training data, no landlord.
- Because a tool this personal should be **owned**, not rented. Pay once, keep it forever.
- Because the founder intends to fund further tools that help people, and this one has to earn that. Sufficiency, not extraction. (See `GROWTH_CHARTER.md` §0.)

---

## 7. What it is not

- Not a task manager. It does not want your two hundred tasks; it wants your three.
- Not a productivity system to be configured. Setup is not work.
- Not an assistant. It does not suggest, rank, or decide on the user's behalf.
- Not a subscription, not a cloud service, not an account.
- Not a journal in the diary sense. The writing exists to produce a decision.

---

## 8. The philosophy behind it

Four traditions arrived at the same principle independently, and the product is built on it:

- **Kanso** (Japanese Zen) — simplicity reached by **subtraction**; every element must serve a purpose or be removed. This is the design law the 21 QC gates already enforce.
- **Laozi**, *Tao Te Ching* ch. 48 — *"In the pursuit of learning, every day something is acquired. In the pursuit of the Tao, every day something is dropped."* Clarity as a **daily** practice of dropping. The product already quotes Lao Tzu in the evening reflection.
- **Neti neti** (Upanishadic) — truth reached by negating everything it is not.
- **Tzimtzum** (Kabbalistic) — you make room by withdrawing, not by adding.

And two facts of language that argue the case for free:

- **Priority** had no plural for five hundred years. It meant the one thing that came first. We only began saying *priorities* in the 1900s, and the word has meant nothing since.
- **Decide** comes from *decidere* — *de* (off) + *caedere* (to cut). To decide is to cut away. Every decision kills the alternatives.

---

## 9. The test for any future decision

Before adding anything — a feature, a field, a view, a word of copy — ask:

> **Does this move the user from confusion toward clarity?**

If it does not, it is decoration, and kanso says to remove it.

---

## 10. Product definition — revised September 9, 2026

The product was materially narrowed after the vision above was written. Recorded here because §1–9 describe the *why* and this describes the *what*.

### 10.1 What was cut, and why

| Cut | Reason |
| :--- | :--- |
| **Habit tracking** | A different product in a different category. We do not want to know whether you walked or drank water. Several apps do this well. |
| **Evening reflection** | A different product again — gratitude and journalling have their own market. |
| **The bi-fold spread** | It existed to hold the right page. With that page empty, the spread has no reason to exist. |
| **Three of six frameworks** | 1-3-5 duplicates Rule of 3 (same disease, different dosage). MoSCoW is Eisenhower built for team scope negotiation, not one person's morning. **Pareto is a principle, not a method** — it says the vital few exist but gives no procedure for finding them; it belongs in the copy, never as a selectable mode. |

Each cut passes the §9 test: none of them moved a user from confusion toward clarity.

### 10.2 What the product is now

**One page. Today's date. A small number of lines. Nothing else.**

Plus **day closure** — not reflection, just *the day is done*. This is kept deliberately: without an ending the product is morning-only and there is no reason to return in the evening, and day-30 retention is the metric the entire growth plan rests on.

### 10.3 The mechanism — make the choice visible, then apply a method

The three surviving frameworks are not variations. **Each was invented to treat a different failure mode**, and that is the organising logic the category never states:

| The user's symptom | The disease | The method | The medicine it administers |
| :--- | :--- | :--- | :--- |
| *"Too much to do."* | Overcommitment | **Rule of 3** | Cap the list at what a day actually holds |
| *"I keep not finishing things."* | Context-switching | **Ivy Lee** (1918) | Never start #2 until #1 is done |
| *"Everything feels urgent."* | Urgency mistaken for importance | **Eisenhower** | Force a two-axis split so the two stop being one thing |

Rule of 3 does **not** cure context-switching — a switcher will pick three things and still bounce between them. Nor does it cure urgency-confusion — they will simply pick three urgent trivial things. Different diseases, genuinely different medicines. This is why three survive and not one.

**Presentation rules:**
- No quiz, no gate. Open directly on the instrument with Top 3 selected.
- **Show all three methods as direct, labelled controls.** Top 3, Ivy Lee, and the Urgent/Important Matrix are always one click away.
- Explain the problem each method helps with in plain language, then name and credit the method wherever it is used. The instrument supplies the form; the person still chooses the work and does it.

### 10.4 The frameworks must be enforced, not drawn

The make-or-break implementation rule. If selecting a method only changes labels, users discover within a week that nothing changed, and the differentiation is revealed as a theme picker.

- **Rule of 3** — three lines, and **there is no fourth**.
- **Ivy Lee** — six lines, and **#2 is locked until #1 is done**. The enforced sequence *is* the cure; permit skipping and you have shipped a numbered list.
- **Eisenhower** — **classification is required before writing.** The forced split is the treatment.

### 10.5 Two claims to get right

**Never say "scientifically proven".** Ivy Lee is a business anecdote (Schwab reputedly paid $25,000 for it) with no trial behind it; Eisenhower's matrix is a conceptual model Covey built from a line in a 1954 speech; Pareto is an observed distribution. None has outcome studies. `PRIMACY_CREATIVE_BRIEF.md` already forbids the claim, and it is legally exposed as well as false.

**Say time-tested instead.** *"Methods that have worked for a century — not another blank page."* A hundred years of executives using Ivy Lee is a better warrant than a study of forty undergraduates, and nobody can knock it down.

**On the craft — hold the right defence.** The 3D page turn, the twelve month illustrations, the woven label and the Three.js scene do **not** move a user from confusion to clarity, and cannot be defended on the §9 test that justified cutting habits and reflection. They are defensible on a different ground: **craft is what makes a person want to return**, and day-30 retention is the metric everything else depends on. A beautiful instrument gets opened; a plain one does not. Hold that defence consciously rather than have someone else point out the inconsistency. *(Superseded 14 September 2026 — §12.4 was resolved toward the instrument register, so this defence no longer stands. The month illustrations were retired that day; `DECISIONS.md` BR8.)*

---

## 11. The canonical statement — September 11, 2026

Everything above is *why* and *what*. This is how it is said. **Where any copy anywhere conflicts with this, this wins.**

### 11.1 The statement

> ### You already know what matters. This helps you choose it.
>
> Some mornings hold eleven things and no obvious first one. Bring them into view, pick the method that fits the day — Top 3, Ivy Lee, or the Urgent/Important Matrix — and give the first one a real amount of time. You make the decision. The instrument holds it steady while you work.
>
> Three methods older than the software industry. One page. Nothing leaves your device. **Free, for everyone, with nothing held back** — because a tool that helps you choose your day should not be something you have to afford.

**"You already know what matters. This helps you choose it."** is the primary line, replacing *"Choose what deserves your attention"* on 11 September 2026.

It does three things the previous line did not. It **begins by trusting the reader** — they are not disorganised or lacking discipline, they are carrying too many open questions at once. It keeps the product's neutral role intact: the choosing is theirs and the instrument never makes it for them. And it sets up the free position as a consequence of the purpose rather than as a promotion — if the goal is one clear day for as many people as possible, charging for it works against the goal.

*"Choose what deserves your attention"* is retained as an approved alternate. It was canonical from 9 September and remains true; it is simply colder than the direction set on 11 September, which is that the voice should be **motivating and positive throughout** (`BRAND_BOOK.md` §2).

**The second sentence is doing the emotional work, and it is deliberate.** *"Eleven things and no obvious first one"* is a specific, recognisable morning rather than a description of a feeling. Copy discipline here is that emotion is carried by precision, never by adjectives: the reader should meet themselves in the sentence, not be told how they feel.

**Canonical price: free.** There is no paid tier, no licence to buy, and no feature held back. At the end of a day the person has actually closed, the product may ask — once, quietly, and never blocking — whether it has been worth something. Declining is a complete answer and the ask gets quieter each time it is declined.

**Why this replaced the one-time $39.** The price moved six times in a single day — a one-time $39, then $10 monthly, then $10 one-time, then $39 worldwide, then $29, then $9 — because there was nothing to check any of them against. No one had been asked to pay, the telemetry held 54 seeded users whose longest tenure was eight days, and the retention query stopped at day seven. **A price cannot be chosen for a product with no usage data.** Usage comes first; the number, if there is one, comes from what usage shows. Marginal cost is zero, so this costs nothing to run, and free→paid later reads as growth where paid→free would read as failure.

**What this does not change.** Nothing leaves the device. No account. No subscription. No advertising, and no selling of anything a person writes — that last is not a pricing decision and is not available as one.

**Approved alternates**, same body:

| Line | Leads with |
| :--- | :--- |
| *Choose what deserves your attention.* | The benefit. Primary 9–11 Sep 2026. |
| *Open it confused. Close it decided.* | The transformation. |
| *Decide what deserves your day.* | The instruction. |
| *You don't need another list. You need to know which three.* | The enemy. |
| *Three methods. One clear order.* | The mechanism. |

**Quick-start control guidance — approved 15 September 2026 for the direct arrival.**
“Pick the method that fits the day.” “Choose at the top of the page. Set minutes beside the first line. Turn Over to close the day.” Navigation: “Next”, “Back”, “Skip”, “Start”. Method descriptions may excerpt the existing crawlable one-liners: “Three things for today and no fourth.” “Six tasks in strict order.” “Sorting on two axes before deciding what to do.” These locate existing controls and explain the three-step arrival without adding a promise, field or method. The primary statement and privacy/free promise above supply the other two steps.

**Instrument labels, 15 September 2026.** “First”, “Next”, “Then” may label the three existing lines; short placeholders prevent narrow-screen clipping. “In order. One at a time.” makes the Ivy Lee rule visible. Matrix axes use “Urgent / Important”, “Not urgent / Important”, “Urgent / Not important”, “Not urgent / Not important”. “Classify first” labels its existing input gate. “Day closed” states a persisted closure. “Write first. Set minutes beside the line.” locates the existing time fields. These replace clipped, ambiguous or stale text without adding a field. Empty owner details are omitted rather than substituting a real person. The idle analogue face shows local time, labelled “Local time”; once a duration is set it shows that duration. Existing duration figures remain timing information.

### 11.2 What the product does — the four movements

1. **It makes the competing work visible.** A bounded page turns a crowded mental list into a choice the person can see.
2. **It gives the choice a method.** Overcommitment → Top 3. Context-switching → Ivy Lee, 1918. Urgency confusion → the Urgent/Important Matrix. All are time-tested; all are named and credited honestly.
3. **The method is enforced, not drawn.** Three lines and no fourth. Ivy Lee's second line will not open until the first is closed. Urgent/important requires classification before writing. **A clock is what makes this real** — a page can be ignored, a running timer cannot. Each line takes a duration; optionally a when and where.
4. **It closes, and it counts.** Done, partial, blocked. Over weeks, planned against actual — where the time went, whether the estimates hold. **It never scolds.** Overrun adds time and says nothing.

The shape has a name, from medicine: **a regimen for a day** — assess, route, dose, review. Use the structure; never the vocabulary (§11.3).

### 11.3 Copy discipline — three standing rules

These are not stylistic preferences. Each one closes a specific exposure.

| Rule | Never write | Write instead | Why |
| :--- | :--- | :--- | :--- |
| **No clinical vocabulary** | diagnose · prescribe · treat · therapy | *choose a method* · *use the structure that fits* | Medical **structure** is fine; medical **language** invites health-claim scrutiny from regulators and app stores. Same discipline as §10.5, pointed at different words. |
| **No judgment** | *whether you were honest* · *you failed* · streaks lost, scores falling | *shows you where the time actually went* | The product observes; it does not scold. Breaking this breaks the non-punitive rule the entire timer design rests on. |
| **No unearned science** | *scientifically proven* · *clinically validated* (of the selection methods) | *time-tested* · *methods that have worked for a century* | §10.5. The single permitted scientific claim is Gollwitzer & Sheeran (2006), d = 0.65, and it applies to if-then planning **only**. |

**A fourth rule, which is about behaviour rather than words: the product never
infers failure from a date.**

An unfinished task on a past day is unfinished. It is not failed, and Decide One
does not decide otherwise on the person's behalf. Red, the ✕, and any other mark
of a thing not done belong to the person who marks it — never to the calendar
moving on.

This was written on 11 September 2026 after the opposite was found shipping.
`Top3HardTasks.jsx`, `ProductivityFrameworks.jsx` and `BulletItem.jsx` all
computed a missed state as *not completed, and the day has passed*, and rendered
it in red. Anyone returning after a week away met a week marked in red by the
software. Nobody decided that; it arrived as an obvious-looking line of code, and
it contradicted the §11.3 rule directly above without ever being written down as
a decision.

**The founder's statement of it, which is the standard to hold:** *"We do not
want someone to feel bad if they did not log in the tool. What matters is the day
that is there when they come. If we can make one day productive for one person,
that is a win."*

That is the reason the product ships frameworks rather than a blank page — and it
is also the reason a person who has been away for a month must be able to open it
and find a clean day, not an account of their absence. **The test for anything
shown on return: could this make someone feel bad on a day they had a bad day?**
If yes, it does not ship.


---

## 12. The brand model — September 9, 2026

Everything above says what the product is. This says **what kind of company makes it**, and it governs price, craft, feature policy and the name.

### 12.1 The Casio F-91W

The founder named the model directly: *"there are so many watches out there but this is built for simplicity and durability. Other tools have so many features, and the F-91W still rules. We want the tool to rule even if it is simple and has fewer features, as it genuinely solves the problem."*

**It is a brand model, not a form factor.** The analogue clock (§1.40, R11) is a settled component and was never in question here.

### 12.1a It is a belief system, not a design language — 11 September 2026

**This correction is binding on every agent and on the founder. Quote it rather than paraphrase it.**

> *"Casio F-91 is not design inspiration, it is a brand aspiration — that even if it is a low-cost watch it is still used by even millionaires. The idea is to build something classic and fluff-free that can last decades. There are Swiss watches that appear very aspirational, but Casio function beats everything, and that is how I want all the agents and everyone to think about this tool.*
>
> *We have just one vision and one goal: to be an instrument that drives productivity — and hence we are making it free for everyone, so anyone can be productive. We might not be like the biggest SaaS or tool providers, because our belief is simple: if they complete the task in the framework, they will succeed. They don't need to do 1000 things. They need to do 3 things better and complete it, and that is real productivity.*
>
> *A simple layout that does not require the user to fill everything, like other popular tools. We want to keep things very, very simple, because for us improving people's productivity is the goal — and we want to ask for money only when we add value to people's life and we truly demonstrate it to the users.*
>
> *So Casio and Leica are not design-language decisions. They are belief systems that our tool is built on."*
> — the founder, 11 September 2026

**What this corrects.** §12.1 had been read — including by an agent, on this date — as a *visual* instruction: plain, cheap-looking, monochrome, no craft. That is the wrong reading and it produced the wrong question. The argument was never about how the product looks. It is about **what earns respect**.

A millionaire wears an F-91W because it tells the time perfectly, forever, and asks nothing of them. Not because it is cheap, and not despite it. **Function that good outranks aspiration.** The watch does not perform value; it delivers it, and the respect follows.

**Three things this settles, so they stop being re-litigated:**

1. **"Premium" is not forbidden. "Fluff" is.** Excellence in typography, spacing, precision and durability is the Casio position, not a departure from it. What is forbidden is decoration that signals expense while adding nothing — materials cosplay, ornament as proof of worth.
2. **Simplicity is the product, not a constraint on it.** Three things done, not a thousand captured. **A layout that does not require the person to fill everything in**, which is where other popular tools go wrong. Every field added must earn its place against this.
3. **Free follows from the goal, not from the price band.** The goal is that anyone can be productive; charging works against it. Money is asked for only once value has been delivered and demonstrated — which is why the ask sits at the close of a day the person actually finished, and nowhere else.

**The standing test, replacing any appeal to "make it look expensive":**

> Would someone who could afford anything still choose this, because it does the one job better than anything else does?

If yes, it is on-brand at any level of craft. If the answer depends on how costly it looks, it is fluff and it goes.

The F-91W is a stranger object than "simple and durable," and the specifics are the useful part:

| Fact | What it means for us |
| :--- | :--- |
| **Unchanged since 1989.** No refresh cycle, no redesign, no anniversary edition. | The design is finished, and then it is not touched. |
| **No feature has ever been added.** Time, date, alarm, stopwatch, light — thirty-seven years, nothing. | Not "add slowly." Add nothing. |
| **Cheap and unembarrassed about it.** Not a luxury object performing restraint — that is Muji, Leica, a Hermès notebook. | Dignity comes from honesty about what it costs to make. |
| **Assumed, not aspired to.** Nobody brags about one; everybody respects it. | Ubiquity is the moat. Exclusivity is not part of the story. |
| **The name is a part number**, and the object became beloved anyway. | Beauty is carried by behaviour, not by the wordmark. |

### 12.2 The promise this makes available

> **This will look the same in ten years. No features will be added.**

Every competitor's changelog is their marketing, which makes this commitment structurally unavailable to them. It also converts the binding constraint — one person, no team — into the brand rather than the apology.

### 12.3 It settles the price question

`STRATEGY_AND_NAMING.md` §1.2 argues the Jobs position: $49–99, premium forever. The F-91W is a $12 watch. **The two point in opposite directions, and Casio has been chosen.** That decision stands, and free is its furthest expression: the F-91W argument was always about being assumed rather than aspired to, and ubiquity is the moat. **Superseded 11 September 2026 — see §11.1.** The one-time $39 that stood here was the Casio point under a paid model; there is no longer a paid model, and any future price must be set from usage rather than from this analogy.

### 12.4 The conflict it creates — and §10.5 is on the wrong side of it

**Most of the craft already built is off-brand under this model, not merely off-thesis.** The Three.js journal scene, the twelve monthly illustrations, the woven twill tag, studio lighting and spine curvature are **Leica register — the exact opposite of an F-91W.**

§10.5 defends that craft on retention grounds: *a beautiful instrument gets opened; a plain one does not.* That is a real argument, but it is **the argument for a different brand than the one now named.** The F-91W's retention does not come from beauty. It comes from being so plain and so reliable that replacing it never occurs to anyone.

Either position is holdable. Both are not. **This is recorded as an open conflict (`DECISIONS.md` BR8) and must be resolved before further craft investment**, because it decides whether that work survives at all.

**Resolved 14 September 2026, toward the instrument register** (`DECISIONS.md` BR8, `UI_BRIEF.md` §7.3). The founder: *"we are not a journal, we are an instrument."* The notebook cover and the twelve monthly illustrations were retired that day; the woven tag, the embossed chassis and the page curl between days are listed for retirement under the same decision. The leaflet (§12.5) stays.

### 12.5 The page is a single leaflet

Settled alongside the brand model, and independent of it.

**One sheet, two sides.** The **recto** carries what deserves the day — the lines, the method, the clock. The **verso** carries where the time actually went.

- **It holds the two-layer architecture (§1B) better than a spread does.** A bi-fold shows both at once and invites the right page to compete for attention; a sheet shows one face at a time.
- **Turning it over is the day-closure gesture.** §10.2 kept day closure but gave it no physical act. This is the act.
- **It satisfies R3 structurally rather than by discipline** — a verso cannot introduce objects of its own, because it is the same sheet.
- **A book accumulates; a leaf does not.** Pages fill and the backlog stares at the user. A sheet is finite and replaced tomorrow. That is the Rule of 3 rendered as an object.
- **It licenses the deletion §12.4 already demands.** A leaflet has no spine, no cover, no ribbon, no months. *(Applied to the cover and the month illustrations, 14 September 2026.)*

**One closure for the record: the word *Leaflet* is unusable as a wordmark.** Leaflet.js is among the most-used mapping libraries on the web. The metaphor is available; the word is not.

### 12.6 What this does to the name

**Under §12.1 the target is no longer a beautiful word.** Nineteen-plus candidates have been searched and nearly all were lost *because they were good words* — good words in the "decisive / essential / clear" field are gone precisely because they are good. Asking for a more beautiful name is asking for a more contested one.

**The paper register is picked clean; the mechanism register is nearly empty.** Foolscap, Deckle, Quire, Longhand, Daybook and Recto are all occupied, because everyone building a journal app reaches for paper words and nobody reaches for machine parts.

The founder subsequently clarified the naming standard: the name should be **widely known while inheriting authority from a familiar technical instrument, system or concept**. Their example was *Submarine* — substantial and technically accomplished, yet understood without explanation. The name does not have to be an object. It must be familiar, easy to say and spell, memorable, relevant to the product, and carry competence before the supporting copy begins.

This supersedes **Detent** as the standing direction. Detent satisfied the machine-part brief but failed the familiarity and spoken-word tests.

**Radar was considered and rejected.** Radar exists to ensure nothing escapes notice; this product exists so that almost everything can leave the user's attention. *Keep it on the radar* means adding something to the monitored set. Radar names the user's condition, not the cure.

The standing test is now: **does the borrowed meaning add to what the user sees, or take away from it?** The name should perform the work in its meaning: edit, filter, reduce, refine, select or impose a limit. Full rationale and screening record: `NAMING_DIRECTION.md`.

---

## 13. The instrument standard — September 12, 2026

§12 says what kind of company makes this. **This says what standard the thing
itself is held to, and it is the highest bar in this document.**

### 13.1 The founder's statement

> *"It is not about costly, it needs to look perfect, precise, and the product
> should be serious — as it is a priority instrument and not a game. All
> alignment should be proper, the pixels should be perfectly aligned, there
> should be no errors, the fonts should be readable, there should be proper
> space to add everything, the clock should work properly, and every small
> detail should be perfect. The website should look it and speak it.*
>
> *Imagine the person is like a pilot and we are the compass who guides them in
> the sky, so they decide one thing and really accomplish something.*
>
> *We are an instrument, not a diary. Imagine if someone like Neil Armstrong or
> Steve Jobs or Elon Musk wanted a priority instrument — this would be the tool.
> We want to make everything atomic-grade and precise, so inspect each and every
> element."*
> — the founder, 12 September 2026

### 13.2 The compass, and what it settles

**The pilot flies. The compass does not.**

This is the most exact statement of the product's role yet written, and it
resolves things §11.2 only implied:

- **The instrument is trusted because it is right, not because it is pleasant.**
  A compass two degrees off is worse than no compass, because it is believed.
- **It must be readable at a glance, under load.** Nobody studies an instrument.
  They look, they know, they act.
- **It never flies the plane.** The choosing stays the person's. A compass that
  steered would be a different, worse instrument — and this is the same rule
  §11.1 states as *you make the decision*, arrived at from the cockpit instead.
- **Ornament is a defect.** On an instrument panel, anything that is not
  information is something in the way of information.

**Diary and instrument are different objects.** A diary records what happened; an
instrument tells you where you are so you can act. Where a design decision could
go either way, it goes to the instrument.

### 13.3 Atomic grade — what it means in practice

Not a mood. Each of these is checkable, and a reviewer should be able to fail a
change against them:

1. **Alignment is exact.** Everything sits on the 24px cadence. Optical centring
   where mathematical centring reads as wrong.
2. **Zero console errors, in any state.** An instrument that logs errors is an
   instrument that is lying somewhere else too.
3. **Numbers are correct and the clock is accurate.** Time shown, time planned,
   time spent, dates and weekdays. **This is the most important item on the
   list**, because it is the one an instrument cannot get wrong and remain one.
4. **Type is readable at its real size**, on a real screen, at arm's length —
   not at 200% zoom on a designer's monitor.
5. **Space is sufficient, not merely tight.** Restraint is not cramping. If a
   field cannot hold what a person will type, it is unfinished.
6. **Every state is designed** — empty, one item, full, overrun, returning after
   a month. An unhandled state is a broken instrument, not an edge case.
7. **Nothing is decorative.** Every mark on screen carries information or earns
   removal.

### 13.4 The people it is imagined for

Armstrong, Jobs, Musk are named as a **standard of seriousness**, not as an
audience and never as an endorsement.

**They must not appear in public copy** — real people's names imply a claim the
product has no right to make, and that is a §11.3 problem as well as a legal one.
Their use here is internal and singular: *would a person who chooses instruments
for a living keep this one?*

### 13.5 How the website is held to the same bar

The site is part of the instrument, not an advertisement for it.

- It must **look and speak** like the thing it describes: precise, unhurried,
  nothing oversold.
- **The 3D journal must depict the actual product.** Matching what is really
  inside the app, and reading as a **digital instrument rather than a physical
  book**, so nobody arrives believing a paper notebook is for sale. A render that
  misrepresents the product is not craft; it is an inaccuracy on an instrument.
- **Proof must be real.** The accomplishment and review surfaces show what people
  actually did, at the thresholds in `TELEMETRY_SPEC.md` §6, or they show
  nothing.

### 13.6 The test

> **Would a person who depends on instruments — and who could use anything —
> trust this one, and keep it?**

Trust is the operative word. It is earned by being right every time, in small
things, where nobody is looking.


Design-copy refinement, 15 September: “This page records how the day went.” is the desktop empty-report equivalent of the existing turn-back instruction. Both pages are visible on desktop now, so telling the person to turn back would be inaccurate.
