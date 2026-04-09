import { useEffect, useState } from 'react';
import styles from './ProgressBar.module.css';

const INTERVAL_MS = 50;
const STEP = 1;

/*
todo: 

*/
function ProgressBar() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          return 0;
        }
        return p + STEP;
      });
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [running]);

  const handleToggle = () => {
    if (progress >= 100) setProgress(0);
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
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
        <span className={styles.label}>{progress}%</span>
    </div>
  );
}


export default ProgressBar;