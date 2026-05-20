import styles from './Component.module.css';

function TodoList() {
  return (
    <section className={styles.container}>
      <div className={styles.inputRow}>
        {/* TODO: Replace this with useState-managed draft and items state. */}
      </div>
    </section>
  );
}

export default TodoList;