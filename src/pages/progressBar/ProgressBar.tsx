import { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

type ProgressBarProps = {
  start?: number;
  stop?: number;
  step?: number;
  interval?: number;
};

const DEFAULT_START = 0;
const DEFAULT_STOP = 100;
const DEFAULT_STEP = 1;
const DEFAULT_INTERVAL_MS = 50;

function ProgressBar({
  start = DEFAULT_START,
  stop = DEFAULT_STOP,
  step = DEFAULT_STEP,
  interval = DEFAULT_INTERVAL_MS,
}: ProgressBarProps) {
  const normalizedStop = stop > start ? stop : start + 1;
  const normalizedStep = step > 0 ? step : DEFAULT_STEP;
  const normalizedInterval = interval > 0 ? interval : DEFAULT_INTERVAL_MS;

  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(start);

  const progressPercent = ((progress - start) / (normalizedStop - start)) * 100;

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= normalizedStop) {
          return start;
        }
        const next = p + normalizedStep;
        return next > normalizedStop ? normalizedStop : next;
      });
    }, normalizedInterval);

    return () => clearInterval(interval);
  }, [normalizedInterval, normalizedStep, normalizedStop, running, start]);

  useEffect(() => {
    setProgress(start);
  }, [start]);

  const handleToggle = () => {
    if (progress >= normalizedStop) setProgress(start);
    setRunning((r) => !r);
  };

  return (
    <div className={styles.container}>
      <button className={styles.toggleButton} onClick={handleToggle}>
        {running ? 'Stop' : 'Start'}
      </button>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={start}
          aria-valuemax={normalizedStop}
        />
      </div>
      <span className={styles.label}>{progress}</span>
    </div>
  );
}

export default ProgressBar;
