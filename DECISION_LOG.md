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

---

### 2026-09-11 22:51 — claude

Brand documents written: BRAND_HOUSE (purpose, pillars, what this brand is not), BRAND_KEY (target, insight, discriminator, with assumptions marked as assumptions since there are no users yet), BRAND_BOOK (the voice, vocabulary, claims register and worked examples). All three are downstream of VISION §11 and say so. Founder direction recorded: always motivating and positive. The book resolves that against Rule 22 by separating encouragement from loss-aversion - streaks and scores are not positive, they are fear of loss, which is why a broken streak makes people delete an app rather than try again. Rule 22 removes the punishing mechanics and positivity fills the space. One surface stays neutral rather than upbeat: returning after a gap, where even Welcome back draws attention to the absence.

---

### 2026-09-11 22:52 — claude

Content-derived numbers are now bucketed before they are sent. dictation_completed sent an exact word count and reflection_saved an exact character count; both now send a band (1-5, 6-25, 26-100, 100+ for words; empty, 1-20, 21-100, 101-400, 400+ for characters). Knowing whether someone wrote a line or a paragraph improves the tool; knowing they wrote exactly 247 characters helps nobody and was sharper than the question needed. Brings the code into line with TELEMETRY_SPEC §1, which the code was violating. Also annotated the day_closed score as measured-but-never-displayed, with the reason: B-11 removed the Focus Quotient because a score with verdicts is the register Rule 22 cuts, so showing this one would be a DECISIONS reversal rather than a design choice.

---

### 2026-09-11 23:07 — claude

Landing page rewritten for the free positioning in the motivating and positive register. VISION §11.1 changed first per rule 5: the primary line is now 'You already know what matters. This helps you choose it.', which begins by trusting the reader rather than instructing them, and states free as a consequence of the purpose rather than a promotion - if the goal is one clear day for as many people as possible, charging works against it. The retired line is kept as an approved alternate with its dates. Twenty copy replacements across the page, plus the share metadata in index.html and the hero text drawn into the 3D journal object, which two greps found still carrying the old line.

---

### 2026-09-11 23:19 — claude

Brand cleanup on the cover and hero. The hero eyebrow is two lines with Free Forever carrying the emphasis - weight and contrast, not colour, since colour in this brand carries meaning rather than accent. Removed every gold treatment from the notebook cover: the monogram's 24K gold foil gradient is now an ink deboss, the selected volume tab is white rather than amber, the monogram circle and the gift ribbon are monochrome. Gold is Leica register and VISION §12.1 chose the Casio F-91W, where dignity comes from honesty about what a thing costs to make rather than from performing luxury. Note for later: the four tabs on the cover are volumes (Work, Personal, Projects, Private), not the Daily/Weekly/Monthly/Yearly views.

---

### 2026-09-11 23:26 — claude

Volumes removed entirely (B-38). Four volumes each held a separate journal with its own Top 3 - twelve open priorities and four decisions before the decision, which is the condition the product exists to treat sold back as a feature. The separation already lives in a better place: each of the three daily priorities carries a category, so the split is inside the three rather than beside them. Removed the concept rather than reducing to one, since a container with a single item is overhead in the code and in the head. Done now specifically because volume data lives under suffixed localStorage keys and nobody has data yet - the same change after launch is a migration of real journals. Old keys left in place, so it is reversible.

---

### 2026-09-11 23:31 — claude

Header typography and the view switcher. The wordmark went from 16px to 20px with more tracking - it is the only brand mark on the page and it sat smaller than felt right between two utility labels. Weight came down slightly as size went up, because confidence in a wordmark is size and air rather than boldness. The four view tabs are now one segmented control: a single rounded track in the page grey with the active view raised on it as a white pill, the way paper sits on a surface, with dark mode handled. Founder also asked for an overall premium feel 'like a 1000 dollar tool' - flagged rather than built, because that is BR8, the open conflict between the Casio F-91W brand model and the Leica-register craft already in the tree. Craft and precision are compatible with the Casio; luxury signalling is the thing BR8 has to settle.

---

### 2026-09-11 23:41 — claude

VISION §12.1a added and quoted verbatim: Casio and Leica are belief systems, not design languages. An agent - me - had read §12.1 as a visual instruction and posed the wrong question, asking the founder to choose between a premium look and a cheap one. The argument was never about how the product looks. A millionaire wears an F-91W because it tells the time perfectly, forever, and asks nothing of them; function that good outranks aspiration. Premium is not forbidden, fluff is. Simplicity is the product rather than a constraint on it - a layout that does not require the person to fill everything in. Free follows from the goal, and money is asked for only after value is delivered and demonstrated. The standing test replacing any appeal to looking expensive: would someone who could afford anything still choose this, because it does the one job better than anything else does. Propagated to BRAND_HOUSE, BRAND_BOOK and both agent rule files.

---

### 2026-09-11 00:05 — claude

VISION §13 written: the instrument standard, quoted from the founder. The pilot flies, the compass does not - an instrument is trusted because it is right, not because it is pleasant, and a compass two degrees off is worse than no compass because it is believed. Atomic grade is made checkable rather than left as a mood: exact alignment on the 24px cadence, correct numbers and an accurate clock (the item an instrument cannot get wrong and remain one), type readable at real size, space sufficient rather than merely tight, every state designed including empty and returning-after-a-month, zero console errors in any state, nothing on screen that is not information. Ornament is a defect. Armstrong, Jobs and Musk are recorded as an internal standard of seriousness and explicitly barred from public copy, since naming real people implies an endorsement the product cannot claim. §13.5 holds the website to the same bar and requires the 3D render to depict the actual product as a digital instrument rather than a physical book. Propagated to BRAND_HOUSE as a fifth pillar, BRAND_BOOK as test 0a, and both agent rule files.

---

### 2026-09-11 00:06 — claude

First pass of the §13 instrument inspection. Swept all four views on the live site: zero layout overflow, zero React errors, no page-level horizontal scroll. Two real findings fixed. The Top 3 priority rows were min-h-[44px] - the iOS touch-target minimum, a good reason, but off the 24px cadence §13.3 item 1 requires; 48px satisfies both minimums and the cadence, and gives the row more air. And the text input inside those rows was h-[48px] with leading-[44px], so the text sat two pixels above centre - a misalignment I introduced in the same change. Still open: the console is not silent because Cloudflare injects a Web Analytics beacon that the CSP blocks on every page load, which is both a §13.3 item 2 violation and a TELEMETRY_SPEC §1 rule 3 violation (no third-party analytics), and it is a dashboard toggle rather than a code change. Also the idle clock shows all hands at twelve when it means zero, which is ambiguous on an instrument.

---

### 2026-09-11 00:11 — claude

The device screens in the 3D scene now draw the actual Decide One interface instead of pasting the book's paper-page textures onto a display. appScreenTexture renders the masthead, the segmented view control, the dated card, three priority rows with checkboxes and minute steppers, and the countdown dial showing 90 minutes on the first priority - everything matching something a person will really see, at the same proportions, driven by one scale factor so it holds at both texture sizes. Required by VISION §13.5: a render that misrepresents the product is not craft, it is an inaccuracy on an instrument. Two things NOT done and needing the founder's eyes: switching the hero from the book to a device needs camera framing work, since the desktop kind is not framed for the hero viewpoint; and I cannot visually verify any WebGL output in my browser tool - the live site running unmodified code captures as a black rectangle in exactly the same way, so the capture is the limitation rather than the scene.

---

### 2026-09-11 00:15 — claude

Removed the material explorer from the landing page - Explore The Object, Every layer One purpose, the three finish swatches and its own 3D scene. It invited people to turn an object over and inspect its layers, which is craft as the subject rather than craft in service of the product, and VISION §13 says ornament is a defect. It was also the clearest piece of the BR8 Leica register. The devices section survives and still does the job of showing the product on real hardware. Also fixed the Cloudflare beacon diagnosis: it is injected at the edge for browser user-agents only, which is why curl never saw it and why it appears in neither our HTML nor wrangler.jsonc - the fix is the Web Analytics automatic setup toggle in the dashboard.

