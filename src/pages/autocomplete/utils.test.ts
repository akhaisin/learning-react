import { getMatchingSuggestions } from './utils';
import { describe, it, expect } from '../../test/vitest-adapter';

describe('autocomplete utils', () => {
  it('filters suggestions case-insensitively', () => {
    expect(getMatchingSuggestions('ap')).toEqual(['Apple', 'Apricot', 'Grape']);
  });

  it('returns an empty list for blank queries', () => {
    expect(getMatchingSuggestions('')).toEqual([]);
  });
});