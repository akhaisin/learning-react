import styles from './FlipBox.module.css';

function FlipBox() {
  return (
    <div>
      <p className={styles.description}>
        Build a card that flips 180° to reveal a back face when the user hovers over it. Use CSS
        3D transforms — <code>perspective</code>, <code>rotateY</code>, and{' '}
        <code>backface-visibility</code> — entirely in a CSS Module, with no JavaScript state.
        This variation demonstrates how complex interactive effects can be achieved with pure CSS.
      </p>
      <div className={styles.scene}>
        <div className={styles.card}>
          <div className={`${styles.face} ${styles.front}`}>Front</div>
          <div className={`${styles.face} ${styles.back}`}>Back</div>
        </div>
      </div>
    </div>
  );
}

export default FlipBox;
