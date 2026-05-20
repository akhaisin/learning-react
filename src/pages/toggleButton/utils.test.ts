/* eslint-disable @typescript-eslint/no-explicit-any */
import useToggle from './utils';

export function runTests({ describe, it, expect, renderHook, act }: any) {
  describe('useToggle', () => {
    it('defaults to false', () => {
      const { result } = renderHook(() => useToggle());
      expect(result.current[0]).toBe(false);
    });

    it('respects initialValue = true', () => {
      const { result } = renderHook(() => useToggle(true));
      expect(result.current[0]).toBe(true);
    });

    it('toggles state on each call', () => {
      const { result } = renderHook(() => useToggle());
      expect(result.current[0]).toBe(false);
      act(() => result.current[1]());
      expect(result.current[0]).toBe(true);
      act(() => result.current[1]());
      expect(result.current[0]).toBe(false);
    });
  });
}

export default runTests;
