/**
 * UI/Components/Vending/VendingRules.js
 *
 * Number rules of the official "Vend a Shop" window (UIMerchantShopMakeWnd),
 * kept apart from the DOM so they can be tested.
 */

/**
 * Highest price a vending item can be sold for.
 * @type {number}
 */
export const MAX_VENDING_PRICE = 1000000000;

/**
 * Highest price a buying store can offer per item.
 * @type {number}
 */
export const MAX_BUYING_PRICE = 99990000;

/**
 * Prices at or above this ask for confirmation while "Safe check" is on.
 * @type {number}
 */
export const SAFE_CHECK_PRICE = 10000000;

/**
 * Tax rate in percent the official window applies to a price: 5 above 10,000,000 zeny, else none.
 *
 * @param {number} price
 * @returns {number}
 */
export function taxRate(price) {
	return price > 10000000 ? 5 : 0;
}

/**
 * Zeny that changes hands for one item at this price, as the window's "Transaction :" line shows it.
 * A seller receives the price less the tax; a buying store pays the price plus the tax.
 *
 * @param {number} price
 * @param {boolean} buying
 * @returns {number}
 */
export function transactionZeny(price, buying) {
	const tax = Math.trunc((price * taxRate(price)) / 100);
	return buying ? price + tax : price - tax;
}

/**
 * Parse an edit box's text the way the official window does: digits only.
 *
 * @param {string} text
 * @returns {number|null} the value, 0 when empty, or null when the text is not a number
 */
export function parsePrice(text) {
	const value = String(text).trim();
	if (!value) {
		return 0;
	}
	if (!/^[0-9]+$/.test(value)) {
		return null;
	}
	return parseInt(value, 10);
}

/**
 * Amount line of the "Safe check" confirmation: MsgStr 2475 (millions) from 100,000,000 zeny,
 * MsgStr 2477 (tens of millions) from 10,000,000 zeny, nothing below.
 *
 * @param {number} price
 * @param {function(number): string} getMessage
 * @returns {string}
 */
export function safeCheckAmount(price, getMessage) {
	let text;
	if (price >= 100000000) {
		text = getMessage(2475).replace('%d', Math.floor(price / 1000000));
	} else if (price >= SAFE_CHECK_PRICE) {
		text = getMessage(2477).replace('%d', Math.floor(price / 10000000));
	} else {
		return '';
	}
	return stripColors(text);
}

/**
 * Remove ^RRGGBB colour codes from a message.
 *
 * @param {string} text
 * @returns {string}
 */
export function stripColors(text) {
	return String(text).replace(/\^[0-9a-fA-F]{6}/g, '');
}
