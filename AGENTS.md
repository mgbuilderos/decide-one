# Working on Decide One

Read this before changing anything. It applies to **every** agent — Claude Code,
ChatGPT Codex, Antigravity — and to the founder.

Three agents share one working tree. Almost every problem this project has had
came from that, not from the code.

---

## The five rules

**1. Read before writing.**
`DECISIONS.md` is what has been decided and why. `WORK_REMAINING.md` is what is
left. Both are current. Re-deriving what they already say wastes a session and
usually reaches a worse answer, because the reasoning behind a decision is not
recoverable from the code.

**2. Commit your own work before you stop.**
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

## Hosting: pick one, write it down

There are currently **two** hosts, which is one too many:

- **The Sites project** in `.openai/hosting.json` — what `decideone.app`
  currently points at. Publishing is a manual action in the tool that owns it.
- **A Cloudflare Worker** in the founder's own account —
  `decide-one.decide-one-stationery-instrument.workers.dev`, deployed with
  `npx wrangler deploy`, currently serving the newer build.

**One of these should be deleted.** Until then, `decideone.app` and the
workers.dev address will disagree about what the product looks like. `DEPLOY.md`
has the state and the remaining steps.

After any deploy, always:

```bash
npm run verify:live
```

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
