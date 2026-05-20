import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

describe('Multi-Step Form Exercise', () => {
  it('moves through the steps and shows collected values on review', () => {
    const { container, getByText } = render();
    const stepOneInputs = container.querySelectorAll('input');

    fireEvent.change(stepOneInputs[0] as HTMLInputElement, { target: { value: 'Ada' } });
    fireEvent.change(stepOneInputs[1] as HTMLInputElement, { target: { value: 'Lovelace' } });
    fireEvent.click(getByText('Next'));

    const stepTwoInputs = container.querySelectorAll('input');
    fireEvent.change(stepTwoInputs[0] as HTMLInputElement, { target: { value: 'ada@example.com' } });
    fireEvent.change(stepTwoInputs[1] as HTMLInputElement, { target: { value: '555-0100' } });
    fireEvent.click(getByText('Next'));

    expect(getByText('Ada')).toBeInTheDocument();
    expect(getByText('ada@example.com')).toBeInTheDocument();
  });

  it('submits from the review step', () => {
    const { container, getByText } = render();
    const firstInputs = container.querySelectorAll('input');

    fireEvent.change(firstInputs[0] as HTMLInputElement, { target: { value: 'Ada' } });
    fireEvent.change(firstInputs[1] as HTMLInputElement, { target: { value: 'Lovelace' } });
    fireEvent.click(getByText('Next'));

    const secondInputs = container.querySelectorAll('input');
    fireEvent.change(secondInputs[0] as HTMLInputElement, { target: { value: 'ada@example.com' } });
    fireEvent.change(secondInputs[1] as HTMLInputElement, { target: { value: '555-0100' } });
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Submit'));

    expect(getByText('Form submitted successfully.')).toBeInTheDocument();
  });
});