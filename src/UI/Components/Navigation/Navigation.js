/**
 * UI/Components/Navigation/Navigation.js
 *
 * Navigation window for NAVI links.
 *
 * Laid out as the official UINavigationV4Wnd (kRO 2020-12-29): a 272x338
 * "basic" window with a search row, then either a search view (result list,
 * preview, route info, "Set as the target") or a map view (266x266 minimap with
 * the route), and a 134x61 "simple" box that shows only the destination.
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import KEYS from 'Controls/KeyEventHandler.js';
import Renderer from 'Renderer/Renderer.js';
import MapRenderer from 'Renderer/MapRenderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import 'UI/Elements/Elements.js';
import Altitude from 'Renderer/Map/Altitude.js';
import Session from 'Engine/SessionStorage.js';
import Client from 'Core/Client.js';
import DB from 'DB/DBManager.js';
import htmlText from './Navigation.html?raw';
import cssText from './Navigation.css?raw';
import MapPathFinder from './MapPathFinder.js';

/**
 * Create Navigation component
 */
const Navigation = new GUIComponent('Navigation', cssText);

Navigation.render = () => htmlText;

/**
 * Official sizes
 */
const BASIC_WIDTH = 272;
const BASIC_HEIGHT = 338;
const MAP_SIZE = 266;
const PREVIEW_SIZE = 100;

/**
 * Route dot colour (vf17: 2x2 rects of 0xF0F00A)
 */
const ROUTE_COLOR = '#f0f00a';

/**
 * Warp types used for the route. "Allow zeny for guide" adds the paid services.
 */
const WARP_TYPES = [200, 201];
const WARP_TYPES_ZENY = [200, 201, 202, 203, 204, 205];

/**
 * Search categories, in the official combo order (MsgStr 2206-2209)
 */
const SEARCH_TYPES = [
	{ type: 'ALL', msg: 2206, label: 'ALL' },
	{ type: 'MAP', msg: 2207, label: 'Map' },
	{ type: 'NPC', msg: 2208, label: 'Npc' },
	{ type: 'MOB', msg: 2209, label: 'Mob' }
];

/**
 * List icons (UIListBox_NaviSearch::vf17)
 */
const LIST_ICONS = {
	MAP: 'navigation_interface3/icon_list_map.bmp',
	NPC: 'navigation_interface3/icon_list_npc.bmp',
	MOB: 'navigation_interface3/icon_list_mob.bmp',
	START: 'navigation_interface3/icon_list_start.bmp',
	ROUTE: 'navigation_interface3/icon_list_riute.bmp',
	TARGET: 'navigation_interface3/icon_list_target.bmp'
};

/**
 * Async image create helper
 */
function createAsyncImage() {
	const img = new Image();
	img.decoding = 'async';
	return img;
}

const _map = createAsyncImage();
const _previewMap = createAsyncImage();
const _icoDestination = createAsyncImage();
const _icoLocation = createAsyncImage();

let _mapCtx = null;
let _previewCtx = null;

/**
 * @var {string} 'basic' or 'simple'
 */
let _mode = 'basic';

/**
 * @var {string} 'search' or 'map'
 */
let _view = 'search';

let _searchType = 'ALL';
let _results = [];
let _selected = -1;
let _previewData = null;
let _allowZeny = false;
let _checkboxOff = '';
let _checkboxOn = '';

/**
 * Route state
 */
let _path = [];
let _lastPathUpdate = 0;
const _pathUpdateThrottle = 500;
let _pathUpdateLock = false;
let _pathFindingWorker = null;
let _mapData = null;
let _targetData = null;
let _finalTargetData = null;

/**
 * @var {string} '', 'searching', 'found' or 'failed'
 */
let _routeStatus = '';

let _documentClickHandler = null;

/**
 * Normalize a map name (remove .gat extension)
 */
function normalizeMapName(mapName) {
	mapName = String(mapName || '')
		.replace(/\.gat$/, '')
		.toLowerCase();
	mapName = mapName.replace(/^(.+)_[a-d]$/, '$1');
	return mapName;
}

