import { useRef, useState } from 'react';
import ListFilter from './ListFilter';
import { FRUITS } from './fruits';

function TextDebounce() {
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedTerm, setDebouncedTerm] = useState('');
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => setDebouncedTerm(value), 1000);
	};

	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
				Build a debounced text filter without any hook abstraction. Use <code>useRef</code> to
				hold a timer ID across renders, and manage <code>setTimeout</code>{' '}
				and <code>clearTimeout</code> directly in the change handler. Two separate state
				values — the raw input and the debounced query — make the delay visible.
			</p>
			<input
				type="text"
				placeholder="Type to search"
				value={searchTerm}
				onChange={handleChange}
			/>
			<p>Search term: {debouncedTerm}</p>
			<ListFilter list={FRUITS} filterTerm={debouncedTerm} />
		</div>
	);
}

export default TextDebounce;
