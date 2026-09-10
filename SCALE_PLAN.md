# PRIMACY • The Path to 1,000,000 Users

> Written September 9, 2026, at the founder's request. Bound by `GROWTH_CHARTER.md`.
> Read `MONETIZATION_PLAN.md` §6A first — the reach levers there are the tactical layer under this strategy.

---

## 1. The honest arithmetic, before anything else

**1,000,000 users is Obsidian-scale.** Obsidian reached ~1.5M monthly actives after roughly six years, with a plugin ecosystem, a large public community, and a general-purpose product that serves students, researchers, engineers and writers alike. It is the best comparable available and it is a *bigger* category than this one.

So the number is achievable. It is not achievable quickly, and it is not achievable at the current positioning. Here is why.

### 1.1 The executive positioning caps you below 1M

Work the funnel backwards from "executives and founders who want to get more done":

| | |
| :--- | :--- |
| Global population plausibly self-identifying as founder/executive/senior leader | ~50–100M |
| Share who would ever try a productivity journaling tool | ~5–10% |
| Reachable pool | **2.5–10M** |
| Share who survive to day 30 (category median is 4–7%) | ~5–10% |
| **Ceiling of committed users at total market saturation** | **~250K–500K** |

At *perfect* penetration of the stated audience, the current positioning tops out at roughly half the goal. **1M actives is above the ceiling of "for executives and founders."** This is not a marketing problem that better copy solves; it is an addressable-market problem.

### 1.2 Three honest ways to close the gap

**A. Widen the audience — and change nothing about the product.**
The target becomes *anyone who has to decide what matters today*: knowledge workers, freelancers, students, researchers, parents running a household. The product does not change by one pixel. Only the copy changes. This is by far the cheapest lever available and it is the only one that gets to 1M on its own.

The cost is real: "for executives" is a *positioning* asset that justifies $39 and creates the premium feel. Widening dilutes it. The resolution most premium tools use is to **speak to the executive and sell to everyone** — keep the register serious and the imagery executive, but never say a word that excludes a student. Things, Linear and Superhuman all do exactly this.

**B. Redefine the metric.** 1M *downloads or triers* is a different and much nearer target than 1M day-30 actives. Decide which one is meant, because the strategies diverge sharply. This document assumes actives; say so if it does not.

**C. Count across a portfolio.** The founder's stated intent includes building more tools. 1M users across four tools is a far easier problem than 1M in one, and it is the path most solo builders actually take. It also fits the funding model — each tool funds the next.

**Recommendation: A now, C as the long game.** B only if the founder decides the goal was always about reach rather than retention.

---

## 2. The binding constraint: this product has no viral loop

Every consumer product that reached a million users has a loop — something a user does, in the normal course of use, that exposes the product to a non-user. Private journals structurally do not have one. Nobody shares their diary.

This is the single most important fact about scaling Primacy, and no amount of channel work substitutes for it. The honest inventory of loops that are available **without violating the privacy promise**:

| Loop | Status | Assessment |
| :--- | :--- | :--- |
| **The Victory Card** | **Already built** — `DailyVictoryCardModal.jsx` | Shares a *score and a streak*, never content. This is the single most underused asset in the codebase. It is the only true viral surface the product has, and it is currently a modal almost nobody reaches. Make it beautiful enough that people want to post it, and make reaching it the natural end of a good day. |
| **Gift a pass** | **Already built** — `GiftAccessModal.jsx` | A Patron giving a colleague a free pass is a warm, high-intent introduction. Currently buried. |
| **The printed annual** | Roadmap only | A physical object that sits on a desk and gets asked about. Slow, expensive, and the highest-quality introduction available. |
| **Method sharing** | Not built | People will not share entries but they enthusiastically share *systems*. "How I plan my day" content is an entire genre. Give them something to share that is not their data — a setup, a method, a printable. |

**Everything else in this document is a channel. Only these are loops.** Channels cost effort every time; loops compound. Build the Victory Card properly before spending a day on any channel below.

---

## 3. The channels, ranked by leverage for a founder who will not buy ads

### 3.1 Framework SEO — the biggest free channel, currently unused

The six shipped methods have durable, high-intent search volume that will exist in ten years: *Eisenhower matrix*, *Ivy Lee method*, *1-3-5 rule*, *Pareto principle productivity*, *MoSCoW prioritisation*. People searching these are looking for exactly what this product does, at the moment they want it.

**The move:** a free, no-signup, genuinely useful interactive tool page for each method — use it right there in the browser, keep your result by installing the app. Six pages. Each one compounds forever, costs nothing to run, and needs no ad budget.

For a founder who wants maximum reach without marketing spend, **this is the highest-leverage thing on the list.** It is also the only channel here that gets *better* while you sleep.

### 3.2 Platform distribution — you cannot reach 1M from a web page

App Store, Play Store and Mac App Store search are the largest free discovery engines in this category. Day One, Bear and Things get the majority of their installs from store search and word of mouth, not from their websites.

A web-only product forfeits this entirely. Note that this converges on the same conclusion as the Jobs exercise in `STRATEGY_AND_NAMING.md` §1.2 — native apps — but for a completely different reason: **not craft, distribution.** When two unrelated lines of argument land on the same action, take the action.

Practical route given the existing React codebase: Capacitor or Tauri wrapping the current app is days of work, not months, and gets you into all three stores with the code you already have. Native rewrites can come later if ever.

### 3.3 India as the beachhead, not the afterthought

The founder is in India, ₹999 is already set, and India has one of the world's fastest-growing founder and senior-professional populations — English-native in exactly this segment, reachable without translation, and under-served by premium productivity tools priced for San Francisco.

Most Indian founders building for a global market treat their home market as an afterthought. That is backwards for a product that needs word of mouth: start where you have context, network, and price advantage, then expand.

### 3.4 Localisation

A million users is not a million English speakers. Once the product is stable, the interface is small — a few hundred strings — and each language opens a market that costs nothing further to serve. Sequence after product-market fit, never before.

### 3.5 The local-first and privacy communities

Highest-fit cold audience, already covered in `growth-acquisition.md`. Excellent for the first ten thousand. **Cannot reach a million** — these communities are tens of thousands of people, not millions. Use them to launch, not to scale.

---

## 4. Sequencing

| Phase | Target | The work | Honest duration |
| :--- | :--- | :--- | :--- |
| **0** | **1 real user** | git, real checkout, signed licences, consent fix, terms. Ship it. | Weeks |
| **1** | 0 → 10K | HN, Product Hunt, local-first communities. Learn what retention actually is. | 3–6 months |
| **2** | 10K → 100K | Native apps in three stores. Six framework SEO pages. Victory Card loop turned on properly. India-first push. | 12–18 months |
| **3** | 100K → 1M | Localisation, the printed annual, the second and third products. | 2–4 years |

**Total honest horizon: four to six years.** Anyone promising faster for a private journaling tool with no viral loop is selling something.

---

## 5. The thing that matters more than this entire document

**Primacy has zero users. It has never shipped. Its checkout is a 1.5-second timer and the repository has no version control.**

Every phase above is worth nothing until Phase 0 is done. A plan to reach a million users, written for a product that has not yet reached one, is the most seductive form of procrastination available to a founder — it feels like progress and it produces nothing.

The single most valuable thing that could happen to this product this month is **one stranger using it and saying what they think.** Everything in this document is downstream of that.
