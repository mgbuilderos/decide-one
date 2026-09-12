# PRIMACY • Organic Growth Pod Charter (SEO · AEO · GEO)

> **Document Version**: 1.0.0
> **Established**: September 12, 2026
> **Members**: `seo-technical`, `seo-content`, `seo-answer-engine`, `docs-archivist` (`.claude/agents/`)
> **Stands under**: `VISION.md` (why), `GROWTH_CHARTER.md` (money and public claims), `DECISIONS.md` (what is true now)
> **Audience**: the pod itself, and any agent or person whose work touches a public page, a published sentence, or the record of what changed.

This charter stands to the Organic Growth Pod as `GROWTH_CHARTER.md` stands to the Growth Pod. It fixes the invariants first, so four members working in parallel do not negotiate the same questions four times — and so that a member arriving six months from now inherits the reasoning rather than re-deriving it worse.

**Where this charter and `VISION.md` §11 conflict, §11 wins.** Always. Without exception. If a tactic in here requires copy that §11 forbids, the tactic is wrong, not §11.

---

## 0. Founder's intent

Recorded 12 September 2026, in the founder's own framing, translated into operational terms but not into different goals.

> Build an agentic SEO / GEO / AEO capability inside the tool. First check whether the current website follows the practices the top 1% of specialists actually follow. Then do deep research — understand the category, what people are genuinely struggling with, our frameworks, our vision, why the tool is free — and explore every angle. Write a large body of original blog content, internally linked, with relevant images, covering each framework and why it matters. Do not hallucinate. Do not overpromise. Keep the vision in mind. Fix the site to current best practice. Document everything, so that any model reading the repository knows what is broken and who changed what. Build it to last forever.

### 0.1 What the founder is actually asking for

The stated mechanism is "1000 blogs". The goal underneath it is **organic traffic that becomes usage**. `CLAUDE.md` is explicit that naming a mechanism can accidentally rule out the right answer, and that the goal is the thing to serve. This charter serves the goal.

### 0.2 The volume decision, and who made it

On 12 September 2026 the founder was shown three options — evidence-gated waves, straight to 1000, or framework pages only — and chose **evidence-gated waves**. That decision is recorded here because it is the single constraint most likely to be quietly reversed by an agent optimising for output volume.

**The reasoning, so it is not re-litigated:**

1. **Google's scaled content abuse policy (March 2024)** targets large volumes of content produced primarily to manipulate rankings, *regardless of how it was produced*. The penalty is site-level, not page-level. For a product whose entire acquisition plan is organic, a site-level manual action does not slow the channel down; it ends it, and reversal is slow and uncertain.
2. **There is not 1000 posts of honest material in a three-framework tool.** Past a certain count the only ways to continue are repetition or claims the evidence will not carry. `VISION.md` §11.3 forbids the second, and the founder's own instruction was *do not hallucinate, do not overpromise*. The instruction and the number are in genuine conflict; the instruction wins.
3. **`VISION.md` §12.1a is binding**: *"They don't need to do 1000 things. They need to do 3 things better and complete it."* A brand whose entire argument is restraint does not publish a thousand posts to prove it.

**What this does not mean.** It does not mean the target is small. The pipeline is built to produce at any volume; volume is a dial, not an architecture. Wave 3 opens toward 1000 and beyond **on evidence** — real rankings, real sessions, real day-closures attributable to content. What is forbidden is publishing at scale *before* that evidence exists.

---

## 1. Why the pod exists

Verified state of the site on 12 September 2026, before any of this work:

| Finding | Evidence | Consequence |
| :--- | :--- | :--- |
| Every URL serves identical HTML | `wrangler.jsonc` `not_found_handling: single-page-application`; routing is `?view=` query params, not paths | Google sees one page |
| Every page declares the homepage as its canonical | `index.html` — a hardcoded `<link rel="canonical" href="https://decideone.app/">`, served at every path | The site actively instructs Google to ignore every page that is not the homepage |
| `sitemap.xml` lists one URL | `public/sitemap.xml` | Nothing else is submitted for indexing |
| No structured data anywhere | No `application/ld+json` in `index.html` or `src/` | The largest AEO/GEO gap; answer engines have nothing machine-readable to cite |
| Content-bearing pages are client-rendered | `MethodsPage.jsx`, `MarketingLandingPage.jsx` render inside the SPA | Body text is not in the served HTML |

**The pod's first job is therefore not writing. It is making the site capable of having more than one page.** Content shipped before that is invisible work.

---

## 2. Invariants

These are not preferences. Each closes a specific exposure, and each is enforced by `npm run test:qc` where it can be.

