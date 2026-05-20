import { getVisibleRange } from './utils';
import { describe, it, expect } from '../../test/vitest-adapter';

describe('virtual list utils', () => {
  it('calculates the visible range from scroll position', () => {
    expect(getVisibleRange(0, 40, 240, 100)).toEqual({ startIndex: 0, endIndex: 7 });
  });

  it('clamps the range within the available items', () => {
    expect(getVisibleRange(3960, 40, 240, 100)).toEqual({ startIndex: 99, endIndex: 100 });
  });
});