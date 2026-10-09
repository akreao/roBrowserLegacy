/**
 * UI/Components/PrivateAirship/PrivateAirship.js
 *
 * Private airship: fly to another map by spending a ticket item
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import Renderer from 'Renderer/Renderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import Inventory from 'UI/Components/Inventory/Inventory.js';
import 'UI/Elements/Elements.js';
import htmlText from './PrivateAirship.html?raw';
import cssText from './PrivateAirship.css?raw';

const PrivateAirship = new GUIComponent('PrivateAirship', cssText);

PrivateAirship.render = () => htmlText;

/**
 * Items the server takes for a flight: rAthena's PRIVATE_AIRSHIP item group
 * (Nyangvine Fruit, World Tour Ticket)
 */
PrivateAirship.ITEMS = [6909, 25464];

/**
 * ZC_PRIVATE_AIRSHIP_RESPONSE results, rAthena's e_private_airship_response
 */
PrivateAirship.RESULT = {
	OK: 0,
	RETRY: 1,
	ITEM_NOT_ENOUGH: 2,
	DESTINATION_MAP_INVALID: 3,
	SOURCE_MAP_INVALID: 4,
	ITEM_UNAVAILABLE: 5
};

/**
 * The message the official client shows for each failure (msgstringtable id)
 */
const RESULT_MESSAGES = {
	1: [2825, 'Please try again.'],
	2: [3333, 'You do not have the item needed for the private airship.'],
	3: [3332, 'The private airship cannot fly to this map.'],
	4: [3331, 'The private airship cannot be used on this map.'],
	5: [3352, 'This item cannot be used for the private airship.']
};

const _preferences = Preferences.get('PrivateAirship', { x: 200, y: 200 }, 1.0);

/**
 * @var {string} map flown to
 */
let _mapName = '';

/**
 * @var {number} item chosen to pay with
 */
let _itemId = 0;

/**
 * @var {boolean} a request is waiting for its answer
 */
let _waiting = false;

PrivateAirship.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => PrivateAirship.remove());
	root.querySelector('.cancel').addEventListener('click', () => PrivateAirship.remove());
	root.querySelector('.ok').addEventListener('click', () => PrivateAirship.request());

	root.querySelector('.items').addEventListener('click', event => {
		const row = event.target.closest('.row');
		if (row && !row.classList.contains('missing')) {
			selectItem(parseInt(row.getAttribute('data-id'), 10));
		}
	});

	this.draggable('.titlebar');
};

PrivateAirship.onAppend = function onAppend() {
	this._host.style.top = Math.min(Math.max(0, _preferences.y), Renderer.height - 150) + 'px';
	this._host.style.left = Math.min(Math.max(0, _preferences.x), Renderer.width - 240) + 'px';
};

PrivateAirship.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
	_waiting = false;
};

/**
 * Open the window for a destination
 *
 * @param {string} mapName - e.g. "prontera" or "prontera.gat"
 */
PrivateAirship.open = function open(mapName) {
	_mapName = String(mapName || '').replace(/\.(gat|rsw)$/i, '');
	_waiting = false;
	this.append();

	const root = this.getRoot();
	const name = DB.getMapName(_mapName + '.rsw', _mapName);
	root.querySelector('.destination').textContent = name === _mapName ? name : `${name} (${_mapName})`;
	this.setStatus('');
	listItems();
};

/**
 * @param {string} text - message under the item list
 */
PrivateAirship.setStatus = function setStatus(text) {
	this.getRoot().querySelector('.status').textContent = text;
};

/**
 * Ask the server for the flight
 */
PrivateAirship.request = function request() {
	if (_waiting || !_mapName || !_itemId) {
		return;
	}
	_waiting = true;
	this.getRoot().querySelector('.ok').classList.add('disabled');
	this.setStatus('');
	this.onRequest(_mapName, _itemId);
};

/**
 * The server's answer (ZC_PRIVATE_AIRSHIP_RESPONSE)
 *
 * @param {number} result - PrivateAirship.RESULT
 * @returns {string|null} the failure message shown, if any
 */
PrivateAirship.onResult = function onResult(result) {
	if (!this.__active) {
		return null;
	}

	_waiting = false;
	this.getRoot().querySelector('.ok').classList.toggle('disabled', !_itemId);

	if (result === PrivateAirship.RESULT.OK) {
		// The warp follows
		this.remove();
		return null;
	}

	const message = RESULT_MESSAGES[result];
	if (!message) {
		return null;
	}
	const text = DB.getMessage(message[0], message[1]);
	this.setStatus(text);
	return text;
};

/**
 * List the ticket items, the ones the player carries first
 */
function listItems() {
	const root = PrivateAirship.getRoot();
	const list = root.querySelector('.items');
	const inventory = Inventory.getUI();
	const rows = PrivateAirship.ITEMS.map(id => {
		const owned = inventory && inventory.getItemById ? inventory.getItemById(id) : null;
		return { id, count: owned ? owned.count : 0 };
	}).sort((a, b) => (b.count > 0) - (a.count > 0));

	list.innerHTML = '';
	_itemId = 0;
	rows.forEach(entry => {
		const info = DB.getItemInfo(entry.id);
		const row = document.createElement('div');
		row.className = 'row' + (entry.count ? '' : ' missing');
		row.setAttribute('data-id', entry.id);
		row.textContent = `${info.identifiedDisplayName} (${entry.count})`;
		list.appendChild(row);
	});

	const first = rows.find(entry => entry.count > 0);
	selectItem(first ? first.id : 0);
}

/**
 * @param {number} id - item to pay with, 0 for none
 */
function selectItem(id) {
	_itemId = id;
	const root = PrivateAirship.getRoot();
	root.querySelectorAll('.items .row').forEach(row => {
		row.classList.toggle('selected', parseInt(row.getAttribute('data-id'), 10) === id);
	});
	root.querySelector('.ok').classList.toggle('disabled', !id || _waiting);
}

/**
 * Callback, set by the engine
 */
PrivateAirship.onRequest = function onRequest(/* mapName, itemId */) {};

export default UIManager.addComponent(PrivateAirship);
