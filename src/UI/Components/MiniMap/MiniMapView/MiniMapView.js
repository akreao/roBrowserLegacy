/**
 * UI/Components/MiniMap/MiniMapView/MiniMapView.js
 *
 * The large map the minimap's "Map View" button opens, laid out from the official
 * UIMiniMapWnd (window 0x111, kRO RagexeRE 2020-12-29: vf14 @0xb04560, vf17 @0xb049f0,
 * vf22 @0xb04ca0, vf34 @0xb050a0).
 *
 * The map bitmap fills 512x512 at (2,19). Warps are always drawn; three checkboxes show
 * the quest marks, the amenities and the guild and party members. "Record" places up to
 * twenty notes on the map, and clicking a note asks to delete it.
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
import htmlText from './MiniMapView.html?raw';
import cssText from './MiniMapView.css?raw';

const MiniMapView = new GUIComponent('MiniMapView', cssText);

MiniMapView.render = () => htmlText;

/**
 * Map area: 512x512 at (2,19); y grows upwards from 531 (UIMiniMapWnd::vf14)
 */
const SIZE = 512;

/**
 * Notes per map (ids 0x22a..0x23d)
 */
const MAX_MEMOS = 20;

/**
 * Checkbox states are kept like the official MINIMAPWNDINFO.SHOWQUEST / WHOWNPC / WHOWMEMBER
 */
const _preferences = Preferences.get(
	'MiniMapView',
	{
		x: 200,
		y: 100,
		quest: true,
		npc: true,
		member: true,
		memos: {}
	},
	1.0
);

/**
 * Amenity icons by town info type, as the minimap draws them
 */
const AMENITY_ICONS = ['store', 'weaponshop', 'armorshops', 'smithy', 'guide', 'inn', 'kafra'];

/**
 * @var {object} images, filled once
 */
const _images = {};

/**
 * @var {object} the minimap the data comes from
 */
let _minimap = null;

/**
 * @var {string} current map, without extension
 */
let _mapname = '';

/**
 * @var {boolean} waiting for a click on the map to place a note
 */
let _recording = false;

/**
 * @var {CanvasRenderingContext2D}
 */
let _ctx = null;

/**
 * Load an interface bitmap into an Image
 *
 * @param {string} key
 * @param {string} path below the interface folder
 */
function loadImage(key, path) {
	const img = new Image();
	_images[key] = img;
	Client.loadFile(DB.INTERFACE_PATH + path, url => {
		img.src = url;
	});
}

/**
 * Initialize UI
 */
MiniMapView.init = function init() {
	const root = this.getRoot();

	_ctx = root.querySelector('canvas').getContext('2d');

	loadImage('warp', 'minimap/warp.bmp');
	loadImage('guild', 'minimap/guild.bmp');
	loadImage('party', 'minimap/party.bmp');
	AMENITY_ICONS.forEach((name, type) => loadImage(`npc${type}`, `information/${name}.bmp`));

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => MiniMapView.remove());
	root.querySelector('.close').title = DB.getMessage(2741, 'Close');

	['quest', 'npc', 'member'].forEach(key => {
		const check = root.querySelector(`.check.${key}`);
		check.title = DB.getMessage({ quest: 2743, npc: 2745, member: 2747 }[key], '');
		check.addEventListener('click', event => {
			event.preventDefault();
			_preferences[key] = !_preferences[key];
			_preferences.save();
			drawChecks();
		});
	});

	const record = root.querySelector('.record');
	record.title = DB.getMessage(2748, 'Record');
	record.addEventListener('click', () => {
		_recording = true;
		root.querySelector('.map').classList.add('recording');
	});

	root.querySelector('.map').addEventListener('click', onMapClick);

	this.draggable('.titlebar');
};

/**
 * Once in the page
 */
MiniMapView.onAppend = function onAppend() {
	this._host.style.top = Math.max(0, Math.min(_preferences.y, Renderer.height - 559)) + 'px';
	this._host.style.left = Math.max(0, Math.min(_preferences.x, Renderer.width - 516)) + 'px';

	drawChecks();
	drawMemos();
	Renderer.render(draw);
};

/**
 * Once out of the page
 */
MiniMapView.onRemove = function onRemove() {
	Renderer.stop(draw);
	stopRecording();
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();
};

