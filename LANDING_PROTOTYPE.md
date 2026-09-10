# Primacy landing prototype

Open `http://127.0.0.1:3000/?view=landing` after `npm run dev -- --host 127.0.0.1`.

The original journal remains the default `/` view. Landing calls to action launch that journal and update the URL to `?view=daily`.

## Implementation

- `src/components/MarketingLandingPage.jsx`: product narrative, controlled highlights carousel, finish selector, device selector, monthly illustration gallery, appearance, FAQ, and pricing.
- `src/components/landing/JournalScene.jsx`: lazily loaded Three.js scene with curved textured pages, layered edges, cover materials, woven label, ribbon, studio lighting, exploded layers, and laptop/tablet/phone geometry. Drag or use arrow keys; Home resets orientation.
- `src/components/landing/JournalDemo.jsx`: isolated, editable sample spread with the six methods actually exported by the app, paper/grid/ink controls, notes, habits, reflection, and a visual privacy shutter. All demo edits are temporary component state.
- `src/components/landing/landing.css`: scoped responsive design, light appearance, scroll-linked reveals, and reduced-motion overrides.

3D rendering is initialized near the viewport; offscreen/hidden-tab rendering is skipped. Motion can be paused. Unsupported WebGL falls back to the existing journal image. Context loss shows the fallback. Meshes, materials, textures, observers, and event handlers are disposed on unmount.

## Product facts used

The app uses React 18 and Vite. Daily journal data is stored as JSON in localStorage; passphrase encryption is provided for exported vaults. The source includes behavioural telemetry. Six priority frameworks are currently exported. Checkout currently simulates Patron activation. The landing page therefore avoids the older documentation's claims of nine implemented methods, encrypted live storage, zero telemetry, and a production payment flow.

## Verification

- Production build passed.
- Existing 21-gate source audit passed (this is a structural audit, not a security certification).
- Server-side React render checked nine section targets, all hash links, six framework options, 18 labeled checkbox controls, monthly artwork, and prototype pricing disclosure.
- Development route and component requests returned HTTP 200.
- Browser/GPU visual and interaction testing has not been performed.

## Hosting

The Sites project identifier is recorded in `.openai/hosting.json`. Static output is `dist`. Private hosting includes application assets only; existing local telemetry databases and browser profiles are excluded.
