import { createElement } from 'react';
import Component from './Component';
import { describe, it, expect, render, fireEvent, act } from '../../test/vitest-adapter';

describe('Stop Watch Exercise', () => {
  it('renders the initial elapsed time', () => {
    const { getByText } = render();

    expect(getByText('00:00.00')).toBeInTheDocument();
  });

  it('updates the displayed time after starting and stopping', () => {
    const originalNow = Date.now;
    const originalSetInterval = window.setInterval;
    const originalClearInterval = window.clearInterval;
    let now = 0;
    let tick: (() => void) | null = null;

    Date.now = () => now;
    window.setInterval = ((callback: TimerHandler) => {
      tick = () => {
        if (typeof callback === 'function') {
          callback();
        }
      };
      return 1;
    }) as typeof window.setInterval;
    window.clearInterval = (() => undefined) as typeof window.clearInterval;

    try {
      const { container } = render(createElement(Component, { refreshInterval: 5 }));
      const button = container.querySelector('button') as HTMLButtonElement;

      fireEvent.click(button);
      now = 1250;
      act(() => {
        tick?.();
      });
      fireEvent.click(button);

      expect(button.textContent ?? '').toContain('00:01.25');
    } finally {
      Date.now = originalNow;
      window.setInterval = originalSetInterval;
      window.clearInterval = originalClearInterval;
    }
  });
});