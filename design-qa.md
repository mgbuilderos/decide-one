# Decide One design QA

## Comparison target

- Source visual truth: `audit/01-current-regression.png`, plus `design_system.md` and `jony_ive_design_system.md` for the intended Helvetica-first, monochrome, no-card-soup system.
- Implementation: browser-rendered local build at `http://localhost:4173/` and `http://localhost:4173/?view=daily`.
- Implementation screenshot evidence: current-run Codex in-app-browser captures (inline audit evidence; the browser surface does not expose a persistent local screenshot path).
- Source pixels: 2940 × 1912.
- Implementation viewport: 1272 × 717 CSS pixels, device density controlled by the in-app browser.
- State: homepage default; daily view with morning prompt; daily view after condition selection.

## Full-view comparison evidence

The regression capture showed a blocking 680px-wide prompt with six separate rounded cards, amber decoration, heavy blur, and no visible product introduction. The corrected root shows a dedicated Swiss-style homepage with a D1 mark, disciplined typographic hierarchy, one primary CTA, and corrected product photography. The corrected prompt uses one continuous white sheet, six numbered ruled rows, neutral iconography, and a quieter shadow.

## Focused comparison evidence

- **Typography:** Helvetica Neue is primary. The hero uses a restrained 400–450 display weight, tight tracking, tabular numbering, and compact uppercase metadata. No serif treatment remains in the landing-page quote/citation surface.
- **Spacing and rhythm:** Hero copy, actions, and product render use a consistent vertical sequence. Prompt rows share a 72px minimum and hairline separators. Nested card radii were removed from the prompt.
- **Colors and tokens:** The entry flow is black, white, and neutral gray. Amber was removed from the morning prompt; progress color in the journal remains semantic.
- **Image quality:** Both 1536 × 1024 production renders preserve their source composition and now show Decide One instead of Primacy.
- **Copy:** The hero now leads with “First has room for one” and explains the three-step mechanism. CTA language is consistent with an instrument.

## Comparison history

### Iteration 1 findings

- P1: root URL bypassed the homepage.
- P1: hero and device imagery retained the old Primacy name.
- P1: modal composition visually overpowered the underlying instrument.
- P2: landing CSS prioritized Inter over Helvetica.
- P2: amber icon tile and six rounded cards contradicted the monochrome reduction system.

### Fixes made

- Defaulted the root route to the landing page while preserving explicit daily routing.
- Replaced stale in-image labels with Decide One and connected the new non-destructive assets.
- Rewrote hero hierarchy, mechanism copy, CTA, and doctrine strip.
- Restored a Helvetica Neue-first stack and refined weight, tracking, spacing, radii, and neutral tokens.
- Rebuilt the morning prompt as a flat numbered decision sheet.

### Post-fix evidence

- Root browser capture shows the homepage without a blocking modal.
- Hero capture shows the D1 mark and the corrected Decide One woven label.
- Daily capture shows the redesigned six-row prompt.
- Selecting a condition closes the prompt and reveals the daily instrument.
- Browser console: zero warnings and zero errors during the tested flow.
- Production build: passed.
- Structural QC: all 22 checks passed.

## Follow-up polish

- P3: unify secondary modals under the new flat dialog token in a future pass.
- P3: split the largest JavaScript chunk for faster first-load performance.

## D1 identity refinement — September 10, 2026

- Source visual truth: `/var/folders/8m/vptdd2nn261fmf5g1f_p9_x80000gp/T/TemporaryItems/NSIRD_screencaptureui_XbmEAu/Screenshot 2026-09-10 at 1.20.20 PM.png` (2940 × 1912 pixels).
- Browser-rendered implementation: `audit/02-d1-brand-desktop.jpg` (1275 × 717 pixels/CSS viewport, in-app browser density).
- Favicon implementation: `audit/02-d1-favicon.jpg`.
- Normalized full-view comparison: `audit/02-d1-brand-comparison.jpg` (source webpage crop and implementation each normalized to 1275 × 717).
- Focused header comparison: `audit/02-d1-header-comparison.jpg` (source and implementation headers normalized to 1275 × 90).
- State: dark landing page, top of homepage, default navigation state.
- Primary interactions tested: brand home link present and accessible; theme and primary CTA remain present after the identity change.
- Console errors checked: no new runtime error surfaced in the browser-rendered flow; production build and structural QC passed.

### Finding and fix

- P2: The reference header treated “Decide One” as a small, isolated label and did not establish D1 as a real brand mark. The existing favicon also used gold, leather, ribbon, shading, and secondary decoration that collapsed at browser-tab size.
- Fix: Replaced the decorative favicon with a high-contrast black-and-white D1 monogram; connected the same asset to the header and footer; increased the desktop header mark to 44px; raised the Decide One wordmark to 15px/650 weight with wider Swiss-style tracking; added a 36px mobile treatment; and cache-busted favicon and touch-icon references.
- Post-fix evidence: The focused comparison shows a clear D1 + DECIDE ONE identity with stronger scale and hierarchy. The isolated favicon capture shows only the black field, white D1, and a restrained keyline. No gold remains.

### Required fidelity surfaces

- Fonts and typography: Helvetica Neue remains first in the stack; the name uses a heavier 650 weight, 15px size, uppercase styling, and .18em tracking.
- Spacing and layout rhythm: Header height increased from 78px to 88px to give the 44px mark adequate breathing room; the mark/name gap is 15px.
- Colors and visual tokens: Icon and wordmark are strictly black, white, and neutral gray; all prior gold and red favicon tokens were removed.
- Image quality and asset fidelity: The SVG remains resolution-independent and was verified in-browser at full size and in its 44px header placement.
- Copy and content: The canonical product name remains “Decide One” everywhere; D1 functions only as the monogram.

### Comparison history

- First comparison: P2 brand scale and favicon complexity identified from the user-supplied production capture.
- Revision: larger shared D1 asset, stronger Decide One name, monochrome favicon, balanced header height.
- Second comparison: no actionable P0/P1/P2 differences remain for the requested identity scope. The brand is more prominent without competing with the hero.

final result: passed
