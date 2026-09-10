# PRIMACY • Strategic Provocation & Naming Candidates

> Written September 9, 2026. Two exercises requested by the founder: how Jobs or Musk would run this company, and a set of name candidates in the idiom of the tools that actually won this category.
> **Nothing here is legally cleared.** Every name below is an unverified candidate requiring trademark search and domain check, per `PRIMACY_CREATIVE_BRIEF.md`.

---

# Part 1 — If Jobs or Musk ran Primacy

## 1.1 The observation both would make in the first ten minutes

**A product called PRIMACY ships six competing prioritisation frameworks.**

*Primacy* means the state of being first. The product's entire thesis is that you decide what matters and do that. And its main screen offers you a dropdown of six different philosophies for deciding what matters — Rule of 3, Ivy Lee, Eisenhower, MoSCoW, 1-3-5, Pareto — which is a choice about how to make choices, presented before you have made any.

The product has failed to take its own advice. Both men would find this instantly and neither would be gentle about it.

## 1.2 Steve Jobs

**He would cut the product to one method and never mention the others.**

The 1997 precedent is exact: 350 products to 10, drawn on a 2x2 grid, in one meeting. His actual question was never "is this good?" but "does this need to exist?" Applied here, the six frameworks become one — Rule of 3, because it *is* the brand — and the five deleted ones are never spoken of again. Not moved to settings. Deleted.

Then he would keep cutting: the decision log, the scratchpad, voice dictation, the victory card, multi-volume, the gift modal. Forty components is not a product, it is an accumulation. His standard was that everything remaining must be defensible in one sentence to someone who does not care.

**He would refuse the free tier.** Apple has never run freemium. Jobs priced at the top of the market, never discounted, and never apologised — because a price is a claim about what something is worth and a discount retracts the claim. He would charge $49 to $99, offer no trial, and let the product's obvious quality do the selling.

**He would not ship it as a browser tab.** This is the biggest and most contrarian move available. Jobs believed the experience *is* the product, and a thing that lives at a URL next to twelve other tabs is not an instrument on a desk. He would make it a native Mac and iPhone app, in the App Store, with a Dock icon, launched with ⌘-Space. The web version would exist only as a demo.

**He would make privacy the campaign, not a feature.** Apple bought a billboard reading *"What happens on your iPhone, stays on your iPhone."* Primacy's local-first architecture is a marketing asset being used as an engineering footnote. And he would delete the telemetry outright — not make it opt-in, delete it — because the ad is worth more than the analytics.

**The launch would be one sentence.** "1,000 songs in your pocket." For Primacy, something like *"Three things. Every day."* If the product cannot be said in five words, it is not finished.

## 1.3 Elon Musk

He would run the five-step process he repeats constantly, and it is unusually well-suited to this codebase:

**1. Make the requirements less dumb — and name the person who set them.** The 21 QC gates, the 24px grid, the zero-scroll lock, the woven twill tag specification. Who required these, and for whom? Some are genuine craft. Some are a document requiring things of itself. His rule is that a requirement without a name attached is not a requirement, and *"the most common error of a smart engineer is optimising a thing that should not exist."*

**2. Delete the part.** His stated benchmark: if you are not later adding back at least 10% of what you deleted, you did not delete enough. Six frameworks to one. Six views to two. Forty components to perhaps twelve.

**3. Simplify — only after deleting.** Most of the design-audit documents in this repo are step 3 applied to parts that step 2 should have removed.

**4. Accelerate cycle time.** And here he would stop and stare. This product is polished, passes 21 automated gates, has a Three.js marketing scene — **and has never shipped, has no version control, and its checkout is a 1.5-second timer.** Three generations of documentation, an unlaunched product. To Musk this is the whole diagnosis: the company optimised the thing it could control instead of the thing that mattered. He would have shipped in week three, at a URL, ugly, and learned more in a month than this repo has learned in its lifetime.

**5. Automate last.** The telemetry backend — SQLite, WAL mode, cohort retention, funnel aggregation, seeded with 1.2 MB of fake data — is a measurement system built before there was anything to measure. Textbook step-5-before-step-1.

**On price he would go the opposite way to Jobs.** The Tesla master plan is expensive-then-cheap: Roadster funds Model S funds Model 3. He would take the $39, use it to fund reach, and drive toward free-at-scale with the business model somewhere adjacent — because his instinct is always that scale is the moat and margin comes later.

## 1.4 Where they disagree — and what that tells you

| | Jobs | Musk |
| :--- | :--- | :--- |
| **Price** | Premium forever. Never free, never discounted. | High now, drive toward free at scale. |
| **Why cut** | To make one thing perfect. | To ship faster. |
| **Platform** | Native app. Controlled. App Store. | Web. Everywhere. API. Open. |
| **Timing** | Delay until it is right. | Ship now, iterate in public. |
| **Analytics** | Delete it; trust taste. | Instrument everything; trust data. |

The disagreement is real and you cannot have both. But **what they agree on is where the actual instruction lies**, because it is the same in both directions:

1. **Delete 60–80% of the surface area.** Neither would keep six frameworks in a product named Primacy.
2. **The current state is the failure.** Polished, gated, documented, unlaunched, no git, fake checkout. Both were shipping machines and both would treat this as the only real problem.
3. **One sentence, or you do not have a product.**
4. **The name and the story are not decoration.** Both spent enormous personal attention on naming and both were right to.

## 1.5 The honest caveat

Jobs and Musk each ran companies with capital, distribution, and thousands of employees. Some of what worked for them works *because* of that — Jobs could refuse a free tier because Apple had retail stores and a brand; Musk can burn cash to reach scale. A solo founder shipping a local-first journal has neither.

What transfers regardless of scale is the deleting, the single sentence, and the shipping. What does not transfer is the assumption that the market will wait for you.

---

# Part 2 — Naming

## 2.1 The mandate

`PRIMACY_CREATIVE_BRIEF.md` calls Primacy the **working** masterbrand and instructs: *"Evaluate alternate masterbrand names as unverified candidates, not legally cleared recommendations."* Renaming is sanctioned. There is no other naming discussion in the repository.

**Constraint carried forward:** the brief forbids "the two excluded category words" in all visible copy and metadata. They are never spelled out in the document, but from QC gates 17 and 21 they are almost certainly **bullet** and **journal**. Candidate names must avoid both roots. *Verify before committing.*

## 2.2 The rubric

Seven criteria, in rough order of weight. A name that fails 1, 3 or 6 is not viable regardless of how it scores elsewhere.

| # | Criterion | The test |
| :--- | :--- | :--- |
| 1 | **Concrete** | Can you picture it? A name that denotes an object borrows that object's solidity. Abstractions make the user do work the name should have done. |
| 2 | **Short** | One or two syllables, four to eight letters. Long names get abbreviated by users into something you did not choose. |
| 3 | **Sayable** | Survives being said aloud in a noisy room and spelled over a phone without a second attempt. If it needs "no, with a K", it is dead. |
| 4 | **Ownable** | Distinctive enough to rank in search and to defend as a mark. A common word with no twist is unfindable; a coined word with no root is unmemorable. |
| 5 | **Resonant** | Connects to the product's actual substance, ideally by a detail that feels *found* rather than constructed. Resonance is what makes a brand story worth telling twice. |
| 6 | **Locative** | Does *"it's in ___"* work? Daily tools become places. "It's in Bear." "It's in Notion." A name that resists the preposition resists daily use. |
| 7 | **Ageless** | Still works in ten years. No era markers, no trend suffixes, no technology reference that will date. |

## 2.3 What the winning names in this category have in common

From the tools surveyed during the pricing research — Obsidian, Bear, Craft, Things, Tot, Agenda, Notion, Reflect, Roam, Drafts, Arc, Linear, Sublime, Ulysses:

- **They are concrete nouns, not abstractions.** Obsidian is a rock. Bear is an animal. Craft, Things, Drafts, Arc — all things you can picture. Almost none describe what the software does.
- **They are short.** One or two syllables, five to seven letters.
- **They are ownable in speech.** "I put it in Bear." "It's in Obsidian." The name works as a place.
- **They evoke a material or a quality**, and let the product supply the meaning.

**Primacy fails every one of these.** It is a Latin abstraction, three syllables, and it describes a *philosophy* rather than an object. It is a positioning statement wearing a name's clothes — you cannot picture it, and "I wrote it in Primacy" does not sit in the mouth. For a tool meant to feel like a physical instrument on a desk, that is a real mismatch: the whole product is an argument that software should feel like an object, made under a name that feels like a thesis.

## 2.4 Where candidates come from — the five territories

Candidates were not free-associated. They were generated by working five territories that the product genuinely occupies, so that more can be produced systematically if none of these survive clearance.

| Territory | The idea | Examples generated |
| :--- | :--- | :--- |
| **1. The material** | Paper, binding, and the physical vocabulary of fine stationery. Highest fit — the product is an argument for physicality. | Quire, Deckle, Folio, Octavo, Vellum, Foolscap, Linen |
| **2. The page** | The anatomy of an open book; the bi-fold spread the product is actually built on. | Recto, Verso, Incipit, Colophon, Frontis |
| **3. The instrument** | Tools of measurement and navigation — precision, reference, finding your position. | Datum, Plumb, Fathom, Gnomon, Sextant, Meridian |
| **4. The mark** | Making something official; the small private act of committing. | Signet, Nib, Rubric, Marque |
| **5. Primacy itself** | Firstness, without the Latin abstraction. | Daybook (book of first entry), Cardinal, Keystone, Prow |

Territory 1 and 2 are the strongest because they are **specific to this product and not to productivity software in general.** Territory 3 is competent but crowded — navigation metaphors are the most over-fished water in software naming. Territory 5 risks reproducing Primacy's original error: naming the thesis instead of the thing.

## 2.5 Patterns rejected outright

Documented so they are not proposed later:

