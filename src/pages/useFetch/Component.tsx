import { useState } from 'react';
import styles from './Component.module.css';
import useFetch from './utils';

type UserProfile = {
  id: number;
  name: string;
  role: string;
};

function UseFetch() {
  const [url, setUrl] = useState('mock:profile');
  const { data, loading, error } = useFetch<UserProfile>(url);

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
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={() => setUrl('mock:profile')}>
            Load profile
          </button>
          <button type="button" className={styles.button} onClick={() => setUrl('mock:missing')}>
            Load error example
          </button>
        </div>

        {loading ? <p className={styles.status}>Loading...</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}
        {data ? (
          <dl className={styles.profile}>
            <div>
              <dt>Name</dt>
              <dd>{data.name}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{data.role}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </section>
  );
}

export default UseFetch;
