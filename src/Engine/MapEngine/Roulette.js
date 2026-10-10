/**
 * Engine/MapEngine/Roulette.js
 *
 * Manage Roulette System
 *
 * @author [Your Name]
 */

/**
 * Load dependencies
 */
import DB from 'DB/DBManager.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import Roulette from 'UI/Components/Roulette/Roulette.js';
import { useOfficialLayout } from 'UI/OfficialLayout.js';

/**
 * Chat colours the official client uses for roulette failures
 * (COLORREF 0x6464FF and 0x64FFFF)
 */
const COLOR_ERROR = '#FF6464';
const COLOR_WARNING = '#FFFF64';

/**
 * Tell the player why a roulette request failed, as the official client does
 *
 * @param {number} msgId - msgstringtable id
 * @param {string} color
 */
function showMessage(msgId, color) {
	ChatBox.addText(DB.getMessage(msgId), ChatBox.TYPE.ERROR, ChatBox.FILTER.PUBLIC_LOG, color);
}

/**
 * @returns {boolean} the official Roulette window is in use (UI/OfficialLayout.js)
 */
function isOfficial() {
	return useOfficialLayout('Roulette');
}

/**
 * Request to Open Roulette
 */
/*function requestOpenRoulette() {
		let pkt = new PACKET.CZ.REQ_OPEN_ROULETTE();
		Network.sendPacket(pkt);
	}*/ // UNUSED

/**
 * Request Roulette Info
 */
/*function requestRouletteInfo() {
		let pkt = new PACKET.CZ.REQ_ROULETTE_INFO();
		Network.sendPacket(pkt);
	}*/ // UNUSED

/**
 * Request to Close Roulette
 */
/*function requestCloseRoulette() {
		let pkt = new PACKET.CZ.REQ_CLOSE_ROULETTE();
		Network.sendPacket(pkt);
	}*/ // UNUSED

/**
 * Receive Packets
 */

/**
 * Open Roulette Window
 *
 * @param {object} pkt - PACKET.ZC.ACK_OPEN_ROULETTE
 */
function onOpenRoulette(pkt) {
	// pkt structure:
	// {
	//   result: number,       // 0 = success, 1 = fail
	//   serial: number,
	//   step: number,
	//   idx: number,
	//   additionItemID: number,
	//   goldPoint: number,
	//   silverPoint: number,
	//   bronzePoint: number
	// }

	// Server responded (standard rAthena implementation)
	if (pkt.result === 0) {
		// The official window asks for the item list itself
		if (isOfficial()) {
			Roulette.onOpen(pkt);
			return;
		}

		// Append component to DOM if not already appended
		if (!Roulette.ui) {
			Roulette.append();
		}
		Roulette.onOpen(pkt);

		// Ask for the item list, so the wheel has its items
		Network.sendPacket(new PACKET.CZ.REQ_ROULETTE_INFO());
	} else {
		// "You cannot open Lucky Roulette window."
		showMessage(2632, COLOR_ERROR);
	}
}

/**
 * Receive Roulette Info (item list)
 *
 * @param {object} pkt - PACKET.ZC.ACK_ROULETTE_INFO
 */
function onRouletteInfo(pkt) {
	// pkt structure:
	// {
	//   serial: number,
	//   items: [{row, position, itemId, count}, ...]
	// }

	// Append component to DOM if not already appended
	if (!isOfficial() && !Roulette.ui) {
		Roulette.append();
	}
	Roulette.onRouletteInfo(pkt);
}

/**
 * Receive Roulette Spin Result
 *
 * @param {object} pkt - PACKET.ZC.ACK_GENERATE_ROULETTE
 */
function onGenerateRoulette(pkt) {
	// pkt structure:
	// {
	//   result: number,       // 0 = success, other = fail
	//   step: number,
	//   idx: number,
	//   additionItemID: number,
	//   remainGold: number,
	//   remainSilver: number,
	//   remainBronze: number
	// }

	if (isOfficial()) {
		// 3 is GENERATE_ROULETTE_LOSING: the spin lands on a blank
		if (pkt.result === 0 || pkt.result === 3) {
			Roulette.onGenerate(pkt, pkt.result === 3);
			return;
		}
		if (showGenerateError(pkt.result)) {
			Roulette.onGenerateFailed();
		}
		return;
	}

	if (pkt.result === 0) {
		// Append component to DOM if not already appended
		if (!Roulette.ui) {
			Roulette.append();
		}
		Roulette.onResult(pkt);
	} else if (!showGenerateError(pkt.result)) {
		console.error('Roulette spin failed:', pkt.result);
	}
}

/**
 * Show the official message for a failed spin
 *
 * @param {number} result - ZC_ACK_GENERATE_ROULETTE result
 * @returns {boolean} a message was shown
 */
function showGenerateError(result) {
	switch (result) {
		case 1: // "You cannot start Lucky Roulette."
			showMessage(2634, COLOR_WARNING);
			return true;
		case 2: // "You need points to start Lucky Roulette."
			showMessage(2635, COLOR_WARNING);
			return true;
		case 4: // "Please make more than 5 item slots in the inventory."
			showMessage(2693, COLOR_WARNING);
			return true;
		case 5: // "Drawing the blank in the previous roulette, you cannot play the higher roulette."
			showMessage(2700, COLOR_WARNING);
			return true;
		default:
			return false;
	}
}

/**
 * Receive Roulette Close ACK
 *
 * @param {object} pkt - PACKET.ZC.ACK_CLOSE_ROULETTE
 */
function onCloseRoulette(pkt) {
	// pkt structure:
	// {
	//   result: number  // 0 = success, other = fail
	// }

	if (pkt.result !== 0) {
		// "You cannot close Lucky Roulette window."
		showMessage(2633, COLOR_ERROR);
		return;
	}

	if (isOfficial()) {
		Roulette.onClosed();
		return;
	}

	if (Roulette.ui) {
		Roulette.ui.hide();
	}
}

/**
 * Receive Roulette Item Result
 *
 * @param {object} pkt - PACKET.ZC.RECV_ROULETTE_ITEM
 */
function onRecvRouletteItem(pkt) {
	// pkt structure:
	// {
	//   result: number,        // 0=success, 1=failed, 2=overcount, 3=overweight
	//   additionItemID: number
	// }

	if (pkt.result === 0) {
		// Item received successfully
		if (Roulette.ui && typeof Roulette.onItemReceived === 'function') {
			Roulette.onItemReceived(pkt);
		}
	} else {
		switch (pkt.result) {
			case 1: // "You cannot claim the prize."
				showMessage(2636, COLOR_ERROR);
				break;
			case 2: // "The maximum number of items has exceeded."
				showMessage(2637, COLOR_ERROR);
				break;
			case 3: // "You are overburdened. Please clear some items from the inventory."
				showMessage(2638, COLOR_ERROR);
				break;
			default:
				console.error('[Roulette] Failed to receive roulette item:', pkt.result);
		}
	}
}

/**
 * Initialize
 */
export default function RouletteEngine() {
	Network.hookPacket(PACKET.ZC.ACK_OPEN_ROULETTE, onOpenRoulette);
	Network.hookPacket(PACKET.ZC.ACK_ROULETTE_INFO, onRouletteInfo);
	Network.hookPacket(PACKET.ZC.ACK_GENERATE_ROULETTE, onGenerateRoulette);
	Network.hookPacket(PACKET.ZC.ACK_CLOSE_ROULETTE, onCloseRoulette);
	Network.hookPacket(PACKET.ZC.RECV_ROULETTE_ITEM, onRecvRouletteItem);
}
