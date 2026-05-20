import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Progress Bar Exercise', () => {
	it('renders the initial stopped state', () => {
		const { container, getByText } = render();
		const progressBar = container.querySelector('[role="progressbar"]') as HTMLElement | null;

		expect(getByText('Start')).toBeInTheDocument();
		expect(getByText('0')).toBeInTheDocument();
		expect(progressBar).not.toBeNull();
		expect(progressBar?.getAttribute('aria-valuenow')).toBe('0');
		expect(progressBar?.getAttribute('aria-valuemax')).toBe('100');
	});

	it('toggles the button label when started and stopped', () => {
		const { getByText } = render();
		const button = getByText('Start');

		fireEvent.click(button);
		expect(getByText('Stop')).toBeInTheDocument();

		fireEvent.click(getByText('Stop'));
		expect(getByText('Start')).toBeInTheDocument();
	});
});