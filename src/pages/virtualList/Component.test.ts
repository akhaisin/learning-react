import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Virtual List Exercise', () => {
  it('renders an initial visible window', () => {
    const { getByText, queryByText } = render();

    expect(getByText('Row 1')).toBeInTheDocument();
    expect(queryByText('Row 50')).toBeNull();
  });

  it('renders a later slice after scrolling', () => {
    const { container, getByText, queryByText } = render();
    const viewport = container.querySelector('[class*="viewport"]') as HTMLDivElement;

    fireEvent.scroll(viewport, { target: { scrollTop: 400 } });

    expect(getByText('Row 11')).toBeInTheDocument();
    expect(queryByText('Row 1')).toBeNull();
  });
});