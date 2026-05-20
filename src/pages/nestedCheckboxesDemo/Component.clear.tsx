import styles from './Component.module.css';

function NestedCheckboxes() {
	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
				Build a parent/children checkbox group. Checking the parent selects all children;
				unchecking it deselects all. When only some children are checked, the parent should
				show a native indeterminate state set via a ref.
			</p>
			<div className={styles.container}>
				<label className={styles.parentRow}>
					<input type="checkbox" className={styles.checkbox} />
					<span>Parent</span>
				</label>
				<ul className={styles.childrenList}>
					<li>
						<label className={styles.childRow}>
							<input type="checkbox" className={styles.checkbox} />
							<span>Child</span>
						</label>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default NestedCheckboxes;