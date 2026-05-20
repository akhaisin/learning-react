import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Component.module.css';
import { ToastProvider, useToast } from './utils';

function ToastViewport() {
  const { toasts, dismissToast } = useToast();

  if (typeof document === 'undefined') return null;

  const portalTarget = document.getElementById('test-portal-root') ?? document.body;

  return createPortal(
    <div className={styles.viewport}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onDismiss={dismissToast}
        />
      ))}
    </div>,
    portalTarget,
  );
}

type ToastItemProps = {
  id: string;
  title: string;
  message: string;
  duration: number;
  onDismiss: (id: string) => void;
};

function ToastItem({ id, title, message, duration, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timeoutId);
  }, [duration, id, onDismiss]);

  return (
    <article className={styles.toast}>
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <button type="button" className={styles.dismissButton} onClick={() => onDismiss(id)}>
        Dismiss
      </button>
    </article>
  );
}

function ToastDemo() {
  const { addToast } = useToast();

  return (
    <button
      type="button"
      className={styles.actionButton}
      onClick={() =>
        addToast({
          title: 'Profile saved',
          message: 'Your changes were stored successfully.',
          duration: 4000,
        })
      }
    >
      Show success toast
    </button>
  );
}

function ToastNotifications() {
  return (
    <ToastProvider>
      <section className={styles.container}>
        <p className={styles.description}>
          Build a toast notification system with a context-based API. Create a{' '}
          <code>ToastContext</code> backed by <code>useReducer</code> to manage a list of active
          toasts, and expose a <code>useToast()</code> hook that lets any component trigger{' '}
          <code>add</code> and <code>dismiss</code> actions. Render toasts in a portal outside the
          main tree, and auto-dismiss each one after a configurable timeout using <code>useEffect</code>.
        </p>

        <div className={styles.card}>
          <ToastDemo />
        </div>

        <ToastViewport />
      </section>
    </ToastProvider>
  );
}

export default ToastNotifications;