- **Suffix formations** — `-ly`, `-ify`, `-io`, `-r`. Era-marked, already dated, and they signal "startup" rather than "instrument".
- **Portmanteaus** — *Focusly*, *Prioriti*, *Dayflow*. They read as generated, which is precisely the impression to avoid given the name is being reconsidered *because* the first one was.
- **Descriptive compounds** — *FocusBook*, *TaskLedger*, *PriorityPad*. They describe the category and therefore compete inside it; the winners in this space deliberately do not describe themselves.
- **Misspellings for domain availability** — *Kwire*, *Sinet*. Fails criterion 3 permanently, in exchange for a domain that a modifier would have solved.
- **Anything built on the two excluded roots** — see §2.1.
- **Latin abstractions.** This is the specific failure being corrected. *Primacy, Acumen, Lucid, Cognita, Meridia.* They sound serious and mean nothing you can hold.

## 2.6 Candidates

### Tier 1 — strongest

| Name | Why |
| :--- | :--- |
| **Quire** | A quire is **24 sheets of paper**. The product's entire design system is a 24px grid. Stationery-native, one syllable, obscure enough to own, and the resonance is genuine rather than manufactured. The strongest candidate on the list. |
| **Daybook** | Literally a book kept daily — and in accounting, the *book of first entry*. It means "primacy" and "journal" at once without using either word. Warm, plain, English, unpretentious. |
| **Nib** | The tip of a fountain pen. Three letters, tactile, instrument-like, and it points at the exact moment of writing. Very short names are hard to get and very good to have. |
| **Recto** | The right-hand page of an open spread — and the *first* side of a leaf. Precise, elegant, and it matches the bi-fold architecture the product is actually built on. |
| **Signet** | A personal seal ring: private, authoritative, small, owned, and used to mark what matters. Almost purpose-built for a private executive instrument. |

### Tier 2 — strong

| Name | Why |
| :--- | :--- |
| **Deckle** | The rough untrimmed edge of handmade paper. Craft-insider, distinctive, almost certainly available. |
| **Datum** | The fixed reference point everything else is measured from. Instrument-like, precise, quietly confident. |
| **Plumb** | A plumb line finds true vertical; to plumb is to sound the depths. Short, strong, dual-meaning. |
| **Fathom** | To understand something fully, and a measure of depth. Two syllables, warm, intelligent. |
| **Folio** | A sheet folded once; a page number; a book format. Clean and classical. |
| **Cardinal** | Principal, chief, the hinge on which things turn. Carries "primacy" without the abstraction. |

### Tier 3 — distinctive, higher risk

| Name | Why, and the risk |
| :--- | :--- |
| **Incipit** | "Here begins" — the opening words of a manuscript. Beautiful and exactly on-theme; but obscure and people will mispronounce it. |
| **Octavo** | A book format. Distinctive and memorable; slightly academic. |
| **Gnomon** | The part of a sundial that casts the shadow — the thing that makes time legible. Wonderful meaning, hard to spell. |
| **Foolscap** | A paper size. Highly memorable; the "fool" syllable may undercut an executive product. |
| **Colophon** | The printer's mark at the end of a book. Gorgeous, three syllables, a little precious. |

## 2.7 Scorecard

Scored 1–5 against the §2.2 rubric. "Loc." is the locative test — *"it's in ___"*.

| Candidate | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | **Total** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Quire** | 5 | 5 | 4 | 5 | 5 | 5 | 5 | **34** |
| **Daybook** | 5 | 4 | 5 | 3 | 5 | 5 | 5 | **32** |
| **Signet** | 5 | 4 | 5 | 4 | 4 | 4 | 5 | **31** |
| **Recto** | 4 | 5 | 4 | 5 | 5 | 3 | 5 | **31** |
| **Nib** | 5 | 5 | 5 | 3 | 4 | 3 | 5 | **30** |
| **Deckle** | 5 | 4 | 4 | 5 | 4 | 3 | 5 | **30** |
| **Fathom** | 3 | 4 | 5 | 3 | 4 | 4 | 5 | **28** |
| **Datum** | 3 | 4 | 5 | 3 | 4 | 4 | 4 | **27** |
| **Folio** | 5 | 4 | 5 | 2 | 4 | 3 | 5 | **28** |
| **Plumb** | 4 | 5 | 3 | 3 | 4 | 3 | 5 | **27** |
| **Cardinal** | 3 | 3 | 5 | 2 | 4 | 3 | 5 | **25** |
| **Octavo** | 4 | 3 | 4 | 4 | 3 | 3 | 4 | **25** |
| **Incipit** | 2 | 3 | 2 | 5 | 5 | 2 | 4 | **23** |
| **Colophon** | 3 | 2 | 3 | 4 | 4 | 2 | 4 | **22** |
| **Gnomon** | 3 | 3 | 2 | 5 | 4 | 2 | 4 | **23** |
| **Foolscap** | 4 | 3 | 4 | 4 | 3 | 2 | 3 | **23** |
| *Primacy (incumbent)* | *1* | *2* | *4* | *3* | *2* | *1* | *4* | ***17*** |

Notes on the scores that are not self-evident:

- **Quire** loses a point on sayability — a minority will reach for "quiet" or "choir" on first hearing. It recovers immediately once seen written, and the "choir" collision is phonetically identical, which makes it memorable rather than confusing.
- **Daybook** loses on ownability: it is a real English word in current use, which makes search ranking harder and a trademark narrower. Everything else about it is close to perfect.
- **Recto** and **Nib** lose on the locative test. *"It's in Recto"* is slightly odd; *"it's in Nib"* is worse, because a nib is a point rather than a container. Both are excellent wordmarks and weaker daily nouns.
- **Folio** scores 2 on ownable — heavily used across publishing and finance software.
- **Incipit** and **Gnomon** are the highest-resonance, lowest-usability names on the list. Beautiful on a cover, painful on a phone call.
- **Primacy** scores 1 on locative because *"it's in Primacy"* does not parse as a place, and 1 on concrete because there is nothing to picture. Its 17 against Quire's 34 is the whole argument.

## 2.8 Tests to run before committing

A shortlist is not a decision. Five cheap tests, in order:

1. **The phone test.** Say the name to someone unfamiliar with the product and ask them to write it down. If more than one in five gets it wrong, the name has a permanent tax.
2. **The sentence test.** Write the actual sentence a user would say: *"I keep my priorities in Quire."* If it needs rephrasing to sound natural, the name is fighting its own use.
3. **The search test.** Search the bare word. If page one is dominated by an established meaning you cannot displace, you will pay for that forever in acquisition.
4. **The wordmark test.** Set the name in the product's own typeface at the size it will appear on the cover. Some names are better in the mouth than on the object; this product puts its name on a physical-looking cover, so the wordmark matters more than usual.
5. **The clearance test.** Trademark search in the relevant classes and jurisdictions, domain, App Store name availability. **This is the only one that can veto**, and it must run before any of the others are acted on.

## 2.9 The cost of renaming — and why the window closes at launch

Measured in the codebase, September 9, 2026:

- **105 brand references** across `src/` and `index.html`.
- **Two prior renames are already carried as legacy shims**: `BUJO_STUDIO_V1` → `POCKETBOOK_STUDIO_V1` (still read at `useJournalStorage.js:481`), and `POCKETBOOK_PATRON_LICENSE` → `PRIMACY_PATRON_LICENSE`.
- **The data layer was never actually renamed.** The app is called Primacy and stores under `POCKETBOOK_STUDIO_V1`, with `POCKETBOOK_ACTIVE_VOLUME_ID` and telemetry ids `pocketbook_anon_id` / `pocketbook_sess_id`. The last rename was cosmetic — which is correct practice, and the creative brief mandates it: *"keep persisted IDs compatible when changing labels."*
- **Six promo license keys are hardcoded** in `licenseManager.js`, four of them brand-prefixed (`PRIMACY-PATRON-2026`, `PRIMACY-VIP-2026`, `POCKETBOOK-PATRON-2026`, `POCKETBOOK-VIP-2026`). *This corrects the earlier statement in `growth-revenue-ops.md` that there is a single shared key — there are six, all readable in the shipped bundle.*
- **QC gates 17 and 21 hardcode banned brand strings**, so a rename means updating the audit suite alongside the source.

So the mechanical cost is **one day of careful work**: swap 105 display strings, leave every persisted key untouched behind the existing shim pattern, add the new brand's license prefix while continuing to honour the old ones, update two QC gates.

**But that is only true before launch.** The moment licenses are sold, every key a customer holds carries the old brand in a string they will paste into a support email in three years. Every review, every Product Hunt page, every backlink, every screenshot fixes the name in public. Renaming after launch is not a day of work; it is a permanent second identity.

**Therefore: this is a now-or-never decision, and "now" ends at the first sale.** Since the product has not launched, has no users, and has sold nothing, the rename is currently as cheap as it will ever be — and the incumbent name scores 17 against the leading candidate's 34. That gap will never be cheaper to close than it is today.

## 2.10 Recommendation

**Quire**, with **Daybook** as the safe alternative.

Quire wins on resonance — 24 sheets against a 24px grid is the kind of detail that makes a brand story feel discovered rather than constructed, and it is short, ownable, and native to the stationery world the product is built from. Daybook wins on warmth and immediate comprehension: it needs no explanation, it means "book of first entry", and it is the name most likely to survive being said out loud by someone who has never heard of the product.

If the founder wants to keep Primacy, the honest compromise is to **demote it to the descriptor** — *"Quire — the primacy instrument"* — where an abstraction does useful work, rather than asking it to be the thing people say every day.

## 2.11 Required next step

None of these is cleared. Before any commitment: trademark search in the relevant classes and jurisdictions, domain availability, App Store name availability, and a check for existing products in adjacent categories. `growth-acquisition` to scope; a source scan is not legal clearance.

---

# Part 3 — The self-explaining name

