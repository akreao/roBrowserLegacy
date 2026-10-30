/**
 * UI/ColorText.js
 *
 * Draw text that carries RO colour codes (^RRGGBB) as coloured spans.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

/**
 * Put text into an element, honouring ^RRGGBB colour codes. Each code starts a
 * span in that colour, and ^000000 goes back to the element's own colour. The
 * text is added as text nodes, never parsed as HTML.
 *
 * @param {HTMLElement} parent
 * @param {string} text
 */
export function appendColorText(parent, text) {
	const parts = String(text ?? '').split(/\^([0-9a-fA-F]{6})/);
	let node = parent;
	for (let i = 0; i < parts.length; i++) {
		if (i % 2) {
			node = document.createElement('span');
			if (parts[i] !== '000000') node.style.color = `#${parts[i]}`;
			parent.appendChild(node);
		} else if (parts[i]) {
			node.appendChild(document.createTextNode(parts[i]));
		}
	}
}

/**
 * Replace an element's content with colour-coded text.
 *
 * @param {HTMLElement} el
 * @param {string} text
 */
export function setColorText(el, text) {
	el.textContent = '';
	appendColorText(el, text);
}
