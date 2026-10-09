/**
 * Engine/MapEngine/EntryQueue.js
 *
 * Battleground queue (entry queue), as the official client handles it
 * (kRO RagexeRE 2020-12-29, CEntryQueueMgr and Recv_0x08D8..0x090E)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Sound from 'Audio/SoundManager.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import UIManager from 'UI/UIManager.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import EntryQueue from 'UI/Components/EntryQueue/EntryQueue.js';
import EntryQueueStandBy from 'UI/Components/EntryQueue/EntryQueueStandBy.js';
import EntryQueueRequest from 'UI/Components/EntryQueue/EntryQueueRequest.js';

/**
 * Chat colours of the official notices
 */
const COLOR_NOTICE = '#ff6347';
const COLOR_CANCEL = '#ff0000';
const COLOR_ENTER = '#ffff64';

/**
 * Message for each failed ZC_ACK_ENTRY_QUEUE_APPLY result
 */
const APPLY_FAILED = {
	2: [2100, 'Queuing has finished.'],
	3: [2101, 'Invalid battleground name.'],
	4: [2102, 'Invalid application.'],
	5: [2103, 'Too many players in your party or guild.'],
	6: [2104, 'Your level does not meet the requirement.'],
	7: [2105, 'You have already applied.'],
	8: [2106, 'Please reconnect, then apply.'],
	9: [2108, 'Only a party or guild leader can apply.'],
	10: [2107, 'Your class cannot apply.'],
	15: [2109, 'You cannot apply.']
};

/**
 * Message for each ZC_ACK_ENTRY_QUEUE_CANCEL result that shows one
 */
const CANCEL_RESULT = {
	1: [2110, 'You have left the queue.'],
	3: [2111, 'You cannot leave the queue now.'],
	11: [2112, 'You cannot leave the queue now.'],
	14: [2113, 'You cannot leave the queue now.']
};

/**
 * The queue the player is in, or has selected (CEntryQueueMgr)
 */
const _state = {
	entry: null, // the battleground, from DB.getEntryQueueList()
	inQueue: false,
	queueName: '', // as the lobby notice named it
	lobbyName: ''
};

/**
 * The battleground's name as players read it
 *
 * @param {string} name - as the server knows it
 * @return {string}
 */
function displayName(name) {
	const entry = _state.entry || DB.getEntryQueueByName(name);
	return entry ? entry.displayName || entry.name : name;
}

/**
 * The official client prefixes queue notices with the battleground's name
 *
 * @param {string} name - battleground, as the server knows it
 * @param {number} msgId
 * @param {string} fallback
 * @param {string} color
 */
function notice(name, msgId, fallback, color) {
	ChatBox.addText(
		`[${displayName(name)}] ${DB.getMessage(msgId, fallback)}`,
		ChatBox.TYPE.INFO,
		ChatBox.FILTER.PUBLIC_LOG,
		color
	);
}

/**
 * @param {Array} msg - [msgstringtable id, fallback]
 */
function popup([msgId, fallback]) {
	UIManager.showMessageBox(DB.getMessage(msgId, fallback), 'ok');
}

/**
 * Answer to an application
 *
 * @param {object} pkt - PACKET.ZC.ACK_ENTRY_QUEUE_APPLY
 */
function onApplyResult(pkt) {
	if (pkt.Result === 1) {
		if (!EntryQueueStandBy.__active) {
			EntryQueueStandBy.append();
		}
		Sound.play('se_btg_request.wav');
		notice(pkt.EntryQueueName, 2099, 'You have applied for the battleground.', COLOR_NOTICE);
		_state.inQueue = true;
		return;
	}

	if (APPLY_FAILED[pkt.Result]) {
		popup(APPLY_FAILED[pkt.Result]);
	}
}

/**
 * Place in the queue, sent when it starts and when asked again
 *
 * @param {object} pkt - PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY
 */
function onQueueNotify(pkt) {
	_state.inQueue = true;

	if (!_state.entry) {
		_state.entry = DB.getEntryQueueByName(pkt.EntryQueueName);
	}

	if (!EntryQueueStandBy.__active) {
		EntryQueueStandBy.append();
	}

	const entry = _state.entry;
	EntryQueueStandBy.setQueue(pkt.EntryQueueName, entry ? entry.teamA + entry.teamB : 0, pkt.Ranking);

	if (EntryQueue.__active) {
		EntryQueue.remove();
	}
}

/**
 * Answer to leaving the queue
 *
 * @param {object} pkt - PACKET.ZC.ACK_ENTRY_QUEUE_CANCEL
 */
