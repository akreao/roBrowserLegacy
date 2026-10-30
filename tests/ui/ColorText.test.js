/**
 * tests/ui/ColorText.test.js
 *
 * Text with RO colour codes (^RRGGBB) is drawn as coloured spans, as text.
 */
import { describe, expect, it } from 'vitest';
import { appendColorText, setColorText } from 'UI/ColorText.js';

describe('ColorText', () => {
	it('colours the text after each code, and ^000000 goes back to the default colour', () => {
		const el = document.createElement('div');
		appendColorText(el, 'Use ^0000FFExpansion Ticket^000000 to grow to ^FF0000110^000000?');

		expect(el.textContent).toBe('Use Expansion Ticket to grow to 110?');
		const spans = el.querySelectorAll('span');
		expect(spans).toHaveLength(4);
		expect(spans[0].textContent).toBe('Expansion Ticket');
		expect(spans[0].style.color).toBe('rgb(0, 0, 255)');
		expect(spans[1].style.color).toBe('');
		expect(spans[1].textContent).toBe(' to grow to ');
		expect(spans[2].style.color).toBe('rgb(255, 0, 0)');
		expect(spans[3].textContent).toBe('?');
	});

	it('leaves text with no codes as plain text', () => {
		const el = document.createElement('div');
		appendColorText(el, 'Plain message');

		expect(el.innerHTML).toBe('Plain message');
	});

	it('never parses the text as HTML', () => {
		const el = document.createElement('div');
		appendColorText(el, '^FF0000<b>Guild</b> & co');

		expect(el.querySelector('b')).toBeNull();
		expect(el.textContent).toBe('<b>Guild</b> & co');
	});

	it('keeps a ^ that is not a colour code', () => {
		const el = document.createElement('div');
		appendColorText(el, 'Cheers ^_^ and ^12345');

		expect(el.textContent).toBe('Cheers ^_^ and ^12345');
	});

	it('replaces what was there with setColorText', () => {
		const el = document.createElement('div');
		el.textContent = 'old';
		setColorText(el, '^00FF00new');

		expect(el.textContent).toBe('new');
		expect(el.firstChild.style.color).toBe('rgb(0, 255, 0)');
	});
});
