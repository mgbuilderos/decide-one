---
title: Is there a best prioritisation method?
description: No, and that is a formal result rather than a hedge. The right ordering rule depends on what you are optimising for, which is why the question comes first.
slug: is-there-a-best-prioritisation-method
intent: is there a best prioritisation method
published: 2026-09-12
updated: 2026-09-12
sources: FOUNDATIONS.md, FRAMEWORKS.md, VISION.md
links: how-to-prioritise-tasks, top-3-method, ivy-lee-method, urgent-important-matrix
keywords: best prioritisation method, which prioritisation method is best, best way to prioritise tasks, prioritisation methods compared
---

## The short answer

No. And this is not the usual evasion — it is a known result in scheduling theory: **the right algorithm depends on the objective function**, and no single ordering discipline dominates across objectives.

Shortest-job-first minimises average waiting time. Earliest-deadline-first meets deadlines. Neither beats the other, because they are optimising different things. Asking which is better is asking a question that has no answer until you say what "better" means for today.

That is why a method can work brilliantly for months and then stop. Nothing degraded. The objective changed.

## The disciplines, and what each is actually good at

| Ordering rule | Provably good for | What it looks like in a day |
| :--- | :--- | :--- |
| **First-in, first-out** | nothing — this is the known-bad case, and it produces the *convoy effect* | a plain to-do list, worked top to bottom |
| **Shortest job first** | minimising **average wait** | clearing the small things to get the queue down |
| **Priority scheduling** | respecting importance over arrival order | sorting by what matters rather than what shouted |
| **Earliest deadline first** | **optimal** for meeting deadlines on one processor (Liu & Layland, 1973) | a day organised entirely around what is due |
| **Rate-monotonic** | periodic recurring work — optimal among fixed-priority schemes (same paper) | routines and standing commitments |
| **Round-robin** | responsiveness and fair time-slicing | giving several things a fixed block each |

Two things are worth noticing in that table.

**The default is the worst option.** A list worked in the order things arrived is first-in-first-out, and FIFO is not a reasonable middle choice — it is the discipline known to be bad for essentially every objective. The convoy effect is its signature failure: one long item at the front holds up everything short behind it, and total waiting across the queue rises sharply.

**Optimality is always conditional.** Earliest-deadline-first is genuinely optimal, and the qualifier matters: on one processor, for the objective of meeting deadlines. Move the objective and the guarantee is gone. Every optimality claim in this field carries conditions like these, and any productivity method claiming to be best without naming its objective has simply not stated them.

## So what replaces "which is best?"

A different question: **what does today actually look like?**

That is not a softer question. It is the one scheduling theory says has to be answered first, because the objective function is the input the choice of algorithm depends on. Three common conditions and what each is asking for:

- **Too much, all of it real.** The objective is completion — getting things finished rather than started. That calls for a limit on work in progress. [The Top 3 method](/methods/top-3-method/).
- **Not too much, but nothing is moving.** The objective is throughput against dithering. That calls for a fixed order decided in advance and not renegotiated. [The Ivy Lee method](/methods/ivy-lee-method/).
- **Everything is shouting and the distinction has collapsed.** The objective is separating consequence from noise. That calls for sorting on two axes before doing anything. [The urgent/important matrix](/methods/urgent-important-matrix/).

A method aimed at the wrong condition feels like a personal failing when it is not. Ivy Lee's strict order does nothing for a day whose problem is volume; a work-in-progress limit does nothing for a day whose problem is that you cannot start.

## Why the answer is a heuristic and not an optimiser

The obvious objection: if this is a scheduling problem, why not compute the optimal schedule?

Because for the interesting cases you cannot. Many scheduling problems — job-shop, multiprocessor — are **NP-hard**, meaning no efficient algorithm is known that finds the optimum. This is exactly why heuristics exist in the field rather than as a consolation prize.

Top 3, Ivy Lee and the urgent/important matrix are heuristics. Shipping century-old rules instead of an optimiser is therefore the correct engineering answer rather than a lazy one: the optimum is computationally intractable, and a good heuristic is what practitioners actually use in its place.

This is also the honest test to apply to any tool promising to plan your day automatically. It is claiming to solve, cheaply and in the background, a class of problem known to be intractable. It is not doing that. It is applying a heuristic, and the only real question is whether it tells you which one.

## The one thing that is always true

There is no best method, but there is a worst one, and it is the default: no ordering rule at all, with arrival order deciding by omission.

Anything on the table above beats that, including the ones that are wrong for today. Choosing badly on purpose is still better than not choosing, because at least a chosen rule can be evaluated and changed. Arrival order cannot, since nobody picked it.

## Where to go next

- [How to prioritise your tasks](/guides/how-to-prioritise-tasks/) — the three conditions and which method each calls for
- [The Top 3 method](/methods/top-3-method/) — a limit on work in progress
- [The Ivy Lee method](/methods/ivy-lee-method/) — a fixed order, worked strictly
- [How to use the urgent/important matrix](/methods/urgent-important-matrix/) — sorting on two axes

## Using this in Decide One

Decide One asks what today looks like before it offers a method, which is the whole reason it ships three rather than one. The question is not a preamble to the product. It is the part scheduling theory says cannot be skipped.

A line you did not finish is unfinished. It is not marked against you, and a day you did not open is not counted.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