**I1 — `VISION.md` §11 governs every published sentence.** Landing copy, blog posts, meta descriptions, image alt text, FAQ answers, JSON-LD `description` fields. There is no "marketing voice" exemption. If different copy is wanted, §11 changes first, and says why.

**I2 — The three copy rules are absolute** (`VISION.md` §11.3):
- **No clinical vocabulary.** Never *diagnose*, *prescribe*, *treat*, *therapy*. Medical structure is fine; medical language invites regulatory scrutiny.
- **No judgment.** Never *you failed*, *streak lost*, *whether you were honest*. The product observes; it does not scold.
- **No unearned science.** Never *scientifically proven* or *clinically validated* of the selection methods. Write *time-tested*, *methods that have worked for a century*.

**I3 — Exactly one scientific claim is permitted anywhere.** Gollwitzer & Sheeran (2006), d = 0.65, and it applies to **if-then implementation intentions only**. Any post that cites a study other than this one is a violation until `FOUNDATIONS.md` is amended to carry it, with the citation, and the amendment is committed.

**I4 — Exactly three frameworks ship.** Top 3, Ivy Lee (1918), and the Urgent/Important Matrix. QC Rule 11 enforces this in `src/`. Content that describes a fourth as shipping is false. Content may *discuss* methods the product does not ship (MoSCoW, 1-3-5, Pareto, Eat That Frog) as long as it never implies they are in the product.

**I5 — The price is free.** `VISION.md` §11.1: no paid tier, no licence to buy, no feature held back. QC Rule 24 enforces it. Any post implying a cost, a trial, a premium tier or a future paywall is wrong.

**I6 — Nothing a person writes ever leaves their device.** Content may state this because it is true. It may **not** claim "zero telemetry" — the honest claim is that nothing is sent unless the person turns it on, and that journal text never leaves the device either way. `TELEMETRY_SPEC.md` governs; `src/utils/telemetry.js` is the fact.

**I7 — No content page may make the product feel like an accusation.** `VISION.md` §11.3's fourth rule and its test: *could this make someone feel bad on a day they had a bad day?* A post titled "Why you keep failing at your to-do list" fails this test. The same subject titled "When the list is longer than the day" does not.

**I8 — Every published page is a real file with real HTML.** No content page may depend on JavaScript to render its body text, its title, or its canonical URL.

**I9 — Every claim of fact in a post is traceable.** To `VISION.md`, `FOUNDATIONS.md`, `FRAMEWORKS.md`, a named primary source, or the product's own observable behaviour. A sentence that is traceable to none of these does not ship. **The pod does not have opinions about productivity research; it has citations or it has silence.**

**I10 — Ornament is a defect, in content too.** `VISION.md` §13.2. A post exists to answer a question completely and then stop. Padding to hit a word count is the content equivalent of decoration, and it is visible to both readers and search engines.

---

## 3. The three disciplines, defined

These are routinely conflated. They are different work with different artefacts.

### 3.1 SEO — being found by a search engine

Classic organic search. Crawlability, indexation, site architecture, internal link equity, page experience, and matching real query intent.

**Owned by `seo-technical` (the machine) and `seo-content` (the match to intent).**

**What "top 1%" actually means here**, stripped of folklore:
- Crawlable, indexable, unique-per-URL HTML with a correct self-referencing canonical.
- One page per intent. Not one page per keyword — intent, because several keywords share one answer and splitting them cannibalises both.
- Internal links that carry meaning: descriptive anchors, a deliberate hierarchy, no orphan pages.
- Page experience that is genuinely fast, measured at p75 on real devices, not in a lab.
- Content that answers the question the searcher actually had, completely, and is the best available answer for it. Everything else is downstream of this.

### 3.2 AEO — being the answer

Answer Engine Optimisation. Being the source a featured snippet, People Also Ask box, or voice assistant reads aloud.

**Owned by `seo-answer-engine`.**

The mechanics are specific and unglamorous: a direct answer in the first 40–60 words under the heading that asks the question; correct `FAQPage` / `HowTo` / `Article` structured data; tables and ordered lists where the answer is genuinely tabular or sequential; headings phrased as the question a person actually types.

### 3.3 GEO — being cited by a model

Generative Engine Optimisation. Being quoted or cited when someone asks ChatGPT, Claude, Perplexity or an AI Overview about prioritisation.

**Owned by `seo-answer-engine`.**

