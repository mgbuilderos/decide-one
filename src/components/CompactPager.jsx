import React from 'react';

export default function CompactPager({ page, count, onChange, label }) {
  if (count < 2) return null;
  return <nav className="compact-pager" aria-label={label}>
    <button type="button" aria-disabled={page === 0} onClick={() => page > 0 && onChange(page - 1)}>Previous</button>
    <span className="type-metadata" role="status">Page {page + 1} of {count}</span>
    <button type="button" aria-disabled={page === count - 1} onClick={() => page < count - 1 && onChange(page + 1)}>Next</button>
  </nav>;
}
