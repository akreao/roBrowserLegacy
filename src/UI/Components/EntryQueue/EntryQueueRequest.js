/**
 * UI/Components/EntryQueue/EntryQueueRequest.js
 *
 * Battleground queue: the battleground is ready, enter or decline. Laid out from
 * the official UIEntryQueueRequestWnd (window 0xD2)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import EntryQueue from './EntryQueue.js';
import htmlText from './EntryQueueRequest.html?raw';
import cssText from './EntryQueueRequest.css?raw';

const EntryQueueRequest = new GUIComponent('EntryQueueRequest', cssText);

EntryQueueRequest.render = () => htmlText;

/**
 * Seconds the official window waits before it declines by itself
 */
EntryQueueRequest.TIMEOUT = 20;

const _preferences = Preferences.get('EntryQueueRequest', { x: 300, y: 200 }, 1.0);

/**
 * @var {number} when the window opened, ms
 */
let _openedAt = 0;

/**
 * @var {number} countdown timer
 */
let _timer = 0;

EntryQueueRequest.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.ok').addEventListener('click', () => answer(true));
	root.querySelector('.cancel').addEventListener('click', () => answer(false));

	this.draggable('.titlebar');
};

EntryQueueRequest.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';

	_openedAt = Date.now();
	clearInterval(_timer);
	_timer = setInterval(tick, 250);
	tick();
};

EntryQueueRequest.onRemove = function onRemove() {
	clearInterval(_timer);
	_timer = 0;

	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * @param {string} name - the battleground's name, shown on the first line
 */
EntryQueueRequest.setName = function setName(name) {
	this.getRoot().querySelector('.title').textContent = EntryQueue.format(
		DB.getMessage(2126, '%s battleground is going to start.'),
		name
	);
};

/**
 * Count the seconds down, and decline when none are left
 */
function tick() {
	const left = EntryQueueRequest.TIMEOUT - Math.floor((Date.now() - _openedAt) / 1000);

	if (left <= 0) {
		answer(false);
		return;
	}

	EntryQueueRequest.getRoot().querySelector('.countdown').textContent = EntryQueue.format(
		DB.getMessage(2134, 'Awaiting time to accept:%d seconds'),
		left
	);
}

/**
 * @param {boolean} accept - enter the battleground
 */
function answer(accept) {
	if (!EntryQueueRequest.__active) {
		return;
	}
	EntryQueueRequest.remove();
	EntryQueueRequest.onAnswer(accept);
}

/**
 * Callbacks, set by the engine
 */
EntryQueueRequest.onAnswer = function onAnswer(/* accept */) {};

export default UIManager.addComponent(EntryQueueRequest);
