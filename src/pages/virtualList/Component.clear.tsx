import styles from './Component.module.css';

function VirtualList() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a windowed list that renders only the rows currently visible in a fixed-height
        scroll container, even when the data array has tens of thousands of items. Use
        <code> useRef</code> on the container to read <code>scrollTop</code>, calculate the
        visible range from row height and container height, and position rows absolutely within
        a full-height inner div.
      </p>

      <div className={styles.viewport}>
        {/* TODO: Render only the visible slice and absolutely position each row. */}
      </div>
    </section>
  );
}

export default VirtualList;