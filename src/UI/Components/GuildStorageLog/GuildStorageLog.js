/**
 * UI/Components/GuildStorageLog/GuildStorageLog.js
 *
 * Guild storage log: the last items put in and taken out of the guild storage
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import htmlText from './GuildStorageLog.html?raw';
import cssText from './GuildStorageLog.css?raw';

const GuildStorageLog = new GUIComponent('GuildStorageLog', cssText);

GuildStorageLog.render = () => htmlText;

/**
 * Tabs, as the official window orders them
 */
GuildStorageLog.FILTER = {
	ALL: 0,
	IN: 1,
	OUT: 2
};

/**
 * Rows per page, as the official window shows them
 */
const PAGE_SIZE = 10;

const _preferences = Preferences.get('GuildStorageLog', { x: 120, y: 120 }, 1.0);

/**
 * @var {Array} log entries, in the order the server sent them
 */
let _entries = [];

/**
 * @var {number} tab shown, GuildStorageLog.FILTER
 */
let _filter = GuildStorageLog.FILTER.ALL;

/**
 * @var {number} page shown, from 0
 */
let _page = 0;

/**
 * @var {Object} in.bmp and out.bmp, once loaded
 */
const _marks = {};

GuildStorageLog.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => GuildStorageLog.remove());
	root.querySelector('.prev').addEventListener('click', () => showPage(_page - 1));
	root.querySelector('.next').addEventListener('click', () => showPage(_page + 1));
	root.querySelectorAll('.tab').forEach(tab => {
		tab.addEventListener('click', () => setFilter(parseInt(tab.getAttribute('data-filter'), 10)));
	});

	['in', 'out'].forEach(name => {
		Client.loadFile(`${DB.INTERFACE_PATH}basic_interface/${name}.bmp`, data => {
			_marks[name] = data;
			root.querySelectorAll(`.col-mark[data-mark="${name}"]`).forEach(mark => {
				mark.style.backgroundImage = `url(${data})`;
			});
		});
	});

	this.draggable('.titlebar');
};

GuildStorageLog.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
};

GuildStorageLog.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();

	_entries = [];
};

/**
 * Open the window on a log, on the first page of every entry
 *
 * @param {Array} entries - entries of ZC_ACK_GUILDSTORAGE_LOG
 */
GuildStorageLog.open = function open(entries) {
	_entries = entries.slice();
	this.append();
	setFilter(GuildStorageLog.FILTER.ALL);
};

/**
 * @param {number} filter - GuildStorageLog.FILTER
 * @return {Array} the entries a tab lists
 */
GuildStorageLog.getEntries = function getEntries(filter) {
	switch (filter) {
		case GuildStorageLog.FILTER.IN:
			return _entries.filter(entry => entry.action === 1);
		case GuildStorageLog.FILTER.OUT:
			return _entries.filter(entry => entry.action !== 1);
		default:
			return _entries;
	}
};

/**
 * Switch tabs, back to the first page as the official window does
 *
 * @param {number} filter - GuildStorageLog.FILTER
 */
function setFilter(filter) {
	_filter = filter;
	GuildStorageLog.getRoot()
		.querySelectorAll('.tab')
		.forEach(tab => {
			tab.classList.toggle('selected', parseInt(tab.getAttribute('data-filter'), 10) === filter);
		});
	showPage(0);
}

/**
 * Draw one page of the current tab
 *
 * @param {number} page - from 0
 */
function showPage(page) {
	const root = GuildStorageLog.getRoot();
	const list = root.querySelector('.list');
	const entries = GuildStorageLog.getEntries(_filter);
	const pages = Math.ceil(entries.length / PAGE_SIZE);

	_page = Math.max(0, Math.min(page, pages - 1));
	list.innerHTML = '';

	entries.slice(_page * PAGE_SIZE, (_page + 1) * PAGE_SIZE).forEach(entry => {
		const row = document.createElement('div');
		const mark = entry.action === 1 ? 'in' : 'out';
		const name = DB.getItemName(entry);

		row.className = entry.IsDamaged ? 'row damaged' : 'row';
		row.innerHTML =
			'<span class="col-mark"></span><span class="col-item"></span><span class="col-count"></span>' +
			'<span class="col-name"></span><span class="col-time"></span>';

		row.querySelector('.col-mark').setAttribute('data-mark', mark);
		if (_marks[mark]) {
			row.querySelector('.col-mark').style.backgroundImage = `url(${_marks[mark]})`;
		}
		row.querySelector('.col-item').textContent = name;
		row.querySelector('.col-item').title = name;
		row.querySelector('.col-count').textContent = entry.count;
		row.querySelector('.col-name').textContent = entry.name;
		row.querySelector('.col-time').textContent = entry.time;
		list.appendChild(row);
	});

	// "01 / 03"; an empty tab reads "01 / 01"
	const pad = n => String(n).padStart(2, '0');
	root.querySelector('.page').textContent = `${pad(_page + 1)} / ${pad(Math.max(pages, 1))}`;
}

export default UIManager.addComponent(GuildStorageLog);
