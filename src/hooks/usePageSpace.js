import { useLayoutEffect, useState } from 'react';

// Measure the space left after headers, the stopwatch and page footers.
export default function usePageSpace() {
  const [node, ref] = useState(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    if (!node) return undefined;
    const measure = () => setHeight(Math.floor(node.clientHeight));
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    measure();
    return () => observer.disconnect();
  }, [node]);
  return [ref, height];
}
