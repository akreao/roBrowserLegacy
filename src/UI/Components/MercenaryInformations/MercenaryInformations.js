/**
 * UI/Components/MercenaryInformations/MercenaryInformations.js
 *
 * Display mercenary information
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Client from 'Core/Client.js';
import Preferences from 'Core/Preferences.js';
import Renderer from 'Renderer/Renderer.js';
import EntityManager from 'Renderer/EntityManager.js';
import KEYS from 'Controls/KeyEventHandler.js';
import Session from 'Engine/SessionStorage.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import SkillListMH from 'UI/Components/SkillListMH/SkillListMH.js';
import AIDriver from 'Core/AIDriver.js';
import 'UI/Elements/Elements.js';
import htmlText from './MercenaryInformations.html?raw';
import cssText from './MercenaryInformations.css?raw';

/**
 * Create Component
 */
const MercenaryInformations = new GUIComponent('MercenaryInformations', cssText);

MercenaryInformations.render = () => htmlText;

/**
 * @var {Preferences}
 */
const _preferences = Preferences.get(
	'MercenaryInformations',
	{
		x: 100,
		y: 100,
		show: false,
		reduce: false
	},
	1.0
);

/**
 * Initialize UI
 */
MercenaryInformations.init = function init() {
	const root = MercenaryInformations.getRoot();

	this.draggable('.content');

	const contentEl = root.querySelector('.content');
	if (contentEl) {
		contentEl.addEventListener('mousedown', e => {
			e.stopImmediatePropagation();
		});
	}

	const baseEl = root.querySelector('.content .base');
	if (baseEl) {
		baseEl.addEventListener('mousedown', e => {
			e.stopImmediatePropagation();
		});
	}

	const closeBtn = root.querySelector('.close');
	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			this._host.style.display = 'none';
			SkillListMH.mercenary.ui.hide();
		});
	}

	const dismissBtn = root.querySelector('.dismiss');
	if (dismissBtn) {
		dismissBtn.addEventListener('click', () => {
			MercenaryInformations.reqDeleteMercenary();
		});
	}

	if (!_preferences.show) {
		this._host.style.display = 'none';
	}

	const skillBtn = root.querySelector('.skill');
	if (skillBtn) {
		skillBtn.addEventListener('mousedown', () => {
			SkillListMH.mercenary.toggle();
		});
	}

	// If no aggressive level defined, default to 1
	// otherwise toggle and untoggle to remain the same
	this.toggleAggressive();
	this.toggleAggressive();
};

/**
 * Once append to body
 */
MercenaryInformations.onAppend = function onAppend() {
	if (!_preferences.show) {
		this._host.style.display = 'none';
	}

	this._host.style.top = `${Math.min(Math.max(0, _preferences.y), Renderer.height - this._host.getBoundingClientRect().height)}px`;
	this._host.style.left = `${Math.min(Math.max(0, _preferences.x), Renderer.width - this._host.getBoundingClientRect().width)}px`;
};

/**
 * Once remove from body
 */
MercenaryInformations.onRemove = function onRemove() {
	_preferences.show = this._host.style.display !== 'none';
	_preferences.y = parseInt(this._host.style.top, 10);
	_preferences.x = parseInt(this._host.style.left, 10);
	_preferences.save();
	this.stopAI();
};

/**
 * Process shortcut
 *
 * @param {object} key
 */
MercenaryInformations.onShortCut = function onShortCut(key) {
	switch (key.cmd) {
		case 'TOGGLE':
			if (Session.mercId) {
				if (this._host.style.display === 'none') {
					this._host.style.display = '';
					this.focus();
				} else {
					this._host.style.display = 'none';
					SkillListMH.mercenary.ui.hide();
				}
			} else {
				SkillListMH.mercenary.ui.hide();
				this._host.style.display = 'none';
			}
			break;
		case 'AGGRESSIVE':
			this.toggleAggressive();
			break;
	}
};

/**
 * Process key down
 *
 * @param {object} event
 */
MercenaryInformations.onKeyDown = function onKeyDown(event) {
	if ((event.which === KEYS.ESCAPE || event.key === 'Escape') && this._host.style.display !== 'none') {
		this._host.style.display = 'none';
	}
};

/**
 * Format the contract end the way the official window does (MsgStr 1260,
 * "%m/%d %H:%M", local time)
 * @param {number} timestamp - Unix time the contract ends
 * @returns {string} formatted date
 */
MercenaryInformations.formatExpireDate = function formatExpireDate(timestamp) {
	if (!timestamp) {
		return '';
	}

	const date = new Date(timestamp * 1000);
	const pad = n => String(n).padStart(2, '0');
	const fields = {
		m: pad(date.getMonth() + 1),
		d: pad(date.getDate()),
		H: pad(date.getHours()),
		M: pad(date.getMinutes())
	};

	return DB.getMessage(1260, '%m/%d %H:%M').replace(/%([mdHM])/g, (_, k) => fields[k]);
};

/**
 * Set the contract end date
 * @param {number} timestamp - Unix time the contract ends
 */
MercenaryInformations.setExpiration = function setExpiration(timestamp) {
	const el = MercenaryInformations.getRoot().querySelector('.block2 .expire');
	if (el) {
		el.textContent = this.formatExpireDate(timestamp);
	}
};

/**
 * Set monster kills
 * @param {number} kills - Number of monsters killed
 */
