import { useState } from 'react';
import styles from './TodoList.module.css';

type TodoItem = {
  id: number;
  text: string;
  done: boolean;
};

function TodoList() {
  const [draft, setDraft] = useState('');
  const [items, setItems] = useState<TodoItem[]>([]);

  const handleAdd = () => {
    const text = draft.trim();
    if (!text) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        text,
        done: false,
      },
    ]);
    setDraft('');
  };

  const handleDone = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className={styles.container}>
      <div className={styles.inputRow}>
        <textarea
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.currentTarget.value)}
          placeholder="Type a todo item"
        />
        <button type="button" className={styles.addButton} onClick={handleAdd}>
          Add item
        </button>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>No items yet.</p>
      ) : (
        <ul className={styles.items}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={`${styles.label} ${item.done ? styles.labelDone : ''}`}>{item.text}</span>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => handleDone(item.id)}
              >
                {item.done ? 'Undo' : 'Done'}
              </button>
              <button
                type="button"
                className={styles.actionButton}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
