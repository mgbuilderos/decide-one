# Contributing to Decide One

Thank you. Decide One is a small instrument with firm opinions, so a few things matter more than usual.

1. **Start with `npm run brief`.** It says what is true right now. Then read [`AGENTS.md`](./AGENTS.md).
2. **Design is decided in [`FINAL_DESIGN.md`](./FINAL_DESIGN.md).** Read it before changing anything on screen.
3. **Copy is governed by [`VISION.md`](./VISION.md) §11.** If a sentence people will read should change, change §11 first and say why.
4. **Run the gates before you open a pull request:**
   ```bash
   npm run build && npm run test:qc && npm run test:artifact
   npm run test:visual   # anything visible; needs Chrome
   ```
   If you add or change a rule, break it once on purpose and show that it fails.
5. **One change per pull request**, with a message that says why.
6. **Nothing someone writes may leave their device.** No third-party scripts, no new network requests carrying user content, and no dependency that a few lines of code can replace.

Bug reports and small, focused pull requests are welcome. Changes to the product's direction are decided by the maintainer; open an issue to discuss them first.
