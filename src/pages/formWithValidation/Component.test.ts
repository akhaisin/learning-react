import { describe, it, expect, render, fireEvent, act } from '../../test/vitest-adapter';

describe('Form With Validation Exercise', () => {
  it('shows errors after submit marks the fields as touched', () => {
    const { container, queryByText } = render();
    const form = container.querySelector('form') as HTMLFormElement;

    expect(queryByText('Email is required.')).toBeNull();

    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(queryByText('Email is required.')).not.toBeNull();
  });

  it('enables submit for valid values and shows a success message', () => {
    const { container, getByText } = render();
    const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
    const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
    const submitButton = getByText('Submit') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(submitButton.disabled).toBe(false);

    fireEvent.click(submitButton);
    expect(getByText('Signed in successfully.')).toBeInTheDocument();
  });
});