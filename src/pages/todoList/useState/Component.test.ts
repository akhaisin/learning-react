import { describe, it, expect, render, fireEvent } from '../../../test/vitest-adapter';

describe('Todo List useState Exercise', () => {
  it('adds a todo item', () => {
    const { container, getByText } = render();
    const input = container.querySelector('textarea') as HTMLTextAreaElement;

    fireEvent.change(input, { target: { value: 'Ship useState version' } });
    fireEvent.click(getByText('Add item'));

    expect(getByText('Ship useState version')).toBeInTheDocument();
  });

  it('toggles and deletes an item', () => {
    const { container, getByText, queryByText } = render();
    const input = container.querySelector('textarea') as HTMLTextAreaElement;

    fireEvent.change(input, { target: { value: 'Ship useState version' } });
    fireEvent.click(getByText('Add item'));
    fireEvent.click(getByText('Done'));
    expect(getByText('Undo')).toBeInTheDocument();

    fireEvent.click(getByText('Delete'));
    expect(queryByText('Ship useState version')).toBeNull();
  });
});