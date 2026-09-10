# PRIMACY • Monetization Plan

> **Owner**: `growth-strategy` • **Version**: 1.0.0 • **Date**: September 9, 2026
> Bound by `GROWTH_CHARTER.md`. Read the invariants there first.

---

## 1. The decision

**Neither of the two proposed options. Take the price from option 2 and the generosity from option 1.**

> **Free = today. Patron = every day you've ever had.**

The daily instrument is free forever and complete — write, plan, reflect, search your whole history, export everything, no account, no limit, no timer. The **one-time Patron pass** adds the perspective layer: the weekly review, the monthly and yearly views, multiple volumes, the decision log, the archival exports.

**Price: $39 / ₹999, one-time.** Decided by the founder, September 9, 2026 — see §5.3.

No trial. No expiry. No feature that ever stops working. Nothing about your own past is ever withheld from you.

---

## 2. Why not option 1 (free, pay as support)

A tip jar on a tool with no network effect converts at roughly **0.1–0.5% of engaged users**, and Primacy has no viral loop to compensate — a private journal is by construction the least shareable software category there is. On a realistic first-month audience the expected revenue is two figures.

The deeper problem is positional. Primacy's pitch is a *premium instrument for people making high-stakes decisions*, sold once at a fair price as a rebuke to subscription software. An instrument that asks for tips is not that instrument. The price is doing marketing work here: **$39, once, forever** is the argument against a $49.99/year competitor, and giving it away discards the argument. It also selects for an audience that arrived because it was free.

Free costs nothing to serve — there are no servers — so the objection is not cost. It is that a tip jar earns nothing and says something wrong.

---

## 3. Why not option 2 (paid, 30-day trial) as stated

Thirty days is the *right* number and the wrong mechanism.

The number is right because Primacy's value compounds: streaks, month views, "on this day" recall, and the year index are all worth nothing on day 3 and a lot on day 40. A 7-day trial would show a prospect an empty notebook and ask them to pay for a feeling they have not had yet.

The mechanism is wrong for four reasons:

1. **It ends by taking a person's diary away from them.** On day 31 a user who wrote thirty days of private reflection is locked out of it. That is charter invariant 1, it generates refund demands and public anger, and it is the single most brand-destroying thing this product could do.
2. **A timer converts on elapsed time, not on desire.** It asks at the moment *we* chose. The archive gate asks at the moment *they* reach for something they now want. The second ask converts better and resents less.
3. **It is unenforceable anyway.** With no accounts and no server, the trial clock is a `localStorage` value. Anyone who wants to reset it, will. You get all of the brand cost and none of the enforcement.
4. **It converts once.** Everyone who lapses at day 30 without paying is gone, along with their word of mouth. The archive model keeps a free base that keeps converting at day 60, day 200, and the first time someone wants last year back.

---

## 4. The split

The line is drawn at **today versus history** — not at "basic versus pro", and never through the middle of a daily workflow.

| Free forever | Patron • one-time |
| :--- | :--- |
| The full daily spread — priorities, rapid log, habits, evening reflection | **Weekly Review** spread + the Weekly Briefing PDF |
| **All six frameworks** — the methodology is the soul of the product and is never paywalled | **Monthly Log** and **Yearly Index** views |
| **Search** (`Cmd+K`) across all history, and "On This Day" recall — *see §4A* | **Multiple volumes** — free gets one; Patron gets Strategy / Life / Ventures / Codex |
| Navigation to any past or future date | **Executive Decision Log** |
| Paper editions, dark mode, page-flip, cover, month illustrations, audio, keyboard navigation | Encrypted `.vault` export and the annual archival book |
| Privacy shutter and lock | |
| **Full export of your own data, always, in every state** | |

**Why this split is the whole plan.** It is *self-timing*. A first-day user owns no archive, so every locked surface is describing something they do not yet have and cannot yet miss — the gate is invisible and the free product feels complete, because it is. A day-40 user has forty days behind them, presses `Cmd+K` to find what they decided about something in week two, and meets the gate at the precise moment it names a thing they want. No timer can locate that moment. The user's own accumulated history locates it for us, individually, for each person, at exactly the right time.

It also means the free tier is not a crippled demo. It is a genuinely good free daily journal, which is what earns the word of mouth that a private-by-design product cannot otherwise generate.

### 4A. Why search is free — a revision

The first version of this plan put `Cmd+K` search behind the Patron pass, on the reasoning that search is the most self-timing surface in the product: a day-40 user reaches for it to find what they decided in week two, and meets the gate at the moment of genuine want.

The research in §5A moved it back to free. Two reasons:

