import { createContext, useContext, useState } from 'react';
import styles from './Component.module.css';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeDemoContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => undefined,
});

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeDemoContext);

  return (
    <button type="button" className={styles.toggleButton} onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}

function ThemePreview() {
  return (
    <div className={styles.previewCard}>
      <h3>Theme preview</h3>
      <p>Context lets this nested button update the page theme without prop drilling.</p>
      <ThemeToggleButton />
    </div>
  );
}

function ThemeContext() {
  const [theme, setTheme] = useState<Theme>('light');
  const value: ThemeContextValue = {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
  };

  return (
    <ThemeDemoContext.Provider value={value}>
      <section className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <p className={styles.description}>
        Build a light/dark theme system using <code>createContext</code> and <code>useContext</code>.
        Define a typed context with a default value, wrap the page in a provider, and toggle the
        theme from a deeply nested button — without prop drilling. Apply the theme via a CSS class
        on a wrapper element.
        </p>

        <div className={styles.themePanel} data-theme={theme}>
          <p className={styles.badge}>{theme.toUpperCase()} MODE</p>
          <ThemePreview />
        </div>
      </section>
    </ThemeDemoContext.Provider>
  );
}

export default ThemeContext;
