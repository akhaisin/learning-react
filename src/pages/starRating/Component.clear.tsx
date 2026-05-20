import styles from './Component.module.css';

function StarRating() {
	const totalStars = 5;

	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
				Build a star rating widget. Render N stars as buttons, track both the selected count and
				the hovered count separately, and apply four distinct visual states: selected, not selected,
				selected-hovered, and not-selected-hovered.
			</p>
			<div className={styles.container}>
				{Array.from({ length: totalStars }, (_, index) => (
					<button
						key={index}
						type="button"
						className={`${styles.star} ${styles.starNotSelected}`}
						aria-label={`Rate ${index + 1} out of ${totalStars}`}
						aria-pressed="false"
					>
						★
					</button>
				))}
				<span className={styles.value}>0 / {totalStars}</span>
			</div>
		</div>
	);
}

export default StarRating;