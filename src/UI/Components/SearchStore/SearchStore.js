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
 * @var {Array} results shown, in order
 */
let _results = [];

SearchStore.init = function init() {
	const root = this.getRoot();

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => SearchStore.remove());
	root.querySelector('.search').addEventListener('click', search);
	root.querySelector('.next').addEventListener('click', () => SearchStore.onNextPage());

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
		const row = event.target.closest('tr');
		if (row) {
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
	this.getRoot().querySelector('.status').textContent = text;
};

SearchStore.clearResults = function clearResults() {
	_results = [];
	this.getRoot().querySelector('.list').innerHTML = '';
	this.getRoot().querySelector('.next').style.display = 'none';
};

/**
 * Show a page of results
 *
 * @param {Array} list - entries of ZC_SEARCH_STORE_INFO_ACK
 * @param {boolean} firstPage - replaces the results shown
 * @param {boolean} nextPage - more results can be asked for
 */
SearchStore.addResults = function addResults(list, firstPage, nextPage) {
	const root = this.getRoot();
	const tbody = root.querySelector('.list');

	if (firstPage) {
		this.clearResults();
	}

	for (const entry of list) {
		const index = _results.push(entry) - 1;
		const it = DB.getItemInfo(entry.ITID);
		const tr = document.createElement('tr');

		tr.setAttribute('data-index', index);
		tr.innerHTML =
			'<td class="col-item"><span class="icon"></span><span class="name"></span></td>' +
			'<td class="col-shop"></td><td class="col-qty"></td><td class="col-price"></td>';

		const name = DB.getItemName({ ...entry, IsIdentified: true });
		tr.querySelector('.name').textContent = name;
		tr.querySelector('.col-item').title = name;
		tr.querySelector('.col-shop').textContent = entry.StoreName;
		tr.querySelector('.col-shop').title = entry.StoreName;
		tr.querySelector('.col-qty').textContent = entry.count;
		tr.querySelector('.col-price').textContent = formatZeny(entry.price);
		tbody.appendChild(tr);

		Client.loadFile(`${DB.INTERFACE_PATH}item/${it.identifiedResourceName}.bmp`, data => {
			tr.querySelector('.icon').style.backgroundImage = `url(${data})`;
		});
	}

	root.querySelector('.next').style.display = nextPage ? '' : 'none';
};

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
 * item share a name), or else every item whose name contains the text
 *
 * @param {string} text
 * @param {function} [accept] - limits the candidates
 * @return {Array} item ids
 */
SearchStore.findItems = function findItems(text, accept = () => true) {
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

	return exact.length ? exact : partial;
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

	const items = SearchStore.findItems(itemName);
	if (!items.length) {
		SearchStore.setStatus(DB.getMessage(1810));
		return;
	}

	// Cards are named "... Card", or carry the prefix/suffix they give an item
	const cards = cardName.trim()
		? SearchStore.findItems(cardName, item => !!item.prefixName || /card$/i.test(item.identifiedDisplayName || ''))
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
		type: root.querySelector('.type-buy').checked ? SearchStore.TYPE.BUYING_STORE : SearchStore.TYPE.VENDING,
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
