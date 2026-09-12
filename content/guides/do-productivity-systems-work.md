---
title: Do productivity systems actually work?
description: Some of the mechanisms are sound and the claims made for them usually are not. How to tell which part of a system is doing work and which part is decoration.
slug: do-productivity-systems-work
intent: do productivity systems actually work
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: is-there-a-best-prioritisation-method, why-to-do-lists-stop-working, how-to-prioritise-tasks
keywords: do productivity systems work, productivity methods worth it, best productivity system, productivity advice
---

## The short answer

The mechanisms that work are small and old: **limit what is in progress**, **fix an order in advance**, and **give work a bounded amount of time**. Those three do something real, and they have a basis outside anyone's opinion.

Almost everything built on top of them is packaging. That is not automatically bad — packaging is how a mechanism gets remembered and used — but it is where the overclaiming lives, and it is what people mean when they say a system stopped working.

A system that stopped working usually kept the packaging and lost the mechanism.

{{diagram:convoy-effect}}

## What actually has a basis

**Limiting work in progress.** By Little's Law, average completion time is proportional to how many items are in the system at once. This is a theorem about queueing systems, not a finding about human cognition, and it names no particular number — but the direction is arithmetic rather than encouragement. [The full version, including what it does not license.](/guides/littles-law-for-a-working-day/)

**Deciding the order in advance.** Choosing what to do next is itself work, and it recurs between every pair of tasks. Fixing the sequence beforehand removes those decisions from the moment you are least able to make them well.

**Not running on arrival order.** A plain list runs first-in-first-out, which in scheduling terms is the discipline known to be bad for essentially every objective — its signature failure is the **convoy effect**, where one long item at the front delays everything short behind it. Any deliberate ordering beats it. [Why lists degrade.](/guides/why-to-do-lists-stop-working/)

**Bounding time.** A limit is what stops work expanding to fill whatever is available, and it produces a comparison afterwards between what you planned and what happened.

That is a short list, and it is genuinely most of it.

## What usually does not

**The claim that a system is universally best.** There is no universally optimal scheduler — the right ordering rule depends on the objective, and no discipline dominates across objectives. A system claiming to be correct for everyone has not stated which objective it optimises, which means it cannot be evaluated. [The formal version.](/guides/is-there-a-best-prioritisation-method/)

**Elaboration for its own sake.** Categories, contexts, tags, reviews of reviews. Each addition costs time in the planning surface rather than the work, and the ones that survive contact with a busy week are few. A system you maintain instead of using has inverted.

**Borrowed authority.** Claims that something is established by research, supported by brain imaging, or used by the highest performers in some field. These are almost never traceable to what they imply, and a method does not need them — Ivy Lee's order discipline works for a structural reason that can be stated plainly, and stating it plainly is more convincing than a study that does not exist.

**Promised automation.** Optimal scheduling for the interesting cases is **NP-hard**; no efficient algorithm finds the best answer. A tool promising to plan your day for you is applying a heuristic. That is fine — heuristics are what practitioners use — but the useful question is which heuristic, and most such tools will not say.

## Why systems stop working

**The condition changed and the method did not.** A method aimed at volume does nothing for a day whose problem is that nothing is moving, and vice versa. It feels like the method degraded. It did not; the day changed underneath it.

**The constraint got renegotiated.** Almost every working mechanism is a constraint — three and no fourth, this before that, stop at ninety minutes. Constraints erode quietly, one reasonable exception at a time, and what is left looks like the system but is no longer doing anything.

**The maintenance grew past the benefit.** When keeping the system current takes longer than the decisions it makes are worth, it will be abandoned. That is a correct response.

## How to evaluate one honestly

Three questions, applicable to anything including this site:

1. **What is the mechanism, in one sentence, without the brand name?** If it cannot be said plainly, there may not be one.
2. **What is it optimising for, and what does it starve?** Every ordering rule sacrifices something. One that admits what it sacrifices is more trustworthy than one that claims no cost.
3. **What happens on a bad week?** A system that only works when you are already on top of things is describing a state rather than producing one.

## The honest position

Yes, some of it works, and the parts that work are unglamorous and ancient. A limit, an order, a clock. Those three have been enough for a long time and they do not need a study to justify them, because the argument for them can be made out loud in a paragraph.

Anything claiming substantially more than that is selling the packaging.

## Where to go next

- [Is there a best prioritisation method?](/guides/is-there-a-best-prioritisation-method/) — why the answer is no, formally
- [Why to-do lists stop working](/guides/why-to-do-lists-stop-working/) — the default, and why it is the worst option
- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — three methods and the condition each answers

## Using this in Decide One

Decide One ships three methods and no more, each credited to where it came from, with the reasoning stated openly enough to argue with. It makes exactly one scientific claim anywhere, and it is about if-then planning rather than about the methods.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
