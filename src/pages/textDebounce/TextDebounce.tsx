import { useEffect, useState } from "react";
import ListFilter from "../../components/listFilter/ListFilter";
import { FRUITS } from "../../data/fruits";

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
			<h3>Fruits filter</h3>
			<h4>Adds debouncing on top of text filtering.</h4>
			<input
				type="text"
				placeholder="Type to search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<p>Search Term: {debouncedSearchTerm}</p>
			<ListFilter list={FRUITS} filterTerm={debouncedSearchTerm} />
		</div>
	);
}

export default TextDebounce;
