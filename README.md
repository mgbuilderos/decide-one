# Decide One

**A private priority instrument.** Choose what deserves today, give it real time, and close the day.

[decideone.app](https://decideone.app) · Free, for everyone, with nothing held back · Open source under the [MIT licence](./LICENSE)

---

## What it is

- **One page, three methods.** Top 3 (three things and no fourth), Ivy Lee (six in strict order, each locked until the previous is done) and the Urgent/Important Matrix (classify before writing).
- **Time is what you actually spent.** Each priority has a stopwatch that counts up from `00:00`. The right-hand page shows where the time went, and turning the page closes the day.
- **Weekly, monthly and yearly views** of the same work.
- **Your writing stays in this browser.** Entries live in local storage. There is no account, no cloud sync and no server copy.

## Privacy, stated precisely

- **Live storage is not encrypted.** Anyone with access to your unlocked device and browser profile can read it.
- **Exports can be.** `.vault` files use WebCrypto AES-GCM-256 with PBKDF2 key derivation and an HMAC-SHA256 signature, under a passphrase you choose.
- **The privacy shutter hides the page from the room.** It is a screen, not a security boundary, and it says so.
- **Anonymous analytics are off.** They are compiled out unless a build enables them, and even then nothing is sent until you say yes in Settings.
- **Support involves no payment code.** Paying happens in your UPI app or on GitHub; the instrument never sees it.

## Run it

Requires Node 22 or later.

```bash
npm install
npm run dev            # Vite prints the local address
npm run build
npm run test:qc        # the source rules
npm run test:artifact  # the published files
npm run test:visual    # renders the site in Chrome and compares screenshots
```

`npm run deploy` runs every gate, publishes to Cloudflare and checks the live site is this build.

## Support

Decide One is free and nothing unlocks by paying. If it has been worth something to you, **Menu → Support Decide One** offers UPI in India and GitHub Sponsors everywhere else.

Support links appear only when the `VITE_SUPPORT_*` variables in `.env.example` are set, so a fork never shows someone else's payment details.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). In short: run `npm run brief`, read [`AGENTS.md`](./AGENTS.md), and treat [`FINAL_DESIGN.md`](./FINAL_DESIGN.md) as the design and [`VISION.md`](./VISION.md) §11 as the copy. Security reports: [`SECURITY.md`](./SECURITY.md).

## Licence

The code is MIT-licensed — see [`LICENSE`](./LICENSE). Inter is used under the SIL Open Font License ([`public/fonts/INTER-LICENSE.txt`](./public/fonts/INTER-LICENSE.txt)). Method sources and attribution are in [`FRAMEWORKS.md`](./FRAMEWORKS.md).
