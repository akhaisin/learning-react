import ProgressBar from './ProgressBar';

function ProgressBarDemo() {
  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Build an animated progress bar driven by setInterval. Accept configurable start, stop,
        step, and interval props. Add a play/pause toggle and reset to start when the bar
        completes. Clean up the interval in useEffect's return function.
      </p>
      <ProgressBar start={0} stop={100} step={1} interval={50} />
    </div>
  );
}

export default ProgressBarDemo;
