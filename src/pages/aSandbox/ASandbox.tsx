import { useState } from 'react';
import styles from './ASandbox.module.css';


function ASandbox() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  
  return (
    <div className={styles.ticks}>
        <button onClick={handleIncrement}>
            {count}
        </button>
    </div>
  );
}


export default ASandbox;