1. **No comparable product gates search, and the omission looks deliberate.** Day One, Bear, Craft and Obsidian all draw their line at sync, devices, media or volume — never at reaching your own history. Search is the feature users most assume is free, and withholding it from a person's own private diary edges toward the hostage-taking that charter invariant 1 exists to prevent. Date navigation and export would both have stayed free, so it was never literally a hostage; but it is close enough to it that the brand would have paid for the distinction.
2. **It costs almost nothing to give away.** The remaining paid surfaces — weekly review, monthly and yearly views, multiple volumes, decision log, archival exports — are *equally* self-timing. Every one of them is empty on day 1 and full on day 40. The conversion moment is preserved intact.

The refined principle, which is better than the one it replaces: **the free tier withholds nothing about your past; the Patron pass adds new ways to work with it.** Additive, not restrictive. Everything you have written is always yours to read, search, and take with you; what you buy is the review, the perspective, the separation into volumes, and the archive you can hold.

---

## 5. Price architecture

### 5.1 Why one-time pricing is economically sound here, not just ideological

The standard objection to lifetime licenses is real: you sell your entire future customer base at today's price, and then serve those customers forever at your own cost. Every lifetime buyer is someone who never pays again while continuing to consume support and infrastructure.

**That trap does not close on Primacy.** There are no servers, no accounts, no per-user storage, no sync, no per-seat anything. The marginal cost of an existing Patron is genuinely zero — they run the app on their own machine against their own `localStorage`. This is the structural reason the anti-SaaS position is sound rather than merely a preference, and it is worth stating plainly in public: *we can sell this once because it costs us nothing to keep.*

What is **not** free is development. That is the real constraint, and the release valve that preserves the position is **paid major versions** — the Sublime Text model. Primacy v1 is a lifetime license at $39. In two to three years, v2 is a new purchase with a meaningful discount for v1 owners. Nobody's software ever stops working, no subscription is ever charged, and the business still has a second bite. Commit to this in the license terms *now*, in plain language, so it is never a surprise later.

### 5.2 One tier

A two-tier split was considered — Personal at $39, Professional at $59 with multi-volume, the decision log, and the briefing PDF — and rejected.

Tiering would earn a little more per buyer and cost something worth more than that: a decision at the moment of purchase. Primacy's entire pitch is the removal of decisions that do not deserve to exist. A product whose homepage says *one priority, zero noise* should not open its pricing page with a comparison table.

**One price. One purchase. Everything.** The simplicity of the offer is part of the offer.

### 5.3 The number

The comparison set puts premium one-time productivity software at **$30–100**: Things 3 for Mac $49.99, Sublime Text $99, Agenda ~$25, Tot $20. The original $24 sat at the bottom of that band and anchored Primacy as a small utility rather than an instrument.

Two options were put to the founder. A **ladder** — $24 at launch for low friction while there is no proof to point at, rising to $39 once reviews and a visible base exist — or **$39 held from day one**.

**Decided: $39 from day one.** The ladder trades position for friction, and at launch the buyer Primacy wants is not the one deciding on $15. Holding the price also removes a repricing event to manage and explain later, and it lets every piece of copy make the comparison that does the real work: Day One asks **$49.99 per year**; Primacy asks $39 once. That sentence is stronger at $39 than it was at $24, because it invites the reader to treat the two as comparable instruments rather than as a tool and a toy.

The risk accepted with this choice: fewer impulse purchases in the first weeks, and more weight on `growth-acquisition` to produce visible proof — reviews, named users, a public changelog — earlier than a $24 launch would have required. Track it. If month-one conversion lands far below the ~100 buyers modelled in §6, the diagnosis is missing proof, not the price.

**Decided by the founder, September 9, 2026: $39 from day one.** The ladder was declined in favour of holding the position from launch.

| | Price | Note |
| :--- | :--- | :--- |
| **Patron — global** | **$39 one-time** | Sits squarely in the premium one-time band (Things 3 $49.99, Agenda ~$25, Sublime $99) and anchors Primacy as an instrument rather than a utility. Against Day One at $49.99 **per year**, the one-time $39 pays for itself before month ten and never again after. |
| **Patron — India** | **₹999 one-time** | A PPP factor near 3.5x means ₹1,999 would *feel* like $70–80 locally — a considered purchase. ₹999 feels like $35–40: premium, attainable, and it is the home market where word of mouth starts. |
| **Refund** | **60 days, no questions** | Refund rates at this price run 1–3%. A visible, generous policy removes nearly all hesitation. |
| **Major versions** | v2 in 2–3 years, owner's discount | The anti-SaaS-compatible way to be paid twice; validated in §5A finding 4. State it in the terms now. |

