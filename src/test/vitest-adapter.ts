import type * as React from "react";

type ExpectMatchers = {
	toBe: (expected: unknown) => void;
	toEqual: (expected: unknown) => void;
	toBeNull: () => void;
	toBeInTheDocument: () => void;
	toContain: (substring: string) => void;
	toHaveLength: (len: number) => void;
	not: Omit<ExpectMatchers, "not">;
};

type RenderResult = {
	container: HTMLElement;
	getByText: (text: string) => HTMLElement;
	queryByText: (text: string) => HTMLElement | null;
	getByPlaceholderText: (placeholder: string) => HTMLElement;
	getByTestId: (testId: string) => HTMLElement;
};

type HookResult<TValue> = {
	result: { current: TValue };
};

type FireEventHelpers = {
	click: (element: HTMLElement) => void;
	change: (
		element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
		eventInit: { target: { value: string } }
	) => void;
	keyDown: (element: HTMLElement, init: KeyboardEventInit) => void;
	scroll: (element: HTMLElement, eventInit: { target: { scrollTop: number } }) => void;
};

type ScreenHelpers = {
	getByText: (text: string) => HTMLElement;
	queryByText: (text: string) => HTMLElement | null;
	getByPlaceholderText: (placeholder: string) => HTMLElement;
	getByTestId: (testId: string) => HTMLElement;
};

export type VitestAdapterHelpers = {
	describe: (name: string, fn: () => void) => void;
	it: (name: string, fn: () => void) => void;
	expect: (value: unknown) => ExpectMatchers;
	render: (element?: React.ReactElement) => RenderResult;
	renderHook: <TValue>(hookFn: () => TValue) => HookResult<TValue>;
	fireEvent: FireEventHelpers;
	screen: ScreenHelpers;
	act: (fn: () => void) => void;
	beforeEach: (fn: () => void) => void;
	nextDescribePrefix?: string;
};

let currentHelpers: VitestAdapterHelpers | null = null;

function withHelpers<TArgs extends unknown[], TResult>(
	helpers: VitestAdapterHelpers,
	fn: (...args: TArgs) => TResult
) {
	return (...args: TArgs) => {
		const previousHelpers = currentHelpers;
		currentHelpers = helpers;
		try {
			return fn(...args);
		} finally {
			currentHelpers = previousHelpers;
		}
	};
}

function getHelpers(): VitestAdapterHelpers {
	if (!currentHelpers) {
		throw new Error("Vitest adapter helpers are only available while tests are running.");
	}
	return currentHelpers;
}

export function setVitestAdapterContext(helpers: VitestAdapterHelpers) {
	currentHelpers = helpers;
}

export function clearVitestAdapterContext() {
	currentHelpers = null;
}

export function describe(name: string, fn: () => void) {
	const helpers = getHelpers();
	const prefixedName = helpers.nextDescribePrefix
		? `${helpers.nextDescribePrefix} > ${name}`
		: name;
	helpers.nextDescribePrefix = undefined;
	return helpers.describe(prefixedName, withHelpers(helpers, fn));
}

export function it(name: string, fn: () => void) {
	const helpers = getHelpers();
	return helpers.it(name, withHelpers(helpers, fn));
}

export function expect(value: unknown) {
	return getHelpers().expect(value);
}

export function beforeEach(fn: () => void) {
	const helpers = getHelpers();
	return helpers.beforeEach(withHelpers(helpers, fn));
}

export function render(element?: React.ReactElement) {
	return getHelpers().render(element);
}

export function renderHook<TValue>(hookFn: () => TValue) {
	return getHelpers().renderHook(hookFn);
}

export const fireEvent: FireEventHelpers = {
	click(element) {
		return getHelpers().fireEvent.click(element);
	},
	change(element, eventInit) {
		return getHelpers().fireEvent.change(element, eventInit);
	},
	keyDown(element, init) {
		return getHelpers().fireEvent.keyDown(element, init);
	},
	scroll(element, eventInit) {
		return getHelpers().fireEvent.scroll(element, eventInit);
	},
};

export const screen: ScreenHelpers = {
	getByText(text) {
		return getHelpers().screen.getByText(text);
	},
	queryByText(text) {
		return getHelpers().screen.queryByText(text);
	},
	getByPlaceholderText(placeholder) {
		return getHelpers().screen.getByPlaceholderText(placeholder);
	},
	getByTestId(testId) {
		return getHelpers().screen.getByTestId(testId);
	},
};

export function act(fn: () => void) {
	return getHelpers().act(fn);
}