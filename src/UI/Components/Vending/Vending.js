/**
 * UI/Components/Vending/Vending.js
 *
 * Vending / Buying store setup windows
 *
 * Follows the official client: the cart (or, for a buying store, the inventory) is mirrored
 * in its own window (UIMerchantMirrorItemWnd), and the shop is set up in one "Vend a Shop"
 * window (UIMerchantShopMakeWnd) with a price field, and for a buying store a count field,
 * on every slot row.
 *
 * @author Vincent Thibault
 */

import DB from 'DB/DBManager.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import ItemType from 'DB/Items/ItemType.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import Session from 'Engine/SessionStorage.js';
import Mouse from 'Controls/MouseEventHandler.js';
import KEYS from 'Controls/KeyEventHandler.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import ItemInfo from 'UI/Components/ItemInfo/ItemInfo.js';
import InputBox from 'UI/Components/InputBox/InputBox.js';
import CartItems from 'UI/Components/CartItems/CartItems.js';
import VendingModelMessage from 'UI/Components/Vending/VendingModelMessage/VendingModelMessage.js';
import {
	MAX_VENDING_PRICE,
	MAX_BUYING_PRICE,
	SAFE_CHECK_PRICE,
	transactionZeny,
	parsePrice,
	safeCheckAmount,
	stripColors
} from 'UI/Components/Vending/VendingRules.js';
import htmlText from './Vending.html?raw';
import cssText from './Vending.css?raw';
import Renderer from 'Renderer/Renderer.js';
import Inventory from 'UI/Components/Inventory/Inventory.js';
import BasicInfo from 'UI/Components/BasicInfo/BasicInfo.js';

const Vending = new GUIComponent('Vending', cssText);

Vending.render = () => htmlText;

Vending.isOpen = false;
Vending.Type = {
	VENDING_STORE: 0,
	BUYING_STORE: 1
};

/**
 * Slot rows the official window allows: 13 for vending, 5 for a buying store.
 */
const MAX_ROWS = [13, 5];

/**
 * @var {Preferences}
 */
const _preferences = Preferences.get(
	'Vending',
	{
		inputWindow: {
			x: 100,
			y: 100,
			height: 2
		},
		outputWindow: {
			x: 100 + 280 + 10,
			y: 100 + 7 * 32 - 2 * 32,
			height: 5
		},
		select_all: false,
		safe_check: true
	},
	1.0
);

/**
 * @var {Array} item list
 */
const _input = [];

/**
 * @var {Array} output list
 */
const _output = [];

/**
 * @var {Array<number>} item index shown on each slot row, in the order they were added
 */
const _rows = [];

let _slots = 0;

/**
 * @var {number} type (buy/sell)
 */
let _type;

function escapeHtml(text) {
	const div = document.createElement('div');
	div.appendChild(document.createTextNode(text));
	return div.innerHTML;
}

function isItemStackable(item) {
	return (
		item.type !== ItemType.WEAPON &&
		item.type !== ItemType.ARMOR &&
		item.type !== ItemType.SHADOWGEAR &&
		item.type !== ItemType.PETEGG &&
		item.type !== ItemType.PETARMOR
	);
}

/**
 * Show a message that has the item name in it
 */
function showMessage(text) {
	UIManager.showMessageBox(text, 'ok');
}

Vending.captureKeyEvents = true;

