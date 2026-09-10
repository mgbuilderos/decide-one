# PocketBook — Master Product & Feature Architecture (`feature.md`)

> **Executive Capsule**: PocketBook is a hyper-minimalist, luxury bi-fold analog stationery journal with an embedded cognitive productivity engine. It combines an authentic Japanese Traveler's notebook physical feel (sewn fabric label, natural gutter crease, 24px universal grid cadence, and universal Helvetica typography) with an open-source suite of **9 public-domain productivity frameworks**, a **3-color dynamic progress system**, and an **interactive morning daily diagnostic algorithm** that routes users to their optimal daily methodology based on their workload, cognitive friction, and execution style.

---

## 🧭 Executive Summary Capsule

| Core Pillar | Key Implementation Decision | Consumer Rationale |
| :--- | :--- | :--- |
| **Physical Stationery Metaphor** | Enlarged sewn woven fabric brand label (`POCKETBOOK`, `height: 32px; padding: 0 24px`) tied flush to the notebook's top edge with 0px gap and realistic dashed seam stitching; soft organic gutter crease; zero harsh black tie cord; zero floating 3-dot dropdowns. | Authentic bespoke stationery aesthetic; eliminates digital SaaS clutter; feels like an heirloom notebook. |
| **Single-Patch Top Menu** | The top navigation is unified into ONE single continuous capsule patch containing `[ Daily | Monthly ]`, `[ Method: <Name> ▾ ]`, `[ XX% Activity ]`, and `[ ⚙ Menu ]` separated by subtle hairlines. | Eliminates scattered floating pill buttons for a calm, purposeful minimalist header. |
| **Dedicated Full-Page Frameworks** | Daily task execution stream ("Today") is rendered **only** when using the `Top 3` (Rule of 3) method. For all other 8 frameworks, the framework occupies the **full left page** without redundant task streams. | Prevents task list duplication; provides generous breathing room and focus on the chosen mental model. |
| **Zero Boxes & Zero Grids** | Removed all nested gray card boxes (`bg-black/[0.015]`, `border border-black/[0.08]`) and table containers in both Habits and Frameworks. All tasks and habits sit directly on paper lines with circular checkmarks. | Eliminates spreadsheet/clutter feel; delivers pure minimalist luxury stationery clarity. |
| **Mathematical Grid Sync** | Strict universal 24px grid cadence ($Y \equiv 0 \pmod{24}$, `background-size: 24px 24px`, `p-6` canvas padding). Spanning DateHeader height = 48px ($2 \times 24\text{px}$). | Every line, box, and checkbox aligns with pixel-level mathematical precision across Dots and Square Grid. |
| **Universal Typography** | Strict Universal Helvetica sans-serif (`font-sans`); zero `font-mono` across the codebase. Identical enlarged typography (`text-sm sm:text-base font-bold`) across Top 3, Habits, Today, and Reflect. | Clean, calm Swiss typographic hierarchy; Top 3 and Habits align at the exact same vertical baseline. |
| **Consumer Language Gate** | Zero technical jargon (no "Rapid Log", "Hard Tasks", "Daily Rituals", "BuJo Syntax"). Replaced with intuitive consumer prompts: "What would you like to do today?", "Your 3 most important tasks", "Daily wellness & routines". | Welcoming, intuitive, human-centered language without intimidating methodology jargon. |
| **3-Color Dynamic Progress** | Default baseline is distraction-free Black & White. Completed items transition to **Ink Green (`✓`)**. Missed items on past days transition to **Ink Red (`✕`)**. Dynamic score transitions: Red (<40%) $\rightarrow$ Yellow (40–79%) $\rightarrow$ Green (80%+). | Visual progress feedback that rewards completion while keeping active input calm and monochrome. |
| **Spread Proportions & Layout** | Full-width spanning DateHeader across both pages. Left Page: Framework (or Top 3 + Today stream). Right Page: 50/50 even split between Habits (`h-1/2`) and Evening Reflection (`h-1/2`). Viewport zero-scroll lock (`h-screen overflow-hidden`). | Balanced bilateral spread; eliminates cognitive clutter and unmanaged window scrolling. |
| **9 Open-Source Frameworks** | Suite of 9 unencumbered, public-domain cognitive frameworks (Rule of 3, Ivy Lee, Eat That Frog, Eisenhower Matrix, MoSCoW, ABCDE, 1-3-5 Rule, Pareto 80/20, Buffett 5/25). | Allows users to switch mental models based on the day's specific cognitive demands without legal/trademark risk. |
| **Morning Daily Diagnostic** | 3-question interactive diagnostic analyzing workload intensity, primary obstacle, and execution preference to algorithmically recommend and apply the best framework. | Eliminates decision fatigue at the start of the day; guides users to the right tool for their immediate mindset. |