> Added September 9, 2026. The founder asked for *"a name that can work without marketing, explains everything we are trying to solve, and justifies our purpose."* That is a **different brief** from Part 2, and it produces a different answer. This section states the change honestly rather than pretending the earlier recommendation anticipated it.

## 3.1 Two classes of name, and they pull apart

Part 2 optimised for the convention that won this category: Obsidian, Bear, Craft, Things, Tot. Those are **brand names** — concrete, evocative, and *deliberately non-descriptive*. Obsidian tells you nothing about notes. They acquire meaning through use and marketing, and in exchange they are ownable, defensible, searchable, and free to grow beyond their literal sense.

The founder is now asking for the other class: the **self-explaining name.** Calm. Freedom. Forest. Streaks. Superhuman. Basecamp. Linear. These do the marketing themselves — you hear the name and you already know the promise and the philosophy behind it.

The trade-off is real and unavoidable:

| | Brand name | Self-explaining name |
| :--- | :--- | :--- |
| **Comprehension** | Needs marketing to mean anything | Instant, permanently, for free |
| **Ownability** | Strong — trademark, search, defence | Weak — common words, crowded classes |
| **Search** | You can rank first for your own name | You compete with the dictionary |
| **Headroom** | Grows with the product | Capped at its literal meaning |
| **Cost to launch** | Higher — the name is a liability until it is an asset | Near zero |

**Given the founder's stated constraints — maximum reach, no marketing spend, and a name that justifies the purpose — the self-explaining class is the correct choice**, and its ownability cost is a real price worth paying knowingly.

## 3.2 The rubric gains an eighth criterion

Part 2's rubric (§2.2) does not measure the thing now being asked for. Adding it changes the ranking:

| | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | **Self-explaining** | Total |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Foremost** | 2 | 3 | 5 | 3 | 5 | 3 | 5 | **5** | **31** |
| **Three** | 4 | 5 | 5 | 1 | 5 | 3 | 5 | **5** | **33** |
| **Fewer** | 2 | 5 | 5 | 2 | 5 | 3 | 5 | **5** | **32** |
| **Shortlist** | 4 | 3 | 5 | 2 | 5 | 4 | 4 | **5** | **32** |
| *Quire (Part 2 winner)* | *5* | *5* | *4* | *5* | *5* | *5* | *5* | ***1*** | ***35*** |
| *Primacy (incumbent)* | *1* | *2* | *4* | *3* | *2* | *1* | *4* | ***2*** | ***19*** |

Quire still leads on total — but its 35 is carried entirely by criteria the founder has now deprioritised, and its **1 on self-explaining is a direct failure of the stated brief.** Quire is the right name for a company that will invest in building a brand. It is the wrong name for one that wants the name to do the work unpaid.

## 3.3 Candidates that explain themselves

| Name | What it says without help | Risk |
| :--- | :--- | :--- |
| **Foremost** | *Most important.* One word, complete, dignified, and it states the product's entire job. Becomes a daily prompt: *"What's foremost today?"* | An adjective, so nothing to picture; moderate ownability. An App Store "Foremost Production" exists in photo-sharing — a different class, but check. |
| **Three** | The method *is* the name. *"What are your three?"* No explanation needed, ever, in any language. | Unownable and unsearchable as a bare word. And it permanently caps the product — a product named Three can never ship a fourth priority. |
| **Fewer** | The whole philosophy in five letters. *Do fewer things.* Provocative, memorable, and it positions against every bloated tool at once. | Negative framing; some will read it as a limitation rather than a liberation. |
| **Shortlist** | *Your shortlist for today.* Precise, warm, and it describes exactly what the product produces. | Common phrase, weak trademark, crowded. |
| **What Matters** | The most literal statement of purpose available. | Two words, slightly soft, hard to own. |
| **Deliberate** | The opposite of reactive — names the behaviour change, not the feature. | Three syllables; also a verb, which muddies it. |
| ~~Cardinal~~ | *Of chief importance* — from *cardo*, a hinge: the thing everything turns on. | **Downgraded.** Search confirms at least two existing productivity/product-management tools already use it. |

## 3.4 Recommendation

**Foremost.**

It is the only candidate that states the entire purpose in one dignified word, needs no story, no launch copy and no dictionary, and still sounds like something a serious person would keep on their desk. It carries the executive register the product wants without excluding anyone — a student understands it as immediately as a CEO. And it turns into the product's own daily question, which is the most valuable thing a name can do: **"What's foremost today?"**

- If the founder wants **boldness over dignity**: *Fewer*. It is the sharper, more opinionated name and it will be remembered by people who never install it.
- If the founder wants **maximum literalness and accepts unownability**: *Three*.
- If the founder later decides to build a brand rather than have the name carry it: *Quire*, from §2.10.

## 3.5 The honest limit — one word cannot carry both halves

The purpose has two parts: *decide what actually matters*, and *it stays yours, privately, forever*. **No single word carries both.** Foremost says the first and is silent on the second; a privacy name like *Sanctum* says the second and is silent on the first.

So the name carries the primary promise and the descriptor carries the rest. That is what descriptors are for:

> **Foremost** — three things a day, yours alone.

That line explains the method, the constraint, the privacy position and the anti-SaaS stance in eight words, and it needs no marketing budget to do it.

## 3.6 Unchanged

Nothing here is cleared. §2.8's five tests and §2.11's clearance requirement apply to every candidate above, and §2.9 still governs the timing: **the renaming window closes at the first sale.**

## 3.7 A wider set — the self-explaining field

The founder confirmed Foremost as the right direction and asked for more in the same vein. Generated by working the sub-territories of "names that state their own purpose", grouped by **what the name actually says**.

### Family 1 — "this is the most important thing" (Foremost's own family)

| Name | What it says | Note |
| :--- | :--- | :--- |
| **Utmost** | *Your utmost.* The greatest degree of something, and the effort you owe it. | The warmest member of the family. Carries effort as well as importance, which Foremost does not. |
| **Paramount** | More important than anything else. | Meaning is perfect; **Paramount Pictures makes this commercially unrealistic.** Listed for completeness only. |
| **Chief** | The chief thing. One syllable, unmistakable. | Plain, strong, slightly corporate. Risks reading as a job title. |
| **Salient** | The thing that stands out from everything around it. | Precise and intelligent; a step less universal than the others. |

### Family 2 — "this is the decisive point"

| Name | What it says | Note |
| :--- | :--- | :--- |
| **Crux** | *The crux of the matter* — the decisive point everything turns on. | **The strongest new candidate.** One syllable, sharp, and crucially a **noun** where Foremost is an adjective — so it works as a place: *"it's in Crux."* Check the climbing and existing-product collisions. |
| **Linchpin** | The pin without which the wheel comes off. | Excellent metaphor, but a well-known Seth Godin book title. |
| **Mainstay** | The thing you rely on above others. | Underrated. Warm, nautical, ownable, and it implies *dependability* as well as importance. |

### Family 3 — "few, not many"

| Name | What it says | Note |
| :--- | :--- | :--- |
| **Fewer** | Do fewer things. The philosophy in five letters. | Already in §3.3. The most opinionated name available. |
| **Only** | *Only the things that matter.* The constraint as the name. | Provocative and very short; abstract, and awkward as a standalone noun. |
| **Vital** | Essential to life — and it echoes Pareto's *"the vital few"*, which the product already ships. | Positive framing where *Fewer* is negative. Genuine provenance inside the product. |
| **The Few** | Pareto's vital few, stated directly. | Strong meaning; two words and a definite article make it unwieldy as a wordmark. |

### Family 4 — "the day is decided"

| Name | What it says | Note |
| :--- | :--- | :--- |
| **Resolve** | Both *to decide* and *the determination to follow through* — the two halves of the product's job in one word. | Meaning is close to ideal. **DaVinci Resolve is a large, well-known product**; different category, but it owns the search results. |
| **Decided** | The day is settled. Past tense as a promise. | Unusual and memorable; past-tense names are rare for good reason — they can read as finished rather than active. |
| **Enough** | You have done enough. | Emotionally the most powerful name on any of these lists. It speaks to the anxiety the product exists to relieve — but it says nothing about *prioritising*, so it fails the brief on comprehension. |

### Family 5 — "reduce it down"

| Name | What it says | Note |
| :--- | :--- | :--- |
| **Distill** | Reduce to the essence. | Elegant and active; spelling varies by region (*distil* / *distill*), which is a permanent small tax. |
| **Winnow** | Separate the grain from the chaff. | Beautiful and precise; a step too literary for instant comprehension. |
| **Shortlist** | What is left after you have chosen. | Already in §3.3. The most plainly descriptive option here. |

## 3.8 Scored — the new field against the eight criteria

| Name | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | Self-exp. | **Total** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Crux** | 3 | 5 | 5 | 3 | 5 | 4 | 5 | 4 | **34** |
| **Utmost** | 2 | 3 | 5 | 4 | 5 | 3 | 5 | 5 | **32** |
| **Foremost** *(incumbent pick)* | 2 | 3 | 5 | 3 | 5 | 3 | 5 | 5 | **31** |
| **Mainstay** | 3 | 3 | 5 | 4 | 4 | 3 | 5 | 4 | **31** |
| **Vital** | 2 | 4 | 5 | 3 | 5 | 3 | 5 | 4 | **31** |
| **Chief** | 3 | 5 | 5 | 2 | 4 | 3 | 4 | 5 | **31** |
| **Resolve** | 3 | 3 | 5 | 2 | 5 | 4 | 5 | 4 | **31** |
| **Only** | 1 | 5 | 5 | 2 | 5 | 3 | 5 | 4 | **30** |
| **Distill** | 3 | 3 | 4 | 3 | 4 | 3 | 5 | 4 | **29** |
| **Enough** | 2 | 4 | 5 | 3 | 4 | 3 | 5 | 3 | **29** |
| **Salient** | 2 | 3 | 4 | 4 | 4 | 3 | 5 | 3 | **28** |

## 3.9 Revised recommendation