---

### 2026-09-11 00:21 — claude

B-39: one site. decideone.app serves both the landing page and the instrument from a single origin, and no second host will be added. The consequence recorded in TELEMETRY_SPEC §0a: the A/B split is a rule about surfaces rather than origins, so no third-party script may ever be allowed in the CSP - allowing an origin allows it on the page where people write their priorities. Cloudflare RUM was turned off on that reasoning despite giving accurate Core Web Vitals for free. Site analytics are first-party and route-scoped from here: heatmaps stay possible for marketing surfaces but only as code this repository owns, mounted on landing routes and never on an instrument view. LCP, INP, CLS and TTFB become ours to build through PerformanceObserver.

---

### 2026-09-11 00:25 — claude

Halved the critical-path JavaScript. The entry bundle was 739KB raw / 230KB gzipped because App.jsx statically imported the weekly briefing module, which statically imported jsPDF, which pulls html2canvas - roughly 98KB gzipped of PDF machinery downloading on every first paint for a feature nobody had asked for. canvas-confetti was eager in two components for the same reason. jsPDF now loads inside the one function that builds a PDF; confetti loads on a promise chain so the handler stays synchronous and never blocks an interaction. Entry bundle is now 355KB raw / 105KB gzipped. Verified on a restarted dev server with a cleared vite cache, because the first check showed stale HMR 500s from the intermediate broken state rather than the real result.

---

### 2026-09-11 00:26 — claude

Heatmaps and session replay cut from TELEMETRY_SPEC outright, recorded as §0b so a future proposal is a change to that section rather than a ticket. Three reasons in the order that decided it: they cost page weight on the page whose load time was the live complaint, and §13.3 asks the instrument to be fast before it is anything else; the exit-section metric already answers where we lose people in one number from an IntersectionObserver the page needs anyway, so a heatmap would render the same answer as a picture and charge for it in kilobytes; and under one origin a mis-scoped replay script records someone writing their priorities, silently and totally, so the safest version of that script is the one that does not exist. Section dwell, scroll depth, exit section, CTA clicks and rage clicks replace them and are enough.

---

### 2026-09-11 00:29 — claude

Built the first-party PerformanceObserver replacing Cloudflare RUM (TELEMETRY_SPEC §3.2). Measures LCP, INP, CLS and TTFB with no dependency, no network fetch and nothing to allow in the CSP, reporting once through the existing telemetry pipeline as the page is hidden. Scoped to marketing entries by reading the view the page opened on rather than the current one, since LCP is decided during first paint. Records timing only - no coordinates, no element text, no content. Verified: thresholds classify correctly at every boundary, an unavailable metric reports null rather than a flattering zero, layout shifts the person caused are excluded, and the report fires exactly once across visibilitychange and pagehide. Not verifiable here: this browser pane emits zero LCP entries despite supporting the type, because the page never counts as a visible viewport - the same class of limit as WebGL capture.

---

### 2026-09-11 00:30 — claude

Fixed the idle clock reading as 12:00. With no duration set, both hands sat at zero degrees, which points at twelve, so an unset dial looked like a clock telling the wrong time. VISION §13.3 item 3 puts a correct clock above everything else on that list and §13.2 says why: an instrument two degrees out is worse than no instrument, because it is believed. No duration now means no hands - the dial keeps its twelve markers and centre pin, which reads as an instrument at rest rather than a wrong time. The aria-label already said No time set, so only the picture was lying. Verified on the live daily view: zero hand lines, twelve marker lines, label unchanged.

---

### 2026-09-11 00:39 — unattributed

Deployed the clock fix (2b69f32) to the Worker: assets/index-CJNgjNzd.js, version e3bb3dda. verify:live correctly reports DIFFERENT - decideone.app still resolves to the old Sites project, so the fix is live on decide-one.decide-one-stationery-instrument.workers.dev and not yet on the apex. The DNS move in DEPLOY.md is still the blocker. Asked to turn the Cloudflare RUM beacon off and could not: it is Web Analytics automatic setup on the decideone.app zone, injected at the edge for browser user-agents only, and this machine's wrangler OAuth token holds zone (read) with no RUM or analytics write scope. Confirmed still present on the apex with a browser UA - static.cloudflareinsights.com/beacon.min.js, token 48c34fb06848420fbe5a921b1283adf8 - and confirmed absent from the Worker origin, which is consistent with it being a zone setting on the old project rather than anything this repository serves. It stays a dashboard action for the founder. Noted in passing and not fixed: canvas-confetti is statically imported by src/hooks/useLicenseAutoActivation.js while ProductivityFrameworks.jsx imports it dynamically, so it cannot leave the entry chunk - that partly undoes bc221b8.

---

### 2026-09-11 00:44 — unattributed

Correction to the entry above, and the RUM beacon is off. Cloudflare Web Analytics automatic setup is now Disable on the decideone.app site entry - the founder did it in the dashboard, since this machine's token has zone (read) and no RUM write. Verified with a browser user-agent: zero cloudflareinsights references on the apex, only the app's own module script and one inline script remain. The console should now be silent, which closes the VISION §13.3 item 2 and TELEMETRY_SPEC §1 rule 3 violation open since 11 September, and the first-party PerformanceObserver from 3b8c52d is now the only source of LCP, INP, CLS and TTFB. The correction: I reported that verify:live said DIFFERENT because decideone.app still points at the old Sites project. That is false and DEPLOY.md is why I believed it. 80a225c moved the apex to the Worker on 11 September and only changed wrangler.jsonc - DEPLOY.md and AGENTS.md/CLAUDE.md both still say the DNS step is outstanding and instruct the next agent to expect DIFFERENT. Evidence that it is done: decideone.app and the workers.dev address return an identical etag c09d2d17f4764e08fe561c1c0b58b6ef, while decide-one.pages.dev serves an unrelated older build, index-DsE169m7.js. verify:live now reports MATCH on index-CJNgjNzd.js. The DIFFERENT immediately after the deploy was an edge-cached HTML response - cf-cache-status HIT on a max-age=0 must-revalidate document - which cleared within about ten minutes. Whether disabling RUM invalidated the injected copy or the cache simply aged out cannot be separated from here and is not claimed. Still to do: DEPLOY.md 'One manual step is still outstanding' and the matching paragraph in the agent rule files are now wrong and should be rewritten, preserving the DNS rollback row since it is the only copy. The Sites project and decide-one.pages.dev still exist as the documented fallback.

---

### 2026-09-11 00:47 — unattributed

Corrected the stale hosting claim in five documents. 80a225c moved decideone.app to the Worker on 11 September and changed only wrangler.jsonc, so DEPLOY.md, AGENTS.md, CLAUDE.md, DECISIONS.md N30b and WORK_REMAINING.md item 3 all still said the DNS move was outstanding and told the next agent to expect DIFFERENT. That is what made me misdiagnose a stale edge cache as a routing fault earlier today, so this is the drift LANDING_PROTOTYPE.md exists to warn about, caught one session late. DEPLOY.md section is now 'The domain move is done' and carries the diagnostic that was missing: the apex HTML is edge-cached, a DIFFERENT in the minutes after a deploy is a stale cache rather than a routing fault, and the etag comparison against the workers.dev address settles it - explicitly noting that comparing against pages.dev was the original misdiagnosis, since an identical bundle fingerprints the CDN and not the publisher. The DNS rollback row is preserved verbatim because it is still the only copy, with its surrounding prose moved to past tense and a 'Rolling back' heading added so it is findable. Added a DEPLOY.md section on the zone injecting scripts the repository never served, with the browser user-agent curl, because a plain curl showed a clean page for a day while every real visitor got the beacon. DECISIONS.md: N30b marked superseded in the house style used by N23 and N34, retained for its reasoning, with N39 recording the host switch and its verification method and N40 recording RUM off and that no agent can set or restore it. Build and all 24 QC rules pass.

---

