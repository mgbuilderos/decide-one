# Deploying Decide One

> **`npm run build` first, always.** The site is `dist/` — 18 files, ~13MB.

## The host, established 10 September 2026

**Cloudflare Pages. Project name: `decide-one`.**

Confirmed by fingerprint, not by guessing: `decide-one.pages.dev` serves the
identical bundle **and the identical etag** as `decideone.app`.

```
decideone.app         assets/index-DsE169m7.js  etag "a1453b54206a0979dc4f77a668db1bc8"
decide-one.pages.dev  assets/index-DsE169m7.js  etag "a1453b54206a0979dc4f77a668db1bc8"
```

The domain's nameservers are Cloudflare (`jermaine`/`celeste.ns.cloudflare.com`),
so DNS and the Pages project sit in the same Cloudflare account.

**`.openai/hosting.json` is stale.** It names a Sites project that has nothing
to do with where this domain is served from. Correct or delete it.

## The deploy command

```bash
npm run build
npx wrangler pages deploy dist --project-name decide-one --force
npm run verify:live
```

`--force` is required: current wrangler tries to delegate Pages deploys to
Workers, fails, and deploys nothing. The flag takes the direct Pages path.

## ⚠️ The account problem — read before deploying

`wrangler` on this machine **is authenticated, but to the wrong account.**

```
authenticated as : Maulik.payment@gmail.com's Account
account id       : 00f21e5724f9ebf7b1ab0cb42ae76b1e
pages projects   : none
deploy result    : The Pages project "decide-one" does not exist
```

`decide-one` lives in a **different Cloudflare account**. Nothing can be
deployed until wrangler is pointed at that one:

```bash
npx wrangler logout
npx wrangler login        # sign in with the account that owns decide-one
npx wrangler pages project list   # 'decide-one' must appear
```

Alternatively, set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` for the
correct account in `.env` — which is gitignored, and must stay that way.

## Two other Pages sites exist on some account

`journal-app.pages.dev` serves a page titled *Journal App*, and
`primacy.pages.dev` resolves as well. Both look like earlier deployments of
this same product under its former names. Worth deleting once `decideone.app`
is confirmed current, so no stale copy of the app stays reachable.

## After every deploy

```bash
npm run verify:live
```

It compares the live bundle hash against `dist/` and says MATCH or DIFFERENT.
The live site sat a day behind on 10 September precisely because nothing
performed this check.

Then **hard-refresh**. `public/sw.js` is a service worker; its cache name is
bumped each release, but a tab left open can keep the old worker alive until
every `decideone.app` tab is closed.
