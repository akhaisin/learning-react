import StopWatch from './StopWatch';

function StopWatchDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build a stopwatch with play/pause. Track elapsed time using a ref for the start timestamp
        and another for accumulated time, so pause/resume works correctly without stale state.
        Drive display updates with setInterval in a useEffect.
      </p>
      <StopWatch refreshInterval={100} />
    </div>
  );
}

export default StopWatchDemo;