### 2026-09-11 00:56 — unattributed

Backend audit of all 1,548 lines in server/, with the correctness defects fixed and the rest reported rather than guessed at. Fixed, each with a reason. (1) exit_breadcrumbs recorded nothing at all: sanitizeProperties replaces every array with a _count and drops the values, so cleanProps.trail was always undefined and the insert loop ran zero times - the exit-path metric that 818f068 chose INSTEAD of heatmaps has been writing no rows. Now read from the raw properties and bounded to 50 hops of 64 chars, since surface names are enums rather than written content. (2) The zero-knowledge sanitizer matched sensitive keys by exact lowercase string, so task_text was redacted and taskText was stored - every camelCase spelling of a private field went in as content truncated to 100 chars. Now substring matching, with key and token left exact because key as a substring would redact first_keypress_latency_ms and silently kill the hesitation metric. (3) total_rage_clicks, total_abandoned_modals and total_client_errors counted the LIMIT 20 sample, so every friction total was capped at 20 and a day with 400 rage clicks read the same as a day with 20. Now a real COUNT, with sample_size reported alongside. (4) The z-score anomaly detector included the day under test in its own baseline, which pulls the mean toward the outlier and shrinks the deviation being measured - the bigger the anomaly, the better it hid. Baseline is now the prior days only. (5) The funnel intersected user lists with Array.includes, O(n squared) over every user who ever opened the app, on every dashboard load. Sets. (6) The server bound 0.0.0.0 while serving an owner-private dashboard, an unauthenticated ingestion endpoint and an unthrottled /api/v1/auth/verify - anyone on the same network could reach all three. Now 127.0.0.1 with HOST to override deliberately. (7) The owner key was also accepted as ?key= and ?token=; nothing used them, the dashboard sends x-admin-key, and a credential in a URL lands in access logs, history and Referer. Deleted. (8) recordHeartbeat wrote active_seconds straight into an accumulating SUM with no validation - a string threw on bind and surfaced as a 500, a large number inflated standard app time permanently. Clamped. Tests 12 and 13 added for the trail and the heartbeat; 13 pass. NOT fixed, deliberately, because each needs a decision rather than a guess: the circadian morning/evening split uses getUTCHours on a UTC ISO timestamp, so for a GMT+5:30 founder morning is 10:30-17:29 local - the test prints Morning=1 Evening=296 and passes, and it cannot be fixed server-side because the local hour never leaves the browser. The daily-ritual funnel intersects DISTINCT anonymous_id across all time with no window and no ordering, so step 4 on Monday plus step 3 on Friday counts as a conversion. Every metric keys off the client-supplied timestamp column while the schema already carries a server-authoritative created_at. And six events the dashboard analyses are never emitted by src/ - patron_modal_viewed, checkout_initiated, license_activated, dictation_started, rapid_log_status_toggled, experiment_impression - so the entire monetization funnel, the A/B engine, the dictation success rate and the task completion ratio are structurally zero; while nine events the app does emit have no consumer, including web_vitals from 3b8c52d, which means the Core Web Vitals built to replace Cloudflare RUM currently have nowhere to be read.

---

### 2026-09-11 00:59 — unattributed

The six dead dashboard metrics, closed three different ways, plus the broken feature underneath two of them. The largest finding was not a metric. App.jsx passed onTranscriptionCommit to useExecutiveDictation, which only ever calls onCommitEntry, so the optional chain resolved to nothing and every dictated sentence was transcribed and then discarded - voice capture has never committed a word to the journal. The same destructure asked for targetSection, setTargetSection and finalTranscript, none of which the hook returns, so ExecutiveVoiceHUD received onSelectTarget=undefined and its three target buttons threw a TypeError on click. That is a VISION §13.3 item 2 violation as well as a dead headline feature, and dictation_started plus dictation_completed being absent from the data was the symptom rather than the disease. Fixed by aligning App.jsx to the hook's real contract and dropping the unused finalTranscript prop the HUD never read. Added an onStart callback fired from recognition.onstart rather than from toggleDictation, so a permission denial or an unsupported browser is never counted as a start. rapid_log_status_toggled: handleUpdateRapidLog served creation, completion and deletion through one telemetry call, reporting all of them as rapid_log_created, so created counted every save and the completion ratio sat at 0% with finished tasks on screen. It now diffs against the previous list and emits created on growth, status_toggled with to_status on a completed flag change, and nothing on a text edit. The monetization funnel was deleted rather than wired. patron_modal_viewed and license_activated have real surfaces, but checkout_initiated cannot exist - checkout is in WORK_REMAINING under Deliberately Excluded - and a funnel whose middle step is structurally zero reports total failure to convert people through a door that was never built. TELEMETRY_SPEC §3.3 already names the replacement: the only conversion that matters now is site to first day closed. The dashboard never rendered it either. experiment_impression stays dormant because §3.4 lists the assignment layer as work rather than a defect, but getExperimentResults now returns status no_assignment_layer with a note instead of an empty object that reads as a test having run and found nothing. Rule 25 added to the audit, the Telemetry Contract Gate: every event the server branches on must be emitted somewhere in src/ or be named in a DORMANT map with its reason, so this class of defect fails the build instead of showing up as a confident zero. Verified it catches a planted unemitted event rather than passing vacuously. Build, 13 telemetry tests, 25 QC rules and a zero-error console on the dev server all pass.

---

### 2026-09-11 01:03 — unattributed

Rule 25 made bidirectional, and web_vitals given the readout it never had. Direction 2 asks a different question from direction 1, deliberately. Every emitted event already feeds getFeatures' top_events distribution, so 'is it analysed' would have been the wrong test and would have forced a dedicated metric onto events that only need to exist in the stream. The test is 'is it declared': TELEMETRY_SPEC §2 is now the registry, and an event absent from it is one nobody agreed to collect. That required making §2 a literal list rather than prose - it named 14 app events while src/ emitted 26, with the SDK's seven described in sentences and never named, so priorities_carried_forward, view_changed, web_vitals, dictation_started and rapid_log_status_toggled were being collected from people without appearing in the document that governs collection. §2 now lists 19 app events and names the 7 SDK events, which is exactly the 26 the code emits, and it says Rule 25 enforces it so the next person adding an event finds out at the gate rather than in a review. Verified both directions with one planted rename, which tripped both checks at once. AnalyticsService.getWebVitals added with the route /api/v1/analytics/web-vitals behind the same owner gate as the rest. Reported at the 75th percentile because that is what Chrome's own thresholds are defined against and a mean is dragged around by a single slow phone; a metric with no samples reports null rather than 0, matching the emitter's own care on that point - webVitals.js keeps an unavailable metric null precisely so it cannot read as a perfect score, and an endpoint that turned it into 0 would have undone that. Grouped by entry_view, which meant adding that one property at the emit site: §3.2 asks for these per page, and the view the page opened on is the only page identity correct for LCP, since LCP is decided during first paint. Verified live: 401 without the owner key, and with it LCP p75 3000ms from a four-sample fixture with INP correctly null. Build, 14 telemetry tests and 25 QC rules pass.

---

### 2026-09-11 01:17 — unattributed

