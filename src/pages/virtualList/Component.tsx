function VirtualList() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a windowed list that renders only the rows currently visible in a fixed-height
        scroll container, even when the data array has tens of thousands of items. Use
        <code> useRef</code> on the container to read <code>scrollTop</code>, calculate the
        visible range from row height and container height, and position rows absolutely within
        a full-height inner div.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default VirtualList;
