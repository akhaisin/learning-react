import { describe, it, expect, render, fireEvent } from '../../../test/vitest-adapter';

describe('Flip Box Click', () => {
	it('renders front and back faces', () => {
		const { getByText } = render();
		const frontFace = getByText('Front');
		const backFace = getByText('Back');
		const card = frontFace.parentElement;
		const scene = card?.parentElement;

		expect(scene).not.toBeNull();
		expect(card).not.toBeNull();
		expect(frontFace).toBeInTheDocument();
		expect(backFace).toBeInTheDocument();
		expect(card?.className).not.toContain('flipped');
	});

	it('toggles the flipped class when the scene is clicked', () => {
		const { getByText } = render();
		const frontFace = getByText('Front');
		const card = frontFace.parentElement;
		const scene = card?.parentElement as HTMLElement | null;

		expect(scene).not.toBeNull();
		fireEvent.click(scene!);
		expect(card?.className).toContain('flipped');

		fireEvent.click(scene!);
		expect(card?.className).not.toContain('flipped');
	});
});