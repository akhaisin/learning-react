import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Phone Input Exercise', () => {
	it('renders an input and formats typed digits', () => {
		const { container } = render();
		const input = container.querySelector('input') as HTMLInputElement | null;

		expect(input).not.toBeNull();
		fireEvent.change(input!, { target: { value: '1234567890' } });
		expect(input?.value).toBe('(123)456-7890');
	});

	it('ignores non-digit characters while formatting', () => {
		const { container } = render();
		const input = container.querySelector('input') as HTMLInputElement | null;

		fireEvent.change(input!, { target: { value: '1a2b3c4d5e6' } });
		expect(input?.value).toBe('(123)456');
	});
});