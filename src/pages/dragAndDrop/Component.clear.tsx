import styles from './Component.module.css';

function DragAndDrop() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a reorderable list using native HTML drag-and-drop (no library). Handle
        <code> dragstart</code>, <code>dragover</code>, and <code>drop</code> events. Store the
        dragged item's index in a ref and update the list with an immutable splice. Provide visual
        feedback by highlighting the drop target during drag.
      </p>

      <ul className={styles.list}>
        {/* TODO: Render draggable items and reorder them on drop. */}
      </ul>
    </section>
  );
}

export default DragAndDrop;