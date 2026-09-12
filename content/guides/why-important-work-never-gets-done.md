---
title: Why your important work never gets done
description: There is a name for work that waits forever because louder work keeps arriving. It is starvation, and the standard fix is not discipline.
slug: why-important-work-never-gets-done
intent: why does important work never get done
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: urgent-important-matrix, everything-feels-urgent, how-to-prioritise-tasks, why-deadlines-work
keywords: important work never gets done, urgent crowds out important, never get to important tasks, important vs urgent
---

## The short answer

The important thing is not forgotten. It never reaches the front of the queue, because higher-priority work keeps arriving ahead of it.

This has a name. In scheduling theory it is called **starvation**: low-priority work that never runs, not because anyone decided against it, but because the ordering rule keeps finding something more pressing. It is a property of the queue, and it has a fifty-year literature.

So does the fix.

## Why it feels like a personal failing

Starvation produces a very particular experience. You know what the important work is. You can name it. You are not confused about its value, and you are not avoiding it — you can point at every hour of the week and say what it went to instead, and each of those things was genuinely more urgent at the moment it appeared.

At the end of the month the important thing has not moved. The obvious explanation is that something is wrong with you.

It is worth being direct: this happens in computer systems that have no willpower to lack. A scheduler with a strict priority rule and a steady stream of high-priority arrivals will starve its low-priority work indefinitely, every time, with perfect discipline. The failure is in the ordering rule, not in the thing being ordered.

## The mechanism, exactly

Two properties have to be true at once, and both usually are.

**Urgency wins ties.** Urgency is about *when* — it has a deadline attached, and a deadline makes an item loud. Importance is about *consequence*, which is silent. When two items compete and the only comparison available is which one is asking now, the urgent one wins. Every time, not sometimes.

**Urgent work arrives continuously.** If urgent arrivals stopped for a week, the important work would surface on its own. They do not stop. So the queue never drains far enough for anything without a deadline to reach the front.

Put together: the important work is not losing a fair contest. It is never entering one.

## Aging — the standard fix

Operating systems solved this decades ago, and the solution is not to try harder.

**Aging** means a waiting item's priority rises over time. The longer something sits, the higher it climbs, until eventually it outranks the new arrivals and must run. Nothing is deleted for failing to be chosen; it simply moves up.

Translated out of the jargon, the working version is:

1. **Give importance a standing claim on the day, before urgency gets to bid.** A fixed slot for the important thing is aging implemented by hand. It does not have to be large. It has to be first, because anything left until later is competing with whatever arrives later.
2. **Let unchosen work rise rather than vanish.** Something you did not get to today should be more likely to be chosen tomorrow, not less visible. A list that buries what it did not surface is running the failure, not correcting it.
3. **Cap what urgency can take.** If urgent work can claim the whole day, it will. The cap is what creates the space the important work eventually fills.

## The related failure, which is worse

There is a second named mode worth knowing, because it explains days that make no sense afterwards.

**Priority inversion** is when a low-priority item holds something a high-priority item needs, so the important work is blocked by the trivial work. The famous case is **Mars Pathfinder in 1997**: the rover kept resetting on the surface because a low-priority meteorological task held a lock that a high-priority bus task was waiting on. Engineers identified it and patched the scheduler remotely.

The everyday version is a significant piece of work waiting on a two-minute reply that nobody has sent. The important thing is not deprioritised. It is stuck behind something small, and the size of the blocker tells you nothing about the size of what it is blocking.

Which is why "what is blocked, and by what?" is worth asking before "what is most important?" — the second question cannot help you if the answer to the first is a two-minute task.

## What to do this week

- **Name the starved item.** One. The thing that has been on the list longest and has never been today's work.
- **Give it the first slot, not the leftover one.** Leftover time is where starvation happens, by definition.
- **Check it is not blocked.** If it is waiting on someone else, the useful action is the unblocking one, and it is probably small.
- **Accept the trade.** Something urgent will be later than it would have been. That is the cost, and pretending there is no cost is how the fixed slot quietly disappears by Thursday.

## Where to go next

- [How to use the urgent/important matrix](/methods/urgent-important-matrix/) — sorting on both axes before deciding
- [When everything feels urgent](/guides/everything-feels-urgent/) — what to do when the distinction has collapsed
- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — three methods and which problem each answers

## Using this in Decide One

Decide One does not hide what you did not choose. Work that was not picked stays visible rather than sinking, because the alternative is a system that quietly implements the exact failure it is meant to correct.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
