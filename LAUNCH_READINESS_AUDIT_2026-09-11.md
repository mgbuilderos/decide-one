# Decide One Launch Readiness Audit

Date: 11 September 2026

## Product Promise

Decide One is a prioritization instrument. A person lists the work competing for attention, chooses one of three established decision frameworks, puts the work in order, and begins the first item. The product supplies structure; the person makes the decision and does the work.

## Intended First-Use Flow

1. Understand the benefit and the product from the opening screen.
2. See the instrument itself in the interactive 3D hero.
3. Open the daily view without an onboarding gate.
4. Choose Top 3, Ivy Lee, or Urgent/Important using direct icon controls.
5. Enter priorities in the framework's own structure.
6. Give the first item a realistic time block and begin.
7. Review the week, month, or year without turning the product into a general task manager.

## Corrections Completed

- Rewrote the landing message around the user's outcome and clearly explained how the product works.
- Replaced the stale hero still with the live high-resolution 3D instrument, white pages, updated page content, smooth rotation, and responsive sizing.
- Removed the first-run gate, secondary task stream, categories, habit tracking, decorative month breakers, and other elements that diluted prioritization.
- Reduced the daily interface to the three supported methods and replaced method dropdowns with direct, labelled icon controls.
- Kept method controls on the daily decision surface only, leaving weekly, monthly, and yearly reviews visually quieter.
- Enforced Ivy Lee sequence, improved control sizes, added keyboard focus states, and removed stray edge navigation from non-daily views.
- Simplified weekly, monthly, and yearly copy and removed ornamental month illustrations.
- Removed simulated checkout and one-click demo activation. The access surface now states that payment is not connected.
- Added route-level and modal-level code splitting. The initial JavaScript bundle fell from 876.91 kB to 767.51 kB before gzip.
- Added security headers, search metadata, a web manifest, robots and sitemap files, explicit legal configuration, and a launch check that fails closed when required facts are absent.
- Synced the address bar to the view on screen so copied daily, weekly, monthly, yearly, cover, methods, and legal links reopen accurately.

## Verification

- Production build: passed.
- Structural quality-control suite: all 23 checks passed after the final launch pass.
- Desktop and mobile visual checks: landing, daily, weekly, monthly, and yearly views checked in the real browser.
- Payment: intentionally absent.

## Open Launch Dependencies

- Five legal facts must be supplied; the current legal page visibly identifies itself as a draft until they are present.
- Professional review of legal copy and method naming remains outside the codebase.
- The current domain still publishes through the Sites project in `.openai/hosting.json`. A verified Cloudflare Worker is available as a second host; switching the domain requires a deliberate DNS change documented in `DEPLOY.md`.
- The interactive 3D scene remains the largest optional bundle and should be tested on mid-range mobile hardware after deployment.

The product and interface are ready for final legal configuration and production publishing. Public release should remain blocked until the legal facts are complete and one documented hosting path is chosen.
