/**
 * UI/Components/MergeItem/MergeItem.js
 *
 * Item merge: tick stacks of the same item to join them into one
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import KEYS from 'Controls/KeyEventHandler.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import Inventory from 'UI/Components/Inventory/Inventory.js';
import 'UI/Elements/Elements.js';
import htmlText from './MergeItem.html?raw';
import cssText from './MergeItem.css?raw';

const MergeItem = new GUIComponent('MergeItem', cssText);

MergeItem.render = () => htmlText;

/**
 * The official window's grid: 35px cells from (10, 20), 5 to 10 columns and
 * 3 to 6 rows, with 20px of margin across and 50px down (title and buttons)
 */
MergeItem.CELL = 35;
MergeItem.MIN_COLS = 5;
MergeItem.MAX_COLS = 10;
MergeItem.MIN_ROWS = 3;
MergeItem.MAX_ROWS = 6;
const MARGIN_X = 20;
const MARGIN_Y = 50;

/**
 * Fewest stacks a merge takes
 */
MergeItem.MIN_SELECTED = 2;

const _preferences = Preferences.get('MergeItem', { x: 200, y: 200, cols: 5, rows: 3 }, 1.0);

/**
 * @var {Array} entries shown: { index, checked }
 */
let _entries = [];

MergeItem.init = function init() {
	const root = this.getRoot();

	root.querySelector('.close').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => MergeItem.cancel());
	root.querySelector('.cancel').addEventListener('click', () => MergeItem.cancel());
	root.querySelector('.ok').addEventListener('click', () => MergeItem.merge());

	root.querySelector('.list').addEventListener('click', event => {
		const cell = event.target.closest('.cell');
		if (cell) {
			MergeItem.toggle(parseInt(cell.getAttribute('data-index'), 10), event.ctrlKey);
		}
	});

	root.querySelector('.resize').addEventListener('mousedown', startResize);

	this.draggable('.titlebar');
};

MergeItem.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
	this.getRoot().querySelector('.titlebar .text').textContent = DB.getMessage(2169, 'Merge Items');
	setSize(_preferences.cols, _preferences.rows);
};

MergeItem.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
	_entries = [];
};

MergeItem.onKeyDown = function onKeyDown(event) {
	if (event.which === KEYS.ESCAPE || event.key === 'Escape') {
		MergeItem.cancel();
		event.stopImmediatePropagation();
		return false;
	}
	return true;
};

/**
 * Open the window on the stacks the server offers
 *
 * @param {Array} indexes - inventory indexes, from ZC_MERGE_ITEM_OPEN
 */
MergeItem.open = function open(indexes) {
	_entries = indexes.map(index => ({ index, checked: false }));
	this.append();
	draw();
};

/**
 * @return {Array} inventory indexes ticked, in the order shown
 */
MergeItem.getSelected = function getSelected() {
	return _entries.filter(entry => entry.checked).map(entry => entry.index);
};

/**
 * Tick or untick a stack. With Ctrl, as in the official client, every stack
 * of that item takes the new state and every other item is unticked.
 *
 * @param {number} index - inventory index
 * @param {boolean} [all] - Ctrl was held
 */
MergeItem.toggle = function toggle(index, all) {
	const entry = _entries.find(e => e.index === index);
	if (!entry) {
		return;
	}

	entry.checked = !entry.checked;

	if (all) {
		const itemId = getItemId(index);
		_entries.forEach(e => {
			e.checked = getItemId(e.index) === itemId ? entry.checked : false;
		});
	}

	draw();
};

/**
 * Ask the server to merge the stacks ticked
 */
MergeItem.merge = function merge() {
	const selected = this.getSelected();

	if (selected.length < MergeItem.MIN_SELECTED) {
		MergeItem.onError(DB.getMessage(2170, 'Select the items to merge.'));
		return;
	}

	MergeItem.onMerge(selected);
};

/**
 * Close the window, telling the server
 */