This is not keyword work. Models cite sources that are **unambiguous, attributable, self-contained and specific**. That means: name the method and its origin ("the Ivy Lee method, 1918"), state facts in complete sentences that survive being extracted without surrounding context, prefer specific numbers to vague ones, and maintain clean entity definitions the model can resolve. It also means the honest-claims discipline in §2 is not merely ethical here — **a model that finds one unsupportable claim on a domain discounts the domain**, and hallucinated citations are the fastest way to be dropped from consideration entirely.

**The single highest-leverage GEO asset this product has is `FOUNDATIONS.md`** — a document that says which method claims are supported, which are merely time-tested, and where the line is. Almost nothing in this category is that honest. Publish that honesty; it is differentiating precisely because it is rare.

---

## 4. Architecture — how content is built and served

**Decided, and not open for re-litigation without a recorded decision:**

Content pages are **pre-rendered static HTML generated at build time from Markdown sources**. They are not React routes, not a CMS, and not a framework migration.

**Why.** The product is an SPA because the instrument needs to be. A blog post is a document. Making documents into an application buys nothing and costs crawlability, performance, and a framework migration that would break `wrangler.jsonc`, the Worker, and several QC rules. The laziest correct answer is also the right one: content pages need semantic HTML, the site's CSS, and links.

**The shape:**

```
content/
  posts/*.md            source of truth, with front-matter
  methods/*.md          the framework pages (decision G6)
scripts/
  build_content.js      md -> dist/*.html, generates sitemap.xml + JSON-LD
  check_content.js      the content gates (see §6)
```

**Non-negotiable properties of the generator:**
1. Each post becomes a real path — `/journal/<slug>/` — not a query parameter.
2. Each page carries its **own** `<title>`, meta description, and **self-referencing canonical**. The current hardcoded homepage canonical is a defect and is fixed as part of this work.
3. Each page carries appropriate JSON-LD, emitted from front-matter, never hand-written per page.
4. `sitemap.xml` is generated from the same source of truth. A sitemap maintained by hand is a sitemap that is wrong.
5. Internal links are resolved and **validated** at build time. A link to a slug that does not exist fails the build.
6. Images are self-hosted. `public/_headers` sets `default-src 'self'` and `img-src 'self' data: blob:`; there is no external image CDN and there will not be one, because the CSP that protects the journal page protects every page.

---

## 5. The waves

Each wave has an entry gate. **A wave does not begin because the previous one finished; it begins because the previous one produced evidence.**

### Wave 0 — Make the site capable (no content ships)
The technical work in §1's table. Real paths, correct canonicals, structured data, a generated sitemap, the content pipeline, and the QC rules that gate content. **Exit gate:** a test page at a real path is served with its own title, own canonical, and valid structured data; `npm run test:qc` passes.

### Wave 1 — The framework pages (~12 pages)
Decision **G6**, already taken: one page per shipped method, plus the comparisons people actually search ("Ivy Lee vs Top 3", "how to use the Eisenhower matrix"). These are the highest-value pages the site can have, and each is genuinely original because each contains the working instrument rather than a description of it.
**Exit gate:** indexed, and at least one page ranking for a non-branded query.

### Wave 2 — The honest question space (~60–100 posts)
One post per real question a person asks when they have eleven things and no obvious first one. Each maps to a verified search intent and an answer traceable under I9. Published in batches, not at once.
**Exit gate:** measured. Which posts rank, which bring sessions, which bring a *closed day*. A post that brings traffic that never opens the instrument has failed and its pattern is not repeated.

### Wave 3 — Scale, on evidence only
Expands the patterns Wave 2 proved. Opens toward 1000 **only** where genuine material exists. Every batch still passes every gate. **No batch ships to hit a number.**

### Wave status — 12 September 2026

| Wave | Built | Exit gate | Met? |
| :--- | :--- | :--- | :--- |
| **0** | yes | a real path serves its own title, own canonical, valid structured data; `test:qc` passes | **met** — verified live |
| **1** | yes, 13 pages | indexed, **and** at least one page ranking for a non-branded query | **not met** |
| **2** | started, 10 of ~60–100 | measured: which posts rank, which bring sessions, which bring a closed day | not assessable yet |

**Wave 1 is built and deployed. Its gate is not met, and cannot be assessed
today.** Nothing published has been indexed long enough to rank, and more
immediately: **`decideone.app` is not verified in Google Search Console**, so
there is no instrument that could tell us. Indexation, impressions, queries and
the ranking half of the gate are all unmeasurable until that exists.

**Resolved 12 September 2026.** `decideone.app` is now verified as a **Domain**
property — the whole domain, every subdomain, http and https — through
Cloudflare's domain-name-provider integration. Owner is
`maulik.payment@gmail.com`, chosen deliberately. The TXT record is confirmed on
the authoritative nameserver, and Googlebot fetches both `sitemap.xml` and
`robots.txt` with a 200.

