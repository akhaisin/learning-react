import styles from './Component.module.css';

type TikTakToeProps = {
	size: number;
	winCount: number;
};

function TikTakToe({ size, winCount }: TikTakToeProps) {
	const normalizedSize = Math.max(2, Math.floor(size));
	const normalizedWinCount = Math.min(normalizedSize, Math.max(2, Math.floor(winCount)));

	return (
		<section className={styles.container}>
			<p className={styles.status}>Size: {normalizedSize}x{normalizedSize} | Win line: {normalizedWinCount}</p>
			<p className={styles.status}>Current player: X</p>

			<div
				className={styles.board}
				style={{ gridTemplateColumns: `repeat(${normalizedSize}, minmax(0, 1fr))` }}
			>
				{Array.from({ length: normalizedSize ** 2 }, (_, index) => (
					<button key={index} type="button" className={styles.cell}>
						
					</button>
				))}
			</div>

			<button type="button" className={styles.resetButton}>
				Reset game
			</button>
		</section>
	);
}

export default TikTakToe;