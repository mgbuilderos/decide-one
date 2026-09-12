---
title: How to prioritise work across a team
description: A team is not one worker multiplied. Adding people shortens some work and none of the rest, and there is a 1967 result that says exactly how much.
slug: how-to-prioritise-with-a-team
intent: how to prioritise work across a team
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: littles-law-for-a-working-day, when-your-work-depends-on-others, how-to-prioritise-tasks
keywords: prioritise work across a team, team prioritisation, too many projects at once, team work in progress
---

## The short answer

The single highest-value change most teams can make is **limiting how many things are in progress at once** — not per person, across the team.

By Little's Law, average completion time is proportional to work in progress. A team with twelve things underway finishes each one far later than the same team with four, and it will feel busier doing it. Halve the work in progress and you roughly halve the time each thing takes to finish. That is arithmetic, not management philosophy, and it is why Kanban puts a hard cap on work in progress rather than a suggestion. [The theorem, and what it does not claim.](/guides/littles-law-for-a-working-day/)

A WIP limit for a team is the same instrument as [Top 3](/methods/top-3-method/) for a person.

{{diagram:wip-vs-cycle-time}}

## Why teams accumulate work in progress

**Starting is visible and finishing is not.** A new workstream has a kickoff. The last twenty percent of an old one has no ceremony at all.

**Everyone is individually busy, so nothing looks wrong.** Utilisation is high and output is low, and utilisation is the number that gets watched.

**Nobody owns "what are we not doing".** Prioritisation is usually framed as ranking what to do, which quietly implies everything gets done eventually.

**Blocked work stays counted.** An item waiting on another team is still in progress, still occupying a slot, still making everything else slower — and nobody notices because nobody is working on it.

## What adding people does not fix

Worth knowing before the next reorganisation.

**Amdahl's Law (1967):** the speed-up available from parallelism is capped by the fraction of the work that is irreducibly serial. If a fifth of a project must happen in sequence, no amount of extra people takes it below a fifth of the original duration. Adding people to serial work adds coordination and nothing else.

This is a result about computing systems, and applying it to a team is a well-founded analogy rather than a proof — but the mechanism corresponds exactly: some things cannot be done until other things are finished, and people cannot be added to that.

The practical reading: before adding capacity, ask what fraction of the delay is **waiting** rather than **working**. In most stuck projects it is most of it, and waiting is not fixed by headcount.

## The four things that actually help

**Cap concurrent work, visibly.** Pick a number, make it smaller than feels comfortable, and make it binding. A limit that can be exceeded is a preference and will be exceeded.

**Finish before starting.** When something wants to begin, the question is which in-progress item it displaces. There is always apparently room; that is the illusion the cap exists to break.

**Make blocked work loud, with a name attached.** Not "blocked" — blocked *on whom*, since when. Work held up by a two-line answer from another team is [priority inversion](/guides/when-your-work-depends-on-others/), and the blocker's size tells you nothing about the size of what it blocks. Clearing these is the cheapest speed-up available to almost any team.

**Say what is not being done.** Out loud, in the same place as what is. A roadmap that lists only the yes is not a prioritisation; it is a wish list, and everyone reading it assumes their item is in.

## The measure to watch

Not throughput, and definitely not utilisation. **Cycle time** — how long a thing takes from start to finish.

Utilisation looks best exactly when cycle time is worst, because a fully loaded system has no capacity to absorb anything. A team at ninety percent utilisation is a team where every surprise becomes a delay for everything else.

If cycle time is rising while everyone is busy, the answer is almost never more effort. It is less in progress.

## Where to go next

- [Little's Law, applied to a working day](/guides/littles-law-for-a-working-day/) — the arithmetic, at the individual scale
- [When your work depends on other people](/guides/when-your-work-depends-on-others/) — dependencies and priority inversion
- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — the three conditions

## Using this in Decide One

Decide One is a single-person instrument and does not pretend to be a team tool — it holds one person's day. The idea it enforces, a bound that actually binds, is the same one a team WIP limit implements at a larger scale.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
