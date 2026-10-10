/**
 * UI/Components/Roulette/RouletteOfficial.js
 *
 * Lucky Roulette window, laid out like the official UIRoulletteWnd
 * (kRO RagexeRE 2020-12-29): roulletteBG.bmp under a standard title bar,
 * the prizes on a stepped board, the three coin counters, the stage arrow
 * and the Start / GetWinPrize bitmap buttons. Coordinates live in
 * RouletteLayout.js.
 *
 * Used instead of roBrowser's own Roulette window when the `officialLayout`
 * config selects it (see UI/OfficialLayout.js).
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import Renderer from 'Renderer/Renderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import ItemInfo from 'UI/Components/ItemInfo/ItemInfo.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import * as Layout from './RouletteLayout.js';
import { useOfficialLayout } from 'UI/OfficialLayout.js';
import htmlText from './RouletteOfficial.html?raw';
import cssText from './RouletteOfficial.css?raw';

/**
 * Create Component
 */
const Roulette = new GUIComponent('RouletteOfficial', cssText);

/**
 * Render HTML
 */
Roulette.render = () => htmlText;

/**
 * @var {Preferences} window position; null places it in the middle of the screen
 */
const _preferences = Preferences.get(
	'RouletteOfficial',
	{
		x: null,
		y: null
	},
	2.0
);

/**
 * @var {object} Roulette state, mirrors the official client's roulette manager
 */
const _state = {
	serial: 0,
	step: 0, // current row
	idx: 0, // prize column in the current row
	hasPrize: false, // a prize is waiting to be claimed
	losing: false, // the prize is a blank (GENERATE_ROULETTE_LOSING)
	spinning: false,
	canStart: true,
	gold: 0,
	silver: 0,
	bronze: 0,
	additionItemID: 0,
	items: [] // { row, position, itemId, count }
};

/**
 * @var {boolean} Open the window once the item list arrives
 */
let _openWhenListed = false;

/**
 * @var {number|null} pending spin step
 */
let _spinTimer = null;

/**
 * @var {number|null} highlighted column of the current row, null for none
 */
let _highlightCol = null;

/**
 * @var {boolean} cursor over Start
 */
let _startHover = false;

/**
 * @var {boolean} the window was shown when the component was last removed
 */
let _wasOpen = false;

/**
 * Initialize UI
 */
Roulette.init = function init() {
	const root = this.getRoot();

	root.querySelector('.titlebar .close').addEventListener('click', onClickClose);
	root.querySelector('.btn-start').addEventListener('click', onClickStart);
	root.querySelector('.btn-prize').addEventListener('click', onClickPrize);

	const start = root.querySelector('.btn-start');
	start.addEventListener('mouseenter', () => {
		_startHover = true;
		showTooltip(DB.getMessage(2684), Layout.START_BUTTON.x, Layout.START_BUTTON.y - 20);
		updateArrows();
	});
	start.addEventListener('mouseleave', () => {
		_startHover = false;
		hideTooltip();
		updateArrows();
	});

	const prize = root.querySelector('.btn-prize');
	prize.addEventListener('mouseenter', () => {
		showTooltip(DB.getMessage(2683), Layout.PRIZE_BUTTON.x, Layout.PRIZE_BUTTON.y - 20);
	});
	prize.addEventListener('mouseleave', hideTooltip);

	bindSlot(root.querySelector('.slot.prize'), getPrizeItem, Layout.PRIZE_SLOT.x - 3, Layout.PRIZE_SLOT.y - 15);
	bindSlot(root.querySelector('.slot.bonus'), getBonusItem, Layout.BONUS_SLOT.x - 3, Layout.BONUS_SLOT.y - 14);

	sizeToBitmap(start, 'basic_interface/roullette/StartRoullette_a.bmp');
	sizeToBitmap(prize, 'basic_interface/roullette/GetWinPrize_a.bmp');
	root.querySelectorAll('.arrow').forEach(arrow => {
		sizeToBitmap(arrow, 'basic_interface/roullette/stageArrow.bmp', true);
	});

	this.draggable('.titlebar');
};

/**
 * Load a bitmap and give the element its size, like UIBitmapButton does.
 *
 * @param {HTMLElement} element
 * @param {string} path - under DB.INTERFACE_PATH
 * @param {boolean} [asBackground] - also set it as the background
 */
