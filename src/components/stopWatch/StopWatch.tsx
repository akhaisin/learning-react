import { useEffect, useRef, useState } from 'react';
import styles from './StopWatch.module.css';

type StopWatchProps = {
  refreshInterval?: number;
};

const DEFAULT_REFRESH_INTERVAL = 100;

function formatElapsed(elapsedMs: number) {
  const totalCentiseconds = Math.floor(elapsedMs / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
    centiseconds,
  ).padStart(2, '0')}`;
}

function StopWatch({ refreshInterval = DEFAULT_REFRESH_INTERVAL }: StopWatchProps) {
  const tickInterval = refreshInterval > 0 ? refreshInterval : DEFAULT_REFRESH_INTERVAL;

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startedAtRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setInterval(() => {
      if (startedAtRef.current === null) return;
      const elapsed = accumulatedMsRef.current + (Date.now() - startedAtRef.current);
      setElapsedMs(elapsed);
    }, tickInterval);

    return () => window.clearInterval(timer);
  }, [isRunning, tickInterval]);

  const handleToggle = () => {
    if (isRunning) {
      if (startedAtRef.current !== null) {
        accumulatedMsRef.current += Date.now() - startedAtRef.current;
      }
      startedAtRef.current = null;
      setElapsedMs(accumulatedMsRef.current);
      setIsRunning(false);
      return;
    }

    startedAtRef.current = Date.now();
    setIsRunning(true);
  };

  return (
    <button type="button" className={styles.button} onClick={handleToggle}>
      {formatElapsed(elapsedMs)}
    </button>
  );
}

export default StopWatch;
