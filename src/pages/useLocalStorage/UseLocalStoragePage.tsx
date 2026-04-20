function UseLocalStorage() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a generic <code>useLocalStorage&lt;T&gt;(key, initialValue)</code> custom hook that
        reads from and writes to localStorage, serializing values as JSON. It should return a
        [value, setter] tuple identical to useState. Demonstrate it with a form whose fields
        survive a page refresh.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default UseLocalStorage;