function sizeToBitmap(element, path, asBackground) {
	Client.loadFile(DB.INTERFACE_PATH + path, function (data) {
		if (typeof data !== 'string') {
			return;
		}
		if (asBackground) {
			element.style.backgroundImage = `url(${data})`;
		}
		const img = new Image();
		img.onload = function () {
			element.style.width = img.width + 'px';
			element.style.height = img.height + 'px';
		};
		img.src = data;
	});
}

/**
 * Item name on hover, item description on right click.
 *
 * @param {HTMLElement} element
 * @param {function} getItem - returns the item shown in the element, or null
 * @param {number} tipX
 * @param {number} tipY
 */
function bindSlot(element, getItem, tipX, tipY) {
	element.addEventListener('mouseenter', () => {
		const item = getItem();
		if (item) {
			showTooltip(getItemName(item.itemId), tipX, tipY);
		}
	});
	element.addEventListener('mouseleave', hideTooltip);
	element.addEventListener('contextmenu', event => {
		event.preventDefault();
		event.stopImmediatePropagation();
		const item = getItem();
		if (item) {
			openItemInfo(item.itemId);
		}
	});
}

/**
 * @param {number} itemId
 * @returns {string}
 */
function getItemName(itemId) {
	return DB.getItemName({ ITID: itemId, IsIdentified: true });
}

/**
 * Open the item description window
 *
 * @param {number} itemId
 */
function openItemInfo(itemId) {
	if (ItemInfo.uid === itemId) {
		ItemInfo.remove();
		return;
	}
	ItemInfo.append();
	ItemInfo.uid = itemId;
	ItemInfo.setItem({ ITID: itemId, IsIdentified: true });
}

/**
 * Show a text box at a window position
 *
 * @param {string} text
 * @param {number} x
 * @param {number} y
 */
function showTooltip(text, x, y) {
	const tooltip = Roulette.getRoot().querySelector('.tooltip');
	tooltip.textContent = text;
	tooltip.style.left = x + 'px';
	tooltip.style.top = Math.max(0, y) + 'px';
	tooltip.style.display = 'block';
}

/**
 * Hide the text box
 */
function hideTooltip() {
	const tooltip = Roulette.getRoot().querySelector('.tooltip');
	if (tooltip) {
		tooltip.style.display = 'none';
	}
}

/**
 * @var {HTMLButtonElement|null} Standalone roulette icon (light DOM)
 */
let _iconBtn = null;

/**
 * Click on the roulette icon: ask the server to open the window
 * (UIOpenRoulletteWnd sends CZ_REQ_OPEN_ROULETTE only while the window
 * is closed).
 */
function onClickIcon() {
	if (Roulette.isOpen()) {
		return;
	}
	Network.sendPacket(new PACKET.CZ.REQ_OPEN_ROULETTE());
}

/**
 * Once append to the DOM
 */
Roulette.onAppend = function onAppend() {
	const x = _preferences.x === null ? (Renderer.width - Layout.WINDOW_WIDTH) / 2 : _preferences.x;
	const y = _preferences.y === null ? (Renderer.height - 480) / 2 : _preferences.y;
	this._host.style.top = Math.max(0, Math.min(y, Renderer.height - Layout.WINDOW_HEIGHT)) + 'px';
	this._host.style.left = Math.max(0, Math.min(x, Renderer.width - Layout.WINDOW_WIDTH)) + 'px';

	// The window opens from the server's answer; a map change keeps it as it was
	this._host.style.display = _wasOpen ? '' : 'none';
	_wasOpen = false;
	refresh();

	// Only the window the config picks adds the icon
	if (!useOfficialLayout('Roulette')) {
		return;
	}

	if (ROConfig.enableRoulette === false) {
		return;
	}

	if (PACKETVER.value < 20141008) {
		return;
	}

	addRouletteIcon();
};

/**
 * Create the roulette icon as a standalone light-DOM button.
 */
