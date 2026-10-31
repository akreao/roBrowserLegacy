/**
 * UI/Components/BigMap/BigMap.js
 *
 * The enlarged map the minimap's view button opens (official UIMiniMapWnd):
 * the map at 512 px with the player, party/guild, quest marks and town
 * facilities, plus up to 20 memo points per map that the player places and
 * names, kept between sessions.
 *
 * kRO 2025-07-16: OnCreate 0x00962010, OnDraw 0x00962370, mouse-down vfunc25
 * 0x00962630, messages vfunc37 0x00962a30, memo file reader 0x00961890.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import Session from 'Engine/SessionStorage.js';
import Renderer from 'Renderer/Renderer.js';
import Altitude from 'Renderer/Map/Altitude.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import InputBox from 'UI/Components/InputBox/InputBox.js';
import EntityManager from 'Renderer/EntityManager.js';
import htmlText from './BigMap.html?raw';
import cssText from './BigMap.css?raw';

const BigMap = new GUIComponent('BigMap', cssText);

BigMap.render = () => htmlText;

/** The official window keeps 20 memo points per map. */
export const MAX_MEMOS = 20;

/** A memo's text is cut to 30 characters when read back. */
const MAX_MEMO_TEXT = 30;

const SIZE = 512;

const _preferences = Preferences.get('BigMap', { x: 200, y: 100, quest: true, facility: true, party: true }, 1.0);

/**
 * Memo points by map name: [{ x, y, text }]. The official client writes them
 * to <user>\Memo\$$<map>.txt; ours keeps them in the browser.
 */
const _memos = Preferences.get('BigMapMemo', { maps: {} }, 1.0);

/** @var {function} returns the minimap's map data (MiniMap.getMapData) */
let _source = () => null;

let _ctx = null;
let _marking = false;
let _memoPoint = null;
let _boss = null;
let _memoReady = [];
let _memoOk = [];

/**
 * Where the map lies on the 512 px square, as the official OnCreate works it out.
 *
 * @return {{ scale: number, ox: number, oy: number }}
 */
function projection() {
	const width = Altitude.width || 1;
	const height = Altitude.height || 1;
	const max = Math.max(width, height);
	const scale = SIZE / max;
	return { scale, ox: ((max - width) / 2) * scale, oy: SIZE - ((max - height) / 2) * scale };
}

/**
 * Cell to canvas position
 */
export function toCanvas(x, y) {
	const { scale, ox, oy } = projection();
	return [ox + x * scale, oy - y * scale];
}

/**
 * Canvas position to cell
 */
export function toCell(px, py) {
	const { scale, ox, oy } = projection();
	return [Math.round((px - ox) / scale), Math.round((oy - py) / scale)];
}

/**
 * @param {string} mapName
 * @return {Array<{x: number, y: number, text: string}>}
 */
BigMap.getMemos = function getMemos(mapName) {
	return _memos.maps[mapName] || [];
};

function saveMemos(mapName, list) {
	if (list.length) {
		_memos.maps[mapName] = list;
	} else {
		delete _memos.maps[mapName];
	}
	_memos.save();
}

/**
 * Add a memo point; refused once the map has 20.
 *
 * @return {boolean}
 */
BigMap.addMemo = function addMemo(mapName, x, y, text) {
	const list = BigMap.getMemos(mapName).slice();
	const clean = String(text).replace(/\s+/g, ' ').trim().slice(0, MAX_MEMO_TEXT);
	if (!mapName || !clean || list.length >= MAX_MEMOS) {
		return false;
	}
	list.push({ x, y, text: clean });
	saveMemos(mapName, list);
	return true;
};

BigMap.removeMemo = function removeMemo(mapName, index) {
	const list = BigMap.getMemos(mapName).slice();
	list.splice(index, 1);
	saveMemos(mapName, list);
};

/**
 * The memo point under a canvas position, if any
 */
function memoAt(mapName, px, py) {
	const list = BigMap.getMemos(mapName);
	for (let i = list.length - 1; i >= 0; i--) {
		const [mx, my] = toCanvas(list[i].x, list[i].y);
		if (Math.abs(mx - px) <= 6 && Math.abs(my - py) <= 6) {
			return i;
		}
	}
	return -1;
}

/**
 * The mark under a canvas position: a memo point first, then the boss, quest
 * NPCs and town facilities (official buttons 600+, 0xcd, 2001+ and 1000+).
 *
 * @return {{kind: string, index?: number, x?: number, y?: number, name?: string}|null}
 */
