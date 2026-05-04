import { useState } from 'react';
import styles from './FlipBox.module.css';

function FlipBox() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div>
      <p className={styles.description}>
        Build the same flip card, but driven by a <code>useState</code> boolean that toggles on
        click. Apply the rotation class conditionally with a template literal and manage the flip
        entirely from React. This variation shows how to bridge CSS transitions with React state —
        and how it compares to the CSS-only hover approach.
      </p>
      <div className={styles.scene} onClick={() => setFlipped(f => !f)}>
        <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
          <div className={`${styles.face} ${styles.front}`}>Front</div>
          <div className={`${styles.face} ${styles.back}`}>Back</div>
        </div>
      </div>
    </div>
  );
}

export default FlipBox;
