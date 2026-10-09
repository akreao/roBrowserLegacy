/**
 * UI/Components/SearchStore/SearchStore.js
 *
 * Store search (catalog): find vending and buying stores selling or buying an item
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import ItemTable from 'DB/Items/ItemTable.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import htmlText from './SearchStore.html?raw';
import cssText from './SearchStore.css?raw';

const SearchStore = new GUIComponent('SearchStore', cssText);

SearchStore.render = () => htmlText;

/**
 * Search types, as the server expects them
 */
SearchStore.TYPE = {
	VENDING: 0,
	BUYING_STORE: 1
};

/**
 * Most item ids a single search sends: a name that matches more is too vague
 */
const MAX_SEARCH_IDS = 30;

/**
 * Highest price the server accepts (rAthena's default vending_max_value)
 */
const MAX_PRICE = 1000000000;

const _preferences = Preferences.get('SearchStore', { x: 120, y: 120 }, 1.0);

/**
 * Results per page, as the official window shows them
 */
const PAGE_SIZE = 10;

/**
 * @var {Array} results received, in order
 */
let _results = [];

/**
 * @var {number} page shown, from 0
 */
let _page = 0;

/**
 * @var {boolean} the server has more results to send
 */
let _hasMore = false;

/**
 * @var {boolean} a page was asked for and is to be shown when it arrives
 */
let _waitingPage = false;

/**
 * @var {number} store type searched, SearchStore.TYPE
 */
let _type = 0;

/**
 * @var {boolean} names that only contain the text are searched too
 */
let _similar = false;

SearchStore.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => SearchStore.remove());
	root.querySelector('.search').addEventListener('click', search);
	root.querySelector('.prev').addEventListener('click', () => showPage(_page - 1));
	root.querySelector('.next').addEventListener('click', showNextPage);

	root.querySelectorAll('.radio').forEach(radio => {
		radio.addEventListener('click', () => setType(parseInt(radio.getAttribute('data-value'), 10)));
	});
	root.querySelector('.similar').addEventListener('click', () => setSimilar(!_similar));

	root.querySelectorAll('input[type="text"]').forEach(input => {
		input.addEventListener('keydown', event => {
			if (event.key === 'Enter') {
				search();
			}
			event.stopPropagation();
		});
	});

	root.querySelector('.item-name').placeholder = DB.getMessage(1809);
	root.querySelector('.card-name').placeholder = DB.getMessage(1801);

	root.querySelector('.list').addEventListener('click', event => {
		const row = event.target.closest('.row');
		if (row) {
			root.querySelectorAll('.row.selected').forEach(other => other.classList.remove('selected'));
			row.classList.add('selected');
			SearchStore.onSelectItem(_results[parseInt(row.getAttribute('data-index'), 10)]);
		}
	});

	this.draggable('.titlebar');
};

SearchStore.onAppend = function onAppend() {
	this._host.style.top = _preferences.y + 'px';
	this._host.style.left = _preferences.x + 'px';
	this.getRoot().querySelector('.item-name').focus();
};

SearchStore.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();

	SearchStore.onClose();
};

/**
 * Open the window, cleared
 *
 * @param {number} uses - searches left
 */
SearchStore.open = function open(uses) {
	this.append();
	this.clearResults();
	this.setUses(uses);
	this.setStatus('');
	setType(_type);
	setSimilar(_similar);
};

/**
 * @param {number} uses - searches left
 */
SearchStore.setUses = function setUses(uses) {
	this.getRoot().querySelector('.uses').textContent = DB.getMessage(1802).replace('%d', uses);
};

/**
 * @param {string} text - message under the search fields
 */
SearchStore.setStatus = function setStatus(text) {
	// A failure answers the page asked for, if any
	if (text) {
		_waitingPage = false;
	}
	this.getRoot().querySelector('.status').textContent = text;
};

SearchStore.clearResults = function clearResults() {
	_results = [];
	_hasMore = false;
	_waitingPage = false;
	showPage(0);
};

/**
 * Add a page of results from the server
 *
 * @param {Array} list - entries of ZC_SEARCH_STORE_INFO_ACK
 * @param {boolean} firstPage - replaces the results shown
 * @param {boolean} nextPage - more results can be asked for
 */
SearchStore.addResults = function addResults(list, firstPage, nextPage) {
	if (firstPage) {
		_results = [];
	}

	_results.push(...list);
	_hasMore = !!nextPage;

	if (firstPage) {
		showPage(0);
	} else if (_waitingPage) {
		showPage(_page + 1);
	} else {
		showPage(_page);
	}
	_waitingPage = false;
};

/**
 * Draw one page of the results, with the page buttons that apply
 *
 * @param {number} page - from 0
 */
