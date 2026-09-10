# PRIMACY • The Executive Priority Instrument
# Master Architectural Blueprint & System Specification

> **Authoritative Engineering & Design Blueprint**  
> Written for executive engineers, designers, and autonomous AI agents maintaining or extending Primacy.  
> Details the complete system architecture, cognitive design invariants, 21 QC audit gates, cryptographic data schemas, animation physics, and launch strategy.

---

## 1. Executive Summary & Brand Genesis

**PRIMACY** is a strictly on-device, luxury-stationery-grade digital executive productivity instrument built with **React 19**, **Vite**, and **Tailwind CSS**. 

### The Core Philosophy
> *"Software doesn't execute; the human executes. Primacy prioritises."*

Unlike noisy SaaS productivity tools (Notion, Asana, Monday, Todoist) that trap executives in infinite scrollbars, collaborative comments, and recurring monthly subscriptions, Primacy provides an uncompromised physical-stationery experience directly on screen:
* **The Primacy Triad**: The human mind can only execute three needle-moving outcomes per day. Primacy forces the hard executive choices early so leaders accomplish what matters most.
* **100% On-Device Sovereignty**: Zero cloud servers, zero trackers, zero telemetry, zero AI model training. All executive thoughts, unannounced M&A notes, board decks, and strategy documents persist strictly on the user's local device.
* **Anti-SaaS Lifetime Ownership**: $24 USD / ₹1,999 INR one-time purchase. Pay once, own for life.

---

## 2. System Invariants & Non-Negotiables

Every engineer and AI agent working on Primacy must preserve these invariants without exception:

1. **Strict 24px Universal Swiss Grid Cadence**:
   - Every input line height, container margin, padding, divider line, and paper grid coordinate aligns to a mathematical `24px` baseline (`h-6`, `h-12`, `p-6`, `gap-6`, `leading-6`).
   - Ensures zero vertical or horizontal layout drift when turning pages or switching views.
2. **Zero-Scroll Viewport Lock (`100vh`)**:
   - The entire application fits within `100vh` (`max-h-screen overflow-hidden`).
   - Window-level scrolling is strictly disabled inside the notebook canvas. Scrollable internal streams use `.pocket-scroll` slim scrollbars.
3. **Pure Neutral Gallery Stage**:
   - The stationery notebook floats on calm studio gallery stone (`#EAEAE7` in light mode, `#0B0B0D` in dark mode).
   - No faux wood textures, desk blotters, or skeuomorphic clutter.
4. **Authentic Folded Woven Twill Brand Tag**:
   - The top woven fabric tag tucked under the paper edge boldly displays **`PRIMACY`** in crisp, uppercase typography (`11px font-bold tracking-[0.28em]`).
   - Modeled on bespoke luxury Swiss stationery woven tags.
5. **Universal Helvetica Typography (Zero `font-mono`)**:
   - Typeset entirely in clean Swiss sans-serif (`font-sans`). Monospaced fonts are strictly banned by Rule 1 of the QC audit suite.
6. **21/21 Quality Control Compliance**:
   - `npm run test:qc` must pass with 100% compliance across all 21 automated gates before any code is committed.

---

## 3. Technology Stack & Key Dependencies

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Runtime / UI** | React 19.0.0 | Latest concurrent rendering, zero external state library overhead |
| **Bundler / Dev** | Vite 6.4.3 | Instant HMR, sub-second production builds (port 3000) |
| **Styling** | Tailwind CSS 3.4.17 | Atomic utility classes, strict 24px grid cadence tokens |
| **Vector Icons** | Lucide React 1.16.0 | Cohesive 1.5px / 2px stroke iconography |
| **Client Storage** | IndexedDB + LocalStorage | 100% local persistence with automatic schema migrations |
| **Cryptography** | WebCrypto API | Client-side AES-GCM-256 vault encryption & PBKDF2 key derivation |
| **Biometrics** | WebAuthn (`navigator.credentials`) | Touch ID, Face ID, and Windows Hello hardware unlock |
| **Voice Dictation** | Web Speech API | 100% on-device thought transcription (`Cmd+Shift+V`) |
| **Audio Haptics** | Web Audio API | Zero-asset synthesized paper turn and mechanical clasp clicks |
| **PDF Export** | Canvas / Vector Engine | Crisp 2-page A4/Letter Executive Weekly Briefing generation |
| **Celebrations** | canvas-confetti 1.9.4 | Frictionless visual feedback on Patron license auto-activation |

---

## 4. Product Features & Cognitive Workflow

### 1. The Daily Executive Spread (Bi-Fold Panoramic View)
* **Left Page (The Primacy Execution Engine)**:
  - Date Header with day-of-year index (e.g., `Day 251 / 365`) and active completion ring.
  - The Primacy Triad: 3 non-negotiable needle-movers with category tagging and priority states.
  - Rapid Logging Stream: Quick-capture task stream with 6 intuitive bullet glyphs (`To Do`, `Done`, `Missed`, `Moved`, `Star`, `Note`).
  - Single-line minimal **Close Day** button for evening shutdown.
* **Right Page (Habit Compounding & Evening Closure)**:
  - 5-Day Compounding Habit Loop: Visual streak tracking across non-negotiable personal disciplines.
  - Evening Reflection Card: Daily gratitude, key executive decision review, and Lao Tzu philosophical reflection.
  - Swiss Footer Legend: Standardized vector icons and uppercase tracking.

