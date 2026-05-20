import useUndo from './utils';
import { describe, it, expect, renderHook, act } from '../../test/vitest-adapter';

describe('useUndo', () => {
  it('tracks value history', () => {
    const { result } = renderHook(() => useUndo(''));

    act(() => result.current[1]('alpha'));
    act(() => result.current[1]('beta'));

    expect(result.current[0]).toBe('beta');
    expect(result.current[4]).toBe(true);
  });

  it('undoes and redoes values', () => {
    const { result } = renderHook(() => useUndo(''));

    act(() => result.current[1]('alpha'));
    act(() => result.current[1]('beta'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('alpha');

    act(() => result.current[3]());
    expect(result.current[0]).toBe('beta');
  });
});