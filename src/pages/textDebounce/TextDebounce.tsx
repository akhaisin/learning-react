import { useEffect, useState, type ReactNode } from "react";

const FRUITS = [
	"Apple",
	"Banana",
	"Cherry",
	"Date",
	"Elderberry",
	"Fig",
	"Grape",
	"Honeydew",
	"Indian Fig",
	"Jackfruit",
	"Kiwi",
	"Lemon",
	"Mango",
	"Nectarine",
	"Orange",
	"Papaya",
	"Quince",
	"Raspberry",
	"Strawberry",
	"Tangerine",
];

const useDebaunce = (text: string, delay: number) => {
	const [debaunced, setDebaunced] = useState(text);

	useEffect(() => {
		const timer = setTimeout(() => {
            setDebaunced(text);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [text, delay]);

	return debaunced;
};

function TextDebounce() {
	const [searchTerm, setSearchTerm] = useState("");
	const debauncedSearchTerm = useDebaunce(searchTerm, 1000);

	const fruitsDataFiltered = FRUITS.filter((fruit) =>
		fruit.toLowerCase().includes(debauncedSearchTerm.trim().toLowerCase())
	);

	const highlightMatch = (fruit: string, fragment: string): ReactNode => {
        const normalizedFragment = fragment.trim();
        const matchRegex = new RegExp(`(${normalizedFragment})`, "ig");
		const fruitParts = fruit.split(matchRegex);
		console.log("fruitParts =", fruitParts);

		return fruitParts.map((part, index) =>
			part.toLowerCase() === normalizedFragment.toLowerCase() ? (
				<strong key={`${fruit}-${index}`}>{part}</strong>
			) : (
				<span key={`${fruit}-${index}`}>{part}</span>
			)
		);
	};

	return (
		<div>
			<h3>Fruits filter</h3>
			<input
				type="text"
				placeholder="Type to search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
            <p>Search Term: {debauncedSearchTerm}</p>
			<ul>
				{fruitsDataFiltered.map((fruit) => (
					<li key={fruit}>{highlightMatch(fruit, debauncedSearchTerm)}</li>
				))}
			</ul>
		</div>
	);
}

export default TextDebounce;
