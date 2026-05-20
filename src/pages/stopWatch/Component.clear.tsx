import styles from './Component.module.css';

function StopWatch() {
  return (
    <button type="button" className={styles.button}>
      {/* TODO: Track elapsed time with refs and an interval. */}
      00:00.00
    </button>
  );
}

export default StopWatch;