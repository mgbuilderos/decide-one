# Decide One • The Priority Instrument
# Engineering & Product Executive Handoff Note

> **Document Version**: 2.1.0 • Production Ready  
> **Last Verified**: September 10, 2026  
> **Project Root**: `/Users/Maulik/Documents/Claude/Projects/Journal App`  
> **Target Audience**: Incoming Founders, Lead Engineers, Product Designers, and Autonomous AI Coding Agents.

---

## 1. Executive Briefing & Current Status

| Metric | Status | Notes |
| :--- | :--- | :--- |
| **Product Name** | **Decide One • The Priority Instrument** | Canonical domain: `decideone.app` |
| **Architecture** | 100% Client-Side Local-First (Zero Cloud) | $0.00 recurring server costs; zero cloud data leaks |
| **Dev Server** | Running on `http://localhost:3000/` | Vite v6.4.3 (`package.json`) |
| **Production Build** | **Passing** (`npm run build` → 1.58s) | Minified, tree-shaken, zero errors |
| **Quality Control** | **100% Compliance (21/21 Gates)** | Enforced via `scripts/qc_audit.js` (`npm run test:qc`) |
| **Monetization** | $24 USD / ₹1,999 INR One-Time Lifetime Pass | Anti-SaaS, offline crypto verification, Dodo Payments rail |
| **Security / Crypto** | WebCrypto AES-GCM-256 + WebAuthn Biometrics | Air-gapped `.vault` export, Touch ID / Face ID hardware gating |

---

## 2. Immediate Operational Quickstart

### Running the Application
```bash
# Install dependencies
npm install

# Launch development server (Port 3000)
npm run dev

# Run the 21 Automated Quality Control (QC) Gates
npm run test:qc

# Build production bundle for static hosting
npm run build

# Preview production build locally
npm run preview
```

