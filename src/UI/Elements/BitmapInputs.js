/**
 * UI/Elements/BitmapInputs.js
 *
 * Draws native checkboxes and radio buttons with the client's own bitmaps,
 * as the official windows draw theirs: checkbox_0/1.bmp and radiobtn_off/on.bmp.
 *
 * The inputs stay native, so forms, events and the checked property keep
 * working; only their look changes. The bitmaps are loaded once and shared
 * through CSS custom properties on the document, which shadow roots inherit.
 * The look is !important so that a window's own input rules do not undo it.
 *
 * Usage: skinInputs(this.getRoot(), 'input.view_skill_info');
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';

const BITMAPS = {
	checkbox: ['checkbox_0.bmp', 'checkbox_1.bmp'],
	radio: ['radiobtn_off.bmp', 'radiobtn_on.bmp']
};

const CSS = `
.ui-bitmap-input {
	appearance: none !important;
	-webkit-appearance: none !important;
	margin: 0 3px 0 0;
	padding: 0 !important;
	border: 0 !important;
	outline: none;
	vertical-align: middle;
	background-color: transparent !important;
	background-repeat: no-repeat !important;
	cursor: pointer;
}
.ui-bitmap-input[type='checkbox'] {
	width: var(--ui-checkbox-w, 10px) !important;
	height: var(--ui-checkbox-h, 10px) !important;
	background-image: var(--ui-checkbox-off) !important;
}
.ui-bitmap-input[type='checkbox']:checked {
	background-image: var(--ui-checkbox-on) !important;
}
.ui-bitmap-input[type='radio'] {
	width: var(--ui-radio-w, 11px) !important;
	height: var(--ui-radio-h, 11px) !important;
	background-image: var(--ui-radio-off) !important;
}
.ui-bitmap-input[type='radio']:checked {
	background-image: var(--ui-radio-on) !important;
}
.ui-bitmap-input:disabled {
	opacity: 0.5;
	cursor: default;
}
`;

/**
 * @var {boolean} bitmaps asked for
 */
let _loading = false;

/**
 * @var {WeakSet} documents and shadow roots that already have the style
 */
const _styled = new WeakSet();

/**
 * Load the bitmaps into custom properties on the document
 */
function loadBitmaps() {
	if (_loading) {
		return;
	}
	_loading = true;

	const style = document.documentElement.style;

	Object.keys(BITMAPS).forEach(type => {
		BITMAPS[type].forEach((file, on) => {
			Client.loadFile(DB.INTERFACE_PATH + file, url => {
				style.setProperty(`--ui-${type}-${on ? 'on' : 'off'}`, `url(${url})`);

				if (!on) {
					const img = new Image();
					img.onload = () => {
						style.setProperty(`--ui-${type}-w`, img.naturalWidth + 'px');
						style.setProperty(`--ui-${type}-h`, img.naturalHeight + 'px');
					};
					img.src = url;
				}
			});
		});
	});
}

/**
 * Draw the matching checkboxes and radio buttons with the client's bitmaps
 *
 * @param {ShadowRoot|HTMLElement} scope - a component's shadow root, or its element
 * @param {string} [selector] - which inputs; every checkbox and radio button by default
 */
export default function skinInputs(scope, selector = 'input[type="checkbox"], input[type="radio"]') {
	const target = scope instanceof ShadowRoot ? scope : document.head;

	loadBitmaps();

	if (!_styled.has(target)) {
		_styled.add(target);
		const style = document.createElement('style');
		style.textContent = CSS;
		target.appendChild(style);
	}

	scope.querySelectorAll(selector).forEach(input => input.classList.add('ui-bitmap-input'));
}
