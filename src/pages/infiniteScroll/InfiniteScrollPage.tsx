function InfiniteScroll() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
        Build a list that loads more items when the user scrolls to the bottom. Use a
        <code> useRef</code> to attach an <code>IntersectionObserver</code> to a sentinel element
        at the end of the list. When the sentinel becomes visible, append the next page of items.
        Show a loading indicator while fetching and handle the end-of-data state.
      </p>
      <p style={{ color: '#aaa', fontStyle: 'italic' }}>Not implemented yet.</p>
    </div>
  );
}

export default InfiniteScroll;
