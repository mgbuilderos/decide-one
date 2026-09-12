---
title: Why deadlines work, and what they cost
description: Ordering by deadline is provably optimal for one objective and quietly bad for another. Knowing which one you are buying is the whole of using them well.
slug: why-deadlines-work
intent: why do deadlines work
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: urgent-important-matrix, why-important-work-never-gets-done, is-there-a-best-prioritisation-method
keywords: why do deadlines work, artificial deadlines, deadline driven work, do deadlines help
---

## The short answer

A deadline converts an open-ended thing into an ordered one, and ordering by deadline is not merely a habit — it is **provably optimal for meeting deadlines** on a single processor. That result is **earliest deadline first**, established by Liu and Layland in 1973.

That is a real guarantee and it comes with a real condition: it is optimal *for that objective*. It does not minimise average waiting time, it does not respect importance, and it will happily starve anything without a date attached.

So deadlines work. The question is what they cost, and the cost is specific enough to plan around.

## Why the mechanism is real

A thing with no deadline has no position in any ordering. It competes with everything and loses to anything that is asking now, because "asking now" is the only comparison a queue can make without being told otherwise.

Giving something a date does three things at once. It creates a comparison — this before that. It makes the item **loud**, and loudness is what gets work selected. And it bounds the scope, because work expands to fill the time available and a date is what stops the expansion.

That is why an arbitrary deadline often works even when everyone knows it is arbitrary. The mechanism is the ordering, not the consequence.

## What they cost

**Everything without a date starves.** This is the central cost and it is not a side effect — it is what an ordering rule does. Work with no deadline never reaches the front, because deadline-bearing work keeps arriving ahead of it. The formal name is **starvation**, and it is [the reason important work never gets done](/guides/why-important-work-never-gets-done/).

Most genuinely important work has no natural deadline. Nobody sets a date for thinking, for the difficult conversation, or for the thing that will matter in a year. So a purely deadline-driven system systematically defers exactly the category of work it can least afford to.

**Urgency and importance stop being distinguishable.** Once everything that matters has been given a date in order to get done, the date stops carrying information. Every item is now urgent, which is the same as none of them being urgent, and [the distinction collapses](/methods/urgent-important-matrix/).

**Optimality is conditional and the condition is easy to lose.** Earliest-deadline-first is optimal on one processor when the work is schedulable at all. If more is due than can be done, the guarantee is void — it does not degrade gracefully, and the failure mode is missing several things rather than one.

## Using them well

**Put deadlines on things to sequence them, not to threaten yourself.** The ordering is the useful part. A date carrying a punishment mostly produces padded estimates and quiet reprioritising.

**Give the dateless work a standing slot instead of a fake date.** This is the correction for starvation and it is what operating systems do — **aging**, where waiting work rises in priority until it must run. A fixed first block for the important-but-undated thing is aging implemented by hand, and it is more honest than inventing a deadline nobody believes.

**Do not give everything a date.** Once every item has one, you have removed the signal and kept the pressure, which is the worst of both.

**Check what is actually due against what can actually be done.** If the sum exceeds capacity, no ordering rule helps and the useful action is telling someone, early. That is not a scheduling decision.

## The honest summary

Deadlines are a scheduling discipline with a proof behind it and a known failure mode. They are very good at the thing they are good at, and the cost falls entirely on work nobody has dated — which tends to be the work that matters most.

That is not an argument against using them. It is an argument for knowing which objective you have chosen, which is [the only real question in prioritisation](/guides/is-there-a-best-prioritisation-method/).

## Where to go next

- [How to use the urgent/important matrix](/methods/urgent-important-matrix/) — keeping the two axes apart
- [Why your important work never gets done](/guides/why-important-work-never-gets-done/) — starvation, and the standard fix
- [Is there a best prioritisation method?](/guides/is-there-a-best-prioritisation-method/) — why optimality is always conditional

## Using this in Decide One

Decide One asks for a duration on every line and optionally a when. The duration is what makes a day's total checkable against the hours in it, which is the check a deadline on its own never provides.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
