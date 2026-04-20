function ThemeContext() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a light/dark theme system using <code>createContext</code> and <code>useContext</code>.
        Define a typed context with a default value, wrap the page in a provider, and toggle the
        theme from a deeply nested button — without prop drilling. Apply the theme via a CSS class
        on a wrapper element.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default ThemeContext;
