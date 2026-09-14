// Where a ?view= link opens.
//
// Kept pure and outside App.jsx so scripts/qc_audit.js (Rule 15) can execute it
// rather than read it: a mapping that is only grepped for can be present and
// still not be what runs.
const DIRECT_VIEWS = ['daily', 'weekly', 'monthly', 'yearly', 'landing', 'legal', 'methods'];

// A view that no longer exists opens the one that replaced it, so an old
// bookmark still reaches the instrument rather than the landing page. The
// notebook cover was retired on 14 September 2026 (DECISIONS.md BR8,
// UI_BRIEF.md §7.3).
const RETIRED_VIEWS = { cover: 'daily' };

export function viewFromParam(view) {
  if (DIRECT_VIEWS.includes(view)) return view;
  if (Object.prototype.hasOwnProperty.call(RETIRED_VIEWS, view)) return RETIRED_VIEWS[view];
  return null;
}