Vending.init = function init() {
	const root = Vending.getRoot();

	const sellBtn = root.querySelector('.btn.sell');
	if (sellBtn) {
		sellBtn.addEventListener('mousedown', e => e.stopImmediatePropagation());
		sellBtn.addEventListener('click', e => {
			e.stopImmediatePropagation();
			Vending.onSubmit();
		});
	}

	const cancelBtn = root.querySelector('.btn.cancel');
	if (cancelBtn) {
		cancelBtn.addEventListener('mousedown', e => e.stopImmediatePropagation());
		cancelBtn.addEventListener('click', e => {
			e.stopImmediatePropagation();
			let pkt;
			if (_type === Vending.Type.VENDING_STORE) {
				pkt = new PACKET.CZ.REQ_OPENSTORE2();
			} else {
				pkt = new PACKET.CZ.REQ_OPEN_BUYING_STORE();
			}
			submitNetworkPacket(pkt);
			Vending.onRemove();
		});
	}

	const extendBtn = root.querySelector('.InputWindow .footer .extend');
	if (extendBtn) {
		extendBtn.addEventListener('mousedown', onResizeInput);
	}

	const safeCheck = root.querySelector('.safecheck');
	if (safeCheck) {
		safeCheck.addEventListener('mousedown', e => {
			e.stopImmediatePropagation();
			_preferences.safe_check = !_preferences.safe_check;
			_preferences.save();
			updateSafeCheck();
		});
	}

	// The cart mirror
	const available = root.querySelector('.InputWindow .content');
	available.addEventListener('contextmenu', e => {
		const item = e.target.closest('.item');
		if (item) {
			onItemInfo(e, parseInt(item.getAttribute('data-index'), 10));
		}
	});
	available.addEventListener('wheel', e => {
		onScroll.call(available, e);
	});
	available.addEventListener('mouseover', e => {
		const item = e.target.closest('.item');
		if (item) {
			onItemOver.call(item);
		}
	});
	available.addEventListener('mouseout', e => {
		if (e.target.closest('.item')) {
			onItemOut();
		}
	});
	available.addEventListener('dblclick', e => {
		const item = e.target.closest('.item');
		if (item && _type === Vending.Type.BUYING_STORE) {
			requestMoveItem(parseInt(item.getAttribute('data-index'), 10), true);
		}
	});
	available.addEventListener('mousedown', e => {
		const item = e.target.closest('.item');
		if (item) {
			onItemFocus.call(item);
		}
	});

	// The shop's slot rows
	const rows = root.querySelector('.OutputWindow .rows');
	rows.addEventListener('contextmenu', e => {
		const row = e.target.closest('.row[data-index]');
		if (row && e.target.closest('.icon')) {
			onItemInfo(e, parseInt(row.getAttribute('data-index'), 10));
		}
	});
	rows.addEventListener('dblclick', e => {
		const row = e.target.closest('.row[data-index]');
		if (row && _type === Vending.Type.BUYING_STORE && !e.target.closest('input')) {
			requestMoveItem(parseInt(row.getAttribute('data-index'), 10), false);
		}
	});
	rows.addEventListener('input', e => {
		if (e.target.matches('input.price, input.count')) {
			onRowEdit(e.target);
		}
	});
	rows.addEventListener('change', e => {
		if (e.target.matches('input.price')) {
			onPriceCommit(e.target);
		}
	});

	[available, rows].forEach(content => {
		content.addEventListener('dragstart', e => {
			const el = e.target.closest('[data-index]');
			if (el) {
				onDragStart.call(el, e);
			}
		});
		content.addEventListener('dragend', () => {
			delete window._OBJ_DRAG_;
		});
	});

	// Drop items on InputWindow and OutputWindow
	const inputWin = root.querySelector('.InputWindow');
	const outputWin = root.querySelector('.OutputWindow');

	[inputWin, outputWin].forEach(win => {
		win.addEventListener('drop', e => {
			onDrop.call(win, e);
		});

		win.addEventListener('dragover', e => {
			e.stopImmediatePropagation();
			e.preventDefault();
		});

		win.addEventListener('mousedown', () => {
			Vending.focus();
		});
	});

	// Make sub-windows independently draggable
	this.draggable.call(
		{ _host: inputWin, _shadow: null, _container: inputWin, magnet: {}, needFocus: false, manager: null },
		inputWin.querySelector('.titlebar')
	);
	this.draggable.call(
		{ _host: outputWin, _shadow: null, _container: outputWin, magnet: {}, needFocus: false, manager: null },
		outputWin.querySelector('.titlebar')
	);

	Client.loadFile(`${DB.INTERFACE_PATH}basic_interface/itemwin_mid.bmp`, data => {
		Vending.itemBg = data;
	});

	updateSafeCheck();
};

Vending.onAppend = function onAppend() {
	const root = Vending.getRoot();
	const inputWin = root.querySelector('.InputWindow');
	const outputWin = root.querySelector('.OutputWindow');
	const inputContent = inputWin.querySelector('.content');

	inputWin.style.top = `${Math.min(Math.max(0, _preferences.inputWindow.y), Renderer.height - inputContent.offsetHeight)}px`;
	inputWin.style.left = `${Math.min(Math.max(0, _preferences.inputWindow.x), Renderer.width - inputContent.offsetWidth)}px`;

	outputWin.style.top = `${Math.min(Math.max(0, _preferences.outputWindow.y), Renderer.height - 289)}px`;
	outputWin.style.left = `${Math.min(Math.max(0, _preferences.outputWindow.x), Renderer.width - 400)}px`;

	resize(inputContent, _preferences.inputWindow.height);

	this._host.style.display = 'none';
};