/**
 * Project a map cell to a square minimap of `size` pixels.
 * The minimap bitmaps are square and hold the map centred on its longer side,
 * as the MiniMap window draws them.
 */
function projectToMinimap(x, y, mapWidth, mapHeight, size) {
	const max = Math.max(mapWidth, mapHeight) || 1;
	const f = size / max;
	return {
		x: ((max - mapWidth) / 2 + x) * f,
		y: ((max - mapHeight) / 2 + (mapHeight - y)) * f
	};
}

/**
 * Get the current map name
 */
function getCurrentMap() {
	if (MapRenderer && MapRenderer.currentMap) {
		return normalizeMapName(MapRenderer.currentMap);
	}
	return '';
}

/**
 * Get the current player position
 */
function getPlayerPosition() {
	if (!Session.Entity || !Session.Entity.position) {
		return { x: 0, y: 0 };
	}
	return { x: Math.ceil(Session.Entity.position[0]), y: Math.ceil(Session.Entity.position[1]) };
}

/**
 * Message with a fallback when the table does not have it
 */
function msg(id, fallback) {
	const text = DB.getMessage(id, fallback);
	return text || fallback;
}

/**
 * Resolve a minimap bitmap path, through DB.mapalias
 */
function minimapPath(mapName) {
	let bmpPath = DB.INTERFACE_PATH.replace('data/texture/', '') + 'map/' + mapName + '.bmp';
	bmpPath = bmpPath.replace(/\//g, '\\');
	return 'data/texture/' + (DB.mapalias[bmpPath] || bmpPath);
}

/**
 * Resolve a GAT path, through DB.mapalias
 */
function gatPath(mapName) {
	let path = (mapName + '.gat').replace(/\//g, '\\');
	path = DB.mapalias[path] || path;
	return 'data/' + path;
}

const EMPTY_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

/**
 * Pathfinding worker
 */
function terminatePathFindingWorker() {
	if (_pathFindingWorker) {
		_pathFindingWorker.terminate();
		_pathFindingWorker = null;
	}
}

function initializePathFindingWorker() {
	if (_pathFindingWorker || typeof Worker === 'undefined') {
		return;
	}
	_pathFindingWorker = new Worker(new URL('./PathFindingWorker.js', import.meta.url).href);
	_pathFindingWorker.id = new Date().getTime().toString();
	_pathFindingWorker.onmessage = function onmessage(e) {
		const data = e.data;
		if (data.type !== 'pathResult') {
			return;
		}
		_pathUpdateLock = false;
		if (_finalTargetData && data.path && _pathFindingWorker && data.workerId === _pathFindingWorker.id) {
			_path = data.path;
			_routeStatus = _path.length > 0 ? 'found' : 'failed';
			Navigation.updateTargetText();
		}
	};
}

function resetPathFindingWorker() {
	terminatePathFindingWorker();
	initializePathFindingWorker();
}

/**
 * Initialize component
 */
Navigation.init = function init() {
	const root = this.getRoot();

	_mapData = {
		walkableType: Altitude.TYPE.WALKABLE
	};

	this._host.style.top = `${Math.max(0, Math.min(Renderer.height - BASIC_HEIGHT, 200))}px`;
	this._host.style.left = `${Math.max(0, Math.min(Renderer.width - BASIC_WIDTH, 200))}px`;

	const mapCanvas = root.querySelector('.map-canvas');
	_mapCtx = mapCanvas && mapCanvas.getContext ? mapCanvas.getContext('2d') : null;
	const previewCanvas = root.querySelector('.preview-canvas');
	_previewCtx = previewCanvas && previewCanvas.getContext ? previewCanvas.getContext('2d') : null;

	Client.loadFile(`${DB.INTERFACE_PATH}navigation_interface3/ico_destination.bmp`, dataURI => {
		_icoDestination.src = dataURI;
	});
	Client.loadFile(`${DB.INTERFACE_PATH}navigation_interface3/ico_location.bmp`, dataURI => {
		_icoLocation.src = dataURI;
	});
	Client.loadFile(`${DB.INTERFACE_PATH}checkbox_0.bmp`, dataURI => {
		_checkboxOff = dataURI;
		this.updateZenyBox();
	});
	Client.loadFile(`${DB.INTERFACE_PATH}checkbox_1.bmp`, dataURI => {
		_checkboxOn = dataURI;
		this.updateZenyBox();
	});

	// Tooltips (the official buttons carry these MsgStr ids)
	const tooltips = {
		'.btn-close': [3045, 'Close'],
		'.btn-simple-close': [3045, 'Close'],
		'.btn-mini': [2204, 'Change to simple UI'],
		'.btn-simple-max': [2203, 'Change to basic UI'],
		'.btn-back': [3208, 'Search&Info'],
		'.search-button': [2196, 'Search'],
		'.btn-target': [2197, 'Set as the target']
	};
	Object.keys(tooltips).forEach(selector => {
		const el = root.querySelector(selector);
		if (el) {
			el.title = msg(tooltips[selector][0], tooltips[selector][1]);
		}
	});

	// Title bar
	root.querySelector('.btn-close').addEventListener('click', () => this.hide());
	root.querySelector('.btn-mini').addEventListener('click', () => this.setMode('simple'));
	root.querySelector('.btn-simple-max').addEventListener('click', () => this.setMode('basic'));
	root.querySelector('.btn-simple-close').addEventListener('click', () => this.onSimpleClose());

	// Search row
	root.querySelector('.btn-back').addEventListener('click', () => {
		this.setView(_view === 'search' ? 'map' : 'search');
	});
	root.querySelector('.search-button').addEventListener('click', () => this.onSearch());

	const searchInput = root.querySelector('.search-input');
	searchInput.addEventListener('keydown', e => {
		if (e.which === KEYS.ENTER || e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			this.onSearch();
		}
	});

	// Category combo
	const combo = root.querySelector('.combo');
	combo.addEventListener('click', e => {
		const item = e.target.closest('.combo-item');
		if (item) {
			this.setSearchType(item.dataset.type);
			combo.classList.remove('open');
			return;
		}
		combo.classList.toggle('open');
	});
	_documentClickHandler = e => {
		const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
		if (path.indexOf(combo) === -1) {
			combo.classList.remove('open');
		}
	};

	// Search view
	root.querySelector('.result-list').addEventListener('click', e => {
		const row = e.target.closest('.row');
		if (row) {
			this.selectResult(Number(row.dataset.index));
		}
	});
	root.querySelector('.zeny-toggle').addEventListener('click', () => {
		_allowZeny = !_allowZeny;
		this.updateZenyBox();
		if (_selected > -1) {
			this.updateRouteInfo();
		}
	});
	root.querySelector('.btn-target').addEventListener('click', () => this.onSetTarget());

	this.setSearchType(_searchType);
	this.updateTargetButton();

	this.draggable('.titlebar');

	// Hide the UI initially
	this.ui.hide();
};

/**
 * Once append to the DOM
 */
Navigation.onAppend = function onAppend() {
	this.clearPath();

	Renderer.render(renderFrame);

	initializePathFindingWorker();

	if (_documentClickHandler) {
		document.addEventListener('click', _documentClickHandler);
	}

	const mapName = getCurrentMap();
	this.loadMap(mapName);

	if (_finalTargetData) {
		this.reroute();
	}
	this.applyLayout();
};

/**
 * Once removed from DOM
 */
Navigation.onRemove = function onRemove() {
	this.clearPath();
	terminatePathFindingWorker();
	if (Renderer.stop) {
		Renderer.stop(renderFrame);
	}
	if (_documentClickHandler) {
		document.removeEventListener('click', _documentClickHandler);
	}
};

/**
 * Switch between the basic window and the simple box
 */
Navigation.setMode = function setMode(mode) {
	_mode = mode === 'simple' ? 'simple' : 'basic';
	this.applyLayout();
};

/**
 * Switch the basic window between the search view and the map view
 */
Navigation.setView = function setView(view) {
	_view = view === 'map' ? 'map' : 'search';
	this.applyLayout();
};

Navigation.getMode = function getMode() {
	return _mode;
};

Navigation.getView = function getView() {
	return _view;
};

Navigation.applyLayout = function applyLayout() {
	const root = this.getRoot();
	const wnd = root && root.querySelector('.Navigation');
	if (!wnd) {
		return;
	}
	wnd.classList.toggle('simple', _mode === 'simple');
	wnd.classList.toggle('basic', _mode !== 'simple');
	wnd.classList.toggle('view-map', _view === 'map');
	wnd.classList.toggle('view-search', _view !== 'map');
	this.updateTargetText();
};

/**
 * Simple mode close button: while a route is shown, ask before ending it (MsgStr 2239)
 */
Navigation.onSimpleClose = function onSimpleClose() {
	if (_finalTargetData) {
		UIManager.showPromptBox(msg(2239, 'Still informing! Would you like to quit?'), 'ok', 'cancel', () => {
			this.clear();
			_view = 'search';
			this.applyLayout();
		});
		return;
	}
	_mode = 'basic';
	this.applyLayout();
	this.hide();
};

/**
 * Category combo
 */
Navigation.setSearchType = function setSearchType(type) {
	const entry = SEARCH_TYPES.find(t => t.type === type) || SEARCH_TYPES[0];
	_searchType = entry.type;
	const text = this.getRoot().querySelector('.combo-text');
	if (text) {
		text.textContent = msg(entry.msg, entry.label);
	}
};

Navigation.getSearchType = function getSearchType() {
	return _searchType;
};

/**
 * "Allow zeny for guide" checkbox
 */
Navigation.updateZenyBox = function updateZenyBox() {
	const box = this.getRoot().querySelector('.zeny-box');
	if (!box) {
		return;
	}
	const uri = _allowZeny ? _checkboxOn : _checkboxOff;
	box.style.backgroundImage = uri ? `url(${uri})` : '';
	box.classList.toggle('on', _allowZeny);
};

/**
 * Handle search button click
 */
Navigation.onSearch = function onSearch() {
	const root = this.getRoot();
	const query = root.querySelector('.search-input').value.trim();

	if (query.length < 2) {
		return;
	}

	const results = DB.searchNavigation(query, _searchType) || [];
	this.displaySearchResults(results);
	this.setView('search');
};

/**
 * Fill the result list
 */
Navigation.displaySearchResults = function displaySearchResults(results) {
	const root = this.getRoot();
	const list = root.querySelector('.result-list');

	_results = results;
	_selected = -1;
	_previewData = null;
	list.innerHTML = '';

	for (let i = 0; i < results.length; i++) {
		const row = createRow(LIST_ICONS[results[i].type], results[i].name);
		row.dataset.index = String(i);
		row.title = results[i].mapName || '';
		list.appendChild(row);
	}

	const count = root.querySelector('.result-count');
	if (count) {
		count.textContent = msg(3210, 'Result[%d]').replace('%d', results.length);
	}

	root.querySelector('.info-list').innerHTML = '';
	this.updateTargetButton();
	this.renderPreview();
};

/**
 * Build a list row: icon then text
 */
function createRow(icon, text) {
	const row = document.createElement('div');
	row.className = 'row';
	if (icon) {
		const iconEl = document.createElement('div');
		iconEl.className = 'icon';
		const img = document.createElement('ui-image');
		img.setAttribute('src', icon);
		iconEl.appendChild(img);
		row.appendChild(iconEl);
	}
	row.appendChild(document.createTextNode(text || ''));
	return row;
}

/**
 * Select a result: highlight it, show its map and the route to it
 */
Navigation.selectResult = function selectResult(index) {
	if (!_results[index]) {
		return;
	}
	_selected = index;

	const rows = this.getRoot().querySelectorAll('.result-list .row');
	rows.forEach(row => row.classList.toggle('selected', Number(row.dataset.index) === index));

	this.updateTargetButton();
	this.updateRouteInfo();
	this.loadPreview(_results[index]);
};

Navigation.getSelectedResult = function getSelectedResult() {
	return _results[_selected] || null;
};

Navigation.updateTargetButton = function updateTargetButton() {
	const button = this.getRoot().querySelector('.btn-target');
	if (button) {
		button.toggleAttribute('disabled', _selected < 0);
	}
};

/**
 * Route information list: start, the maps on the way, target
 */
Navigation.updateRouteInfo = function updateRouteInfo() {
	const info = this.getRoot().querySelector('.info-list');
	const result = _results[_selected];
	info.innerHTML = '';
	if (!result) {
		return;
	}

	const currentMap = getCurrentMap();
	const pos = getPlayerPosition();
	info.appendChild(createRow(LIST_ICONS.START, `${currentMap} (${pos.x}, ${pos.y})`));

	const endMap = normalizeMapName(result.mapName);
	const route = MapPathFinder.findPathBetweenMaps(
		currentMap,
		pos.x,
		pos.y,
		endMap,
		result.x,
		result.y,
		_allowZeny ? WARP_TYPES_ZENY : WARP_TYPES
	);

	if (route && route.length > 1) {
		for (let i = 0; i < route.length - 1; i++) {
			info.appendChild(createRow(LIST_ICONS.ROUTE, `${route[i].map} (${route[i].x}, ${route[i].y})`));
		}
	}

	let target = `${result.name}`;
	if (result.x !== null && result.x !== undefined) {
		target += ` ${endMap} (${result.x}, ${result.y})`;
	} else if (result.type !== 'MAP') {
		target += ` ${endMap}`;
	}
	info.appendChild(createRow(LIST_ICONS.TARGET, target));
};

/**
 * Preview: the selected result's map with its destination
 */
Navigation.loadPreview = function loadPreview(result) {
	const mapName = normalizeMapName(result.mapName);
	_previewData = { map: mapName, x: result.x, y: result.y, width: 0, height: 0 };
	const data = _previewData;

	_previewMap.onload = () => this.renderPreview();
	Client.loadFile(minimapPath(mapName), dataURI => {
		if (_previewData === data) {
			_previewMap.src = dataURI || EMPTY_GIF;
		}
	});
	Client.loadFile(gatPath(mapName), gat => {
		if (_previewData === data && gat && gat.width && gat.height) {
			data.width = gat.width;
			data.height = gat.height;
			this.renderPreview();
		}
	});
	this.renderPreview();
};

Navigation.renderPreview = function renderPreview() {
	const ctx = _previewCtx;
	if (!ctx) {
		return;
	}
	ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
	if (!_previewData) {
		return;
	}
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
	if (_previewMap.complete && _previewMap.width) {
		ctx.drawImage(_previewMap, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
	}
	const d = _previewData;
	if (d.width && d.x !== null && d.x !== undefined && _icoDestination.complete && _icoDestination.width) {
		const p = projectToMinimap(d.x, d.y, d.width, d.height, PREVIEW_SIZE);
		ctx.drawImage(_icoDestination, Math.round(p.x - 8), Math.round(p.y - 21));
	}
};

/**
 * "Set as the target": start the route to the selected result and show the map
 */
Navigation.onSetTarget = function onSetTarget() {
	const result = _results[_selected];
	if (!result) {
		return;
	}
	this.navigateToSearchResult(result);
	this.setView('map');
};

/**
 * Navigate to a search result
 */
Navigation.navigateToSearchResult = function navigateToSearchResult(result) {
	if (!result || !result.mapName) {
		return;
	}

	this.targetResult = result;

	const currentPos = getPlayerPosition();

	this.navigateTo({
		startMap: getCurrentMap(),
		startX: currentPos.x,
		startY: currentPos.y,
		endMap: result.mapName,
		endX: result.x,
		endY: result.y,
		displayName: result.name
	});
};

/**
 * Find the closest walkable cell to the given coordinates
 */
Navigation.findClosestWalkableCell = function findClosestWalkableCell(x, y, maxRadius) {
	if (!_mapData || !_mapData.cellTypes) {
		return null;
	}
	if (x >= 0 && x < _mapData.width && y >= 0 && y < _mapData.height) {
		if (_mapData.cellTypes[x + y * _mapData.width] & _mapData.walkableType) {
			return { x: x, y: y };
		}
	}

	maxRadius = maxRadius || 10;
	let radius = 1;
	let bestDistance = Infinity;
	let bestCell = null;

	while (radius <= maxRadius) {
		for (let offsetY = -radius; offsetY <= radius; offsetY++) {
			for (let offsetX = -radius; offsetX <= radius; offsetX++) {
				if (Math.abs(offsetX) !== radius && Math.abs(offsetY) !== radius) {
					continue;
				}

				const cx = x + offsetX;
				const cy = y + offsetY;

				if (cx >= 0 && cx < _mapData.width && cy >= 0 && cy < _mapData.height) {
					if (_mapData.cellTypes[cx + cy * _mapData.width] & _mapData.walkableType) {
						const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
						if (distance < bestDistance) {
							bestDistance = distance;
							bestCell = { x: cx, y: cy };
						}
					}
				}
			}
		}

		if (bestCell) {
			return bestCell;
		}

		radius++;
	}

	return null;
};

/**
 * Load a map for display and pathfinding
 */
Navigation.loadMap = function loadMap(mapName) {
	const mapBaseName = normalizeMapName(mapName).replace(/\..*/, '');
	if (!mapBaseName) {
		return;
	}

	Client.loadFile(minimapPath(mapBaseName), dataURI => {
		_map.src = dataURI || EMPTY_GIF;
	});

	Client.loadFile(gatPath(mapBaseName), gatData => {
		if (gatData && gatData.cells && gatData.width && gatData.height) {
			_mapData.width = gatData.width;
			_mapData.height = gatData.height;
			_mapData.cells = gatData.cells;

			const cellCount = gatData.width * gatData.height;
			const cellTypes = new Uint8Array(cellCount);

			for (let i = 0; i < cellCount; i++) {
				cellTypes[i] = gatData.cells[i * 5 + 4];
			}

			_mapData.cellTypes = cellTypes;
			_mapData.map = mapBaseName;
		}
	});
};

/**
 * End the route
 */
Navigation.clear = function clear() {
	this.clearPath();
	_finalTargetData = null;
	_targetData = null;
	_routeStatus = '';
	this.updateTargetText();
};

Navigation.clearPath = function clearPath() {
	_path = [];
	_lastPathUpdate = 0;
	_pathUpdateLock = false;
};

/**
 * Re-run the route from the player's current position
 */
Navigation.reroute = function reroute() {
	if (!_finalTargetData) {
		return;
	}
	const pos = getPlayerPosition();
	this.navigateTo({
		startMap: getCurrentMap(),
		startX: pos.x,
		startY: pos.y,
		endMap: _finalTargetData.map,
		endX: _finalTargetData.x,
		endY: _finalTargetData.y,
		displayName: _finalTargetData.displayName
	});
};

/**
 * Per-frame update: keep the route current and draw the map view
 */
function renderFrame(tick) {
	const host = Navigation._host;
	if (!host || getComputedStyle(host).display === 'none') {
		return;
	}

	if (_finalTargetData && tick - _lastPathUpdate > _pathUpdateThrottle && !_pathUpdateLock) {
		Navigation.reroute();
		_lastPathUpdate = tick;
	}

	if (_mode === 'basic' && _view === 'map') {
		Navigation.renderCanvas();
	}
}

/**
 * Draw the minimap, the route, the destination and the player
 */
Navigation.renderCanvas = function renderCanvas() {
	const ctx = _mapCtx;
	if (!ctx) {
		return;
	}

	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

	if (_map.complete && _map.width) {
		ctx.drawImage(_map, 0, 0, MAP_SIZE, MAP_SIZE);
	}

	if (!_mapData || !_mapData.width || _mapData.map !== getCurrentMap()) {
		return;
	}

	const project = (x, y) => projectToMinimap(x, y, _mapData.width, _mapData.height, MAP_SIZE);

	// Route
	if (_path && _path.length) {
		ctx.fillStyle = ROUTE_COLOR;
		for (let i = 0; i < _path.length; i++) {
			const p = project(_path[i].x, _path[i].y);
			ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, 2, 2);
		}
	}

	// Destination on this map (bitmap anchored at its bottom point: -8, -21)
	if (_targetData && _icoDestination.complete && _icoDestination.width) {
		const p = project(_targetData.x, _targetData.y);
		ctx.drawImage(_icoDestination, Math.round(p.x - 8), Math.round(p.y - 21));
	}

	// Player
	if (_icoLocation.complete && _icoLocation.width) {
		const pos = getPlayerPosition();
		const p = project(pos.x, pos.y);
		ctx.drawImage(_icoLocation, Math.round(p.x - _icoLocation.width / 2), Math.round(p.y - _icoLocation.height));
	}
};

/**
 * Destination text: the map view's lines, and the simple box's
 */
Navigation.updateTargetText = function updateTargetText() {
	const root = this.getRoot();
	if (!root) {
		return;
	}

	let line1 = '';
	let line2 = '';
	let status = '';

	if (_finalTargetData) {
		line1 = _finalTargetData.displayName || _finalTargetData.map;
		line2 = _finalTargetData.map;
		if (_finalTargetData.x !== null && _finalTargetData.x !== undefined) {
			line2 += ` (${_finalTargetData.x}, ${_finalTargetData.y})`;
		}
		if (_routeStatus === 'found') {
			status = msg(2218, '<< Informing >>');
		} else if (_routeStatus === 'failed') {
			status = msg(3209, 'Location is not available');
		} else {
			status = msg(2219, '<< Searching... >>');
		}
	}

	const set = (selector, text) => {
		const el = root.querySelector(selector);
		if (el) {
			el.textContent = text;
		}
	};
	set('.map-line1', line1);
	set('.map-line2', line2);
	set('.map-status', status);
	set('.simple-line1', line1);
	set('.simple-line2', line2);

	const body = root.querySelector('.simple-body');
	if (body) {
		body.classList.toggle('has-target', !!_finalTargetData);
	}
};

/**
 * Find a path between two points on the current map using a web worker
 */
Navigation.findPath = function findPath(startX, startY, endX, endY) {
	if (!_pathFindingWorker || _pathUpdateLock) {
		return;
	}
	_pathUpdateLock = true;

	const naviLinkTable = DB.getNaviLinkTable();
	const currentMap = getCurrentMap();
	const warps = [];

	if (naviLinkTable && naviLinkTable.length) {
		for (let i = 0; i < naviLinkTable.length; i++) {
			const warp = naviLinkTable[i];
			if (!warp || warp.length < 11) {
				continue;
			}

			const srcMap = warp[0].replace(/\.gat$/, '').toLowerCase();
			const destMap = warp[8].replace(/\.gat$/, '').toLowerCase();

			if (srcMap === currentMap && destMap === currentMap) {
				warps.push({
					id: warp[1],
					type: warp[2],
					srcX: warp[6],
					srcY: warp[7],
					destX: warp[9],
					destY: warp[10]
				});
			}
		}
	}

	_mapData.warps = warps;

	_pathFindingWorker.postMessage({
		type: 'findPath',
		startX: startX,
		startY: startY,
		endX: endX,
		endY: endY,
		mapData: _mapData,
		workerId: _pathFindingWorker.id,
		existingPath: _path
	});
};

/**
 * Toggle the navigation window (show/hide)
 */
Navigation.toggle = function toggle() {
	const hostDisplay = this._host ? getComputedStyle(this._host).display : 'none';
	if (hostDisplay !== 'none') {
		this.hide();
	} else {
		this.show();
	}
};

/**
 * Show the navigation window
 */
Navigation.show = function show() {
	this.clearPath();
	initializePathFindingWorker();

	if (_finalTargetData) {
		this.reroute();
	}

	this.applyLayout();
	this.ui.show();
};

/**
 * Hide the navigation window
 */
Navigation.hide = function hide() {
	this.ui.hide();
	terminatePathFindingWorker();
};

Navigation.onKeyDown = function onKeyDown(event) {
	const hostDisplay = this._host ? getComputedStyle(this._host).display : 'none';
	if ((event.which === KEYS.ESCAPE || event.key === 'Escape') && hostDisplay !== 'none') {
		this.hide();
	}
};

/**
 * Set the destination from a NAVI link ("map,x,y,...")
 */
Navigation.setNaviInfo = function setNaviInfo(naviInfo, displayName) {
	const parts = naviInfo.split(',');
	if (parts.length < 3) {
		return;
	}

	const root = this.getRoot();
	const searchInput = root.querySelector('.search-input');
	if (searchInput) {
		searchInput.value = '';
	}

	const pos = getPlayerPosition();
	this.navigateTo({
		startMap: getCurrentMap(),
		startX: pos.x,
		startY: pos.y,
		endMap: parts[0],
		endX: parseInt(parts[1], 10),
		endY: parseInt(parts[2], 10),
		displayName: displayName
	});
	this.setView('map');
};

/**
 * Wait for map data to be loaded
 */
Navigation.waitForMapData = function waitForMapData(callback) {
	if (!_mapData || _mapData.map !== getCurrentMap()) {
		setTimeout(() => {
			Navigation.waitForMapData(callback);
		}, 100);
	} else {
		callback.call(this);
	}
};

/**
 * Route to a destination, on this map or through the warps to another
 */
Navigation.navigateTo = function navigateTo(options) {
	const startMap = normalizeMapName(options.startMap);
	const endMap = normalizeMapName(options.endMap);
	const displayName = options.displayName;

	if (
		!_finalTargetData ||
		_finalTargetData.map !== endMap ||
		_finalTargetData.x !== options.endX ||
		_finalTargetData.y !== options.endY
	) {
		this.clearPath();
		resetPathFindingWorker();
		_routeStatus = 'searching';
	}

	_finalTargetData = {
		map: endMap,
		x: options.endX,
		y: options.endY,
		displayName: displayName
	};
	this.updateTargetText();

	const path = MapPathFinder.findPathBetweenMaps(
		startMap,
		options.startX,
		options.startY,
		endMap,
		options.endX,
		options.endY,
		_allowZeny ? WARP_TYPES_ZENY : WARP_TYPES
	);

	if (!path || !path.length) {
		_targetData = null;
		_routeStatus = 'failed';
		this.updateTargetText();
		return;
	}

	const target = path[0];

	// A whole map as the destination (Map results): arriving is enough
	if (target.x === null || target.x === undefined) {
		_targetData = null;
		_path = [];
		_routeStatus = startMap === endMap ? 'found' : 'failed';
		this.updateTargetText();
		return;
	}

	this.waitForMapData(function () {
		const walkableCell = this.findClosestWalkableCell(target.x, target.y);

		if (walkableCell) {
			_targetData = {
				x: walkableCell.x,
				y: walkableCell.y,
				map: target.map,
				displayName: displayName
			};
			this.findPath(options.startX, options.startY, _targetData.x, _targetData.y);
		} else {
			_targetData = null;
			_routeStatus = 'failed';
			this.updateTargetText();
		}
	});
};

/**
 * Exposed for tests
 */
Navigation.projectToMinimap = projectToMinimap;

/**
 * Create component and export it
 */
export default UIManager.addComponent(Navigation);
