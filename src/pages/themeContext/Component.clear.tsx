import styles from './Component.module.css';

function ThemeContext() {
  return (
    <section className={`${styles.container} ${styles.light}`}>
      <p className={styles.description}>
        Build a light/dark theme system using <code>createContext</code> and <code>useContext</code>.
        Define a typed context with a default value, wrap the page in a provider, and toggle the
        theme from a deeply nested button — without prop drilling. Apply the theme via a CSS class
        on a wrapper element.
      </p>

      <div className={styles.themePanel}>
        {/* TODO: Add a typed context, provider, and nested toggle button. */}
      </div>
    </section>
  );
}

export default ThemeContext;