Vending.setType = function setType(type) {
	const root = Vending.getRoot();

	const winBuyEls = root.querySelectorAll('.WinBuy');
	const winSellEls = root.querySelectorAll('.WinSell');
	const buying = type === Vending.Type.BUYING_STORE;

	winBuyEls.forEach(el => {
		el.style.display = buying ? '' : 'none';
	});
	winSellEls.forEach(el => {
		el.style.display = buying ? 'none' : '';
	});
	root.querySelector('.OutputWindow').classList.toggle('buying', buying);

	if (buying) {
		root.querySelector('.zenySpan').textContent = `${prettyZeny(Session.zeny)} Zeny`;
		const info = BasicInfo.getUI();
		const weight = root.querySelector('.weightSpan');
		weight.textContent = `Weight : ${info.weight} / ${info.weight_max}`;
		weight.classList.toggle('heavy', (info.weight * 100) / Math.max(1, info.weight_max) >= 50);
		root.querySelector('.limitZeny').value = '0';
	}

	_type = type;
};

function resize(content, height) {
	height = Math.min(Math.max(height, 2), 9);
	content.style.height = `${height * 32}px`;
}

Vending.onRemove = function onRemove() {
	VendingModelMessage.onRemove();

	const root = Vending.getRoot();
	const inputWin = root.querySelector('.InputWindow');
	const outputWin = root.querySelector('.OutputWindow');

	_input.length = 0;
	_output.length = 0;
	_rows.length = 0;

	_preferences.inputWindow.x = parseInt(inputWin.style.left, 10);
	_preferences.inputWindow.y = parseInt(inputWin.style.top, 10);
	_preferences.inputWindow.height = (inputWin.querySelector('.content').offsetHeight / 32) | 0;

	_preferences.outputWindow.x = parseInt(outputWin.style.left, 10);
	_preferences.outputWindow.y = parseInt(outputWin.style.top, 10);

	_preferences.save();

	root.querySelector('.InputWindow .content').innerHTML = '';
	root.querySelector('.OutputWindow .rows').innerHTML = '';

	this._host.style.display = 'none';

	Vending.isOpen = false;
};

Vending.onKeyDown = function onKeyDown(event) {
	if (this.isEditableFocused()) {
		if (event.which === KEYS.ESCAPE || event.key === 'Escape') {
			this.remove();
			event.stopImmediatePropagation();
			return false;
		}
		event.stopImmediatePropagation();
		return true;
	}

	if ((event.which === KEYS.ESCAPE || event.key === 'Escape') && this._host.style.display !== 'none') {
		this.remove();
	}

	return true;
};

Vending.setList = function setList(items) {
	const root = Vending.getRoot();

	root.querySelector('.InputWindow .content').innerHTML = '';

	_input.length = 0;
	_output.length = 0;
	_rows.length = 0;

	const content = root.querySelector('.InputWindow .content');

	for (let i = 0, count = items.length; i < count; ++i) {
		if (!('index' in items[i])) {
			items[i].index = i;
		}

		items[i].IsStackable = isItemStackable(items[i]);

		if (!Object.prototype.hasOwnProperty.call(items[i], 'count')) {
			items[i].count = 1;
		}

		items[i].total = items[i].count;

		const out = Object.assign({}, items[i]);
		out.count = 0;
		out.price = 0;

		addMirrorItem(content, items[i]);

		_input[items[i].index] = items[i];
		_output[items[i].index] = out;
	}

	renderRows();
};

function prettyZeny(val, useStyle) {
	const list = val.toString().split('');
	const count = list.length;
	let str = '';

	for (let i = 0; i < count; i++) {
		str = list[count - i - 1] + (i && i % 3 === 0 ? ',' : '') + str;
	}

	if (useStyle) {
		const style = [
			'color:#000000; text-shadow:1px 0px #00ffff;',
			'color:#0000ff; text-shadow:1px 0px #ce00ce;',
			'color:#0000ff; text-shadow:1px 0px #00ffff;',
			'color:#ff0000; text-shadow:1px 0px #ffff00;',
			'color:#ff18ff;',
			'color:#0000ff;',
			'color:#000000; text-shadow:1px 0px #00ff00;',
			'color:#ff0000;',
			'color:#000000; text-shadow:1px 0px #cece63;',
			'color:#ff0000; text-shadow:1px 0px #ff007b;'
		];
		str = `<span style="${style[Math.min(count, style.length) - 1]}">${str}</span>`;
	}

	return str;
}

