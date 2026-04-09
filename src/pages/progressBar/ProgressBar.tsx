import { useState } from 'react';
import styles from './ProgressBar.module.css';

/*
todo: 

*/
function ProgressBar() {
  const [count, setCount] = useState(0);


  return (
    <div className={styles.ticks}>
        <button onClick={() => setCount((count) => count + 1)}>
            {count}
        </button>
    </div>
  );
}


export default ProgressBar;