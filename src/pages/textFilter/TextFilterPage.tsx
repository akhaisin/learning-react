import { useState } from "react";
import ListFilter from "./ListFilter";
import { FRUITS } from "./fruits";

function TextFilter() {
	const [filterTerm, setFilterTerm] = useState("");

	return (
		<div>
			<p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '520px', lineHeight: '1.55' }}>
				Build a real-time text filter over a list. Filter items on every keystroke and highlight
				the matching portion of each result by splitting on a regex match.
			</p>
			<input
				type="text"
				placeholder="Type to search"
				value={filterTerm}
				onChange={(e) => setFilterTerm(e.target.value)}
			/>
			<ListFilter list={FRUITS} filterTerm={filterTerm} />
		</div>
	);
}

export default TextFilter;
