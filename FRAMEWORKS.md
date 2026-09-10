# The Framework Field — Deep Dive

> **Formal basis:** `FOUNDATIONS.md` records why these methods are sound — Little's Law behind Rule of 3, the no-universally-optimal-scheduler result behind the diagnostic step, and the failure-mode glossary (starvation, aging, priority inversion, thrashing). Read its §5 honesty guardrails before using any of it in copy.

> September 9, 2026. A survey of every serious prioritisation and execution method, mapped by **the failure mode it treats**, filtered for redundancy, legal safety, and daily usability.
>
> **The organising principle:** frameworks are not variations on "make a list." Each was invented by someone staring at a specific pathology. Two frameworks are redundant when they treat the same disease, however different they look.

---

## 1. The two layers — the structural finding

The field splits into two kinds of method, and **they stack rather than compete**:

| Layer | Question it answers | Failure it treats |
| :--- | :--- | :--- |
| **Selection** | *Which things?* | Choosing the wrong work |
| **Execution** | *When, and for how long?* | Choosing right and still not doing it |

This has been missed throughout the exercise. Rule of 3, Ivy Lee and Eisenhower are all **selection** methods, so they compete and only one can be active. Timeboxing and implementation intentions are **execution** methods — they apply *on top of* whatever selection method is running, and they do not conflict with each other or with anything else.

**A user can be failing at either layer, and the cures are unrelated.** Someone who picks the wrong three things needs a better selection method. Someone who picks the right three and never starts them needs an execution method. Giving the second person Eisenhower is useless.

---

## 2. Selection methods — the full field

### 2.1 In the product (keep)

| Method | Origin | Disease treated | Enforcement |
| :--- | :--- | :--- | :--- |
| **Rule of 3** | Modern, no single author | Overcommitment | Three lines, no fourth |
| **Ivy Lee** | Ivy Lee → Charles Schwab, Bethlehem Steel, 1918 | Context-switching | #2 locked until #1 is done |
| **Eisenhower** | Attributed to a 1954 Eisenhower speech; matrix built by Covey | Urgency mistaken for importance | Classification required before writing |

### 2.2 Assessed and rejected — redundant

| Method | Why it goes |
| :--- | :--- |
| **1-3-5 Rule** | Rule of 3 with size buckets. Same disease (volume), different dosage. |
| **MoSCoW** (Dai Clegg, 1994) | Eisenhower built for team scope negotiation under a deadline. Wrong context for one person's morning. |
| **ABCDE** | Eisenhower with letters. Also carries Tracy trademark exposure. |
| **MITs (Most Important Tasks)** | Rule of 3 under another name. |
| **RICE / ICE** | Impact/Effort with arithmetic. Corporate roadmap tooling; nobody scores their morning on four numeric dimensions. |
| **Action Priority Matrix** | Impact/Effort relabelled (Quick Wins / Major Projects / Fill-ins / Thankless Tasks). |

### 2.3 Assessed and rejected — not daily

| Method | Why it goes |
| :--- | :--- |
| **Impact/Effort Matrix** (value × cost) | **Genuinely distinct from Eisenhower** — value×cost, not urgency×importance, and it treats *working hard on low-payoff things*. But the literature places it at 10–30 items reviewed monthly or less. It is a planning-cycle tool, not a morning tool. **Fails the toothbrush test.** |
| **Theory of Constraints** (Goldratt, 1984) | Distinct and powerful — the bottleneck governs, work elsewhere is illusion. But it requires a system view across weeks, not a day. |
| **Critical Path Method** (1957) | Needs a project with dependencies, not a day with tasks. |
| **Two-Way / One-Way Doors** (Bezos, 1997) | Excellent and genuinely distinct — treats over-deliberating reversible decisions and rushing irreversible ones. But it fires when a real decision arrives, which is episodic, not daily. |
| **Regret Minimisation** (Bezos) | Life-scale. Not a morning question. |
| **Inversion** (Jacobi/Munger), **Second-order thinking** | Thinking tools, not task tools. |
| **Pareto 80/20** (Pareto 1896, Juran) | **A principle, not a method** — it asserts the vital few exist and supplies no procedure for finding them. Belongs in the copy. |

### 2.4 Legally unavailable

Already covered by QC Gates 17 and 21, recorded here so they are not rediscovered:

| Method | Problem |
| :--- | :--- |
| **Pomodoro** | Trademarked (Francesco Cirillo). |
| **Eat That Frog** | Brian Tracy trademark. |
| **Buffett 5/25** | Attribution and trademark exposure. |
| **Getting Things Done / GTD** | Trademarked (David Allen Company). Use "weekly review" generically; never cite GTD. |
| **Bullet Journal / BuJo** | Ryder Carroll trademark. Gate 17. |

