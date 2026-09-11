# PRIMACY • Working Decision Log

> A running record of what was examined, decided, and built — session by session, newest last.
> Kept so that a future session (human or agent) can resume without re-deriving context.
> **Convention**: every session appends. Nothing here is rewritten after the fact; corrections are appended as new entries that say what they supersede.

---

## Session 1 — September 9, 2026

### 1.1 Context established

Read the full documentation set, the source tree, the backend service, and ran the QC suite. Findings that matter for future work:

**What the product is.** PRIMACY (formerly *PocketBook*, originally *Dot-Grid Bullet Journal*) — a local-first, single-viewport digital stationery journal for executives. React 18 + Vite 6 + Tailwind 3, no router, no state library, ~9.5k lines across 40 components. Positioning is anti-SaaS ($24 once), anti-infinite-list (three priorities, not two hundred rows), anti-cloud (data in the browser).

**Structure.**
- `App.jsx` (1,157 lines) is the sole orchestrator — six views selected by `?view=`/hash, plus cover state and a 3D page-flip state machine.
- `useJournalStorage.js` (830 lines) is the real data layer, keyed by "volume" (`vol_strategy`, `vol_life`, `vol_ventures`, `vol_codex`).
- `server/` is a genuine but separate Node service on :4000 — `node:sqlite` WAL, telemetry ingestion, and an analytics engine (DAU/MAU/stickiness, funnels, retention cohorts, rage clicks). Vite proxies `/api` to it. The DB already holds 1.2 MB of seeded data.
- Landing page carries a Three.js notebook scene (`JournalScene.jsx`, 531 lines).

**The agentic structure.** There was no `.claude/` directory and no orchestration code. The "teams" are a *documentation protocol*: docs are briefs addressed to autonomous agents, opening with numbered invariants; `BACKEND_TELEMETRY_FORENSIC_AUDIT_AND_SOW.md` §4 is literally a self-contained prompt for a "parallel backend team"; `website_architecture_and_design_spec.md` is signed by a "Website Development Pod". `scripts/qc_audit.js` (21 gates) is the machine enforcement that keeps independent agents from drifting. Docs = briefs, invariants = constitution, QC gates = CI.

**Docs drift — important.** The repo carries three product generations and the older docs overstate the build. Verified against `src/`:

| Doc claim | Reality |
| :--- | :--- |
| 9 frameworks | **6** exported (Top 3, Ivy Lee, Eisenhower, MoSCoW, 1-3-5, Pareto) |
| IndexedDB + AES-GCM live storage | Plain JSON in `localStorage` (`POCKETBOOK_STUDIO_V1`); crypto is export-only |
| "Zero telemetry, zero trackers" | A live 342-line SDK wired into 17 call sites, beaconing to the local server |
| Dodo Payments rail | Simulated — a 1.5s timer applying `PRIMACY-PATRON-2026` |
| React 19 / Lucide 1.16 | React 18.3.1 / Lucide 0.475 |

`LANDING_PROTOTYPE.md` is the only doc that states this accurately. **Trust it over the others.**

**Other state.** QC passes 21/21. `npm run build` compiles clean. **Not a git repository** — no history, no safety net. `.openai/hosting.json` wires static `dist/` to OpenAI Sites.

### 1.2 Built: the Growth Pod

Created a marketing/growth team as agent definitions, following the repo's existing convention (briefs as documents, invariants as gates, handoffs through files rather than a shared runtime):

- `.claude/agents/growth-strategy.md` — free/paid line, price ladder, regional pricing
- `.claude/agents/growth-acquisition.md` — channels, launch, landing copy
- `.claude/agents/growth-lifecycle.md` — activation, retention, gate timing
- `.claude/agents/growth-revenue-ops.md` — checkout, licensing, refunds, consent; holds a veto
- `GROWTH_CHARTER.md` — shared invariants and division of labour

Boundary rule: *Strategy decides what costs money. Lifecycle decides when the user is asked. Acquisition decides how it is described. Revenue-ops decides whether it may ship at all.*

Charter invariant 1, which everything else defers to: **a user's own words are never held hostage.** Writing, reading and export stay free forever in every state of the product.

### 1.3 Decided: the monetization model

Considered three models against the two the founder proposed.

**Rejected — free with a tip jar.** Tip jars convert at 0.1–0.5% of engaged users and a private journal has no viral loop to compensate; expected month-one revenue is two figures. Positionally worse: "$24, once, forever" is the argument against a $12/month competitor, and giving the product away discards the argument.

**Rejected — $24 with a 30-day trial.** Thirty days is the right number and the wrong mechanism. It ends by taking a person's diary away on day 31 (charter invariant 1); it converts on elapsed time rather than desire; it is unenforceable in a no-account local-first app because the clock is a `localStorage` value; and it converts once, burning the lapsed base.

**Adopted — free core, paid archive.** *Free = today. Patron = every day you've ever had.* The daily instrument is free forever and complete, including all six frameworks. $24 once unlocks the archive layer: search across history, weekly/monthly/yearly views, multiple volumes, decision log, archival exports.

The load-bearing property is that the split is **self-timing**. A day-1 user owns no archive, so every gated surface names something they do not have and cannot miss — the free product feels complete because it is. A day-40 user presses `Cmd+K` to find what they decided in week two and meets the gate at the exact moment it describes something they now want. No timer locates that moment; the user's own accumulated history locates it, individually, for each person.

Rough month-one comparison (20k launch visits, ~25% open, 5% day-30 active): tip jar ~$40, trial ~$1,800, archive gate ~$1,200. The trial wins month one by ~$600 and loses every month after. Noted at the time: **moving day-30 retention from 5% to 8% is worth more than the entire gap between the models** — which is why that became Lifecycle's single metric.

Full reasoning in `MONETIZATION_PLAN.md`.

### 1.4 Blockers recorded

Primacy cannot take money today. In order:

| # | Blocker | Where |
| :--- | :--- | :--- |
| 0 | No version control | repo root |
| 1 | Checkout is simulated | `PatronUpgradeModal.jsx:77` |
| 2 | One shared license key, published in `README.md` and `HANDOFF.md` | `licenseManager.js:9` |
| 3 | "Zero telemetry" claimed while the SDK is live | `telemetry.js` vs landing copy |
| 4 | No terms, privacy page, or refund policy | absent |

For #2, the fix that fits a serverless product: **Ed25519-sign each buyer's key offline, ship only the public key, verify with WebCrypto in-browser.** Per-buyer, unforgeable, zero network, local-first intact. Reviewed `background remover`'s `packages/payments/src/provider.ts` — its discipline transfers (*"a browser redirect is never treated as proof of payment"*), its architecture does not, since it assumes a server, webhooks and a user row this product has neither of.

### 1.5 Recorded to the central library

Appended to `~/.claude/library/LEDGER.md` and three rows to `CAPABILITIES.tsv`: the **self-timing paywall** pattern, the **offline signed license** pattern, and the **growth pod charter** structure.

### 1.6 Open

- **Pricing specifics** — the model is settled; the number, regional pricing, and launch ladder are being decided now (§1.7 below, pending founder input).
- **Framework/stack review** — raised by the founder and deliberately deferred until pricing is settled. Question on the table: is React + Vite + Tailwind the right foundation, or does reaching "world-class centre of excellence" need a different stack? Not yet answered.

### 1.7 Pricing specifics — analysis

Extended `MONETIZATION_PLAN.md` §5 with the pricing architecture proper. Key arguments developed:

- **The usual lifetime-pricing trap does not apply here.** Selling a lifetime license is dangerous when serving a customer costs money forever. Primacy has no servers, no accounts, and no per-user infrastructure — the marginal cost of an existing Patron is genuinely zero. This is a structural argument for one-time pricing that is specific to this product, and it is the strongest reason the anti-SaaS position is economically sound rather than merely ideological.
- **But development is not free**, which is the real constraint. The release valve that preserves the position is **paid major versions** (the Sublime Text model): v1 lifetime at $24, v2 in two to three years as a new purchase with an owner's discount. Recurring-ish revenue without a subscription.
- **One tier, not two.** A Personal/Professional split was considered (multi-volume as the Pro differentiator) and rejected: single-tier pricing is a *brand* decision that matches "one priority, zero noise". *One price. One purchase. Everything.*
- **$24 vs $39 is a proof question, not a value question.** The comparable premium one-time productivity apps sit at $30–100 (Things 3 $49.99, Sublime $99, Tot $20, Agenda ~$25). At launch, with no reviews and no track record, price for low friction. After proof exists, price for position.
- **India at ₹999, not ₹1,999.** PPP factor of roughly 3.5x means ₹1,999 *feels* like $70–80 to an Indian buyer — a considered purchase, not an impulse. ₹999 feels like $35–40: still premium, still attainable, and it is the founder's home market where word of mouth starts.
- **60-day no-questions refund.** Refund rates at this price point run 1–3%; a visible generous policy removes hesitation at a price too low to justify deliberation.
- **Grandfather existing `PRIMACY-PATRON-2026` holders.** The key is public, the number of holders is small, and the goodwill is worth more than the recovered revenue. Revoke it in the new signed-key scheme and honour anyone already holding it.

### 1.8 Pricing decisions locked

Founder decisions, September 9, 2026:

- **Global price: $39 one-time** (declined the $24→$39 ladder; holds the position from launch).
- **India price: ₹999 one-time.**
- **Model: deferred pending research** — the founder asked for a survey of comparable tools before locking it.

Recorded consequence of the $39/₹999 pair: the regional spread widens from ~2.1x to ~3.4x, making arbitrage worth someone's trouble. Not a reason to change either number, but `growth-revenue-ops` must key regional pricing to Dodo-verified billing country rather than anything the browser reports, and should treat a small volume of mismatched purchases as a cost of reaching the home market rather than as fraud.

### 1.9 Research and two corrections

Surveyed comparable products and conversion evidence (sources listed in `MONETIZATION_PLAN.md` §5A). Five findings; two changed the plan.

**Correction 1 — the month-one revenue estimate in §1.3 was wrong in direction.** It compared conversion *rates*, where trials (8.9–18.2%) beat freemium (2–5%). Measured per 1,000 website visitors, which is the honest denominator, freemium produces ~90 signups and **~5.0 paying customers** against a trial's 45 and **~3.6** — freemium yields roughly **39% more paying customers**, because a trial suppresses how many people enter at all. Freemium now leads in month one *and* after. The revised table is in §6. The earlier "trial wins month one by ~$600" figure is superseded and should not be quoted.

**Correction 2 — search moves to the free tier.** Surveying Day One, Bear, Craft and Obsidian, every one draws its paid line at **sync, devices, media or volume** — none gates access to a user's own history. The pattern is that products charge for what costs them money to serve, which is why sync is the near-universal line. Primacy has no such axis (one device by design, no servers, zero marginal cost), so something else must carry the price — but the complete absence of any product gating search is weak evidence that doing so reads as punitive, and it sits uncomfortably close to charter invariant 1. Search, "On This Day", and navigation to any date are now free; the Patron pass carries the weekly review, monthly and yearly views, multiple volumes, the decision log, and the archival exports. Those are equally self-timing, so the conversion moment survives intact.

Refined principle, better than the one it replaces: **the free tier withholds nothing about your past; the Patron pass adds new ways to work with it.** Additive, not restrictive.

**Findings that confirmed existing reasoning:**
- Day-30 retention: category median is 4–7%, so the 5% modelling assumption was fair. Note-taking apps retain better than habit trackers *because the value compounds* — the archive thesis observed in the wild.
- Paid major versions are evidenced, not analogical: one developer reported an annual paid-upgrade fee for outright buyers nearly doubling their LTV.
- Obsidian is the structural proof that local-first can be a large business: app free for everyone including commercial use, revenue entirely from optional services, ~$25M ARR on 7 people and 1.5M MAU.

**The honest counter-argument, recorded so it is not rediscovered later:** the prevailing indie view is that one-time pricing suits products delivering value *in bursts*, and that lifetime deals are unsustainable for products delivering value continuously — which Primacy does. That objection is about **cost to serve** compounding against a single payment, and Primacy's is zero. Where cost-to-serve is zero, one-time pricing is sustainable in a way it is not for a hosted product, and development is funded by paid major versions rather than rent.

**Still open:** the model itself is now recommended on evidence but not yet confirmed by the founder.

### 1.10 Founder's intent recorded — and the reach/price question it raised

The founder set out the purpose behind the tool: something simple, minimal, aesthetic and grounded in real thinking about how people work, aimed at executives and founders; distributed to the **maximum** number of people so it genuinely adds value; funded by a **fair portion, not a greedy one**, enough to pay for updates and for building further tools — and explicitly, **charging less must not signal a substandard product.**

Recorded verbatim as `GROWTH_CHARTER.md` §0, which now outranks any tactic that conflicts with it. Three operating consequences written into the charter: reach is a goal rather than a byproduct; the revenue target is *sufficiency*, not maximisation; and quality is signalled by the product, never by the price.

