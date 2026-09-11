# Working on Decide One

Read this before changing anything. It applies to **every** agent — Claude Code,
ChatGPT Codex, Antigravity — and to the founder.

Three agents share one working tree. Almost every problem this project has had
came from that, not from the code.

---

## Every session, in four commands

```bash
npm run brief     # what is true right now. ALWAYS FIRST.
npm run tree      # is another agent editing? (brief shows this too)
npm run test:qc   # 23 rules + Rule 0. Before every commit.
npm run log "…"   # what you did, appended to DECISION_LOG.md. Before you stop.
```

`npm run brief` exists because reading this repository costs about 140,000
tokens and answers none of the questions a session actually opens with. It
computes them instead, in a few hundred: who is editing, where git is, whether
`decideone.app` is this build, the last five commits, the last session-log
entries, and which nine documents are current out of forty-three.

**Read documentation only when `brief` tells you to.** The layers are:
`VISION.md` is *why*, `DECISIONS.md` is *what is true now*, `DECISION_LOG.md`
is *how we got here*. Everything else in the root is working history from the
build-out and should not be read speculatively.

---

## The five rules

**1. Read before writing.**
`DECISIONS.md` is what has been decided and why. `WORK_REMAINING.md` is what is
left. Both are current. Re-deriving what they already say wastes a session and
usually reaches a worse answer, because the reasoning behind a decision is not
recoverable from the code.

**2. Commit your own work before you stop, and say what it was.**
`npm run log "…"` appends it to `DECISION_LOG.md`; commit that with your files.
Leaving changes uncommitted is how work gets lost. Two agents have been editing
without committing, and a third then swept those edits into unrelated commits.
If you changed it, commit it, with a message saying why.

**3. Never `git add -A` or `git commit -a`.**
Stage the files you touched, by name. This single rule would have prevented
four incidents: a rewritten hero landing in a commit about icons, a deleted
hosting config committed by accident, and twice someone's work being attributed
to the wrong change.

**4. Run the gates before committing.**

```bash
npm run build && npm run test:qc
```

23 rules fail the build if a decision is quietly reversed — a cut framework
returning, gamified language creeping back, a shared licence key reappearing,
the Ivy Lee lock going missing. **The audit is the contract between agents.**
It is faster and more reliable than asking another agent to review.

**5. Copy is governed, not free.**
`VISION.md` §11.1 holds the canonical statement, and §11 says where any copy
anywhere conflicts with it, §11 wins. §11.3 forbids clinical vocabulary,
judgment, and unearned science. If you want different copy, **change §11 first
and say why.** Silently diverging creates a conflict nobody notices for weeks.

---

## Where things are

| Question | File |
| :--- | :--- |
| What was decided, and why | `DECISIONS.md` |
| What is still outstanding | `WORK_REMAINING.md` |
| Why the product exists; the canonical copy | `VISION.md` §11 |
| How the site is published | `DEPLOY.md` |
| Why the methods are sound | `FOUNDATIONS.md` |
| Which methods ship, and their attribution | `FRAMEWORKS.md` |

`LANDING_PROTOTYPE.md` is the honest description of what is actually built.
Several older documents overstate it — trust that one where they disagree.

---

## Deploying: one command

```bash
npm run deploy
```

That is the whole deploy. npm runs `predeploy` and `postdeploy` around it, so
the one command audits, builds, deploys, and verifies that the live site is
actually this build — **stopping at the first failure**. Code that fails QC
never reaches the site.

**Never run `wrangler deploy` on its own.** It skips the audit and the
verification, and that is the only way an unaudited build gets published.

**One thing is still outstanding.** `decideone.app` points at the old Sites
project, not at the Worker `npm run deploy` publishes to, so the verify step
will correctly report DIFFERENT until the DNS moves. `DEPLOY.md` has the four
steps — one of them needs the Cloudflare dashboard and no agent can do it.

---

## Keeping sessions cheap

Context is the scarce resource, and long sessions are expensive for everyone.

- **Point at the file.** "Fix the hero in `MarketingLandingPage.jsx`" costs a
  fraction of "the landing page feels off".
- **Ask for one thing.** A scoped change verifies cleanly. A broad sweep
  produces work that cannot be checked and often has to be redone.
- **Let the decision log carry the memory.** It exists so the next session does
  not pay to rediscover the last one.
- **Trust the audit over re-reading.** `npm run test:qc` answers "did this break
  a decision" in a second.

---

## When two agents must work at once

Everything above assumes one agent editing at a time. That is the cheap case,
and it is usually true. When it is not, the shared tree bites in a specific
way: a second agent reading `git status` mid-write sees a half-applied state —
a file briefly deleted, an import pointing at nothing — and reports work as
broken or abandoned when it is neither. That happened twice on 11 September.

**Before concluding that anything is broken — and before deploying — ask
whether the tree is still being written:**

```bash
npm run tree
```

It answers in one line: `SOMEONE IS WORKING` with how long ago, or `Quiet for
Nm — safe to read, build and deploy`, followed by the five most recently
written files and anything uncommitted.

Edits inside the last five minutes mean an agent is mid-task — wait and run it
again. Several files sharing one timestamp is one batch write, not several
separate changes; that signature is what made a delete-and-rewrite look like a
deletion on 11 September.

### Giving an agent its own tree

If two agents genuinely need to work simultaneously, give one its own worktree
rather than trying to interleave in this one:

```bash
git worktree add ../decide-one-codex -b agent/codex
cd ../decide-one-codex && npm install
cp "../Journal App/licence-signing-key.json" .    # gitignored, not carried over
```

Point that agent at the new directory. It gets an isolated tree on its own
branch, and its work reaches `main` through a merge you can read first.

**The cost is real and worth knowing before you start:** `node_modules` is
1.2 GB, and each worktree needs its own copy. The signing key has to be copied
in, which multiplies the number of places a secret lives. And merging becomes
your job rather than something that happened by accident.

So this is the answer when two agents must overlap — not the default. One agent
at a time, committing before it stops, remains cheaper and simpler.

When a worktree is finished with:

```bash
git worktree remove ../decide-one-codex
git branch -d agent/codex        # after merging
```