function addRouletteIcon() {
	if (_iconBtn) {
		return;
	}
	_iconBtn = document.createElement('button');
	_iconBtn.className = 'rouletteIcon';
	Object.assign(_iconBtn.style, {
		position: 'absolute',
		top: '74px',
		right: '145px',
		width: '43px',
		height: '43px',
		border: 'none',
		backgroundColor: 'transparent',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'contain',
		backgroundPosition: 'center',
		zIndex: '50',
		cursor: 'pointer'
	});
	_iconBtn.addEventListener('mousedown', e => e.stopImmediatePropagation());
	_iconBtn.addEventListener('click', onClickIcon);
	document.body.appendChild(_iconBtn);
	const iconPath = 'basic_interface/roullette/RoulletteIcon.bmp';
	Client.loadFile(DB.INTERFACE_PATH + iconPath, function (data) {
		if (_iconBtn) {
			_iconBtn.style.backgroundImage = `url(${data})`;
		}
	});
}

/**
 * Remove from DOM
 */
Roulette.onRemove = function onRemove() {
	_wasOpen = this._host.style.display !== 'none';
	if (_state.spinning) {
		// The server already decided; land on the prize
		stopSpin();
		_state.hasPrize = true;
		_state.canStart = true;
		_highlightCol = _state.idx;
	}
	if (_iconBtn) {
		_iconBtn.remove();
		_iconBtn = null;
	}
	if (this._host.style.left) {
		_preferences.x = parseInt(this._host.style.left, 10);
		_preferences.y = parseInt(this._host.style.top, 10);
	}
	_preferences.save();
};

/**
 * @returns {boolean} the window is shown
 */
Roulette.isOpen = function isOpen() {
	return !!(this._host && this.__active && this._host.style.display !== 'none');
};

/**
 * Show the window
 */
function showWindow() {
	if (!Roulette.__active) {
		Roulette.append();
	}
	_state.canStart = true;
	_startHover = false;
	Roulette._host.style.display = '';
	refresh();
	Roulette.focus();
}

/**
 * Hide the window
 */
function hideWindow() {
	_openWhenListed = false;
	hideTooltip();
	if (Roulette._host) {
		Roulette._host.style.display = 'none';
	}
}

/**
 * ZC_ACK_OPEN_ROULETTE, success
 *
 * @param {object} pkt
 */
Roulette.onOpen = function onOpen(pkt) {
	_state.serial = pkt.serial;
	_state.step = pkt.step;
	_state.additionItemID = pkt.additionItemID;
	_state.gold = pkt.goldPoint;
	_state.silver = pkt.silverPoint;
	_state.bronze = pkt.bronzePoint;

	// idx 0xFF: no prize waiting
	_state.hasPrize = pkt.idx !== 0xff;
	_state.losing = false;
	_state.idx = _state.hasPrize ? pkt.idx : 0;
	_highlightCol = _state.hasPrize ? _state.idx : null;

	// The board is asked for once; the window opens when it arrives
	if (!_state.items.length) {
		_openWhenListed = true;
		Network.sendPacket(new PACKET.CZ.REQ_ROULETTE_INFO());
		return;
	}

	showWindow();
};

/**
 * ZC_ACK_ROULETTE_INFO: the board
 *
 * @param {object} pkt
 */
Roulette.onRouletteInfo = function onRouletteInfo(pkt) {
	_state.serial = pkt.serial;
	_state.items = pkt.items.filter(item => item.row < Layout.ROWS && item.position < Layout.rowLength(item.row));
	renderBoard();

	if (_openWhenListed) {
		_openWhenListed = false;
		showWindow();
	} else if (Roulette.isOpen()) {
		refresh();
	}
};

/**
 * ZC_ACK_GENERATE_ROULETTE, success or blank: spin the row
 *
 * @param {object} pkt
 * @param {boolean} losing - the prize is a blank
 */
Roulette.onGenerate = function onGenerate(pkt, losing) {
	_state.step = pkt.step;
	_state.idx = pkt.idx;
	_state.additionItemID = pkt.additionItemID;
	_state.gold = pkt.remainGold;
	_state.silver = pkt.remainSilver;
	_state.bronze = pkt.remainBronze;
	_state.hasPrize = false;
	_state.losing = losing;

	startSpin();
};

/**
 * ZC_ACK_GENERATE_ROULETTE, failure: Start can be pressed again
 */
Roulette.onGenerateFailed = function onGenerateFailed() {
	_state.canStart = true;
	refresh();
};

