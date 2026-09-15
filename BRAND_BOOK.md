# Brand Book — Decide One

> **Standing:** the working guide. If you are writing a sentence that a user will
> read, this is the file. `BRAND_HOUSE.md` is the structure; `BRAND_KEY.md` is
> the positioning.
>
> **`VISION.md` §11 is canonical and wins any conflict with this document.** §11.3
> is enforced by `npm run test:qc` — Rules 17, 21 and 22 fail the build on
> forbidden vocabulary, so bad copy does not reach the site.

---

## 1. The voice in one paragraph

Decide One speaks like a capable colleague who has seen your week, is not
alarmed by it, and believes you will get through it. It is warm, encouraging and
plain — on the reader's side, and showing it by being useful rather than by
saying so. Optimism here is quiet and specific: it comes from handing someone a
clear next step, not from telling them they can do anything.

**It encourages. It never grades, never scolds, and never sells.**

## 2. Motivating and positive — and the one line that is machine-enforced

The founder's direction is explicit: **always motivating, positive thinking
completely.** That is the register, and most of it is straightforwardly
available.

**Positive is the default and it is not a veneer.** The reader is someone
competent having a heavy week, not someone failing. Copy assumes they will
manage today, treats the difficulty as ordinary rather than alarming, and never
implies they have fallen short. Hope, warmth and belief in the reader are
welcome everywhere.

### The distinction that makes this easy

There are two things called motivation and they work in opposite directions.

| **Encouragement** — use freely | **Loss-aversion** — fails the build |
| :--- | :--- |
| "Most days have room for three things." | "Don't break your streak." |
| "The first one is the one you'll actually start." | "You're 2 days from a personal best." |
| "You closed thirty days." | "Focus score: 62/100." |
| "Whatever happened yesterday, today is three lines." | "You missed 11 days." |
| Warmth, belief, a clear next step | Chains, scores, grades, comparisons |

The right column is not *less positive* — **it is motivation built from fear of
loss**, which is why a broken streak makes people delete the app rather than try
again. On the day a person most needs this tool, loss-aversion is the mechanism
that guarantees they will not open it.

**So "always positive" and Rule 22 want the same thing.** The rule removes the
mechanics that punish; positivity is what fills the space.

### The hard boundary, stated plainly

`npm run test:qc` Rule 22 **fails the build** on streaks, scores, verdicts and
scolding, and Rule 17/21 on the borrowed trademark. This is not a style
preference an agent can be argued out of — copy in the right column above will
not deploy.

That gate is the founder's own decision (B-11 removed the "Focus Quotient" for
exactly this reason) and it can be changed. **Changing it means amending
`VISION.md` §11.3 and `DECISIONS.md` first, deliberately** — not slipping a
streak counter past it in a copy edit.

### Where positive tone is *not* the priority

One surface only: **returning after a gap.** Here the correct tone is warm
neutrality — the date and three empty lines. Even upbeat acknowledgement
("Welcome back!") draws attention to the absence. §11.3's fourth rule governs,
and silence is the kindest thing the product can say.

**Emotion is carried by precision, not adjectives.** "Eleven things on a list
and no idea which one to start" lands harder than "feeling overwhelmed?",
because the reader recognises themselves in it rather than being told how they
feel.

## 3. Vocabulary

### Never write

| Forbidden | Instead | Why |
| :--- | :--- | :--- |
| diagnose, prescribe, treat, therapy, clinically | choose a method, use the structure that fits | §11.3. Health-claim exposure with regulators and app stores |
| scientifically proven, research-backed, studies show | time-tested, methods that have worked for a century | §11.3. Only one claim is earned — see §5 below |
| streak, score, grade, you failed, you're behind, don't break the chain | shows where the time actually went | Rule 22. The gamified register was removed on purpose |
| crush it, level up, 10x, unlock your potential, game-changer | — | Not this brand's register in any context |
| effortless, magically, in seconds | — | Deciding is work. Claiming otherwise insults the reader |
| that competitor-trademark journalling method, or its author's name | the symbol set, forwarding, migration | Rules 17 and 21 fail the build |
| users, engagement, retention | people, the person, someone | Internal words. They leak the wrong relationship |

### Prefer

**Short Anglo-Saxon words.** *Day, work, first, done, kept, closed, yours.*
Latinate abstractions — *optimise, facilitate, leverage, utilise* — flatten the
voice instantly.

**Concrete nouns over categories.** "Three things" beats "tasks". "Your day"
beats "your workflow". "Call the bank" beats "an action item".

**Full stops over commas.** The rhythm of the product is *decide, stop*. The
sentences should do the same.

## 4. Tone by surface

| Surface | Tone | Because |
| :--- | :--- | :--- |
| Landing page | Warm, encouraging, emotionally direct | A stranger who has not been helped yet |
| Empty states | Encouraging and instructive, never jolly | Someone at the start of a hard day |
| The daily page | Nearly silent | They are working. Say nothing |
| Closure / end of day | Observational, factual, never congratulatory | "Planned 6h 10m. Spent 5h 40m." |
| Returning after a gap | **Completely neutral. No mention of the gap** | §11.3, fourth rule. This is the most important line in this table |
| The support ask | Plain, once, easy to decline | Asking for money is not the moment to be clever |
| Errors | Matter-of-fact, no apology theatre | "That did not save. Your text is still here." |

