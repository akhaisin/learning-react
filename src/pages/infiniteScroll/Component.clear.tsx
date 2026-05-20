import styles from './Component.module.css';

function InfiniteScroll() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a list that loads more items when the user scrolls to the bottom. Use a
        <code> useRef</code> to attach an <code>IntersectionObserver</code> to a sentinel element
        at the end of the list. When the sentinel becomes visible, append the next page of items.
        Show a loading indicator while fetching and handle the end-of-data state.
      </p>

      <div className={styles.card}>
        {/* TODO: Append more items when the sentinel becomes visible. */}
      </div>
    </section>
  );
}

export default InfiniteScroll;