**Verdict on selection: nothing new passes the bar. The three stand.**

---

## 3. Execution methods — where the genuine additions are

### 3.1 Timeboxing — *"how long?"*

**Origin:** Parkinson's Law, C. Northcote Parkinson, *The Economist*, 1955 — *"work expands so as to fill the time available for its completion."*

**Disease:** Tasks with no boundary consume the day. The three right things get chosen and the first one eats all of it.

**Distinct from all three selection methods** — it governs duration, not choice. Someone can select perfectly and still lose the day to task one.

**Enforcement:** a duration attached to each line. Not a timer that runs, not a notification — just a stated bound. The commitment is the mechanism.

**Legal:** Parkinson's Law is a published observation from 1955. Public domain as a concept. *(Do not use "Pomodoro" anywhere near this.)*

### 3.2 Implementation intentions — *"when and where?"*

**Origin:** Peter Gollwitzer, 1999. Format: **"If [situation], then I will [action]."**

**Disease:** Planning without starting. The gap between deciding and doing.

**And this one is genuinely evidence-backed**, which nothing else in this document is:

> **Gollwitzer & Sheeran (2006) meta-analysis: 94 independent studies, 8,000+ participants, mean effect on goal attainment d = 0.65** — medium-to-large by Cohen's conventions, and robust to publication-bias adjustment. Mechanisms identified: initiation of goal striving, shielding from distraction, disengagement from failing pursuits.

**This changes what the product may honestly claim.** `VISION.md` §10.5 rules out "scientifically proven" for the selection methods, correctly. But it does not apply here. The honest and stronger combined position:

> **One of these methods is backed by 94 studies. The others have a century of use behind them.**

That is more credible than either claim alone, and every word of it survives scrutiny.

**Enforcement:** an optional *when/where* attached to each line. "After the 9am call, at my desk."

**Legal:** academic work, published, freely describable. Do not brand it — call it *when and where*, never "implementation intentions", which is jargon Gate 5 bans.

### 3.3 Assessed and rejected

| Method | Why |
| :--- | :--- |
| **WOOP / Mental Contrasting** (Oettingen) | Also evidence-backed, but four steps of introspection — too heavy for a morning, and it drifts toward the reflection territory just cut. |
| **Biological Prime Time** | A scheduling observation, not a method. Thin. |
| **After Action Review** (US Army) | Public domain and excellent, but it is a *review* — the territory deliberately removed. |

---

## 4. The right page — and the toothbrush test

Cutting habits and reflection emptied the right page and collapsed the spread. The question is whether anything earns its way back.

**Larry Page's toothbrush test:** *would you use it once or twice a day, and does it make your life better?*

| Candidate for the right page | Toothbrush test | Verdict |
| :--- | :--- | :--- |
| Habit tracking | Daily, but serves a different product | **Cut — stays cut** |
| Evening reflection | Daily, but serves a different product | **Cut — stays cut** |
| A second selection method | You use one method per day, not two | **No** |
| Analytics / streaks / scores | Watched, not used | **No** |
| **Duration per line** (timeboxing) | **Every morning, on the same three items** | **Yes** |
| **When and where per line** (implementation intentions) | **Every morning, on the same three items** | **Yes** |

**The proposal: the right page is the execution layer for the left page's three items.**

```
LEFT PAGE                          RIGHT PAGE
What deserves the day              When, and for how long
(symptom → selection method)       (duration + when/where)
```

Two pages, two distinct jobs, one set of items. The bi-fold earns its existence again — and for a better reason than it had before, because previously the right page held *unrelated* material.

### 4.1 The rule that keeps this from becoming fluff again

**The right page may only ever operate on the left page's items. It never introduces objects of its own.**

The old right page failed because habits and reflection were separate things that happened to share a spread. The moment the right page acquires its own content — its own list, its own tracker, its own anything — it has become the old right page and must be cut again.

### 4.2 Does it pass §9?

*Does this move the user from confusion toward clarity?*

Yes, and specifically: **"I know what to do but not when I'll do it" is residual confusion.** It is the confusion that survives good selection, and it is why correctly-chosen tasks still do not happen. The execution layer closes it.

---

## 5. Summary — the product's methods

**Selection (left page) — pick one, by symptom:**

| Symptom | Method | Enforcement |
| :--- | :--- | :--- |
| *"Too much to do."* | Rule of 3 | Three lines, no fourth |
| *"I keep not finishing things."* | Ivy Lee | #2 locked until #1 is done |
| *"Everything feels urgent."* | Eisenhower | Classify before writing |

**Execution (right page) — applies to whichever is running:**

| Question | Method | Enforcement |
| :--- | :--- | :--- |
| *"How long?"* | Timeboxing (Parkinson, 1955) | A duration per line |
| *"When and where?"* | When/where (Gollwitzer, 1999; d = 0.65) | A trigger per line |