**The apparent tension — maximum reach vs. not looking cheap — dissolves under this model, and the reason is worth keeping.** Nobody pays $39 to get in. The pass is bought by someone who has already used Primacy free for a month or more. So reach is determined entirely by the quality of the **free tier**, and price only determines how the work is funded, asked of people who already received the value.

The same structure disposes of the "cheap looks substandard" worry. Price-as-quality-signal operates only when price is the buyer's *first* signal; here it is their *last*, arriving after forty days of daily use. The product has already made the quality argument. Which also means the reverse: **lowering the price would buy almost no additional reach**, because price is not what keeps anyone out.

**Decision: hold $39 / ₹999.** No change. Reach effort redirected to four levers where it actually works, written up as `MONETIZATION_PLAN.md` §6A:

1. **The free tier itself** — already generous, strengthened by moving search into it. Guard against future erosion.
2. **Regional pricing well beyond India** — the highest-leverage reach lever after the free tier, currently unexploited. Brazil, Indonesia, Nigeria, Philippines, Vietnam, Egypt, Mexico. Costs nothing but configuration. `growth-revenue-ops` to confirm Dodo's supported currencies and propose a table.
3. **A quiet hardship line** — *"If $39 is a barrier for you, write to me."* No form, no proof, no means test.
4. **A team pack, later** — a founder putting five colleagues on it is the highest-intent buyer this product will have, at zero marginal cost.

Explicitly out of bounds for reach: tip jars, ads, data sale, or any growth loop requiring users to expose their journals.

**New risk flagged — the "scientific framework" claim** (`MONETIZATION_PLAN.md` §6B). The six shipped methods are *historical decision practices* (Ivy Lee 1918, Eisenhower 1954, Pareto 1896, MoSCoW 1994, 1-3-5, Rule of 3), not clinically validated interventions, and `PRIMACY_CREATIVE_BRIEF.md` already forbids promising scientifically proven performance. Real research does sit adjacent to the design choices — working-memory limits behind the three-priority cap, attention residue behind single-tasking, reflective practice behind the evening review — so the defensible phrasing is *"built on decision methods used for a century, and on what research says about attention and working memory."* Cite research supporting the *approach*; never imply evidence that Primacy improves outcomes. If the founder wants this to be a genuine pillar rather than a line of copy, sourcing and citing the research properly is a real project and is not yet scoped.

**Still open:** the model itself remains recommended-but-unconfirmed; the framework/stack review from §1.6 is still parked.

### 1.11 Strategic provocation and naming — `STRATEGY_AND_NAMING.md`

Founder noted that the **Primacy** name and creative brief originated in Google Antigravity, without the project context established in §1.1, and asked for better candidates now that context exists. Also requested: how Jobs or Musk would run the company.

**Jobs/Musk exercise.** The observation both would make first: *a product called PRIMACY ships six competing prioritisation frameworks* — a choice about how to choose, offered before any choice is made. The product has not taken its own advice. Where they diverge (price, platform, timing, analytics) they diverge irreconcilably, so the instruction lies in what they agree on: delete 60–80% of surface area; the current state — polished, 21 gates passing, three doc generations, **unshipped, no git, fake checkout** — is itself the failure; one sentence or you do not have a product. Caveat recorded: both ran capitalised companies with distribution, and some of their moves work only at that scale.

**Naming.** Confirmed there is no extensive naming discussion in the repo — a single paragraph in `PRIMACY_CREATIVE_BRIEF.md`, which itself calls Primacy the *working* masterbrand and invites unverified alternates. Renaming is sanctioned.

Diagnostic against the category winners (Obsidian, Bear, Craft, Things, Tot, Agenda, Notion, Reflect, Roam, Drafts, Arc, Linear): they are **concrete nouns, one or two syllables, non-descriptive, and ownable in speech** ("it's in Bear"). Primacy fails all four — a three-syllable Latin abstraction naming a philosophy rather than an object. For a product whose whole argument is that software should feel like a physical instrument, being named like a thesis is a real mismatch.

Recommended: **Quire** (a quire is 24 sheets of paper; the design system is a 24px grid — resonance that reads as discovered rather than constructed), with **Daybook** as the safe alternative (the accounting term for the *book of first entry* — it means both "primacy" and "journal" without using either word). Full tiered list of 16 candidates in `STRATEGY_AND_NAMING.md`.

Constraint carried forward: the brief bans "the two excluded category words" from all visible copy and metadata. They are never spelled out; from QC gates 17 and 21 they are almost certainly **bullet** and **journal**. Candidates avoid both roots — but this inference should be verified with the founder.

**Nothing is cleared.** Trademark search, domain, and App Store name availability all outstanding before any commitment.

### 1.12 Naming logic documented in full

Expanded Part 2 of `STRATEGY_AND_NAMING.md` from a candidate list into a reusable method, at the founder's request. Now §2.1–2.11:

- **§2.2 The rubric** — seven weighted criteria (concrete, short, sayable, ownable, resonant, locative, ageless), each with a stated test. Failing *concrete*, *sayable* or *locative* disqualifies regardless of other scores.
- **§2.4 Five territories** — candidates were generated systematically, not free-associated: the material (paper/binding), the page (anatomy of an open spread), the instrument (measurement/navigation), the mark (committing), and primacy-without-the-Latin. Territories 1 and 2 are strongest because they are specific to *this* product rather than to productivity software generally; territory 3 is crowded; territory 5 risks repeating Primacy's original error of naming the thesis.
- **§2.5 Rejected patterns** — suffix formations (`-ly`/`-ify`/`-io`), portmanteaus, descriptive compounds, domain-driven misspellings, the two excluded roots, and Latin abstractions (the specific failure being corrected).
- **§2.7 Scorecard** — all 16 candidates scored 1–5 against the rubric. **Quire 34, Daybook 32, Signet 31, Recto 31, Nib 30. Primacy scores 17** — 1 on *concrete* (nothing to picture) and 1 on *locative* (*"it's in Primacy"* does not parse as a place). That 17-against-34 gap is the whole argument.
- **§2.8 Five tests before committing** — phone test, sentence test, search test, wordmark test, clearance test. Only clearance can veto, and it runs first.

**§2.9 is the decision-forcing section — the renaming window closes at launch.** Measured in the codebase today: **105 brand references** across `src/` and `index.html`; two prior renames already carried as legacy shims (`BUJO_STUDIO_V1` → `POCKETBOOK_STUDIO_V1`, still read at `useJournalStorage.js:481`, and `POCKETBOOK_PATRON_LICENSE` → `PRIMACY_PATRON_LICENSE`); QC gates 17 and 21 hardcode banned brand strings.

Notable: **the data layer was never actually renamed.** The app is called Primacy but stores under `POCKETBOOK_STUDIO_V1`, `POCKETBOOK_ACTIVE_VOLUME_ID`, and telemetry ids `pocketbook_anon_id` / `pocketbook_sess_id`. That is correct practice and the creative brief mandates it — *"keep persisted IDs compatible when changing labels"* — which means a third rename costs roughly **one day**: swap display strings, leave persisted keys untouched behind the existing shim, add the new license prefix while honouring the old ones, update two QC gates.

That estimate holds only until the first sale. Afterwards every sold license key, review, backlink and screenshot fixes the old name in public, and the rename becomes a permanent second identity rather than a day of work. **Now-or-never, and "now" ends at the first sale.**

**Correction carried into `growth-revenue-ops.md`:** blocker 2 previously said the license whitelist holds a single shared key. It holds **six** — `PRIMACY-PATRON-2026`, `PRIMACY-VIP-2026`, `POCKETBOOK-PATRON-2026`, `POCKETBOOK-VIP-2026`, `FOUNDER-LIFETIME-PASS`, `EXECUTIVE-PATRON-ACCESS` — one published in the README, all six readable in the shipped bundle. The blocker is slightly worse than recorded, not better.

### 1.13 Scale plan to 1M users — `SCALE_PLAN.md`

**The honest finding: 1M actives is above the ceiling of the current positioning.** Working the funnel backwards from "executives and founders" — 50–100M globally, ~5–10% who would try a productivity journaling tool, ~5–10% surviving to day 30 — gives a saturation ceiling of roughly **250K–500K**. Not a copy problem; an addressable-market problem.

Three ways to close the gap: **(A)** widen the audience to *anyone who has to decide what matters today* — the product does not change by a pixel, only the copy does; **(B)** redefine the metric to 1M triers rather than 1M day-30 actives; **(C)** count across a portfolio of tools, which fits the founder's stated intent and funding model. Recommended: A now, C as the long game. The dilution risk in A is managed the way Things, Linear and Superhuman manage it — *speak to the executive, sell to everyone*: keep the register serious, never say a word that excludes a student.

**The binding constraint is that this product has no viral loop.** Nobody shares their diary. Every product at a million users has a loop, and channels do not substitute for one. Available loops that do not violate the privacy promise, in order: the **Victory Card** (`DailyVictoryCardModal.jsx`, already built — shares a score and streak, never content; the single most underused asset in the codebase), **gift a pass** (`GiftAccessModal.jsx`, already built, buried), the **printed annual**, and **method sharing** (people share systems, never entries). Build the loops before spending a day on channels.

Channels ranked for a founder who will not buy ads: **framework SEO** first — six interactive no-signup tool pages for Eisenhower, Ivy Lee, 1-3-5, Pareto, MoSCoW and Rule of 3, each answering a durable high-intent query, compounding forever at zero cost. Then **platform distribution** — App Store, Play Store, Mac App Store are the largest free discovery engines in this category and a web-only product forfeits them entirely; Capacitor or Tauri wrapping the existing React app is days of work. Noted: this converges with the Jobs "native app" conclusion from §1.11 by an unrelated route — craft there, distribution here — and when two independent arguments land on the same action, take it. Then **India as beachhead rather than afterthought**, then **localisation**. The local-first communities launch you to ten thousand and cannot reach a million.

Sequencing: Phase 0 → one real user (weeks). Phase 1 → 10K (3–6 months). Phase 2 → 100K (12–18 months). Phase 3 → 1M (2–4 years). **Honest horizon: four to six years**, anchored on Obsidian taking roughly six years to ~1.5M MAU in a larger category.

Closing note recorded in the document: every phase is worth nothing until Phase 0 is done, and a million-user plan written for a product that has never shipped is the most seductive form of procrastination available. The most valuable thing that could happen this month is one stranger using it and saying what they think.

### 1.14 The self-explaining name — `STRATEGY_AND_NAMING.md` Part 3

Founder asked for a name that works **without marketing**, explains the problem, and justifies the purpose. Recorded explicitly: this is a **different brief** from Part 2, not a refinement of it.

Part 2 optimised for the category convention — Obsidian, Bear, Craft, Things — which are **brand names**: concrete, evocative, deliberately *non*-descriptive, acquiring meaning through marketing in exchange for ownability and headroom. The new brief asks for the opposite class, the **self-explaining name**: Calm, Freedom, Forest, Streaks, Superhuman, Basecamp, Linear. Trade-off table written into §3.1; the short version is that self-explaining names buy instant free comprehension and pay for it in trademark strength, search rank, and headroom. Given the founder's constraints — maximum reach, no marketing spend — that is the correct trade, made knowingly.

Added an **eighth rubric criterion, self-explaining**, which re-ranks everything. Quire still leads on raw total (35) but scores **1** on the new criterion, a direct failure of the stated brief — it is the right name for a company that will invest in a brand, and the wrong one for a company that needs the name to work unpaid. Primacy scores 19.

**Recommended: Foremost.** It states the entire purpose in one dignified word, needs no story or launch copy, carries the executive register without excluding a student, and converts into the product's own daily question — *"What's foremost today?"* Alternatives recorded: **Fewer** (bolder, more opinionated, negative-framing risk), **Three** (maximum literalness, but unownable and it permanently caps the product at three priorities), and **Quire** if the brand path is ever chosen instead. **Cardinal downgraded** — a web search confirmed at least two existing productivity/PM tools already use it.

**Honest limit recorded in §3.5:** the purpose has two halves — *decide what matters* and *it stays yours* — and no single word carries both. The name takes the first, the descriptor takes the second: **"Foremost — three things a day, yours alone."** Eight words covering method, constraint, privacy and the anti-SaaS stance, at no marketing cost.

Clearance still outstanding for every candidate, and §2.9 still governs timing: the renaming window closes at the first sale.

### 1.15 Wider self-explaining name field — `STRATEGY_AND_NAMING.md` §3.7–3.10

Founder confirmed **Foremost** as the right direction and asked for more candidates in the same vein. Generated by sub-territory, grouped by *what the name says*: (1) "this is the most important thing" — Utmost, Paramount, Chief, Salient; (2) "this is the decisive point" — Crux, Linchpin, Mainstay; (3) "few, not many" — Fewer, Only, Vital, The Few; (4) "the day is decided" — Resolve, Decided, Enough; (5) "reduce it down" — Distill, Winnow, Shortlist.