---

## 📐 Detailed Architectural Systems

### 1. Physical Stationery & Bi-Fold Spread
- **Enlarged Sewn Brand Tag (0px Gap)**: Substantial woven black fabric tag (`POCKETBOOK`, `height: 32px`, `padding: 0 24px`, `font-size: 11px`, `letter-spacing: 0.20em`) attached directly to the top edge of the notebook paper canvas with zero gap and an authentic micro-perforated dashed seam stitch line (`.woven-fabric-tag`). Clicking it opens the unified menu.
- **Single-Patch Top Navigation**: Replaced disjointed floating buttons with a unified capsule patch (`HeaderToolbar.jsx`) dividing view switches, framework selector, activity score, and menu settings with subtle 1px hairlines.
- **Radical Decluttering (Zero Boxes & Grids)**:
  - In Habits: Removed gray consistency card and table border container. Habits render as clean unboxed ruled rows directly on the paper.
  - In Frameworks: Removed all nested gray card boxes, outer borders, and scroll containers across all 9 frameworks.
- **Dedicated Full-Page Framework Mode**:
  - `Rule of 3` (Top 3 Priorities): 3 high-impact outcomes + "Today" rapid log execution stream below it.
  - All other 8 Frameworks (Eisenhower, Ivy Lee, 1-3-5, Eat That Frog, MoSCoW, Pareto, Buffett, ABCDE): Take the entire left page (`isFullPage={true}`) with generous spacing, zero task list duplication, and focused clarity.
- **Center Gutter Crease**: Replaced the harsh black elastic cord (`connecting-tie-cord`) with an organic paper fold crease (`notebook-spine-crease`) featuring subtle physical curvature lighting.
- **Paper Editions**:
  - `Dot-Grid Edition` (`paper-dots`): 24px subtle bone-paper dot grid.
  - `Square Grid Edition` (`paper-square`): 24px mathematical quad grid.
  - `Plain Edition` (`paper-plain`): Pristine velvety warm bone paper with zero markings.
- **Bi-Fold Bilateral Spread**:
  - **Left Page**: Open-Source Framework + Today Task Stream (`RapidLogSection`).
  - **Right Page**: 50% Habits Consistency Tracker + 50% Evening Reflection & Curated Wisdom.
  - **Spanning Top Line**: Unified `DateHeader` (48px height) spanning across both pages with date on left and navigation on right.
  - **Stamped Footer Line**: 24px bottom legend documenting symbols and paper edition mark.
- **Zero-Scroll Viewport**: The outer shell enforces `h-screen max-h-screen overflow-hidden` so the entire notebook fits within the viewport.

### 2. Universal 24px Grid Cadence ($Y \equiv 0 \pmod{24}$)
Every element in PocketBook aligns to an absolute 24px vertical grid cadence:
- Paper pattern grid repeat: $24\text{px} \times 24\text{px}$.
- Notebook padding: `p-6` ($24\text{px}$).
- DateHeader: $48\text{px}$ ($2 \times 24\text{px}$).
- Section header bars: $24\text{px}$ height (`h-[24px] leading-[24px] mb-1.5`).
- Task and habit rows: $24\text{px}$ / $48\text{px}$ grid row increments.
- Page mark footer: $24\text{px}$ height (`h-[24px]`).