Production telemetry now exists. The Worker ran no code at all, so every event the SDK sent in production went to the SPA fallback and was answered with an HTML page the client read as success - the reason there has never been a single real row. worker/index.js adds exactly one thing, an ingestion endpoint, and passes everything else to ASSETS untouched, so static-first behaviour is unchanged and B-39 holds: same origin, first-party, no script on any page, nothing new in the CSP. Storage is D1 (cac61b53-d316-469c-a6af-798b313a122b, created in APAC) rather than Workers Analytics Engine, because db.js is already SQLite DDL and analyticsService.js is 600 lines of SQLite SQL - D1 speaks the same dialect, so it ports rather than gets rewritten, and Analytics Engine's own query model would mean redoing all twelve methods and their tests to solve a volume problem that does not exist yet. Geography costs nothing and never touches an IP: Cloudflare resolves country, region and city at the edge before the request reaches our code, which is stronger than §3.1's 'IP discarded in the same request' because the address never enters the process. Country is guaranteed; region and city are best-effort and stay null rather than becoming 'unknown', which would later be counted as a country. The schema adds three columns that close known defects rather than adding features: received_at, because every metric currently keys off a client clock any client can set; local_hour, sent by the browser, because getUTCHours is why the circadian dual-visit loop reads 0% for everyone outside UTC; and the §3.1 acquisition set, referrer_host and utm_*, which the app never sent. The referrer is reduced to a bare hostname in the browser, not on the server, so the path never leaves the device - §3.1 says host only because a referring path can itself be a private page. Found and fixed a defect that made an earlier fix pointless: the sanitizer existed in THREE copies with three different spellings - client, Node server, and now Worker - and the client's copy replaced every array with a count before sending, so exit_breadcrumbs lost its trail at source and the server-side fix from 95b55fe could never have received one. All three now import shared/telemetrySanitize.js, and the trail key is declared a structural array that survives sanitizing, bounded to 50 hops of 64 chars, because surface names are structure rather than written content. Test 12 rewritten to assert both halves: the trail is kept and bounded, and a noteBody riding alongside it is still reduced to a length. Verified end to end against a local D1: a batch ingests, the heartbeat clamps 999999 seconds to 3600, GET on the ingest path is 405, asset passthrough still returns 200, country resolves, acquisition columns populate, and a planted private sentence is stored as noteBody_length rather than text. Remaining before real data flows: VITE_ENABLE_TELEMETRY must be set true for the production build - added to .env.example with the explanation that it does not by itself start collection, since the consent toggle in UnifiedMenuModal still defaults to off - and analyticsService must learn to read D1 as well as local SQLite.

---

### 2026-09-11 01:31 — unattributed

Rule 0 now checks reachability, not existence. It walks the import graph from src/main.jsx (static, React.lazy, CSS @import), transitively, and fails a governed surface nothing arrives at. Negative-tested three ways; the first version passed its own test by accident because a commented-out import still reads as an import, so whole-line comments are now stripped first. Found MonthlyBreakerPage orphaned since 4e68de4 with the audit green throughout; de-governed it and removed Rule 18's bare existsSync, since that clause was asserting a guarantee about something the product does not contain. Corrected my own failure-message wording: an unreached module is tree-shaken and never bundled, so the harm is a false green, not weight. Recorded B-36 (done), B-37 and B-38 (open: the month breaker, and 13 unreachable files including C3's DayConditionPrompt and the write-only rapid log).

---

### 2026-09-11 01:34 — unattributed

Rule 25 had the same existence-vs-reachability hole Rule 0 did: walkSrc scanned every file in src/, so a track() call in a file nothing imports counted as an emitter. Direction 1 now tests emittedLive - emitters the application actually reaches - and names the orphan-emitter case separately. Latent rather than live: day_condition_selected and day_condition_skipped are emitted only from the unreachable DayConditionPrompt, but the server does not analyse them today, so no metric is currently a permanent zero. Negative-tested by making the server analyse day_condition_selected and confirming the new branch fires. Also found a fourth name mismatch in the dead spine glow: index.css defines .ambient-gold-spine-glow but the prefers-reduced-motion override targets .spine-ambient-glow, so the animation would not have stopped for reduced motion even if the feature had ever rendered.

---

### 2026-09-11 01:39 — unattributed

C3 restored. DayConditionPrompt is wired back into App.jsx with its original once-a-day effect, recovered from 4e68de4^ rather than rewritten. Verified in-browser: the prompt renders on today before a method exists, 'Everything looks urgent' routes silently to the Urgent/Important Matrix, localStorage holds dayCondition all_urgent and activeFramework eisenhower, it does not reappear on reload, and the console is clean. Static import rather than lazy: it is the first thing shown on a new day and a Suspense flash there is the wrong first impression. Also deleted SpineAmbientGlow entirely - it had four name mismatches and was drawn on the bi-fold spine P11 removed, and the whole useAmbientReminders hook turned out to be dead because notificationsEnabled can only be set by requestPermission, which nothing calls.

---

### 2026-09-11 01:43 — unattributed

The Today stream is on the page again. RapidLogSection renders inside LeftPage on the recto, beneath the timeboxes, with the props App had been threading into LeftPage all along and LeftPage had been dropping. Resized to content (it was written flex-1 to fill the verso of a bi-fold that no longer exists), one add affordance instead of two, aria-label corrected from 'Today Rapid Log' to 'Today'. Correction to my own earlier report: notes were never invisible - OmniSearch indexes rapidLog and has a Notes and Ideas filter, and the export and weekly PDF both carry it. The defect was narrower: no on-page display. Verified in-browser: TODAY (1) renders with the seeded item, Add line creates and focuses a new row, typing persists to localStorage, console clean. B-23 is still open and this does not settle it; it only ensures the answer is not 'nowhere'. Dead code is now 8 files rather than 13.

---

### 2026-09-11 01:47 — unattributed

Closed the same hole in two more rules, found by a peer session's sweep. Rule 9 was entirely vacuous: HabitTracker.jsx and EveningReflection.jsx do not exist (P2/P3 cut them) and Top3HardTasks.jsx is unreachable. Rule 2 could not fail for two independent reasons: dead subjects, and neither forbidden pattern appears anywhere in src. Both repointed at the components that draw a row today, via a new requireLiveSubjects helper that asserts an inline subject is reached rather than merely named; ProductivityFrameworks now declares itself the same way for Rules 11 and 12. Negative-tested three ways. Also corrected the audit's printed readout, which still described Rule 0 as an existence check, and softened my own Rule 0 comment: git does not record how a change was staged, so 'git add -A' was inference. What history carries is that 4e68de4 removed both the import and the render site of MonthlyBreakerPage and DayConditionPrompt and named neither.

---

### 2026-09-11 01:50 — unattributed

Deleted the eight remaining orphans, 1,165 lines, staged by name: CategoryFilterBar, DailyVictoryCardModal, GiftAccessModal, MonthlyBreakerPage, PageFlipNavigation, Top3HardTasks, quotes.js, TimeCapsuleEngine.js. Founder delegated the call after asking for a recommendation. Checked first that no current document promises any of them - every DECISIONS.md hit was my own B-38 row, and VISION.md names Top3HardTasks as the source of the red-week defect rather than as a feature. Two carried Conquered and Victory and confetti, vocabulary the audit bans on live surfaces, so they were an armed trap rather than inert clutter. All recoverable from git. Separately found confetti firing in LIVE code: ProductivityFrameworks.triggerCelebration is called at three sites including when all three priorities are done. Flagged, not changed - that is a visible behaviour change, not cleanup.

---

### 2026-09-12 15:44 — Claude Opus 5

Established the Organic Growth Pod (SEO/AEO/GEO) and fixed the record-keeping it depends on.

SEO_CHARTER.md is the governing document, standing to this pod as GROWTH_CHARTER.md does to the growth pod. It records the founder's intent of 12 September in operational terms, and — importantly — records the volume decision and its reasoning, because that is the constraint most likely to be quietly reversed by an agent optimising for output. The founder was shown three options and chose evidence-gated waves over publishing 1000 posts immediately: Google's scaled content abuse policy penalises at site level, there is not 1000 posts of honest material in a three-framework tool, and VISION §12.1a is binding on the point. The pipeline is built to any volume; volume is a dial, not an architecture.

Four agents in .claude/agents/: seo-technical owns crawlability and the build pipeline, seo-content owns the words under VISION §11, seo-answer-engine owns structured data and citability, docs-archivist owns the record and may not edit code.

The audit behind it, all four verified by reading the files: every URL serves identical HTML (SPA fallback plus ?view= routing); index.html carries a hardcoded canonical pointing at the homepage, served at every path, so the site instructs Google to ignore every page that is not the homepage; sitemap.xml has one URL; there is no JSON-LD anywhere. Content cannot rank until the canonical is fixed, so Wave 0 is technical work and ships no content.

