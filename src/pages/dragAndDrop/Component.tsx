import { useRef, useState } from 'react';
import styles from './Component.module.css';

const initialItems = ['Plan state shape', 'Render list items', 'Handle drag events', 'Reorder immutably'];

function reorder<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

function DragAndDrop() {
  const [items, setItems] = useState(initialItems);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const draggedIndexRef = useRef<number | null>(null);

  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a reorderable list using native HTML drag-and-drop (no library). Handle
        <code> dragstart</code>, <code>dragover</code>, and <code>drop</code> events. Store the
        dragged item's index in a ref and update the list with an immutable splice. Provide visual
        feedback by highlighting the drop target during drag.
      </p>

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li
            key={item}
            draggable
            data-index={index}
            className={`${styles.item} ${targetIndex === index ? styles.target : ''}`}
            onDragStart={() => {
              draggedIndexRef.current = index;
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setTargetIndex(index);
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (draggedIndexRef.current === null || draggedIndexRef.current === index) {
                setTargetIndex(null);
                return;
              }
              setItems((current) => reorder(current, draggedIndexRef.current!, index));
              draggedIndexRef.current = null;
              setTargetIndex(null);
            }}
            onDragEnd={() => {
              draggedIndexRef.current = null;
              setTargetIndex(null);
            }}
          >
            <span>{item}</span>
            <span className={styles.handle}>Drag</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default DragAndDrop;
