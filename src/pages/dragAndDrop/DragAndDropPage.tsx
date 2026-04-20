function DragAndDrop() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a reorderable list using native HTML drag-and-drop (no library). Handle
        <code> dragstart</code>, <code>dragover</code>, and <code>drop</code> events. Store the
        dragged item's index in a ref and update the list with an immutable splice. Provide visual
        feedback by highlighting the drop target during drag.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default DragAndDrop;
