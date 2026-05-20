import * as React from 'react';
import Page from './Page';
import { describe, it, expect, render, fireEvent } from '../../test/vitest-adapter';

function getModalParts(container: HTMLElement) {
	const closeButton = container.querySelector('[aria-label="Close dialog"]') as HTMLButtonElement | null;
	const header = closeButton?.parentElement ?? null;
	const content = header?.nextElementSibling as HTMLElement | null;
	const footer = content?.nextElementSibling as HTMLElement | null;
	const okButton = footer?.querySelector('button') as HTMLButtonElement | null;

	return { closeButton, header, content, okButton };
}

describe('Modal Dialog Exercise', () => {
	it('opens the dialog with the entered caption and message, then closes it', () => {
		const { container, getByText, getByPlaceholderText, queryByText } = render(
			React.createElement(Page)
		);
		const captionInput = getByPlaceholderText('Enter dialog caption') as HTMLInputElement;
		const messageInput = getByPlaceholderText(
			'Enter message (Ctrl+Enter to send)'
		) as HTMLTextAreaElement;

		expect(queryByText('Close dialog')).toBeNull();
		fireEvent.change(captionInput, { target: { value: 'Reminder' } });
		fireEvent.change(messageInput, { target: { value: 'Ship the modal today.' } });
		fireEvent.click(getByText('Send'));
		const { header, content, okButton } = getModalParts(container);

		expect(header?.textContent ?? '').toContain('Reminder');
		expect(content?.textContent ?? '').toContain('Ship the modal today.');
		fireEvent.click(okButton!);
		expect(queryByText('Reminder')).toBeNull();

		const closeButton = container.querySelector('[aria-label="Close dialog"]');
		expect(closeButton).toBeNull();
	});

	it('uses fallback dialog text when only one field is provided', () => {
		const { container, getByText, getByPlaceholderText } = render(React.createElement(Page));
		const messageInput = getByPlaceholderText(
			'Enter message (Ctrl+Enter to send)'
		) as HTMLTextAreaElement;

		fireEvent.change(messageInput, { target: { value: 'Only body text' } });
		fireEvent.click(getByText('Send'));
		let modal = getModalParts(container);

		expect(modal.header?.textContent ?? '').toContain('Message');
		expect(modal.content?.textContent ?? '').toContain('Only body text');
		fireEvent.click(modal.okButton!);

		const captionInput = getByPlaceholderText('Enter dialog caption') as HTMLInputElement;
		fireEvent.change(messageInput, { target: { value: '' } });
		fireEvent.change(captionInput, { target: { value: 'Status' } });
		fireEvent.click(getByText('Send'));
		modal = getModalParts(container);

		expect(modal.header?.textContent ?? '').toContain('Status');
		expect(modal.content?.textContent ?? '').toContain('(no message)');
	});
});