/**
 * UI/OfficialLayout.js
 *
 * Lets a window follow the layout of the official client instead of roBrowser's own.
 * Both versions stay in the client; the `officialLayout` config picks one:
 *
 *   officialLayout: true                        // every window that has an official layout
 *   officialLayout: ['Vending', 'Navigation']   // only these windows
 *
 * With the config unset, every window keeps roBrowser's own layout.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Configs from 'Core/Configs.js';

/**
 * Does this window use the official layout?
 *
 * @param {string} name - the window's public name, e.g. 'Vending'
 * @returns {boolean}
 */
export function useOfficialLayout(name) {
	const value = Configs.get('officialLayout', false);

	if (Array.isArray(value)) {
		return value.includes(name);
	}

	return value === true;
}

/**
 * Wrap a window's two versions in one object that forwards to the version the config picks.
 * Importers keep using the window as before; the choice is made each time it is used, so a
 * server's own config (applied at login) is honoured.
 *
 * @param {string} name - the window's public name
 * @param {object} stock - roBrowser's own window
 * @param {object} official - the window following the official client
 * @returns {object}
 */
export function selectLayout(name, stock, official) {
	const pick = () => (useOfficialLayout(name) ? official : stock);

	return new Proxy(stock, {
		get(_target, key) {
			const ui = pick();
			const value = ui[key];
			return typeof value === 'function' ? value.bind(ui) : value;
		},
		set(_target, key, value) {
			pick()[key] = value;
			return true;
		},
		has(_target, key) {
			return key in pick();
		}
	});
}

export default { useOfficialLayout, selectLayout };
