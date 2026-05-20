import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('useUndo Exercise', () => {
  it('updates the current value from the input', () => {
    const { container, getByText } = render();
    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'first draft' } });

    expect(getByText('Current value: first draft')).toBeInTheDocument();
  });

  it('undoes and redoes changes', () => {
    const { container, getByText } = render();
    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'first draft' } });
    fireEvent.change(input, { target: { value: 'second draft' } });
    fireEvent.click(getByText('Undo'));
    expect(getByText('Current value: first draft')).toBeInTheDocument();

    fireEvent.click(getByText('Redo'));
    expect(getByText('Current value: second draft')).toBeInTheDocument();
  });
});