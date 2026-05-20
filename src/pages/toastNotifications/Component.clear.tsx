import styles from './Component.module.css';

function ToastNotifications() {
  return (
    <section className={styles.container}>
      <p className={styles.description}>
        Build a toast notification system with a context-based API. Create a{' '}
        <code>ToastContext</code> backed by <code>useReducer</code> to manage a list of active
        toasts, and expose a <code>useToast()</code> hook that lets any component trigger{' '}
        <code>add</code> and <code>dismiss</code> actions. Render toasts in a portal outside the
        main tree, and auto-dismiss each one after a configurable timeout using <code>useEffect</code>.
      </p>

      <div className={styles.card}>
        {/* TODO: Add a provider, trigger button, and portal-based toast viewport. */}
      </div>
    </section>
  );
}

export default ToastNotifications;