**Crux edges Foremost, and the reason is grammatical.**

*Foremost* is an adjective. It describes a quality, so there is nothing to picture and it resists becoming a place — *"it's in Foremost"* is tolerable rather than natural. *Crux* is a **noun**: the decisive point. It pictures, it takes the preposition cleanly, it is one syllable instead of two, and it says the same thing with more edge.

Foremost keeps one real advantage: **plainness.** It is understood instantly by every English speaker including non-native ones, where *crux* is mid-frequency vocabulary. If reach across a global, largely non-native audience is the priority — and per `SCALE_PLAN.md` §1.2 it is — that advantage is not small.

So the honest position:

- **Crux** — if the founder wants the sharper, more distinctive name, and accepts that a minority will need one beat to place the word.
- **Foremost** — if universal plain comprehension matters more than edge. This remains a completely defensible choice and nothing above overturns it.
- **Utmost** — the compromise. Same instant comprehension as Foremost, warmer, marginally more ownable, and it carries *effort* alongside importance.
- **Mainstay** — the sleeper. Nothing else on the list implies dependability, which is what a daily instrument actually earns over years.

Descriptor unchanged from §3.5 and works with any of them:

> **Crux** — three things a day, yours alone.

## 3.10 Known collisions flagged during generation

Not clearance — these are obvious commercial conflicts noticed while generating, and they do not substitute for §2.11.

| Name | Conflict |
| :--- | :--- |
| **Paramount** | Paramount Pictures. Effectively unusable. |
| **Resolve** | DaVinci Resolve — different category, but it owns the search results. |
| **Linchpin** | Seth Godin book title. |
| **Cardinal** | Two existing productivity/PM tools (confirmed §3.3). |
| **Vanguard, Prime** | Vanguard (finance), Amazon Prime. Rejected before scoring. |
| **Crux, Utmost, Mainstay, Vital, Chief** | No obvious blocker noticed — **which is not the same as clear.** Run §2.8's five tests and a professional search. |

## 3.11 The third lane — names that promise a benefit

The founder asked for names that **drive the benefit to the user**. This is a distinct third lane, and separating it from the second is worth doing precisely:

| Lane | Says | Examples in software | This project's candidates |
| :--- | :--- | :--- | :--- |
| **Brand** (§2) | What it is *like* | Obsidian, Bear, Craft, Things | Quire, Daybook, Signet |
| **Purpose** (§3.3–3.9) | What the product *does* | Linear, Basecamp, Superhuman | Foremost, Crux, Utmost |
| **Benefit** (here) | What the user *gets or becomes* | **Calm, Headspace, Freedom, Forest, Momentum** | below |

The benefit lane has the best commercial track record of the three, and the reason is a rule older than software: **people buy the outcome, not the mechanism.** Calm outsold every meditation app named after meditation. Freedom outsold every website blocker named after blocking. The name is doing the entire value proposition before a single word of copy is read — which is exactly the founder's stated requirement of working without marketing.

Its weakness is the same as its strength: benefit words are common, emotionally loaded, and therefore crowded. Ownability in this lane is consistently the lowest of the three.

## 3.12 Candidates by benefit promised

### "You get your breathing room back"

| Name | What the user hears |
| :--- | :--- |
| **Margin** | Space in your day, and slack in your life. **And the margin of a page** — the blank edge that makes writing legible. |
| **Clearing** | A deliberate open space made in a crowded place. Calm without being soft. |
| **Room** | Room to think. Plain, generous; very hard to own. |
| **Latitude** | Freedom to move. Elegant, slightly cool. |

### "You become steady"

| Name | What the user hears |
| :--- | :--- |
| **Steady** | Calm *and* consistent *and* reliable — it names the person the product makes you, not the product. |
| **Settled** | The day is settled and so are you. Same double meaning as *Resolve*, in a calmer register. |
| **Composed** | Self-possessed — and, for a written thing, *composed* as in written. |
| **Assured** | Confidence without noise. |

### "You are making progress"

| Name | What the user hears |
| :--- | :--- |
| **Onward** | The feeling of moving forward. Warm, positive, momentum-carrying. |
| **Strides** | Visible progress, not busywork. |
| **Headway** | *Making headway.* States the benefit outright — but an existing book-summary app owns the name. |
| **Ground** | Gaining ground; also grounded. Short, dual-sense. |

### "The day was well spent"

| Name | What the user hears |
| :--- | :--- |
| **Wellspent** | *A day well spent* — the exact emotional payoff the product exists to deliver, and the most ownable name on any of these lists. |
| **Worthwhile** | The plainest possible statement of the outcome. Long. |
| **Grip** | You have a grip on your day. Punchy, informal, physical. |

## 3.13 Scored, and the standout

| Name | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | Self-exp. | **Total** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Margin** | 4 | 4 | 5 | 3 | 5 | 4 | 5 | 3 | **33** |
| **Clearing** | 4 | 3 | 5 | 4 | 5 | 4 | 5 | 3 | **33** |
| **Grip** | 4 | 5 | 5 | 3 | 4 | 3 | 4 | 4 | **32** |
| **Steady** | 2 | 4 | 5 | 3 | 5 | 3 | 5 | 4 | **31** |
| **Wellspent** | 2 | 3 | 4 | 5 | 5 | 2 | 5 | 5 | **31** |
| **Settled** | 2 | 4 | 5 | 3 | 5 | 3 | 5 | 4 | **31** |
| **Onward** | 2 | 4 | 5 | 3 | 4 | 2 | 5 | 4 | **29** |
| **Strides** | 3 | 4 | 5 | 3 | 4 | 2 | 5 | 4 | **30** |
| **Headway** | 2 | 3 | 5 | 2 | 4 | 2 | 5 | 5 | **28** |

**The standout is Margin, and for the same reason Quire led the brand lane: found resonance.**

*Margin* names the benefit — breathing room, slack, space to think — and simultaneously names **a physical feature of the object the product imitates**: the blank edge of a page, the space that makes writing legible. It is the only candidate in this entire exercise that operates in two lanes at once. Criterion 5 of the rubric rewards resonance that feels discovered rather than constructed, and this is the second instance of it found here.

*"Keep a margin in your day"* is a complete product philosophy in six words, and the name is already carrying it.

**Its real risk is collision of meaning, not of trademark.** *Margin* is heavily used in finance (profit margin, margin call) and is a CSS property every developer types daily. In the context of a stationery-styled journal the page reading should dominate — but this is exactly what §2.8's search test exists to check, and it should be checked before anything else.

**Runner-up: Clearing.** Same score, no collisions, more ownable, and it carries a quietness that suits the product. Weaker only in that it is a step more poetic and a step less immediate.

## 3.14 Where this leaves the whole exercise

Three lanes, three leaders. The choice between them is not a matter of taste — it is one question:

| If the founder believes… | Then the name is | Because |
| :--- | :--- | :--- |
| *"I will build a brand over years"* | **Quire** (35) | Most ownable, most headroom, best wordmark — and it needs marketing to mean anything. |
| *"The name must say what the product does"* | **Crux** (34) or **Foremost** (31) | States the function instantly; Crux is sharper, Foremost is plainer and travels better internationally. |
| *"The name must say what the user gets"* | **Margin** (33) | Sells the outcome rather than the mechanism, which is the strongest-performing pattern in consumer software — and it carries a second, physical meaning for free. |

**All three are defensible. None is cleared.** The founder's stated constraints — maximum reach, no marketing spend, a name that justifies the purpose — point at lanes 2 and 3 over lane 1, and between those two the benefit lane has the better commercial record.

If forced to one answer: **Margin**, with **Crux** as the sharper alternative and **Foremost** as the safest. And the descriptor from §3.5 still does the second half of the work for any of them:

> **Margin** — three things a day, yours alone.

## 3.15 The "Priority" family — and the best story in the whole exercise

The founder asked whether *Priority* itself, or wordplay around it, could work.

### 3.15.1 The etymological gift

Before assessing the name, the fact that matters most:

> **"Priority" had no plural for roughly five hundred years.**
> The word entered English in the 1400s and meant *the single thing that comes before all others* — singular by definition. There was no such word as "priorities". The plural appears only in the **1900s**, and the moment the word could be pluralised, it stopped meaning anything: a person with twenty priorities has none.

This is the best brand story available to this product, and it should be captured **whichever name wins**. It states the entire thesis in one historical fact, it is true, it is memorable, it is repeatable by users, and it justifies the purpose in the way the founder asked for two sections ago. It belongs on the landing page and in the launch post regardless of the wordmark above it.

### 3.15.2 But the bare word is the weakest candidate discussed

| Name | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | Self-exp. | **Total** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Priority** | 1 | 2 | 5 | **1** | 3 | 2 | 4 | 5 | **23** |

Three problems, the first of which is close to disqualifying:

1. **It is the generic term for its own category.** Naming a prioritisation tool *Priority* is naming a shoe company *Shoe*. Trademark law treats generic and merely-descriptive marks in their own class as unregistrable or very weak — meaning you could likely never stop a competitor from using it, which is the entire point of a name. **This needs counsel, not my assessment, but it is a real and well-established doctrine and should be checked before any attachment forms.**
2. **Search is hopeless.** "Priority" carries enormous generic volume across project management, shipping, healthcare and email. You would never rank for your own name.
3. **Four syllables.** The longest candidate anywhere in this document, in a field where the winners are one and two.

### 3.15.3 The wordplay options, honestly assessed