function loadIcon(item, element) {
	const it = DB.getItemInfo(item.ITID);
	Client.loadFile(
		`${DB.INTERFACE_PATH}item/${item.IsIdentified ? it.identifiedResourceName : it.unidentifiedResourceName}.bmp`,
		data => {
			element.style.backgroundImage = `url(${data})`;
		}
	);
}

/**
 * Add or update an item in the cart mirror
 */
function addMirrorItem(content, item) {
	const element = content.querySelector(`.item[data-index="${item.index}"]`);

	if (item.count === 0) {
		if (element) {
			element.remove();
		}
		return;
	}

	if (element) {
		element.querySelector('.amount').textContent = item.IsStackable ? item.count : '';
		return;
	}

	const itemObj = document.createElement('div');
	itemObj.className = 'item input';
	itemObj.draggable = true;
	itemObj.dataset.index = item.index;
	itemObj.innerHTML = '<div class="icon"></div>' + `<div class="amount">${item.IsStackable ? item.count : ''}</div>`;

	if (item.IsDamaged) {
		itemObj.style.backgroundImage = `url("${Vending.itemBg}")`;
		itemObj.classList.add('damaged');
	}

	content.appendChild(itemObj);
	loadIcon(item, itemObj.querySelector('.icon'));
}

/**
 * Draw the slot rows of the shop window: one per slot, the filled ones first
 */
function renderRows() {
	const root = Vending.getRoot();
	const rows = root.querySelector('.OutputWindow .rows');
	const buying = _type === Vending.Type.BUYING_STORE;
	const total = Math.max(_rows.length, Math.min(_slots, MAX_ROWS[buying ? 1 : 0]));

	rows.innerHTML = '';

	for (let i = 0; i < total; ++i) {
		const row = document.createElement('div');
		row.className = 'row';

		const item = i < _rows.length ? _output[_rows[i]] : null;
		const disabled = item ? '' : ' disabled';

		let html = '';
		if (item) {
			row.dataset.index = item.index;
			const amount = !buying && item.IsStackable ? item.count : '';
			html +=
				'<div class="icon"></div>' +
				`<div class="amount">${amount}</div>` +
				`<div class="name">${escapeHtml(DB.getItemName(item))}</div>`;
		}

		if (buying) {
			html +=
				`<input class="count" type="text" maxlength="5"${disabled} />` +
				`<div class="label ea">${escapeHtml(DB.getMessage(588))}</div>` +
				`<div class="label price">${escapeHtml(DB.getMessage(1721))}</div>`;
		} else {
			html += `<div class="label price">${escapeHtml(DB.getMessage(369))}</div>`;
		}
		html += `<input class="price" type="text" maxlength="14"${disabled} />` + '<div class="transaction"></div>';

		row.innerHTML = html;

		if (item) {
			row.querySelector('input.price').value = item.priceText || '';
			if (buying) {
				row.querySelector('input.count').value = item.countText || '';
			}
			if (item.IsDamaged) {
				row.querySelector('.icon').classList.add('damaged');
			}
			row.querySelector('.icon').draggable = true;
			loadIcon(item, row.querySelector('.icon'));
			updateTransaction(row, item);
		}

		rows.appendChild(row);
	}

	updateLimit();
}

/**
 * "Transaction : <zeny>" under the price, once a price is set
 */
function updateTransaction(row, item) {
	const el = row.querySelector('.transaction');
	const price = parsePrice(item.priceText || '');

	if (!price) {
		el.innerHTML = '';
		return;
	}

	const zeny = transactionZeny(price, _type === Vending.Type.BUYING_STORE);
	el.innerHTML = `${escapeHtml(DB.getMessage(3222))}${prettyZeny(zeny, true)}`;
}

/**
 * A buying store's purchase limit follows what its rows add up to
 */
function updateLimit() {
	if (_type !== Vending.Type.BUYING_STORE) {
		return;
	}

	let sum = 0;
	_rows.forEach(index => {
		const item = _output[index];
		sum += (parsePrice(item.priceText || '') || 0) * (parsePrice(item.countText || '') || 0);
	});

	const root = Vending.getRoot();
	root.querySelector('.limitZeny').value = String(sum);
}

