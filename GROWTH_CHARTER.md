# PRIMACY • Growth Pod Charter

> **Document Version**: 1.0.0
> **Established**: September 9, 2026
> **Members**: `growth-strategy`, `growth-acquisition`, `growth-lifecycle`, `growth-revenue-ops` (`.claude/agents/`)
> **Audience**: The growth pod itself, and any engineer or autonomous agent whose work touches money, measurement, or public claims.

This charter stands to the Growth Pod as `PROJECT_BLUEPRINT.md` stands to the engineering work: it fixes the invariants first, so four members working in parallel do not have to negotiate the same questions four times.

---

## 0. Founder's intent

Recorded September 9, 2026, in the founder's own framing. Everything below serves this; where a tactic and this section conflict, this section wins.

> Build a tool that is simple, minimal, aesthetic, and grounded in real thinking about how people work — one that genuinely helps executives and founders get more done. Get it to the maximum number of people, because value not reached is value not delivered. Take a fair portion of the value created — enough to fund the work, keep the app updated, and build more tools that help people — without being greedy. **Charging less must never mean the tool is substandard.**

Three operating consequences:

1. **Reach is a goal, not a byproduct.** A decision that earns more money from fewer people is not automatically the right one. Ask what it costs in reach before taking it.
2. **The revenue target is sufficiency, not maximisation.** Enough to fund development, updates, and the next tool. A tactic that extracts more from a user than the value they received is out of bounds even when it would work.
3. **Quality is signalled by the product, never by the price.** Primacy is not priced high to seem serious. It is priced fairly for something serious, and the product proves the seriousness on its own.

---

## 1. Why the pod exists

Primacy is finished enough to be loved and not finished enough to be sold. The instrument works, passes 21/21 QC gates, and builds clean. It also cannot take a single dollar: checkout is simulated, the license key is a shared constant published in the README, and the landing page has claimed zero telemetry while the telemetry SDK was live.

The pod's job is to close that gap without spending the thing that makes Primacy worth buying — the promise that a person's private writing stays theirs.

---

## 2. Invariants

These bind every member. They are not preferences and no conversion gain overrides them.

1. **A user's own words are never held hostage.** Writing, reading, and full export of one's own journal are free forever, on every surface, for everyone. There is no state of the product — unpaid, expired, lapsed, offline — in which a person cannot get their words out. The moment we can extract payment by withholding someone's diary from them is the moment we have to not.
2. **Every public claim is verified in `src/` before it ships.** Not in the docs — the docs are three product generations deep and the older ones overstate the build. `LANDING_PROTOTYPE.md` is the accurate record. Where copy and code disagree, the code wins and the copy changes.
3. **No dark patterns.** No countdown that resets, no fake scarcity, no confirmshaming, no invented social proof, no cancellation maze. The product's entire pitch is that it treats the user better than a SaaS does; a growth tactic that contradicts the pitch destroys more than it earns.
4. **No subscription.** The one-time purchase is market position, not pricing.
5. **The 21 QC gates hold.** Growth work is subject to the same audit as engineering work: `npm run test:qc` passes at 100% and `npm run build` compiles clean before anything ships. Gates 17 and 21 — the trademark bans — extend beyond the codebase to every word published anywhere.
6. **Telemetry is off until consent is honest.** Behavioural data is genuinely useful and the zero-knowledge content filter genuinely works, but neither fact licenses collecting it while the marketing says we do not. Resolve the contradiction in the user's favour first; measure second.

---

## 3. Division of labour

| Member | Owns | Does not touch |
| :--- | :--- | :--- |
| `growth-strategy` | The free/paid line, price ladder, regional pricing, `MONETIZATION_PLAN.md` | Copy, integration code, event taxonomy |
| `growth-acquisition` | Channels, launch sequence, landing copy, demo assets | Claims of fact, pricing, the gate's timing |
| `growth-lifecycle` | Activation, retention, funnel, the gate's timing and tone | What costs money, payment machinery |
| `growth-revenue-ops` | Checkout, licensing, refunds, tax, consent, legal pages | Pricing, positioning, channels |

Boundary rule: **Strategy decides what costs money. Lifecycle decides when the user is asked. Acquisition decides how it is described. Revenue-ops decides whether it may ship at all** — and holds a veto on any claim of fact or any flow that moves money.

---

## 4. Standing decision

The pod operates on **Free = today. Patron = every day you've ever had.** The rationale, the feature split, and the numbers behind it are in `MONETIZATION_PLAN.md`, which `growth-strategy` owns. Read it before proposing an alternative; the two obvious alternatives were considered and rejected there for stated reasons.

---

## 5. Working method

The pod follows the convention already established in this repository: a brief is a document, an invariant is enforced by a gate, and a member is an agent definition in `.claude/agents/`. Members are invoked individually for their own domain and hand off through documents, not through a shared runtime.

Before building anything, check `~/.claude/library` for it. The payment provider interface in `background remover`'s `packages/payments` was consulted for this charter; its discipline transferred and its architecture did not.

---

## 6. Prerequisite

**Nothing in this charter can be executed while the repository has no version control.** `git init` and a first commit precede all monetization work — the alternative is shipping payment and licensing code with no way to revert it.