**One operational consequence of $39 / ₹999**: the regional spread is now ~3.4x rather than ~2.1x, which makes arbitrage worth someone's trouble. Not a reason to change either number — Spotify and Netflix run wider spreads — but `growth-revenue-ops` must key regional pricing to billing country as verified by Dodo rather than to anything the browser reports, and should expect a small volume of mismatched purchases. Treat them as a cost of reaching the home market, not as fraud to be fought.

### 5.4 Existing key holders

`PRIMACY-PATRON-2026` is published in `README.md` and `HANDOFF.md` and must be revoked in the signed-key scheme. **Honour anyone already holding it.** The population is small, the revenue recovered would be negligible, and "we grandfathered everyone who found us early" is worth more than the money.

### 5.5 The second revenue line, later

The roadmap's linen-bound printed annual — a physical book of the user's own year, set from their own data. Higher margin, far higher emotion, perfectly on-brand for a stationery product, impossible for a cloud competitor to copy convincingly, and the natural thing to offer someone who has just finished a year of writing.

It also fits the one-time model without straining it: a physical volume is genuinely a new good each year, so charging for it annually is not a subscription in disguise. Not now — it needs a print partner, shipping, and returns before it can be sold. But design the export format so it stays possible.

---

## 5A. Evidence — what comparable tools actually do

Researched September 9, 2026. Five findings, two of which changed the recommendation.

### Finding 1 — Freemium beats trials on the *full* funnel, which reverses my first estimate

Read in isolation, trials look better: freemium converts **2–5%** of free users, opt-in trials **8.9–18.2%**. But conversion rate is the wrong denominator, because a trial suppresses the number of people who enter at all. Measured across the whole funnel, per 1,000 website visitors:

| | Signups | Paying customers |
| :--- | :--- | :--- |
| **Freemium** | 90 | **~5.0** |
| **Free trial** | 45 | ~3.6 |

**This corrects §6 of the previous version of this document**, which estimated the trial winning month one by roughly $600. That was wrong in direction. Freemium produces about **39% more paying customers per visitor**, before counting the referral value of a free base that a trial would have discarded. The trial's apparent advantage was an artefact of measuring conversion against a smaller pool.

### Finding 2 — Nobody gates search, and that is worth taking seriously

Surveying the comparable set, the paywall is drawn at **sync, devices, media, and volume** — never at access to your own history:

- **Day One** — free tier is unlimited entries but **one device, one journal, one photo per entry**; paid ($49.99/yr) adds sync, media, multiple journals. Also sells **printed journals**, discounted for subscribers.
- **Bear** — free is fully functional locally; **iCloud sync** is the paid line ($2.99/mo).
- **Craft** — free capped at 1,000 blocks; paid $9.99/mo.
- **Obsidian** — the app is **free for everyone, including commercial use**; revenue comes entirely from optional *services*: Sync ($4–8/mo) and Publish ($8–16/mo). **~$25M ARR, 7 people, 1.5M MAU, $350M valuation.**

The pattern: **everyone charges for what costs them money to serve.** Sync needs servers, so sync is the line. It is a line users find fair without being told why.

Primacy has no such axis — one device by design, no sync, no servers, zero marginal cost per user. So the industry's standard line simply does not exist here, and something else has to carry the price. But the absence of *any* product gating search is weak evidence that gating search reads as punitive: it is the feature users most expect to be free, and withholding it from a person's own private diary edges toward the hostage-taking that charter invariant 1 forbids — even though export and date navigation would both remain free.

**Consequence: search moves to the free tier.** See §4A.

### Finding 3 — Day-30 retention: the 5% assumption was sound

Median mobile retention runs **26% day 1, 13% day 7, 7% day 30**, with the median app holding **4%** at day 30. A good day-30 rate is 10–25%; above 25% is genuinely strong. The 5% used in the modelling is a fair median assumption, and the upside case is real.

Also directly on point: **note-taking apps retain better than habit trackers "because the note-taking value compounds."** That is the archive thesis, observed in the category.

### Finding 4 — Paid major versions are validated, not theoretical

One developer reported that introducing an annual paid-upgrade fee for outright buyers **nearly doubled the LTV** of one-time customers. §5.1's recommendation stands on evidence, not analogy.

### Finding 5 — The honest counter-argument to one-time pricing

The prevailing indie view: *"if your app's core value is a one-time transformation, a one-time price is honest and sustainable"* — value delivered in bursts, not continuously. **Primacy delivers value continuously**, which by that heuristic argues for a subscription. Lifetime deals are widely called unsustainable.

