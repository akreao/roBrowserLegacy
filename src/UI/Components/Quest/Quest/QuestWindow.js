/**
 * UI/Components/Quest/QuestWindow.js
 *
 * Manage interface for Quest Window
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import Preferences from 'Core/Preferences.js';
import Configs from 'Core/Configs.js';
import DB from 'DB/DBManager.js';
import Mouse from 'Controls/MouseEventHandler.js';
import UIManager from 'UI/UIManager.js';
import GUIComponent from 'UI/GUIComponent.js';
import ContextMenu from 'UI/Components/ContextMenu/ContextMenu.js';
import htmlText from './QuestWindow.html?raw';
import cssText from './QuestWindow.css?raw';

const _preferences = Preferences.get(
	'Quest',
	{
		x: 200,
		y: 200,
		show: false,
		showwindow: true
	},
	1.0
);

/**
 * `legacyQuestTracker: true` keeps roBrowser's own tracker: four quests, and hunts
 * counted as "n / m" to the end.
 */
const isLegacy = () => !!Configs.get('legacyQuestTracker', false);

/**
 * The official tracker (UIQuestDisplay::vf17 @0xaf58a0) stops after the fifth quest.
 */
const maxQuests = () => (isLegacy() ? 4 : 5);

/**
 * Create Component
 */
const QuestWindow = new GUIComponent('QuestWindow', cssText);

QuestWindow.render = () => htmlText;

/**
 * Mouse can cross this UI
 */
QuestWindow.mouseMode = GUIComponent.MouseMode.CROSS;

/**
 * Initialize the component (event listener, etc.)
 */
QuestWindow.init = function init() {
	const ul = this.getRoot().querySelector('.quest-window-ul');

	// A right click on a quest's title opens the official menu (UIQuestDisplay::vf30
	// @0xaf7970, vf34 @0xaf8dc0): "Shows Quest information" and "Delete".
	ul.addEventListener('mousedown', event => {
		const title = event.target.closest('.quest-window-li-title');
		if (!title || event.button !== 2) {
			return;
		}
		// Keep the map from turning the camera on this right click.
		event.stopPropagation();
		const quest = _shown[title.dataset.index];
		if (quest) {
			openMenu(quest, event);
		}
	});
};

/**
 * Quests drawn in the tracker, in order
 */
let _shown = [];

/**
 * Open the right-click menu of a quest
 *
 * @param {object} quest
 * @param {MouseEvent} event
 */
function openMenu(quest, event) {
	Mouse.screen.x = event.pageX || event.clientX;
	Mouse.screen.y = event.pageY || event.clientY;

	ContextMenu.remove();
	ContextMenu.append();
	ContextMenu.addElement(DB.getMessage(1622, 'Shows Quest information'), () => {
		QuestWindow.onShowInfo(quest);
	});
	ContextMenu.addElement(DB.getMessage(351, 'Delete'), () => {
		QuestWindow.onDelete(quest);
	});
}

/**
 * Callback: open the quest's detail window
 *
 * @param {object} quest
 */
QuestWindow.onShowInfo = function onShowInfo() {};

/**
 * Callback: take the quest off the active list (CZ_ACTIVE_QUEST, active = 0)
 *
 * @param {object} quest
 */
QuestWindow.onDelete = function onDelete() {};

/**
 * Once append to the DOM, start to position the UI
 */
QuestWindow.onAppend = function onAppend() {
	if (!_preferences.showwindow) {
		this.ui.hide();
	}
};

/**
 * Clean up UI
 */
QuestWindow.clean = function clean() {
	QuestWindow.ui.hide();
};

/**
 * Set Quest list
 *
 * @param {Array} quests
 */
QuestWindow.setQuestList = function setQuestList(quests, questNotShowList) {
	let already_show = 0;
	for (const questID in quests) {
		if (!questNotShowList.includes(quests[questID].questID)) {
			if (!isInCooldown(quests[questID])) {
				if (quests[questID].active == 1 && already_show < maxQuests()) {
					QuestWindow.addQuestToUI(quests[questID]);
					already_show++;
				}
			}
		}
	}
};

function isInCooldown(quest) {
	if (quest.end_time == 0) {
		return false;
	}
	const epoch_seconds = new Date() / 1000;
	if (quest.end_time > epoch_seconds) {
		return true;
	}
	return false;
}

QuestWindow.ClearQuestList = function ClearQuestList() {
	const root = this.getRoot();
	if (!root) {
		return;
	}
	const ul = root.querySelector('.quest-window-ul');
	if (ul) {
		ul.innerHTML = '';
	}
	_shown = [];
};

QuestWindow.addQuestToUI = function addQuestToUI(quest) {
	const root = this.getRoot();
	if (!root) {
		return;
	}
	const title = quest.title.length > 25 ? `${quest.title.substr(0, 25)}...` : quest.title;
	const summary = quest.summary.length > 25 ? `${quest.summary.substr(0, 25)}...` : quest.summary;
	let list = '';
	for (const huntID in quest.hunt_list) {
		list += `<li>${huntLine(quest.hunt_list[huntID])}</li>`;
	}
	const ul = root.querySelector('.quest-window-ul');
	if (ul) {
		ul.insertAdjacentHTML(
			'beforeend',
			`<li class="quest-window-li"> <div class="quest-window-li-title" data-index="${_shown.length}">${title}</div> <div class="quest-window-li-summary">${summary}</div> <div class="quest-window-li-monster"><ul>${list}</ul></div> </li>`
		);
		_shown.push(quest);
	}
};

/**
 * One hunt line: "name ( n / m )", or "name ( Complete )" once done (MsgStr 2030)
 *
 * @param {object} hunt
 * @return {string}
 */
function huntLine(hunt) {
	if (!isLegacy() && hunt.maxCount > 0 && hunt.huntCount >= hunt.maxCount) {
		return `${hunt.mobName} ( ${DB.getMessage(2030, 'Complete')} )`;
	}
	return `${hunt.mobName} ( ${hunt.huntCount} / ${hunt.maxCount} )`;
}

/**
 * Export
 */
export default UIManager.addComponent(QuestWindow);
