# Decide One • The Priority Instrument

> **A private, on-device instrument for deciding what comes first.**  
> *Nothing shares first.*

---

## 🌟 Overview

**Decide One** is a stationery-grade daily priority instrument built with **React**, **Vite**, and **Tailwind CSS**. It combines the focused calm of paper with three public-domain decision methods and on-device storage.

* **One payment, not a subscription**: $39 USD one-time, the same price everywhere. Sixty-day refund, no questions.
* **Your work stays on your device**: entries are saved in your browser's local storage and are never uploaded. There is no account, no cloud sync, and no server copy of anything you write.
* **Anonymous usage analytics are off by default and opt-in.** A telemetry module exists in `src/utils/telemetry.js`. It sends nothing unless *both* a build flag and your explicit consent are set, strips private entry text before sending, and can be turned off again from the menu. **This is why the project does not claim "zero telemetry"** — the honest claim is that nothing is collected without consent.
* **Strict 24px Universal Swiss Grid**: Mathematical architectural cadence across all line heights, margins, and paper textures.
* **Responsive by design**: the landing page scrolls naturally, while the daily instrument keeps its primary controls within easy reach on desktop and mobile.

---

## 🚀 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (Port 3000)
npm run dev

# 3. Run the 23 automated Quality Control (QC) Gates
npm run test:qc

# 4. Build optimized production bundle
npm run build
```

---

## 🧭 Live URLs & Access

* **Production Domain**: [https://decideone.app/](https://decideone.app/) — currently served by the Sites project recorded in `.openai/hosting.json`.
* **Verified Cloudflare Worker**: [https://decide-one.decide-one-stationery-instrument.workers.dev](https://decide-one.decide-one-stationery-instrument.workers.dev)
* **Daily Priority Instrument**: [http://localhost:3000/?view=daily](http://localhost:3000/?view=daily)
* **Marketing Landing Page**: [http://localhost:3000/?view=landing](http://localhost:3000/?view=landing)
* **Licence activation**: paste a signed per-buyer licence key in the app. Checkout is intentionally disconnected in this build.
* **Weekly Review**: [http://localhost:3000/?view=weekly](http://localhost:3000/?view=weekly)
* **Year View**: [http://localhost:3000/?view=yearly](http://localhost:3000/?view=yearly)

---

## 🛡️ Security & Privacy Architecture

Stated precisely, because the previous version of this section overclaimed.

* **Encrypted exports**: `.vault` files are encrypted with WebCrypto AES-GCM-256, PBKDF2 key derivation and an HMAC-SHA256 signature, using a passphrase you choose.
* **Live storage is *not* encrypted.** Day-to-day entries are plain JSON in `localStorage`. Anyone with access to your unlocked device and browser profile can read them. Encryption applies to exports only.
* **The privacy shutter is a shutter, not a vault.** It clears the screen from the room — shoulders, screen-shares, a passing colleague — on `Esc`, idle, or window blur. **It is not a security boundary and reopening it requires no secret**, because the data behind it is readable from the browser anyway. Describing it as a lock would be dishonest.
* **Biometrics where the platform provides them**: WebAuthn is used when a platform authenticator exists. Where it does not, the app reports that plainly rather than reporting a check that never ran.

---

## 📋 Documentation & Handoff

* **Detailed Handoff Note**: [`HANDOFF.md`](./HANDOFF.md)
* **Full Architectural Blueprint**: [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md)
* **Automated QC Audit Suite**: [`scripts/qc_audit.js`](./scripts/qc_audit.js) (`npm run test:qc`)

---

## ⚖️ Legal & IP Notes

The three methods, naming conventions, typography choices, and layout standards used in Decide One still require independent professional review before commercial release. Historical licence keys and storage identifiers are retained only as compatibility fallbacks.