/**
 * The minimap's Map View button. On a map with no minimap bitmap the official client
 * says "Unsupported map" (MsgStr 2767, UIMinimapZoomWnd::vf34 case 0xAE).
 *
 * @param {object} minimap
 */
MiniMapView.toggle = function toggle(minimap) {
	_minimap = minimap;

	if (this._host && this._host.parentNode) {
		this.remove();
		return;
	}

	if (!minimap.getViewData().loaded) {
		UIManager.showMessageBox(DB.getMessage(2767, 'Unsupported map'), 'ok');
		return;
	}

	this.append();
};

/**
 * The player changed map
 *
 * @param {string} mapname
 */
MiniMapView.onMapChange = function onMapChange(mapname) {
	_mapname = (mapname || '').replace(/\..*/, '');
	stopRecording();
	if (this._host && this._host.parentNode) {
		drawMemos();
	}
};

/**
 * Map cell to window pixel inside the map area (UIMiniMapWnd::vf14 and vf34 case 0x1D4)
 *
 * @return {object} {scale, x(cellX), y(cellY)}
 */
function projection() {
	const width = Altitude.width || 1;
	const height = Altitude.height || 1;
	const scale = SIZE / Math.max(width, height);
	const left = height > width ? ((height - width) / 2) * scale : 0;
	const bottom = width > height ? SIZE - ((width - height) / 2) * scale : SIZE;

	return {
		scale,
		x: cellX => cellX * scale + left,
		y: cellY => bottom - cellY * scale,
		cellX: px => (px - left) / scale,
		cellY: py => (bottom - py) / scale
	};
}

/**
 * @var {object} warps of the current map, from the navigation link table
 */
const _warps = { mapname: null, list: [] };

/**
 * The warp portals (navigation link type 200) that leave the current map
 *
 * @return {Array}
 */
function warps() {
	if (_warps.mapname !== _mapname) {
		const table = DB.getNaviLinkTable() || {};
		_warps.mapname = _mapname;
		_warps.list = Object.values(table).filter(
			link =>
				Array.isArray(link) &&
				String(link[0]).replace(/\..*/, '').toLowerCase() === _mapname.toLowerCase() &&
				Number(link[2]) === 200
		);
	}
	return _warps.list;
}

/**
 * Draw an icon centred on a cell
 */
function drawIcon(img, x, y) {
	if (img && img.complete && img.width) {
		_ctx.drawImage(img, Math.round(x - img.width / 2), Math.round(y - img.height / 2));
	}
}

/**
 * Draw the map and its marks, each frame while open
 */
function draw() {
	if (!_ctx || !_minimap) {
		return;
	}

	const data = _minimap.getViewData();
	const p = projection();
	const pos = Session.Entity && Session.Entity.position;

	// Title: "%s ( %s ) %d %d", map name, file and the player's cell (vf17)
	const title = MiniMapView.getRoot().querySelector('.titlebar .text');
	const text = `${DB.getMapName(`${_mapname}.gat`, _mapname)} ( ${_mapname} ) ${pos ? Math.floor(pos[0]) : 0} ${
		pos ? Math.floor(pos[1]) : 0
	}`;
	if (title.textContent !== text) {
		title.textContent = text;
	}

	_ctx.clearRect(0, 0, SIZE, SIZE);
	if (data.image.complete && data.image.width) {
		_ctx.drawImage(data.image, 0, 0, SIZE, SIZE);
	}

	// Warps, always (vf17, minimap\warp.bmp)
	warps().forEach(link => drawIcon(_images.warp, p.x(link[6]), p.y(link[7])));

	// Amenities (WHOWNPC)
	if (_preferences.npc) {
		data.towninfo.forEach(info => drawIcon(_images[`npc${info.Type}`], p.x(info.X), p.y(info.Y)));
	}

	// Quest marks (SHOWQUEST): the marks scripts put on the minimap (viewpoint)
	if (_preferences.quest) {
		data.markers.forEach(mark => {
			if (mark.key === 'mvp' || mark.tick < Renderer.tick) {
				return;
			}
			_ctx.fillStyle = mark.color;
			_ctx.fillRect(Math.round(p.x(mark.x)) - 1, Math.round(p.y(mark.y)) - 5, 3, 11);
			_ctx.fillRect(Math.round(p.x(mark.x)) - 5, Math.round(p.y(mark.y)) - 1, 11, 3);
		});
	}

	// Guild and party members (WHOWMEMBER)
	if (_preferences.member) {
		data.guild.forEach(member => drawIcon(_images.guild, p.x(member.x), p.y(member.y)));
		data.party.forEach(member => drawIcon(_images.party, p.x(member.x), p.y(member.y)));
	}

	drawBoss(data, p);
}

