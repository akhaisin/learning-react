import styles from './Component.module.css';

function ProgressBar() {
	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
				Build an animated progress bar driven by setInterval. Accept configurable start, stop,
				step, and interval props. Add a play/pause toggle and reset to start when the bar
				completes. Clean up the interval in useEffect&apos;s return function.
			</p>
			<div className={styles.container}>
				<button className={styles.toggleButton}>Start</button>
				<div className={styles.track}>
					<div
						className={styles.fill}
						style={{ width: '0%' }}
						role="progressbar"
						aria-valuenow={0}
						aria-valuemin={0}
						aria-valuemax={100}
					/>
				</div>
				<span className={styles.label}>0</span>
			</div>
		</div>
	);
}

export default ProgressBar;