| Name | The play | Score | Verdict |
| :--- | :--- | :---: | :--- |
| **Singular** | Carries the etymology directly — *priority was singular* — and doubles as "exceptional". Two meanings, both true, both on-message. | **31** | **The best of this family.** Self-explaining, reasonably ownable, and it tells the story without needing the word. |
| **Prior** | The root. Means *coming before in importance*; also a real noun (the head of a priory), which is quietly apt for a contemplative daily practice. | 28 | Short and real, but *"it's in Prior"* reads oddly. Better as a descriptor than a masterbrand. |
| **Priori** | *Priority* clipped, and an echo of *a priori*. Sounds premium and is highly ownable. | 27 | Ownable but abstract — it means "from what comes before", which most people will not parse. Fails the self-explaining brief. |
| **The Priority** | The definite article does real work: it restores the singular the plural destroyed. | 27 | The idea is right; as a wordmark, an article is dead weight. |
| ~~Prio~~ | Clipped form. | — | Rejected under §2.5 — abbreviation-style names read as startup shorthand. |

### 3.15.4 The observation that closes this family

**Primacy is already a Priority-family name.** It is the Latin abstract noun for the same idea — *the state of being first*. So exploring this territory returns to where the naming began, and the reason Primacy underperformed (§2.3) applies to almost every candidate here: **they are abstractions rather than things.** *Priority, Primacy, Priori, Precedence* all name a quality nobody can picture, which is the specific failure this whole exercise set out to correct.

*Singular* escapes it only partly, by carrying a story the others do not.

### 3.15.5 Recommendation

**Do not name it Priority.** It is likely unregistrable in its own class, unrankable in search, four syllables long, and it forfeits the very story that makes the word interesting — because a product called *Priority* in an era that says *priorities* is simply using the degraded word.

**Do take the story.** Put the etymology at the top of the landing page under whichever name wins:

> *For five hundred years, "priority" had no plural. It meant the one thing that came first. We only started saying "priorities" in the 1900s — and the word has meant nothing since.*
> *This is a tool for the singular.*

That paragraph does more marketing work than any name on any of these lists, and it costs nothing. **If the founder wants a name from this family regardless: Singular (31)** — it carries the story in the wordmark itself and is the only member of the family that is both ownable and comprehensible.

## 3.16 Integrating the model — can one name carry all of it?

The founder asked whether the **business model** and everything else discussed can be integrated into a single name. Seven ideas are now on the table:

| # | Idea | Source |
| :--- | :--- | :--- |
| 1 | Three things a day — the constraint | The method |
| 2 | Priority was singular for 500 years | §3.15 |
| 3 | Private, local, yours alone | Charter invariant 1 |
| 4 | **Pay once, own forever — never rented** | The model, §5.1 |
| 5 | **Free today, paid perspective — the archive compounds** | The model, §4 |
| 6 | Breathing room, steadiness, a day well spent | §3.12 |
| 7 | A physical instrument, not software | The design thesis |

### 3.16.1 The honest constraint

**A name carries one idea well, two at a stretch, and never seven.** Every attempt to load more produces either a phrase (*The Singular Priority Instrument*) or a coinage that carries nothing (*Primora*, *Solventa*). The failure mode is well documented in §2.5 and it is the reason Primacy underperformed: it tried to name a philosophy and ended up naming nothing you can picture.

So the question is not *which word holds all seven* — none does — but **which word holds the most, and how the rest get carried.**

### 3.16.2 The finalists, by ideas carried

| Name | 1 Three | 2 Singular | 3 Private | 4 Own | 5 Archive | 6 Benefit | 7 Physical | **Carried** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Quire** | – | – | – | ○ | ● | – | ● | **2½** |
| **Margin** | ○ | – | – | – | – | ● | ● | **2½** |
| **Codex** | – | – | ○ | ● | ● | – | ● | **3½** |
| **Trove** | – | – | ○ | ● | ● | ○ | – | **3** |
| **Crux** | ● | ● | – | – | – | ○ | – | **2½** |
| **Mainstay** | – | ○ | – | ○ | ● | ● | – | **3** |
| **Foremost** | ● | ● | – | – | – | – | – | **2** |
| **Singular** | ● | ● | – | – | – | – | – | **2** |

*● full, ○ partial*

**Codex carries the most.** A codex is the bound book that replaced the scroll — the first format you could *own, shelve, and return to*. It carries permanence, ownership, the archive that compounds, and the physical-object thesis in one word, and it is already in the codebase as `vol_codex`. What it does not carry is the method: nothing in it says *three*, or *decide*.

Its risks are real: fantasy-genre drift, and it is a moderately used software name.

### 3.16.3 The near-miss worth recording

**Keep** was the single best integrated candidate found anywhere in this exercise, and it is blocked.

- *to keep* — the exact idiomatic verb for this practice ("keep a journal")
- *a keep* — the innermost stronghold of a castle, where what matters is secured **(privacy, sovereignty)**
- *for keeps* — permanently, one payment, forever **(the model)**
- *keeping* — maintaining a daily practice **(the habit)**
- noun and verb at once, one syllable, perfect locative: *"it's in Keep"*

It carries five of the seven ideas. **Google Keep makes it commercially unusable** — recorded so it is not rediscovered and re-argued later.

### 3.16.4 The actual answer: integrate across three lines, not one word

The model does not belong in the wordmark. It belongs in the line under it. A **name + descriptor + price line** carries all seven ideas with none of them compromised, and every strong consumer product is built this way:

> ### Margin
> **Three things a day, yours alone.**
> *$39 once. Never a subscription.*

Seven ideas, three lines, twelve words:

| Line | Carries |
| :--- | :--- |
| **Margin** | 6 (breathing room), 7 (the page) |
| *Three things a day* | 1 (the constraint), 2 (the singular, by implication) |
| *yours alone* | 3 (private, local) |
| *$39 once. Never a subscription.* | 4 (own forever), and 5 by contrast |

Substitute any finalist and the structure holds — **Codex · Three things a day, yours alone · $39 once** works identically. That is the point: the name is one element of a system, not the system.

### 3.16.5 Recommendation

**Stop searching for the total name. It does not exist, and looking for it is what produced Primacy.**

Choose the name on the single idea most worth owning, then let the two lines beneath it carry the rest:

| If the one idea should be… | Name |
| :--- | :--- |
| **What the user gets** | **Margin** — and it carries the physical page for free |
| **What the product does** | **Crux** — sharpest statement of the method |
| **What you own forever** | **Codex** — carries the most of the model, weakest on method |
| **What it is like** | **Quire** — best wordmark, needs marketing |

**Standing recommendation unchanged: Margin**, on the grounds that the benefit lane has the best commercial record (§3.11) and Margin is the only candidate that earns a second meaning for free. The model is carried by the price line, where it has always belonged — *"$39 once. Never a subscription."* is a stronger statement of the model than any word could be, because it is a **number and a promise** rather than a metaphor.

## 3.17 A fresh field — five territories not previously mined

The earlier lists recirculated a narrow shortlist. These are new territories, worked properly.

### Territory A — Judgment and assay: *"test everything against this"*

The act the product performs is not writing. It is **testing what deserves the day.** Metallurgy and measurement give English an unusually rich vocabulary for exactly that.

| Name | What it says |
| :--- | :--- |
| **Touchstone** | A stone used to test the purity of gold — and, figuratively, **the standard against which everything is judged.** Almost a definition of what a priority list is. |
| **Measure** | *Take the measure of* (judge), *measured* (calm, deliberate), *in good measure* (enough, not more). Three senses, all of them the product. |
| **Weigh** | Weigh what matters. Physical scales, one syllable, unmistakably a decision. |
| **Assay** | To test a metal's purity before trusting it. Precise, unusual, highly ownable — and obscure enough to need explaining once. |
| **Gauge** | A precision instrument that tells you where you stand. |

### Territory B — Orientation: *"you know which way you are facing"*

| Name | What it says |
| :--- | :--- |
| **Bearing** | *Get your bearings* (orientation) — and **bearing** as in how a person carries themselves, which is precisely the executive register. A compass direction and a quality of character in one word. |
| **Lodestar** | The star you steer by. The fixed thing you navigate against when everything else moves. |
| **Heading** | A direction of travel **and** a heading in a document. Two meanings that both live inside this product. |
| **Footing** | *Get your footing.* Recovery and steadiness, in plain words. |

### Territory C — Steadiness: *"you stop being thrown around"*

| Name | What it says |
| :--- | :--- |
| **Ballast** | The weight low in a ship's hold that keeps it upright in rough water. Not cargo, not decoration — **the thing that makes the vessel stable enough to carry anything at all.** |
| **Pillar** | What holds the day up. Three pillars, three priorities. |
| **Bedrock** | What everything rests on. Solid but slightly inert. |

### Territory D — Rhythm and the daily office

A **Book of Hours** was the most widely owned book of the late medieval period: a personal, private, daily devotional volume, individually made, kept for a lifetime. It is the closest historical ancestor this product has, and it has been sitting unexamined.

| Name | What it says |
| :--- | :--- |
| **Cadence** | The rhythm of a practice — and already the product's own governing design principle (the 24px cadence). |
| **Hours** | From the Book of Hours. A private daily volume, kept for life. Quiet and deep. |
| **Compline** | The final prayer of the day — the historical closure ritual, which this product already has. |
| **Tempo** | The pace you keep. Warm, simple, slightly generic. |

### Territory E — Small measures: *"a little, deliberately"*

| Name | What it says |
| :--- | :--- |
| **Dram** | A small measure, poured deliberately. Warm, tactile, Scottish-inflected. |
| **Scruple** | A tiny unit of weight **and** a moral hesitation — the pause before committing. |
| **Ounce** | *An ounce of prevention.* Plain and physical. |

## 3.18 Scored — the fresh field

