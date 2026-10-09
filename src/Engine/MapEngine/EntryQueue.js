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
	2: [2100, 'the maximum amount has been exceeded.'],
	3: [2101, 'Undefined battleground name.'],
	4: [2102, 'Undefined request type.'],
	5: [2103, 'Maximum amount of users has been exceeded.'],
	6: [2104, 'The level is not suitable to enter.'],
	7: [2105, 'Request has duplicated.'],
	8: [2106, 'Please re-access and register again.'],
	9: [2108, 'Only party member or guild leader can apply.'],
	10: [2107, 'Job is not suitable.'],
	15: [2109, 'there is already a team member in the battleground, it is not possible to apply.']
};

/**
 * Message for each ZC_ACK_ENTRY_QUEUE_CANCEL result that shows one
 */
const CANCEL_RESULT = {
	1: [2110, 'The battleground queue has been cancelled.'],
	3: [2111, 'The battleground name is wrong.'],
	11: [2112, 'You are not on the waiting list of entering the battleground.'],
	14: [2113, 'The battleground is not availble, the queue will now be cancelled.']
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
		notice(pkt.EntryQueueName, 2099, 'You have requested to enter the battleground queue.', COLOR_NOTICE);
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

	notice(pkt.EntryQueueName, 2114, 'Entering the battleground has cancelled.', COLOR_CANCEL);
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
	notice(pkt.EntryQueueName, 2115, 'Would you like to enter the battleground?', COLOR_NOTICE);
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
			DB.getMessage(2132, 'Waiting for other requests results.'),
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
