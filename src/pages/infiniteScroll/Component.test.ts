import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Infinite Scroll Exercise', () => {
  it('renders the first page of items', () => {
    const { getByText } = render();

    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 4')).toBeInTheDocument();
  });

  it('loads more items from the next page', () => {
    const { getByText } = render();

    fireEvent.click(getByText('Load more'));
    expect(getByText('Item 8')).toBeInTheDocument();
  });
});