/**
 * The MVP mark (minimap\boss, tooltip MsgStr 2749)
 */
function drawBoss(data, p) {
	const points = MiniMapView.getRoot().querySelector('.points');
	let boss = points.querySelector('.boss');
	const mark = data.markers.find(m => m.key === 'mvp');

	if (!mark) {
		if (boss) {
			boss.remove();
		}
		return;
	}

	if (!boss) {
		boss = document.createElement('div');
		boss.className = 'boss';
		boss.title = DB.getMessage(2749, 'MVP Monster');
		Client.loadFile(`${DB.INTERFACE_PATH}minimap/boss_1.bmp`, url => {
			boss.style.backgroundImage = `url(${url})`;
		});
		points.appendChild(boss);
	}
	boss.style.left = Math.round(p.x(mark.x) - 12) + 'px';
	boss.style.top = Math.round(p.y(mark.y) - 12) + 'px';
}

/**
 * Show the checkbox states
 */
function drawChecks() {
	const root = MiniMapView.getRoot();
	['quest', 'npc', 'member'].forEach(key => {
		const box = root.querySelector(`.check.${key} .box`);
		Client.loadFile(`${DB.INTERFACE_PATH}checkbox_${_preferences[key] ? 1 : 0}.bmp`, url => {
			box.style.backgroundImage = `url(${url})`;
		});
	});
}

/**
 * Notes of the current map
 *
 * @return {Array}
 */
function memos() {
	if (!_preferences.memos[_mapname]) {
		_preferences.memos[_mapname] = [];
	}
	return _preferences.memos[_mapname];
}

/**
 * Draw the notes (minimap\memopoint, each with its text as the tooltip)
 */
function drawMemos() {
	const points = MiniMapView.getRoot().querySelector('.points');
	points.querySelectorAll('.memo').forEach(el => el.remove());

	const p = projection();
	memos().forEach((memo, index) => {
		const el = document.createElement('div');
		el.className = 'memo';
		el.title = memo.text;
		el.style.left = Math.round(p.x(memo.x) - 7) + 'px';
		el.style.top = Math.round(p.y(memo.y) - 6) + 'px';
		el.dataset.background = 'minimap/memopoint_1.bmp';
		el.dataset.hover = 'minimap/memopoint_2.bmp';
		el.dataset.down = 'minimap/memopoint_3.bmp';
		GUIComponent.processDataAttrs(el);
		el.addEventListener('click', event => {
			event.stopPropagation();
			// "Do you want to delete it?" (MsgStr 2751)
			UIManager.showPromptBox(DB.getMessage(2751, 'Do you want to delete it?'), 'ok', 'cancel', () => {
				memos().splice(index, 1);
				_preferences.save();
				drawMemos();
			});
		});
		points.appendChild(el);
	});
}

/**
 * Leave the note-placing mode
 */
function stopRecording() {
	_recording = false;
	const map = MiniMapView.getRoot()?.querySelector('.map');
	if (map) {
		map.classList.remove('recording');
	}
}

/**
 * A click on the map places a note while recording (vf22)
 *
 * @param {MouseEvent} event
 */
function onMapClick(event) {
	if (!_recording) {
		return;
	}
	stopRecording();

	if (memos().length >= MAX_MEMOS) {
		return;
	}

	const rect = event.currentTarget.getBoundingClientRect();
	const scale = rect.width / SIZE || 1;
	const p = projection();
	const x = Math.round(p.cellX((event.clientX - rect.left) / scale));
	const y = Math.round(p.cellY((event.clientY - rect.top) / scale));

	InputBox.append();
	InputBox.setType('text');
	InputBox.onSubmitRequest = text => {
		InputBox.remove();
		if (!text) {
			return;
		}
		memos().push({ x, y, text: String(text) });
		_preferences.save();
		drawMemos();
	};
}

MiniMapView.mouseMode = GUIComponent.MouseMode.STOP;

export default UIManager.addComponent(MiniMapView);