**Scored against the eight criteria, Crux (34) edges Foremost (31), and the reason is grammatical.** Foremost is an *adjective* — it describes a quality, so there is nothing to picture and it resists the locative test (*"it's in Foremost"* is tolerable, not natural). Crux is a *noun*: the decisive point everything turns on. It pictures, takes the preposition cleanly, is one syllable rather than two, and says the same thing with more edge.

Foremost retains one real advantage — **plainness**. It is instantly understood by every English speaker including non-native ones, where *crux* is mid-frequency vocabulary. Given `SCALE_PLAN.md` §1.2 sets a widened global audience as the route to 1M, that advantage is material and Foremost remains fully defensible.

Position recorded: **Crux** for edge and distinctiveness; **Foremost** for universal plain comprehension; **Utmost** as the compromise (same instant comprehension, warmer, marginally more ownable, and it carries *effort* alongside importance); **Mainstay** as the sleeper — the only candidate on any list that implies *dependability*, which is what a daily instrument actually earns over years.

Collisions noticed during generation and recorded in §3.10 — **not clearance**: Paramount (Paramount Pictures, effectively unusable), Resolve (DaVinci Resolve owns the search results), Linchpin (Seth Godin book), Cardinal (two existing productivity tools, confirmed earlier), Vanguard and Prime (rejected before scoring). No obvious blocker noticed for Crux, Utmost, Mainstay, Vital or Chief — which is explicitly *not* the same as clear.

Descriptor from §3.5 is name-agnostic and still stands: **"— three things a day, yours alone."**

### 1.16 The benefit lane, and the three-lane synthesis — `STRATEGY_AND_NAMING.md` §3.11–3.14

Founder asked for names that **drive the benefit to the user**. Recorded as a distinct third lane, separated precisely from the second:

| Lane | Says | Software precedent | Candidates here |
| :--- | :--- | :--- | :--- |
| **Brand** (§2) | what it is *like* | Obsidian, Bear, Craft | Quire, Daybook, Signet |
| **Purpose** (§3.3–3.9) | what the product *does* | Linear, Basecamp, Superhuman | Foremost, Crux, Utmost |
| **Benefit** (§3.11–3.13) | what the user *gets or becomes* | Calm, Headspace, Freedom, Forest | Margin, Clearing, Steady |

The benefit lane has the best commercial record of the three, for a reason older than software: **people buy the outcome, not the mechanism.** Calm outsold every app named after meditation; Freedom outsold every blocker named after blocking. The name carries the whole value proposition before any copy is read — precisely the founder's requirement that the name work without marketing. Its weakness is the mirror of that: benefit words are common and emotionally loaded, so ownability in this lane is consistently the weakest.

Candidates generated by benefit promised: *breathing room* (Margin, Clearing, Room, Latitude); *becoming steady* (Steady, Settled, Composed, Assured); *making progress* (Onward, Strides, Headway, Ground); *a day well spent* (Wellspent, Worthwhile, Grip).

**Standout: Margin (33), for the same reason Quire led the brand lane — found resonance.** It names the benefit (breathing room, slack, space to think) *and* a physical feature of the object the product imitates (the blank edge of a page that makes writing legible). The only candidate in the whole exercise operating in two lanes at once. *"Keep a margin in your day"* is a complete product philosophy in six words, carried by the name alone. Real risk is collision of **meaning, not trademark** — finance (profit margin, margin call) and the CSS property every developer types daily; the page reading should dominate in a stationery context, but §2.8's search test must confirm it. **Runner-up: Clearing (33)** — same score, no collisions, more ownable, marginally more poetic and less immediate.

**Three-lane synthesis recorded in §3.14.** The choice is not taste; it is one question:

- *"I will build a brand over years"* → **Quire** (35) — most ownable, most headroom, needs marketing to mean anything.
- *"The name must say what the product does"* → **Crux** (34) or **Foremost** (31) — Crux sharper, Foremost plainer and better travelling internationally.
- *"The name must say what the user gets"* → **Margin** (33) — sells outcome over mechanism, plus a second physical meaning free.

The founder's stated constraints (maximum reach, no marketing spend, a name that justifies the purpose) point at lanes 2 and 3 over lane 1; between those, the benefit lane has the better commercial record. **Single answer if forced: Margin, with Crux as the sharper alternative and Foremost as the safest.** Nothing cleared; §2.8 tests and §2.11 clearance still outstanding, and §2.9's timing rule still governs — the window closes at the first sale.

### 1.17 The "Priority" family — `STRATEGY_AND_NAMING.md` §3.15

Founder asked whether *Priority*, or wordplay around it, could work as the name.

**The finding that outranks the naming question: the word carries the best brand story in the whole exercise.** "Priority" entered English in the 1400s meaning *the single thing that comes before all others* — singular by definition — and **had no plural for roughly five hundred years**. "Priorities" appears only in the 1900s, and the moment the word could be pluralised it stopped meaning anything. This states the entire product thesis in one true, memorable, repeatable historical fact, and it justifies the purpose in exactly the way the founder asked for in §1.14. **It should go on the landing page whichever name wins.**

**The bare word, however, is the weakest candidate discussed anywhere — 23 points.** Three problems: (1) it is the *generic term for its own category*, and trademark law treats generic/merely-descriptive marks in their own class as unregistrable or very weak, meaning a competitor could likely use it freely — flagged as needing counsel rather than my assessment, but the doctrine is well established; (2) search is hopeless against generic volume from project management, shipping, healthcare and email; (3) four syllables, in a field whose winners are one and two.

Wordplay assessed: **Singular (31)** — best of the family, carries the etymology directly and doubles as "exceptional", ownable and comprehensible. **Prior (28)** — short and real, means precedence, secondary monastic sense quietly apt, but reads oddly as a place. **Priori (27)** — premium sound, highly ownable, but abstract and fails the self-explaining brief. **The Priority (27)** — the article genuinely restores the singular, but is dead weight in a wordmark. *Prio* rejected under §2.5.

**Closing observation recorded in §3.15.4: Primacy is already a Priority-family name** — the Latin abstract noun for the same idea. So this territory returns to where the naming began, and §2.3's diagnosis applies to nearly every candidate in it: *Priority, Primacy, Priori, Precedence* all name a quality nobody can picture, which is the exact failure the exercise set out to correct. Singular escapes it only partly, by carrying a story the others do not.

**Recommendation: do not name it Priority; do take the story.** Landing-page paragraph drafted in §3.15.5. If a name from this family is wanted regardless, **Singular**.

### 1.18 Integrating the model into the name — `STRATEGY_AND_NAMING.md` §3.16

Founder asked whether the business model and everything else discussed could be integrated into a single name. Seven ideas were on the table: the three-a-day constraint; the singular-priority etymology; private and local; pay once own forever; free-today/paid-perspective archive; the benefit (breathing room, steadiness); and the physical-instrument thesis.

**Finding: a name carries one idea well, two at a stretch, never seven.** Every attempt to load more produces either a phrase or an empty coinage — and that failure mode is precisely why Primacy underperformed. It named a philosophy and ended up naming nothing picturable. So the question was reframed to *which word carries the most, and how the rest get carried.*

Scored by ideas carried: **Codex 3½** (permanence, ownership, the compounding archive, the physical object — already in the codebase as `vol_codex`; misses the method entirely, and risks fantasy-genre drift), **Trove 3**, **Mainstay 3**, then Quire, Margin and Crux at 2½ each.

**Near-miss recorded so it is not re-argued later: Keep.** The best-integrated candidate found anywhere — *to keep a journal* (the idiomatic verb), *a keep* (castle stronghold — privacy and sovereignty), *for keeps* (permanent, one payment), *keeping* (the daily practice); noun and verb at once, one syllable, perfect locative. Carries five of seven. **Google Keep makes it commercially unusable.**

**The actual answer, §3.16.4: the model does not belong in the wordmark, it belongs in the line under it.** A name + descriptor + price line carries all seven ideas uncompromised in twelve words:

> **Margin** / *Three things a day, yours alone.* / *$39 once. Never a subscription.*

Name carries benefit + the physical page; descriptor carries the constraint and the privacy; price line carries the model. Substitute any finalist and the structure holds — the name is one element of a system, not the system.

**Recommendation: stop searching for the total name — it does not exist, and looking for it is what produced Primacy.** Choose on the single idea most worth owning: *what the user gets* → **Margin**; *what the product does* → **Crux**; *what you own forever* → **Codex**; *what it is like* → **Quire**. Standing recommendation unchanged at **Margin**, since the benefit lane has the best commercial record and Margin alone earns a second meaning for free. The model is carried by the price line, where a number and a promise state it more strongly than any metaphor could.

### 1.19 Fresh name field — five new territories — `STRATEGY_AND_NAMING.md` §3.17–3.20

Founder rejected the existing shortlist as too narrow. Noted: earlier sections had been recirculating a small set (Quire, Margin, Crux, Foremost, Codex). Five previously unmined territories worked properly:

- **A. Judgment and assay** — reframing the product's real act as *testing what deserves the day*, not writing. Touchstone (the stone used to test gold's purity — literally the standard everything is judged against), Measure, Weigh, Assay, Gauge.
- **B. Orientation** — Bearing, Lodestar, Heading, Footing.
- **C. Steadiness** — Ballast, Pillar, Bedrock.
- **D. Rhythm and the daily office** — Cadence, Hours, Compline, Tempo. Recorded here because a **Book of Hours** — a private, individually made daily devotional volume kept for life, and the most widely owned book of the late medieval period — is the closest historical ancestor this product has and had gone completely unexamined.
- **E. Small measures** — Dram, Scruple, Ounce.

**Ballast scores 34, tying Crux for the highest in the entire exercise**, and is the most *concrete* name yet proposed — a physical object with one unmistakable job: the weight low in the hold that keeps a ship upright, the thing that makes a vessel stable enough to carry any cargo at all. Highly ownable, ages perfectly. **Risk flagged: the negative colloquial sense — "just ballast" meaning dead weight.** The nautical reading dominates and product context reinforces it, but this is exactly what §2.8's phone test exists to catch, and it must be tested on strangers before committing.

**Lodestar (33)** — the fixed point you navigate by when everything else moves; very ownable and genuinely beautiful, but grander than the product's understated register and a compound in a field of single syllables.

**Bearing (32)** — the quiet, sophisticated option, and the only name found anywhere in this exercise meaning **both a direction and a quality of character**, which is the exact double the product wants.

Running leaderboard across all lanes recorded in §3.20: Quire 35 · **Ballast 34** · Crux 34 · **Lodestar 33** · Margin 33 · Clearing 33 · **Bearing 32** · **Touchstone 32** · Utmost 32 · Foremost 31 · *Primacy 19*.

### 1.20 The role lane — naming the person, not the object — `STRATEGY_AND_NAMING.md` §3.21

Founder asked what to call **the person who helps you prioritise** — one who hands you a framework, watches you write in the instrument, and sees you finish — and separately, what to call one who has completed his task. A sixth naming lane, with a long software tradition (Copilot, Alfred, Butler, Otto, Jarvis).

**Direct answer: *marshal*.** A marshal is the officer who puts things in their proper order, and uniquely the word is *also the verb for the act* — **to marshal** is to arrange in order, to gather and array for a purpose. The person and the action share one word, which is rare. For the second question, the best word is **adept**: one who has attained mastery — it implies the task is done *and* that doing it changed you, where "finisher" is mechanical, "achiever" corporate and "victor" combative.

Field and scores: **Marshal 32 · Steward 32 · Adept 31 · Reeve 30 · Curator 28 · Adjutant 28 · Preceptor 28 · Seneschal 26.** Notable entries — *Preceptor* is the most literal fit (it means *one who gives precepts*, i.e. one who hands you a framework); *Adjutant* is the aide who keeps the schedule and holds the priorities but never commands, which is precisely the product's relationship to its user; *Reeve* is Old English for an overseer, five letters and extremely ownable.

**The finding that governs the whole lane, §3.21.4: a product named after a helper-person reads in 2026 as an AI assistant.** Marshal, Steward, Curator and Adjutant all promise something that answers, suggests and acts on your behalf. This product does none of that — no AI, no cloud, no suggestions — and its thesis is explicitly that *software does not execute; the human executes*. Naming it for a person sets an expectation the product breaks in the first thirty seconds.

Two ways through: pick a role word archaic enough not to trigger the frame (**Reeve**, **Seneschal**), or — the stronger move — **give the role to the user rather than the software**. *Adept* names who you *become* by using it: flattering, accurate, impossible to mistake for a chatbot, and aligned with the benefit lane that has the best commercial record.

