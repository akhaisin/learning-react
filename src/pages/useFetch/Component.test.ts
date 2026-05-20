import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('useFetch Exercise', () => {
  it('renders mock profile data', () => {
    const { getByText } = render();

    expect(getByText('Ada Lovelace')).toBeInTheDocument();
    expect(getByText('Mathematician')).toBeInTheDocument();
  });

  it('shows an error state for a missing mock resource', () => {
    const { getByText } = render();

    fireEvent.click(getByText('Load error example'));
    expect(getByText('Mock resource not found.')).toBeInTheDocument();
  });
});