/**
 * UI/Components/EntryQueue/EntryQueueStandBy.js
 *
 * Battleground queue: waiting in the queue, laid out from the official
 * UIEntryQueueStandByWnd (window 0xD1)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import EntryQueue from './EntryQueue.js';
import htmlText from './EntryQueueStandBy.html?raw';
import cssText from './EntryQueueStandBy.css?raw';

const EntryQueueStandBy = new GUIComponent('EntryQueueStandBy', cssText);

EntryQueueStandBy.render = () => htmlText;

const _preferences = Preferences.get('EntryQueueStandBy', { x: 300, y: 200 }, 1.0);

EntryQueueStandBy.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.cancel').addEventListener('click', () => EntryQueueStandBy.onCancel());
	root.querySelector('.close').addEventListener('click', () => EntryQueueStandBy.remove());

	this.draggable('.titlebar');
};

EntryQueueStandBy.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
};

EntryQueueStandBy.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * Show where the player stands in the queue
 *
 * @param {string} name - battleground name
 * @param {number} players - players the battleground takes, both teams
 * @param {number} ranking - place in the queue
 */
EntryQueueStandBy.setQueue = function setQueue(name, players, ranking) {
	const root = this.getRoot();

	root.querySelector('.name').textContent = EntryQueue.format(DB.getMessage(2136, 'Battleground: %s'), name);
	root.querySelector('.players').textContent = EntryQueue.format(DB.getMessage(2137, 'Players needed: %d'), players);
	root.querySelector('.ranking').textContent = EntryQueue.format(DB.getMessage(2138, 'Place in queue: %d'), ranking);
};

/**
 * Callbacks, set by the engine
 */
EntryQueueStandBy.onCancel = function onCancel() {};

export default UIManager.addComponent(EntryQueueStandBy);