Recommendations: the honest answer to the question asked is **Marshal**; the best name from the lane is **Reeve**; the better idea inside the lane is **Adept**. None overtake Quire (35), Ballast (34) or Crux (34) on the running leaderboard. **The lane's real contribution is the reframe: this product has no helper in it, and the name should not imply one.**

### 1.21 Naming restarted as a process — `STRATEGY_AND_NAMING.md` Part 4

Founder reported nothing was landing. **Diagnosis accepted and recorded: sixty-plus names had been generated across eight lanes with no brief.** A name is chosen by elimination against a brief, not by scoring; Parts 2 and 3 are raw material, not process. Ran a structured two-round question process to derive the brief.

**The brief (§4.1), from the founder's answers:** product-only scope (not masterbrand) · English *and* Sanskrit both open · sharp/decisive/clear-headed register · **method lane** (closing the brand, benefit, steadiness and role lanes — Quire, Margin, Ballast, Marshal all out) · sound unfiltered, meaning decides · enemy is **all four** (volume, busywork, drift, bloat), so the unifying semantic core is **discernment** · **a name needing one explanation is acceptable if more ownable and precise** — the unlock · **morning, the act of choosing** (closing Adept, Wellspent, Settled).

> *In one sentence: a sharp, product-specific name for the act of discerning what deserves the day — English or Sanskrit, precision over familiarity, one line of explanation permitted.*

**Generated 6 English + 6 Sanskrit against it, then applied three tests — say it, own it, live with it.** Cuts with reasons: *Whet* and *Pare* (homophones with *wet* / *pair*), *Triage* (perfect meaning, but a product implying your life is a casualty ward makes a claim about the user every morning for years), *Pith* (the discarded bitter part of a fruit), *Sankalpa* (too long for the register), *Buddhi* (confusable with Buddha), *Bindu* and *Nitya* (name the cadence, not the choice), *Seiri* (near-homophone of Siri — fatal).

**Shortlist (§4.5): Viveka · Crux · Krama.** Viveka is the strongest name produced in the whole exercise — the precise word, in a language that has one, for the exact faculty the product exercises; in Vedanta it is the *first* qualification, preceding all else. Its explanation doubles as a complete product pitch. **Caution: *Vivek* is a very common Indian given name; the -a ending distances it toward the abstract noun but this must be tested with Indian users.** Crux is the risk-free English option. Krama ("the order in which things proceed") is the sleeper — no given-name collision, materially more ownable.

### 1.22 The ikigai question — borrowed concept-words — §4.6

Founder asked whether a management concept like *ikigai* exists around prioritisation. Several do, and the question produced **two new strong candidates**:

- **Kanso** (Japanese Zen, one of the seven aesthetic principles) — *simplicity achieved by eliminating the non-essential*. Precisely the product's thesis; two syllables, sharp K, pronounceable everywhere, far less commercially worn than ikigai or kaizen. Fits the brief on every dimension.
- **Hoshin** (from *Hoshin Kanri*, the Lean strategic method) — *compass needle*; the method exists to focus on the vital few and refuse the rest. Carries genuine management pedigree an executive audience reads as substance.