*A note for whoever checks this next:* a public resolver returned nothing for
several minutes after verification while the authoritative nameserver already
had the record. Query `@jermaine.ns.cloudflare.com` before concluding the record
is missing — the same stale-cache trap as the apex HTML in `CLAUDE.md`.

**Measurement has therefore started, but there is no data yet.** Indexation
takes days, query data two to three weeks, and a non-branded ranking — Wave 1's
actual exit gate — two to three months on a domain this new. Nothing here is
assessable before then, and an absence of data in week one is not a finding.

This is a founder action — it needs access to the domain's DNS or the live
site, and it is the single thing standing between this project and evidence.
Until it is done, writing Wave 2 would be producing sixty more pages with no
way to know whether the first twelve worked, which is **F11** stated exactly.

**Wave 2 was started anyway, on 12 September, by founder instruction** — the
gate was put to them explicitly and they directed the content be written. That
is a decision they are entitled to make and it is recorded here rather than
quietly absorbed, because the charter's whole purpose is that a later reader can
tell an exception from a drift.

**What this changes:** the first ten Wave 2 posts exist without the evidence
Wave 2 was supposed to be built on. They are gated for truthfulness the same as
everything else, so the risk is not a bad claim — it is writing the *wrong ten*,
and not finding out. That risk stays open until O9 is closed.

**What it does not change:** F11 still holds. Nothing ships to hit a number, and
Wave 3's scale-toward-1000 remains gated on evidence that does not yet exist.

---

## 6. The gates

Ungated content drifts. This is not a hypothesis — QC Rule 25 exists because six dashboard metrics were permanently zero and nobody could tell. The same failure in content is a claim nobody agreed to, published under the product's name.

`scripts/check_content.js`, wired into `npm run test:qc`, fails the build on:

| Gate | Fails when |
| :--- | :--- |
| **Forbidden vocabulary** | A post contains clinical language, judgment language, or an unearned-science phrase (I2) |
| **Unauthorised citation** | A post cites a study other than Gollwitzer & Sheeran (2006) without a matching entry in `FOUNDATIONS.md` (I3) |
| **Framework roster** | A post states or implies that a method outside the shipped three is in the product (I4) |
| **Price** | A post implies a cost, trial, premium tier, or future paywall (I5) |
| **Telemetry claim** | A post claims "zero telemetry" or equivalent (I6) |
| **Broken internal link** | A post links to a slug that does not exist (§4.5) |
| **Missing front-matter** | Title, description, canonical slug, primary intent, or sources are absent |
| **Orphan page** | A published page is linked from nothing |
| **Duplicate intent** | Two posts declare the same primary intent — they will cannibalise each other |

**A gate that can be checked mechanically is checked mechanically.** Asking another agent to review is slower and less reliable. This is the same reasoning `CLAUDE.md` gives for the QC audit being the contract between agents.

---

## 7. Who owns which decision

Modelled on the Growth Pod, where each member owns a decision domain rather than a task list. Two agents that can both decide a thing will eventually decide it differently.

| Agent | Owns | May not |
| :--- | :--- | :--- |
| **`seo-technical`** | Crawlability, indexation, canonicals, the content build pipeline, sitemaps, performance, `public/_headers`, `wrangler.jsonc` routing | Write or alter published prose |
| **`seo-content`** | Research, keyword-to-intent mapping, briefs, drafts, internal link structure, images | Make a claim of fact not traceable under I9; change `VISION.md` §11 |
| **`seo-answer-engine`** | Structured data, answer formatting, entity clarity, citability, everything AEO and GEO | Add a schema type that asserts something the page does not actually contain |
| **`docs-archivist`** | `DECISION_LOG.md` hygiene, attribution, handoff notes, the broken-state record | Change code or content — it records, it does not edit |

**Escalation.** Where a pod decision touches money, pricing, or a public claim of fact, `growth-revenue-ops` has the final word — that is already `GROWTH_CHARTER.md`'s rule and this pod does not get an exception. Where it touches `VISION.md` §11, the founder decides.

---

## 8. The record

The founder's requirement: *a documentation and log team that keeps track of what every agent is doing and who is changing what, so that if any LLM reads anything it knows what is broken — plus a handoff note every time.*

**Most of this already exists and is extended rather than rebuilt** — `DECISION_LOG.md`, `npm run log`, `npm run brief`, `npm run tree`, `scripts/qc_audit.js`. Building a parallel logging system would create a second source of truth, and the second source of truth is the one that goes stale.

