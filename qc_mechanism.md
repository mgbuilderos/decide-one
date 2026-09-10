# PocketBook Quality Control (QC) Mechanism & Gate Manual

To ensure that bugs (such as overlapping dropdown menus, unmanaged floating popovers, font regressions, and visual clutter) never occur again, PocketBook enforces a two-tier Quality Control (QC) Mechanism:

---

## 1. Automated Quality Gate (`npm run test:qc`)

The test script `scripts/qc_audit.js` runs automatically on verification and can be invoked at any time via:
```bash
npm run test:qc
```

### Automated Rules Enforced:
1. **Rule 1 — Zero Monospace Font Leaks**:
   - Monospace fonts (`font-mono`) are strictly prohibited in the codebase.
   - All text, tabulations, and dates must be rendered in universal Helvetica / SF Pro.
2. **Rule 2 — Zero Unmanaged Overlapping Popovers**:
   - Individual task and bullet items must NOT maintain independent floating dropdown popovers (`showCategoryMenu`).
   - Category updates must use **Things 3 Progressive Disclosure** with 1-click cycling or global modal sheets with backdrop listeners.
3. **Rule 3 — Strict Monochrome Color Palette**:
   - Chromatic ink colors (`bg-blue-100`, `text-purple-600`, etc.) are blocked.
   - All UI elements must strictly use pure black `#000000`, pure white `#FFFFFF`, or neutral zinc/gray tones.
4. **Rule 4 — Viewport Zero-Scroll & Portrait Geometry**:
   - `App.jsx` must enforce `h-screen overflow-hidden` so neither horizontal nor vertical window scrolling occurs.
   - Notebook container must strictly follow portrait diary dimensions (`max-w-[600px]`).

---

## 2. Human & Visual QC Checklist (Pre-Release Gate)

Before accepting any interface iteration, verify the following 5 visual criteria:

1. **Clutter-Free Paper Surface**:
   - When looking at the journal, does it look like calm, printed paper or an Excel database?
   - Individual rows must not show permanent bulky buttons. Only the bullet glyph and text input should be prominently visible.
2. **Progressive Disclosure Check**:
   - Hover over a row: does the subtle category indicator and delete icon fade in gracefully?
   - Move mouse away: does the row return to pristine calm?
3. **1-Click Interaction**:
   - Clicking a category indicator should instantly cycle to the next category with audio feedback.
   - No floating menu should ever get stuck on screen or overlap another row.
4. **Header Proportions**:
   - The centered "PocketBook" logo mark must have ample negative space on both sides.
   - Secondary controls must be tucked into a clean overflow menu without crowding.
5. **Rapid Log Space Protection**:
   - Does Rapid Log command at least 250px–300px of visible height?
   - Can you read 8–12 lines directly without feeling cramped?
