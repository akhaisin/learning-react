import { useState } from "react";
import ListFilter from "../../components/listFilter/ListFilter";
import { FRUITS } from "../../data/fruits";

function TextFilter() {
	const [filterTerm, setFilterTerm] = useState("");

	return (
		<div>
			<h3>Fruits filter</h3>
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

