# Deploying Decide One

> **`npm run build` first, always.** The site is `dist/`.

## Correction, 11 September 2026

An earlier version of this file said the host was **Cloudflare Pages, project
`decide-one`**, on the strength of `decide-one.pages.dev` serving an identical
bundle and etag to `decideone.app`. **That was a CDN fingerprint, not the
publisher, and the conclusion was wrong.**

Checked against the Cloudflare API with the founder's own credential:

| | |
| :--- | :--- |
| `decideone.app` zone in this account | **yes** |
| Pages projects in this account | **0** |
| Workers in this account | **0** |

So Cloudflare holds the DNS and proxies the domain, but **serves nothing**. The
origin is external. `decide-one.pages.dev` is real and serves the same bytes,
but it is not in this account — it belongs to the hosting provider's own
infrastructure, which is why it is unreachable from here.

`wrangler` cannot deploy this site. Not a permissions problem: the token
carries `pages (write)`. There is simply no project in this account to deploy to.

## What actually publishes it

The only hosting configuration this repository has ever contained is
`.openai/hosting.json`, committed at the initial commit:

```json
{
  "project_id": "appgprj_6aa060ea93fc819198302b9398806888",
  "static": { "directory": "dist" }
}
```

`LANDING_PROTOTYPE.md` records the same: *the Sites project identifier is
recorded in `.openai/hosting.json`; static output is `dist`.*

**The site is published through that Sites integration** — the publish action
in the tool that created the file — and not through any Cloudflare command.

**Restored 11 September 2026.** It had been deleted from the working tree, and
I then committed that deletion by sweeping it up in a `git add -A` — so it had
to be recovered from the initial commit rather than simply checked out. It is
back and committed. **Do not delete it again: publishing depends on it.**

## To deploy

```bash
npm run build
```

Then publish `dist/` through the Sites integration that owns
`appgprj_6aa060ea93fc819198302b9398806888`. **This cannot be driven from this
repository** — there is no CLI for it here.

If you would rather own the hosting outright, Cloudflare Pages in your own
account is a clean alternative, and the zone is already there:

```bash
npx wrangler pages project create decide-one
npm run build && npx wrangler pages deploy dist --project-name decide-one --force
```

Then point `decideone.app` at the new project in the Cloudflare dashboard.
**This changes who hosts the site**, so it is a decision, not a step.

## After any deploy

```bash
npm run verify:live
```

Compares the live bundle hash against `dist/` and says MATCH or DIFFERENT. The
live site sat a day behind on 10 September because nothing ran this check.

Then hard-refresh: `public/sw.js` is a service worker, and a tab left open can
hold the previous worker until every `decideone.app` tab is closed.
