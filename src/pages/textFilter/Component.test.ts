import * as React from 'react';
import Page from './Page';
import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Text Filter Exercise', () => {
	it('renders the full fruit list before any filter is applied', () => {
		const { container } = render(React.createElement(Page));
		const items = Array.from(container.querySelectorAll('li'));

		expect(items).toHaveLength(20);
		expect(container.textContent ?? '').toContain('Apple');
		expect(container.textContent ?? '').toContain('Tangerine');
	});

	it('filters the list and highlights matching text as the user types', () => {
		const { container } = render(React.createElement(Page));
		const input = container.querySelector('input') as HTMLInputElement | null;

		expect(input).not.toBeNull();
		fireEvent.change(input!, { target: { value: 'an' } });

		const items = Array.from(container.querySelectorAll('li'));
		const strongMatches = Array.from(container.querySelectorAll('strong'));

		expect(items).toHaveLength(5);
		expect(container.textContent ?? '').toContain('Banana');
		expect(container.textContent ?? '').toContain('Indian Fig');
		expect(container.textContent ?? '').toContain('Orange');
		expect(container.textContent ?? '').not.toContain('Apple');
		expect(strongMatches).toHaveLength(6);
		expect(strongMatches[0]?.textContent ?? '').toBe('an');
	});
});