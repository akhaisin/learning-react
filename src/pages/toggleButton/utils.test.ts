import useToggle from './utils';
import { describe, it, expect, renderHook, act } from '../../test/vitest-adapter';

describe('useToggle', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useToggle());

    const [value] = result.current;

    expect(value).toBe(false);
  });

  it('respects initialValue = true', () => {
    const { result } = renderHook(() => useToggle(true));

    const [value] = result.current;

    expect(value).toBe(true);
  });

  it('toggles state on each call', () => {
    const { result } = renderHook(() => useToggle());

    const [initialValue, toggle] = result.current;
    expect(initialValue).toBe(false);

    act(() => toggle());

    const [valueAfterFirstToggle, toggleAgain] = result.current;
    expect(valueAfterFirstToggle).toBe(true);

    act(() => toggleAgain());

    const [valueAfterSecondToggle] = result.current;
    expect(valueAfterSecondToggle).toBe(false);
  });
});
