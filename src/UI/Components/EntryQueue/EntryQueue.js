/**
 * UI/Components/EntryQueue/EntryQueue.js
 *
 * Battleground queue: the list of battlegrounds and the buttons to apply,
 * laid out from the official UIEntryQueueWnd (window 0x9D)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import htmlText from './EntryQueue.html?raw';
import cssText from './EntryQueue.css?raw';

const EntryQueue = new GUIComponent('EntryQueue', cssText);

EntryQueue.render = () => htmlText;

/**
 * Application types, as CZ_REQ_ENTRY_QUEUE_APPLY sends them
 */
EntryQueue.APPLY = {
	SOLO: 1,
	PARTY: 2,
	GUILD: 4
};

/**
 * Confirmation asked before each application type
 */
const CONFIRM_MSG = {
	1: [2146, 'Apply alone?'],
	2: [2147, 'Apply with your party?'],
	4: [2148, 'Apply with your guild?']
};

const _preferences = Preferences.get('EntryQueue', { x: 120, y: 120 }, 1.0);

/**
 * @var {object} battleground shown, from DB.getEntryQueueList()
 */
let _selected = null;

/**
 * Fill a msgstringtable line's %s and %d in order
 *
 * @param {string} text
 * @param {...*} args
 * @return {string}
 */
EntryQueue.format = function format(text, ...args) {
	let i = 0;
	return text.replace(/%[sd]/g, match => (i < args.length ? String(args[i++]) : match));
};

EntryQueue.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => EntryQueue.remove());

	root.querySelector('.list').addEventListener('click', event => {
		const row = event.target.closest('.entry');
		if (row) {
			select(DB.getEntryQueueList()[parseInt(row.getAttribute('data-index'), 10)]);
		}
	});

	root.querySelectorAll('.apply').forEach(button => {
		button.addEventListener('click', () => apply(parseInt(button.getAttribute('data-type'), 10)));
	});

	this.draggable('.titlebar');
};

EntryQueue.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';

	const list = DB.getEntryQueueList();
	const root = this.getRoot();
	const box = root.querySelector('.list');

	box.innerHTML = '';
	list.forEach((entry, i) => {
		const row = document.createElement('div');
		row.className = 'entry';
		row.setAttribute('data-index', i);
		row.textContent = entry.displayName || entry.name;
		row.title = row.textContent;
		box.appendChild(row);
	});

	// The official window shows the first battleground when it opens
	select(list.includes(_selected) ? _selected : list[0] || null);
};

EntryQueue.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

EntryQueue.toggle = function toggle() {
	if (this.__active) {
		this.remove();
	} else {
		this.append();
	}
};

/**
 * @return {object|null} the battleground shown
 */
EntryQueue.getSelected = function getSelected() {
	return _selected;
};

/**
 * Text of the level line, as the official window writes it
 *
 * @param {object} entry
 * @return {string}
 */
EntryQueue.levelText = function levelText(entry) {
	switch (entry.levelType) {
		case 1:
			return EntryQueue.format(DB.getMessage(2151, 'Level %d and above'), entry.minLevel);
		case 2:
			return EntryQueue.format(DB.getMessage(2152, 'Level %d and below'), entry.minLevel);
		case 3:
			return EntryQueue.format(DB.getMessage(2153, 'Level %d ~ %d'), entry.minLevel, entry.maxLevel);
		default:
			return DB.getMessage(2154, 'Any level');
	}
};

/**
 * Show a battleground's picture and details
 *
 * @param {object|null} entry
 */
function select(entry) {
	const root = EntryQueue.getRoot();
	const values = root.querySelectorAll('.info .value');
	const image = root.querySelector('.image');

	_selected = entry;
	EntryQueue.onSelect(entry);

	root.querySelectorAll('.entry').forEach(row => {
		row.classList.toggle('selected', DB.getEntryQueueList()[row.getAttribute('data-index')] === entry);
	});

	image.style.backgroundImage = '';
	values.forEach(value => (value.textContent = ''));
	root.querySelectorAll('.apply').forEach(button => (button.disabled = !entry));

	if (!entry) {
		return;
	}

	const lines = [
		entry.displayName || entry.name,
		EntryQueue.format(DB.getMessage(2150, '%d vs %d'), entry.teamA, entry.teamB),
		EntryQueue.levelText(entry),
		...entry.notes
	];
	lines.forEach((text, i) => {
		values[i].textContent = text;
		values[i].title = text;
	});

	// rAthena: "the entryqueuelist.lub can visually disable these options"
	root.querySelector('.apply.solo').disabled = !entry.apply.solo;
	root.querySelector('.apply.party').disabled = !entry.apply.party;
	root.querySelector('.apply.guild').disabled = !entry.apply.guild;

	if (entry.image) {
		Client.loadFile(`${DB.INTERFACE_PATH}battle_field/${entry.image}`, data => {
			if (_selected === entry) {
				image.style.backgroundImage = `url(${data})`;
			}
		});
	}
}

/**
 * Confirm, then apply for the battleground shown
 *
 * @param {number} type - EntryQueue.APPLY
 */
function apply(type) {
	const entry = _selected;
	const [msgId, fallback] = CONFIRM_MSG[type] || [];

	if (!entry || !msgId) {
		return;
	}

	UIManager.showPromptBox(
		`${entry.displayName || entry.name} ${DB.getMessage(msgId, fallback)}`,
		'ok',
		'cancel',
		() => EntryQueue.onApply(type, entry)
	);
}

/**
 * Callbacks, set by the engine
 */
EntryQueue.onSelect = function onSelect(/* entry */) {};
EntryQueue.onApply = function onApply(/* type, entry */) {};

export default UIManager.addComponent(EntryQueue);