MergeItem.cancel = function cancel() {
	if (!this.__active) {
		return;
	}
	this.remove();
	MergeItem.onCancel();
};

/**
 * @param {number} index - inventory index
 * @return {number} the item id of that stack, or 0
 */
function getItemId(index) {
	const item = Inventory.getUI().getItemByIndex(index);
	return item ? item.ITID : 0;
}

/**
 * Draw the grid: one cell per stack, row by row
 */
function draw() {
	if (!MergeItem.__active) {
		return;
	}

	const list = MergeItem.getRoot().querySelector('.list');
	const cols = _preferences.cols;

	list.innerHTML = '';

	_entries.forEach((entry, i) => {
		const item = Inventory.getUI().getItemByIndex(entry.index);
		const cell = document.createElement('div');
		const icon = document.createElement('div');
		const count = document.createElement('div');
		const checkbox = document.createElement('div');

		cell.className = 'cell';
		cell.setAttribute('data-index', entry.index);
		cell.style.left = (i % cols) * MergeItem.CELL + 'px';
		cell.style.top = Math.floor(i / cols) * MergeItem.CELL + 'px';

		icon.className = 'icon';
		count.className = 'count';
		checkbox.className = 'checkbox';
		cell.append(icon, count, checkbox);
		list.appendChild(cell);

		Client.loadFile(DB.INTERFACE_PATH + (entry.checked ? 'checkbox_1.bmp' : 'checkbox_0.bmp'), data => {
			checkbox.style.backgroundImage = `url(${data})`;
		});

		if (!item) {
			return;
		}

		const it = DB.getItemInfo(item.ITID);
		const name = DB.getItemName(item);
		const file = item.IsIdentified ? it.identifiedResourceName : it.unidentifiedResourceName;

		count.textContent = item.count;
		cell.title = `${name}: ${item.count} ea`;

		Client.loadFile(`${DB.INTERFACE_PATH}item/${file}.bmp`, data => {
			icon.style.backgroundImage = `url(${data})`;
		});
	});
}

/**
 * Size the window to a number of cells, as the official one snaps
 *
 * @param {number} cols
 * @param {number} rows
 */
function setSize(cols, rows) {
	cols = Math.max(MergeItem.MIN_COLS, Math.min(MergeItem.MAX_COLS, cols | 0));
	rows = Math.max(MergeItem.MIN_ROWS, Math.min(MergeItem.MAX_ROWS, rows | 0));

	const changed = cols !== _preferences.cols;

	_preferences.cols = cols;
	_preferences.rows = rows;
	MergeItem._host.style.width = cols * MergeItem.CELL + MARGIN_X + 'px';
	MergeItem._host.style.height = rows * MergeItem.CELL + MARGIN_Y + 'px';

	if (changed) {
		draw();
	}
}

/**
 * Drag the corner: the window grows and shrinks by whole cells
 *
 * @param {MouseEvent} event
 */
function startResize(event) {
	event.stopImmediatePropagation();
	event.preventDefault();

	const scale = MergeItem.scale || 1;
	const startX = event.clientX;
	const startY = event.clientY;
	const width = _preferences.cols * MergeItem.CELL;
	const height = _preferences.rows * MergeItem.CELL;

	function onMove(e) {
		const w = width + (e.clientX - startX) / scale;
		const h = height + (e.clientY - startY) / scale;
		setSize(Math.floor(w / MergeItem.CELL), Math.floor(h / MergeItem.CELL));
	}

	function onUp() {
		window.removeEventListener('mousemove', onMove);
		window.removeEventListener('mouseup', onUp);
		_preferences.save();
	}

	window.addEventListener('mousemove', onMove);
	window.addEventListener('mouseup', onUp);
}

/**
 * Callbacks, set by the engine
 */
MergeItem.onMerge = function onMerge(/* indexes */) {};
MergeItem.onCancel = function onCancel() {};
MergeItem.onError = function onError(/* text */) {};

MergeItem.mouseMode = GUIComponent.MouseMode.STOP;

export default UIManager.addComponent(MergeItem);
