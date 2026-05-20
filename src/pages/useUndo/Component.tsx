import styles from './Component.module.css';
import useUndo from './utils';

function UseUndo() {
  const [value, setValue, undo, redo, canUndo, canRedo] = useUndo('');

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
        <input
          className={styles.input}
          placeholder="Type and undo"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />

        <div className={styles.actions}>
          <button type="button" className={styles.button} disabled={!canUndo} onClick={undo}>
            Undo
          </button>
          <button type="button" className={styles.button} disabled={!canRedo} onClick={redo}>
            Redo
          </button>
        </div>

        <p className={styles.status}>Current value: {value || 'empty'}</p>
      </div>
    </section>
  );
}

export default UseUndo;
