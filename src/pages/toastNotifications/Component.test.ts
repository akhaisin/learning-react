import { describe, it, expect, render, fireEvent, screen } from '../../test/vitest-adapter';

describe('Toast Notifications Exercise', () => {
  it('adds a toast through the context API', () => {
    const { getByText } = render();

    fireEvent.click(getByText('Show success toast'));

    expect(screen.getByText('Profile saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes were stored successfully.')).toBeInTheDocument();
  });

  it('dismisses a toast from the portal viewport', () => {
    const { getByText } = render();

    fireEvent.click(getByText('Show success toast'));
    fireEvent.click(screen.getByText('Dismiss'));

    expect(screen.queryByText('Profile saved')).toBeNull();
  });
});