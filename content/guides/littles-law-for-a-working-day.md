---
title: Little's Law, applied to a working day
description: Limiting work in progress shortens completion time, and that is arithmetic rather than willpower. What the theorem says, and what it does not say.
slug: littles-law-for-a-working-day
intent: why does limiting work in progress make things faster
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: top-3-method, how-many-tasks-should-a-day-hold, how-to-prioritise-tasks, why-you-cannot-finish-anything
keywords: little's law, work in progress limit, wip limit, why limiting tasks works
---

## The short answer

**John Little, 1961.** For any stable queueing system:

> **L = λW** — the average number of items in the system equals the arrival rate multiplied by the average time each item spends in it.

Rearranged, it says something more useful: **W = L / λ.** The average time an item takes to get through is proportional to how many items are in progress at once.

Halve the work in progress and you halve the time each thing takes to finish. Not because anyone tried harder. Because of the arithmetic.

## Why this is worth knowing

Most advice about doing fewer things at once rests on an argument about focus or willpower. That argument is contestable, and if you have ever felt it did not apply to you, you were not being unreasonable.

Little's Law is a different kind of claim. It is a theorem, and it holds for any stable queueing system regardless of what the items are or who is processing them. It is why Kanban puts a hard cap on work in progress, and it is why that cap is a number rather than an encouragement.

If six things are open, each one is, on average, waiting behind the others. Closing three does not make the remaining three easier. It makes them *finish sooner*, and that is a structural property of the queue rather than a fact about the person standing in front of it.

## What it does not say

This matters more than the law itself, and most writing that reaches for it gets this wrong.

**It names no number.** Little's Law does not say three. It does not say five, or one. It relates three quantities and says nothing about which value of L is correct for a human being on a Tuesday. Anyone citing it as evidence for a specific daily task count has gone further than the mathematics goes.

**It is not a finding about human cognition.** It is a result about queueing systems. Applying it to a working day is a well-founded analogy — the mechanism genuinely corresponds, because work arrives, waits, and is processed in both cases — but an analogy is not a proof, and it should not be dressed as one.

**It assumes a stable system.** The law holds when arrivals and departures are in long-run balance. A day where work arrives faster than it can ever leave is not stable, and the honest description of that is a capacity problem, not a prioritisation problem. No ordering rule fixes it.

So the accurate sentence is: *limiting concurrent work reduces time to completion — that is Little's Law, from queueing theory, and it is why Kanban caps work in progress.* Everything beyond that sentence is somebody's opinion, including ours.

## Where the three comes from, honestly

Three is a practical figure, not a derived one.

It is small enough that the limit binds — meaning you actually have to choose, and choosing is the whole mechanism. It is large enough that a day with one unexpected interruption is not a write-off. It fits on a surface you can read at a glance without scrolling.

Those are engineering reasons and reasons of habit. They are not a theorem. The theorem tells you that a smaller number finishes faster; it does not tell you where to stop, and pretending otherwise would be borrowing authority the source does not lend.

## What this changes in practice

**Count what is actually open, not what is planned.** Work in progress means started and unfinished. Four half-written documents are four items in the system even if only one is on today's list. This is usually the number people underestimate most.

**Finishing beats starting.** If the goal is shorter completion times, the highest-value move is almost always closing something already open rather than opening something new. This is counterintuitive when the new thing feels more urgent, and it is why the feeling is worth distrusting.

**A long backlog is not the problem.** λ is arrival rate; L is what is in the system. A hundred captured items you have not started are not in progress, and they cost nothing in completion time. The list is not what slows you down. The number of things simultaneously underway is.

That last point is why capture and planning should be two separate surfaces. Writing everything down is free. Committing to everything is not.

## Where to go next

- [The Top 3 method](/methods/top-3-method/) — the limit itself, and how to apply it
- [How many tasks should a day hold?](/guides/how-many-tasks-should-a-day-hold/) — where the arithmetic stops and judgement starts
- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — three methods and which problem each answers

## Using this in Decide One

Decide One keeps the captured list and the chosen day apart, because they are different quantities. Everything competing for attention stays visible and costs nothing. What you committed to today is bounded, and the bound is enforced rather than suggested.

An unfinished line is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
