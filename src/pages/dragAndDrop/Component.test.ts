import { describe, it, expect, render, act } from '../../test/vitest-adapter';

describe('Drag And Drop Exercise', () => {
  it('renders the initial list order', () => {
    const { getByText } = render();

    expect(getByText('Plan state shape')).toBeInTheDocument();
    expect(getByText('Reorder immutably')).toBeInTheDocument();
  });

  it('reorders items after a drag and drop interaction', () => {
    const { container } = render();
    const items = Array.from(container.querySelectorAll('[draggable="true"]')) as HTMLElement[];

    act(() => {
      items[0].dispatchEvent(new Event('dragstart', { bubbles: true }));
      items[2].dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
      items[2].dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    });

    const reorderedText = Array.from(container.querySelectorAll('[draggable="true"]')).map((item) => item.textContent ?? '');
    expect(reorderedText[0]).toContain('Render list items');
    expect(reorderedText[2]).toContain('Plan state shape');
  });
});