| Name | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | Self-exp. | **Total** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Ballast** | 5 | 3 | 5 | 5 | 5 | 3 | 5 | 3 | **34** |
| **Lodestar** | 4 | 3 | 4 | 5 | 5 | 3 | 5 | 4 | **33** |
| **Bearing** | 3 | 3 | 5 | 4 | 5 | 3 | 5 | 4 | **32** |
| **Touchstone** | 4 | 2 | 5 | 4 | 5 | 3 | 5 | 4 | **32** |
| **Measure** | 3 | 3 | 5 | 3 | 5 | 3 | 5 | 4 | **31** |
| **Heading** | 3 | 3 | 5 | 3 | 5 | 3 | 5 | 4 | **31** |
| **Weigh** | 3 | 5 | 4 | 3 | 4 | 2 | 5 | 4 | **30** |
| **Hours** | 3 | 4 | 5 | 2 | 4 | 3 | 5 | 3 | **29** |
| **Cadence** | 2 | 3 | 5 | 3 | 5 | 3 | 5 | 3 | **29** |
| **Dram** | 4 | 5 | 4 | 4 | 3 | 3 | 4 | 2 | **29** |
| **Assay** | 3 | 4 | 3 | 5 | 4 | 3 | 4 | 2 | **28** |
| **Pillar** | 4 | 3 | 5 | 2 | 4 | 3 | 5 | 3 | **29** |

## 3.19 The three worth taking seriously

**Ballast (34)** — ties Crux for the highest score in the entire exercise, and it is the most *concrete* name yet proposed: a physical object with a single unmistakable job. Ballast is what makes a ship stable enough to carry a cargo at all — which is exactly the claim this product makes about a daily practice. It is highly ownable, ages perfectly, and the metaphor survives explanation.

> **One real risk, and it must be weighed.** *Ballast* has a second, negative colloquial sense — dead weight, something carried uselessly. "Just ballast" is an insult. The nautical reading is the dominant one and the product context reinforces it, but this is exactly what §2.8's phone test exists to catch. **Test it on strangers before committing.**

**Lodestar (33)** — the fixed point you navigate by when everything else is moving. Very ownable, genuinely beautiful, and it flatters the user rather than instructing them. Slightly grander than the product's understated register, and a compound where the field's winners are single syllables.

**Bearing (32)** — the quiet, sophisticated choice. It is the only name found anywhere in this exercise that means **both a direction and a quality of character**, which is precisely the double the product wants: it helps you know where you are going, and it is for people whose bearing matters. Understated where Lodestar is grand, and it takes the descriptor cleanly: *Bearing — three things a day, yours alone.*

## 3.20 Running leaderboard, all lanes

| | Name | Lane | Score |
| :--- | :--- | :--- | :---: |
| 1= | **Quire** | Brand | 35 |
| 2= | **Ballast** | Steadiness | **34** |
| 2= | **Crux** | Purpose | 34 |
| 4= | **Lodestar** | Orientation | **33** |
| 4= | **Margin** | Benefit | 33 |
| 4= | **Clearing** | Benefit | 33 |
| 7= | **Bearing** | Orientation | **32** |
| 7= | **Touchstone** | Judgment | **32** |
| 7= | **Utmost** | Purpose | 32 |
| 10= | **Foremost** | Purpose | 31 |
| — | *Primacy* | *incumbent* | *19* |

Nothing here is cleared, and §2.9's timing rule still governs: **the window closes at the first sale.**

## 3.21 The role lane — naming the person, not the object

The founder asked a different question: **what do you call the person who helps you prioritise?** One who hands you a framework, watches you write in the instrument, and sees you finish. And separately — what do you call someone who has completed what they set out to do?

This is a sixth lane, and a productive one. Software has a long tradition of it: Copilot, Alfred, Butler, Otto, Jarvis, Ada.

### 3.21.1 The direct answer

**English has one word that fits almost exactly: *marshal*.**

A marshal is the officer who **puts things in their proper order** — and, uniquely among the candidates, the word is *also the verb for the act itself*: **to marshal** is to arrange in order, to gather and array for a purpose. *Marshal your thoughts. Marshal your resources.* The person and the action share a word, which is rare and valuable.

For the second question — one who has completed what they set out to do — the best single word is **adept**: one who has attained mastery. Not "finisher" (mechanical), not "achiever" (corporate), not "victor" (combative). *Adept* implies the task is done **and** that doing it has changed you, which is what a daily practice actually claims.

### 3.21.2 The field

| Name | The role |
| :--- | :--- |
| **Marshal** | The officer who puts things in proper order. Person *and* verb. |
| **Steward** | One entrusted with another's affairs, who manages them with care. *Stewardship of your own hours* is a genuinely fine framing for a private journal. |
| **Reeve** | Old English — an overseer, the official who administers on behalf of another. Five letters, one syllable, extremely ownable. |
| **Adjutant** | The aide to a commanding officer: keeps the schedule, holds the priorities, never commands. Precisely the product's relationship to its user. |
| **Preceptor** | Literally *one who gives precepts* — i.e. one who hands you a framework. The most literal fit on the list. |
| **Curator** | One who decides what is shown and what stays in storage. Selection as the whole job. From *curare*, to care for. |
| **Seneschal** | The steward of a great house. Beautiful, highly ownable, obscure. |
| **Arbiter** | One who decides. Cool and final. |
| **Adept** | One who has mastered the practice — the *user*, not the helper. |

### 3.21.3 Scored

| Name | Concrete | Short | Sayable | Ownable | Resonant | Loc. | Ageless | Self-exp. | **Total** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Marshal** | 4 | 3 | 5 | 3 | 5 | 3 | 5 | 4 | **32** |
| **Steward** | 4 | 3 | 5 | 3 | 5 | 3 | 5 | 4 | **32** |
| **Adept** | 3 | 4 | 5 | 4 | 4 | 3 | 5 | 3 | **31** |
| **Reeve** | 3 | 5 | 4 | 5 | 4 | 3 | 4 | 2 | **30** |
| **Curator** | 4 | 2 | 5 | 2 | 4 | 3 | 4 | 4 | **28** |
| **Adjutant** | 4 | 2 | 4 | 4 | 4 | 3 | 4 | 3 | **28** |
| **Preceptor** | 3 | 2 | 4 | 4 | 5 | 3 | 4 | 3 | **28** |
| **Seneschal** | 3 | 2 | 3 | 5 | 4 | 3 | 4 | 2 | **26** |

### 3.21.4 The risk that governs this entire lane

**A product named after a helper-person reads, in 2026, as an AI assistant.**

*Marshal*, *Steward*, *Curator* and *Adjutant* all promise something that answers, suggests, and acts on your behalf. This product does none of that: it has no AI, no cloud, no suggestions, no agent. It is deliberately **an instrument, not an assistant** — the entire thesis is that *software does not execute; the human executes.*

Naming it for a person therefore sets an expectation the product will immediately break, and breaking it in the first thirty seconds is expensive. This is not a small caveat; it is the reason to be careful with the whole lane.

**Two ways through it:**

1. **Pick a role word old enough not to trigger the frame.** *Reeve* and *Seneschal* read as archaic offices rather than software agents. *Reeve* in particular — one syllable, five letters, highly ownable, and nobody will expect it to talk to them.
2. **Give the role to the user, not the software.** This is the stronger move. *Adept* names **who you become by using it**, which is flattering, accurate, and impossible to mistake for a chatbot. It also aligns with the benefit lane, which has the best commercial record (§3.11).

### 3.21.5 Recommendation for this lane

- **The honest answer to the question asked: *Marshal*** — the one word in English that names both the person who orders your priorities and the act of ordering them.
- **The best name from this lane: *Reeve*** (30) if you want the role, because it carries the meaning without promising an assistant.
- **The better idea inside this lane: *Adept*** (31) — name the user, not the helper. The product does not prioritise for you; it is the instrument by which *you* become the person who does.

Against the running leaderboard (§3.20) none of these overtake Quire (35), Ballast (34) or Crux (34). The lane's real contribution is the reframe: **this product has no helper in it, and the name should not imply one.**

---

# Part 4 — The naming brief, properly derived

> September 9, 2026. The founder reported that none of the earlier lists were landing. **Diagnosis: sixty-plus names had been generated across eight lanes with no brief.** A name is not chosen by scoring; it is chosen by elimination against a brief, and no brief existed. Parts 2 and 3 are therefore raw material, not a process. This part is the process.

## 4.1 The brief, from the founder's answers

| Dimension | Decision | Consequence for generation |
| :--- | :--- | :--- |
| **Scope** | **Product only.** Company named separately later. | The name may be specific and evocative. It never has to shelter a second product. |
| **Language** | **Both English and Sanskrit.** | Sanskrit opens words English does not have — and the home market reads them natively. |
| **Register** | **Sharp, decisive, clear-headed.** | Not the calm/relief lane. Not the heirloom-object lane. Edge over warmth. |
| **Lane** | **Method** — what the product *does*. | Closes the brand, benefit, steadiness and role lanes. Quire, Margin, Ballast, Marshal are all out. |
| **Sound** | **Meaning decides**, no shape filter. | One syllable and two both permitted. |
| **The enemy** | **All four** — volume, busywork, drift, and software bloat. | The single act that defeats all four is **discernment**. That is the semantic core. |
| **Learning curve** | **A name needing one explanation is acceptable** if it is more ownable and precise. | **This is the unlock.** It admits the precise, distinctive words and excludes nothing but obscurity for its own sake. |
| **Moment** | **Morning — the act of choosing.** | The name is about *deciding*, not about the finished day. Adept, Wellspent, Settled are out. |

**The brief in one sentence:**

> *A sharp, product-specific name for the act of discerning what deserves the day — English or Sanskrit, precision preferred over familiarity, and it may cost one line of explanation.*

## 4.2 Generated against the brief — English

| Name | The one-line explanation | Fit |
| :--- | :--- | :--- |
| **Crux** | The decisive point on which everything turns. | Sharp, one syllable, the lane's existing leader at 34. |
| **Triage** | Sorting by what must be dealt with first, when you cannot do everything. | The most exact description of the act in English. *"Triage your day"* is already a phrase people use, so it needs no explanation at all. |
| **Pith** | The essential core, once the rest is stripped away. | One syllable, hard consonants, highly ownable. |
| **Winnow** | To separate the grain from the chaff. | The purest discernment verb English has. Softer sound than the rest. |
| **Pare** | To cut away everything that is not the thing. | Precise and sharp. Homophone with *pair* and *pear* — a permanent phone-test tax. |
| **Whet** | To sharpen a blade before you use it. | Morning preparation, very ownable — but a near-homophone of *wet*, which fails the phone test badly. |