Record-keeping, which was the other half of the ask and mostly already existed. Rather than build a parallel logging system — a second source of truth is the one that goes stale — I fixed what was broken in the existing one. log_session.js fell back to 'unattributed' because nothing set AGENT, which is why the last four entries say so; it now falls back to the git identity and the agent definitions set AGENT explicitly. Added npm run handoff, which CLAUDE.md describes the need for at length but which nothing implemented: it appends a structured note capturing branch, HEAD, uncommitted files and anything written in the last 30 minutes, so an arriving agent acts instead of re-diagnosing. brief.js now surfaces the most recent open handoff.

Gates green: npm run test:qc passes, npm run build passes. No product code touched.

Still open: Wave 0 technical work (real paths, self-referencing canonicals, JSON-LD, generated sitemap, the Markdown-to-HTML pipeline, content QC rules). Also unresolved and not mine yet: brief reports decideone.app is NOT this build, so main has commits the live site has never served — content shipped before that is resolved is invisible work.

---

### 2026-09-12 15:51 — Claude Opus 5

Wave 0 and Wave 1: the site can now have more than one page, and has three.

Wave 0 was the blocker. Before this, index.html carried a hardcoded canonical pointing at the homepage and the SPA fallback served that file at every path, so every URL on the site was instructing Google to ignore itself. No content could have ranked regardless of quality.

scripts/build_content.js renders Markdown to real static HTML in dist/, per SEO_CHARTER §4. Not React routes, not a CMS, no framework migration — the product is an SPA because the instrument needs to be, but a guide is a document, and making documents into an application costs crawlability and buys nothing. Each page gets its own title, own description, and a self-referencing canonical. JSON-LD is emitted from front-matter rather than hand-written. sitemap.xml is generated from the same list that produced the pages; public/sitemap.xml is deleted, because a sitemap maintained by hand is a second source of truth and the second one goes stale.

One dependency added: marked, devDependency, build-time only, never reaches the browser. Hand-rolling a Markdown parser is the kind of laziness that ships bugs. Front-matter is parsed by hand because the schema is fixed, flat and ours.

Structured data added to index.html — SoftwareApplication, Organization, WebSite. There was none anywhere on the site before today, which was the largest gap for answer engines and for any model deciding whether this domain is citable. No aggregateRating: we have never asked anyone for a review and inventing one would be both spam and a lie. Price is 0 because VISION §11.1 says free.

Wave 1 is decision G6, now partly delivered: the three shipped methods each have a real page at a real path. Attributions checked against FRAMEWORKS.md rather than recalled — Ivy Lee to Schwab at Bethlehem Steel in 1918; the urgent/important distinction from the 1954 speech but the 2x2 grid built later by Covey, whose coined vocabulary is avoided; Top 3 has no single author and the page says so rather than inventing an origin. The large fee usually attached to the Ivy Lee story is deliberately not repeated, because we have not verified it.

Two sets of gates, both proven rather than asserted. build_content.js fails the build on a broken internal link, a duplicate intent, a missing front-matter field or an orphan page — verified by pointing a link at a slug that does not exist and watching the build stop. check_content.js runs inside test:qc and gates the prose against VISION §11.3, FRAMEWORKS §6.3 and FOUNDATIONS §5. On its first run it failed four violations in content I had just written: 'treats' three times, which is clinical vocabulary, and one 'a day you failed'. I fixed the prose, not the gate. That is the whole argument for gating mechanically.

Still open: Wave 1 is three pages of roughly twelve — the comparison pages people actually search for are not written. Wave 2 has not started. And brief still reports decideone.app is NOT this build, so none of this is live yet.

---

### 2026-09-12 15:54 — Claude Opus 5 — HANDOFF

**In flight:** Organic Growth Pod is established and Wave 0 is complete; Wave 1 is 3 pages of roughly 12 and Wave 2 has not started.

DO FIRST: npm run brief still reports decideone.app is NOT this build. Every SEO fix in the last four commits is inert until a deploy lands. Content shipped before that is invisible work. This is O1 in SEO_AUDIT.md and it blocks Wave 1's exit gate.

NEXT: SEO_AUDIT.md §6 is the open list, each item with an owner. The highest-value remaining content work is the comparison pages (O4) - 'ivy lee vs top 3', 'how to prioritise when everything is urgent' - because those are the queries with real volume that the three method pages do not answer.

ALSO UNFINISHED, and unrelated: a backend forensic audit was in progress when the session pivoted to SEO. Nothing was written - the edit was rejected and the tree stayed clean - but six defects were confirmed by probe and are all still live in server/ and src/utils/telemetry.js. Recorded here because the evidence cost something to produce and would otherwise be lost:

(1) getCircadianMetrics buckets by getUTCHours, which worker/schema.sql's own comment names as a known defect; the D1 schema gained a local_hour column to fix it and the reader was never changed. The dual-visit rate reads 0% on seeded data that contains a deliberate morning/evening pair for 45% of user-days. Test 6 prints that 0% and passes, because it only asserts typeof === 'number'.
(2) The seeder compounds it: baseDayTimestamp is now minus whole days, not midnight, so morning (+8h) and evening (+20h) land on different calendar dates and can never pair.
(3) The client never sends local_hour on the heartbeat, though worker/index.js reads body.local_hour - so sessions.local_hour in D1 is structurally always NULL.
(4) GET /api/v1/analytics/live?limit=abc throws 'datatype mismatch' and the server echoes err.message; ?limit=-1 returns the entire events table unbounded.
(5) Node ingest side effects are not idempotent: a replayed batch dedups events but double-writes user_cohorts, pathfinder_transitions and the rest. Verified 0 to 2 on an exact replay.
(6) sessions.total_events is wrong - the increment runs before the session row exists for session_start.

Also: nothing in the repository applies worker/schema.sql to D1, and DEPLOY.md does not mention it. If telemetry is ever switched on in production, every ingest 500s.

Gates are green as of this note: npm run test:qc and npm run build both pass, tree is clean apart from an untracked screenshot that is not mine.

**Tree:** `main` @ `b5a519e` — 1 file(s) uncommitted

```
?? screenshot_v3_overview.png
```

**Written in the last 30 minutes** (a shared batch write, not separate changes, if the timestamps match):

- `scripts/handoff.js`
- `scripts/brief.js`
- `scripts/check_content.js`
- `scripts/build_content.js`
- `scripts/log_session.js`
- `content/methods/urgent-important-matrix.md`
- `content/methods/ivy-lee-method.md`
- `content/methods/top-3-method.md`

**Gates:** run `npm run build && npm run test:qc` before trusting any of the above.

---

### 2026-09-12 16:10 — Claude Opus 5

Deployed. decideone.app is this build for the first time since the SEO work started, and the canonical defect is gone in production.

npm run deploy ran the whole chain: test:qc and the content gates, build, wrangler deploy, then verify:live. verify reported MATCH on assets/index-D8O6lRno.js, first attempt, no stale-edge retry needed.

Before deploying I checked something the local preview could not answer. I had verified the generated pages against vite preview, which is not what serves them — Cloudflare's ASSETS binding with not_found_handling: single-page-application is, and that setting has silently swallowed requests in this repository before. Ran wrangler dev --local and confirmed the Worker serves dist/methods/<slug>/index.html for the real path rather than falling through to the SPA, that /methods/ resolves to its section index, and that an unknown path still falls back to the app as it should. A path without the trailing slash 307s to the canonical form.

Verified live, not inferred: every page now carries its own self-referencing canonical, which was the finding this whole effort started from. Previously every URL on the site served index.html and its hardcoded homepage canonical, so the site was instructing Google to ignore every page that was not the homepage. sitemap.xml serves 5 URLs where it had 1. robots.txt declares it. Homepage JSON-LD is live with SoftwareApplication, Organization and WebSite - there was no structured data anywhere before today. Each method page serves roughly 1,000 words of prose server-side with no JavaScript, all 200.