## 5. Claims — what may be said, and on what authority

| Claim | Permitted? |
| :--- | :--- |
| "Time-tested", "methods that have worked for a century" | **Yes** — age is a fact |
| Ivy Lee → Charles Schwab, Bethlehem Steel, 1918 | **Yes**, with the attribution |
| Urgent/Important attributed to a 1954 Eisenhower speech, matrix built by Covey | **Yes**, with that hedge intact |
| "Nothing leaves your device" | **Yes** — architecturally true, no server exists |
| "Free, and stays free" | **Yes** — B-37 |
| Gollwitzer & Sheeran (2006), d = 0.65 | **Yes, for if-then planning only.** The single permitted scientific claim |
| Any other efficacy, wellbeing or focus claim | **No** |
| Numbers about how many people use it | **Only at 100+ people**, and only from those who opted into telemetry |

## 6. Writing about free

Free is a position, not a promotion. It follows from ubiquity being the moat,
so the copy should sound settled rather than generous.

- **Say:** *Free. No account. Nothing held back.*
- **Say:** *It stays free.* (settles the obvious suspicion)
- **Say:** *If it earns it, you can support it.*
- **Do not say:** *free forever!*, *100% free!*, *no catch!* — protesting invites
  the doubt it answers
- **Do not say:** *free for now*, *free during beta*, *limited time* — none is true
- **Do not** put a struck-through price next to it. There was never a sale

**The support ask, when it appears:** at the end of a day actually closed, once,
never blocking, quieter on each decline. It names what the person did, not what
the product needs. "You closed thirty days" — never "help us keep the lights on".

## 7. Worked examples

**Hero — on brand**
> **Choose what deserves your attention.**
> Bring the work competing for your day into view. Use Top 3, Ivy Lee, or the
> Urgent/Important Matrix to give it order. Set a realistic time for what comes
> first. Decide One provides the structure. You make the decision and do the work.

**Hero — off brand**
> ~~Unlock your most productive self.~~ *(exhortation, unearned claim, "unlock")*

**Empty state — on brand**
> Three lines. The first one is the one you will actually start.

**Empty state — off brand**
> ~~Ready to crush today? Let's go!~~

**Returning after two weeks — on brand**
> *(the date, three empty lines, and nothing else)*

**Returning after two weeks — off brand**
> ~~Welcome back! You've missed 11 days.~~ *(a reckoning, and a gate violation)*

**The timer — on brand**
> Three tasks at three hours is nine hours. The day does not have nine hours.

**Privacy — on brand**
> There is no account, because there is nothing to log in to. What you write
> stays on this device. It always did.

## 8. Visual register — and one unresolved conflict

The brand model is a **Casio F-91W** — and per `VISION.md` §12.1a that is a
belief about what earns respect, **not an instruction to look cheap**. A
millionaire wears one because it works perfectly, forever, and asks nothing of
them. Craft that makes the product more precise, more durable or easier to read
is on-brand at any level. Decoration that signals expense while adding nothing
is not.

In practice: typographic, monochrome, paper-adjacent. Colour carries meaning
only — red, yellow, green for progress (Rule 3) — never decoration. The
self-hosted Inter Variable face is used throughout; `font-mono` fails the
build (Rule 1). This replaces Helvetica by founder direction, 15 September
2026.

**Open conflict, BR8 / `VISION.md` §12.4.** The Three.js scene, studio renders,
spine curvature and woven twill tag are **Leica register — the opposite of an
F-91W** — and this is logged as unresolved, not settled.

**Resolved 14 September 2026, toward the instrument register** (BR8,
`UI_BRIEF.md` §7.3). The notebook cover and the month illustrations were
retired that day; the rest of the book chrome is listed for retirement.

**What that means for a writer today:** do not write copy that depends on the
craft layer. Describing the renders as proof of quality bets the words on a
decision that has not been made. Write about what the product *does*.

## 9. The tests before anything ships

**0. Would someone who could afford anything still choose this, because it does
the one job better than anything else does?** (`VISION.md` §12.1a.) If the
answer depends on how costly it looks, it is fluff and it goes.

**0a. Would a person who depends on instruments trust this one, and keep it?**
(`VISION.md` §13.) Trust is earned by being right every time in small things,
where nobody is looking — exact alignment, correct numbers, an accurate clock,
every state designed, no console errors. **Ornament is a defect**: on an
instrument panel, anything that is not information is in the way of it.

Copy is held to this too. Precise, unhurried, nothing oversold. The site is part
of the instrument, not an advertisement for it. And **Armstrong, Jobs and Musk
are an internal standard of seriousness, never public copy** — naming real
people implies an endorsement the product has no right to claim.

1. **Would a competent, tired adult find this condescending?** If yes, rewrite.
2. **Could this make someone feel bad on a day they had a bad day?** If yes, cut
   it. This is the §11.3 fourth-rule test and it outranks persuasiveness.
3. **Is every claim in §5 above?** If not, it does not ship.

Then run `npm run test:qc`. Three of the twenty-five rules read copy, and they
fail the build rather than filing a comment.
