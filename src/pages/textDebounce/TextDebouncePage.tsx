import { useEffect, useState } from "react";
import ListFilter from "./ListFilter";
import { FRUITS } from "./fruits";

const useDebounce = (text: string, delay: number) => {
	const [debounced, setDebounced] = useState(text);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounced(text);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [text, delay]);

	return debounced;
};

function TextDebounce() {
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);

	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
				Extends the text filter with a custom useDebounce hook: delay the filter query by 1 second
				to avoid unnecessary work on every keystroke. The hook uses useEffect with a setTimeout
				cleanup to reset the timer on each change.
			</p>
			<input
				type="text"
				placeholder="Type to search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<p>Search term: {debouncedSearchTerm}</p>
			<ListFilter list={FRUITS} filterTerm={debouncedSearchTerm} />
		</div>
	);
}

export default TextDebounce;
