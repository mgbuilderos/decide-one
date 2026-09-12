---
title: The Ivy Lee method: six tasks, strict order
description: Write six things tonight, order them, and work strictly top to bottom tomorrow. A 1918 method, its one real discipline, and the failure it can cause.
slug: ivy-lee-method
intent: how to use the ivy lee method
published: 2026-09-12
updated: 2026-09-12
sources: FRAMEWORKS.md, FOUNDATIONS.md, VISION.md
links: top-3-method, urgent-important-matrix, how-to-prioritise-tasks, the-cost-of-switching-tasks
keywords: ivy lee method, ivy lee 6 tasks, work on one thing at a time, stop task switching
---

## How the Ivy Lee method works

At the end of each day, write the six most important things you must do tomorrow. Put them in order of importance. The next day, start at the first one and **do not begin the second until the first is finished**. Anything unfinished moves to tomorrow's list.

The order is the method. The lock is what makes it work.

## Where it came from

In 1918, the consultant Ivy Lee was asked by Charles Schwab, then president of Bethlehem Steel, to improve how his executives worked. Lee gave them this routine and asked for no payment up front — Schwab could pay him whatever he thought it was worth after three months.

The anecdote is a business story rather than a study, and it is usually told with a large fee attached. We have not verified that figure and do not repeat it. The method survived because it kept working, not because of what it cost.

Ivy Ledbetter Lee died in 1934. The method is a historical attribution, in the same way the Socratic method is.

## Why the lock is the whole thing

Most people who try this method write the six lines, order them carefully, and then work on whichever one feels most possible at 10am. That is an ordered list, and an ordered list is not this method. It is the refusal to start the second thing that does the work.

The cost it removes has a name. **Context-switch cost** in a computing system is the overhead of saving state, flushing pipelines and starting again with cold caches. A processor does not truly run two things at once; it time-slices rapidly enough that concurrency looks real. The same structure applies when you move between pieces of work, and the cost is paid every time, invisibly.

A strict one-at-a-time order pays that cost once per task instead of once per switch.

## The risk, stated plainly

This method has a real failure mode, and any honest description includes it.

In scheduling theory, **head-of-line blocking** is what happens when one stuck item blocks everything queued behind it. That is exactly what a strict order does. If your first task is blocked — waiting on someone, missing information, genuinely impossible today — a rigid reading of the method leaves you stuck at the top of the list while five things you could have finished sit behind it.

**The fix is not to abandon the order.** It is to distinguish *hard* from *blocked*. A hard task is one you do not want to start; the method exists precisely to get you past that. A blocked task cannot progress no matter how willing you are. Move a blocked task down, note what unblocks it, and continue. Move a hard task nowhere.

## Six is not sacred

Lee said six. Six is a reasonable number for a working day and there is nothing magic about it. If you consistently finish three, write three — a list that is never completed stops being information and becomes wallpaper.

What matters is that the number is fixed before the day starts, and that the order holds during it.

## When Ivy Lee is the wrong method

It fits one problem: starting things and not finishing them. If that is not what is going wrong, something else fits.

| What today actually feels like | The method that fits |
| :--- | :--- |
| I keep starting things and not finishing them | Ivy Lee |
| Too much to do | [The Top 3 method](/methods/top-3-method/) |
| Everything feels urgent and I cannot tell what matters | [The urgent/important matrix](/methods/urgent-important-matrix/) |

There is no universally best scheduler — that is a known result, not an opinion — and the same is true here. A method aimed at the wrong problem feels like a personal failure when it is a mismatch — [how to tell which you have](/guides/how-to-prioritise-tasks/).

## Using it in Decide One

Decide One enforces the order rather than drawing it. The second line does not open until the first is closed. That is the difference between a tool that holds the method and a tool that reminds you of it.

Overrunning adds time and says nothing. There is no score and no streak, and a day you did not open is not counted against you.

[Open Decide One](/?view=daily) — free to use, with no account. Nothing you write leaves your device.