## 4.3 Generated against the brief — Sanskrit

| Name | The one-line explanation | Fit |
| :--- | :--- | :--- |
| **Viveka** | The faculty of telling the essential from the inessential. | **The exact philosophical term for what this product does.** In Vedanta, *viveka* is the *first* qualification — the discernment that must precede everything else. Morning, choosing, discernment, all three at once. |
| **Krama** | The order in which things proceed; sequence, method. | Sharp opening K, two syllables, very ownable, globally sayable. |
| **Sankalpa** | The resolve formed at the beginning of a practice. | Perfect for the morning moment. Three syllables is long for a sharp register. |
| **Buddhi** | The determinative faculty — the part of the mind that decides. | Precise and beautiful; confusable with *Buddha*, which will mislead. |
| **Bindu** | The concentrated point; where everything converges. | Easy to say, warm, slightly soft for the register. |
| **Nitya** | That which is done daily, and that which is eternal. | A lovely double for a daily practice, but it names the cadence, not the choosing. |

## 4.4 The three tests applied

**Say it.** *Viveka* and *Krama* survive a phone call; a non-Indian will need one repetition of *Viveka* and no more. *Crux* and *Triage* pass instantly. **Whet and Pare fail** — homophones with common words. Cut.

**Own it.** *Viveka*, *Krama*, *Pith* are highly distinctive and searchable. *Crux* has moderate collisions. **Triage is the weakest** — enormous generic medical volume, and likely descriptive in its own class.

**Live with it.** *Triage* implies your life is an emergency; a product that tells an executive their day is a casualty ward is making a claim about them, every morning, for years. **That is the reason to reject it despite the perfect fit of meaning.** *Pith* carries the discarded bitter part of a fruit as a secondary sense. *Viveka* and *Crux* carry nothing negative.

## 4.5 The shortlist — three, and why

**1. Viveka** — the strongest name produced in this entire exercise. It is the precise word, in a language that has one, for the exact faculty the product exists to exercise. It is ownable, globally pronounceable, native to the beachhead market, and its explanation is a sentence anyone would want to repeat: *"Viveka is the Sanskrit word for the faculty of telling what matters from what doesn't."* That sentence is also a complete product pitch. **Caution: *Vivek* is a very common Indian given name.** The *-a* ending distances it toward the abstract noun, but this must be tested with Indian users specifically.

**2. Crux** — the strongest English candidate, and the incumbent leader of the method lane at 34. Sharp, one syllable, needs no explanation, ages perfectly. Less distinctive than Viveka and with more collisions, but it carries zero risk and zero learning curve.

**3. Krama** — the sleeper. Sharp opening consonant, two clean syllables, no given-name collision, and it means *the order in which things proceed* — which is both the method and the daily cadence. Less semantically perfect than Viveka, materially more ownable.

**Cut, with reasons recorded:** Triage (implies emergency), Pith (negative secondary sense), Pare and Whet (homophones), Sankalpa (too long for the register), Buddhi (confusable), Bindu and Nitya (too soft; name the cadence, not the choice).

## 4.6 The ikigai question — borrowed concept-words for prioritisation

The founder asked whether a management concept exists, like *ikigai*, built on the same principle of prioritisation. There are several, and two of them are strong names.

**Why this matters as a naming strategy:** *ikigai* is the proof that a borrowed philosophical term can become a globally understood, commercially usable word. It arrived with a built-in explanation, a diagram, and a story — which is exactly the "one line of explanation" the founder has already accepted (§4.1).

### The concepts

| Concept | Origin | What it means | As a name |
| :--- | :--- | :--- | :--- |
| **Kanso** | Japanese Zen — one of the seven aesthetic principles | **Simplicity achieved by eliminating the non-essential.** Not minimalism as style; clarity as the *result of removal*. | **Excellent.** Two syllables, sharp opening K, clean in every language, and far less commercially worn than *ikigai* or *kaizen*. |
| **Hoshin** | Japanese — from *Hoshin Kanri*, the Lean strategic method | **Compass needle.** The method exists to focus an organisation on *the vital few* objectives and refuse the rest. | **Strong.** Two syllables, and the literal meaning — a needle pointing one way — is the product in a word. Semi-known inside Lean consulting. |
| **Viveka** | Sanskrit — Vedanta | The faculty of telling the essential from the inessential; in Vedanta the *first* qualification, preceding all else. | Already §4.5's leader. This question reinforces it. |
| **Svadharma** | Sanskrit — Bhagavad Gita | **Your own proper work**, as opposed to someone else's. *"Better to do your own dharma imperfectly than another's perfectly."* The closest Indian cousin to ikigai, and a prioritisation principle in its own right. | Four syllables — too long, but a superb idea for the landing page. |
| **Kairos** | Greek | The **opportune moment** to act, as against *chronos*, clock time. Prioritising *when*, not just *what*. | Good, but widely used as a brand already. |
| **Seiri** | Japanese — the first S of 5S | **Sorting**: separate the necessary from the unnecessary and remove the unnecessary. | **Cut — it is a near-homophone of Siri.** Fatal. |
| **Aparigraha** | Sanskrit — Yoga Sutras | Non-grasping; taking only what you need. Prioritisation as restraint. | Too long, but a good principle to cite. |
| **The Vital Few** | Joseph Juran, from Pareto | *"The vital few and the trivial many."* The Western management ancestor of all of this. | Already assessed in §3.3. |

### The two worth adding to the shortlist

**Kanso** — the best new candidate this question produced. *Simplicity through elimination* is precisely the product's thesis, the word is short and sharp and pronounceable everywhere, and it is nowhere near as commercially exhausted as its famous Japanese cousins. It fits the brief on every dimension: sharp register, method lane, one line of explanation, highly ownable.

**Hoshin** — a compass needle. It carries direction and the deliberate refusal of everything off-bearing, and it comes with a genuine management pedigree that an executive audience will recognise as substance rather than decoration.

### One caution, and it is not small

Borrowing a living philosophical term for a commercial product **invites justified criticism when done shallowly.** *Ikigai* is the cautionary case: the Venn diagram the West knows is not the Japanese concept at all, and the flattening is well documented and widely resented.

If Viveka, Kanso or Hoshin is chosen, the obligation is to **represent it accurately** — a true one-line definition, correct provenance, no invented diagram, no claim that the product *is* the concept. Used with that discipline the borrowing is a genuine act of respect and a strong story. Used carelessly it is the single most reputationally expensive mistake available in this whole naming exercise.

---

# Part 5 — Kanso: the concept, the collision, and the Western equivalents

> September 9, 2026. The founder selected **Kanso**, then asked for a full explanation and a legal check. The search test (§2.8, test 3) was run and **returned a material problem.**

## 5.1 What Kanso actually is

**Kanso (簡素)** is one of the **seven principles of Japanese aesthetics** named by the philosopher **Hisamatsu Shin'ichi** in *Zen and the Fine Arts*. The others include *shizen* (naturalness), *shibumi* (understated elegance), *yugen* (subtle profundity), *fukinsei* (asymmetry), *datsuzoku* (freedom from convention) and *seijaku* (stillness).

**Its meaning is simplicity reached by subtraction — never by decoration.**

- Kanso is **not minimalism as a style.** It is a *way of thinking*: strip away the unnecessary until the essence is revealed.
- The governing rule: **every element must serve a genuine purpose or be removed.**
- The stated ideal: **maximum effect through minimum means.**
- What remains should feel *clear, purposeful and honest* — and a kanso space can be plain, worn and warm at once. It is restraint, not sterility.
- Beauty arrives **through elimination**, through subtraction rather than addition.

Read against this product: three priorities instead of two hundred, a viewport that refuses to scroll, no cloud, no account, no AI. The word describes the design philosophy the codebase already enforces through its 21 gates. The fit is genuine — the meaning is *more* apt than was claimed when it was recommended.

## 5.2 The legal problem — and it is material

| Entity | What it does | Why it matters |
| :--- | :--- | :--- |
| **Kanso Software** (Denver, founded 2012) | Housing management software for property managers | **Primary industry listed as Business/Productivity Software**, and a trademark application is filed for **KANSO SOFTWARE**. |
| **Kanso** | Software design and engineering studio | Active use of the bare word in software. |
| **Kanso Code** (founded 2019) | B2B SaaS development | Third active user in the sector. |

**Assessment — not legal advice; a professional search is still required.**

Trademark conflict turns on likelihood of confusion between *goods and services*, not the word alone. Housing-management software for property managers is a genuinely different market from a personal journaling instrument — that argument exists and is not weak. But the industry classification is **Business/Productivity Software**, a trademark application is already on file, and **three** parties use the name in software rather than one. Which means:

1. You would be **fourth** into a crowded name in your own sector.
2. Search would be permanently contested — you would compete with an established B2B vendor for your own name, defeating the ownability the brief asked for.
3. Registration may be obtainable but **narrow and contested**, and a narrow mark is a weak asset.

**Recommendation: do not proceed with Kanso without counsel, and expect counsel to advise against it.**

Softer point: *kanso* is a common Japanese word and an established aesthetic term. Common descriptive terms are hard for anyone to monopolise — harder for others to stop you, harder for you to own.

## 5.3 Western equivalents — the concepts