function showPage(page) {
	const root = SearchStore.getRoot();
	const list = root.querySelector('.list');
	const pages = Math.max(1, Math.ceil(_results.length / PAGE_SIZE));

	_page = Math.max(0, Math.min(page, pages - 1));
	list.innerHTML = '';

	_results.slice(_page * PAGE_SIZE, (_page + 1) * PAGE_SIZE).forEach((entry, i) => {
		const it = DB.getItemInfo(entry.ITID);
		const row = document.createElement('div');
		const name = DB.getItemName({ ...entry, IsIdentified: true });

		row.className = 'row';
		row.setAttribute('data-index', _page * PAGE_SIZE + i);
		row.innerHTML =
			'<span class="col-icon"></span><span class="col-shop"></span>' +
			'<span class="col-item"></span><span class="col-qty"></span><span class="col-price"></span>';

		row.querySelector('.col-shop').textContent = entry.StoreName;
		row.querySelector('.col-shop').title = entry.StoreName;
		row.querySelector('.col-item').textContent = name;
		row.querySelector('.col-item').title = name;
		row.querySelector('.col-qty').textContent = entry.count;
		row.querySelector('.col-price').textContent = formatZeny(entry.price);
		list.appendChild(row);

		Client.loadFile(`${DB.INTERFACE_PATH}item/${it.identifiedResourceName}.bmp`, data => {
			row.querySelector('.col-icon').style.backgroundImage = `url(${data})`;
		});
	});

	root.querySelector('.page').textContent = _results.length ? String(_page + 1) : '';
	root.querySelector('.prev').classList.toggle('disabled', _page === 0);
	root.querySelector('.next').classList.toggle('disabled', _page >= pages - 1 && !_hasMore);
}

/**
 * Show the next page, asking the server for it when it has not been received
 */
function showNextPage() {
	if ((_page + 1) * PAGE_SIZE < _results.length) {
		showPage(_page + 1);
	} else if (_hasMore && !_waitingPage) {
		_waitingPage = true;
		SearchStore.onNextPage();
	}
}

/**
 * @param {number} type - SearchStore.TYPE
 */
function setType(type) {
	const root = SearchStore.getRoot();

	_type = type;
	root.querySelectorAll('.radio').forEach(radio => {
		const on = parseInt(radio.getAttribute('data-value'), 10) === type;
		radio.querySelector('ui-image').setAttribute('src', on ? 'radiobtn_on.bmp' : 'radiobtn_off.bmp');
	});
}

/**
 * @param {boolean} on - also search names that only contain the text
 */
function setSimilar(on) {
	_similar = on;
	SearchStore.getRoot()
		.querySelector('.similar ui-image')
		.setAttribute('src', on ? 'checkbox_1.bmp' : 'checkbox_0.bmp');
}

/**
 * @param {number} zeny
 * @return {string} with thousands separators
 */
function formatZeny(zeny) {
	return String(zeny || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * @param {string} value - text in a price field
 * @return {number} zeny, 0 for none
 */
function parsePrice(value) {
	const price = parseInt(value.replace(/[^0-9]/g, ''), 10);
	return Number.isFinite(price) ? Math.min(price, MAX_PRICE) : 0;
}

/**
 * Item ids whose name matches: every exact match (all slot variants of an
 * item share a name), and with similar items, every item whose name contains
 * the text. Without them, a text that names no item exactly still finds the
 * items containing it.
 *
 * @param {string} text
 * @param {function} [accept] - limits the candidates
 * @param {boolean} [similar] - add the items whose name contains the text
 * @return {Array} item ids
 */
SearchStore.findItems = function findItems(text, accept = () => true, similar = false) {
	const query = text.trim().toLowerCase();
	const exact = [];
	const partial = [];

	if (!query) {
		return exact;
	}

	for (const id in ItemTable) {
		const item = ItemTable[id];
		const names = [item.identifiedDisplayName, item.prefixName].filter(Boolean).map(name => name.toLowerCase());

		if (!names.length || !accept(item)) {
			continue;
		}
		if (names.includes(query)) {
			exact.push(parseInt(id, 10));
		} else if (names.some(name => name.includes(query))) {
			partial.push(parseInt(id, 10));
		}
	}

	return exact.length && !similar ? exact : exact.concat(partial);
};

/**
 * Read the fields and ask the server
 */
function search() {
	const root = SearchStore.getRoot();
	const itemName = root.querySelector('.item-name').value;
	const cardName = root.querySelector('.card-name').value;

	if (!itemName.trim()) {
		SearchStore.setStatus(DB.getMessage(1809));
		return;
	}

	const items = SearchStore.findItems(itemName, undefined, _similar);
	if (!items.length) {
		SearchStore.setStatus(DB.getMessage(1810));
		return;
	}

	// Cards are named "... Card", or carry the prefix/suffix they give an item
	const cards = cardName.trim()
		? SearchStore.findItems(
				cardName,
				item => !!item.prefixName || /card$/i.test(item.identifiedDisplayName || ''),
				_similar
			)
		: [];
	if (cardName.trim() && !cards.length) {
		SearchStore.setStatus(DB.getMessage(1812));
		return;
	}

	if (items.length > MAX_SEARCH_IDS || cards.length > MAX_SEARCH_IDS) {
		SearchStore.setStatus(DB.getMessage(1784));
		return;
	}

	let minPrice = parsePrice(root.querySelector('.min-price').value);
	let maxPrice = parsePrice(root.querySelector('.max-price').value);

	// The server swaps the bounds when max < min, so "from" alone needs a top
	if (minPrice && !maxPrice) {
		maxPrice = MAX_PRICE;
	}
	if (maxPrice && minPrice > maxPrice) {
		[minPrice, maxPrice] = [maxPrice, minPrice];
	}

	SearchStore.setStatus('');
	SearchStore.onSearch({
		type: _type === SearchStore.TYPE.BUYING_STORE ? SearchStore.TYPE.BUYING_STORE : SearchStore.TYPE.VENDING,
		minPrice,
		maxPrice,
		items,
		cards
	});
}

/**
 * Callbacks, set by the engine
 */
SearchStore.onSearch = function onSearch(/* params */) {};
SearchStore.onNextPage = function onNextPage() {};
SearchStore.onSelectItem = function onSelectItem(/* entry */) {};
SearchStore.onClose = function onClose() {};

export default UIManager.addComponent(SearchStore);
