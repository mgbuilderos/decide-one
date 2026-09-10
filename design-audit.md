# Decide One design audit

Date: 2026-09-10

## Audit scope

Combined UX and visual-accessibility review of the public homepage, entry into the daily instrument, the morning condition prompt, and the visible daily workspace.

## User goal and accessibility target

A visitor should understand Decide One before entering it, then move from a crowded day to a chosen method without visual noise or ambiguity. The interface should retain readable contrast, semantic controls, visible focus states, and comfortable targets.

## Evidence

- User-provided regression capture: `audit/01-current-regression.png` (2940 × 1912).
- Current-run browser capture: redesigned homepage at `http://localhost:4173/` (1272 × 717 viewport).
- Current-run browser capture: redesigned morning prompt at `http://localhost:4173/?view=daily` (1272 × 717 viewport).
- Current-run browser capture: daily workspace after a condition was selected (1272 × 717 viewport).

## Numbered flow review

1. **Root entry — healthy after correction.** The root now opens the marketing homepage. Previously it opened the daily workspace beneath a blocking prompt, which removed product context and made the modal look like the product.
2. **Homepage hero — healthy.** The first view now states the doctrine (“First has room for one”), explains the mechanism in two short lines, exposes one primary action, and uses the D1 wordmark plus corrected Decide One product imagery.
3. **Homepage exploration — healthy.** Navigation, hero CTA, in-page links, theme control, interactive demo, perspective selectors, pricing, and FAQ retain semantic controls and readable labels.
4. **Morning condition prompt — healthy.** The old rounded-card list and amber decoration were replaced with a flat, numbered decision sheet. Each choice remains a full-width button with a visible directional affordance and keyboard focus treatment.
5. **Daily instrument — healthy.** Choosing a condition closes the prompt and reveals the working daily surface. The masthead, navigation, framework, timebox, and writing areas retain the Helvetica-first monochrome system.

## Strengths

- The product doctrine and the product action now agree: one first priority, one primary CTA, one clear transition into the instrument.
- Helvetica Neue is first in the landing and application font stacks; display copy, interface labels, numerals, and controls share one neo-grotesque voice.
- The corrected raster assets remove the stale Primacy name without changing the product photography.
- The redesigned prompt uses whitespace, rules, numbering, and weight instead of nested cards and decorative color.

## UX risks resolved

- **P1 — Homepage bypassed:** fixed by making `landing` the default view and recognizing explicit `?view=daily` routing.
- **P1 — Stale product identity in imagery:** fixed with dedicated Decide One hero and device renders.
- **P1 — Morning prompt dominated the product:** fixed by moving it behind the intentional “Open the instrument” action.
- **P2 — Generic card-heavy prompt:** fixed with one continuous sheet and six ruled rows.
- **P2 — Soft SaaS typography:** fixed by making Helvetica Neue the primary family and tightening optical weight, tracking, and scale.

## Accessibility risks and checks

- Confirmed from the implementation: semantic dialog, buttons, headings, labels, aria state, full-width choice targets, focus-visible outlines, and reduced-motion handling remain present.
- Contrast is visibly strong in the monochrome light and dark surfaces.
- The modal closes after selection and can also be skipped.
- A dedicated screen-reader pass, keyboard-only pass across every secondary modal, and browser zoom testing remain outside screenshot evidence.

## Remaining polish

- Several secondary utility and upgrade modals still use the older rounded-card vocabulary. They are outside the entry flow fixed here and should be normalized in a later component-token pass.
- The production bundle reports a non-blocking large-chunk warning; it affects load performance rather than visual fidelity.

## Final verdict

The visible entry experience is coherent again: homepage first, instrument second, morning decision third. The typography, imagery, copy, and modal composition now communicate a premium monochrome decision instrument rather than a generic productivity dashboard.
