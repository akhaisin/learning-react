import * as React from 'react';
import Page from './Page';
import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

function getCellButtons(container: HTMLElement) {
	return Array.from(container.querySelectorAll('button')).filter(
		(button) => button.textContent !== 'Start game' && button.textContent !== 'Reset game'
	) as HTMLButtonElement[];
}

describe('Tic-Tac-Toe Exercise', () => {
	it('plays moves until X wins, highlights the winning line, and resets the board', () => {
		const { container, getByText } = render(React.createElement(Page));
		let cells = getCellButtons(container);

		expect(cells).toHaveLength(9);
		expect(getByText('Current player: X')).toBeInTheDocument();

		fireEvent.click(cells[0]!);
		fireEvent.click(cells[3]!);
		fireEvent.click(cells[1]!);
		fireEvent.click(cells[4]!);
		fireEvent.click(cells[2]!);

		expect(getByText('Winner: X')).toBeInTheDocument();
		cells = getCellButtons(container);
		expect(cells[0]?.className).toContain('cellWinning');
		expect(cells[1]?.className).toContain('cellWinning');
		expect(cells[2]?.className).toContain('cellWinning');
		expect(cells[5]?.disabled).toBe(true);

		fireEvent.click(getByText('Reset game'));

		cells = getCellButtons(container);
		expect(getByText('Current player: X')).toBeInTheDocument();
		expect(cells[0]?.textContent ?? '').toBe('');
		expect(cells[4]?.textContent ?? '').toBe('');
		expect(cells[0]?.className).not.toContain('cellWinning');
		expect(cells[5]?.disabled).toBe(false);
	});

	it('restarts the game with normalized config when Start game is clicked', () => {
		const { container, getByText } = render(React.createElement(Page));
		let cells = getCellButtons(container);
		const numberInputs = Array.from(container.querySelectorAll('input[type="number"]')) as HTMLInputElement[];

		fireEvent.click(cells[0]!);
		expect(cells[0]?.textContent ?? '').toBe('X');

		fireEvent.change(numberInputs[0]!, { target: { value: '2' } });
		fireEvent.change(numberInputs[1]!, { target: { value: '5' } });
		fireEvent.click(getByText('Start game'));

		cells = getCellButtons(container);
		expect(cells).toHaveLength(4);
		expect(getByText('Size: 2x2 | Win line: 2')).toBeInTheDocument();
		expect(getByText('Current player: X')).toBeInTheDocument();
		expect(cells[0]?.textContent ?? '').toBe('');
		expect(cells[3]?.textContent ?? '').toBe('');
	});
});