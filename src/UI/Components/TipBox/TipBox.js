/**
 * UI/Components/TipBox/TipBox.js
 *
 * The tip box (kRO's UITipboxWnd, window 0x13B): a picture on the left, a tip's
 * title and pages on the right, a search over the tip titles, and "Open on
 * Startup". The tips come from System/tipbox.lub (DB/TipBox/TipBoxTable.js).
 *
 * As the official window:
 *   - opened without a tip, it shows one of the general tips (id < 1000,
 *     searchable) at random;
 *   - a title splits into two lines at '#', and the text moves down a line
 *     when it has two;
 *   - the arrows page through a tip's pages;
 *   - a search lists the searchable tips whose title holds the text, and a
 *     click on one shows it;
 *   - "Open on Startup" (on by default) opens it once on the first map of a
 *     session.
 *
 * It opens from the menu's Tipbox button, Alt+D, /tip, a TIPBOX link in an
 * item description, NPC dialogue or another tip, and the server's ZC_UI_OPEN
 * with type 5 (TIPBOX_UI), whose data is the tip to show.
 *
 * Not done: the tag button (bt_tagcatch) beside the search bar, and markers
 * that move (AddPageEx distX/distY/moveTime): no tip in the files uses one.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import TipBoxTable from 'DB/TipBox/TipBoxTable.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import KEYS from 'Controls/KeyEventHandler.js';
import Renderer from 'Renderer/Renderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import htmlText from './TipBox.html?raw';
import cssText from './TipBox.css?raw';

/**
 * Window size (kRO 0x1E0 x 0x16D)
 */
const WINDOW_WIDTH = 480;
const WINDOW_HEIGHT = 365;

/**
 * The picture's area: from (1, 17), 240 x 320
 */
const PICTURE = { left: 1, top: 17, width: 240, height: 320 };

/**
 * A twinkling marker shows and hides at this period (ms)
 */
const TWINKLE_PERIOD = 300;

/**
 * Create Component
 */
const TipBox = new GUIComponent('TipBox', cssText);

TipBox.render = () => htmlText;

TipBox.needFocus = true;

/**
 * @var {Preferences} "Open on Startup", stored like the official
 * SHOWTIPSATSTARTUP, which is on unless the player turns it off
 */
const _preferences = Preferences.get('TipBox', { x: -1, y: -1, showAtStartup: true }, 1.0);

/**
 * What the window shows
 */
const _state = {
	tipId: null,
	page: 0,
	searching: false,
	results: []
};

/**
 * @var {number|null} the twinkle timer
 */
let _twinkleTimer = null;

/**
 * @var {boolean} the window has already opened itself this session
 */
let _openedAtStartup = false;

/**
 * @var {number} counts opens, so a table that finishes loading after a
 * later open does not overwrite what that open showed
 */
let _openCount = 0;

/**
 * Escape text for HTML.
 *
 * @param {string} text
 * @return {string}
 */