| Concept | Origin | What it says |
| :--- | :--- | :--- |
| **Occam's Razor** | William of Ockham, 14th c. | *Entia non sunt multiplicanda praeter necessitatem* — do not multiply entities beyond necessity. **The foundational Western principle of subtraction**, and the direct cousin of kanso. |
| **Via Negativa** | Theology; revived by Nassim Taleb | Improvement **by removal** — subtraction is more reliable than addition. |
| **Lagom** | Swedish | *Just the right amount — not too much, not too little.* The closest thing the West has to a Japanese-style aesthetic word. |
| **Parsimony** | Scientific method | Prefer the explanation requiring fewest assumptions. *Parsimonious* carries a stingy connotation. |
| **Essentialism** | Greg McKeown, 2014 | *The disciplined pursuit of less* — and the source of the priority-etymology fact in §3.15. |
| **The Vital Few** | Juran, from Pareto | *The vital few and the trivial many.* |
| **The Hedgehog Concept** | Jim Collins | The one thing you can be best at. |
| **Theory of Constraints** | Goldratt | The bottleneck governs; everything off it is a distraction. |

## 5.4 Western equivalents as names — and their collisions

**Occam was the obvious candidate, and the search test disqualifies it too:**

| Entity | Field |
| :--- | :--- |
| **Occam Systems** | Explicitly **Business/Productivity Software** |
| **Occam Software Ltd.** (UK) | Enterprise data unification |
| **Occam Technologies** | Software development agency |
| **Occam's Ops** | Business management + AI/ML, trademarks filed 2024–25 |
| **ALPHAROC INC.** | **OCCAM trademark filed October 2022**, AI/ML SaaS |
| **occam** | A programming language (Inmos) |

Five companies, two live filings, and a programming language. **Occam is more crowded than Kanso, not less.** Cut.

**Lagom** survives untested — Swedish, two syllables, globally sayable, meaning *exactly the right amount*. Softer than the sharp register the brief specified.

## 5.5 The lesson, and what to do

**Two searches, two disqualifications, both for the same reason.** *Kanso* and *Occam* are each the well-known name of a principle — which is exactly why they appealed, and exactly why other software companies got there first.

> **A famous principle is a crowded name by definition. The more perfectly a word names the idea, the more likely someone already used it.**

Three ways forward:

1. **Keep the concept, change the word.** Kanso stays as the *stated design philosophy* — landing page, About, design system, quoted properly with attribution to Hisamatsu Shin'ichi. It does the storytelling without the trademark risk. The name comes from §4.5's survivors: **Viveka** or **Krama**, neither of which returned a software collision.
2. **Test Lagom**, if Western framing matters more than the sharp register.
3. **Return to Crux**, accepting lower distinctiveness — though *crux* is likewise a common word and must be searched before assuming it is safer.

**Standing recommendation: option 1 — Viveka as the name, Kanso as the philosophy.** The product gets the story, the word, and the defensibility, without borrowing a mark three other software companies already use.

## 5.6 World philosophies parallel to kanso

The founder asked whether other traditions hold a concept like kanso. They nearly all do — subtraction-as-method is one of the most universally rediscovered ideas in human thought.

| Tradition | Term | What it says |
| :--- | :--- | :--- |
| **Taoist** | **為道日損** *wei dao ri sun* — "to practise the Way is to daily decrease" | *Tao Te Ching* ch. 48: **"In the pursuit of learning, every day something is acquired. In the pursuit of the Tao, every day something is dropped."** Kanso stated 2,500 years earlier — and stated as a **daily** practice. |
| **Taoist** | **Pu** (樸), the uncarved block | Simplicity in its original, unworked state. Also **jian** (儉), restraint — one of Laozi's three treasures. |
| **Indian** | **Neti neti** (नेति नेति), "not this, not this" | The Upanishadic method of reaching truth by **negating everything it is not**. The most rigorous version of the idea anywhere. Related: *vairagya*, *aparigraha*, *ekagrata* (one-pointedness). |
| **Jewish** | **Tzimtzum** | God **contracts and withdraws** to make space for creation. Creation by withdrawal, not addition — *you make room by removing yourself*. |
| **Greek** | **Aphairesis** | Plotinus: **ἄφελε πάντα, "take away everything."** Abstraction by removal as a formal method. |
| **Greek** | **Sophrosyne** | One of the four cardinal virtues: temperance, restraint, soundness of mind. Restraint as a *virtue*, not a tactic. |
| **Christian mystical** | **Kenosis**; **Gelassenheit**; **via negativa** | Self-emptying; Meister Eckhart's *releasement* (later Heidegger, and the core Amish value); knowing a thing by stripping away all it is not. |
| **Sufi** | **Tajrid** | "Stripping away" — divesting all but the essential. With *zuhd* (detachment) and *faqr* (poverty as sufficiency). |
| **Scandinavian** | **Lagom** | Just the right amount. The only cheerful entry on the list. |
| **Western modern** | **Occam's Razor**; **via negativa** (Taleb) | Do not multiply entities beyond necessity; subtraction is more reliable than addition. |

**The three that are genuinely the same thought as kanso: *neti neti*, *tzimtzum*, *aphairesis*.** Each says the thing is revealed by removing what it is not — kanso says it of beauty, these say it of truth, creation and knowledge.

**The one that matters most for this product: Laozi ch. 48.** It is about a *daily* practice of dropping things, and **the product already quotes Lao Tzu in the evening reflection**. The philosophical spine is therefore already inside the app and needs only to be made explicit.

**As names, almost all are unusable** — too long (*Gelassenheit*, *sophrosyne*, *aphairesis*), too hard to spell (*tzimtzum*, *tajrid*), or badly collided (**neti** → the neti pot, a poor association for a premium instrument). **Lagom** is the only name-shaped entry, and it is softer than the sharp register the brief specified.

**Conclusion: this search found the product's philosophy, not its name.** The available material — kanso, Laozi's daily decrease, neti neti, tzimtzum — is unusually rich and belongs in the About page, the design system and the launch story. It is not the wordmark.

---

# Part 6 — The Casio brief, and a corrected survivor list

> September 9, 2026. The founder named the **Casio F-91W** as the brand model. This changes the naming target, and a verification round killed one of the agency round's survivors. Full record in `DECISION_LOG.md` §1.43; the brand model itself is `VISION.md` §12.

## 6.1 The brief changed: stop looking for a beautiful word

The request was *"a name that can make it really beautiful."* The Casio framing argues against it, and the argument is the strongest one this exercise has produced.

**The F-91W's name is a part number.** All of its beauty is carried by the object and its behaviour — unchanged since 1989, no feature ever added, cheap and unembarrassed about it, assumed rather than aspired to. Nobody minds that it is called F-91W.

Set against this exercise's own record: **nineteen-plus candidates searched, nearly all lost, and every one lost because it was a *good word*.** Good words in the "decisive / essential / clear / premium" field are gone precisely because they are good — §5.5 stated this as a rule and three independent agencies confirmed the field is saturated (§1.42). **Asking for a more beautiful name is asking for a more contested one.**

**The revised target: a plain, unglamorous, uncontested word, and let the object carry the beauty.**

## 6.2 The structural finding — where the open ground actually is

**The paper register is picked clean. The mechanism register is nearly empty.**

Occupied: Foolscap, Deckle, Quire, Longhand, Daybook, Recto, Docket. Everyone building a journal app reaches for paper words, so the paper words went first. **Nobody reaches for machine parts** — and machine parts are exactly the Casio register: plain, functional, named for what they do.

## 6.3 Six searched, one survivor

| Name | Register | Verdict |
| :--- | :--- | :--- |
| **Foolscap** | paper | **Dead.** `foolscap.app` — a live *"quiet writing app… no AI, no tracking… like a sheet of paper."* This product's positioning almost verbatim. **Passed as clean by the agency round; it is not.** |
| **Docket** | plain/legal | **Dead.** Two task apps carrying the bare word, plus an entire legal-docketing software category. |
| **Chit** | paper/Indian | **Dead**, and worse in India — *chit* means chit-fund software, a whole ERP sector. |
| **Recto** | paper/printing | **Contested.** `rectoapp.com` is a live SEO tool on a lifetime-deal model. Different category, bare word, `.com` gone. |
| **Escapement** | mechanism | **Contested.** `escapement.app` and `escapement.watch` both taken by horology tools. The category differs; the domain does not exist to be had. |
| **Detent** | mechanism | **Lightest collision found in the entire exercise.** One iOS fidget-wheel toy. No productivity occupant, no filing surfaced. |

## 6.4 Detent, assessed honestly

A **detent** is the mechanical catch that holds a position until it is deliberately released — the click in a camera dial, the notch in an indicator stalk. Everyone has felt one; almost nobody knows the word.

**Why it fits.** It is the enforcement layer named exactly: *#2 will not open until #1 is closed; three lines and no fourth* (§10.4, R6). It is a part name — plain, engineering, unpretentious — which is the Casio register precisely. It is concrete, six letters, two syllables, and it ages perfectly because machine parts do not date.

**The flaw, stated rather than sold past.** Stress is ambiguous — DEE-tent or dih-TENT — and ***détente* sits close in the ear.** This is the failure mode that killed **Chronometer** in §1.42, where the finding was that *the collision is in the ear, not the spelling, which is worse for word-of-mouth.* Self-explanation scores near zero.

**Standing: strongest candidate, not yet recommended.** The phone test (§2.8) decides it — *"I keep my priorities in Detent"*, said aloud to five strangers, and watch whether anyone writes it down wrong.

## 6.5 The generalisable lesson from the Foolscap correction

The agency round's discipline — generate and search in the same head — was sound, and §1.42 recorded that it caught two false positives that a single agency would have missed. **It did not catch Foolscap, and Foolscap's occupant is a direct positional competitor.**

> **A clean search result decays.** The agencies searched at generation time; nothing has been re-verified since. **Re-search every surviving candidate immediately before committing to it, not once at generation.** One confirmed false positive is enough to distrust the whole list.

Every remaining §1.42 survivor — **Shears/Shear, Nagi, Decidere, Verdict, Fude, Chop, Thirty-Nine** — is now unverified and must be re-searched before use.

## 6.6 Unchanged

§2.9's timing rule still governs: **the window closes at the first sale.** Nothing here is a clearance search — professional clearance in Classes 9 and 42 remains outstanding (N5).
