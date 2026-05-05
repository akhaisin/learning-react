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
          <div className={`${styles.face} ${styles.front}`}>
            <img src="/learning-react/favicon.svg" width={100} height={100} alt="React atom icon" />
            <span className={styles.svgBadge}>SVG</span>
          </div>
          <div className={`${styles.face} ${styles.back}`}>
            <p className={styles.backText}>
              React atom icon — three elliptical orbits around a nucleus, the symbol of the
              React.js framework.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipBox;