function escapeHTML(text) {
	return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * A page of a tip as HTML: colour codes, line breaks, and its links to
 * other tips (TIPBOX), places (NAVI) and items (ITEM).
 *
 * The files ROenglishRE ships strip ^i[<item id>] icons for clients that
 * cannot draw them; any left are dropped here too.
 *
 * @param {string} text
 * @return {string}
 */
TipBox.formatPage = function formatPage(text) {
	let html = escapeHTML(String(text || '').replace(/\^i\[\d+\]/g, ''));
	html = html.replace(
		/&lt;(ITEMLINK|ITEM)&gt;([\s\S]*?)&lt;INFO&gt;(\d+)&lt;\/INFO&gt;&lt;\/\1&gt;/g,
		(match, tag, name, id) => `<span class="item-link" data-item-id="${id}">${DB.formatMsgToHtml(name)}</span>`
	);
	return DB.formatMsgToHtml(DB.formatDescriptionTags(html));
};

/**
 * Path of one of the window's own pictures (유저인터페이스/tipbox/).
 *
 * @param {string} name
 * @return {string}
 */
function uiPicture(name) {
	return DB.INTERFACE_PATH + 'tipbox/' + name;
}

/**
 * Path of a tip's picture. The file names it as kRO's client does, under
 * texture\ and without the extension.
 *
 * @param {string} image
 * @return {string}
 */
function tipPicture(image) {
	return 'data/texture/' + image.replace(/\\/g, '/') + '.bmp';
}

/**
 * Initialize component
 */
TipBox.init = function init() {
	const root = this.getRoot();

	root.querySelector('.close').addEventListener('click', () => this.remove());
	root.querySelector('.close-button').addEventListener('click', () => this.remove());

	root.querySelector('.prev').addEventListener('click', () => this.setPage(_state.page - 1));
	root.querySelector('.next').addEventListener('click', () => this.setPage(_state.page + 1));

	const input = root.querySelector('.search-text');
	input.placeholder = DB.getMessage(3253, 'Please enter a search term');
	input.addEventListener('keydown', event => {
		if (event.which === KEYS.ENTER || event.key === 'Enter') {
			this.search(input.value);
			event.preventDefault();
		}
		event.stopImmediatePropagation();
	});
	input.addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.search').addEventListener('click', () => this.search(input.value));

	root.querySelector('.results').addEventListener('click', event => {
		const row = event.target.closest('.result');
		if (row) {
			this.showTip(Number(row.dataset.tipId));
		}
	});

	root.querySelector('.startup').addEventListener('click', () => {
		_preferences.showAtStartup = !_preferences.showAtStartup;
		_preferences.save();
		this.updateStartup();
	});

	root.querySelector('.page').addEventListener('click', event => this.onLinkClick(event));
	root.querySelector('.page').addEventListener('mousedown', event => event.stopImmediatePropagation());

	this.draggable('.titlebar');
};

/**
 * Place the window: where it was left, else in the middle of the screen
 */
TipBox.onAppend = function onAppend() {
	const left = _preferences.x >= 0 ? _preferences.x : Math.floor((Renderer.width - WINDOW_WIDTH) / 2);
	const top = _preferences.y >= 0 ? _preferences.y : Math.floor((Renderer.height - WINDOW_HEIGHT) / 2);
	Object.assign(this._host.style, {
		top: `${Math.max(0, Math.min(top, Renderer.height - WINDOW_HEIGHT))}px`,
		left: `${Math.max(0, Math.min(left, Renderer.width - WINDOW_WIDTH))}px`
	});
	this.updateStartup();
};

/**
 * Remember where it was, stop the markers
 */
TipBox.onRemove = function onRemove() {
	stopTwinkle();
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * Close on Escape
 */
TipBox.onKeyDown = function onKeyDown(event) {
	if (event.which === KEYS.ESCAPE || event.key === 'Escape') {
		this.remove();
		event.preventDefault();
		event.stopImmediatePropagation();
	}
};

/**
 * Alt+D
 */
TipBox.onShortCut = function onShortCut(key) {
	if (key.cmd === 'TOGGLE') {
		this.toggle();
	}
};

/**
 * Open, or close when open.
 */
TipBox.toggle = function toggle() {
	if (this.__active) {
		this.remove();
		return;
	}
	this.open();
};

/**
 * Open the window on a tip: the one given, else one at random.
 *
 * @param {number} [tipId]
 * @return {Promise<void>}
 */
TipBox.open = function open(tipId) {
	const count = ++_openCount;
	if (!this.__active) {
		this.append();
	} else {
		this.focus();
	}

	return DB.loadTipBox().then(() => {
		if (count !== _openCount || !this.__active) {
			return;
		}
		const wanted = Number(tipId);
		const id = tipId !== undefined && tipId !== null && TipBoxTable.get(wanted) ? wanted : TipBoxTable.randomTip();
		this.showTip(id);
	});
};

/**
 * Open the window once, on the first map of a session, when "Open on
 * Startup" is on and there are tips to show.
 *
 * @return {Promise<void>}
 */
TipBox.openAtStartup = function openAtStartup() {
	if (_openedAtStartup || !_preferences.showAtStartup) {
		return Promise.resolve();
	}
	_openedAtStartup = true;
	return DB.loadTipBox().then(loaded => {
		if (loaded && !this.__active) {
			return this.open();
		}
		return undefined;
	});
};

/**
 * Show a tip, from its first page.
 *
 * @param {number|null} id
 */
TipBox.showTip = function showTip(id) {
	const root = this.getRoot();
	const tip = TipBoxTable.get(id);

	_state.tipId = tip ? tip.id : null;
	_state.page = 0;
	_state.searching = false;
	root.querySelector('.TipBox').classList.remove('searching');

	const lines = tip ? TipBoxTable.titleLines(tip.title) : [];
	root.querySelector('.title-line.first').textContent = lines[0] || '';
	root.querySelector('.title-line.second').textContent = lines[1] || '';
	root.querySelector('.page').classList.toggle('two-lines', lines.length > 1);

	this.showPicture(tip);
	this.showEffects(tip);
	this.setPage(0);
};

/**
 * Show a page of the current tip.
 *
 * @param {number} index
 */
TipBox.setPage = function setPage(index) {
	const root = this.getRoot();
	const tip = TipBoxTable.get(_state.tipId);
	const pages = tip ? tip.pages : [];

	if (_state.searching || index < 0 || (pages.length && index >= pages.length)) {
		return;
	}
	_state.page = index;

	const page = root.querySelector('.page');
	page.innerHTML = this.formatPage(pages[index] || '');
	page.scrollTop = 0;

	root.querySelector('.prev').classList.toggle('active', index > 0);
	root.querySelector('.next').classList.toggle('active', index < pages.length - 1);
};

/**
 * The picture: tipbox/img_noImage.bmp for a tip without one. Drawn as it is
 * when its place is 5 and its size 100, as every official tip's is;
 * otherwise scaled by its size and placed as on a keypad (5 the middle).
 *
 * @param {object|null} tip
 */
TipBox.showPicture = function showPicture(tip) {
	const box = this.getRoot().querySelector('.picture');
	box.textContent = '';

	const noImage = () => setPicture(box, uiPicture('img_noImage.bmp'));
	if (!tip || !tip.image) {
		noImage();
		return;
	}
	setPicture(box, tipPicture(tip.image), { position: tip.position, size: tip.size, onError: noImage });
};

/**
 * Put a picture into the picture's area.
 *
 * @param {HTMLElement} box
 * @param {string} path
 * @param {object} [options]
 */
function setPicture(box, path, { position = 5, size = 100, onError } = {}) {
	const img = document.createElement('img');
	img.style.left = '0px';
	img.style.top = '0px';
	box.appendChild(img);

	Client.loadFile(
		path,
		uri => {
			// Another tip may have been shown meanwhile
			if (!box.contains(img)) {
				return;
			}
			img.onload = () => placePicture(img, position, size);
			img.src = uri;
		},
		() => {
			img.remove();
			if (onError) {
				onError();
			}
		}
	);
}

/**
 * Size and place a loaded picture.
 *
 * @param {HTMLImageElement} img
 * @param {number} position - 1-9, as on a keypad
 * @param {number} size - percent
 */
function placePicture(img, position, size) {
	if (position === 5 && size === 100) {
		return;
	}
	const scale = (size > 0 ? size : 100) / 100;
	const width = Math.round(img.naturalWidth * scale);
	const height = Math.round(img.naturalHeight * scale);
	const p = position >= 1 && position <= 9 ? position : 5;
	const column = (p - 1) % 3; // 0 left, 1 middle, 2 right
	const row = 2 - Math.floor((p - 1) / 3); // keypad: 7 8 9 on top
	img.style.width = `${width}px`;
	img.style.height = `${height}px`;
	img.style.left = `${Math.round(((PICTURE.width - width) * column) / 2)}px`;
	img.style.top = `${Math.round(((PICTURE.height - height) * row) / 2)}px`;
}

/**
 * The markers over the picture (tipbox/ico_effect<n>.bmp), at window
 * coordinates; a twinkling one shows and hides every 300 ms.
 *
 * @param {object|null} tip
 */
TipBox.showEffects = function showEffects(tip) {
	const box = this.getRoot().querySelector('.effects');
	box.textContent = '';
	stopTwinkle();

	const effects = tip ? tip.effects : [];
	if (!effects.length) {
		return;
	}

	for (const effect of effects) {
		const img = document.createElement('img');
		img.style.left = `${effect.x}px`;
		img.style.top = `${effect.y}px`;
		if (effect.twinkle) {
			img.classList.add('twinkle');
		}
		box.appendChild(img);
		Client.loadFile(
			uiPicture(`ico_effect${effect.effect}.bmp`),
			uri => {
				img.src = uri;
			},
			() => img.remove()
		);
	}

	if (effects.some(effect => effect.twinkle)) {
		_twinkleTimer = setInterval(() => {
			box.querySelectorAll('img.twinkle').forEach(img => img.classList.toggle('off'));
		}, TWINKLE_PERIOD);
	}
};

/**
 * Stop the twinkle timer
 */
function stopTwinkle() {
	if (_twinkleTimer !== null) {
		clearInterval(_twinkleTimer);
		_twinkleTimer = null;
	}
}

/**
 * Search the tip titles. Empty text does nothing, as in the official window.
 *
 * @param {string} text
 * @return {Promise<void>}
 */
TipBox.search = function search(text) {
	if (!String(text || '').trim()) {
		return Promise.resolve();
	}
	return DB.loadTipBox().then(() => {
		if (!this.__active) {
			return;
		}
		const root = this.getRoot();
		const results = TipBoxTable.search(text);

		_state.searching = true;
		_state.results = results.map(tip => tip.id);
		root.querySelector('.TipBox').classList.add('searching');
		root.querySelector('.search-text').value = '';
		root.querySelector('.prev').classList.remove('active');
		root.querySelector('.next').classList.remove('active');

		const list = root.querySelector('.results');
		list.textContent = '';
		for (const tip of results) {
			const row = document.createElement('div');
			row.className = 'result';
			row.dataset.tipId = String(tip.id);
			row.textContent = TipBoxTable.titleLines(tip.title)[0] || '';
			list.appendChild(row);
		}
		list.scrollTop = 0;

		// Behind the list, the picture says whether anything was found.
		const box = root.querySelector('.picture');
		box.textContent = '';
		const picture = results.length ? 'img_loading.bmp' : 'img_NoSearchResults.bmp';
		setPicture(box, uiPicture(picture));
		this.getRoot().querySelector('.effects').textContent = '';
		stopTwinkle();
	});
};

/**
 * "Open on Startup" box
 */
TipBox.updateStartup = function updateStartup() {
	const box = this.getRoot().querySelector('.startup .checkbox');
	if (box) {
		box.classList.toggle('active', !!_preferences.showAtStartup);
	}
};

/**
 * A click on a link in a page: another tip, a place, or an item.
 *
 * @param {MouseEvent} event
 */
TipBox.onLinkClick = function onLinkClick(event) {
	const tipLink = event.target.closest('.tipbox-link');
	if (tipLink) {
		const id = Number(tipLink.dataset.tipboxId);
		if (TipBoxTable.get(id)) {
			this.showTip(id);
		}
		return;
	}

	const naviLink = event.target.closest('.navi-link');
	if (naviLink && naviLink.dataset.naviInfo) {
		const Navigation = UIManager.getComponent('Navigation');
		if (Navigation) {
			Navigation.show();
			Navigation.uid = naviLink.dataset.naviInfo;
			Navigation.setNaviInfo(naviLink.dataset.naviInfo, naviLink.dataset.naviName);
		}
		return;
	}

	const itemLink = event.target.closest('.item-link');
	if (itemLink) {
		const itemId = parseInt(itemLink.dataset.itemId, 10);
		const ItemInfo = UIManager.getComponent('ItemInfo');
		if (!itemId || !ItemInfo) {
			return;
		}
		ItemInfo.append();
		ItemInfo.uid = itemId;
		ItemInfo.setItem({ ITID: itemId, IsIdentified: true });
	}
};

/**
 * @return {object} what the window shows, for tests
 */
TipBox.getState = function getState() {
	return { ..._state, results: [..._state.results] };
};

/**
 * Create component and export it
 */
export default UIManager.addComponent(TipBox);
