import * as React from 'react';
import TransferList from './Component';
import { describe, it, expect, render, fireEvent, act } from '../../test/vitest-adapter';

describe('Transfer List Exercise', () => {
	it('renders the two lists with their initial items', () => {
		const { container } = render(
			React.createElement(TransferList, {
				left: ['React', 'Vue', 'Svelte', 'Solid'],
				right: ['Angular', 'Ember'],
			}),
		);
		const lists = Array.from(container.querySelectorAll('select')) as HTMLSelectElement[];

		expect(lists).toHaveLength(2);
		expect(lists[0].options).toHaveLength(4);
		expect(lists[1].options).toHaveLength(2);
		expect(lists[0].options[0]?.textContent).toContain('React');
		expect(lists[1].options[0]?.textContent).toContain('Angular');
	});

	it('moves a selected item from left to right', () => {
		const { container, getByText } = render(
			React.createElement(TransferList, {
				left: ['React', 'Vue', 'Svelte', 'Solid'],
				right: ['Angular', 'Ember'],
			}),
		);
		const lists = Array.from(container.querySelectorAll('select')) as HTMLSelectElement[];
		const leftList = lists[0];
		const rightList = lists[1];
		act(() => {
			leftList.options[1].selected = true;
			leftList.dispatchEvent(new Event('change', { bubbles: true }));
		});

		fireEvent.click(getByText('>'));

		expect(leftList.options).toHaveLength(3);
		expect(rightList.options).toHaveLength(3);
		expect(rightList.options[2]?.textContent).toContain('Vue');
	});
});