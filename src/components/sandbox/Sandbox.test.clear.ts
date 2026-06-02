/**
 * Sandbox tests — run in the in-browser Vitest-style adapter.
 *
 * Import helpers from '../../test/vitest-adapter'. Supported API:
 *
 *   describe(name, fn)        group related tests
 *   it(name, fn)              a single test case
 *   beforeEach(fn)            run before each `it` in the enclosing scope
 *
 *   expect(value)             assertions (chain `.not` to negate):
 *     .toBe(v)                strict === equality
 *     .toEqual(v)             deep equality (JSON-based)
 *     .toBeNull()             value === null
 *     .toBeInTheDocument()    DOM node is attached to the document
 *     .toContain(str)         substring of a string, or an element's text
 *     .toHaveLength(n)        value.length === n
 *
 *   render(element?)          mount a React element (defaults to the Sandbox
 *                             component). Returns { container, getByText,
 *                             queryByText, getByPlaceholderText, getByTestId }.
 *   screen                    the same queries, scoped to the last render()
 *   fireEvent                 { click, change, keyDown, scroll }
 *   renderHook(fn)            render a hook -> { result: { current } }
 *   act(fn)                   flush React updates triggered inside fn
 *
 * `render()` with no argument mounts the default export of Sandbox.tsx.
 * You may also `import` from 'react' here (e.g. React.createElement, hooks).
 */
import {
  describe, it, expect, beforeEach,
  render, screen, fireEvent, renderHook, act,
} from '../../test/vitest-adapter';
import * as React from 'react';

// ── The actual Sandbox component (the toggle button) ─────────────────────────
describe('Sandbox', () => {
  it('renders the button initially with OFF label', () => {
    const { getByText, queryByText } = render();
    const button = getByText('OFF');
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('toggle');
    expect(button.className).toContain('off');
    expect(queryByText('ON')).toBeNull();
  });

  it('toggles label and class name on click', () => {
    const { getByText } = render();
    const button = getByText('OFF');

    fireEvent.click(button);
    expect(button.textContent).toContain('ON');
    expect(button.className).toContain('on');
    expect(button.className).not.toContain('off');

    fireEvent.click(button);
    expect(button.textContent).toContain('OFF');
  });
});

// ── Reference: what the adapter's `expect` supports ──────────────────────────
describe('adapter: expect matchers', () => {
  it('toBe / not.toBe — strict equality', () => {
    expect(1 + 1).toBe(2);
    expect('a').not.toBe('b');
  });

  it('toEqual — deep equality', () => {
    expect({ a: 1, list: [2, 3] }).toEqual({ a: 1, list: [2, 3] });
  });

  it('toBeNull', () => {
    expect(null).toBeNull();
    expect(0).not.toBeNull();
  });

  it('toContain — substring or element text', () => {
    expect('hello world').toContain('world');
    expect('hello world').not.toContain('bye');
    expect(render().getByText('OFF')).toContain('OFF');
  });

  it('toHaveLength', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('abcd').toHaveLength(4);
  });
});

// ── Reference: render(), screen and DOM queries ──────────────────────────────
describe('adapter: render + queries', () => {
  it('screen mirrors the last render()', () => {
    render();
    expect(screen.getByText('OFF')).toBeInTheDocument();
    expect(screen.queryByText('nope')).toBeNull();
  });

  it('render(element) mounts a custom element; getByPlaceholderText + change', () => {
    const { getByPlaceholderText } = render(
      React.createElement('input', { placeholder: 'Email' }),
    );
    const field = getByPlaceholderText('Email') as HTMLInputElement;

    fireEvent.change(field, { target: { value: 'me@example.com' } });
    expect(field.value).toBe('me@example.com');
  });
});

// ── Reference: renderHook + act ──────────────────────────────────────────────
describe('adapter: renderHook + act', () => {
  it('drives a hook and flushes updates', () => {
    const { result } = renderHook(() => React.useState(0));

    expect(result.current[0]).toBe(0);

    act(() => result.current[1](5));

    expect(result.current[0]).toBe(5);
  });
});

// ── Reference: beforeEach runs before every `it` in scope ────────────────────
describe('adapter: beforeEach', () => {
  let runs = 0;
  beforeEach(() => {
    runs += 1;
  });

  it('has run once before the first test', () => {
    expect(runs).toBe(1);
  });

  it('has run again before the second test', () => {
    expect(runs).toBe(2);
  });
});

// ── Also available (use inside an `it`, against rendered elements) ────────────
//   const { getByTestId } = render(React.createElement('div', { 'data-testid': 'box' }, 'hi'));
//   expect(getByTestId('box')).toBeInTheDocument();
//
//   fireEvent.keyDown(element, { key: 'Enter' });            // dispatch a keydown
//   fireEvent.scroll(element, { target: { scrollTop: 200 } }); // dispatch a scroll