Also catalogued: **Svadharma** (Gita — *your own proper work, not another's*; the closest Indian cousin to ikigai, too long as a name but excellent landing-page material), **Kairos** (Greek, the opportune moment — good but heavily used as a brand), **Aparigraha** (non-grasping), **The Vital Few** (Juran, from Pareto — the Western ancestor of all of it).

**Caution recorded and not small:** borrowing a living philosophical term commercially invites justified criticism when done shallowly. *Ikigai* is the cautionary case — the Venn diagram the West knows is not the Japanese concept, and the flattening is well documented and resented. If Viveka, Kanso or Hoshin is chosen, the obligation is accurate representation: true one-line definition, correct provenance, no invented diagram, no claim that the product *is* the concept. Done with that discipline it is a genuine strength; done carelessly it is the most reputationally expensive mistake available in this exercise.

### 1.23 Kanso selected, then disqualified by the search test — `STRATEGY_AND_NAMING.md` Part 5

Founder selected **Kanso** from the §4.5 shortlist, then asked for a full explanation and a legal check. Ran the search test. **Result: material collision. Kanso should not proceed.**

**The concept, confirmed and stronger than claimed.** Kanso (簡素) is one of the seven principles of Japanese aesthetics named by philosopher **Hisamatsu Shin'ichi** in *Zen and the Fine Arts* (alongside shizen, shibumi, yugen, fukinsei, datsuzoku, seijaku). It means **simplicity reached by subtraction, never decoration** — not minimalism as style but as a way of thinking. Governing rule: *every element must serve a genuine purpose or be removed.* Ideal: *maximum effect through minimum means.* What remains should be clear, purposeful and honest — and can be plain, worn and warm at once; restraint, not sterility. It describes the philosophy the 21 QC gates already enforce.

**The collision.** At least three software businesses use the name: **Kanso Software** (Denver, 2012, housing management — **primary industry listed as Business/Productivity Software, trademark application filed for KANSO SOFTWARE**), **Kanso** (software design studio), and **Kanso Code** (B2B SaaS, 2019). Conflict turns on likelihood of confusion between goods and services, and housing-management software is arguably a different market — but the classification is Business/Productivity Software, a filing exists, and there are three parties not one. Consequence: fourth into a crowded name in your own sector, permanently contested search, and any registration likely narrow and weak. **Recommendation recorded: do not proceed without counsel, and expect counsel to advise against.**

**Occam checked as the Western alternative and disqualified harder** — Occam Systems (explicitly Business/Productivity Software), Occam Software Ltd (UK), Occam Technologies, Occam's Ops (trademarks filed 2024–25), ALPHAROC's OCCAM trademark (filed Oct 2022, AI/ML SaaS), plus the occam programming language. Five companies, two live filings, a language.

**Western concepts catalogued for the founder's question:** Occam's Razor (the foundational Western subtraction principle), Via Negativa (Taleb — improvement by removal), **Lagom** (Swedish, *just the right amount* — the closest Western cousin to a Japanese aesthetic word, still untested, softer than the brief's sharp register), Parsimony, Essentialism (McKeown), The Vital Few (Juran), The Hedgehog Concept (Collins), Theory of Constraints (Goldratt).

**The general lesson, recorded to govern the rest of the search:** two searches, two disqualifications, both for the same reason — *a famous principle is a crowded name by definition.* The more perfectly a word names the idea, the more likely someone already used it. This should be assumed for every remaining candidate and searched before, not after, selection.

**Standing recommendation: keep the concept, change the word.** Kanso becomes the *stated design philosophy* — landing page, About, design system, quoted with proper attribution to Hisamatsu Shin'ichi — doing the storytelling work without the trademark risk. The name comes from the surviving shortlist: **Viveka** (no software collision found) or **Krama**. Alternatives: test Lagom, or return to Crux accepting lower distinctiveness — but *crux* is also a common word and must be searched before being assumed safer.

### 1.24 Landing page headline — assessment

Founder proposed three candidate opening lines, all centred on choosing what to work on. Ranked **1 > 3 > 2**.

**Winner: "Know What Deserves Your Attention."** *Deserves* is the only word across all three doing work a competitor cannot copy — it reframes attention as scarce and tasks as applicants, a moral frame rather than a feature frame. Every rival page says "focus on what matters"; almost none say things must *earn* you.

**"Choose Your Priorities. Start With What Matters." — weakest.** First sentence is the literal category description; second is the most overused phrase in productivity marketing; and they are redundant. The deeper problem is **"priorities", plural** — it contradicts the §3.15 etymology (the word had no plural for five hundred years and pluralising it destroyed its meaning), arguing against the product's own best story in its first six words.

**"A Clearer Way To Decide What Comes First." — third.** *Decide what comes first* is concrete and good, but *a clearer way* is a hedged comparative that positions the product as an incremental improvement on something the reader must imagine. The first three words do no work.

**Flaw identified in the winner: "Know" is the wrong verb.** You do not *know* what deserves the day, you *decide* — and "know" implies the software knows, contradicting the product thesis that *software does not execute; the human executes*. Option 2 has the right verb wasted on generic phrasing.

**Recommended synthesis — verb from #2, noun from #1:**

> **Decide what deserves your day.**

Five words; active verb the reader performs; the differentiating word survives; and *your day* beats *your attention* because a day is the unit the product actually operates on — finite, concrete, and it implies the constraint without stating it.

Variants to test: **"Not everything deserves your day."** (names the enemy rather than the promise — more provocative, riskier) and **"Choose what deserves the day."** (softer, better rhythm).

**Flagged: the repo already contains "One priority. Zero noise."** — sharper than all three proposals and the only existing line carrying the singular-priority idea. Should be in the test set.

### 1.25 Names from the headline direction — Merit emerges, Viveka withdrawn

The headline work (§1.24) surfaced a territory not previously mined: **deserving** — things must *earn* a place in the day. Family generated: **Merit**, **Claim** (what has a legitimate claim on your day), **Warrant**, **Worth**, **Earned**.

**Search-tested two candidates before recommending, per the §1.23 lesson.**

**Merit — cleanest result of anything tested in this exercise.** Only a UK-registered *Merit Software Limited* (not a known product), Meritmarket.com LLC, and Merito. **No established productivity app occupying the name.** Contrast: Kanso (three software companies, one filing, in Business/Productivity Software) and Occam (five companies, two live filings, plus a programming language).

**Viveka — recommendation withdrawn.** Five software companies including **viveka.world, a leadership-development and productivity platform** — the closest-to-category collision found yet. Also Viveka Solutions (California), Viveka Software (Portland), Viveka Software Technologies (India, defunct), Vivekasoftek (Tamil Nadu).

**Third strike, same cause — the rule from §1.23 now confirmed three times:** Kanso, Occam and Viveka are each *the famous name of an idea*, which is why they appealed and why they were already taken. **Merit is a common English word that happens to name the test** — less iconic, and therefore less occupied. This asymmetry should guide any remaining search.

**Recommendation: Merit.** It is the headline's own idea as a noun, and it carries the thesis in a phrase people already say — ***on merit***: decided by what something is worth, not by who shouted loudest or what arrived most recently. That is the product's entire argument against the inbox. Fits the §4.1 brief on every axis — sharp register, method lane, the morning act of choosing, no explanation required, product-specific. Two syllables, unmistakable spelling, survives a phone call.

Identity as it now stands:

> **Merit** / *Decide what deserves your day.* / *Three things a day, yours alone. $39 once.*

Available line the category cannot run: **everything competes, only three win.**

**Caveat recorded: a web search is not clearance.** *Merit* is a common word, so a professional search across Classes 9 and 42 will surface marks a web search cannot, and a prominent cosmetics brand MERIT exists (different class, should not block software). But on the practical test that matters — *is there an established productivity app I would be fighting for my own name* — the answer was no for the first time in four searches.

### 1.26 NAME FIXED — Merit. Field closed after five disqualifications.

Founder directed that the name be settled. Search-tested the remaining live field rather than offering further options.

| Candidate | Search result | Status |
| :--- | :--- | :--- |
| **Kanso** | 3 software companies, 1 filing, in Business/Productivity Software | **OUT** |
| **Occam** | 5 companies, 2 live filings, plus a programming language | **OUT** |
| **Viveka** | 5 companies, incl. viveka.world — a leadership/productivity platform | **OUT** |
| **Crux** | Registered marks incl. Class 9 downloadable mobile software; a "lifecycle-based prioritization" product in the same category | **OUT** |
| **Winnow** | $45M-funded London company, Business/Productivity Software, clients incl. Hilton/Accor/IKEA in 77 countries | **OUT** |
| **Merit** | One minor UK company; no productivity app occupying the name | **CLEAN** |
| **Krama** | Nothing found | **CLEANEST** |

**Rule established, five times over:** *every word that perfectly names the act is already taken, precisely because it perfectly names the act.* Merit and Krama survived because they sit **one step off-centre** — Merit names the criterion rather than the act; Krama is Sanskrit. After five searches, off-centredness is not a compromise but the only condition under which a name remains available.

**Decision: Merit.** Krama was the closer call than the scores suggest — genuinely unoccupied, sharper sound, and the founder's brief pre-authorised the "needs one explanation" trade. Three things decided against it: (1) `SCALE_PLAN.md` §1.2 requires a global, largely non-native audience, where zero explanation beats one; (2) *"on merit"* is an existing phrase carrying the thesis for free, which matters under a no-marketing-spend constraint; (3) **Krama carries a hazard that cannot be undone after launch — in Slavic languages *kram/krámi* means a market stall, junk, clutter**, the opposite of the intended meaning, in European markets.

Merit's weaknesses recorded honestly: it is an abstraction (concreteness 2 — the same flaw that sank Primacy), and it carries mild institutional drag (merit pay, merit badge, appraisal). Judgement: *"on merit"* is a fairness phrase rather than an appraisal phrase, and product context dominates. **A B+ name that can be owned beats an A− that would be fought for** — a conclusion earned by five disqualifications, not asserted.

### 1.27 The Sniper proposal, and the "decide" etymology

Founder proposed **Sniper**, then clarified the idea: out of all tasks, focus only on the important ones; cut the noise; and the verb is *decide*, not *choose*.

**Sniper assessed at ~24** — below Merit (32), barely above bare *Priority* (23). Concreteness 5 and sayability 5, but resonance 2 (it resonates with the wrong thing) and ownability 2. Verdict recorded: *not a bad name — a name for a different product.* It is at war with kanso, the stationery register, evening gratitude and Lao Tzu; it reads as hustle-culture to the executive audience; it narrows exactly where `SCALE_PLAN.md` requires widening (military- and male-coded); and it carries practical problems — ad-platform policy friction on Meta/Google, app-store categorisation, and the pre-existing software meaning of *sniping* (auction/ticket/bot sniping).

**But the instinct was etymologically correct, and this is a genuine gift:** *decide* comes from Latin *decidere* — *de* (off) + *caedere* (to cut). **To decide is literally to cut away**; the same root gives *incision*, *precise* and *homicide*. Something really is killed when three tasks are chosen — the other twenty. The founder's preference for *decide* over *choose* is therefore correct and should be enforced in all copy: *choose* is picking from a menu, reversible, plural; *decide* is amputation.

**The product now holds two etymological facts that argue its case for free:** *priority* had no plural for five hundred years, and *decide* means to cut off. Together they load the headline — **"Decide what deserves your day"** — with more meaning than any productivity brand's opening line normally carries.

**Resolution: the Sniper energy belongs in the copy, not the wordmark.** The name stays calm; the lines can be sharp.

> **Merit** / *Decide what deserves your day.* / **"Twenty things want your attention. Three will get it."**

Alternates in the same register: *"Everything competes. Only three win."* · *"Most of it doesn't deserve you."*

**Next steps:** professional trademark clearance across Classes 9 and 42 (a common word, so a proper search will surface marks a web search cannot; a prominent MERIT cosmetics brand exists in a different class and should not block software), and check **merit.day** before other domains — it states the thesis in a URL. Then the rename, per §2.9: ~105 display strings, persisted keys left untouched behind the existing shim, new licence prefix added while honouring the old, two QC gates updated. **The window closes at the first sale.**

### 1.28 Quire disqualified; the structural error identified; world philosophies catalogued

**Quire — taken.** quire.io, an established project-management and productivity platform since 2014 with full software-listing presence. **Seventh disqualification**, and it was the highest-scoring name in the whole exercise (35).

**Running total of disqualifications, all in productivity software: Kanso, Occam, Viveka, Crux, Winnow, Heed, Quire.** Survivors from a field of ~80: **Merit** and **Krama**.

**The structural error identified, and it is mine.** Seven rounds searched *inside the category's own semantic space* — words meaning prioritise, decide, cut, essence. That space was exhausted years ago because every productivity founder since 2010 had the same good idea. **The category's actual winners — Obsidian, Bear, Craft, Things, Arc, Linear — name nothing the product does.** They were available *precisely because* they came from outside the category.

**This also diagnoses the founder's "it doesn't do justice" objection.** A word naming one function cannot do justice to a whole product; Merit names the test while the product is an object with a woven label, twelve illustrations, a privacy shutter and a 3D page turn. A word that names nothing in particular has the opposite property — **it absorbs whatever meaning the product gives it.** Obsidian does justice to Obsidian because it started empty and the product filled it. That is the mechanism the search has been missing.

**Proposed next territory:** words with no relation to prioritisation that match the object's feel — black cover, ivory paper, ink, restraint, permanence. Illustrations offered: Flint, Graphite, Rook, Linen, Onyx (Indigo noted as likely out in the home market — IndiGo is a major Indian airline). **Asked the founder for the one input never yet supplied: any word, from anywhere, they have caught themselves liking.** Taste is the only thing that can close this; scoring has been substituting for it throughout.

### 1.29 World philosophies parallel to kanso — `STRATEGY_AND_NAMING.md` §5.6

Founder asked whether other traditions hold a concept like kanso. Nearly all do; catalogued by tradition in §5.6.

**Most important finding for this product: *Tao Te Ching* ch. 48 — "In the pursuit of learning, every day something is acquired. In the pursuit of the Tao, every day something is dropped"** (為道日損, *wei dao ri sun*, "to practise the Way is to daily decrease"). Kanso stated 2,500 years earlier, as a **daily** practice — and **the product already quotes Lao Tzu in the evening reflection**, so the philosophical spine is already inside the app and needs only to be made explicit.

**The three genuinely identical to kanso:** *neti neti* (Upanishadic, "not this, not this" — truth by negation), *tzimtzum* (Kabbalistic, creation through divine withdrawal — you make room by removing yourself), *aphairesis* (Plotinus, ἄφελε πάντα — "take away everything").

Also catalogued: *pu* and *jian* (Taoist), *vairagya*/*aparigraha*/*ekagrata* (Indian), *sophrosyne* and *kenosis* (Greek), *Gelassenheit* (Eckhart, later Heidegger and the core Amish value), *tajrid*/*zuhd*/*faqr* (Sufi), *lagom* (Swedish), Occam's Razor and Taleb's via negativa (Western modern).

**As names, almost all unusable** — too long, too hard to spell, or badly collided (*neti* → neti pot). *Lagom* is the only name-shaped entry and is softer than the brief's sharp register. **Conclusion: this search found the product's philosophy, not its name** — rich material for the About page, design system and launch story, but not the wordmark.

### 1.30 VISION.md written; the framing corrected

Founder corrected an error of mine. I had argued the product's distinctiveness was *what it is* (the object — page turn, illustrations, woven label). The founder's position, which is right and now governs: **the distinctiveness is what it does — help executives decide what to focus on.** The craft serves the outcome; the outcome is the point.

Founder's articulation, recorded verbatim as the root document `VISION.md`:

> A tool that helps executives decide what to focus on. There is **confusion** in the mind of the user with so many tasks. They jot down what is most important, and this helps them prioritise. **This gives them clarity.**

**The arc: CONFUSION → jot down → prioritise → CLARITY.** The first and last steps are what matter; the middle is mechanism. **What we sell is clarity** — a person opens the product confused and closes it certain. `VISION.md` §9 sets the test for every future decision: *does this move the user from confusion toward clarity?* If not, it is decoration, and kanso says remove it.

Noted in passing: the founder's own vision statement is **benefit-led** (clarity as outcome), which sits in the benefit lane rather than the method lane selected back in §4.1. That shift is what reopened the search below.

### 1.31 Ninth search round — CLEARING recommended

Generated against the clarity brief and searched before recommending.

| Candidate | Result |
| :--- | :--- |
| **Clearing** | **CLEAN** — no software occupant found |
| **Vantage** | OUT — five software companies, one explicitly Business/Productivity Software |
| **Lens** | OUT without searching — Google Lens owns the word in consumer software as Maps and Photos are owned |

**Recommendation: Clearing (34).** It contains the entire vision rather than one step of it. *A clearing is an open space made in a dense forest*: **the forest is the confusion** (too many things standing too close to see through — the user at 8am, not short of tasks but short of visibility); **a clearing is made by cutting**, which locks to *decide = decidere = to cut off*; **the clearing is the clarity** — open ground, room to see. The vision compressed into eight letters: *confusion → cut → clarity.*

**Why it beats Merit (32):** it is a **place, not a quality**. Merit's fatal flaw was abstraction (concreteness 2 — the same defect that sank Primacy); nobody can picture merit, everybody can picture a clearing. Daily tools become places, and *"it's in Clearing"* works where *"it's in Merit"* never did. It is also **kanso in English** — a clearing is exactly what remains after subtraction, so the Japanese philosophy and the English name say the same thing, which is the coherence the brand has lacked. And it came back clean, which after seven disqualifications is decisive.

**Risks recorded honestly:** *Clearing* is the UCAS university-admissions process in the UK — a strong seasonal association there — and carries finance senses (clearing houses, cheque clearing). Neither blocks legally, neither is in category, both add search noise in specific markets. Register is calmer than the "sharp, decisive" feeling selected in §4.1 — but the founder's vision statement is about **clarity**, which is quieter than sharpness. Judgement: the vision moved, and the name should follow the vision rather than the earlier lane answer.

Runner-up noted: **Glade** — a clearing in a forest, one syllable, more elegant — but SC Johnson's air-freshener brand holds strong consumer mindshare.

Still outstanding for any name: professional clearance in Classes 9 and 42, plus the §2.8 tests. §2.9 timing rule unchanged — **the window closes at the first sale.**

### 1.32 The instrument territory — "what real tool makes a hazy situation clear?"

Founder asked (via the car-wiper analogy) whether a real-world object or tool exists that turns a hazy situation clear. A genuinely strong territory, because an instrument is **concrete** — solving Merit's fatal abstraction flaw — and the product is itself an instrument, so such a name would describe itself.

Territory mapped by mechanism: **optical** (Loupe, Lens, Monocle, Viewfinder, Periscope); **separation** (Decant, Filter, Sieve, Still); **testing** (Litmus, Touchstone, Assay); **navigation** (Lodestone, Compass, Sextant, Lighthouse); **cutting through** (Wiper, Plough, Scythe).

**Loupe was the standout and is disqualified.** A jeweller holds a loupe to a stone *to judge whether it is worth anything* — exactly the product's act, close examination to determine what deserves the day. **Four registered trademarks, all software:** Atelier Technology (B2B jewellery software), ESYMMETRIX (developer tools), The Loupe NY (mobile recommendations), Loupe Inc. (PlanGrid, construction). Multiple live Class 9 marks. **Out.**

**Litmus assessed as almost certainly out** — litmus.com is an established email-testing platform with real SaaS presence. Not searched; the occupant is known.

**The reframe that matters, and it argues for Clearing.** The founder named the *tool*. But nobody wants a wiper — they want the clear windshield. The user does not want an instrument; they want **the state the instrument produces**. And that state already has a name: **a clearing is what a wiper makes** — the open view, the obstruction removed, the moment you can see what is in front of you. The founder was reaching for the mechanism; the name should be the result. This question, rather than undermining Clearing, is the strongest argument for it yet.

**Untested survivors in the instrument territory**, offered but not recommended pending search: **Lodestone** (the magnetic stone that finds north when you cannot see — better than *Lodestar* because it is a thing you hold, not a star you look at), **Decant** (pour off the clear, leave the sediment — semantically exact, but awkward as a place: *"it's in Decant"* does not sit), **Touchstone** (32, never searched), and **Sightline** (the unobstructed view — from the *result* side, never explored).

**Standing recommendation unchanged: Clearing (34)** — the highest-scoring name still available, and the only one that survived search in the last two rounds.

### 1.33 The pearl-diver territory — and the close

Founder asked what the person is called who dives for pearls, drawing the metaphor: the user floats in an ocean of tasks and surfaces with the few pearls worth focusing on.

**Literal answer recorded:** a **pearl diver**; in Australia a **pearler**; and from the two traditions that did it for millennia — **Ama** (海女, Japanese "sea women", free-diving for 2,000+ years on a single breath) and **Haenyeo** (해녀, their Korean counterparts on Jeju).

Territory mapped — *finding the valuable few in a vast undifferentiated mass*: **diving** (Ama, Pearl, Nacre, Trove, Sounding, Fathom); **prospecting** (Lode, Seam, Sluice, Placer, Prospect); **gathering** (Glean). **Lode and Seam cut immediately** — homophones of *load* and *seem*, permanently unspellable over a call.

**Glean was the standout and is disqualified** — glean.com is a major enterprise AI search platform with Gartner coverage, an App Store app and a Google Cloud partnership.

**Structural finding on the metaphor: it describes the user, not the product.** The diver is the user, the pearls are their priorities, the ocean is the task load — the product is none of the three; it is what lets them go down and come back with something. Hence the territory keeps producing near-misses: *Ama* and *Pearler* name the person (and per §3.21, naming a product after a helper-person makes it read as an AI assistant, which this emphatically is not); *Pearl* names the outcome but says nothing about choosing.

**Kept for copy rather than naming:** a pearl forms **around an irritant** — the oyster coats what is bothering it until it becomes the valuable thing, which is a fine line about what a daily practice does with friction. And **nacre is laid down one thin coat at a time over years**, which is precisely the archive argument: the value is in accumulation, not in any single day.

### 1.34 Naming search closed — eleven searched, ten taken, one clean

| Searched | Result |
| :--- | :--- |
| Kanso, Occam, Viveka, Crux, Winnow, Heed, Quire, Vantage, Loupe, Glean | **All occupied**, most by productivity software specifically |
| **Clearing** | **Clean — the only name that has come back free** |

**Conclusion: the category's naming space is exhausted**, and Clearing is the only strong name in it that nobody has taken. It is also, independently, the right one — concrete where Merit was abstract; a **place**, so it takes the preposition (*"it's in Clearing"*); **kanso in English**, being what remains after subtraction; the clear windshield rather than the wiper; and it emerged from the founder's own vision statement rather than a word list, which is why it fits where eight rounds of scoring did not.

**Recommended next step is not another search.** Five people, said aloud: *"I keep my priorities in Clearing."* If it lands, take it to professional clearance in Classes 9 and 42 and stop looking. §2.9's timing rule still governs — **the window closes at the first sale.**

### 1.35 Radical simplification — the product narrows to its thesis

Founder proposed cutting habit tracking and evening reflection, collapsing to a single page, and diagnosing the user's problem before offering a method. Agreed on the cuts; corrected one of my own earlier claims in the process. Recorded as `VISION.md` §10.

**Cuts agreed:** habits (a different category — "we don't want to track if he has walked or not"), evening reflection (gratitude journalling has its own market), and the bi-fold spread (it existed to hold the right page). **Day closure kept** — not reflection, just *the day is done*: without an ending the product is morning-only and there is no reason to return in the evening, and day-30 retention is the metric the whole growth plan rests on.

**Correction to my own earlier claim.** I had said the six frameworks "mostly do the same job — reduce many to few." The founder pushed back and was right. That confuses output with diagnosis: **each framework was invented to treat a different failure mode.** Rule of 3 treats overcommitment; Ivy Lee (1918) treats context-switching, where the cure is *never start #2 until #1 is done*; Eisenhower treats urgency mistaken for importance. **Rule of 3 does not cure switching** — a switcher picks three things and still bounces — **nor urgency-confusion**, where they simply pick three urgent trivial things. Genuinely different medicines.

**Revised recommendation: three survive, not one and not six.** Cut 1-3-5 (duplicates Rule of 3 — same disease, different dosage), MoSCoW (Eisenhower built for team scope negotiation, not one person's morning), and **Pareto — which is a principle, not a method**: it says the vital few exist but supplies no procedure for finding them, so it belongs in the copy and never as a selectable mode.

**The diagnostic is rescued by changing the question.** My objection was that *"what does your day look like?"* is unanswerable by a confused person — not knowing is why they opened the app. But *"which of these three is happening to you?"* is pure recognition: **"Too much to do" / "I keep not finishing things" / "Everything feels urgent."** No quiz, no gate; default to Rule of 3 with the other two behind a quiet switch, **labelled by symptom, never by method name** (framework names are jargon banned by Gate 5).

**Make-or-break implementation rule (`VISION.md` §10.4): the frameworks must be enforced, not drawn.** Rule of 3 — three lines and no fourth. Ivy Lee — **#2 locked until #1 is done**. Eisenhower — classification required before writing. If selecting a method only changes labels, users find out within a week that it is a theme picker.

**Two claims flagged.** (1) The founder's phrase *"proven scientific framework"* is **false and banned by their own creative brief** — Ivy Lee is a business anecdote with no trial, Eisenhower's matrix is Covey's conceptual model from a 1954 speech line, Pareto is an observed distribution. Replace with **time-tested**: *"methods that have worked for a century — not another blank page."* Stronger because unfalsifiable-by-reply. (2) **The craft cannot be defended on the §9 clarity test** that justified the cuts — a 3D page turn clarifies nothing. It is defensible instead as **what makes a person return**, which is the retention metric everything depends on. Hold that defence consciously.

### 1.36 The framework deep dive — two layers, and the execution methods

Founder directed a full survey of proven frameworks: take what adds, drop what is redundant. Written up as `FRAMEWORKS.md`.

**The structural finding, missed until now: the field splits into two layers that stack rather than compete.** *Selection* methods answer "which things" — Rule of 3, Ivy Lee, Urgent/Important — so only one can be active. *Execution* methods answer "when and how long" and apply on top of whichever selection method is running. **A user can be failing at either layer and the cures are unrelated:** someone picking the wrong three things needs a better selection method; someone picking the right three and never starting them needs an execution method, and handing them Eisenhower is useless.

**Selection: nothing new passed.** Assessed and rejected as redundant — 1-3-5, MoSCoW, ABCDE, MITs, RICE/ICE, Action Priority Matrix. Assessed and rejected as **not daily**: *Impact/Effort* (genuinely distinct from Eisenhower — value×cost, not urgency×importance — but the literature places it at 10–30 items reviewed monthly; **fails the toothbrush test**), *Theory of Constraints* (needs a system view across weeks), *Critical Path* (needs a project), *Bezos two-way/one-way doors* (excellent and distinct, but episodic rather than daily), *regret minimisation* (life-scale), *inversion and second-order thinking* (thinking tools, not task tools).

**Execution: two genuine additions.** **Timeboxing** (Parkinson's Law, *The Economist*, 1955 — treats tasks expanding to fill the day) and **if-then planning** (Gollwitzer 1999 — treats planning without starting). Rejected here: WOOP (evidence-backed but four steps of introspection, drifting toward the reflection territory just cut), Biological Prime Time (thin), After Action Review (a review — the removed territory).

**The right page settled as the execution layer**, against Larry Page's toothbrush test. Left page: what deserves the day. Right page: how long, and how it actually went. **The rule that keeps it honest — the right page may only ever operate on the left page's items, never introducing objects of its own.** Habits and reflection failed precisely because they were separate things sharing a spread.

### 1.37 Legal safety review — all five methods clear

Founder asked for a rigorous check: completely free frameworks only, no legal exposure.

**The governing principle: methods are not ownable, names are.** Copyright explicitly excludes "any idea, procedure, process, system, method of operation" (17 U.S.C. §102(b); *Baker v. Selden*, 1879) — **implementing a method is not infringement**; only someone's *text describing* it is protected. Patents are not live (business-method patents are rare post-*Alice* 2014, and anything from 1918/1954/1955 is long expired). **Trademark is the only real exposure**, and it protects names used as brands — so describing a method by its historical name is nominative use, while adopting someone's mark as your brand is not.

**All five clear.** Cautions recorded: avoid Covey's coined vocabulary with the urgent/important matrix; never imply *Pomodoro* near timeboxing; never use *WOOP*. Blacklist completed at `FRAMEWORKS.md` §6.3.

**Noted: the symptom-labelling decision is a legal asset as well as a UX one** — method names appear only in docs and marketing, exactly where nominative use is permitted. Chosen under Gate 5 for jargon reasons; it happens to strip nearly all trademark surface from the product itself.

### 1.38 Attribution standard — and an error it caught

Founder directive: *"use frameworks that are completely free only, and don't rename them — that is also wrong."* A stricter standard than the legal minimum, and the correct one.

**Correction 1 — my earlier rule was wrong as written.** *"Label by symptom, never by method name"* was written for Gate 5 jargon reasons but licenses exactly the concealment being rejected. **Superseded by a two-tier presentation:** the user clicks *"I keep not finishing things"*; the page then shows *Ivy Lee Method · 1918*. Plain language at the entry, full credit at the point of use.

**Correction 2 — the standard caught an error pointing the opposite way from the one being guarded against.** **The "Eisenhower Matrix" is misattributed.** Eisenhower quoted the urgent/important distinction in a 1954 speech; **Covey constructed the matrix in 1989.** Calling it the Eisenhower Matrix — as the whole industry does — credits Eisenhower with Covey's work. Legally unproblematic, and not honest. The product will use **The Urgent/Important Matrix** and credit both. *A legal review would never have flagged this, because it is not a legal problem. An honesty standard did.*

**One honest scientific claim is now available**, and exactly one: Gollwitzer & Sheeran (2006), 94 independent studies, 8,000+ participants, **d = 0.65**, robust to publication-bias adjustment — applying to if-then planning only. Combined position: *"One of these is backed by 94 studies. The others have a century of use behind them."* Stronger than either half, and every word survives scrutiny.

**The Methods & Attributions page is upgraded from legal defence to marketing** — the proof of the whole positioning, and the strongest answer to the earlier IP question (§1.35): the product's own IP is the **diagnosis layer**, and honest attribution of the treatments is what makes the diagnosis credible.

### 1.39 Borrowing from Focus / Plan & Do — the timer as enforcement

Founder proposed combining three things: diagnosis before prescribing, frameworks as genuine behaviour, and a timer with every model. Studied `~/Documents/Claude/Projects/Plan & Do` (built as **Focus**; storage key still `foocus-telemetry`). Written up as `BORROW_FROM_FOCUS.md`.

**The argument that settles it: the timer is not an addition, it is the mechanism the other two already required.** `VISION.md` §10.4 demanded frameworks be *enforced, not drawn*, but a paper metaphor enforces nothing — you can draw three lines and someone writes a fourth in the margin. **A clock is what makes a method binding.** Rule of 3 becomes three timeboxes with a visible shape; **Ivy Lee's #2 will not start until #1 is closed, so the sequence stops being advice and becomes a fact**; urgent/important runs the clock only on *Do First*, so time elsewhere is visibly time not spent on what you called important. Each framework produces a different timer *behaviour* — the difference between a skin and a mechanism.

**Taken:** `durationSec` per line · the planned/actual/paused/overtime accounting with `timingAccuracy` provenance marking · the state machine including **`BREATHING`** (a deliberate pause before the clock starts) · **`addTimeToCurrentTask`** (non-punitive overrun — non-negotiable) · finish-early time redistribution · session outcome (done/partial/blocked) · plan reuse · **`AnalogueClock.tsx`**.

**Left:** subtasks (a subtask is how you have more than three things while telling yourself you have three — defeats Rule of 3's enforcement) · Supabase, PostHog, cloud sync, PartyKit (**hard veto** — would turn blocker B3 from a fixable inconsistency into a false claim) · team rooms · the GOAL→SUBTASKS→READY wizard.

**Team views recorded:** *Strategy* supports with a **category warning** — a timer moves toward a crowded field (Forest, Session, Flow, Pomodoro clones), so the diagnosis must stay in front and the timer must never be the headline. *Acquisition* is the strongest supporter because **it fixes the problem they raised earlier** — cutting the right page weakened the visual pitch, and a running clock with a plan visibly emptying is a thirty-second video where a still page is not. *Lifecycle* calls it the biggest win, since **the timer replaces the retention machinery lost when habits were cut**, with several daily touchpoints instead of one — but flags the hazard that **timers create failure states**, mitigated only by keeping overrun non-punitive. *Revenue-ops* issues the sync veto and notes that **nothing crosses as code** (Next.js/Zustand vs Vite/localStorage); the model crosses, reimplemented.

### 1.40 The visualiser modes — a correction and a split

Founder asked for the team's view on the visualiser modes, which §1.5 had rejected wholesale. **That was too quick, and the rejection was wrong for one of the four.**

**`WATCH` is an instrument; `SPACE`, `MOUNTAIN` and `RACE` are games.** `AnalogueClock.tsx` renders a clock face. The others are gamified progress metaphors — 100 drifting stars and detailed planet SVGs (Mars in radial orange, Jupiter in yellows, Neptune in blues), a multi-peak path with a **climber figure**, a competitive race track.

**Take the clock.** An analogue face is functional, not decorative: it renders *duration* spatially where digits render an *instant*, and duration is the quantity a timebox needs. The register is exact — Swiss, mechanical, precise — it is monochrome so Gate 3 is satisfied, and it passes §9 by making remaining time legible at a glance. **A clock face is not a theme; it is the instrument reading itself.**

**Drop the rest**, for four reasons: (1) they are **the psychology of the habit streaks already cut** — extrinsic reward loops; (2) they contradict the neutrality decision, since a climber celebrating your progress is the software forming an opinion about you; (3) **they imply failure states** — ask what MOUNTAIN does on an overrun, and the climber does not reach the peak, which is a judgment rendered as a picture and a direct violation of the non-punitive rule; **a clock face has no protagonist, so it never judges**; (4) Gate 3 bans chromatic decoration.

**Taken as *the* clock, not as a mode.** No switcher, no cycling, no gallery — offering four visualisations would repeat the six-frameworks mistake in a different costume: **variety presented as capability.**

**Founder agreed September 9, 2026: drop the gamification, take what matches the philosophy and the brand vision.**

### 1.41 The canonical statement — `VISION.md` §11

Founder asked for a consolidated articulation of what the tool does and a new statement. Written into `VISION.md` as §11 and made canonical: where any copy anywhere conflicts with it, §11 wins.

**Primary line: "Open it confused. Close it decided."** Chosen because it states the entire transformation in four words, restates `VISION.md` §4 verbatim in spirit (*a person opens this confused and closes it certain*), and because *decided* carries the §8 etymology — *decidere*, to cut off. Approved alternates recorded: *Decide what deserves your day* (the instruction), *You don't need another list — you need to know which three* (the enemy), and *It asks what's wrong before it tells you what to do* (the differentiator, and the most defensible claim available since nobody else does it).

**The four movements** recorded as the product's anatomy: it asks what is going wrong (recognition, not analysis); it gives the method built for that specific problem (credited); the method is enforced rather than drawn, with **a clock as what makes it real — a page can be ignored, a running timer cannot**; and it closes and counts, planned against actual, without ever scolding.

**The shape named:** *a regimen for a day* — assess, route, dose, review. Useful as the internal mental model. **Never as vocabulary** — see below.

**Three standing copy rules added (§11.3), each closing a specific exposure rather than expressing a preference:**

1. **No clinical vocabulary.** Never *diagnose · prescribe · treat · therapy*; write *asks what's going wrong* and *the method built for that problem*. Medical **structure** is fine; medical **language** invites health-claim scrutiny from regulators and app stores. This is the same discipline as the "proven scientific" rule, pointed at a different set of words — and it was applied to the statement itself before shipping it.
2. **No judgment.** Never *whether you were honest*, no failure states, no falling scores; write *shows you where the time actually went*. Breaking this breaks the non-punitive rule that the entire timer design depends on (§1.39, R8).
3. **No unearned science.** The single permitted scientific claim remains Gollwitzer & Sheeran (2006), d = 0.65, applying to if-then planning only.

Register updated to rev. 3: the canonical statement replaces the old one-sentence summary in §1, and C7 is rewritten with C8–C10 added for the copy discipline.

### 1.42 The agency naming round — `AGENCY_NAMING_ROUND.md`

Founder rejected an earlier inline attempt to channel creative agencies, correctly observing it recycled names already on the list (Touchstone, Fewer, Enough, Three). The same mind asking the same question in different costumes produces the same answers. **Six agencies were therefore deployed as genuinely independent agents** — cold context, each reading `VISION.md` for itself, each given the same 24-name dead list, and each instructed to **web-search its own candidates before recommending**, so generation and disqualification happened in the same head.

Five of six reported (72andSunny outstanding). Full record in `AGENCY_NAMING_ROUND.md`.

**Recommendations received:** W+K → **Plumb** · Ogilvy → **Whittle** · Dentsu → **Nagi** · BBDO → **Verdict** · Droga5 → **Decidere**.

**The finding that justified running six rather than one: cross-checks caught two false positives.** W+K called Plumb "cleanest of the ten"; Ogilvy found **useplumb.com**, a live AI workflow tool. Ogilvy called Whittle clean; **three other agencies each found a different occupant** — whittle.tools ("small, sharp, local-first utilities for macOS"), a comms/task simplifier, and decisively **3Advance's Whittle, built for executives managing their day**. **Both of those agencies' own recommendations die on another agency's search.** Had only one been run, the output would have been a colliding name. *For naming, independent duplicate search is worth more than additional generation.*

**Convergence, and it is striking.** Without contact the agencies landed on the same territory — **cutting instruments**. Whittle was proposed independently by **four of five**; Cleave by three; Chisel, Plumb, Shear/Shears, Gavel and Cull by two each. Five independent teams reading the vision concluded the product is **a blade, not a page**, which independently validates `VISION.md` §8 — all four philosophical anchors are about removal.

**26 names killed with named occupants**, catalogued in §5. Notable entries: **Toki** (toki.com is literally "Meet Your AI Executive Assistant", plus a Toki AI Planner — the exact category, twice); **Hone** (a live task-management tool); **Decree** ("Decree Your Day" already exists); **Caesura** (a macOS menu-bar app on the same one-time-purchase model); **Tzimtzum** (a live App Store app — closing a word that came from this project's own philosophy research); **Bevel** (in active litigation, *Whoop v. Bevel*); and **Chronometer**, killed for a reason worth carrying forward — it is phonetically identical to *Cronometer*, and **"the collision is in the ear, not the spelling, which is worse for word-of-mouth."** Also closed: Deckle, Distill and Assay, all three of which had appeared on my own earlier lists.

**Survivors:** **Shears/Shear** (checked by two agencies, killed by neither) · **Nagi** · **Decidere** · **Verdict** · Fude · Chop · Foolscap · Escapement · Thirty-Nine.

**One recommendation carries a documented conflict.** BBDO recommended **Verdict** and flagged the flaw themselves: a verdict is normally passed *on* you, while `VISION.md` §11.3 rule C9 states the product observes and never judges. Their proposed fix — always "your verdict", never "the verdict" — is copy patching a structural mismatch, and should not be accepted on those terms.

**The saturation thesis is now confirmed three times independently.** After sixteen searches I had concluded the accessible dictionary in this category is exhausted. **BBDO**, unprompted: *"single dictionary words that mean 'decisive, essential, premium' — close to saturated."* **Droga5**, unprompted: *"the mythic/etymological well this brief draws from — poetry, Kabbalah, philology — has been fished hard by other small-batch productivity apps already."* This should govern expectations for any further search.

**Standing caveat unchanged:** every "clean" verdict above is a web search, not a clearance search. No agency checked registration in Classes 9 and 42 — BBDO flagged this explicitly. Professional clearance remains outstanding, and §2.9's timing rule still governs: **the window closes at the first sale.**

### 1.43 72andSunny reports — the tool-word / state-word finding

The sixth agency completed, and produced the round's most valuable insight. It was the only one explicitly briefed on the founder's tension — the name must be as unpretentious as "Clearing" but as dignified as an instrument — and its answer explains the whole history of this search:

> *"A plain, warm word can feel elevated — but not by leaning into abstract states like Clearing, Steady, or Enough. Those describe a **feeling**, and feelings-as-names read as generic wellness-app filler. It works when the plain word is a **physical instrument with real history** — something with weight, a shape, a use that predates software. Plumb and Whetstone earn aspiration through **craft**, not vocabulary. **The founder's instinct that plain words feel basic was correct for state words. It's wrong for tool words.**"*

**This resolves the objection that reopened the naming search.** Clearing, Steady, Margin, Enough — all **state words**, all felt thin. Shears, Whetstone, Chisel, Plumb, Escapement — **tool words**, which earn elevation through craft rather than vocabulary. It also explains §1.42's convergence (five agencies independently reached for instruments) and is a live critique of Dentsu's **Nagi**, which names the calm after the wind drops — a state, not a tool. **Operative rule: prefer tool words, distrust state words.**

**Their kills:** **Keel** is the worst find of the entire round — *"Keel: Your Focus Anchor,"* a live AI daily planner that builds your plan and tracks your priorities. Effectively this product, already shipping. Also **Vow** (wedding-tech saturation), **Muster** (a $30M-revenue B2B company — independently confirming Droga5's identical finding), **Kindling** (five apps including a habit tracker), **Threshold** (Target Brands' heavy mark, different class).

**All six recommendations now in: Plumb (W+K), Plumb (72andSunny), Whittle (Ogilvy), Nagi (Dentsu), Verdict (BBDO), Decidere (Droga5).** Plumb was the only double recommendation — **and it collected two independent disqualifiers**: useplumb.com, found by Ogilvy, and the **Plum** homophone found by 72andSunny (*"try Plumb" and "try Plum" are indistinguishable said aloud* — fatal for a word-of-mouth product).

**Fourth independent confirmation of the saturation thesis**, and the sharpest phrasing of it: *"Almost every plain, warm, single-syllable word adjacent to 'focus' or 'daily planning' is already claimed by a real, sometimes well-funded, software company. This isn't a coincidence — it's why the founder's plain-word instinct kept producing rejects. The words that feel simplest to reach for are the words everyone else reached for first."*

**Standing recommendation from the agency round: Shears** — the only name multiple agencies checked and none could kill (Ogilvy found only sheep-shearing operations software; W+K found it essentially clean). Every other survivor rests on a single agency's search, and this round demonstrated twice that single searches produce false positives. It also satisfies the tool-word rule. Weaknesses on record: plural awkwardness (*"open your Shears"*) and imagery drift toward gardening or hairdressing unless anchored to tailoring. **Runner-up: Whetstone.**

### 1.43 The Casio F-91W brand thesis, the single leaflet, and a corrected survivor list

Founder introduced the **Casio F-91W** as the model for the product: *"there are so many watches out there but this is built for simplicity and durability… we want the tool to rule even if it is simple and has fewer features, as it genuinely solves the problem."* And asked separately whether the product should be **a watch or a single leaflet**.

**A scoping correction is worth recording, because it changes what was being asked.** The Casio reference was first read as proposing a watch-*shaped* product and answered as a watch-versus-leaflet metaphor contest. Founder corrected: **the F-91W is the brand model, not a form factor, and the analogue clock (R11) is settled and unchanged.** These are two independent questions — what the brand is modelled on, and what shape the page takes — and only the second was open.

#### The F-91W as a brand, precisely

It is a stranger object than "simple and durable," and the specifics are what make it usable as a model:

- **Unchanged since 1989.** Not iterated slowly — unchanged. No refresh cycle, no redesign, no anniversary edition.
- **No feature has ever been added.** Time, date, alarm, stopwatch, light. Thirty-seven years, nothing added.
- **Cheap and unembarrassed about it.** This is the part most often missed. The F-91W is not a luxury object performing restraint — that is Muji, Leica, a Hermès notebook. Its dignity comes from being honest about what it costs to make.
- **Assumed, not aspired to.** Nobody brags about owning one; everybody respects it. Ubiquity is the moat, exclusivity is not part of the story.
- **The name is a part number**, and the object became beloved anyway.

#### Four consequences, one of them uncomfortable

**1. A promise is available here that no competitor can make.** *"This will look the same in ten years. No features will be added."* Every competitor's changelog is their marketing; a public commitment never to ship a feature is structurally unavailable to them. It also converts the binding constraint — one person, no team — into the brand.

**2. The price never moves, and this settles a live contradiction.** §1.2 has Jobs arguing $49–99, premium forever. The F-91W is a $12 watch. **Casio and Jobs point in opposite directions on price, and the founder has now chosen Casio.** $39 once, forever, is the software F-91W, and it must not drift upward.

**3. The uncomfortable one: most of the built craft is off-brand under this model, not merely off-thesis.** The Three.js journal scene, the twelve month illustrations, the woven twill tag, studio lighting, spine curvature — that is **Leica register, the exact opposite of F-91W**. `VISION.md` §10.5 currently defends that craft on retention grounds ("a beautiful instrument gets opened"), which is a genuine argument — but it is the argument for a *different brand than the one now named*. **F-91W's retention does not come from beauty; it comes from being so plain and so reliable that replacing it never occurs to anyone.** Either position is holdable. Both are not, and the documents currently hold both. This is logged as an open conflict (BR8), not resolved here.

**4. Ubiquity over gating.** Casio does not operate a paid tier. The free/paid line should be pressure-tested against this rather than assumed compatible with it.

#### The single leaflet — recommended

The recommendation stands on arguments that never depended on the watch comparison:

- **One sheet has two sides, and that holds the two-layer architecture better than a spread does.** Recto: what deserves the day. Verso: where the time went. **Turning the sheet over becomes the day-closure gesture** — P4 currently has none — and it satisfies R3 structurally rather than by discipline, because a verso cannot introduce objects of its own.
- **A book accumulates; a leaf does not.** Pages fill and the backlog stares at the user. A sheet is finite and replaced tomorrow. That is Rule of 3 rendered as an object.
- **It licenses the deletion that consequence 3 already demands.** A leaflet has no spine, cover, ribbon or months. Under the Casio brand, cutting that craft stops being a sacrifice and becomes coherence.

**The clock is unaffected and lives on the recto.** R11 stands exactly as recorded in §1.40.

**One practical closure: the word *Leaflet* is unusable as a wordmark** — Leaflet.js is among the most-used mapping libraries on the web. The metaphor is available; the word is not.

#### The naming brief changed, and a survivor from §1.42 is dead

**Under BR7 the target is no longer a beautiful word.** Nineteen-plus names have now been lost, and nearly every one died *because it was a good word* — good words in the "decisive / essential / clear" field are gone precisely because they are good. Asking for a more beautiful name is asking for a more contested one. The F-91W is a part number.

**Structural finding: the paper register is picked clean and the mechanism register is nearly empty.** Foolscap, Deckle, Quire, Longhand, Daybook and Recto are all occupied — because everyone building a journal app reaches for paper words, and nobody reaches for machine parts.

**Six searched this round, one survivor:**

| Name | Verdict |
| :--- | :--- |
| **Foolscap** | **Dead** — `foolscap.app` is a live *"quiet writing app — notes, journal, tasks. No AI, no tracking… like a sheet of paper."* That is this product's positioning almost verbatim. |
| **Docket** | Dead. Two task apps carrying the bare word, plus an entire legal-docketing software category. |
| **Chit** | Dead, and worse in India, where *chit* means chit-fund software — a whole ERP sector. |
| **Recto** | Contested. `rectoapp.com` is a live SEO tool on a lifetime-deal model. Different category, bare word, `.com` gone. |
| **Escapement** | Contested. `escapement.app` and `escapement.watch` are both taken by horology tools. Category differs; the domain does not exist to be had. |
| **Detent** | **Lightest collision found in the entire exercise.** One iOS fidget-wheel toy. No productivity occupant, no filing surfaced. |

**Detent** is the mechanical catch that holds a position until deliberately released — the click in a camera dial or an indicator stalk. It is literally the enforcement layer: *#2 will not open until #1 is closed; three lines and no fourth.* Plain, engineering, a part name, exactly the Casio register. **Its flaw is stated rather than sold past:** stress is ambiguous (DEE-tent / dih-TENT) and *détente* sits close in the ear — the same failure mode that killed Chronometer in §1.42, where *the collision is in the ear, not the spelling.*

**Correction to §1.42, and it generalises.** The agency round passed **Foolscap** as a clean survivor. It is not, and the occupant is a direct positional competitor. **Every remaining survivor from that round — Shears, Nagi, Decidere, Verdict, Fude, Chop, Escapement, Thirty-Nine — should be re-searched before use.** The agencies searched at generation time; the list has not been re-verified since, and one confirmed false positive is enough to distrust the rest.

### 1.44 The founder clarifies the name — familiar authority

The founder rejected both ends of the previous search: **Primacy** was abstract and easily misread; **Firstfew** was understandable but lacked stature; **Detent** had technical provenance but was not a word most people know. Their reference example was **Submarine** — a familiar word that sounds substantial because it arrives with an existing world of engineering, capability and purpose.

This produces a more useful rule than "tool word": **familiar authority**. The candidate may be an instrument, system, command term or technical concept. It must be widely understood, easy to say and spell, relevant to deciding what deserves attention, and must leave control with the human. The name should borrow authority from what the word already means rather than simulate authority through obscure vocabulary.

**Radar is the current lead.** It finds meaningful objects within noise while leaving interpretation and judgment to the operator. That maps cleanly to the product: the framework makes a contested day legible; the user decides. **Protocol** is the strongest non-object alternative because the product selects and enforces a time-tested way of proceeding for a recognised problem. **Vector** is the strongest directional alternative because it gives effort direction and magnitude. **Dial, Command, Mission, Core and Lock** remain secondary explorations with explicit weaknesses recorded in `NAMING_DIRECTION.md`.

The initial collision screen killed several excellent meanings: **Compass** is now the bare name of multiple daily-planning products, including one that proposes a Big 3; **Point** is a live Ivy Lee productivity product; **Aim** has current goal-planner products; **Resolve** has current focus, journal and day-planner products; **Lens** and **Scope** are occupied in adjacent prioritisation territory. No surviving candidate has received professional trademark clearance.

### 1.44 The Decide family — Select, Selector, Decide, Decisive, Decide One

Founder proposed a sequence of candidates in one lineage. Recorded together because the progression itself is the finding.

**Select — rejected.** Genuinely good instincts in it: the adjectival sense (*a select group, select cuts*) is authentically premium, and selection is subtraction by another name. Killed by three things: it is the **category word** (a tool that selects, named Select — the doctrine that killed *Priority*); **SELECT is the most-typed keyword in software** (SQL, HTML `<select>`, every UI action), which drowns it for a technical founder audience; and it is a verb/adjective with no shape, failing the tool-word rule.

**Recorded distinction, generally useful:** an empty search result means two opposite things. *Krama* returned nothing because **nobody** uses the word. *Select* returned nothing because **everybody** does — the engine could not isolate it. **A word you cannot search for is a word you cannot own.**

**Selector — rejected**, though the move was correct. Turning the verb into a noun is exactly the tool-word correction. It fails because *selector* is developer vocabulary used dozens of times a day — **CSS selectors, Redux `useSelector`/`createSelector`, jQuery, XPath, Kubernetes label selectors** — which is worse than *Select* for the local-first/HN audience that `SCALE_PLAN.md` §3.5 names as the highest-fit launch channel. Also the `-or` suffix places it in the **functional-descriptor class** (Selector, Organizer, Planner, Tracker, Prioritizer), and it is an *agent noun* — a role, not an object. **Shears has a shape; Selector has a job description.**

**Decide — rejected, and not on availability.** Even if free, it could not be owned: a decision instrument named *Decide* is descriptive in its own class. The distinction that explains why Notion and Linear succeed as abstractions: **a notion is not a note, linear is not a project tracker — those names are oblique to their category.** *Decide* stands in the middle of the road.

**Decisive — the strongest candidate of the family, and arguably of the whole search.** It fixes three failures at once: it names **the person, not the function** (the Superhuman class), so it escapes the category-word trap; it is genuinely aspirational, which Clearing and Merit were not; and it needs no explanation, which Krama and Apoha did. Carries *decidere* natively. First search returned no dominant occupant, and — unlike Select/Selector — the result is trustworthy because *decisive* is not a technical term. **Weaknesses on record:** three syllables and unshortenable; moderate trademark strength as a common word; it implies a deficiency (buying "Decisive" says you currently are not, where Superhuman is pure aspiration); and it has had **one** search where Shears had two.

**Decide One — assessed, with a collision to weigh.** Genuine strength, possibly unintentional: **"Decide one"** reads as an instruction, not just a name — *decide the one thing* — which lands the priority-had-no-plural story directly. The compound also makes a descriptive core registrable.

**But: DAY ONE / DECIDE ONE.** Day One is the established leader in personal daily writing (2011, $49.99/yr, the app benchmarked in `MONETIZATION_PLAN.md`). Same two-word structure, same closing word, same rhythm, same opening letter, adjacent category. Not a legal problem — the marks are distinguishable — but a **word-of-mouth problem**, and word of mouth is the entire distribution plan under a no-marketing-spend constraint. Also noted: the compound *narrows* the mark rather than fixing it; you would own "Decide One" but likely could not stop "Decide Daily" or "DecideNow."

**Rejected from the same list:** D·CIDE and Decide° (untypeable punctuation — unsearchable, broken in URLs and App Store names, and the "novelty spelling" the founder correctly ruled out themselves); Daycide (*-cide* is the killing suffix); Decider (`-er` descriptor class, plus Decider.com, a live NY Post site); DecideOS ("OS" is exhausted, and an OS is maximal software while the product is an instrument); DecideX and Decide Pro (founder's own correct assessment — X is generic, Pro is a tier not a masterbrand); D01 (not standalone).

**The model-designation idea is worth keeping.** *"Give the instrument a model designation"* is the **Leica M6 / Braun / Teenage Engineering OP-1** move — the most instrument-coded, most aspirational structure proposed. But it requires a **distinctive parent**: Leica M6 works because *Leica* is ownable and *M6* is the model. A generic parent plus a number reads as a release version, not a product. The structure would work with a distinctive word in front — *Shears 01*, *Krama M1* — and is recorded here for use once the masterbrand is settled.

**Standing position: Decisive leads, Shears is the fallback.** Decisive wins on the axes the founder has consistently prioritised (aspirational, elevated, no explanation required); Shears wins on concreteness and on verification, having survived two independent agency searches where Decisive has had one. **A second independent check on Decisive remains outstanding** — this round demonstrated twice (Plumb, Whittle) that a single search produces false positives.

---

### 2026-09-11 14:21 — claude

Deploy became one command (npm run deploy: audit, build, publish, verify). decideone.app moved off the Sites project onto the Cloudflare Worker in the founder's own account; the apex CNAME it replaced is recorded in DEPLOY.md as the rollback. Rule 0 added to the audit so deleting a governed surface fails instead of silently skipping its checks. npm run tree and npm run brief added because three agents share this tree and reading the docs costs ~140k tokens.

---

### 2026-09-11 15:26 — claude

MonthlyLogSpread.jsx rewritten by another agent, 397 lines to 282, into a weekday-grid calendar with month navigation. Found uncommitted and unrecorded after a delete-and-rewrite that briefly broke the build and tripped Rule 0. Committed here rather than left loose, because uncommitted work is how this repository has lost changes before. Both gates green at the time of committing. The author did not record a decision for it: if the monthly view's shape is now settled, it wants a row in DECISIONS.md.

---

### 2026-09-11 17:28 — claude

Regional pricing removed: $39 is now the price everywhere, India included (was ₹999, now ~₹3,861, an increase of about 3.9x). Founder decision 11 Sep 2026, taken after being shown the consequences. VISION.md needed no edit - it names no rupee price and the $39 USD figure does not move, so §11.1 and BR5 stand. Recorded as B-36 with what was given up in MONETIZATION_PLAN §5.3a. Three pod members advised holding $39/₹999 when asked about LOWERING the price; none was asked about raising the rupee price and none endorsed it, which B-36 states explicitly so it is not later mistaken for agreement.

---

### 2026-09-11 17:31 — claude

Rule 24 added to the audit: the price in VISION.md §11.1 is canonical and the app, README and MONETIZATION_PLAN must agree with it. Proven against all three failure modes by temporarily breaking each one - an app price VISION never decided (this is B-28 replayed), a rupee price after B-36 removed regional pricing, and a README that stops stating the price. Repricing is now one line in VISION plus a passing audit, instead of a nine-file manual sweep nobody checks.

---

### 2026-09-11 22:24 — claude

B-37: Decide One is now free. No paid tier; the ask moves to the end of a day actually closed, once and without blocking, through Dodo. VISION §11.1 changed first per rule 5 and now declares 'Canonical price: free'. Rule 24 taught that free is a canonical state, and asserts no price may appear anywhere in src/ while VISION declares it - proven by putting one back and watching it fail. Reverses M2, BR5 and B-36, all marked superseded. Reason: the price moved six times in one day and none could be evaluated, because nobody had been asked to pay and the telemetry holds 54 seeded users with an eight-day maximum tenure.

---

### 2026-09-11 22:25 — claude

Instrumentation for the usage bet (B-37): archive_gate_hit fires once per review surface per session with surface and history_depth_days; an install_date is recorded in localStorage separately from the anonymous id so a cleared-storage reset is distinguishable from churn; getRetention rewritten to weekly cohorts, offsets 1/2/7/14/30/60/90, and active redefined as day_closed rather than any event. Immature cohorts report null rather than 0 - every day-30 cell against the current seeded data is null, which is the honest answer and the old query would have printed zero.

---

### 2026-09-11 22:29 — claude

Direction confirmed by the founder: Decide One ships free, with an optional paid way to support it, and the site copy now says so. The ambition is unchanged and should not be read down - this is meant to be a world-class instrument that genuinely makes people more productive, and the free model is how it reaches enough people to become that, not a lowering of the bar. The intended feeling is that the tool becomes something a person relies on daily and chooses to support because it earned it. Note for whoever writes copy next: pursue that, but never in the register of habit-engineering. VISION §11.3 and QC Rule 22 cut streaks, scores and verdicts deliberately, and words like hooked belong to the vocabulary that was removed. The product earns support by being good, not by being sticky. Landing copy changed accordingly: the belief strip now says Free, No Account; the nav and access section say Start Free and Free To Use rather than Launch Preview; the cost FAQ answers plainly; and the line telling visitors checkout was disconnected is replaced by what is actually true - free, stays free, asked once at the end of a day you closed, declining is a complete answer.

---

### 2026-09-11 22:33 — claude

TELEMETRY_SPEC.md written: the brief for measuring the free product. Its governing rule is that the site and the instrument are two systems with different rules - heatmaps, geography and session replay belong to decideone.app where the only thing on screen is marketing copy the founder wrote, and none of them may ever touch the app, where the thing on screen is what a person wrote about their own day. Seven red lines are stated before any requirement, each load-bearing for a claim already published. Also records what already exists (14 app events, 12 server analytics methods, automatic click/error/visibility capture) so nobody rebuilds it, and the three known defects that make current output untrustworthy.

---

### 2026-09-11 22:42 — claude

A date is no longer treated as a verdict. Top3HardTasks, ProductivityFrameworks and BulletItem all computed a missed state as 'not completed and the day has passed' and rendered it red, so anyone returning after a week away met a week marked red by the software. Red now follows only a mark the person made. Recorded as a fourth rule in VISION §11.3 - the product never infers failure from a date - with the founder's standard attached: what matters is the day that is there when they come, and if one person has one productive day that is a win. Also added a briefing section to AGENTS.md and CLAUDE.md on writing a good brief: say the goal not the mechanism, say what you are afraid of, one thing per ask.

---

### 2026-09-11 22:48 — claude

Carry-forward shipped: on a fresh day, priorities still open from the last day used are offered for today, with per-item choice. Marks the originals as moved rather than leaving them to read as abandoned. Offered once per day, silent if today already has content or the previous day was finished, and the search stops at the first day with content so it can never present a history of absences. Copy follows VISION §11.3's fourth rule - it states what is open, never counts what was missed, and Start fresh is a real answer rather than a dismissal. Verified end to end in the browser: modal appears with the completed task correctly excluded, both priorities land in today's free slots, originals persist as moved, and it does not reappear on reload.