**Five methods, two layers, one page each. Nothing else.**

---

# 6. Legal safety review

> **Not legal advice.** This is a structured risk assessment by a non-lawyer. Before commercial launch across jurisdictions, a qualified IP attorney should review the method names, the marketing copy, and the trademark filings. See §6.6.

## 6.1 The principle that makes this mostly safe

**Methods themselves are not ownable. Names are.**

- **Copyright does not protect methods.** US law is explicit — 17 U.S.C. §102(b) excludes "any idea, procedure, process, system, method of operation, concept, principle, or discovery" from copyright, however it is described or embodied. The principle dates to *Baker v. Selden* (1879). **Implementing a prioritisation method is not infringement.** What is protected is someone's *text describing* it — so write every description in our own words and never paste theirs.
- **Patents are not a live risk.** Business-method patents are rare, much harder to obtain since *Alice v. CLS Bank* (2014), and none of these methods are patented. Anything originating in 1918, 1954 or 1955 would be long expired regardless — patents run 20 years.
- **Trademark is the real risk**, and it protects **names used as brands**, not underlying ideas. Two rules follow:
  1. You may **describe** a method by its common or historical name (nominative use) — as hundreds of companies do with "Eisenhower Matrix".
  2. You may **not** adopt someone's mark as *your* brand, imply endorsement, or use it in a way that suggests affiliation.

## 6.2 Verdict on the five methods in the product

