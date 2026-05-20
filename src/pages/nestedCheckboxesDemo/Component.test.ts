import * as React from 'react';
import NestedCheckboxes from './Component';
import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Nested Checkboxes Exercise', () => {
	it('checks all children when the parent is checked', () => {
		const { container } = render(
			React.createElement(NestedCheckboxes, {
				parent: 'Fruits',
				children: ['Apple', 'Banana', 'Mango', 'Orange'],
			}),
		);
		const checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]')) as HTMLInputElement[];
		const parent = checkboxes[0];
		const children = checkboxes.slice(1);

		fireEvent.click(parent);
		expect(parent.checked).toBe(true);
		expect(children.every((checkbox) => checkbox.checked)).toBe(true);
	});

	it('sets the parent to mixed when only some children are checked', () => {
		const { container } = render(
			React.createElement(NestedCheckboxes, {
				parent: 'Fruits',
				children: ['Apple', 'Banana', 'Mango', 'Orange'],
			}),
		);
		const checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]')) as HTMLInputElement[];
		const parent = checkboxes[0];
		const firstChild = checkboxes[1];

		fireEvent.click(firstChild);
		expect(parent.checked).toBe(false);
		expect(parent.indeterminate).toBe(true);
		expect(parent.getAttribute('aria-checked')).toBe('mixed');
	});
});