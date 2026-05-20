import styles from './Component.module.css';

function UseFetch() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a <code>useFetch&lt;T&gt;(url)</code> custom hook that returns{' '}
        <code>{'{ data, loading, error }'}</code>. Use an <code>AbortController</code> inside
        useEffect to cancel the in-flight request when the component unmounts or the URL changes.
        Demonstrate it by fetching a public API and rendering the result with loading and error
        states.
      </p>

      <div className={styles.card}>
        {/* TODO: Connect a typed fetch hook to a loading, error, and success UI. */}
      </div>
    </section>
  );
}

export default UseFetch;