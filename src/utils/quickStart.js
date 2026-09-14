import { hasWrittenBefore } from '../hooks/useJournalStorage';
const KEY = 'DECIDEONE_QUICK_START_V1';
export function needsQuickStart() {
  try { return localStorage.getItem(KEY) !== 'done' && !hasWrittenBefore(); }
  catch { return true; }
}
export function finishQuickStart() {
  try { localStorage.setItem(KEY, 'done'); } catch { /* usable without storage */ }
}