### 3. Strict Universal Helvetica Typography
- Pure Swiss Modernist typography using `font-sans` (Helvetica, -apple-system, system-ui).
- Zero `font-mono` allowed anywhere in the codebase (enforced by QC Gate Rule 1).
- Harmonized title scale:
  - **`TOP 3`** / Framework Name: `text-sm sm:text-base font-bold uppercase tracking-wider`
  - **`HABITS`**: `text-sm sm:text-base font-bold uppercase tracking-wider`
  - **`TODAY`**: `text-sm sm:text-base font-bold uppercase tracking-wider`
  - **`REFLECT`**: `text-sm sm:text-base font-bold uppercase tracking-wider`
- Exact Baseline Alignment: Top 3 (Left Page) and Habits (Right Page) start at the identical vertical pixel baseline immediately beneath the DateHeader.

### 4. 3-Color Dynamic Progress Palette
- **Monochrome Default**: When tasks are added or pending, they remain in clean Black & White.
- **Done (`✓`)**: When completed, the glyph turns **Archival Bamboo Green** (`#16A34A`), the checkbox fills with green, and the task strikes through.
- **Missed (`✕`)**: When inspecting past dates, any unfinished task displays an **Archival Vermilion Red** cross (`✕`) and red border.
- **Activity Score Capsule**: SVG ring in the top header transitions dynamically:
  - $< 40\%$: Red (`progress-ink-red`)
  - $40\% – 79\%$: Yellow / Amber (`progress-ink-yellow`)
  - $\ge 80\%$: Green (`progress-ink-green`)
- **Prohibition**: Zero decorative chromatic colors (no `bg-blue-100`, `bg-purple-100`, etc.).

---

## 🏛️ The 9 Open-Source Productivity Frameworks

All 9 frameworks are 100% public domain, historical, or unencumbered conceptual models:

### Cluster 1: Focus & Prioritization
1. **Rule of 3 (Top 3 Priorities)**
   - *Philosophy*: Human working memory thrives on 3 high-impact outcomes.
   - *Slots*: Priority 01: The Needle Mover, Priority 02: Strategic Core, Priority 03: Essential Anchor.
   - *Best For*: High-impact daily clarity without overwhelm.
2. **Ivy Lee Method (6 Sequential Priorities)**
   - *Philosophy*: Created in 1918 by Ivy Lee for Charles M. Schwab (Bethlehem Steel).
   - *Slots*: 6 prioritized tasks executed strictly one-by-one in numerical order. Never move to #2 until #1 is complete.
   - *Best For*: Eliminating context-switching and procrastination.
3. **Eat That Frog**
   - *Philosophy*: Inspired by Mark Twain's quote: *"If it's your job to eat a frog, it's best to do it first thing in the morning."*
   - *Slots*: 1 The Frog (High friction, tackle first) + 3 Supporting Tadpoles.
   - *Best For*: Breaking psychological dread and chronic avoidance.

