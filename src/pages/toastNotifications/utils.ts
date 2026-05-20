import { createContext, createElement, useContext, useMemo, useReducer, type PropsWithChildren } from 'react';

export type Toast = {
	id: string;
	title: string;
	message: string;
	duration: number;
};

type ToastAction =
	| { type: 'add'; toast: Toast }
	| { type: 'dismiss'; id: string };

type ToastContextValue = {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, 'id'>) => void;
	dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue>({
	toasts: [],
	addToast: () => undefined,
	dismissToast: () => undefined,
});

export function toastReducer(state: Toast[], action: ToastAction): Toast[] {
	switch (action.type) {
		case 'add':
			return [...state, action.toast];
		case 'dismiss':
			return state.filter((toast) => toast.id !== action.id);
	}
}

export function ToastProvider({ children }: PropsWithChildren) {
	const [toasts, dispatch] = useReducer(toastReducer, []);
	const value = useMemo<ToastContextValue>(
		() => ({
			toasts,
			addToast: (toast) => {
				dispatch({
					type: 'add',
					toast: {
						...toast,
						id: `${Date.now()}-${Math.random()}`,
					},
				});
			},
			dismissToast: (id) => dispatch({ type: 'dismiss', id }),
		}),
		[toasts],
	);

	return createElement(ToastContext.Provider, { value }, children);
}

export function useToast() {
	return useContext(ToastContext);
}
