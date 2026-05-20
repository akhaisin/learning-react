import * as React from 'react';
import StarRating from './Component';
import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Star Rating Exercise', () => {
	it('renders five star buttons and the initial value', () => {
		const { container, getByText } = render(
			React.createElement(StarRating, { maxStars: 5, initialSelection: 2 }),
		);
		const buttons = Array.from(container.querySelectorAll('button'));

		expect(buttons).toHaveLength(5);
		expect(getByText('2 / 5')).toBeInTheDocument();
		expect(buttons[0].className).toContain('starSelected');
		expect(buttons[1].className).toContain('starSelected');
		expect(buttons[2].className).toContain('starNotSelected');
	});

	it('updates the selected rating when a star is clicked', () => {
		const { container, getByText } = render(
			React.createElement(StarRating, { maxStars: 5, initialSelection: 2 }),
		);
		const buttons = Array.from(container.querySelectorAll('button'));

		fireEvent.click(buttons[3] as HTMLElement);

		expect(getByText('4 / 5')).toBeInTheDocument();
		expect(buttons[3].className).toContain('starSelected');
		expect(buttons[4].className).toContain('starNotSelected');
	});
});