/**
 * ZC_RECV_ROULETTE_ITEM, success: the prize is taken and the board resets
 *
 * @param {object} pkt
 */
Roulette.onItemReceived = function onItemReceived(pkt) {
	_state.additionItemID = pkt.additionItemID;
	_state.hasPrize = false;
	_state.losing = false;
	_state.idx = 0;
	reset();
	refresh();
};

/**
 * ZC_ACK_CLOSE_ROULETTE, success
 */
Roulette.onClosed = function onClosed() {
	reset();
	hideWindow();
};

/**
 * Stop the spin and clear the row (the manager's reset)
 */
function reset() {
	stopSpin();
	_state.step = 0;
	_highlightCol = null;
}

/**
 * Close button: refused while the board spins (MsgStr 2640)
 */
function onClickClose() {
	if (_state.spinning) {
		ChatBox.addText(DB.getMessage(2640), ChatBox.TYPE.ERROR, ChatBox.FILTER.PUBLIC_LOG, '#FF6464');
		return;
	}
	hideWindow();
	Network.sendPacket(new PACKET.CZ.REQ_CLOSE_ROULETTE());
}

/**
 * Start: CZ_REQ_GENERATE_ROULETTE, once until the server answers
 */
function onClickStart() {
	if (!_state.canStart || _state.spinning) {
		return;
	}
	_state.canStart = false;
	Network.sendPacket(new PACKET.CZ.REQ_GENERATE_ROULETTE());
	updateArrows();
}

/**
 * GetWinPrize: CZ_RECV_ROULETTE_ITEM while a prize is held
 */
function onClickPrize() {
	if (!_state.hasPrize) {
		return;
	}
	const pkt = new PACKET.CZ.RECV_ROULETTE_ITEM();
	pkt.condition = 0;
	Network.sendPacket(pkt);
}

/**
 * Run the spin: a box steps left across the row, lap after lap, slower
 * each lap, and stops on the prize.
 */
function startSpin() {
	stopSpin();

	_state.spinning = true;
	_state.canStart = false;
	_startHover = false;
	hideTooltip();

	const frames = Layout.spinFrames(_state.step, _state.idx);
	const startTime = Date.now();
	let index = 0;

	const tick = () => {
		_spinTimer = null;
		const elapsed = Date.now() - startTime;
		while (index + 1 < frames.length && frames[index + 1].time <= elapsed) {
			index++;
		}
		_highlightCol = frames[index].col;
		if (index + 1 >= frames.length) {
			endSpin();
			return;
		}
		updateHighlight();
		_spinTimer = setTimeout(tick, Math.max(0, frames[index + 1].time - elapsed));
	};

	_highlightCol = frames[0].col;
	refresh();
	_spinTimer = setTimeout(tick, frames.length > 1 ? frames[1].time : 0);
}

/**
 * The spin reached the prize
 */
function endSpin() {
	_state.spinning = false;
	_state.hasPrize = true;
	_state.canStart = true;
	_highlightCol = _state.idx;
	refresh();
}

/**
 * Cancel a running spin
 */
function stopSpin() {
	if (_spinTimer) {
		clearTimeout(_spinTimer);
		_spinTimer = null;
	}
	_state.spinning = false;
}

/**
 * @returns {object|null} the item in the current row at the prize column
 */
function getPrizeItem() {
	if (!_state.hasPrize) {
		return null;
	}
	return _state.items.find(item => item.row === _state.step && item.position === _state.idx) || null;
}

/**
 * @returns {object|null} the bonus item, shown when it is on the board
 */
function getBonusItem() {
	if (!_state.additionItemID) {
		return null;
	}
	return _state.items.find(item => item.itemId === _state.additionItemID) || null;
}

/**
 * Put an item's icon and count into a cell
 *
 * @param {HTMLElement} cell - .item with .icon and .count children
 * @param {object|null} item
 */
