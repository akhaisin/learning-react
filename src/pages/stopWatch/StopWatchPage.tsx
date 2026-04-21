import StopWatch from './StopWatch';

function StopWatchDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a stopwatch with play/pause. Track elapsed time using a ref for the start timestamp
        and another for accumulated time, so pause/resume works correctly without stale state.
        Drive display updates with <code>setInterval</code> in a <code>useEffect</code>.
        Then refactor: extract a reusable <code>useInterval(callback, delay)</code> hook that stores
        the latest callback in a ref to avoid stale closures, and supports passing <code>null</code>{' '}
        as the delay to pause the interval. Replace the inline effect in <code>StopWatch</code> with it.
      </p>
      <StopWatch refreshInterval={100} />
    </div>
  );
}

export default StopWatchDemo;
