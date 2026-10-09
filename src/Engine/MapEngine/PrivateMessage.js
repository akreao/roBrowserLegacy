/**
 * Engine/MapEngine/PrivateMessage.js
 *
 * Manage Entity based on received packets from server
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

import DB from 'DB/DBManager.js';
import Friends from 'Engine/MapEngine/Friends.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import WhisperBox from 'UI/Components/WhisperBox/WhisperBox.js';
import Session from 'Engine/SessionStorage.js';
import PACKETVER from 'Network/PacketVerManager.js';

/**
 * Check if WhisperBox should be used for a specific nickname
 *
 * @param {string} nickname
 * @returns {boolean}
 */
function getShouldOpenWhisperBox(nickname) {
	if (PACKETVER.value < 20090617) {
		return false;
	}

	if (WhisperBox.instances[nickname]) {
		return true;
	}

	const prefs = WhisperBox.preferences;

	const isFriend = Friends.isFriend(nickname);
	return (isFriend && prefs.open1to1Friend) || (!isFriend && prefs.open1to1Stranger);
}

/**
 * Main Player received PM
 *
 * @param {object} pkt - PACKET.ZC.WHISPER
 */
function onPrivateMessage(pkt) {
	const isFriend = Friends.isFriend(pkt.sender);
	const prefix = isFriend ? DB.getMessage(102) : 'From';
	const msg = pkt.msg.replace(/\|\d{2}/, '');

	// Use WhisperBox if open or allowed by settings (version dependent)
	if (getShouldOpenWhisperBox(pkt.sender)) {
		WhisperBox.addText(pkt.sender, pkt.sender + ' : ' + msg, '#b5deef');
		ChatBox.saveNickName(pkt.sender);
		return;
	}

	// Fallback to main ChatBox
	ChatBox.addText(
		'[ ' +
			prefix +
			' <span class="nickname-link" data-nickname="' +
			pkt.sender +
			'" style="cursor:pointer; text-decoration:underline;">' +
			pkt.sender +
			'</span> ] : ' +
			msg,
		ChatBox.TYPE.PRIVATE,
		ChatBox.FILTER.WHISPER
	);
	ChatBox.saveNickName(pkt.sender);
}

/**
 * Received data from a sent private message
 *
 * @param {object} pkt - PACKET.ZC.ACK_WHISPER
 */
function onPrivateMessageSent(pkt) {
	const user = ChatBox.PrivateMessageStorage.nick;
	const msg = ChatBox.PrivateMessageStorage.msg;

	if (pkt.result === 0) {
		if (user && msg) {
			if (getShouldOpenWhisperBox(user)) {
				WhisperBox.addText(user, Session.Entity.display.name + ' : ' + msg, '#ffff00');
			} else {
				ChatBox.addText(
					'[ To <span class="nickname-link" data-nickname="' +
						user +
						'" style="cursor:pointer; text-decoration:underline;">' +
						user +
						'</span> ] : ' +
						msg,
					ChatBox.TYPE.PRIVATE,
					ChatBox.FILTER.WHISPER
				);
			}
		}
	} else {
		const errorMsg = '(' + user + ') : ' + DB.getMessage(147 + pkt.result);
		ChatBox.addText(errorMsg, ChatBox.TYPE.PRIVATE, ChatBox.FILTER.WHISPER);
	}

	ChatBox.PrivateMessageStorage.nick = '';
	ChatBox.PrivateMessageStorage.msg = '';
}

/**
 * Name sent with the last /ex or /in, which the server's answer leaves out
 */
let _settingName = '';

/**
 * Ask the server to refuse (/ex) or accept (/in) whispers from one player
 *
 * @param {string} name
 * @param {number} type - 0 refuse, 1 accept
 */
function requestWhisperPC(name, type) {
	const pkt = new PACKET.CZ.SETTING_WHISPER_PC();
	pkt.name = name;
	pkt.type = type;
	_settingName = name;
	Network.sendPacket(pkt);
}

/**
 * Ask the server to refuse (/exall) or accept (/inall) all whispers
 *
 * @param {number} type - 0 refuse, 1 accept
 */
function requestWhisperState(type) {
	const pkt = new PACKET.CZ.SETTING_WHISPER_STATE();
	pkt.type = type;
	Network.sendPacket(pkt);
}

/**
 * Ask the server for the list of refused names (/ex)
 */
function requestWhisperList() {
	Network.sendPacket(new PACKET.CZ.REQ_WHISPER_LIST());
}

/**
 * Answer to /ex <name> or /in <name>
 * The official client says nothing when /ex succeeds.
 *
 * @param {object} pkt - PACKET.ZC.SETTING_WHISPER_PC
 */
function onWhisperPCSetting(pkt) {
	const messages = pkt.type === 0 ? [null, 194, 195] : [196, 197, 198];
	const id = messages[pkt.result];

	if (id) {
		ChatBox.addText(_settingName + DB.getMessage(id), ChatBox.TYPE.INFO, ChatBox.FILTER.PUBLIC_LOG, '#ffff00');
	}
}

/**
 * Answer to /exall or /inall
 *
 * @param {object} pkt - PACKET.ZC.SETTING_WHISPER_STATE
 */
function onWhisperStateSetting(pkt) {
	if (pkt.type > 1 || pkt.result > 1) {
		return;
	}

	const id = 3427 + pkt.type * 2 + pkt.result;
	ChatBox.addText(DB.getMessage(id), ChatBox.TYPE.INFO, ChatBox.FILTER.PUBLIC_LOG, '#ffff00');
}

/**
 * List of refused names, the answer to /ex
 *
 * @param {object} pkt - PACKET.ZC.WHISPER_LIST
 */
function onWhisperList(pkt) {
	const list = pkt.wisperList;

	ChatBox.addText(DB.getMessage(list.length ? 3396 : 3395), ChatBox.TYPE.INFO, ChatBox.FILTER.PUBLIC_LOG, '#00ffff');

	for (let i = 0; i < list.length; ++i) {
		ChatBox.addText(list[i].name, ChatBox.TYPE.INFO, ChatBox.FILTER.PUBLIC_LOG, '#00ffff');
	}
}

/**
 * Initialize
 */
export default function PrivateMessageEngine() {
	Network.hookPacket(PACKET.ZC.WHISPER, onPrivateMessage);
	Network.hookPacket(PACKET.ZC.WHISPER2, onPrivateMessage);
	Network.hookPacket(PACKET.ZC.ACK_WHISPER, onPrivateMessageSent);
	Network.hookPacket(PACKET.ZC.ACK_WHISPER2, onPrivateMessageSent);
	Network.hookPacket(PACKET.ZC.SETTING_WHISPER_PC, onWhisperPCSetting);
	Network.hookPacket(PACKET.ZC.SETTING_WHISPER_STATE, onWhisperStateSetting);
	Network.hookPacket(PACKET.ZC.WHISPER_LIST, onWhisperList);

	// Hook WhisperBox outbound messages
	WhisperBox.onRequestTalk = function (nickname, text) {
		const pkt = new PACKET.CZ.WHISPER();
		pkt.receiver = nickname;
		pkt.msg = text;
		Network.sendPacket(pkt);

		// Save temporarily to handle ACK
		ChatBox.PrivateMessageStorage.nick = nickname;
		ChatBox.PrivateMessageStorage.msg = text;
	};
}

PrivateMessageEngine.requestWhisperPC = requestWhisperPC;
PrivateMessageEngine.requestWhisperState = requestWhisperState;
PrivateMessageEngine.requestWhisperList = requestWhisperList;
