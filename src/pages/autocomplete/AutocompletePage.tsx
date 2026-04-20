function Autocomplete() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build an autocomplete input that fetches suggestions after a debounced delay, renders a
        dropdown list, and supports keyboard navigation (↑/↓ to move, Enter to select, Escape to
        close). Use the debounce pattern from the TextDebounce exercise and manage open/closed,
        highlighted index, and suggestion list as separate state.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default Autocomplete;
