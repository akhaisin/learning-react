import { createElement } from 'react';
import Component from './Component';
import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Autocomplete Exercise', () => {
  it('shows matching suggestions', () => {
    const { container, getByText } = render(createElement(Component, { debounceMs: 0 }));
    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'ap' } });

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Apricot')).toBeInTheDocument();
  });

  it('selects the highlighted suggestion with Enter', () => {
    const { container } = render(createElement(Component, { debounceMs: 0 }));
    const input = container.querySelector('input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'bl' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(input.value).toBe('Blueberry');
  });
});