/**
 * UI/Components/DressRoom/DressRoom.js
 *
 * Dress room: try hairstyles, hair colors and clothes colors on your own character
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Preferences from 'Core/Preferences.js';
import Renderer from 'Renderer/Renderer.js';
import SpriteRenderer from 'Renderer/SpriteRenderer.js';
import Camera from 'Renderer/Camera.js';
import Entity from 'Renderer/Entity/Entity.js';
import Session from 'Engine/SessionStorage.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import htmlText from './DressRoom.html?raw';
import cssText from './DressRoom.css?raw';

const DressRoom = new GUIComponent('DressRoom', cssText);

DressRoom.render = () => htmlText;

/**
 * What each category lists. The official window reads these from the
 * DressRoom Lua files; the ranges are the ones character creation offers.
 */
const RANGES = {
	human: {
		head: { min: 1, max: 29 },
		headpalette: { min: 0, max: 8 },
		bodypalette: { min: 0, max: 7 }
	},
	doram: {
		head: { min: 1, max: 6 },
		headpalette: { min: 0, max: 7 },
		bodypalette: { min: 0, max: 7 }
	}
};

/**
 * Category names: msgstringtable ids and their text, in the official combo's order
 */
const LABELS = {
	headpalette: [2763, 'Hair color'],
	head: [2764, 'Hairstyle'],
	bodypalette: [2765, 'Dress color']
};

const _preferences = Preferences.get('DressRoom', { x: 150, y: 150 }, 1.0);

/**
 * @var {CanvasRenderingContext2D}
 */
let _ctx;

/**
 * @var {Entity} the character drawn in the window
 */
let _preview = null;

/**
 * @var {number} direction the preview faces
 */
let _direction = 0;

/**
 * @var {string} category listed, a key of RANGES
 */
let _category = 'headpalette';

/**
 * @var {boolean} the preview is drawn every frame
 */
let _rendering = false;

DressRoom.init = function init() {
	const root = this.getRoot();

	root.querySelectorAll('.category option').forEach(option => {
		const [id, text] = LABELS[option.value];
		option.textContent = DB.getMessage(id, text);
	});

	_ctx = root.querySelector('canvas').getContext('2d');

	root.querySelector('.base').addEventListener('mousedown', event => event.stopImmediatePropagation());
	root.querySelector('.close').addEventListener('click', () => DressRoom.remove());
	root.querySelector('.close-button').addEventListener('click', () => DressRoom.remove());
	root.querySelector('.rot_left').addEventListener('click', event => {
		event.stopImmediatePropagation();
		DressRoom.rotate(1);
	});
	root.querySelector('.rot_right').addEventListener('click', event => {
		event.stopImmediatePropagation();
		DressRoom.rotate(-1);
	});

	const category = root.querySelector('.category');
	category.addEventListener('mousedown', event => event.stopPropagation());
	category.addEventListener('change', () => DressRoom.setCategory(category.value));

	root.querySelector('.list').addEventListener('click', event => {
		const row = event.target.closest('.row');
		if (row) {
			DressRoom.select(parseInt(row.getAttribute('data-value'), 10));
		}
	});

	this.draggable('.titlebar');
};

DressRoom.onAppend = function onAppend() {
	this._host.style.top = Math.min(Math.max(0, _preferences.y), Renderer.height - 205) + 'px';
	this._host.style.left = Math.min(Math.max(0, _preferences.x), Renderer.width - 395) + 'px';

	if (!_rendering) {
		Renderer.render(renderPreview);
		_rendering = true;
	}
};

DressRoom.onRemove = function onRemove() {
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.save();

	if (_rendering) {
		Renderer.stop(renderPreview);
		_rendering = false;
	}
	_preview = null;
};

/**
 * Open the window on the player's current look (ZC_DRESSROOM_OPEN)
 */
DressRoom.open = function open() {
	_direction = 0;
	_preview = createPreview();
	this.append();
	this.setCategory(_category);
};

/**
 * @param {number} delta - 1 turns left, -1 right
 */
DressRoom.rotate = function rotate(delta) {
	_direction = (_direction + delta + 8) % 8;
};

/**
 * List the choices of one category
 *
 * @param {string} category - head, headpalette or bodypalette
 */
DressRoom.setCategory = function setCategory(category) {
	if (!(category in LABELS)) {
		return;
	}
	_category = category;

	const root = this.getRoot();
	const range = getRange(category);
	const current = _preview ? _preview[category] : -1;
	const list = root.querySelector('.list');
	const label = DB.getMessage(LABELS[category][0], LABELS[category][1]);

	root.querySelector('.category').value = category;
	list.innerHTML = '';
	for (let value = range.min; value <= range.max; value++) {
		const row = document.createElement('div');
		row.className = 'row' + (value === current ? ' selected' : '');
		row.setAttribute('data-value', value);
		row.textContent = `${label} ${value}`;
		list.appendChild(row);
	}
};

/**
 * Put a choice of the current category on the preview
 *
 * @param {number} value
 */
DressRoom.select = function select(value) {
	if (!_preview || isNaN(value)) {
		return;
	}
	_preview[_category] = value;

	this.getRoot()
		.querySelectorAll('.list .row')
		.forEach(row => {
			row.classList.toggle('selected', parseInt(row.getAttribute('data-value'), 10) === value);
		});
};

/**
 * @returns {Entity|null} what the preview wears now, for tests
 */
DressRoom.getPreview = function getPreview() {
	return _preview;
};

/**
 * @param {string} category
 * @returns {{min: number, max: number}}
 */
function getRange(category) {
	const job = Session.Entity ? Session.Entity.job : 0;
	return RANGES[DB.isDoram(job) ? 'doram' : 'human'][category];
}

/**
 * A copy of the player to dress, never shown on the map
 *
 * @returns {Entity|null}
 */
function createPreview() {
	const player = Session.Entity;
	if (!player) {
		return null;
	}

	const entity = new Entity();
	entity.set({
		GID: player.GID + '_DRESSROOM',
		objecttype: entity.constructor.TYPE_PC,
		job: player.job,
		sex: player.sex,
		name: '',
		hideShadow: true,
		head: player.head,
		headpalette: player.headpalette,
		bodypalette: player.bodypalette,
		accessory: player.accessory,
		accessory2: player.accessory2,
		accessory3: player.accessory3,
		robe: player.robe
	});
	return entity;
}

/**
 * Draw the preview, standing still
 */
const renderPreview = (function renderPreviewClosure() {
	const _cleanColor = new Float32Array([1.0, 1.0, 1.0, 1.0]);
	const _savedColor = new Float32Array(4);
	const _animation = {
		tick: 0,
		frame: 0,
		repeat: true,
		play: true,
		next: false,
		delay: 0,
		save: false
	};

	return function render() {
		if (!_ctx) {
			return;
		}

		_ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);

		if (!_preview) {
			return;
		}

		_savedColor.set(_preview.effectColor);
		_preview.effectColor.set(_cleanColor);

		Camera.direction = 0;
		_preview.direction = _direction;
		_preview.headDir = 0;
		_preview.action = _preview.ACTION.IDLE;
		_preview.animation = _animation;

		SpriteRenderer.bind2DContext(_ctx, Math.floor(_ctx.canvas.width / 2), _ctx.canvas.height - 20);
		_preview.renderEntity(_ctx);
		_preview.effectColor.set(_savedColor);
	};
})();

export default UIManager.addComponent(DressRoom);
