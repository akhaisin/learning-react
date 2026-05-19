function UseFetch() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a <code>useFetch&lt;T&gt;(url)</code> custom hook that returns{' '}
        <code>{'{ data, loading, error }'}</code>. Use an <code>AbortController</code> inside
        useEffect to cancel the in-flight request when the component unmounts or the URL changes.
        Demonstrate it by fetching a public API and rendering the result with loading and error
        states.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default UseFetch;
