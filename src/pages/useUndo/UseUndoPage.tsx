function UseUndo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a <code>useUndo&lt;T&gt;(initialValue)</code> hook that returns{' '}
        <code>{'[current, set, undo, redo, canUndo, canRedo]'}</code>. Maintain a history stack and
        a future stack in state. Each <code>set</code> call pushes the current value onto history
        and clears the future stack. Demonstrate it with a text input whose changes can be
        undone and redone.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default UseUndo;
