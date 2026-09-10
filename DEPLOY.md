# Deploying Decide One

> **`npm run build` first, always.** The site is `dist/` — 18 files, ~13MB.

## Why this file exists

`decideone.app` served a build from before 10 September for most of a day
because nothing in the repo recorded how it is published, so nobody noticed the
drift. That is what this file fixes.

## What is known

- The domain resolves through **Cloudflare** (`cf-ray` headers, Cloudflare IPs).
- `.openai/hosting.json` names a Sites project — **that config appears stale**,
  since it does not match where the domain actually points.
- There is **no CI**: no `.github/workflows`, no GitHub Pages, and zero
  deployments on the repo. **Pushing to GitHub does not deploy anything.**
- No deploy credentials exist on this machine: Vercel CLI reports *Not
  authorized*, and there is no wrangler config or Cloudflare token.

## Fill this in

Whoever deploys, record the command here so this never drifts again.

```
Host:     ???
Command:  ???
```

### If it is Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name <project>
```

### If it is Cloudflare Pages via the dashboard

Build locally, then drag the **`dist` folder** into the project's *Create
deployment* screen. Do not upload the zip of the repo — only `dist`.

### If it is Vercel

```bash
npm run build
vercel login          # once
vercel --prod
```

### If it is the OpenAI Sites project in `.openai/hosting.json`

Publish through whichever tool wrote that file, then either correct or delete
it so it stops pointing at a target that is not serving the domain.

## After deploying, always

1. **Hard-refresh.** `public/sw.js` is a service worker. Its cache name is
   bumped on each release, which evicts the old one — but a tab left open can
   keep the previous worker alive until every `decideone.app` tab is closed.
2. **Check the bundle changed**, which is the check that would have caught the
   drift:

```bash
curl -s https://decideone.app/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
```

   Compare it to `ls dist/assets/index-*.js`. If they differ, the deploy did
   not land.
