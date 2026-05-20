import styles from './Component.module.css';

function UseUndo() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a <code>useUndo&lt;T&gt;(initialValue)</code> hook that returns{' '}
        <code>{'[current, set, undo, redo, canUndo, canRedo]'}</code>. Maintain a history stack and
        a future stack in state. Each <code>set</code> call pushes the current value onto history
        and clears the future stack. Demonstrate it with a text input whose changes can be
        undone and redone.
      </p>

      <div className={styles.card}>
        {/* TODO: Wire the custom hook to an input and undo/redo controls. */}
      </div>
    </section>
  );
}

export default UseUndo;