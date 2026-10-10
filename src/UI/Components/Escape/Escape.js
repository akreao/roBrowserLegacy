/**
 * UI/Components/Escape/Escape.js
 *
 * Game Escape window, manage options
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import KEYS from 'Controls/KeyEventHandler.js';
import Renderer from 'Renderer/Renderer.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import ExitHooks from 'UI/ExitHooks.js';
import MenuHooks from 'UI/MenuHooks.js';
import SoundOption from 'UI/Components/SoundOption/SoundOption.js';
import GraphicsOption from 'UI/Components/GraphicsOption/GraphicsOption.js';
import ShortCutOption from 'UI/Components/ShortCutOption/ShortCutOption.js';
import DB from 'DB/DBManager.js';
import Configs from 'Core/Configs.js';
import htmlText from './Escape.html?raw';
import cssText from './Escape.css?raw';

/**
 * Create Escape window component
 */
const Escape = new GUIComponent('Escape', cssText);

/**
 * `legacyEscapeMenu: true` keeps roBrowser's own menu: separate Graphics and Sound
 * buttons, the older exit and save point pictures, no question before returning to
 * the save point, and character select and exit still shown on the death menu.
 */
const isLegacy = () => !!Configs.get('legacyEscapeMenu', false);

/**
 * The buttons of the normal menu, hidden on the death menu. The official death menu
 * (UIEscOptionWnd mode 1 and 2) keeps only Resurrection, Return to save point and
 * Return to game.
 */
const normalButtons = () =>
	isLegacy() ? '.graphics, .sound, .hotkey, .hooked' : '.charselect, .settings, .hotkey, .exit, .hooked';

/**
 * Render HTML: the official exit (esc_09) and save point (esc_10) pictures, or the
 * older ones (esc_03, esc_04) with the legacy menu
 */
Escape.render = () => (isLegacy() ? htmlText.replace(/esc_09/g, 'esc_03').replace(/esc_10/g, 'esc_04') : htmlText);

/**
 * Initialize UI
 */
Escape.init = function init() {
	const root = this.getRoot();
	const rect = this._host.getBoundingClientRect();
	this._host.style.top = (Renderer.height - rect.height) * 0.75 + 'px';
	this._host.style.left = (Renderer.width - rect.width) * 0.5 + 'px';
	this.draggable();

	const nodeBtn = root.querySelector('.node');
	if (nodeBtn) {
		nodeBtn.addEventListener('mousedown', function (event) {
			event.stopImmediatePropagation();
			return false;
		});
	}

	// Only used in specific case
	root.querySelectorAll('button').forEach(function (el) {
		el.style.display = '';
	});
	root.querySelectorAll('.resurection, .savepoint').forEach(function (el) {
		el.style.display = 'none';
	});

	if (isLegacy()) {
		root.querySelector('.settings').remove();
		root.querySelector('.sound').addEventListener('click', onToggleSoundUI);
		root.querySelector('.graphics').addEventListener('click', onToggleGraphicUI);
	} else {
		root.querySelectorAll('.graphics, .sound').forEach(el => el.remove());
		root.querySelector('.settings').addEventListener('click', onToggleSettingsUI);
	}
	root.querySelector('.resurection').addEventListener('click', function () {
		Escape.onResurectionRequest();
	});
	root.querySelector('.savepoint').addEventListener('click', onSavePoint);
	root.querySelector('.charselect').addEventListener('click', function () {
		ExitHooks.emit('charSelect', 'escape');
		Escape.onCharSelectionRequest();
	});
	root.querySelector('.hotkey').addEventListener('click', onToggleShortcutUI);
	root.querySelector('.exit').addEventListener('click', function () {
		ExitHooks.emit('login', 'escape');
		Escape.onExitRequest();
	});
	root.querySelector('.cancel').addEventListener('click', function () {
		Escape._host.style.display = 'none';
	});

	// Buttons added by plugins (UI/MenuHooks.js)
	renderHookedButtons();
	MenuHooks.onChange(renderHookedButtons);

	// Start hidden
	this._host.style.display = 'none';
};

/**
 * Window must not be visible once append
 * but need to be here to manage key event
 */
Escape.onAppend = function onAppend() {
	this._host.style.display = 'none';
};

/**
 * Reset buttons once UI is removed
 */
Escape.onRemove = function onRemove() {
	this._host.style.display = 'none';
	const root = this.getRoot();
	root.querySelectorAll('.resurection, .savepoint').forEach(function (el) {
		el.style.display = 'none';
	});
	root.querySelectorAll(normalButtons()).forEach(function (el) {
		el.style.display = '';
	});
};

/**
 * Key Listener
 *
 * @param {object} event
 * @return {boolean}
 */
