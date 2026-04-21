import styles from './ToastNotifications.module.css';

function ToastNotifications() {
  return (
    <div>
      <p className={styles.description}>
        Build a toast notification system with a context-based API. Create a{' '}
        <code>ToastContext</code> backed by <code>useReducer</code> to manage a list of active
        toasts, and expose a <code>useToast()</code> hook that lets any component trigger{' '}
        <code>add</code> and <code>dismiss</code> actions. Render toasts in a portal outside the
        main tree, and auto-dismiss each one after a configurable timeout using <code>useEffect</code>.
      </p>
      <p className={styles.placeholder}>Not implemented yet.</p>
    </div>
  );
}

export default ToastNotifications;
