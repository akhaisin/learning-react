import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Component.module.css';
import { getVisibleRange } from './utils';

const rowHeight = 40;
const containerHeight = 240;
const items = Array.from({ length: 1000 }, (_, index) => `Row ${index + 1}`);

function VirtualList() {
  const [scrollTop, setScrollTop] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const range = useMemo(
    () => getVisibleRange(scrollTop, rowHeight, containerHeight, items.length),
    [scrollTop],
  );
  const visibleItems = items.slice(range.startIndex, range.endIndex);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      setScrollTop(viewport.scrollTop);
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => {
      viewport.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a windowed list that renders only the rows currently visible in a fixed-height
        scroll container, even when the data array has tens of thousands of items. Use
        <code> useRef</code> on the container to read <code>scrollTop</code>, calculate the
        visible range from row height and container height, and position rows absolutely within
        a full-height inner div.
      </p>

      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ height: `${containerHeight}px` }}
      >
        <div className={styles.spacer} style={{ height: `${items.length * rowHeight}px` }}>
          {visibleItems.map((item, index) => {
            const itemIndex = range.startIndex + index;

            return (
              <div
                key={item}
                className={styles.row}
                style={{ height: `${rowHeight}px`, transform: `translateY(${itemIndex * rowHeight}px)` }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VirtualList;
