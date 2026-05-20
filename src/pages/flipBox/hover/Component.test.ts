import { describe, it, expect, render } from '../../../test/vitest-adapter';

describe('Flip Box Hover', () => {
	it('renders the front SVG face and the back description', () => {
		const { container, getByText } = render();
		const image = container.querySelector('img');

		expect(image).not.toBeNull();
		expect(image?.getAttribute('alt')).toBe('React atom icon');
		expect(getByText('SVG')).toBeInTheDocument();
		expect(container.textContent ?? '').toContain('React atom icon');
	});

	it('renders the scene, card, and both faces without React state classes', () => {
		const { getByText } = render();
		const svgBadge = getByText('SVG');
		const frontFace = svgBadge.parentElement;
		const card = frontFace?.parentElement;
		const scene = card?.parentElement;
		const faces = card ? Array.from(card.children) : [];

		expect(scene).not.toBeNull();
		expect(card).not.toBeNull();
		expect(faces).toHaveLength(2);
		expect(card?.className).not.toContain('flipped');
		expect(getByText('SVG').className).toContain('svgBadge');
	});
});