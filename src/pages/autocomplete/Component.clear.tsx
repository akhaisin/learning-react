import styles from './Component.module.css';

function Autocomplete() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build an autocomplete input that fetches suggestions after a debounced delay, renders a
        dropdown list, and supports keyboard navigation (↑/↓ to move, Enter to select, Escape to
        close). Use the debounce pattern from the TextDebounce exercise and manage open/closed,
        highlighted index, and suggestion list as separate state.
      </p>

      <div className={styles.field}>
        {/* TODO: Add an input, debounced suggestions, and keyboard navigation. */}
      </div>
    </section>
  );
}

export default Autocomplete;