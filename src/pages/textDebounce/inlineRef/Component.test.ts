import * as React from 'react';
import Page from './Page';
import { describe, it, expect, render, fireEvent, act } from '../../../test/vitest-adapter';

type ScheduledTimeout = {
	id: number;
	callback: () => void;
	delay: number;
};

function installTimerMocks() {
	const originalSetTimeout = globalThis.setTimeout;
	const originalClearTimeout = globalThis.clearTimeout;
	const scheduled: ScheduledTimeout[] = [];
	const cleared: number[] = [];
	let nextId = 1;

	globalThis.setTimeout = ((handler: TimerHandler, delay?: number) => {
		if (typeof handler !== 'function') {
			throw new Error('Expected setTimeout to receive a callback function.');
		}

		const id = nextId++;
		scheduled.push({ id, callback: handler as () => void, delay: delay ?? 0 });
		return id as unknown as ReturnType<typeof setTimeout>;
	}) as unknown as typeof setTimeout;

	globalThis.clearTimeout = ((timeoutId?: ReturnType<typeof setTimeout>) => {
		cleared.push(timeoutId as unknown as number);
	}) as unknown as typeof clearTimeout;

	return {
		scheduled,
		cleared,
		restore() {
			globalThis.setTimeout = originalSetTimeout;
			globalThis.clearTimeout = originalClearTimeout;
		},
	};
}

describe('Text Debounce Inline Ref', () => {
	it('keeps the rendered filter unchanged until the timeout callback runs', () => {
		const timers = installTimerMocks();

		try {
			const { container } = render(React.createElement(Page));
			const input = container.querySelector('input') as HTMLInputElement | null;

			expect(input).not.toBeNull();
			fireEvent.change(input!, { target: { value: 'an' } });

			const itemsBeforeDebounce = Array.from(container.querySelectorAll('li'));
			expect(input?.value).toBe('an');
			expect(container.textContent ?? '').toContain('Search term: ');
			expect(container.textContent ?? '').not.toContain('Search term: an');
			expect(itemsBeforeDebounce).toHaveLength(20);
			expect(timers.scheduled).toHaveLength(1);
			expect(timers.scheduled[0]?.delay).toBe(1000);

			act(() => {
				timers.scheduled[0]?.callback();
			});

			const itemsAfterDebounce = Array.from(container.querySelectorAll('li'));
			expect(container.textContent ?? '').toContain('Search term: an');
			expect(itemsAfterDebounce).toHaveLength(5);
			expect(container.textContent ?? '').toContain('Banana');
			expect(container.textContent ?? '').toContain('Orange');
		} finally {
			timers.restore();
		}
	});

	it('clears the previous timer when the user types again before the delay finishes', () => {
		const timers = installTimerMocks();

		try {
			const { container } = render(React.createElement(Page));
			const input = container.querySelector('input') as HTMLInputElement | null;

			fireEvent.change(input!, { target: { value: 'ap' } });
			fireEvent.change(input!, { target: { value: 'gr' } });

			expect(timers.scheduled).toHaveLength(2);
			expect(timers.cleared).toEqual([1]);

			act(() => {
				timers.scheduled[1]?.callback();
			});

			expect(container.textContent ?? '').toContain('Search term: gr');
			expect(container.textContent ?? '').toContain('Grape');
			expect(container.textContent ?? '').not.toContain('Apple');
		} finally {
			timers.restore();
		}
	});
});