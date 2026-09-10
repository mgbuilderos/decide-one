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

final result: passed
