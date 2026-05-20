import { useState } from 'react';

export type UseUndoReturn<T> = readonly [
	T,
	(value: T) => void,
	() => void,
	() => void,
	boolean,
	boolean,
];

function useUndo<T>(initialValue: T): UseUndoReturn<T> {
	const [past, setPast] = useState<T[]>([]);
	const [present, setPresent] = useState(initialValue);
	const [future, setFuture] = useState<T[]>([]);

	const setValue = (value: T) => {
		setPast((currentPast) => [...currentPast, present]);
		setPresent(value);
		setFuture([]);
	};

	const undo = () => {
		setPast((currentPast) => {
			if (currentPast.length === 0) return currentPast;
			const previous = currentPast[currentPast.length - 1];
			setFuture((currentFuture) => [present, ...currentFuture]);
			setPresent(previous);
			return currentPast.slice(0, -1);
		});
	};

	const redo = () => {
		setFuture((currentFuture) => {
			if (currentFuture.length === 0) return currentFuture;
			const [next, ...rest] = currentFuture;
			setPast((currentPast) => [...currentPast, present]);
			setPresent(next);
			return rest;
		});
	};

	return [present, setValue, undo, redo, past.length > 0, future.length > 0] as const;
}

export default useUndo;