**What was actually broken, and is fixed as part of this work:**

1. **Attribution.** `scripts/log_session.js` reads an `AGENT` environment variable that nothing sets, so the last four entries in `DECISION_LOG.md` all read *unattributed*. A log that cannot say who did something answers half the question it exists to answer.
2. **No handoff convention.** `CLAUDE.md` documents in detail what happens when an agent is cut off mid-task — it has happened repeatedly — but there is no command that writes the note. `npm run handoff` adds one.
3. **No standing record of what is currently broken.** `npm run brief` reports state; nothing reports *known defects that are not yet fixed*. An agent arriving mid-repair re-diagnoses from scratch, which is how a delete-and-rewrite got misread as a deletion twice in one day.

**The standing rules:**
- Every session ends with `npm run log "…"`, attributed, committed alongside the work it describes.
- Every session that stops mid-task ends with `npm run handoff "…"` — what was in flight, what state it is in, what the next agent should do first.
- Every known-broken thing is recorded where the next reader will look, with enough detail to act on and the evidence that proved it.
- **Never `git add -A`.** Stage the files you touched, by name. This rule is in `CLAUDE.md` because breaking it has caused four separate incidents.

---

## 9. The failure register

*What could go wrong, ranked by what it would cost.* Reviewed whenever a wave gate opens.

| # | Failure | Severity | Early signal | Control |
| :--- | :--- | :--- | :--- | :--- |
| **F1** | Site-level Google penalty for scaled content abuse | **Fatal** — ends the only acquisition channel, homepage included | Sudden broad ranking loss; Search Console manual action | Evidence-gated waves (§5); no batch ships to hit a number |
| **F2** | An unsupportable claim is published | **Severe** — credibility, and GEO discounts the whole domain | A post cites a study not in `FOUNDATIONS.md` | I3 + the citation gate (§6) |
| **F3** | Copy drifts from `VISION.md` §11 | **Severe** — the brand argument stops being coherent | Judgment or clinical language appears in a draft | I1, I2 + the vocabulary gate |
| **F4** | Content outlives the product it describes | High — posts describe methods that no longer ship | QC Rule 11 changes and no content changes with it | Framework-roster gate reads the same source as Rule 11 |
| **F5** | Internal link rot at scale | High — hundreds of 404s from one renamed slug | Build-time link validation fails | Links resolved and validated at build; broken link fails the build |
| **F6** | Traffic that never becomes usage | High — the stated goal was traffic *and* usage | Sessions rise, day-closures do not | Wave 2's exit gate measures closures, not sessions |
| **F7** | Keyword cannibalisation | Moderate — posts compete with each other and the homepage | Two posts ranking and swapping for one query | Duplicate-intent gate; one page per intent, not per keyword |
| **F8** | Deploy bloat | Moderate — thousands of assets on every deploy | Build time and upload size climbing | Images budgeted per post; generated output measured each wave |
| **F9** | Two agents in one tree | Moderate — the project's most frequent historical failure | `npm run tree` shows a recent write | `npm run tree` before any write; worktrees when genuinely parallel |
| **F10** | Content shipped to an undeployed build | Moderate — invisible work | `npm run brief` says the live site is not this build | **Live today.** `main` has commits `decideone.app` has never served |
| **F11** | The pod optimises for output volume | Moderate — the exact pressure that causes F1 and F2 | Posts getting shorter, thinner, more similar | §0.2 recorded here; the archivist flags it |

**F10 is not hypothetical and is not a future risk.** `npm run brief` reports `decideone.app is NOT this build` as of 12 September 2026. Publishing content into a repository that is not being served produces nothing. This is resolved before Wave 1 ships.

---

## 10. Definition of done

A page — any page, framework or post — is done when **all** of the following are true. Not most.

1. It is served as real HTML at a real path, with its own title, its own description, and a **self-referencing** canonical.
2. Its body text is present in the served HTML without JavaScript.
3. It carries valid structured data that asserts only what the page actually contains.
4. Every claim of fact in it is traceable under I9.
5. It passes every gate in §6.
6. It answers, in the first 60 words under the heading, the question the heading asks.
7. It links to at least two other pages on the site with descriptive anchors, and at least one other page links to it.
8. Its images are self-hosted, sized, given real alt text, and lazy-loaded below the fold.
9. It would survive a reader who is having a bad day (I7).
10. It is in the sitemap, because the sitemap is generated from it.

**And the standing test, inherited from `VISION.md` §13.2:** the instrument is trusted because it is right, not because it is pleasant. A page that ranks and is wrong is worse than no page, for the same reason a compass two degrees off is worse than no compass. It is believed.