Escape.onKeyDown = function onKeyDown(event) {
	if (event.which === KEYS.ESCAPE || event.key === 'Escape') {
		if (this._host.style.display === 'none') {
			this._host.style.display = '';
			this.focus();
		} else {
			this._host.style.display = 'none';
		}
	}
};

/**
 * Click on the game settings button: the official client opens one settings window
 * (UIGraphicSettingWnd) holding the graphics and the sound settings, which roBrowser
 * draws as two windows. Both open and close together.
 */
function onToggleSettingsUI() {
	const open = [GraphicsOption, SoundOption].some(ui => ui._host && ui._host.parentNode);
	[GraphicsOption, SoundOption].forEach(ui => {
		const shown = ui._host && ui._host.parentNode;
		if (open && shown) {
			ui.remove();
		} else if (!open && !shown) {
			ui.append();
		}
	});
}

/**
 * Click on Sound button, toggle the UI (legacy menu)
 */
function onToggleSoundUI() {
	if (!SoundOption._host || !SoundOption._host.parentNode) {
		SoundOption.append();
	} else {
		SoundOption.remove();
	}
}

/**
 * Click on Graphic button, toggle the UI (legacy menu)
 */
function onToggleGraphicUI() {
	if (!GraphicsOption._host || !GraphicsOption._host.parentNode) {
		GraphicsOption.append();
	} else {
		GraphicsOption.remove();
	}
}

/**
 * Click on Return to save point: the official client asks first (MsgStr 1548).
 */
function onSavePoint() {
	if (isLegacy()) {
		Escape.onReturnSavePointRequest();
		return;
	}
	UIManager.showPromptBox(DB.getMessage(1548), 'ok', 'cancel', function () {
		Escape.onReturnSavePointRequest();
	});
}

/**
 * Click on Shortcut button, toggle the UI
 */
function onToggleShortcutUI() {
	if (!ShortCutOption._host || !ShortCutOption._host.parentNode) {
		ShortCutOption.append();
	} else {
		ShortCutOption.remove();
	}
}

/**
 * Show death menu (called when player dies)
 */
Escape.showDeathMenu = function showDeathMenu(hasSiegfried) {
	const root = this.getRoot();
	this._host.style.display = '';
	root.querySelector('.savepoint').style.display = '';
	if (hasSiegfried) {
		root.querySelector('.resurection').style.display = '';
	}
	root.querySelectorAll(normalButtons()).forEach(function (el) {
		el.style.display = 'none';
	});
};

/**
 * Reset to normal menu (called when player resurrects)
 */
Escape.resetMenu = function resetMenu() {
	this._host.style.display = 'none';
	const root = this.getRoot();
	root.querySelectorAll('.resurection, .savepoint').forEach(function (el) {
		el.style.display = 'none';
	});
	root.querySelectorAll(normalButtons()).forEach(function (el) {
		el.style.display = '';
	});
};

/**
 * Draw the buttons plugins added (UI/MenuHooks.js) after the settings buttons,
 * from their own pictures, the way the menu's buttons are drawn. Hidden with
 * the settings buttons while the death menu shows.
 */
function renderHookedButtons() {
	const root = Escape.getRoot();
	const exit = root.querySelector('.exit');
	if (!exit) {
		return;
	}
	root.querySelectorAll('.hooked').forEach(el => el.remove());

	const settingsShown = root.querySelector(isLegacy() ? '.graphics' : '.settings')?.style.display !== 'none';
	MenuHooks.list().forEach(button => {
		const el = document.createElement('button');
		el.className = 'hooked';
		el.dataset.background = button.background;
		if (button.hover) {
			el.dataset.hover = button.hover;
		}
		if (button.down) {
			el.dataset.down = button.down;
		}
		if (button.title) {
			el.title = button.title;
			el.setAttribute('aria-label', button.title);
		}
		el.style.display = settingsShown ? '' : 'none';
		el.addEventListener('click', () => MenuHooks.press(button));
		GUIComponent.processDataAttrs(el);
		exit.before(el);
	});
}

/**
 * @var {function} callback when player want to resurect using Token of Siegfried
 */
Escape.onResurectionRequest = function onResurectionRequest() {};

/**
 * @var {function} callback to define to disconnect from game
 */
Escape.onExitRequest = function onExitRequest() {};

/**
 * @var {function} callback when player want to resurect using Token of Siegfried
 */
Escape.onReturnSavePointRequest = function onReturnSavePointRequest() {};

/**
 * @var {function} callback when player want to return to char selection
 */
Escape.onCharSelectionRequest = function onCharSelectionRequest() {};

Escape.mouseMode = GUIComponent.MouseMode.STOP;
Escape.needFocus = true;

/**
 * Create component and export it
 */
export default UIManager.addComponent(Escape);