### 2. The 9 Cognitive Decision Frameworks
1. **The Primacy Rule of 3**: 3 high-impact daily outcomes.
2. **Ivy Lee Method (1918)**: 6 sequential single-task priorities.
3. **Eisenhower Matrix**: Urgent vs. Important strategic quadrant triage.
4. **MoSCoW Method (1994)**: Must, Should, Could, Won't enterprise delivery.
5. **The 1-3-5 Rule**: 1 Big, 3 Medium, 5 Small task allocation.
6. **Pareto 80/20 (1896)**: The vital 20% high-leverage focus.
7. **ABCDE Method**: Consequence-driven alphabetical task grading.
8. **Timeboxing Cadence**: Dedicated uninterrupted focus blocks.
9. **Single-Task Focus**: Elimination of cognitive residue.

### 3. Multi-Volume Sovereign Domains
* `vol_strategy`: Corporate strategy, board memos, financing covenants.
* `vol_life`: Personal health, conditioning, family sanctuary.
* `vol_ventures`: Side investments, angel portfolio, advisory boards.
* `vol_codex`: Intellectual archive, book notes, private reflections.

### 4. Sub-Millisecond Omnisearch (Cmd+K)
* Inverted index / trie query over 5+ years of entries (2,000+ daily logs) in memory under 2ms.
* "On This Day" time-capsule recall (1 year ago, 6 months ago, 90 days ago).

### 5. Tactical Privacy Shutter & Biometric Hardware Gate
* Instant panic lock on `Esc`, window blur, or idle timeout.
* Multi-layer frosted diffraction glass obscures confidential data in $\le 180\text{ms}$.
* Touch ID / Face ID hardware unlock + fallback PIN (`1234`).

---

## 5. Marketing Landing Page & Apple Aesthetics

Located at `http://localhost:3000/?view=landing` (or `#overview`):
1. **Hero Section**:
   - Headline: **`One priority. Zero noise.`**
   - Live interactive bi-fold spread preview with real-time tone, grid, and ink customizations.
2. **Forensic Craftsmanship Macro Close-Ups (`#craft`)**:
   - 01. Woven Twill Brand Tag (45° herringbone weave, micro-stitched `PRIMACY`).
   - 02. 24K Specular Gold Foil Stamping (0.4mm hydraulic blind deboss depth).
   - 03. 24px Universal Swiss Coordinate Grid (zero-bleed capillary ink drying).
   - 04. 0.18s Tactical Privacy Shutter (air-gapped cryptographic defense).
3. **Responsive 3D Hardware Ecosystem (`#devices`)**:
   - 3D MacBook Pro 16" Space Black with Liquid Retina XDR screen & camera notch.
   - 3D iPad Pro M4 with magnetic Apple Pencil Pro.
   - 3D iPhone 16 Pro with contoured titanium frame & Dynamic Island.

---

## 6. Licensing, Monetization & Checkout

* **Pricing**: $24 USD / ₹1,999 INR One-Time Lifetime License.
* **Dual-Rail Checkout**: Dodo Payments (Global Cards/Apple Pay in USD + Indian Domestic UPI QR).
* **1-Click URL Auto-Activation**: Detecting `?key=PRIMACY-PATRON-2026` triggers instant cryptographic verification, audio celebration chime, confetti, and URL cleanup without page reload.
* **In-App 1-Click Pass**: Prominent "Unlock Now (1-Click)" button in `PatronUpgradeModal.jsx`.

---

## 7. Automated Quality Control Verification (21 Gates)

```bash
npm run test:qc
```

All 21 automated rules in `scripts/qc_audit.js` must pass 100%:
* Rule 1: Zero `font-mono` violations (Universal Helvetica only).
* Rule 2: Zero unmanaged overlapping dropdown popovers in item rows.
* Rule 3: 3-Color Progress Gate (Red, Yellow, Green progress palette; zero random decorative colors).
* Rule 4: Zero-scroll viewport lock & slim notepad proportions (`max-w-[412px]` mobile / `max-w-[840px]` desktop).
* Rule 5: Consumer-friendly language gate (zero technical jargon in UI labels).
* Rule 6: Strict 24px universal grid cadence alignment.
* Rule 7: Single-column full-width monthly spread (no 2-column squishing).
* Rule 8: 2-Tier header masthead (brand at top, utilities below, zero speaker button).
* Rule 9: 24px grid cadence margins & zero non-cadence spacing.
* Rule 10: Clean Unified Stationery Gate (zero 3-dots, authentic sewn label).
* Rule 11: Framework multi-task capability (MoSCoW & Eisenhower dynamic tasks).
* Rule 12: Framework grid alignment & wrapping safety gate.
* Rule 13: FlippingBook 3D page leaf flip integration (flat canvas + spine hinge).
* Rule 14: Seamless friction-free 3D page turn (flush spine crease, zero layout shift).
* Rule 15: Minimalist stationery cover & 12 bespoke seasonal month illustrations.
* Rule 16: Zero date overflow & header wrapping gate (`whitespace-nowrap`).
* Rule 17: Zero "Bullet Journal" / Ryder Carroll trademark violations (100% brand purity).
* Rule 18: Lifetime Patron & archival monetization gate.
* Rule 19: Black embossed minimal chassis (no middle bookmark, no leather side borders).
* Rule 20: Executive universal keyboard navigation (`1`/`2`/`3`/`T`/`C`/`Esc`).
* Rule 21: Zero IP infringement / trademark gate (0 Frog, 0 Buffett, 0 Pomodoro, 0 BuJo).
