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