### Cluster 2: Decision & Matrix
4. **Eisenhower Matrix (4 Quadrants)**
   - *Philosophy*: Dwight D. Eisenhower (1954 speech); distinguishes urgency from importance.
   - *Slots*: Q1: Do First (Urgent & Important), Q2: Schedule (Important, Not Urgent), Q3: Delegate (Urgent, Not Important), Q4: Eliminate (Don't Do).
   - *Best For*: Strategic triage and distinguishing emergencies from real progress.
5. **MoSCoW Method**
   - *Philosophy*: Dai Clegg (1994); public domain Agile scope triage.
   - *Slots*: Must Do (Non-negotiable), Should Do (Important), Could Do (Nice to have), Won't Do Today (Explicitly deferred).
   - *Best For*: High-pressure deadlines and strict project delivery.
6. **ABCDE Method**
   - *Philosophy*: Consequence-driven task grading based on the penalty of non-completion.
   - *Slots*: A (Must Do - severe fallout), B (Should Do - mild fallout), C (Nice to Do), D (Delegate), E (Eliminate).
   - *Best For*: Disciplined, consequence-driven executive triage.

### Cluster 3: Capacity & Leverage
7. **The 1-3-5 Rule**
   - *Philosophy*: Realistic daily capacity balancing major wins with administrative chores.
   - *Slots*: 1 Big Thing (Major outcome), 3 Medium Things (Core responsibilities), 5 Small Things (Quick wins).
   - *Best For*: Preventing over-commitment and balancing workloads.
8. **Pareto 80/20 Focus**
   - *Philosophy*: Vilfredo Pareto (1906); 80% of outcomes come from 20% of effort.
   - *Slots*: Vital 20% (High-leverage tasks driving 80% output) vs Operational 80% (Routine maintenance).
   - *Best For*: Maximizing return on cognitive energy and time investment.
9. **Warren Buffett's 5/25 Rule**
   - *Philosophy*: Two-list strategy taught to pilot Mike Flint. Circle top 5 priorities; treat the remaining 20 as an explicit "Avoid-at-all-costs" distraction list.
   - *Slots*: Top 5 Focus (Exclusive priority) vs Avoid List (Seductive distractions to actively refuse).
   - *Best For*: Ruthless discipline and eliminating tempting side projects.

---

## 🤖 Morning Daily Diagnostic & Recommendation Algorithm

The **Daily Diagnostic Modal** (`DailyDiagnosticModal.jsx`) interviews the user with 3 quick questions upon starting the day:

### Diagnostic Questionnaire
1. **Workload Intensity**:
   - `💼 Intense`: Heavy workload, tight deadlines, high pressure.
   - `⚖️ Balanced`: Standard mix of deep work and routines.
   - `☕ Leisure`: Creative exploration, reading, rest, low pressure.
2. **Primary Obstacle / Mindset**:
   - `🐸 Procrastination`: Dreading one difficult task.
   - `🌪️ Overwhelm`: Too many competing items, need triage.
   - `🔀 Distraction`: Scattered attention, need sequential focus.
   - `⚡ Leverage`: Seeking 80% output from 20% vital effort.
   - `✂️ Scope`: Need to ruthlessly cut non-essentials.
   - `🛑 Seductive Distractions`: Need to protect top priorities from side ideas.
3. **Execution Structure**:
   - `📦 Tiered`: 1 Big Thing + Medium + Small.
   - `📊 Matrix`: 4 decision quadrants (Urgent vs Important).
   - `🔢 Sequential`: 1-by-1 in strict numerical order.
   - `🎖️ Consequence`: Graded A through E by risk level.

### Routing Decision Rules
```javascript
if (challenge === 'procrastination') return 'eat_that_frog';
if (challenge === 'overwhelm' || structure === 'matrix') return 'eisenhower';
if (challenge === 'distraction' || structure === 'sequential') return 'ivy_lee';
if (challenge === 'leverage') return 'pareto';
if (challenge === 'scope') return 'moscow';
if (challenge === 'discipline') return 'buffett';
if (structure === 'consequence') return 'abcde';
if (structure === 'tiered' || (intensity === 'balanced' && challenge !== 'leverage')) return 'one_three_five';
if (intensity === 'leisure') return 'rule_of_3';
return 'rule_of_3'; // default fallback
```

---

## 🛡️ Quality Control (QC) Audit Gates Matrix

PocketBook enforces 10 automated QC audit rules in `scripts/qc_audit.js`:

| Rule # | Gate Description | Validation Mechanism |
| :--- | :--- | :--- |
| **Rule 1** | **Zero `font-mono`** | Scans all `.jsx`, `.js`, and `.css` files for `font-mono`. Universal Helvetica only. |
| **Rule 2** | **Zero Unmanaged Popovers** | Verifies no floating overlapping dropdown state exists in task row components. |
| **Rule 3** | **3-Color Progress Gate** | Rejects forbidden chromatic colors (`bg-blue-100`, `text-purple-600`, etc.). Only archival red, yellow, and green allowed. |
| **Rule 4** | **Zero-Scroll Viewport Lock** | Verifies `App.jsx` enforces `overflow-hidden` and `h-screen`, plus `max-w-[412px]` / `max-w-[840px]`. |
| **Rule 5** | **Consumer-Friendly Language** | Rejects forbidden jargon: `'Rapid Log'`, `'Hard Tasks'`, `'Daily Rituals'`, `'BuJo Syntax'`. |
| **Rule 6** | **24px Grid Cadence Alignment** | Checks `index.css` for `background-size: 24px 24px` and `App.jsx` for `p-6 embossed-notebook`. |
| **Rule 7** | **Single-Column Monthly Layout** | Ensures `MonthlyLogSpread.jsx` contains zero multi-column squishing classes. |
| **Rule 8** | **Minimalist Header Masthead** | Verifies `HeaderToolbar.jsx` contains zero speaker/volume controls. |
| **Rule 9** | **24px Cadence Spacing** | Rejects non-cadence gaps like `space-y-[16px]` or `gap-[12px]`. |
| **Rule 10** | **Clean Unified Stationery** | Rejects floating 3-dot menus (`MoreHorizontal`) and harsh black cords (`connecting-tie-cord`); verifies sewn label attachment. |
| **Rule 11** | **Framework Multi-Task Capability** | Guarantees multi-task dynamic arrays for MoSCoW & Eisenhower Matrix; prohibits hardcoded `[0]` single-task limits. |
| **Rule 12** | **Framework Grid Alignment & Safety** | Enforces exact fixed header heights (`h-[28px]`) and `whitespace-nowrap` on Eisenhower quadrant titles to eliminate broken line wrapping and column misalignment. |
| **Rule 13** | **Spine-Hinged 3D Page Leaf Flip** | Enforces that only the 50% width page sheet turns across the central spine (`page-leaf-container` with `leaf-turn-next`/`prev`); keeps `.embossed-notebook` stationary flat on the desk with zero whole-canvas rotation. |

---

## 📖 FlippingBook-Grade 3D Physical Spine-Hinged Page Turn Architecture

PocketBook incorporates a bespoke, hardware-accelerated 3D physical page turn engine inspired by high-end digital publishing software (e.g., [FlippingBook](https://flippingbook.com/fr/page-flip-pdf)). 

In luxury stationery journals, the notebook cover rests completely flat and grounded on the desk. Navigating between days turns **ONLY THE 50% PAGE SHEET** across the central spine crease, revealing the underlying day with front and back paper faces, specular highlights, dynamic cast shadows, and zero visual pop.

### 1. Physical Anatomy & Mechanics
- **Stationary Grounded Notebook Canvas (`.embossed-notebook`)**:
  - The outer leather backing, stitched perimeter, and sewn woven brand tag (`POCKETBOOK`) stay **100% stationary and flat on the desk** (`transform: translateZ(0)`).
  - Enveloped in a $2600\text{px}$ 3D perspective field (`perspective: 2600px; transform-style: preserve-3d`) centered at $(50\%, 50\%)$.
- **Spine-Hinged 3D Turning Leaf (`.page-leaf-container`)**:
  - Spans exactly half the notebook width ($50\%$), from top header line (`h-[48px]`) to bottom stamped legend line (`h-[24px]`).
  - **Forward Turn (Next Day — `.leaf-turn-next`)**:
    - Anchored at center spine (`left: 50%`, `transform-origin: 0% 50%`).
    - Turns $0^\circ \rightarrow -180^\circ$ over $0.42\text{s}$ with `cubic-bezier(0.28, 0, 0.2, 1)`.
    - **Flush Spine Crease Geometry**: Local left is strictly $0\text{px}$ radius and local right is $26\text{px}$ radius, so when rotated $180^\circ$, the spine seam remains 100% flush ($0\text{px}$ gap) and outer edges match the notebook's rounded corners.
    - **Front Face (`.leaf-face-front`)**: Outgoing day's Right Page (Navigation, Habits, Reflection, Page Number).
    - **Back Face (`.leaf-face-back`)**: Incoming day's Left Page (New Date display, Framework, Rapid Log, Stamped Legend) rotated `rotateY(180deg)`.
    - **Base Reveal**: Under the lifting right page, the incoming day's Right Page is revealed immediately.
    - **Landing & Frame Synchronization**: The leaf settles flat at $-180^\circ$ onto the left page. The state update (`setCurrentDate`, `setFlipState('idle')`) is executed with React closure immunity via `pendingTurnRef` and `flipTimerRef`, guaranteeing seamless completion.
  - **Backward Turn (Previous Day — `.leaf-turn-prev`)**:
    - Anchored at center spine (`left: 0%`, `transform-origin: 100% 50%`).
    - Turns $0^\circ \rightarrow +180^\circ$ over $0.42\text{s}$ onto the right page, revealing the previous day.

### 2. Optical Dynamics: GPU-Accelerated Shading & Zero Opacity Block Landing
- **Zero-Block Shading Overlays (`.leaf-face-front::after` & `.leaf-face-back::after`)**: Soft ambient occlusion gradients that peak subtly and clear strictly to zero opacity by 85% of the turn, ensuring that as the leaf lands flat ($150^\circ \rightarrow 180^\circ$), all shading is completely transparent with zero dark opacity block or flash.
- **Continuous Edge-to-Edge Grid (`background-origin: padding-box !important`)**: Extends dot-grid patterns across the entire leaf sheet, eliminating blank white padding halos.
- **Exact Subpixel Alignment (Zero Layout Shift)**: Leaf faces maintain single-layer 24px padding (`p-6`) matching the stationary spread, eliminating double-padding jumps during flip transitions.

### 3. Personalized Front Cover & Opening Visual (`NotebookCover.jsx`)
- **Physical Leatherette Canvas**: Premium dark leatherette cover (`#18181B`) with realistic debossed perimeter dashed stitching line (`.cover-stitch-border`) and substantial sewn woven fabric label (`POCKETBOOK`).
- **Personalized Owner Nameplate**: Inline editable nameplate (defaults to *"Maulik's PocketBook"*), stored persistently in `settings.ownerName`.
- **Debossed Month & Year**: Stamped dynamic month and year (e.g. *"September 2026"*), current weekday, and day of the month.
- **Open Today's Journal Action**: Single prominent CTA button that plays page audio and smoothly transitions the user directly into today's spread (`new Date()`).
- **Cover Quick Toggle**: Users can toggle between the open notebook spread and closed leather cover anytime via the top header toolbar (`Cover` button) or unified menu.

### 4. Streamlined 4-Tile Stationery Dashboard (`UnifiedMenuModal.jsx`)
Replaced text-heavy scrolling paragraphs with an ultra-clean, minimalist 4-tile stationery control dashboard:
- **Tile 1: Morning Alignment**: One-click launcher for the 3-question `DailyDiagnosticModal`.
- **Tile 2: 9-Method Quick Grid**: Fast 3x3 interactive method switcher with clear active checks and quick link to the Methodology Guide.
- **Tile 3: Owner Nameplate**: Fast inline editing of the journal owner name and instant "View Leather Cover" trigger.
- **Tile 4: Stationery & Preferences**: 3-option paper selector (Dot-Grid, Square Grid, Plain), Light/Dark theme toggle, sound effects toggle, and JSON backup export.

### 5. Multi-Day Methodology Duration Engine (`DailyDiagnosticModal.jsx`)
When diagnosing or applying a framework, users can choose their intended execution horizon in Step 2:
- 📅 **Today Only** (1 Day): Applies solely to the current date.
- ⚡ **Next 3 Days** (Sprint): Consecutively applies the framework across today and the next 2 days.
- 🗓️ **This Week** (7 Days): Applies the framework across today and the next 6 days.
- ⚙️ **Set as Default**: Applies to today and updates default settings so all future dates inherit the framework.

---

## 🎧 Tactile Interactions & Delights
- **Audio Feedback**: Authentic mechanical feedback for pencil clicks, page turns, habit completion, and error states (muteable via Unified Menu).
- **FlippingBook 3D Page Turn**: True whole-journal 3D rotational mechanics with specular sheen, cast shadow, and edge trigger tabs.
- **Confetti Engine**: Triggers celebratory paper confetti upon conquering the day's framework tasks or habits.
- **Physical Print Support**: Dedicated `@media print` stylesheets formatting the notebook as a clean physical spread for real-world printing.
- **Data Portability**: Full JSON backup export and import capabilities.