MercenaryInformations.setKills = function setKills(kills) {
	const el = MercenaryInformations.getRoot().querySelector('.block2 .kills');
	if (el) {
		el.textContent = kills;
	}
};

/**
 * Set how many times this mercenary type was summoned
 * @param {number} calls - Summon count
 */
MercenaryInformations.setCalls = function setCalls(calls) {
	const el = MercenaryInformations.getRoot().querySelector('.block2 .calls');
	if (el) {
		el.textContent = calls;
	}
};

/**
 * Update UI with mercenary data
 */
MercenaryInformations.setInformations = function setInformations(info) {
	const root = MercenaryInformations.getRoot();

	const nameEl = root.querySelector('.name');
	if (nameEl) {
		nameEl.textContent = info.name || '';
	}

	const levelEl = root.querySelector('.level');
	if (levelEl) {
		levelEl.textContent = info.level || '';
	}

	// Stats
	const statFields = ['atk', 'Matk', 'hit', 'critical', 'def', 'Mdef', 'flee', 'aspd'];
	for (const field of statFields) {
		const el = root.querySelector(`.stats .${field}`);
		if (el) {
			el.textContent = info[field] || 0;
		}
	}

	// HP/SP
	this.setHpSpBar('hp', info.hp, info.maxHP);
	this.setHpSpBar('sp', info.sp, info.maxSP);

	// Additional Info
	this.setExpiration(info.ExpireDate);
	this.setFaith(info.faith || 0);
	this.setCalls(info.toal_call_num || 0);
	this.setKills(info.approval_monster_kill_counter || 0);

	SkillListMH.mercenary.setPoints(info.SKPoint);
};

/**
 * Set hp and sp bar
 */
MercenaryInformations.setHpSpBar = function setHpSpBar(type, val, val2) {
	const root = MercenaryInformations.getRoot();
	const perc = Math.floor((val * 100) / val2);
	const color = perc < 25 ? 'red' : 'blue';

	const valueEl = root.querySelector(`.${type}_bar_perc .${type}_value`);
	if (valueEl) {
		valueEl.textContent = val;
	}

	const maxValueEl = root.querySelector(`.${type}_bar_perc .${type}_max_value`);
	if (maxValueEl) {
		maxValueEl.textContent = val2;
	}

	const summaryEl = root.querySelector(`.${type}2`);
	if (summaryEl) {
		summaryEl.textContent = `${val} / ${val2}`;
	}

	Client.loadFile(DB.INTERFACE_PATH + `basic_interface/gze${color}_left.bmp`, function (url) {
		const el = root.querySelector(`.${type}_bar_left`);
		if (el) {
			el.style.backgroundImage = `url(${url})`;
		}
	});

	Client.loadFile(DB.INTERFACE_PATH + `basic_interface/gze${color}_mid.bmp`, function (url) {
		const el = root.querySelector(`.${type}_bar_middle`);
		if (el) {
			Object.assign(el.style, {
				backgroundImage: `url(${url})`,
				width: `${Math.floor(Math.min(perc, 100) * 0.75)}px`
			});
		}
	});

	Client.loadFile(DB.INTERFACE_PATH + `basic_interface/gze${color}_right.bmp`, function (url) {
		const el = root.querySelector(`.${type}_bar_right`);
		if (el) {
			Object.assign(el.style, {
				backgroundImage: `url(${url})`,
				left: `${Math.floor(Math.min(perc, 100) * 1.27)}px`
			});
		}
	});
};

/**
 * Toggle Aggressive
 */
MercenaryInformations.toggleAggressive = function toggleAggressive() {
	const agr = localStorage.getItem('MER_AGGRESSIVE') === 0 ? 1 : 0;
	localStorage.setItem('MER_AGGRESSIVE', agr);
	AIDriver.MER_AGGRESSIVE = !AIDriver.MER_AGGRESSIVE;
};

/**
 * Start AI
 */
MercenaryInformations.startAI = function startAI() {
	if (!this.AILoop) {
		AIDriver.reset();
		this.AILoop = setInterval(() => {
			if (Session.mercId) {
				const entity = EntityManager.get(Session.mercId);
				if (entity) {
					AIDriver.exec(`AI(${Session.mercId})`, false);
				}
			}
		}, 100);
	}
};

/**
 * Stop AI
 */
MercenaryInformations.stopAI = function stopAI() {
	if (this.AILoop) {
		this.AILoop = clearInterval(this.AILoop);
	}
};

/**
 * Reset AI
 */
MercenaryInformations.resetAI = function resetAI() {
	this.stopAI();
	this.startAI();
};

/**
 * Set target for mercenary to attack
 */
MercenaryInformations.setTarget = function setTarget(targetId) {
	const entity = EntityManager.get(Session.mercId);
	if (!entity) {
		return;
	}

	entity.targetId = targetId;
};

/**
 * Set faith value
 */
MercenaryInformations.setFaith = function setFaith(faith) {
	const root = MercenaryInformations.getRoot();
	const el = root.querySelector('.block2 .faith');
	if (el) {
		el.textContent = faith;
	}
};

/**
 * Functions defined in Engine/MapEngine/Mercenary.js
 */
MercenaryInformations.reqDeleteMercenary = function reqDeleteMercenary() {};
MercenaryInformations.reqAttack = function reqAttack() {};
MercenaryInformations.reqMoveTo = function reqMoveTo() {};
MercenaryInformations.reqMoveToOwner = function reqMoveToOwner() {};

/**
 * Export
 */
export default UIManager.addComponent(MercenaryInformations);