This deploy also shipped four product commits from before this session that had never been served - the orphan deletion, the QC rule fixes that were abstaining, the Today stream restoration and the C3 day-condition restoration. The founder was told they were in the payload and authorised the deploy. They passed QC and build; they are not my work and I did not review them.

Also fixed brief.js: it showed the most recent handoff unconditionally, so the banner would have stayed on forever. It now shows one only while it is genuinely open - nothing logged after it. A banner that is always on is a banner people learn to skip.

Open, in priority order: Wave 1 is 3 pages of roughly 12, and the comparison queries carry more volume than the three method pages. Then SEO_AUDIT.md §6 - O2 the service worker under a cold crawl, O3 the SPA views that still have no independent canonical, O5 FAQPage and HowTo schema. The six backend defects in the previous handoff remain unfixed and are deliberately last: telemetry is compiled out, so no production data exists and nobody is reading a wrong number. Fix them before VITE_ENABLE_TELEMETRY is ever set to true.

---

### 2026-09-12 16:18 — Claude Opus 5

Wave 1 content: five guides, taking the site from 3 pages to 8.

Topic selection was grounded rather than guessed. FRAMEWORKS.md already carries the founder's condition-to-method mapping in real user language - too much to do, I keep not finishing things, everything feels urgent - and those three conditions are the spine of the set. One web search on 'how to prioritize tasks when everything feels urgent' confirmed the phrasing is a live query and, more usefully, showed the competition: eight results, all generic listicles, none grounding any claim in anything.

That is the opening. FOUNDATIONS.md is the asset nobody else in this category has - Little's Law, the no-universally-optimal-scheduler result, starvation, priority inversion, the convoy effect, thrashing - together with §5, which says exactly which claims those results do and do not license. Every page uses that material and every page states the limit plainly. 'How many tasks should a day hold?' cites Little's Law and then says outright that it is a theorem about queueing systems, names no number, and is not a finding about human cognition, which is the opposite of what the ranking pages do. That honesty is the GEO position: a model that finds one unsupportable claim on a domain discounts the domain.

Pages: how-to-prioritise-tasks (the hub, head term), everything-feels-urgent, ivy-lee-vs-top-3, why-to-do-lists-stop-working, how-many-tasks-should-a-day-hold. Distinct declared intents, so the duplicate-intent gate is satisfied and they should not cannibalise.

Link architecture is hub and spoke. The hub links to all seven other pages; each guide links back. The three method pages were an isolated triangle linking only to each other, which would have passed none of their strength to the guides - they now carry an inline contextual link to the hub as well as a front-matter one.

The gates caught six violations before anything shipped: five descriptions between 164 and 189 characters, and 'diagnosis' in ivy-lee-vs-top-3, which is clinical vocabulary under VISION §11.3. Fixed the prose. That is now eleven violations the gates have caught in content written by the agent that wrote the gates, which is the argument for mechanical gating rather than review.

Deliberately five rather than nine. SEO_CHARTER F11 names 'the pod optimises for output volume' as a failure mode, and there was no honest ninth page in this batch - 'what to do when you have too much to do' would have cannibalised both the hub and the task-count page. It is a Wave 2 candidate, not a Wave 1 filler.

One decision left for the founder rather than taken silently: all copy is British spelling, matching existing site copy, while US search volume favours 'prioritize'. Changing that is a VISION §11 copy decision and not an agent's to make.

Gates green: test:qc and build pass, 8 pages, 11 sitemap entries. Not deployed.

---

### 2026-09-12 17:20 — Claude Opus 5

Deployed Wave 1: eight content pages live, eleven sitemap URLs. verify:live MATCH first attempt. All eight canonical URLs 200, self-referencing canonical, Article+BreadcrumbList JSON-LD, 970-1129 server-rendered words each. No-trailing-slash 307s to canonical form (confirmed three times each; the first probe ran seconds after upload and caught a cold edge serving the SPA fallback -- that resolved on its own and is the stale-edge case AGENTS.md warns against diagnosing).

---

### 2026-09-12 17:24 — Claude Opus 5

Wave 1 complete at 12 pages. Four new guides drawn from FOUNDATIONS.md -- Little's Law (Little 1961), starvation and aging plus priority inversion (Mars Pathfinder 1997), context-switch cost and thrashing, and no-universally-optimal-scheduler (Liu & Layland 1973) with NP-hardness as the defence of heuristics. These are the pages no competitor in this category writes, and they are the GEO differentiator: a model asked for the theoretical basis of WIP limits should find a named theorem here rather than an opinion. Every page carries FOUNDATIONS §5 explicitly -- what the result does not license -- because the analogy to people is well-founded but is not a proof. Content gates and QC passed first attempt on all four.

---

### 2026-09-12 17:26 — Claude Opus 5

Deployed Wave 1 complete. All 15 sitemap URLs verified live: 200, self-referencing canonical, 975-1261 server-rendered words on every content page. verify:live MATCH first attempt. Wave 1 is now closed at 12 pages; the entry gate to Wave 2 is evidence, and no evidence exists yet because the property is not verified in Google Search Console. That is a founder action, not an agent one -- until it happens there is no measurement, and SEO_CHARTER F11 (optimising for output volume) is exactly what writing more pages without it would be.

---

### 2026-09-12 17:27 — Claude Opus 5

Recorded wave status in SEO_CHARTER §5. Wave 0 met, Wave 1 built but gate not met, Wave 2 blocked. Confirmed by four checks that decideone.app is not verified in Search Console: no meta tag in source or live HTML, no DNS TXT on the apex, no verification file in public/, no Google tag of any kind. Until a founder verifies the property there is no instrument, so Wave 2 would be F11 -- volume without evidence. What an agent may correctly do meanwhile is bounded to SEO_AUDIT §6 technical items that have defined answers and add no pages.

---

### 2026-09-12 18:00 — Claude Opus 5

Technical SEO/AEO pass plus the FAQ. Researched current practice first: FAQ rich results were deprecated by Google in May 2026 and HowTo support dropped, so FAQPage ships as machine-readable vocabulary for non-Google answer engines rather than for a rich result, and HowTo is deliberately absent. Sitemap now emits lastmod only -- changefreq and priority have been ignored for a decade. Added og:image/twitter:image (pages declared summary_large_image with no image, so every share rendered as a bare link), article:published_time/modified_time, flat root-level pages so the FAQ is at /faq/, FAQPage schema derived FROM the page body so it cannot claim a question the page does not ask, and a generated llms.txt (no search engine reads it; agentic tools do -- documented as such, not as a ranking signal). FOUND AND FIXED A FALSE PUBLISHED CLAIM: 'nothing held back' was live on all 12 content pages while UnifiedMenuModal.jsx locks two paper tones, three ink colours, the weekly PDF, Markdown export and the annual print behind isPatron. Corrected the copy and gated the phrase. Also found check_content.js had a hardcoded directory list, so content/pages/faq.md -- the most claim-dense page on the site -- was ungated; DIRS is now discovered from content/.

---

### 2026-09-12 18:08 — Claude Opus 5

Wave 2 first batch: ten guides, 13 pages to 23. Each answers a distinct question intent with no overlap with the existing thirteen -- too much to do, evening planning, not finishing, estimating, not starting, multitasking, deadlines, hardest-thing-first, interruptions, and whether productivity systems work at all. All grounded in FOUNDATIONS.md named results and all carrying the §5 guardrail about what those results do not license. Link graph is a mesh: the hub links to all, and each new page also takes a contextual inbound from its nearest existing neighbour. Content gates caught four violations in this batch (two unearned-science phrases I had quoted as examples of what NOT to trust, one 160-char description, one 'treating'); fixed the prose rather than the gate. Running total this project: 15 violations caught by gates in content written by the agent that wrote the gates.

---

### 2026-09-12 18:11 — Claude Opus 5

