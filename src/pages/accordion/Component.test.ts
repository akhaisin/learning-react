import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Accordion Exercise', () => {
  it('renders the first panel expanded by default', () => {
    const { getByText } = render();

    expect(getByText('HTML')).toBeInTheDocument();
    expect(getByText('Structure content with semantic elements that communicate meaning.')).toBeInTheDocument();
  });

  it('opens a different panel and closes it when clicked again', () => {
    const { getByText, queryByText } = render();
    const cssButton = getByText('CSS');

    fireEvent.click(cssButton);
    expect(getByText('Use CSS Modules to scope styles and keep visual states predictable.')).toBeInTheDocument();
    expect(queryByText('Structure content with semantic elements that communicate meaning.')).toBeNull();

    fireEvent.click(cssButton);
    expect(queryByText('Use CSS Modules to scope styles and keep visual states predictable.')).toBeNull();
  });
});