function onRowEdit(input) {
	const row = input.closest('.row');
	const item = _output[parseInt(row.getAttribute('data-index'), 10)];
	if (!item) {
		return;
	}

	if (input.classList.contains('count')) {
		item.countText = input.value;
	} else {
		item.priceText = input.value;
		updateTransaction(row, item);
	}

	updateLimit();
}

/**
 * Check a vending price once it has been typed, as the official window does when the field loses focus
 */
function onPriceCommit(input) {
	const row = input.closest('.row');
	const item = _output[parseInt(row.getAttribute('data-index'), 10)];
	if (!item) {
		return;
	}

	const setPrice = text => {
		input.value = text;
		item.priceText = text;
		updateTransaction(row, item);
		updateLimit();
	};

	const price = parsePrice(input.value);

	if (price === null) {
		VendingModelMessage.setInit(602);
		setPrice('');
		return;
	}

	if (_type !== Vending.Type.VENDING_STORE) {
		return;
	}

	const confirmSafeCheck = value => {
		if (!_preferences.safe_check || value < SAFE_CHECK_PRICE) {
			return;
		}
		const text = [
			DB.getMessage(2473).replace('%s', DB.getItemName(item)),
			safeCheckAmount(value, id => DB.getMessage(id)),
			stripColors(DB.getMessage(2478)).replace('\\n', '\n')
		].join('\n');
		UIManager.showPromptBox(text, 'ok', 'cancel', null, () => setPrice(''));
	};

	if (price > MAX_VENDING_PRICE) {
		UIManager.showPromptBox(
			DB.getMessage(2467),
			'ok',
			'cancel',
			() => {
				setPrice(String(MAX_VENDING_PRICE));
				confirmSafeCheck(MAX_VENDING_PRICE);
			},
			() => setPrice('')
		);
		return;
	}

	confirmSafeCheck(price);
}

function updateSafeCheck() {
	const root = Vending.getRoot();
	const checkbox = root.querySelector('.safecheck .checkbox');
	if (!checkbox) {
		return;
	}
	Client.loadFile(`${DB.INTERFACE_PATH}checkbox_${_preferences.safe_check ? 1 : 0}.bmp`, data => {
		checkbox.style.backgroundImage = `url(${data})`;
	});
}

/**
 * Place an item on a slot row, or take it off again
 */
function transferItem(isAdding, index, count) {
	const root = Vending.getRoot();
	const mirror = root.querySelector('.InputWindow .content');
	const buying = _type === Vending.Type.BUYING_STORE;
	const output = _output[index];
	const input = _input[index];

	if (isAdding) {
		if (!_rows.includes(index)) {
			_rows.push(index);
		}
		if (!buying) {
			output.count = Math.min(output.count + count, input.total);
			input.count = input.total - output.count;
			addMirrorItem(mirror, input);
		}
	} else {
		if (!buying) {
			output.count -= Math.min(count, output.count);
			input.count = input.total - output.count;
			addMirrorItem(mirror, input);
		}
		if (buying || output.count === 0) {
			output.count = 0;
			output.priceText = '';
			output.countText = '';
			_rows.splice(_rows.indexOf(index), 1);
		}
	}

	renderRows();
}

function requestMoveItem(index, isAdding) {
	const buying = _type === Vending.Type.BUYING_STORE;
	const item = isAdding ? _input[index] : _output[index];

	if (!item) {
		return;
	}

	if (isAdding && !_rows.includes(index) && !(_rows.length < Math.min(_slots, MAX_ROWS[buying ? 1 : 0]))) {
		return;
	}

	// A buying store sets its count on the row itself
	if (buying) {
		if (isAdding !== _rows.includes(index)) {
			transferItem(isAdding, index, 0);
		}
		return;
	}

	if (!item.count) {
		return;
	}

	if (item.count === 1 || !item.IsStackable) {
		transferItem(isAdding, index, item.count);
		return;
	}

	InputBox.append();
	InputBox.setType('number', false, item.count);
	InputBox.onSubmitRequest = function (count) {
		InputBox.remove();
		if (count > 0) {
			transferItem(isAdding, index, count);
		}
	};
}