Homepage was invisible to non-JS crawlers. <div id="root"></div> was empty, so the body contained no text and no links -- Google renders JS and reached the landing page eventually, but GPTBot, ClaudeBot and PerplexityBot largely do not, which meant the one URL defining what this product IS was blank to exactly the systems the GEO work targets. It also passed no link equity to any content page, having no links at all. Put the VISION §11.1 canonical statement plus seven internal links inside #root; React's createRoot clears them on first render, so this is shell content served to everyone rather than hidden text. 194 crawlable words and 7 links where there were zero of both. Verified in a browser: app mounts over it, both views render, zero console errors. Also corrected index.html's meta description, which carried the same 'nothing held back' claim as the content pages.

---

### 2026-09-12 18:13 — Claude Opus 5

Recorded in SEO_CHARTER that Wave 2 was started by founder instruction rather than on its evidence gate, and what that does and does not change. The risk is not a false claim (everything is gated the same) but writing the wrong ten posts and not finding out, which stays open until Search Console exists.

---

### 2026-09-12 18:54 — Claude Opus 5

O8 resolved by removing the locks. All six gated things are free: two paper tones, three ink colours, weekly PDF, Markdown export, annual print. 31 lines deleted from UnifiedMenuModal.jsx. Rule 18 did NOT need amending -- my earlier claim that it would was wrong; it asserts files and exported functions exist, not that anything is gated, so it passed untouched. Verified in a browser: no padlocks, and clicking Washi applies it (read the selected state from the DOM rather than trusting a screenshot), zero console errors. Replaced the blunt 'nothing held back' word ban with a cross-check that fails only when a page claims completeness AND src/ still gates on !isPatron -- the comparison whose absence let Rule 18 and Rule 24 both pass while contradicting each other. Proved it fires in both directions. Left open: PatronUpgradeModal still exists and the menu still offers Become a Patron, which now grants nothing; not a lock and not a false claim, but VISION §11.1 puts the support ask at the end of a closed day rather than in a menu.

---

### 2026-09-12 19:01 — Claude Opus 5

Diagrams on 22 of 23 pages. Eight original inline SVGs in scripts/diagrams.js, referenced from markdown as {{diagram:name}}; an unknown name fails the build rather than publishing a literal placeholder (proved). Inline SVG rather than image files: original rather than stock, no extra request and no layout shift, inherits page colour through currentColor so dark mode needs no second asset, and carries a real <title> plus role=img so a screen reader and a crawler get the same sentence a sighted reader gets. Placed after the short answer so the direct answer still leads the page. Verified by rasterising each SVG with sharp and looking at it -- which caught a genuine error: the urgent/important matrix axis read URGENT -> (increasing rightward) while the quadrants used the classic layout where urgency decreases rightward, so the labels contradicted the contents on the page that teaches the concept. Replaced arrows with explicit MORE/LESS labels. Also caught clipped rotated text and five viewBoxes whose last line sat within 6px of the floor. Mobile: figures scroll inside themselves with a 560px minimum so labels stay ~10px rather than shrinking to 6px; page itself never scrolls horizontally.

---

### 2026-09-12 19:04 — Claude Opus 5 — HANDOFF

**In flight:** Session complete, nothing in flight. Live and verified: 23 pages / 26 URLs, all 200 with self-referencing canonicals, 22 carrying diagrams, FAQ at /faq/ with 19 derived Q&A pairs, llms.txt, homepage now serving 194 crawlable words and 7 links without JavaScript. Patron locks removed so VISION §11.1 is true as written. NEXT AGENT: the one blocking item is O9 -- decideone.app is not verified in Google Search Console, so nothing published can be measured and Wave 1's exit gate cannot be assessed. That needs the founder's Google account; the code side is a one-line meta tag. Second: the six backend defects in SEO_AUDIT/DECISION_LOG must be fixed before VITE_ENABLE_TELEMETRY is ever set true. Third, minor: PatronUpgradeModal still exists and the menu still offers Become a Patron, which now grants nothing -- not a lock and not a false claim, but VISION §11.1 puts the support ask at the end of a closed day rather than in a menu.

**Tree:** `main` @ `816d36c` — 1 file(s) uncommitted

```
?? screenshot_v3_overview.png
```

**Written in the last 30 minutes** (a shared batch write, not separate changes, if the timestamps match):

- `src/components/UnifiedMenuModal.jsx`
- `scripts/check_content.js`
- `scripts/build_content.js`
- `scripts/diagrams.js`
- `content/methods/urgent-important-matrix.md`
- `content/methods/ivy-lee-method.md`
- `content/methods/top-3-method.md`
- `content/guides/what-to-do-when-you-cannot-start.md`
- `content/guides/ivy-lee-vs-top-3.md`
- `content/guides/why-to-do-lists-stop-working.md`

**Gates:** run `npm run build && npm run test:qc` before trusting any of the above.

---

### 2026-09-12 19:45 — Claude Opus 5

O9 closed: decideone.app verified in Google Search Console as a Domain property via Cloudflare's domain-name-provider integration. Owner maulik.payment@gmail.com, chosen deliberately by the founder. TXT google-site-verification=f3Cw_TF3C-LEZLF_9vCAMBloZn-wE1KEue1bjfwqvZQ confirmed against the authoritative nameserver -- a public resolver returned nothing for several minutes while the authoritative one already had it, which is the same stale-cache trap AGENTS.md documents for the apex HTML and is now written down for DNS too. Googlebot fetches sitemap.xml and robots.txt at 200. Measurement has started; there is no data yet and will not be for weeks. Wave 1's exit gate is now assessable in principle rather than blocked in principle.

---

### 2026-09-12 19:46 — Claude Opus 5

Sitemap submitted and read the same day: status Success, 26 discovered pages -- every URL the generator emits, so discovery is complete and nothing is lost at the crawl stage. Recorded as the baseline in SEO_AUDIT O9. Indexed count is 0, which is correct for day zero and is not a finding. The next meaningful reading is Indexing > Pages in roughly a week (how many of the 26 are indexed, not discovered) and Performance in two to three weeks (which queries, which is what tells us whether the ten Wave 2 posts were the right ten).

---

### 2026-09-12 19:49 — Claude Opus 5

Search Console setup finished end to end: property verified, sitemap submitted and read (26 discovered), and indexing requested for the four priority URLs (home, the prioritisation hub, top-3-method, faq). Nothing further to do on measurement until data arrives -- roughly a week for Indexing > Pages, two to three weeks for Performance queries. The SEO workstream is now waiting on evidence rather than on work. Largest remaining risk in the project is elsewhere: the six backend defects, which must be fixed before VITE_ENABLE_TELEMETRY is ever set true, because every one of them corrupts a number a human would later read and believe.

---

### 2026-09-12 19:51 — Claude Opus 5

Bing Webmaster Tools live, imported from Search Console with no second verification. Both measurement surfaces are now in place: Google Search Console for Google, Bing for the index ChatGPT search and Copilot draw on -- which is the one that matters for the GEO half of this work. Measurement setup is complete end to end; the SEO workstream is now waiting on evidence rather than on effort, and the next real reading is roughly a week away.

---

### 2026-09-12 21:00 — Claude Opus 5

Backend pass, part 1. Re-verified every defect from the pre-pivot notes rather than trusting them, and TWO WERE WRONG: (a) 'nothing applies worker/schema.sql to D1, every ingest would 500' is false -- the tables exist in production and PRAGMA table_info matches schema.sql column for column; (b) 'ingest is not idempotent' is false for production -- the Worker uses INSERT OR IGNORE on a UNIQUE event_id. Those two applied to the Node dev service, not the Worker. Production D1 holds 0 events and 0 sessions, consistent with telemetry being compiled out, so nothing live is corrupted. Fixed: heartbeat now sends local_hour (sessions.local_hour was structurally NULL because acquisitionContext only reached event properties, never the heartbeat body); total_events removed from schema.sql and from live D1 (nothing wrote it, it would have read 0 forever, and it is derivable as COUNT(*) FROM events WHERE session_id = ? -- a stored counter only adds a way to be wrong on replay); server limit param clamped to 1..500 with a NaN fallback, proven against 2531 real rows where ?limit=-1 previously returned all of them; server no longer echoes err.message, matching the rule worker/index.js already wrote down. Mitigating fact found: every analytics endpoint is behind owner auth, so the limit defect was owner-only -- robustness, not a security hole.

