# Work Remaining

Updated 11 September 2026 after the launch design and implementation pass.

## Before Public Launch

1. Provide the five production legal facts in `.env.production`: legal entity, registered address, support email, jurisdiction, and effective date. `npm run test:launch` blocks release while any are missing.
2. Have the legal pages and method naming reviewed by qualified counsel. The repository contains a practical first-pass review and method attributions, not professional legal advice.
3. Authenticate Wrangler with the Cloudflare account that owns the `decide-one` Pages project. The account currently active on this machine does not own it.
4. Run `npm run deploy`, then confirm that `npm run verify:live` reports a matching asset hash.

## Deliberately Excluded

- Payment checkout and webhook handling. The interface states that checkout is not connected and contains no simulated purchase path.

## Post-Launch Measurement

- Test the first-use flow with five people who have not seen the product.
- Measure whether they can explain the product, choose a method, enter priorities, and begin the first item without help.
- Profile the 3D hero on mid-range mobile hardware. The scene is lazy-loaded, but the Three.js asset remains the largest optional chunk.
