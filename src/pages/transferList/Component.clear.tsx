import styles from './Component.module.css';

function TransferList() {
	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '560px', lineHeight: '1.55' }}>
				Build a transfer list with two multi-select columns and four move buttons: move selected
				left→right, move all left→right, and the reverse. Track selected IDs as separate state
				from item lists and clear selections after each move.
			</p>
			<section className={styles.container}>
				<div className={styles.column}>
					<span className={styles.title}>Left</span>
					<select className={styles.list} multiple aria-label="Left list" />
				</div>
				<div className={styles.controls}>
					<button type="button" className={styles.controlButton}>{'>>'}</button>
					<button type="button" className={styles.controlButton}>{'>'}</button>
					<button type="button" className={styles.controlButton}>{'<'}</button>
					<button type="button" className={styles.controlButton}>{'<<'}</button>
				</div>
				<div className={styles.column}>
					<span className={styles.title}>Right</span>
					<select className={styles.list} multiple aria-label="Right list" />
				</div>
			</section>
		</div>
	);
}

export default TransferList;