---

### 2026-09-12 21:04 — Claude Opus 5

Backend part 2: the circadian chain, end to end. The 0% dual-visit rate had TWO root causes and demonstrating them was the only way to see it. (1) The seeder's baseDayTimestamp carried the current time of day rather than midnight, so seeded at 15:30 UTC the '08:00' session landed at 23:30 (bucketed evening) and the '20:00' one at 11:30 the NEXT day (bucketed morning) -- inverted AND on different calendar dates, so the pair could never match. (2) getCircadianMetrics bucketed by getUTCHours and grouped user-days by the UTC date, which splits an Asian evening session onto the following day. Fixed both: seeder anchored to UTC midnight, and seeded users now have real timezone offsets so the data can actually exercise the bug -- a population entirely inside UTC is the one population for which getUTCHours is correct, which is why the old seed could never have exposed it. Added local_hour to the dev sessions schema with an idempotent ALTER migration (CREATE TABLE IF NOT EXISTS does nothing to an existing table, so a developer's old database would have kept the old shape silently). getCircadianMetrics now prefers local_hour, falls back to UTC, reconstructs the person's own calendar day from the hour/UTC gap, and reports sessions_with_local_hour so a reader can tell whether the number is real. Result: 0% became 44.2% against a seeder that builds the loop for 45%. Test 6 asserted only typeof === 'number', which 0 satisfies, so it printed the wrong number and passed every run; it now asserts the seeded relationship and was proven to catch the original defect (13.8%, outside the band).

---

### 2026-09-12 21:06 — Claude Opus 5

Backend part 3: the structural finding. Production writes telemetry to Cloudflare D1 and NOTHING read D1 -- analyticsService.js (712 lines) reads server/data/telemetry.sqlite, which production never touches. Switching telemetry on would have produced write-only data while the dashboard kept showing seeded development rows that look exactly like real ones. Added npm run metrics: reads D1 directly, deliberately small (counts and distributions, no derived metrics -- computing the circadian rate in two places would create two versions of one number and the one that drifts is always the one nobody watches). Supports --local so the populated branch could be exercised without writing to production; an unrun code path first runs the day telemetry is switched on, which is the worst moment to find a typo. Verified both branches: empty against real production (correct, with an explanation), populated against a local D1. Recorded in WORK_REMAINING the three things that must be settled before VITE_ENABLE_TELEMETRY is ever true -- what happens to the Node analytics service, the divergence between the two schemas, and total_events in the dev schema.

---

### 2026-09-12 21:07 — Claude Opus 5

Deployed the backend pass. verify:live MATCH first attempt; new bundle index-DQYYzr56. Re-checked the site after the bundle change: home, faq, a method page, a guide, sitemap.xml and llms.txt all 200, and the homepage still serves 194 crawlable words and 7 links without JavaScript.

---

### 2026-09-12 22:01 — Claude Opus 5

Performance: public/renders went from 8.7 MB to 308 KB, a 96.5% cut. Five of the eight renders were referenced by nothing at all (5.2 MB uploaded on every deploy for no reason) and are deleted. The three that are used are now WebP at quality 82 -- 1500 KB became 53 KB and a side-by-side at full size is visually indistinguishable, checked before shipping rather than assumed. Each has a 768w variant and srcset so a phone fetches 17 KB instead of 53. The worst offender was the Suspense fallback in MarketingLandingPage: 1.5 MB loading immediately, above the fold, while the 3D scene downloaded. og:image keeps a real JPEG (74 KB, down from 1.5 MB) because WebP is still a risk with some social unfurlers. Also gave /methods/ and /guides/ the metadata they never had -- they were the only two URLs on the site with no Open Graph, no Twitter card and no structured data, and they are what a crawler reaches from the breadcrumb on every article. They now carry CollectionPage + ItemList + BreadcrumbList, real 143/145-char descriptions shown on the page as well as in the tag, and a CTA.

---

### 2026-09-12 22:10 — Claude Opus 5

Wave 2 batch two: ten more guides, 23 pages to 33, 36 sitemap URLs. New intents: saying no, a task you keep postponing, planning a week, work that depends on others, coming back after time away, choosing between two important things, priorities changing by lunchtime, whether to schedule every hour, conflicting priorities from two people, and a five-minute daily review. Two new diagrams that were worth drawing rather than describing: priority-inversion (the two-line reply visually blocking the quarter's work, with Mars Pathfinder named) and utilisation-vs-wait (the curve that explains why a fully booked day has nowhere to put an overrun). Both checked by rasterising and looking -- which caught a clipped rotated axis label, the same defect class as the matrix diagram earlier. Content gates caught one violation ('treats' in a sentence about how a day handles arrivals); fixed the prose. Running total: 16 violations caught by gates in content written by the agent that wrote the gates.

---

### 2026-09-12 22:15 — Claude Opus 5

Found and fixed a soft 404 affecting every wrong URL on the site. wrangler.jsonc used not_found_handling: single-page-application, so any unmatched path returned index.html with HTTP 200 -- a mistyped URL, a stale inbound link and the images deleted an hour earlier all answered 'this page exists'. Google names soft 404s specifically and counts such URLs as real pages. The comment justifying the setting said a refresh on any path would otherwise 404; that was not true, because the app has no path-based router at all -- it lives at / and reads ?view= from the query string, so no path ever needed rescuing. Switched to 404-page and generated a real dist/404.html that is useful rather than a dead end (links to the instrument, methods, guides and the FAQ) and carries noindex. Tested against wrangler dev --local before deploying, per AGENTS.md: / and /?view=daily still 200, all 33 content pages 200, sitemap.xml and llms.txt 200 with correct content types, webp assets 200 image/webp, and deleted or nonexistent paths now 404.

---

### 2026-09-12 22:19 — Claude Opus 5

Final metadata sweep. index.html's meta description was 191 characters -- Google shows about 158 -- so a third of it was written for nobody on the site's most important URL. Shortened to 155 and, more importantly, ADDED index.html TO THE GATE: check_content.js only ever looked at content/, so the home page was ungated. Same gap that left content/pages/faq.md ungated earlier today. Proved the new gate fires. Also removed quote characters from one description: they survive as &quot; and inflate the rendered attribute by ten characters while buying nothing.

---

### 2026-09-12 22:53 — Claude Opus 5

Wave 2 batch three: twelve more guides, 33 pages to 45, 48 sitemap URLs. New intents: working for yourself, prioritising a backlog, whether a long list is bad, why small tasks pile up, batching, a day full of meetings, deciding what to drop, what a good task looks like, prioritising across a team, a day that goes wrong by ten, prioritising life rather than work, and recurring work. Two pieces of FOUNDATIONS material used for the first time: Amdahl's Law 1967 in the team page (adding people cannot shorten the irreducibly serial fraction) and rate-monotonic scheduling from Liu and Layland 1973 in the recurring-work page, both with the analogy limit stated on the page. Gates caught four 'treat' variants -- it is an unusually hard word to avoid in English and the gate has now caught it six times across the project. Fixed the prose each time. Running total: 20 violations caught by gates in content written by the agent that wrote the gates.

---

### 2026-09-12 01:13 — Claude Opus 5

Sitemap resubmitted to Search Console after the site grew from 26 to 48 URLs. Worth recording why a resubmit was needed rather than assumed to be cosmetic: Google's last read was 12 Sep and every lastmod in the file also reads 12 Sep, because that is genuinely when the pages were written -- so there was no date-based signal that anything had changed, and only a manual resubmit forces the fetch. Verified before submitting that the live file is well formed and crawlable: 48 loc entries, 48 lastmod values, 6 KB, and both Googlebot and bingbot fetch it at 200 with application/xml. No deploy was needed; all 41 guides were already live from the previous batch and verify:live reported MATCH.