function onDrop(event) {
	let data;

	event.stopImmediatePropagation();
	event.preventDefault();

	try {
		data = JSON.parse(event.dataTransfer.getData('Text'));
	} catch (_e) {
		return;
	}

	const target = this.classList.contains('OutputWindow') ? 'OutputWindow' : 'InputWindow';

	if (data.type !== 'item' || data.from !== 'Vending' || data.container === target) {
		return;
	}

	requestMoveItem(parseInt(data.index, 10), target === 'OutputWindow');
}

function onItemInfo(event, index) {
	event.stopImmediatePropagation();
	event.preventDefault();

	const item = _input[index];

	if (!item) {
		return;
	}

	if (ItemInfo.uid === item.ITID) {
		ItemInfo.remove();
		return;
	}

	ItemInfo.append();
	ItemInfo.uid = item.ITID;
	ItemInfo.setItem(item);
}

function onItemFocus() {
	const root = Vending.getRoot();
	root.querySelectorAll('.item.selected').forEach(el => el.classList.remove('selected'));
	this.classList.add('selected');
}

function onScroll(event) {
	let delta;

	if (event.wheelDelta) {
		delta = event.wheelDelta / 120;
		if (window.opera) {
			delta = -delta;
		}
	} else if (event.detail) {
		delta = -event.detail;
	}

	this.scrollTop = Math.floor(this.scrollTop / 32) * 32 - delta * 32;
	event.preventDefault();
}

