// Black and white only (UI_BRIEF §7.2, the founder on 13 September 2026).
//
// The coloured inks and paper tones are gone from the menu and the CSS. Their
// settings keys stay in storage, so an older backup, and an older bundle still
// served from the service-worker cache, both keep reading a valid value. This
// pins those keys to the one appearance that remains. useJournalStorage.js
// applies it when a volume loads and on both import paths.
//
// Pure and dependency-free on purpose: QC Rule 3 imports and runs it in Node.
export function normaliseAppearance(settings) {
  const base = settings && typeof settings === 'object' ? settings : {};
  return { ...base, inkColor: 'carbon', paperTone: 'white' };
}