function onCancelResult(pkt) {
	const msg = CANCEL_RESULT[pkt.Result];

	if (msg) {
		popup(msg);
	}

	// Only these close the waiting window and take the player out of the queue
	if (pkt.Result === 1 || pkt.Result === 14) {
		if (EntryQueueStandBy.__active) {
			EntryQueueStandBy.remove();
		}
		_state.inQueue = false;
	}

	notice(pkt.EntryQueueName, 2114, 'You are no longer in the queue.', COLOR_CANCEL);
	_state.entry = null;
}

/**
 * The battleground is ready: enter or decline
 *
 * @param {object} pkt - PACKET.ZC.NOTIFY_LOBBY_ADMISSION
 */
function onLobbyAdmission(pkt) {
	_state.queueName = pkt.EntryQueueName;
	_state.lobbyName = pkt.LobbyName;

	if (EntryQueueRequest.__active) {
		return;
	}

	EntryQueueRequest.append();
	EntryQueueRequest.setName(displayName(pkt.EntryQueueName));
	Sound.play('se_btg_ready.wav');
	notice(pkt.EntryQueueName, 2115, 'The battleground is ready.', COLOR_NOTICE);
}

/**
 * Someone accepted to enter the battleground
 *
 * @param {object} pkt - PACKET.ZC.REPLY_ACK_LOBBY_ADMISSION
 */
function onLobbyAdmissionAck(pkt) {
	if (pkt.Result === 1) {
		Sound.play('se_btg_forward.wav');
	}
}

/**
 * The player joined a battleground, or declined: the queue is forgotten
 */
function onQueueInit() {
	_state.entry = null;
	_state.inQueue = false;
}

/**
 * The menu's battle button: the place in the queue, or the list of battlegrounds
 */
EntryQueue.onMenuButton = function onMenuButton() {
	if (_state.inQueue && _state.entry) {
		const pkt = new PACKET.CZ.REQ_ENTRY_QUEUE_RANKING();
		pkt.EntryQueueName = _state.entry.name;
		Network.sendPacket(pkt);
		return;
	}
	EntryQueue.toggle();
};

EntryQueue.onSelect = function onSelect(entry) {
	_state.entry = entry;
};

EntryQueue.onApply = function onApply(type, entry) {
	const pkt = new PACKET.CZ.REQ_ENTRY_QUEUE_APPLY();
	pkt.ApplyType = type;
	pkt.EntryQueueName = entry.name;
	Network.sendPacket(pkt);
};

EntryQueueStandBy.onCancel = function onCancel() {
	if (!_state.entry) {
		return;
	}
	const pkt = new PACKET.CZ.REQ_ENTRY_QUEUE_CANCEL();
	pkt.EntryQueueName = _state.entry.name;
	Network.sendPacket(pkt);
};

EntryQueueRequest.onAnswer = function onAnswer(accept) {
	const pkt = new PACKET.CZ.REPLY_LOBBY_ADMISSION();
	pkt.Result = accept ? 1 : 2;
	pkt.EntryQueueName = _state.entry ? _state.entry.name : _state.queueName;
	pkt.LobbyName = _state.lobbyName;
	Network.sendPacket(pkt);

	if (!accept) {
		_state.inQueue = false;
	}

	if (EntryQueueStandBy.__active) {
		EntryQueueStandBy.remove();
	}

	if (accept) {
		ChatBox.addText(
			DB.getMessage(2132, 'Entering the battleground.'),
			ChatBox.TYPE.INFO,
			ChatBox.FILTER.PUBLIC_LOG,
			COLOR_ENTER
		);
	}
};

/**
 * @return {object} the queue state, for tests
 */
export function getEntryQueueState() {
	return _state;
}

/**
 * Initialize
 */
export default function EntryQueueEngine() {
	onQueueInit();

	Network.hookPacket(PACKET.ZC.ACK_ENTRY_QUEUE_APPLY, onApplyResult);
	Network.hookPacket(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, onQueueNotify);
	Network.hookPacket(PACKET.ZC.ACK_ENTRY_QUEUE_CANCEL, onCancelResult);
	Network.hookPacket(PACKET.ZC.NOTIFY_LOBBY_ADMISSION, onLobbyAdmission);
	Network.hookPacket(PACKET.ZC.REPLY_ACK_LOBBY_ADMISSION, onLobbyAdmissionAck);
	Network.hookPacket(PACKET.ZC.ENTRY_QUEUE_INIT, onQueueInit);
}
