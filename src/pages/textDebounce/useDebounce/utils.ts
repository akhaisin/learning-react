export const FRUITS = [
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

import { useEffect, useState } from "react";

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

export default useDebounce;