function fillCell(cell, item) {
	const icon = cell.querySelector('.icon');
	const count = cell.querySelector('.count');

	if (!item) {
		cell.dataset.itemId = '';
		icon.style.backgroundImage = '';
		count.textContent = '';
		return;
	}

	if (cell.dataset.itemId !== String(item.itemId)) {
		cell.dataset.itemId = String(item.itemId);
		icon.style.backgroundImage = '';
		const it = DB.getItemInfo(item.itemId);
		Client.loadFile(DB.INTERFACE_PATH + 'item/' + it.identifiedResourceName + '.bmp', function (data) {
			if (cell.dataset.itemId === String(item.itemId)) {
				icon.style.backgroundImage = `url(${data})`;
			}
		});
	}

	count.textContent = item.count ? String(item.count) : '';
	count.classList.toggle('wide', item.count >= 1000);
}

/**
 * Build the board cells from the item list
 */
function renderBoard() {
	const root = Roulette.getRoot();
	const board = root.querySelector('.board');
	if (!board) {
		return;
	}
	board.innerHTML = '';

	_state.items.forEach(item => {
		const pos = Layout.cellPosition(item.row, item.position);
		const cell = document.createElement('div');
		cell.className = 'item cell grey';
		cell.dataset.row = String(item.row);
		cell.style.left = pos.x + 'px';
		cell.style.top = pos.y + 'px';
		cell.innerHTML = '<div class="icon"></div><div class="count"></div>';
		fillCell(cell, item);

		const tip = Layout.cellTooltipPosition(item.row, item.position);
		bindSlot(cell, () => item, tip.x, tip.y);
		board.appendChild(cell);
	});
}

/**
 * Move the spin box
 */
function updateHighlight() {
	const root = Roulette.getRoot();
	const highlight = root.querySelector('.highlight');
	if (!highlight) {
		return;
	}
	if (_highlightCol === null) {
		highlight.style.display = 'none';
		return;
	}
	const rect = Layout.highlightRect(_state.step, _highlightCol);
	highlight.style.left = rect.x + 'px';
	highlight.style.top = rect.y + 'px';
	highlight.style.display = 'block';
}

/**
 * Stage arrows: beside the current row while spinning or holding a prize,
 * and, while the cursor is over Start, beside the row the next spin plays.
 */
function updateArrows() {
	const root = Roulette.getRoot();
	const current = root.querySelector('.arrow.current');
	const next = root.querySelector('.arrow.next');
	const nextRow = root.querySelector('.arrow.next-row');
	if (!current) {
		return;
	}

	const place = (element, pos, visible) => {
		element.style.display = visible ? 'block' : 'none';
		if (visible) {
			element.style.left = pos.x + 'px';
			element.style.top = pos.y + 'px';
		}
	};

	place(current, Layout.currentArrowPosition(_state.step), _state.spinning || (_state.hasPrize && !_state.losing));

	const hovering = _startHover && _state.canStart;
	place(next, Layout.nextArrowPosition(Layout.nextRowOffset(_state), _state.step), hovering && !_state.spinning);
	place(nextRow, Layout.nextArrowPosition(1, _state.step), hovering && _state.hasPrize && !_state.losing);
}

/**
 * Redraw everything from the state
 */
function refresh() {
	const root = Roulette.getRoot();
	if (!root || !root.querySelector('.board')) {
		return;
	}

	root.querySelector('.point.gold').textContent = String(_state.gold);
	root.querySelector('.point.silver').textContent = String(_state.silver);
	root.querySelector('.point.bronze').textContent = String(_state.bronze);

	// The row being played is in colour; the others are grey
	const live = _state.hasPrize || _state.spinning;
	root.querySelectorAll('.board .cell').forEach(cell => {
		cell.classList.toggle('grey', !(live && Number(cell.dataset.row) === _state.step));
	});

	const prize = getPrizeItem();
	const prizeSlot = root.querySelector('.slot.prize');
	fillCell(prizeSlot, prize);
	prizeSlot.classList.toggle('visible', !!prize);

	const bonus = getBonusItem();
	const bonusSlot = root.querySelector('.slot.bonus');
	fillCell(bonusSlot, bonus);
	bonusSlot.classList.toggle('visible', !!bonus);

	root.querySelector('.btn-start').classList.toggle('visible', Layout.isStartVisible(_state));
	root.querySelector('.btn-prize').classList.toggle('visible', Layout.isPrizeButtonVisible(_state));

	updateHighlight();
	updateArrows();
}

/**
 * Export
 */
export default UIManager.addComponent(Roulette);
