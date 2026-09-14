// Stable direct links, including retired entry surfaces.
const DIRECT_VIEWS = ['daily', 'weekly', 'monthly', 'yearly', 'legal', 'methods'];
const RETIRED_VIEWS = { cover: 'daily', landing: 'daily' };
export function viewFromParam(view) {
  if (DIRECT_VIEWS.includes(view)) return view;
  if (Object.prototype.hasOwnProperty.call(RETIRED_VIEWS, view)) return RETIRED_VIEWS[view];
  return null;
}
export function initialView(search = '') {
  return viewFromParam(new URLSearchParams(search).get('view')) || 'daily';
}