The reason that objection does not land here is specific and worth stating rather than assuming: the complaint is about **cost to serve** compounding forever against a single payment. Primacy has no servers, no accounts, no sync, no per-user infrastructure. The marginal cost of an existing Patron is genuinely zero. Where cost-to-serve is zero, a one-time price is sustainable in a way it is not for a hosted product — and development, the cost that *is* real, is funded by paid major versions rather than by rent.

**Sources:** [ChartMogul SaaS Conversion Report](https://chartmogul.com/reports/saas-conversion-report/) · [Artisan — Freemium Conversion Benchmarks 2026](https://www.artisangrowthstrategies.com/blog/freemium-conversion-rate-benchmarks) · [ideaplan — Freemium vs Free Trial](https://www.ideaplan.io/compare/freemium-vs-free-trial) · [Day One Plans](https://dayoneapp.com/plans/) · [Day One Pricing Guide](https://dayoneapp.com/guides/premium-subscription/day-one-pricing-features-guide/) · [Obsidian — free for work](https://obsidian.md/blog/free-for-work/) · [Obsidian licensing & business model](https://deepwiki.com/obsidianmd/obsidian-help/9-licensing-and-business-model) · [Obsidian $25M ARR with 7 people](https://finance.biggo.com/news/iVboYp0Bga3fZL9MJEv_) · [Bear pricing](https://costbench.com/software/note-taking/bear/) · [Craft vs Bear pricing](https://www.selecthub.com/note-taking-software/bear-app-vs-craft-docs/) · [App retention benchmarks 2026](https://unstar.app/blog/app-retention-benchmarks-2026) · [Plotline — retention by industry](https://www.plotline.so/blog/retention-rates-mobile-apps-by-industry) · [Indie app revenue models 2026](https://appopportunity.com/blog/indie-app-revenue-models-2026) · [Indie Hackers — subscription vs one-time](https://www.indiehackers.com/post/breaking-down-the-subscription-vs-one-time-purchase-debate-2f89b5a91f)

---

## 6. What it earns, roughly

**Revised against the funnel evidence in §5A finding 1.** Assumptions for a Product Hunt + Hacker News launch: 20,000 landing visits, day-30 active rate ~5% (the category median is 4–7%).

Applying the measured per-1,000-visitor outcomes at $39:

| | Paying customers | Month 1 | The shape after |
| :--- | :--- | :--- | :--- |
| **Tip jar** | ~2 | ~$50 | Flat. Nothing compounds. |
| **30-day trial** | ~72 | ~$2,800 | Converts once. The lapsed base is gone, and some of it is angry. |
| **Free core + Patron** | ~100 | **~$3,900** | Keeps converting a surviving free base at day 60, 90, 200 — and that base grows and refers. |

The previous version of this table had the trial ahead in month one. That was wrong: it compared conversion *rates* rather than outcomes per visitor, which flatters the model that admits fewer people. Corrected, freemium leads on month one **and** on every month after.

These remain order-of-magnitude figures from category benchmarks, not forecasts. Their real lesson is unchanged: moving the day-30 active rate from 5% to 8% is worth more than the entire gap between any two of these models, which is why it is `growth-lifecycle`'s single metric.

---

## 6A. Reach — and why it does not fight the price

The founder's intent (`GROWTH_CHARTER.md` §0) sets two goals that look opposed: **reach the maximum number of people**, and **do not price so low that the tool reads as substandard**.

They are not opposed, because **in this model reach and price are different levers acting on different people.**

Nobody pays $39 to get in. The paid pass is bought by someone who has already used Primacy free for a month or more and wants the review, the perspective, and the archive on top. So the thing that determines reach is **how good the free tier is** — and the free tier is a complete daily instrument with full search over the user's entire history, which is more than Day One, Bear or Craft give away. The price determines only how the work is funded, and it is asked only of people who have already received the value.

This also disposes of the "cheap looks substandard" worry, and in a way worth stating precisely. Price-as-quality-signal is real, but **it only operates when the price is the buyer's first signal.** Here it is their last: they have used the product daily for forty days before they ever see a number. The product has already made the quality argument, far more convincingly than a price could. Primacy is therefore free to be priced fairly rather than defensively — and equally, lowering the price would buy almost no additional reach, because price is not what is keeping anyone out.

**Conclusion: hold $39. Spend the reach effort where it actually works.** In order of leverage:

1. **The free tier itself.** Already the plan, and strengthened by moving search into it (§4A). Every improvement here is a reach improvement. Guard it against future erosion — see the standing limit in `growth-strategy.md` about never moving a shipped free feature behind the pass.
2. **Regional pricing well beyond India.** Currently only ₹999 is set. The same PPP logic applies to Brazil, Indonesia, Nigeria, the Philippines, Vietnam, Egypt, Mexico and more — markets where $39 is a week's wages and where a local-first tool that needs no subscription is *more* useful than it is in San Francisco, not less. This is the **highest-leverage reach lever after the free tier**, it costs nothing but configuration, and it is exactly what "maximum number of people" means in practice. `growth-revenue-ops` to confirm which currencies Dodo supports and propose a table.
3. **A quiet hardship line.** One sentence near the price: *"If $39 is a barrier for you, write to me."* No form, no proof, no means test. It costs almost nothing, a small number of people will use it, and it is the exact expression of the founder's stated ethic. Do not advertise it as generosity; state it plainly and move on.
4. **A team pack, later.** The target user is a founder or executive who has a leadership team. Someone who has used Primacy for three months and wants five colleagues on it is the highest-intent buyer this product will ever have, and serving them costs zero marginal anything. Price it at a genuine discount to five singles, not a premium for the word "team".

**What reach does *not* mean here:** free-with-a-tip-jar (§2), ad support, data sale, or any growth loop that requires the user to expose their journal. A private tool cannot buy reach with its users' privacy, and this one will not.

---

## 6B. On "scientifically grounded" — a caution before it ships

The founder describes Primacy as *based on a scientific framework*. That claim needs care before it appears in public, and `PRIMACY_CREATIVE_BRIEF.md` already says so: *never promise scientifically proven product performance.*

The accurate position, which is still a strong one:

- The six methods shipped are **historical decision practices**, not clinical interventions. Ivy Lee (1918), Eisenhower (1954), Pareto (1896), MoSCoW (1994), 1-3-5, Rule of 3. They are well-tested by use over a century. They have not been through randomised trials.
- There *is* real research adjacent to the design choices — working-memory limits behind a three-priority cap, attention-residue findings behind single-tasking, reflective practice behind an evening review. **Cite research that supports the approach; never imply evidence that Primacy improves outcomes.** The distinction is the difference between credible and actionable-by-a-regulator.
- Preferred phrasing: *"built on decision methods that have been used for a century, and on what research says about attention and working memory."* Honest, specific, and it survives someone checking.

If the founder wants the scientific grounding to be a genuine pillar rather than a line of copy, the work is to source the research properly and cite it on the landing page. That is a real and worthwhile project, and `growth-acquisition` should scope it rather than paraphrase it from memory.

---

## 7. What blocks all of it

Nothing here can be executed today. In order:

| # | Blocker | Where |
| :--- | :--- | :--- |
| 0 | **No version control.** Payment and licensing code with no way to revert. | repo root |
| 1 | **Checkout is simulated** — a 1.5s timer, no money requested or taken. | `PatronUpgradeModal.jsx:77` |
| 2 | **One shared license key**, `PRIMACY-PATRON-2026`, published in `README.md` and `HANDOFF.md`. Every reader of the repo unlocks the product free, and every buyer would get the same key as everyone else. | `licenseManager.js:9` |
| 3 | **"Zero telemetry" claimed while the SDK is live.** The content filter is real and no journal text is transmitted, but the claim as written is false. | `telemetry.js` vs landing copy |
| 4 | **No terms, privacy page, or refund policy.** A merchant of record will require all three. | absent |

**On #2**, the fix that fits a product with no server: sign each buyer's key with an Ed25519 key held offline, ship only the public key, verify with WebCrypto in the browser. Per-buyer, unforgeable, zero network, local-first intact. It remains an honour-system license in the Sublime Text tradition and that is correct — the goal is that a buyer's key is *theirs*, not that copying is impossible. `growth-revenue-ops` owns this.

**On #3**, resolve it in the user's favour: make telemetry opt-in with one honest line, and change the copy to *"your journal never leaves your device"* — which is true, verifiable, and a better sentence than the false one it replaces.

---

## 8. Sequence

1. `git init`, first commit. *(Everything else is unsafe without it.)*
2. Fix the telemetry/consent contradiction — before launch traffic arrives, not after.
3. Signed license keys replacing the shared constant.
4. Real Dodo checkout, tested end to end with real money.
5. Terms, privacy, 60-day refund policy.
6. Build the archive gate and the `archive_gate_hit` event.
7. Rewrite landing copy against verified facts; the free/Patron split becomes the pricing section.
8. Launch: Hacker News and the local-first communities first, Product Hunt second.

Steps 1–5 are `growth-revenue-ops`. Step 6 is `growth-lifecycle`. Step 7–8 are `growth-acquisition`.
