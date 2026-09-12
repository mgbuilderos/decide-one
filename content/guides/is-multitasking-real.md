---
title: Is multitasking real?
description: A processor with one core does not multitask; it switches fast enough to look like it. What that does and does not tell you about a person doing four things.
slug: is-multitasking-real
intent: is multitasking real
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: the-cost-of-switching-tasks, top-3-method, how-to-prioritise-tasks
keywords: is multitasking real, multitasking myth, can you multitask, doing two things at once
---

## The short answer

In the system where the question has a precise answer — a computer — the answer is no, and it is not a matter of opinion.

A single processor core runs one instruction stream. It creates the appearance of running several by switching between them quickly: saving the state of one, loading another, running it for a slice, and repeating. **Concurrency at that level is an illusion produced by rapid switching**, and the switching is not free.

That is a fact about processors. What it means for a person is an analogy — a well-founded one, because the structure genuinely corresponds, but an analogy, and this page will not dress it as a study of human attention.

{{diagram:context-switch}}

## What the analogy does support

The correspondence is specific rather than vague, which is what makes it worth anything.

**There is state, and it has to be reloaded.** A processor saves registers and reloads caches. A person coming back to a piece of work rebuilds what was pending, what was already ruled out, and why the obvious approach did not work. Neither is free, and in both cases the cost is paid on *resuming* rather than on *doing* — which is why it never appears as a task on any list.

**The cost is per switch, not per hour.** Two hours in one block and two hours in four blocks are not the same amount of work done, and the difference is the reloads.

**Past a certain load it dominates.** When what is actively needed exceeds what can be held, a system spends nearly all its time swapping and useful output collapses. The name is **thrashing**, and it describes a day that was fully busy and produced almost nothing. Crucially it is a **capacity fact** — a machine in that state is not badly motivated, it is over capacity.

## What the analogy does not support

**It does not say a person is a computer.** People do genuinely parallel things — walking while talking, listening while writing — and the model says nothing useful about those. The correspondence holds for work that requires holding a problem in mind, and that is the only place it should be applied.

**It does not give you a number.** No percentage of productivity lost, no minutes to refocus. Figures like that circulate widely and are usually traced back to a source that did not say what the figure claims. If someone quotes you an exact cost of switching, the right question is where it came from.

**It is not evidence about attention.** Nothing on this page is a psychological finding, and the honest version of the claim is the modest one: switching has a real cost, that cost is paid in reloading rather than in doing, and beyond some load it dominates.

## So what should you actually do

**Stop counting things you are "working on" and start counting things that are open.** Open means started and unfinished. That number is what drives the reload cost, and it is usually higher than people think because things stop feeling active without being closed.

**Protect blocks rather than hours.** The same total time in fewer pieces produces more finished work, and that is the single highest-leverage scheduling change most people can make.

**Cap concurrent work deliberately.** [Three is a practical figure](/methods/top-3-method/) — not because three is proven, but because a cap only works if it binds, and a number large enough to hold everything does not.

**Write down where you were before you stop.** Two lines: what was pending, what you had ruled out. This is the cheapest intervention available, because it converts an invisible reload into something readable.

## The one honest caveat

Some people really do handle interleaved work better than others, and dismissing that is as unfounded as overstating the cost. The claim worth making is not that switching is impossible — it plainly is not — but that it is never free, and that the price is paid somewhere that no list records.

[The longer version of the cost is here](/guides/the-cost-of-switching-tasks/).

## Where to go next

- [What switching tasks actually costs](/guides/the-cost-of-switching-tasks/) — the mechanism, and where it collapses
- [The Top 3 method](/methods/top-3-method/) — a deliberate cap on what is open
- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — choosing which method today needs

## Using this in Decide One

Decide One bounds the day and asks for a duration on each line, which is the smallest honest defence against a fragmented day: an estimate makes the switching visible afterwards, because you can compare what you planned against what happened.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
