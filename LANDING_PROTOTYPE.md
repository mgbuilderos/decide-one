# The landing page — as built

*Rewritten 14 September 2026. The previous version described a prototype called Primacy with six methods, habits, reflection, a device selector and Sites hosting — none of which is true any more. For the instrument itself, read `UI_BRIEF.md`.*

## Who sees it

- A **first visit** to `decideone.app/` gets the landing page.
- A visitor with **any written day** in storage opens the instrument directly (`hasWrittenBefore()` in `src/hooks/useJournalStorage.js`).
- `?view=landing` always shows it.

## What is on it

`src/components/MarketingLandingPage.jsx`, styled by the scoped `src/components/landing/landing.css`:

| Section | What it does |
| :-- | :-- |
| `#overview` | The canonical line from `VISION.md` §11.1, the body copy, *Start Free*, and a Three.js render of the page |
| `#highlights` | A three-step carousel: make the work visible, choose the method, give the first line time |
| `#approach` | What the evidence supports, and what it does not |
| `#design` | An interactive sample of the three methods with timeboxes, in `landing/JournalDemo.jsx`; edits are temporary |
| `#privacy` | Nothing leaves the device |
| `#access` | Free, no account, and the one quiet support ask |
| `#reading` | Links to the three methods, the prioritisation guide, every guide and the FAQ |
| Final call to action | *Three lines. Then get to work.* |

The navigation reads *How It Works*, *Guides*, *Start Free*. The footer links the guides and the FAQ, and opens the in-app Methods & Attributions and legal pages.

`landing/JournalScene.jsx` renders the hero lazily and falls back to `public/renders/decideone-studio-d1.webp` while WebGL loads, or where it is unavailable. Its spine label was removed on 13 September. Under `UI_BRIEF.md` §7.3 the render must be updated to depict the redesigned instrument, not a book.

## Around it

- **45 static pages** — 3 methods, 41 guides and the FAQ — built from `content/` by `scripts/build_content.js`, together with the sitemap, `llms.txt` and the 404 page.
- Served as the Cloudflare Worker `decide-one` from `dist/`. Publish only with `npm run deploy`.
- Telemetry is compiled out unless `VITE_ENABLE_TELEMETRY` is set. The service worker is an offline shell whose cache name is derived by the build.

## Checked by

`npm run test:qc` (copy and content rules), `npm run test:artifact` (every link resolves; the home page reaches every content section) and `npm run test:visual` (`landing-desktop` and `landing-mobile`, rendered in Chrome).