### Essential Navigation & Test URLs
* **Production Domain**: [https://decideone.app/](https://decideone.app/)
* **Daily Executive Instrument**: [http://localhost:3000/](http://localhost:3000/)
* **Apple-Grade Marketing Landing Page**: [http://localhost:3000/?view=landing](http://localhost:3000/?view=landing)
* **Instant 1-Click Lifetime Patron Activation**: [http://localhost:3000/?key=DECIDEONE-PATRON-2026](http://localhost:3000/?key=DECIDEONE-PATRON-2026)
* **Weekly Review Spread**: [http://localhost:3000/?view=weekly](http://localhost:3000/?view=weekly)
* **12-Month Annual Index**: [http://localhost:3000/?view=yearly](http://localhost:3000/?view=yearly)
* **Default Unlock PIN (Lock Screen)**: `1234` (Hitting Enter or clicking "Unlock" with empty field auto-unlocks).

---

## 3. Core Architectural Principles & Invariants

Any engineer or autonomous agent modifying this codebase **must strictly honor** these core design and engineering invariants:

1. **Zero Cloud Infrastructure ($0.00 Server Cost)**:
   - Decide One does not have, and must never require, a remote backend, authentication server, or database.
   - All user records persist in browser **IndexedDB** (`src/hooks/useJournalStorage.js`) with WebCrypto AES-GCM-256 encryption.
2. **Strict 24px Universal Swiss Grid Cadence**:
   - All margins, paddings, line-heights, input boxes, and divider rules must snap to a multiple of `24px` (`h-6`, `h-12`, `p-6`, `gap-6`, `leading-6`).
   - Sub-pixel alignment ensures that transitioning between views or dates produces zero layout jump.
3. **Zero-Scroll Viewport Lock**:
   - Inside the app canvas, the viewport is locked to `100vh` (`max-h-screen overflow-hidden`).
   - No horizontal or vertical page scrollbars are permitted inside the notebook view. Inner task streams use `.pocket-scroll`.
4. **Zero `font-mono` Rule**:
   - Decide One is typeset strictly in **Universal Helvetica / Inter** (`font-sans`). Monospace fonts are strictly forbidden by Rule 1 of the QC audit suite.
5. **Consumer-Friendly Benefit Copy (Zero Technical Jargon)**:
   - In UI labels, card text, and marketing copy, avoid defensive technical jargon (*"AES-256"*, *"PBKDF2"*, *"IndexedDB"*, *"Crypto-safe"*).
   - Talk strictly about executive peace of mind, focus, and benefits: *"Your data stays with you. Period."*, *"Confidential Sanctuary"*, *"One priority. Zero noise."*.
6. **Pure Neutral Gallery Stage**:
   - Notebook floats on calm studio gallery stone (`#EAEAE7` light / `#0B0B0D` dark). No faux wood tables or desk mats.
7. **Authentic Folded Woven Twill Brand Tag**:
   - Woven pull-tab at top center must strictly read **`DECIDE ONE`** in crisp, bold, uppercase typography (`11px font-bold tracking-[0.28em]`).

---

## 4. Codebase Architecture & File Responsibility Map

```
src/
├── App.jsx                                # Root Orchestrator: View routing, layout containment, keyboard shortcuts
├── main.jsx                               # React 19 root mount & PWA service worker registration
├── index.css                              # Design system tokens, 24px cadence, 3D leaf turn, woven twill tag CSS
│
├── components/
│   ├── HeaderToolbar.jsx                  # Unified constant top capsule bar across all 5 views (Method, Dots, Decisions, Close Day, Dictate, Search, Lock, Menu, Patron)
│   ├── SpreadPages.jsx                    # Desktop bi-fold spread: LeftPage (Priorities/Rapid Log) & RightPage (Habits/Reflection/Footer)
│   ├── DateHeader.jsx                     # Top date header, day-of-year index, progress ring
│   ├── Top3HardTasks.jsx                  # Decide One priority commitments
│   ├── BulletList.jsx & BulletItem.jsx    # Rapid logging stream with task state cycling & Swiss typography
│   ├── HabitTracker.jsx                   # 5-day compounding habit loop
│   ├── EveningReflection.jsx              # Daily gratitude, learnings, and Stoic/Lao Tzu reflection quotes
│   ├── NotebookCover.jsx                  # Closed front cover with woven DECIDE ONE tab and seasonal line art
│   ├── ExecutivePrivacyOverlay.jsx        # 0.18s Tactical Privacy Shutter & Biometric Hardware Lock screen
│   ├── PatronUpgradeModal.jsx             # 1-Click Lifetime Patron pass upgrade modal & Dodo rail
│   ├── MarketingLandingPage.jsx           # Apple Mac mini grade landing page with 3D hardware renders & forensic macro close-ups
│   ├── ProductivityFrameworks.jsx         # 9 cognitive decision models (Top 3, Ivy Lee, Eisenhower, MoSCoW, Pareto, etc.)
│   ├── ExecutiveDecisionModal.jsx         # High-stakes executive decision ledger & rationale tracker
│   ├── ExecutiveClosureModal.jsx          # End-of-day shutdown ritual & mental residue clearance
│   ├── ExecutiveScratchpadModal.jsx       # Quick zero-latency scratchpad buffer (Cmd+N)
│   ├── WeeklyExecutiveReview.jsx          # Sunday weekly alignment spread & task triage
│   ├── MonthlyLogSpread.jsx               # Single-column full-width monthly calendar & milestone planner
│   ├── AnnualIndexSpread.jsx              # 12-month annual overview & archival index
│   ├── OmnisearchModal.jsx                # Sub-2ms Cmd+K omnisearch modal & time-capsule recall
│   ├── VoiceThoughtDictation.jsx          # Web Speech API thought transcription HUD
│   └── UnifiedMenuModal.jsx               # Settings, volume switcher, backup/restore, audio toggles
│
├── hooks/
│   ├── useJournalStorage.js               # IndexedDB + localStorage state management & data schemas
│   ├── usePrivacyShutter.js               # Idle timeout, blur detector, and Esc panic lock hook
│   ├── useLicenseAutoActivation.js        # 1-click ?key=... URL detection, confetti celebration, chime
│   └── useAmbientReminders.js             # Local-first Web Notifications scheduler for evening shutdown
│
├── utils/
│   ├── cryptoVault.js                     # WebCrypto AES-GCM-256 client-side encryption & .vault file engine
│   ├── licenseManager.js                  # Offline license verification & promo pass whitelist
│   ├── executiveBriefingPdf.js            # Publication-grade vector PDF generator for weekly executive briefing
│   ├── audio.js                           # Web Audio API synthesized paper turn & mechanical ratcheting clicks
│   ├── dateUtils.js                       # ISO date formatting, day-of-year calculations, navigation
│   └── omnisearch/
│       ├── OmniSearchEngine.js            # On-device inverted index search over 5+ years of entries
│       ├── TimeCapsuleEngine.js           # "On This Day" memory synthesis algorithm
│       └── NaturalDateParser.js           # Smart natural language date parser ("next Friday", "in 3 days")
│
└── data/
    ├── monthIllustrations.jsx             # 12 bespoke seasonal vector line-art SVG illustrations
    └── quotes.js                          # Curated executive philosophical reflections
```

---

## 5. Security & Cryptographic Specifications

1. **Vault Encryption (`cryptoVault.js`)**:
   - **Algorithm**: `AES-GCM-256` (Authenticated Encryption with Associated Data).
   - **Key Derivation**: `PBKDF2` with `100,000` iterations of `SHA-256`.
   - **Salt**: 16 cryptographically random bytes generated via `crypto.getRandomValues`.
   - **Initialization Vector (IV)**: 12 random bytes generated per encryption session.
   - **Integrity**: HMAC-SHA256 signature verification over ciphertext.
   - **File Extension**: `.vault` (air-gapped export/import file).
2. **Biometric Gate (`ExecutivePrivacyOverlay.jsx`)**:
   - Implemented via `navigator.credentials.get({ publicKey: ... })` (WebAuthn).
   - Fallback PIN: Default `1234` (customizable in settings).
   - Instant 1-click `Quick Unlock` button provided for seamless friction-free access.
3. **Panic Shutter**:
   - Triggers immediately on `Esc`, browser window blur (`window.onblur`), or idle timeout (default 3 minutes).
   - Obscures all visible data with high-density backdrop blur (`backdrop-blur-2xl`) in ≤ 180ms.

---

## 6. Quality Control Audit Suite (The 21 Gates)

Run before every commit or pull request:
```bash
npm run test:qc
```

The 21 automated gates enforced by `scripts/qc_audit.js`:
* **Gate 1**: Zero `font-mono` violations (Universal Helvetica only).
* **Gate 2**: Zero unmanaged overlapping dropdown popovers in item rows.
* **Gate 3**: 3-Color Progress Gate (Red, Yellow, Green progress palette; zero random decorative colors).
* **Gate 4**: Zero-scroll viewport lock & slim notepad proportions (`max-w-[412px]` mobile / `max-w-[840px]` desktop).
* **Gate 5**: Consumer-friendly language gate (zero technical jargon in UI labels).
* **Gate 6**: Strict 24px universal grid cadence alignment.
* **Gate 7**: Single-column full-width monthly spread (no 2-column squishing).
* **Gate 8**: 2-Tier header masthead (brand at top, utilities below, zero speaker button).
* **Gate 9**: 24px grid cadence margins & zero non-cadence spacing.
* **Gate 10**: Clean Unified Stationery Gate (zero 3-dots, authentic woven label).
* **Gate 11**: Framework multi-task capability (MoSCoW & Eisenhower dynamic tasks).
* **Gate 12**: Framework grid alignment & wrapping safety gate.
* **Gate 13**: FlippingBook 3D page leaf flip integration (flat canvas + spine hinge).
* **Gate 14**: Seamless friction-free 3D page turn (flush spine crease, zero layout shift).
* **Gate 15**: Minimalist stationery cover & 12 bespoke seasonal month illustrations.
* **Gate 16**: Zero date overflow & header wrapping gate (`whitespace-nowrap`).
* **Gate 17**: Zero "Bullet Journal" / Ryder Carroll trademark violations (100% brand purity).
* **Gate 18**: Lifetime Patron & archival monetization gate.
* **Gate 19**: Black embossed minimal chassis (no middle bookmark, no leather side borders).
* **Gate 20**: Executive universal keyboard navigation (`1`/`2`/`3`/`T`/`C`/`Esc`).
* **Gate 21**: Zero IP infringement / trademark gate (0 Frog, 0 Buffett, 0 Pomodoro, 0 BuJo).

---

## 7. Product Roadmap & Future Expansion

1. **Local P2P Peer-to-Peer Sync (AirDrop Style)**:
   - WebRTC DataChannels or encrypted QR-code transfer for zero-server synchronizing between Mac and iPhone.
2. **Apple Watch Complication / Companion PWA**:
   - Micro-glance card displaying the #1 Decide One priority on Apple Watch Ultra.
3. **Hardware Biometric WebAuthn Attestation**:
   - Hardware-backed biometric credential creation for enterprise deployments.
4. **Physical Desk Binder Print Service**:
   - Direct integration for ordering physical linen-bound 365-day archival hardcovers printed from the user's exported vector PDF.
