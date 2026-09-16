// Match the 32px heading, 40px row and 8px group gap in book.css.
// An oversized stored quadrant is split, never truncated. Indices stay original.
export function matrixPages(groups, height) {
  const budget = Math.max(72, height);
  const pages = [];
  let page = [], used = 0;
  const flush = () => { if (page.length) pages.push(page); page = []; used = 0; };
  for (const group of groups) {
    let start = 0;
    do {
      let gap = page.length ? 8 : 0;
      if (used + gap + 32 + (group.tasks.length ? 40 : 0) > budget) { flush(); gap = 0; }
      const count = Math.max(1, Math.floor((budget - used - gap - 32) / 40));
      const tasks = group.tasks.slice(start, start + count);
      page.push({ ...group, start, tasks });
      used += gap + 32 + tasks.length * 40;
      start += tasks.length;
      if (start < group.tasks.length) flush();
    } while (start < group.tasks.length);
  }
  flush();
  return pages;
}