function markAt(data, px, py) {
	const memo = memoAt(data.mapName, px, py);
	if (memo !== -1) {
		return { kind: 'memo', index: memo };
	}
	const near = (x, y) => {
		const [mx, my] = toCanvas(x, y);
		return Math.abs(mx - px) <= 7 && Math.abs(my - py) <= 7;
	};
	const markers = data.markers || [];
	const boss = markers.find(dot => dot.key === 'mvp');
	if (boss && near(boss.x, boss.y)) {
		return { kind: 'boss', x: boss.x, y: boss.y, name: DB.getMessage(2749, 'Boss Monster') };
	}
	if (_preferences.quest) {
		for (const dot of markers) {
			if (dot.key !== 'mvp' && near(dot.x, dot.y)) {
				const npc = EntityManager.get(dot.key);
				const name = npc && npc.display && npc.display.name;
				return { kind: 'quest', x: dot.x, y: dot.y, name: name || DB.getMessage(2752, 'Quest NPC') };
			}
		}
	}
	if (_preferences.facility) {
		for (const dot of data.towninfo || []) {
			if (near(dot.X, dot.Y)) {
				return { kind: 'facility', x: dot.X, y: dot.Y, name: dot.Name };
			}
		}
	}
	return null;
}

/**
 * Start the navigation to a quest NPC or a facility, as the official buttons
 * 1000+ and 2001+ do (0x00b314f0).
 */
function navigateTo(mapName, mark) {
	const Navigation = UIManager.getComponent('Navigation');
	if (!Navigation || typeof Navigation.setNaviInfo !== 'function') {
		return;
	}
	const naviInfo = `${mapName},${mark.x},${mark.y}`;
	Navigation.show();
	Navigation.uid = naviInfo;
	Navigation.setNaviInfo(naviInfo, mark.name);
}

/**
 * Hook the minimap in: it owns the map picture and the marks.
 *
 * @param {function} source
 */
BigMap.setSource = function setSource(source) {
	_source = source;
};

BigMap.init = function init() {
	const root = this.getRoot();
	_ctx = root.querySelector('canvas').getContext('2d');

	this.draggable('.titlebar');

	const closeBtn = root.querySelector('.titlebar .close');
	closeBtn.addEventListener('mousedown', e => e.stopImmediatePropagation());
	closeBtn.addEventListener('click', () => BigMap.hide());

	for (const kind of ['quest', 'facility', 'party']) {
		const box = root.querySelector(`.show-${kind}`);
		box.checked = _preferences[kind] !== false;
		box.addEventListener('change', () => {
			_preferences[kind] = box.checked;
			_preferences.save();
		});
	}

	const memoBtn = root.querySelector('.memo');
	memoBtn.title = DB.getMessage(2748, 'Record');
	memoBtn.addEventListener('mousedown', e => e.stopImmediatePropagation());
	memoBtn.addEventListener('click', () => setMarking(!_marking));
	loadButtonImages();

	const canvas = root.querySelector('canvas');
	// On click, not mousedown: the memo box's overlay would take the click that follows
	canvas.addEventListener('mousedown', event => event.stopImmediatePropagation());
	canvas.addEventListener('click', onMapClick);
	canvas.addEventListener('mousemove', onMapHover);
	canvas.addEventListener('mouseleave', () => {
		root.querySelector('.memo-tip').style.display = 'none';
	});
};

function loadButtonImages() {
	_memoReady = [];
	_memoOk = [];
	for (let i = 1; i <= 3; i++) {
		Client.loadFile(`${DB.INTERFACE_PATH}minimap/memo_ready_${i}.bmp`, url => {
			_memoReady[i] = url;
			updateMemoButton();
		});
		Client.loadFile(`${DB.INTERFACE_PATH}minimap/memo_ok_${i}.bmp`, url => {
			_memoOk[i] = url;
			updateMemoButton();
		});
	}
	Client.loadFile(
		`${DB.INTERFACE_PATH}minimap/boss_1.bmp`,
		url => {
			const img = new Image();
			img.src = url;
			_boss = img;
		},
		() => {
			_boss = null;
		}
	);
	Client.loadFile(
		`${DB.INTERFACE_PATH}minimap/memopoint_1.bmp`,
		url => {
			const img = new Image();
			img.src = url;
			_memoPoint = img;
		},
		() => {
			_memoPoint = null;
		}
	);
}

