/**
 * UI/Components/BroadcastBalloon/BroadcastBalloon.js
 *
 * Server announcements, as the 2026 client shows them (UIBroadcastBalloon):
 * up to three at once, each in its own centred grey box, the newest at the
 * bottom, each gone 20 seconds after it came.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import Events from 'Core/Events.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import htmlText from './BroadcastBalloon.html?raw';
import cssText from './BroadcastBalloon.css?raw';

const BroadcastBalloon = new GUIComponent('BroadcastBalloon', cssText);

BroadcastBalloon.mouseMode = GUIComponent.MouseMode.CROSS;
BroadcastBalloon.needFocus = false;

/**
 * At most three announcements; adding a fourth drops the oldest (iRO 0x7e4c10)
 */
const MAX_ENTRIES = 3;

/**
 * Each one lasts 20 seconds (iRO 0x50afe0)
 */
const LIFE = 20 * 1000;

/**
 * ZC_BROADCAST text wraps at 72 bytes (iRO 0x9c20e0)
 */
const WRAP_BYTES = 72;

/**
 * @var {Array} shown entries, oldest first: { element, timer }
 */
const _entries = [];

BroadcastBalloon.render = () => htmlText;

/**
 * Split a message into lines of at most `limit` bytes, counting a character
 * past ASCII as two, as the client's code page does. A line breaks after its
 * last space, mid-word only when it has none, and at every newline.
 *
 * @param {string} text
 * @param {number} limit
 * @returns {Array<string>}
 */
export function wrapBytes(text, limit = WRAP_BYTES) {
	const lines = [];
	const size = ch => (ch.charCodeAt(0) > 0x7f ? 2 : 1);

	text.split('\n').forEach(part => {
		let chars = Array.from(part);
		while (chars.length) {
			let bytes = 0;
			let end = 0;
			let lastSpace = -1;
			while (end < chars.length && bytes + size(chars[end]) <= limit) {
				bytes += size(chars[end]);
				if (chars[end] === ' ') {
					lastSpace = end;
				}
				end++;
			}
			if (end < chars.length && lastSpace > 0) {
				end = lastSpace + 1;
			}
			lines.push(chars.slice(0, end).join('').trimEnd());
			chars = chars.slice(end);
		}
	});

	return lines.length ? lines : [''];
}

/**
 * Remove one entry
 *
 * @param {object} entry
 */
function drop(entry) {
	const index = _entries.indexOf(entry);
	if (index !== -1) {
		_entries.splice(index, 1);
	}
	Events.clearTimeout(entry.timer);
	entry.element.remove();
	if (!_entries.length) {
		BroadcastBalloon.remove();
	}
}

/**
 * Show an announcement
 *
 * @param {string} text
 * @param {string} color CSS colour of the text
 * @param {object} [options]
 * @param {boolean} [options.wrap] wrap at 72 bytes (ZC_BROADCAST); ZC_BROADCAST2 keeps one line
 * @param {number} [options.fontSize] ZC_BROADCAST2's font size, 12 otherwise
 */
BroadcastBalloon.add = function add(text, color, options = {}) {
	if (!this.__active) {
		this.append();
	}

	const element = document.createElement('div');
	element.className = 'entry';
	const lines = options.wrap === false ? [text] : wrapBytes(text);
	lines.forEach(line => {
		const lineElement = document.createElement('div');
		lineElement.className = 'line';
		lineElement.textContent = line;
		lineElement.style.color = color || '#FFFF00';
		if (options.fontSize && options.fontSize !== 12) {
			lineElement.style.fontSize = `${options.fontSize}px`;
			lineElement.style.lineHeight = `${options.fontSize + 2}px`;
		}
		element.appendChild(lineElement);
	});
	this.getRoot().querySelector('#BroadcastBalloon').appendChild(element);

	const entry = { element, timer: 0 };
	entry.timer = Events.setTimeout(() => drop(entry), LIFE);
	_entries.push(entry);

	while (_entries.length > MAX_ENTRIES) {
		drop(_entries[0]);
	}
};

/**
 * Once removed, forget every entry
 */
BroadcastBalloon.onRemove = function onRemove() {
	while (_entries.length) {
		const entry = _entries.shift();
		Events.clearTimeout(entry.timer);
		entry.element.remove();
	}
};

export default UIManager.addComponent(BroadcastBalloon);
