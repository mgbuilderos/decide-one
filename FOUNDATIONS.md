# Foundations — the formal basis for what Decide One does

> Written September 10, 2026. Companion to `FRAMEWORKS.md`, which records *which* methods ship and their licensing. This file records **why the method is sound**, drawn from scheduling theory and queueing theory.
>
> **Read §5 before using any of this in copy.** These are results about computing systems. Applying them to a person is a well-founded analogy, not a proof — and this project has a documented history of documents outrunning the product.

---

## 1. Little's Law — the formal basis for Rule of 3

**John Little, 1961.** For any stable queueing system:

> **L = λW** — average items in the system = arrival rate × average time in the system

Rearranged: **W = L / λ.** Average completion time is *proportional to work-in-progress*.

**Halve your WIP, halve your cycle time.**

This is the basis of Kanban's WIP limits, and **a Kanban WIP limit is Rule of 3 for teams**. It matters here because the product's central claim — *limit what you take on and things finish sooner* — currently rests on judgment and tradition. Little's Law makes it arithmetic.

**What it licenses you to say:** that limiting concurrent work reduces time-to-completion is a result from queueing theory, not an opinion about willpower.

**What it does not license:** see §5.

---

## 2. There is no universally optimal scheduler — the formal basis for the diagnostic step

A known result in scheduling theory: **the right algorithm depends on the objective function.** No single discipline dominates across objectives.

| Scheduler | Provably good for | The shipped framework |
| :--- | :--- | :--- |
| **FIFO / FCFS** | nothing — known bad, the *convoy effect* | the default to-do list |
| **SJF** — shortest job first | minimising **average wait** | quick-wins clearing |
| **Priority scheduling** | respecting importance over arrival order | Eisenhower |
| **EDF** — earliest deadline first | **optimal** for meeting deadlines on one processor (Liu & Layland, 1973) | deadline-driven days |
| **Rate-monotonic** | periodic recurring work — optimal fixed-priority (same paper) | routines |
| **Round-robin** | responsiveness, fair time-slicing | timeboxing |

**"Diagnose the condition, then apply the matching method" is not a marketing conceit.** It is what scheduling theory requires, because SJF minimises average wait while EDF meets deadlines and neither dominates the other.

This is the formal defence of the diagnostic entry surface (`DECISIONS.md` C3) — the half of the product that the wordmark does not name.

---

## 3. NP-hardness — the formal defence of heuristics over an optimiser

Many scheduling problems (job-shop, multiprocessor) are **NP-hard**: no efficient algorithm finds the optimum. This is precisely why **heuristics** exist in the field.

**Rule of 3, Ivy Lee and Eisenhower are heuristics.** Shipping century-old rules instead of an AI optimiser is therefore the correct engineering answer, not a lazy one — the optimum is computationally intractable, and a good heuristic is what practitioners use in its place.

Directly useful against AI-powered planners: they are claiming to solve, cheaply and in the background, a class of problem known to be intractable.

---

## 4. The failure-mode glossary — every named problem already has a formal name

| Formal term | What it is | In a contested day |
| :--- | :--- | :--- |
| **Starvation** | Low-priority work never runs because higher-priority work keeps arriving | **The core problem the product exists for**: everything urgent starves everything important |
| **Aging** | The standard fix — a waiting task's priority rises over time until it must run | **The Pauli insight, already implemented in every OS scheduler**: what cannot be first is not deleted, it moves up |
| **Priority inversion** | A low-priority task holds a resource a high-priority task needs, so the important thing is blocked by the trivial thing | **Mars Pathfinder, 1997** — the rover kept resetting because a low-priority meteorological task held a mutex the high-priority bus task needed. NASA diagnosed it and patched the scheduler remotely |
| **Thrashing** | Working set exceeds memory; the system spends all its time swapping and throughput collapses | The honest model of an overloaded day — a **capacity fact**, not a character flaw |
| **Context-switch cost** | Saved state, flushed pipelines, cold caches | O Space files "Context Switching" as a psychological symptom; CS **measures** it as overhead and names its failure state |
| **Head-of-line blocking** | One stuck item blocks everything queued behind it | Ivy Lee's strict one-at-a-time order is a head-of-line discipline — which is also its risk |
| **Non-preemptive scheduling** | A scheduler that will not interrupt a running task | The commit-and-don't-reshuffle rule. **Hysteresis is its mechanism** (`AGENCY_NAMING_ROUND.md` §10) |
| **Amdahl's Law** (1967) | Speedup from parallelism is capped by the irreducibly serial fraction | Some work cannot be parallelised, at any headcount |

**The single-core fact underneath all of it:** a processor does not multitask. It time-slices, and concurrency is an illusion produced by rapid switching. That is not a metaphor for attention — it is the same structure, and it is why switching has a measurable cost in both systems.

---

## 5. Honesty guardrails — read before writing copy

These results are about **computing systems**. The product is used by **people**. The analogy is well-founded and the mechanisms genuinely correspond, but the following distinctions must survive into any public claim.

**Do not say:**
- *"Science proves you can only do three things"* — Little's Law is a theorem about queueing systems, not a finding about human cognition, and it names no number.
- *"Clinically"* or *"psychologically proven"* — nothing here is a psychological study. `DECISIONS.md` already forbids clinical claims for Protocol; the same rule applies here.
- Any citation of a study not named in this file.

**Do say:**
- *"Limiting work-in-progress reduces completion time — that's Little's Law, from queueing theory, and it's why Kanban caps WIP."*
- *"There's no universally best scheduling algorithm; the right one depends on what you're optimising for. That's why this asks what today looks like before it picks a method."*
- *"Starvation and priority inversion are named failure modes with a fifty-year literature. So is the fix."*

**The standing rule from `LANDING_PROTOTYPE.md` applies:** the honest document governs. If a claim here cannot be traced to a named result in this file, it does not ship.

---

## 6. Where this connects

- `FRAMEWORKS.md` — which methods ship, and their licensing
- `DECISIONS.md` **C3** — named day-conditions as the entry surface; §2 above is its formal defence
- `AGENCY_NAMING_ROUND.md` **§10** — hysteresis, the detent, and non-preemptive commitment
- `AGENCY_NAMING_ROUND.md` **§14** — the cross-linguistic finding that deciding is cutting
