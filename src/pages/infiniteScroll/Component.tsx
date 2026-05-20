import { useEffect, useRef, useState } from 'react';
import styles from './Component.module.css';
import { pages } from './utils';

function InfiniteScroll() {
  const [pageIndex, setPageIndex] = useState(1);
  const [items, setItems] = useState(pages[0]);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadNextPage = () => {
    if (pageIndex >= pages.length || loading) return;
    setLoading(true);
    const nextItems = pages[pageIndex];
    setItems((currentItems) => [...currentItems, ...nextItems]);
    setPageIndex((currentIndex) => currentIndex + 1);
    setLoading(false);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;

    const scrollRoot = sentinel.closest('[data-demo-scroll-root="true"]') as HTMLElement | null;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadNextPage();
      }
    }, {
      root: scrollRoot,
      threshold: 0.25,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pageIndex, loading]);

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a list that loads more items when the user scrolls to the bottom. Use a
        <code> useRef</code> to attach an <code>IntersectionObserver</code> to a sentinel element
        at the end of the list. When the sentinel becomes visible, append the next page of items.
        Show a loading indicator while fetching and handle the end-of-data state.
      </p>

      <div className={styles.card}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>

        {loading ? <p className={styles.loading}>Loading...</p> : null}
        <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

        {pageIndex < pages.length ? (
          <button type="button" className={styles.button} onClick={loadNextPage}>
            Load more
          </button>
        ) : (
          <p className={styles.endState}>You reached the end.</p>
        )}
      </div>
    </section>
  );
}

export default InfiniteScroll;
