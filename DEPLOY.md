# Deploying Decide One

## One command

```bash
npm run deploy
```

That is the whole deploy. npm runs `predeploy` and `postdeploy` around it
automatically, so the single command does four things in order and **stops at
the first failure**:

| Step | What runs | If it fails |
| :--- | :--- | :--- |
| 1. Audit | `npm run test:qc` — 23 decision rules against `src/` | Nothing is built |
| 2. Build | `vite build` → `dist/` | Nothing is deployed |
| 3. Deploy | `wrangler deploy` — uploads `dist/` to Cloudflare | Nothing is verified |
| 4. Verify | `npm run verify:live` — live bundle hash vs `dist/` | You are told DIFFERENT |

`wrangler` is a pinned devDependency, so this needs no `npx` and no network
fetch of the tool itself.

**Deploy with `npm run deploy`, never `wrangler deploy` directly.** Calling
wrangler on its own skips the audit and the verification — that is the only way
to get an unaudited build onto the live site.

After it prints MATCH, hard-refresh. `public/sw.js` is a service worker, and a
tab left open can hold the previous worker until every `decideone.app` tab is
closed.

## One manual step is still outstanding

`decideone.app` still points at the **Sites** project, not at the Cloudflare
Worker that `npm run deploy` publishes to. Until that changes:

- `npm run deploy` publishes correctly to
  `decide-one.decide-one-stationery-instrument.workers.dev`
- step 4 will correctly report **DIFFERENT**, because `decideone.app` is
  genuinely serving something else

That is not a bug in the command. It is two hosts, and it resolves when the
domain moves.

### To finish the switch

1. Cloudflare dashboard → `decideone.app` → DNS. **Write down the existing apex
   records before deleting them** — nothing in this repository can recover them.
2. Delete them.
3. Uncomment the `routes` block in `wrangler.jsonc`.
4. `npm run deploy`

Then delete the Sites project, so there is one host and one command.

Cloudflare refuses step 3 until step 2 is done:

> Hostname 'decideone.app' already has externally managed DNS records
> (A, CNAME, etc). Delete them first or try a different hostname. `[code 100117]`

The OAuth token wrangler holds has **no DNS scope** — it cannot write DNS
records, and cannot even read them. This step needs the dashboard; no agent can
do it.

## Where it is hosted

| Host | Address | Publishes via | Status |
| :--- | :--- | :--- | :--- |
| Cloudflare Worker (founder's own account) | `decide-one.decide-one-stationery-instrument.workers.dev` | `npm run deploy` | Current build |
| Sites project `appgprj_6aa060ea93fc819198302b9398806888` | `decideone.app` | Manual publish in the tool that owns it | To be deleted |

The Worker serves `dist/` as static assets. Nothing runs server-side — the app
is local-first and has no backend, which is the point. Config is
`wrangler.jsonc`, and every claim in it is commented with the reason.

`.openai/hosting.json` is what the Sites project reads. **Do not delete it while
that host is still live** — it was deleted once by a `git add -A` sweep and had
to be recovered from the initial commit.

---

## Record — what was got wrong, 11 September 2026

Kept because each of these cost a session, and the reasoning is not recoverable
from the code.

**The host was misidentified as Cloudflare Pages.** `decide-one.pages.dev`
served an identical bundle and etag to `decideone.app`, and that was read as
proof. It was a CDN fingerprint, not the publisher. Checked against the
Cloudflare API with the founder's own credential: the `decideone.app` zone is in
the account, but there were **0 Pages projects and 0 Workers** — Cloudflare held
the DNS and proxied the domain while serving nothing. The origin was external.
`.openai/hosting.json`, committed at the initial commit, said so plainly the
whole time.

**A publish through Sites half-finished.** On 10 September the new JS and CSS
uploaded but `index.html` never swapped, so browsers kept being handed a page
asking for the previous build. The live site sat a day behind because nothing
ran `verify:live`. That check is now step 4 of every deploy, which is the direct
answer to it.

**Declaring `routes` replaces the default trigger.** A half-applied custom-domain
attach therefore took the `workers.dev` address down while also failing to
attach the domain. `workers_dev: true` is now explicit in `wrangler.jsonc` so it
cannot recur. `decideone.app` was never touched and kept serving throughout.
