import { toastReducer, type Toast } from './utils';
import { describe, it, expect } from '../../test/vitest-adapter';

const sampleToast: Toast = {
  id: 'toast-1',
  title: 'Saved',
  message: 'All changes stored.',
  duration: 1000,
};

describe('toast reducer', () => {
  it('adds a toast to state', () => {
    expect(toastReducer([], { type: 'add', toast: sampleToast })).toEqual([sampleToast]);
  });

  it('dismisses a toast by id', () => {
    expect(toastReducer([sampleToast], { type: 'dismiss', id: sampleToast.id })).toEqual([]);
  });
});