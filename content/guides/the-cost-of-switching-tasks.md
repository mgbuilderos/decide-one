---
title: What switching tasks actually costs
description: A processor does not multitask either; it switches fast and pays for it. The overhead has a name, a mechanism, and a point where throughput collapses.
slug: the-cost-of-switching-tasks
intent: how much does switching between tasks cost
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: ivy-lee-method, top-3-method, how-to-prioritise-tasks, is-multitasking-real, how-to-handle-interruptions
keywords: cost of task switching, context switching, multitasking cost, stop switching between tasks
---

## The short answer

A single processor core does not run two things at once. It runs one, saves its state, loads the other, and runs that — fast enough that both appear to be progressing. Concurrency, at that level, is an illusion produced by rapid switching.

Each of those switches costs real work: the state has to be saved, the pipeline is flushed, and the caches that made the previous task fast are now full of the wrong data. The term for this overhead is **context-switch cost**, and it is measured rather than asserted.

The reason this is worth borrowing is not that a person is a computer. It is that the structure is the same — work in progress, state that has to be reloaded, and a cost per switch that nobody counts because it never appears as a task.

## Why the cost is invisible

Switching never shows up on a list. Nothing is added, nothing is removed, no line gets longer. The hour simply goes.

What is actually consumed is the reload. Coming back to something means rebuilding where you were: which decision was pending, what you had already ruled out, why the obvious approach did not work. None of that is written down, because while you were in it, it did not need to be.

That is the real asymmetry. The work of a task is visible and estimable. The work of *resuming* a task is invisible and gets estimated at zero, which is why a day of six switches between four things feels like it should have produced more than it did.

## Thrashing — where it stops being a tax and becomes a wall

There is a point past which the overhead does not merely slow things down; it consumes everything.

**Thrashing** is the term. In an operating system it happens when the set of pages actively needed exceeds available memory: every access evicts something that is about to be needed, so the system spends nearly all its time swapping and useful throughput approaches zero. The machine is fully busy and producing almost nothing.

This is the honest description of an overloaded day, and the important word is *honest*. Thrashing is a **capacity fact**. It is what a system does when its working set is larger than what it can hold, and it is not evidence of a character problem. A machine in that state is not lazy and is not badly motivated. It is over capacity, and the only fix that works is reducing the working set.

The practical reading: when a day has gone entirely to activity with nothing finished, the useful question is how many things were simultaneously live, not how hard the day was worked.

## What reduces it

**Fewer things open at once.** This is the same lever as [Little's Law](/guides/littles-law-for-a-working-day/), arriving from a different direction: a smaller working set means fewer evictions, which means less reloading. The two arguments are independent and point the same way.

**Longer uninterrupted stretches.** The overhead is per switch, not per hour. Two hours in one block is cheaper than two hours in four blocks, and the difference is not marginal.

**A strict order rather than a chosen one.** Deciding what to do next is itself a switch, and it happens between every pair of tasks. Fixing the order in advance removes that decision from the moment when you are least able to make it well — which is precisely what [the Ivy Lee method](/methods/ivy-lee-method/) does with its one-at-a-time rule.

**Writing down where you were before you leave.** Two lines is enough: what was pending, what you had ruled out. This is the cheapest intervention on the list because it converts an invisible reload into a readable note.

## The limit of the analogy

Worth stating plainly, since this page has spent its length on computing results.

These are results about computing systems. A person is not a processor, and the correspondence is an analogy — well-founded, because the mechanisms genuinely match, but an analogy all the same. Nothing here is a study of human attention, and this page will not cite one it does not have.

What the analogy supports is modest and still useful: switching has a cost, that cost is paid in reloading state rather than in doing work, and past a certain load the cost dominates. The specific magnitude for a specific person on a specific day is not something anyone here can tell you, and anyone quoting you a precise percentage should be asked where it came from.

## Where to go next

- [The Ivy Lee method](/methods/ivy-lee-method/) — strict order, one thing at a time
- [The Top 3 method](/methods/top-3-method/) — a smaller working set, deliberately
- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — three methods and which problem each answers

## Using this in Decide One

Decide One asks for a duration on each thing you choose, which is the smallest available defence against a day that fragments: an estimate makes the switch visible, because afterwards you can compare what you planned against what happened.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
