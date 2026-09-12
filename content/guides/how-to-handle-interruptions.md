---
title: How to handle constant interruptions
description: An interruption costs more than the minutes it takes, and the extra is paid on the way back. What a scheduler does about it, and what transfers to a person.
slug: how-to-handle-interruptions
intent: how to handle interruptions at work
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: the-cost-of-switching-tasks, is-multitasking-real, top-3-method
keywords: how to handle interruptions, constant interruptions at work, protect focus time, stop being interrupted
---

## The short answer

The visible cost of an interruption is the time it takes. The real cost is the reload afterwards — rebuilding what was pending, what you had already ruled out, and why the obvious approach did not work.

That second part never appears anywhere. It is not a task, nobody schedules it, and it is the reason a day of five short interruptions can consume far more than the sum of those five.

So the useful strategies are the ones that reduce the **number of reloads**, not the ones that reduce the length of each interruption.

{{diagram:context-switch}}

## What a scheduler does about this

Operating systems face exactly this problem and have a vocabulary for it worth borrowing.

**Non-preemptive scheduling** means a running task will not be interrupted — once something has the processor, it keeps it until it yields. It is the strongest possible answer and it has an obvious cost: urgent things wait. Systems that need responsiveness cannot use it.

**Preemption with a minimum slice** is the common compromise: things can be interrupted, but not before they have had a useful run. This turns out to be the transferable idea. The problem is rarely that interruptions happen; it is that they arrive before anything has reached a state worth saving.

**Context-switch cost** is what the machine pays each time: saved state, flushed pipelines, caches now holding the wrong data. It is measured, not asserted, and it is [the same shape as the reload a person pays](/guides/the-cost-of-switching-tasks/).

The honest caveat is the same as everywhere on this site: these are results about computing systems, and applying them to a person is a well-founded analogy rather than a proof about attention.

## What actually reduces the count

**Batch the arrivals rather than the responses.** Most interruptions are not events, they are notifications of events. Checking messages at three fixed points converts twenty arrivals into three reloads, and almost nothing is worse for the delay.

**Give the first block of the day away last.** Protecting a morning block is more valuable than protecting the same amount of time in the afternoon, because that is when the work requiring the most held state usually happens.

**Make the minimum slice explicit to other people.** "I'll come back to you at eleven" is a scheduling decision and it is almost always accepted. The interruption does not need to be refused; it needs a position in a queue.

**Write two lines before you leave the work.** What was pending, what you had ruled out. This is the cheapest intervention available — it converts an invisible reload into something readable, and it takes about fifteen seconds.

**Count how many things are open.** The reload cost is paid per switch, and the number of switches scales with how many things are live at once. A day with three open items has far fewer possible transitions than a day with eight, which is the quiet argument for [a cap that binds](/methods/top-3-method/).

## What does not work

**Trying to be faster at resuming.** The reload is the work of reconstructing state. You can make it cheaper by writing things down; you cannot skip it by concentrating harder.

**Blocking out the whole day.** Calendars that defend eight hours get overridden, and a defence that gets overridden teaches everyone that the defence means nothing. Two protected hours that hold are worth more than eight that do not.

**Refusing interruptions outright.** In most jobs the interruptions are the job, or are at least part of it. A non-preemptive policy applied to a role that requires responsiveness fails in exactly the way the scheduling literature predicts: the urgent thing waits too long and someone overrides the policy entirely.

## The part that is not a technique

Some interruption loads are genuinely too high for the work assigned, and no batching strategy fixes that. Being interrupted forty times is not a personal discipline problem, and a day like that is [a capacity fact rather than a character one](/guides/what-to-do-when-you-have-too-much-to-do/).

If the numbers do not work, the useful action is showing someone the numbers — planned against actual, over a couple of weeks. That is a conversation, not a method.

## Where to go next

- [What switching tasks actually costs](/guides/the-cost-of-switching-tasks/) — the mechanism and where it collapses
- [Is multitasking real?](/guides/is-multitasking-real/) — what the single-core fact does and does not say
- [The Top 3 method](/methods/top-3-method/) — fewer open items, fewer possible switches

## Using this in Decide One

Decide One bounds what the day holds and asks for a duration on each line, so the gap between planned and actual is visible afterwards. On an interrupted day that gap is the closest thing to a measurement of what the interruptions cost.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