| Method | Assessment | Verdict |
| :--- | :--- | :--- |
| **Rule of 3** | Generic descriptive term with no single author; "rule of three" is a general concept across writing, design and rhetoric. No mark, no owner. | ✅ **Safe** |
| **Ivy Lee** | 1918 historical business anecdote. Ivy Ledbetter Lee died 1934; any contemporaneous writing is public domain. No trademark on the method name — it is a historical attribution like "the Socratic method." Right-of-publicity concerns lapse long before now and would not reach descriptive historical use. | ✅ **Safe** |
| **Eisenhower** | The urgent/important distinction comes from a 1954 Eisenhower speech; the **2×2 matrix was constructed by Stephen Covey**. The generic matrix is used and named this way by Todoist, Asana, ProductPlan and hundreds of others. **Caution: avoid Covey's coined vocabulary** — "Quadrant II", "Big Rocks", "First Things First", "7 Habits" are FranklinCovey territory. Use urgent/important plainly. | ✅ **Safe with caution** |
| **Timeboxing** (Parkinson's Law) | Parkinson published in *The Economist*, 1955; the aphorism is freely quoted worldwide. "Timeboxing" is a generic software-development term from Agile/DSDM practice, unowned. **Caution: never say or imply "Pomodoro"** — that mark is registered and actively enforced. | ✅ **Safe** |
| **When/where** (implementation intentions) | Peer-reviewed academic research. Scientific findings are not owned, and citing them is normal and encouraged. The if-then format is a published finding. **Caution: do not use "WOOP"** — Oettingen holds that mark. Describe Gollwitzer's work in our own words rather than quoting at length. | ✅ **Safe** |

**All five are clear.** No method needs to be dropped for legal reasons.

## 6.3 The blacklist — names never to appear anywhere

Not in the UI, not in marketing, not in metadata, not in help content, not in App Store copy. Gates 17 and 21 already enforce part of this; the list is completed here.

| Name | Owner / problem |
| :--- | :--- |
| **Pomodoro Technique** | Registered trademark, Francesco Cirillo. Actively enforced. |
| **Getting Things Done · GTD** | David Allen Company. Use "weekly review" generically; never cite GTD. |
| **Bullet Journal · BuJo** | Ryder Carroll. Already Gate 17. |
| **Eat That Frog** | Brian Tracy. |
| **The 7 Habits · Quadrant II · Big Rocks · First Things First** | FranklinCovey. |
| **WOOP** | Gabriele Oettingen. |
| **The 12 Week Year** | Brian Moran. |
| **EOS · Entrepreneurial Operating System** | EOS Worldwide. |
| **Buffett 5/25** | Attribution and mark exposure. Already Gate 21. |
| **Deep Work** | Cal Newport book title. The phrase is common, but do not frame it as a named method in the product. |
| **Essentialism** | Greg McKeown book title. The word is ordinary English; do not present it as "the Essentialism method." |

## 6.4 What already protects the product

**The symptom-labelling decision (`VISION.md` §10.3) is a legal asset as well as a UX one.**

The interface says *"I keep not finishing things"* — never *"Ivy Lee Method."* Method names therefore appear only in documentation, the About page and marketing, where **nominative use is exactly what the law permits**: naming a thing to identify it, without claiming it as your own brand.

This was chosen for jargon reasons under Gate 5. It happens to remove nearly all trademark surface from the product itself. Keep it.

## 6.5 One clarification worth holding

**Citing kanso as a philosophy remains fine**, even though the product cannot be *named* Kanso (§5.2). Those are different acts: describing a Japanese aesthetic concept with attribution to Hisamatsu Shin'ichi is nominative and scholarly; adopting it as a brand in a category where three software companies already use it is the problem. The same distinction applies to every method name in §6.2.

## 6.6 What still must be done by a professional

This review does not substitute for any of the following, and the founder has asked to be "very, very safe":

1. **Trademark clearance for the product name** in Classes 9 and 42, in every jurisdiction of sale — outstanding, and already flagged as blocker N5.
2. **A review of final marketing copy** by an IP attorney, particularly any sentence that names a method or cites research.
3. **The "proven scientific" claim must not ship** in any form for the selection methods (`VISION.md` §10.5, C4). The single permitted scientific claim is the Gollwitzer meta-analysis, cited accurately and only about the when/where method.
4. **A Methods & Attributions page** listing each method, its originator and date, in the product's own words. This is good practice, good marketing, and a defence: it demonstrates descriptive rather than proprietary use.

---

# 7. Attribution standard — founder directive, September 9, 2026

> **"Use frameworks that are completely free only, and don't rename them. That is also wrong."**

A stricter standard than the legal minimum, and the correct one. Renaming a method to avoid crediting its originator is passing off — lawful, and still dishonest. Two corrections follow.

## 7.1 Correction to `VISION.md` §10.3 — symptom is the door, not the disguise

The earlier rule read *"label by symptom, never by method name."* It was written for Gate 5 jargon reasons, but as stated it licenses exactly the concealment the founder is rejecting. **Superseded by a two-tier presentation:**

| Tier | Content | Why |
| :--- | :--- | :--- |
| **Entry point** — what the user clicks | *"I keep not finishing things."* | Plain language; a confused person recognises themselves. Satisfies Gate 5. |
| **Once selected** — what appears on the page | *Ivy Lee Method · 1918 · Six tasks, in order, one at a time.* | The method is named and credited wherever it is used. |

This is not a rename. It leads with the problem and names the cure honestly. **Every method is credited at the point of use.**

## 7.2 Attribution correction — the Eisenhower Matrix is misattributed

Caught by applying the founder's stricter standard, and it points the other way from the usual concern.

**Eisenhower did not build the matrix.** In a 1954 speech he quoted a college president — *"I have two kinds of problems, the urgent and the important."* **The 2×2 matrix was constructed by Stephen Covey** in *The 7 Habits of Highly Effective People* (1989).

Calling it "the Eisenhower Matrix" — as the entire industry does — credits Eisenhower with Covey's work. Legally unproblematic; not honest. **The product will use the truthful form:**

> **The Urgent/Important Matrix** — distinction popularised by Eisenhower, 1954; matrix form developed by Stephen Covey, 1989.

Covey's **coined vocabulary** remains excluded — *Quadrant II*, *Big Rocks*, *First Things First* are his expression, not the underlying idea, and are FranklinCovey marks.

## 7.3 The final five, with honest names and provenance

| Method | Attribution | Freedom status |
| :--- | :--- | :--- |
| **Rule of 3** | No author. A generic constraint, ownerless. | Completely free |
| **The Ivy Lee Method** | Ivy Lee, 1918, devised for Charles Schwab at Bethlehem Steel | Completely free — 1918, no rights holder |
| **The Urgent/Important Matrix** | Distinction: Eisenhower, 1954. Matrix: Covey, 1989. | Free to implement; both credited |
| **Timeboxing** | Grounded in Parkinson's Law — C. Northcote Parkinson, *The Economist*, 1955 | Completely free; a generic term, not a brand |
| **If-Then Planning** | Peter Gollwitzer, 1999; meta-analysis Gollwitzer & Sheeran, 2006 (94 studies, d = 0.65) | Published research — free to implement, cited properly |

**None require dropping.** Note that *"if-then planning"* is the standard descriptive term used in the literature itself — it is not a coinage invented here to avoid saying "implementation intentions." Both names are honest; one is plain English.

## 7.4 The Methods & Attributions page becomes marketing, not defence

Previously proposed in §6.6 as evidence of descriptive use. Under this standard it becomes something better: **the proof of the entire positioning.**

Five methods, each with originator, date, and the problem it was built to solve, written in the product's own words:

> *We did not invent these. They have worked for a century, and we credit the people who found them.*

Every competitor claiming a proprietary system looks worse beside that page — and it is the strongest available answer to the IP question raised earlier (`DECISION_LOG.md` §1.35): the product's own IP is the **diagnosis layer**, and honest attribution of the treatments is what makes the diagnosis credible.
