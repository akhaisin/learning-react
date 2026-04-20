import { useState } from 'react';
import styles from './ASandbox.module.css';


function ASandbox() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);

  return (
    <div>
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
        Free sandbox for quick experiments. Currently shows a basic click counter using useState
        with a functional update to avoid stale closures.
      </p>
      <div className={styles.ticks}>
        <button onClick={handleIncrement}>
          {count}
        </button>
      </div>
    </div>
  );
}


export default ASandbox;