function onDragStart(event) {
	const root = Vending.getRoot();
	const inputWin = root.querySelector('.InputWindow');
	const container = inputWin.contains(this) ? 'InputWindow' : 'OutputWindow';
	const icon = this.querySelector('.icon');
	const match = icon && icon.style.backgroundImage.match(/\(([^)]+)/);

	if (match) {
		const img = new Image();
		img.decoding = 'async';
		img.src = match[1].replace(/"/g, '');
		event.dataTransfer.setDragImage(img, 12, 12);
	}

	event.dataTransfer.setData(
		'Text',
		JSON.stringify(
			(window._OBJ_DRAG_ = {
				type: 'item',
				from: 'Vending',
				container: container,
				index: this.getAttribute('data-index')
			})
		)
	);
}

function onResizeInput() {
	const root = Vending.getRoot();
	const inputWin = root.querySelector('.InputWindow');
	const content = inputWin.querySelector('.container .content');
	const top = inputWin.offsetTop;
	let lastHeight = 0;

	function resizing() {
		const extraY = 31 + 19 - 30;

		let h = Math.floor((Mouse.screen.y - top - extraY) / 32);

		h = Math.min(Math.max(h, 2), 6);

		if (h === lastHeight) {
			return;
		}

		resize(content, h);
		lastHeight = h;
	}

	const _Interval = setInterval(resizing, 30);

	const onMouseUp = event => {
		if (event.which === 1) {
			clearInterval(_Interval);
			window.removeEventListener('mouseup', onMouseUp);
		}
	};
	window.addEventListener('mouseup', onMouseUp);
}

function openWindow(items) {
	const root = Vending.getRoot();
	Vending.setList(items);

	root.querySelector('.shopname').value = '';
	Vending._host.style.display = '';
	placeLimitInput();
	Vending._fixPositionOverflow();

	Vending.isOpen = true;
}

/**
 * The purchase limit field sits just after its label
 */
function placeLimitInput() {
	const root = Vending.getRoot();
	const label = root.querySelector('.OutputWindow .limit');
	const input = root.querySelector('.limitZeny');
	const unit = root.querySelector('.limitUnit');

	if (_type !== Vending.Type.BUYING_STORE || !label.offsetWidth) {
		return;
	}

	input.style.left = `${label.offsetLeft + label.offsetWidth + 5}px`;
	unit.style.left = `${input.offsetLeft + input.offsetWidth + 5}px`;
}

Vending.onVendingSkill = function onVendingSkill(pkt) {
	if (Vending.isOpen) {
		return;
	}

	_slots = pkt.itemcount;
	openWindow(CartItems.list);
};

Vending.onBuyingSkill = function onBuyingSkill(pkt) {
	if (Vending.isOpen) {
		return;
	}

	_slots = pkt.itemcount;
	const buyable = [];
	for (const key in Inventory.getUI().list) {
		const item = Inventory.getUI().list[key];
		if (isItemStackable(item) && DB.isBuyable(item.ITID)) {
			buyable.push(item);
		}
	}
	openWindow(buyable);
};

Vending.onClose = function onClose() {
	this._host.style.display = 'none';
	Vending.isOpen = false;
};

/**
 * Check every row of a vending shop. Returns false when a row is wrong (a message is shown).
 */
function checkVendingRows(flags) {
	for (const index of _rows) {
		const item = _output[index];
		const price = parsePrice(item.priceText || '');

		if (price === null) {
			VendingModelMessage.setInit(602);
			return false;
		}

		if (!item.IsIdentified) {
			VendingModelMessage.setInit(603);
			return false;
		}

		item.price = Math.min(price, MAX_VENDING_PRICE);

		if (price === 0) {
			flags.zero = true;
		}
		if (price > MAX_VENDING_PRICE && !_preferences.safe_check) {
			flags.over = true;
		}
	}
	return true;
}

/**
 * Check every row of a buying store. Returns false when a row is wrong (a message is shown).
 */
function checkBuyingRows() {
	for (const index of _rows) {
		const item = _output[index];
		const name = DB.getItemName(item);
		const price = parsePrice(item.priceText || '');
		const count = parsePrice(item.countText || '');

		if (price === null || count === null) {
			VendingModelMessage.setInit(602);
			return false;
		}

		if (price === 0) {
			showMessage(DB.getMessage(1725).replace('%s', name));
			return false;
		}

		if (price > MAX_BUYING_PRICE) {
			showMessage(DB.getMessage(1726).replace('%s', name));
			return false;
		}

		if (count === 0) {
			showMessage(DB.getMessage(1727).replace('%s', name));
			return false;
		}

		if (count + _input[index].total > 9999) {
			VendingModelMessage.setInit(1728);
			return false;
		}

		item.price = price;
		item.count = count;
	}
	return true;
}

Vending.onSubmit = function onSubmit() {
	const root = Vending.getRoot();
	const shopname = root.querySelector('.shopname').value;
	const buying = _type === Vending.Type.BUYING_STORE;

	if (!_rows.length) {
		VendingModelMessage.setInit(buying ? 1724 : 2494);
		return;
	}

	const send = () => {
		let pkt;

		if (!shopname) {
			VendingModelMessage.setInit(225);
			return;
		}

		if (buying) {
			const limitZeny = parsePrice(root.querySelector('.limitZeny').value) || 0;
			if (limitZeny > Session.zeny || limitZeny >= 0x80000000) {
				VendingModelMessage.setInit(3683);
				return;
			}
			if (limitZeny <= 0) {
				VendingModelMessage.setInit(1730);
				return;
			}
			pkt = new PACKET.CZ.REQ_OPEN_BUYING_STORE();
			pkt.LimitZeny = limitZeny;
		} else {
			pkt = new PACKET.CZ.REQ_OPENSTORE2();
		}

		pkt.storeName = shopname;
		pkt.result = 1;
		pkt.storeList = _rows.map(index => _output[index]);

		Vending._shopname = shopname;
		submitNetworkPacket(pkt);
		Vending.onRemove();
	};

	if (buying) {
		if (checkBuyingRows()) {
			send();
		}
		return;
	}

	const flags = { zero: false, over: false };
	if (!checkVendingRows(flags)) {
		return;
	}

	const askOver = () => {
		if (flags.over) {
			UIManager.showPromptBox(DB.getMessage(2467), 'ok', 'cancel', send, null);
		} else {
			send();
		}
	};

	if (flags.zero) {
		UIManager.showPromptBox(DB.getMessage(604), 'ok', 'cancel', askOver, null);
	} else {
		askOver();
	}
};

function submitNetworkPacket(pkt) {
	Network.sendPacket(pkt);
}

function onItemOver() {
	const idx = parseInt(this.getAttribute('data-index'), 10);
	const item =
		_type === Vending.Type.VENDING_STORE ? CartItems.getItemByIndex(idx) : Inventory.getUI().getItemByIndex(idx);

	if (!item) {
		return;
	}

	const root = Vending.getRoot();
	const overlay = root.querySelector('.overlay');

	overlay.style.display = '';
	overlay.style.top = `${this.offsetTop - 20}px`;
	overlay.style.left = `${this.offsetLeft - 10}px`;
	overlay.textContent = `${DB.getItemName(item)} ${item.count || 1} ea`;
}

function onItemOut() {
	const root = Vending.getRoot();
	const overlay = root.querySelector('.overlay');
	if (overlay) {
		overlay.style.display = 'none';
	}
}

Vending.mouseMode = GUIComponent.MouseMode.STOP;

export default UIManager.addComponent(Vending);