function updateMemoButton() {
	const btn = BigMap.getRoot().querySelector('.memo');
	const url = (_marking ? _memoOk : _memoReady)[1];
	if (btn && url) {
		btn.style.backgroundImage = `url(${url})`;
	}
}

/**
 * Memo mode: the next click on the map places a memo point there
 * (official message 0x164 and vfunc25).
 */
function setMarking(on) {
	_marking = on;
	BigMap.getRoot().querySelector('.body').classList.toggle('marking', on);
	updateMemoButton();
}

function canvasPosition(event) {
	const rect = event.target.getBoundingClientRect();
	const scaleX = rect.width ? SIZE / rect.width : 1;
	const scaleY = rect.height ? SIZE / rect.height : 1;
	return [(event.clientX - rect.left) * scaleX, (event.clientY - rect.top) * scaleY];
}

function onMapClick(event) {
	if (event.button !== 0) {
		return;
	}
	event.stopImmediatePropagation();
	const data = _source();
	if (!data || !data.mapName) {
		return;
	}
	const [px, py] = canvasPosition(event);

	if (!_marking) {
		const mark = markAt(data, px, py);
		if (!mark) {
			return;
		}
		if (mark.kind === 'memo') {
			// A memo point asks before it goes (official message 600 + slot, msgstringtable 2751)
			UIManager.showPromptBox(DB.getMessage(2751, 'Do you want to delete it?'), 'ok', 'cancel', () =>
				BigMap.removeMemo(data.mapName, mark.index)
			);
		} else if (mark.kind === 'quest' || mark.kind === 'facility') {
			navigateTo(data.mapName, mark);
		}
		return;
	}

	const [x, y] = toCell(px, py);
	setMarking(false);
	if (x < 1 || y < 1 || x > Altitude.width || y > Altitude.height) {
		return;
	}
	if (BigMap.getMemos(data.mapName).length >= MAX_MEMOS) {
		return;
	}

	InputBox.append();
	InputBox.setType('text', false, '');
	const label = InputBox.getRoot().querySelector('.text');
	if (label) {
		label.textContent = DB.getMessage(2753, 'Record content');
	}
	InputBox.onSubmitRequest = text => {
		InputBox.remove();
		BigMap.addMemo(data.mapName, x, y, text);
	};
}

function onMapHover(event) {
	const data = _source();
	const tip = BigMap.getRoot().querySelector('.memo-tip');
	if (!data || !data.mapName) {
		tip.style.display = 'none';
		return;
	}
	const [px, py] = canvasPosition(event);
	const mark = markAt(data, px, py);
	if (!mark || (mark.kind !== 'memo' && !mark.name)) {
		tip.style.display = 'none';
		event.target.style.cursor = '';
		return;
	}
	const point = mark.kind === 'memo' ? BigMap.getMemos(data.mapName)[mark.index] : mark;
	const [mx, my] = toCanvas(point.x, point.y);
	tip.textContent = mark.kind === 'memo' ? point.text : mark.name;
	event.target.style.cursor = mark.kind === 'quest' || mark.kind === 'facility' ? 'pointer' : '';
	tip.style.display = 'block';
	// The canvas may be drawn smaller than 512 px (narrow screens): place the
	// name in on-screen pixels, and left of the point when it would overflow.
	const rect = event.target.getBoundingClientRect();
	const factor = rect.width ? rect.width / SIZE : 1;
	const x = mx * factor;
	const width = tip.offsetWidth;
	const left = x + 8 + width > rect.width ? Math.max(0, x - 8 - width) : x + 8;
	tip.style.left = `${Math.round(left)}px`;
	tip.style.top = `${Math.round(Math.max(0, my * factor - 8))}px`;
}

/**
 * Draw one frame
 */
