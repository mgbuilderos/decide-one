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

### The zone can put scripts on the page that this repository never served

Cloudflare Web Analytics *automatic setup* injected `beacon.min.js` at the edge
until it was set to **Disable** on 12 September 2026. It is a zone setting, not
code: it appears in neither `wrangler.jsonc` nor any build output, and no agent
can change it — wrangler's token holds `zone (read)` and no RUM scope.

It injected **only for browser user-agents**, which is why a plain `curl` showed
a clean page for a day while every real visitor got the script. To check the
origin honestly, send a browser user-agent:

```bash
curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 \
  (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" \
  https://decideone.app/ | grep -c cloudflareinsights
```

`0` is the expected answer. Anything else is a third-party script on the origin
where people write their priorities, which `TELEMETRY_SPEC` §1 rule 3 forbids —
the switch is **Web Analytics → `decideone.app` → Manage site → Disable**.

## The domain move is done

`decideone.app` serves the Worker. The apex CNAME to `decide-one.pages.dev` was
deleted in the dashboard on 11 September 2026 — that deletion was what
Cloudflare error `100117` had been waiting for — so the `custom_domain` route in
`wrangler.jsonc` attaches and the domain serves this repository's build
(`80a225c`).

One command publishes, and step 4 should say MATCH.

### When step 4 says DIFFERENT

**Re-run it before diagnosing anything.** The apex HTML is edge-cached
(`cf-cache-status: HIT` on a `max-age=0, must-revalidate` document), so for a
few minutes after a deploy the edge still hands out the previous page. That is
a stale cache, not a routing fault. It cost a session on 12 September, because
this file still said the DNS had not moved and the stale page looked like
proof.

If it persists, the etag settles it:

```bash
curl -sI https://decideone.app/ | grep -i etag
curl -sI https://decide-one.decide-one-stationery-instrument.workers.dev/ | grep -i etag
```

**Equal means the Worker is serving the apex** — the deploy is the question,
not the routing. If instead the apex matches `decide-one.pages.dev`, the
rollback below is live.

Note that matching `pages.dev` was the *original* misdiagnosis, recorded at the
end of this file: an identical bundle and etag fingerprints the CDN, not the
publisher. The comparison is only evidence because it is made against the
Worker.

### Rolling back

The Sites project and `decide-one.pages.dev` still exist for exactly this. The
DNS record below is the only copy — recreate that row and the apex returns to
the old host.

### The record that was replaced — the only copy of it

Read from the Cloudflare dashboard on 11 September 2026, before it was deleted.
At that point the zone held **exactly one record** (`1 of 200 used`):

| Name | Type | Content | Proxy status | TTL |
| :--- | :--- | :--- | :--- | :--- |
| `decideone.app` | CNAME | `decide-one.pages.dev` | Proxied | Auto |

**To roll back to the Sites host, recreate exactly that row.** No MX, TXT, CAA
or `www` record exists, so nothing else is at stake — but this row is not
recoverable from anywhere else, which is why it is written here.

It was the *only* record, so deleting it took `decideone.app` offline until the
Worker route attached. That window was one deploy, and it is closed.

## Where it is hosted

| Host | Address | Publishes via | Status |
| :--- | :--- | :--- | :--- |
| Cloudflare Worker (founder's own account) | `decideone.app` and `decide-one.decide-one-stationery-instrument.workers.dev` | `npm run deploy` | **The host** |
| Sites project `appgprj_6aa060ea93fc819198302b9398806888` | — | Manual publish in the tool that owns it | Decommissioned, still exists |

**The Sites project still exists and is the fallback.** It serves nothing now —
no DNS points at it — but while it exists, rolling back is recreating one DNS
record. Delete it once the Worker has held the domain for a few days, not
before: deleting it is what makes the rollback in this file stop working.

`.openai/hosting.json` named the project for that tool and has been removed,
since nothing in this repository publishes through Sites any more. It was
`{"project_id": "appgprj_6aa060ea93fc819198302b9398806888", "static": {"directory": "dist"}}`
— restore it from git history if Sites is ever needed again.

The Worker serves `dist/` as static assets. Nothing runs server-side — the app
is local-first and has no backend, which is the point. Config is
`wrangler.jsonc`, and every claim in it is commented with the reason.

The Worker serves `dist/` as static assets, and `wrangler.jsonc` comments every
claim in it with the reason.

---

## Record — what was got wrong, 11 September 2026

Kept because each of these cost a session, and the reasoning is not recoverable
from the code.

**The host was misidentified as Cloudflare Pages *in this account*.**
`decide-one.pages.dev` served an identical bundle and etag to `decideone.app`,
and that was read as proof of a Pages project here. The DNS record, read on
11 September, shows the relationship was real but one level removed: the apex
CNAME points *at* `decide-one.pages.dev`, which is a Pages project in the Sites
provider account, not in this one. Checked against the
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
