import { useEffect, useState } from 'react';

export type FetchState<T> = {
	data: T | null;
	loading: boolean;
	error: string | null;
};

const mockResponses: Record<string, unknown> = {
	'mock:profile': {
		id: 1,
		name: 'Ada Lovelace',
		role: 'Mathematician',
	},
};

export function resolveMockResponse<T>(url: string): T {
	if (!(url in mockResponses)) {
		throw new Error('Mock resource not found.');
	}

	return mockResponses[url] as T;
}

function getMockState<T>(url: string): FetchState<T> {
	try {
		return {
			data: resolveMockResponse<T>(url),
			loading: false,
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			loading: false,
			error: (error as Error).message,
		};
	}
}

function useFetch<T>(url: string): FetchState<T> {
	const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });
	const isMockUrl = url.startsWith('mock:');

	useEffect(() => {
		if (isMockUrl) {
			return undefined;
		}

		const controller = new AbortController();
		setState({ data: null, loading: true, error: null });

		void (async () => {
			try {
				const response = await fetch(url, { signal: controller.signal });
				if (!response.ok) {
					throw new Error(`Request failed with status ${response.status}`);
				}

				const data = (await response.json()) as T;
				if (!controller.signal.aborted) {
					setState({ data, loading: false, error: null });
				}
			} catch (error) {
				if (controller.signal.aborted) return;
				setState({ data: null, loading: false, error: (error as Error).message });
			}
		})();

		return () => controller.abort();
	}, [isMockUrl, url]);

	if (isMockUrl) {
		return getMockState<T>(url);
	}

	return state;
}

export default useFetch;
