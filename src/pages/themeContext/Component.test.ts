import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Theme Context Exercise', () => {
  it('starts in light mode', () => {
    const { getByText, container } = render();
    const panel = container.querySelector('[data-theme="light"]');

    expect(getByText('LIGHT MODE')).toBeInTheDocument();
    expect(panel).not.toBeNull();
  });

  it('toggles theme from a nested button', () => {
    const { getByText } = render();

    fireEvent.click(getByText('Switch to dark mode'));

    expect(getByText('DARK MODE')).toBeInTheDocument();
    expect(getByText('Switch to light mode')).toBeInTheDocument();
  });
});