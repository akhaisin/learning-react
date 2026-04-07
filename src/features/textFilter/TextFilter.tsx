import { useState, type ChangeEvent, type ReactNode } from "react";

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

function TextFilter() {
	const [searchTerm, setSearchTerm] = useState("");

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const fruitsDataFiltered = FRUITS.filter((fruit) =>
		fruit.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

	const highlightMatch = (fruit: string): ReactNode => {
		if (!searchTerm.trim()) {
			return fruit;
		}

		const matchRegex = new RegExp(`(${escapeRegex(searchTerm)})`, "ig");
		const fruitParts = fruit.split(matchRegex);
		console.log("fruitParts =", fruitParts);

		return fruitParts.map((part, index) =>
			part.toLowerCase() === searchTerm.toLowerCase() ? (
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
				onChange={handleChange}
			/>
			
			<ul>
				{fruitsDataFiltered.map((fruit) => (
					<li key={fruit}>{highlightMatch(fruit)}</li>
				))}
			</ul>
		</div>
	);
}

export default TextFilter;

