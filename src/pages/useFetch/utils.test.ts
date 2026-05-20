import useFetch, { resolveMockResponse } from './utils';
import { describe, it, expect, renderHook } from '../../test/vitest-adapter';

describe('useFetch utils', () => {
  it('resolves known mock responses', () => {
    expect(resolveMockResponse<{ name: string }>('mock:profile')).toEqual({
      id: 1,
      name: 'Ada Lovelace',
      role: 'Mathematician',
    });
  });

  it('returns mock data through the hook', () => {
    const { result } = renderHook(() => useFetch<{ name: string }>('mock:profile'));
    expect(result.current.data?.name ?? '').toBe('Ada Lovelace');
  });
});