function draw(tick) {
	const data = _source();
	if (!_ctx || !data) {
		return;
	}

	const entity = Session.Entity;
	const pos = entity && entity.position;
	if (pos) {
		const name = entity.display && entity.display.name ? entity.display.name : '';
		BigMap.getRoot().querySelector('.titlebar .title').textContent =
			`${name} ( ${data.mapName} ) ${pos[0] | 0} ${pos[1] | 0}`;
	}

	_ctx.clearRect(0, 0, SIZE, SIZE);
	if (data.map && data.map.complete && data.map.width) {
		_ctx.drawImage(data.map, 0, 0, SIZE, SIZE);
	}

	// Town facilities
	if (_preferences.facility && data.towninfo) {
		for (const dot of data.towninfo) {
			const img = data.icons && data.icons[dot.Type];
			if (img && img.complete && img.width) {
				const [x, y] = toCanvas(dot.X, dot.Y);
				_ctx.drawImage(img, (x - img.width / 2) | 0, (y - img.height / 2) | 0);
			}
		}
	}

	// Quest and other server marks, blinking like on the minimap
	if (_preferences.quest && data.markers && tick % 1000 > 500) {
		for (const dot of data.markers) {
			if (dot.key === 'mvp') {
				continue;
			}
			const [x, y] = toCanvas(dot.x, dot.y);
			_ctx.fillStyle = dot.color;
			_ctx.fillRect(x - 1, y - 6, 3, 13);
			_ctx.fillRect(x - 6, y - 1, 13, 3);
		}
	}

	// Party and guild members
	if (_preferences.party) {
		for (const dot of data.party || []) {
			const [x, y] = toCanvas(dot.x, dot.y);
			_ctx.fillStyle = 'white';
			_ctx.fillRect(x - 4, y - 4, 8, 8);
			_ctx.fillStyle = dot.color || 'red';
			_ctx.fillRect(x - 3, y - 3, 6, 6);
		}
		_ctx.fillStyle = 'rgb(245,175,200)';
		for (const dot of data.guild || []) {
			const [x, y] = toCanvas(dot.x, dot.y);
			_ctx.beginPath();
			_ctx.moveTo(x, y - 5);
			_ctx.lineTo(x + 5, y + 5);
			_ctx.lineTo(x - 5, y + 5);
			_ctx.closePath();
			_ctx.fill();
		}
	}

	// The boss a Convex Mirror found (official button 0xcd, minimap/boss)
	const boss = (data.markers || []).find(dot => dot.key === 'mvp');
	if (boss) {
		const [x, y] = toCanvas(boss.x, boss.y);
		if (_boss && _boss.complete && _boss.width) {
			_ctx.drawImage(_boss, (x - _boss.width / 2) | 0, (y - _boss.height / 2) | 0);
		} else {
			_ctx.fillStyle = 'red';
			_ctx.fillRect(x - 1, y - 6, 3, 13);
			_ctx.fillRect(x - 6, y - 1, 13, 3);
		}
	}

	// Memo points
	for (const memo of BigMap.getMemos(data.mapName)) {
		const [x, y] = toCanvas(memo.x, memo.y);
		if (_memoPoint && _memoPoint.complete && _memoPoint.width) {
			_ctx.drawImage(_memoPoint, (x - _memoPoint.width / 2) | 0, (y - _memoPoint.height / 2) | 0);
		} else {
			_ctx.fillStyle = 'rgb(255,200,0)';
			_ctx.strokeStyle = 'black';
			_ctx.beginPath();
			_ctx.arc(x, y, 4, 0, Math.PI * 2);
			_ctx.fill();
			_ctx.stroke();
		}
	}

	// The player
	if (pos && data.arrow && data.arrow.complete && data.arrow.width) {
		const [x, y] = toCanvas(pos[0], pos[1]);
		_ctx.save();
		_ctx.translate(x, y);
		_ctx.rotate(((entity.direction + 4) * 45 * Math.PI) / 180);
		_ctx.drawImage(data.arrow, -data.arrow.width / 2, -data.arrow.height / 2);
		_ctx.restore();
	}
}

BigMap.onAppend = function onAppend() {
	this._host.style.top = `${Math.min(Math.max(0, _preferences.y), Math.max(0, Renderer.height - 550))}px`;
	this._host.style.left = `${Math.min(Math.max(0, _preferences.x), Math.max(0, Renderer.width - 520))}px`;
	Renderer.render(draw);
};

BigMap.onRemove = function onRemove() {
	Renderer.stop(draw);
	setMarking(false);
	_preferences.x = parseInt(this._host.style.left, 10) || 0;
	_preferences.y = parseInt(this._host.style.top, 10) || 0;
	_preferences.save();
};

BigMap.hide = function hide() {
	if (this.__active) {
		this.remove();
	}
};

/**
 * Open or close it (the minimap's view button, official message 0xbd)
 */
BigMap.toggle = function toggle() {
	if (this.__active) {
		this.remove();
	} else {
		this.append();
		this.focus?.();
	}
};

BigMap.onKeyDown = function onKeyDown(event) {
	if ((event.key === 'Escape' || event.which === 27) && this.__active) {
		this.remove();
		event.stopImmediatePropagation();
		return false;
	}
	return true;
};

export default UIManager.addComponent(BigMap);
