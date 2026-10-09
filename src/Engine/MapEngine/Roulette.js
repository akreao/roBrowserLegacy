/**
 * Engine/MapEngine/Roulette.js
 *
 * Lucky Roulette packets. Failures are told to the player in the chat
 * box with the official client's messages and colours.
 */

/**
 * Load dependencies
 */
import DB from 'DB/DBManager.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import Roulette from 'UI/Components/Roulette/Roulette.js';

/**
 * Chat colours the official client uses (COLORREF 0x6464FF and 0x64FFFF)
 */
const COLOR_ERROR = '#FF6464';
const COLOR_WARNING = '#FFFF64';

/**
 * Show a message in the chat box
 *
 * @param {number} msgId - msgstringtable id
 * @param {string} color
 */
function showMessage(msgId, color) {
	ChatBox.addText(DB.getMessage(msgId), ChatBox.TYPE.ERROR, ChatBox.FILTER.PUBLIC_LOG, color);
}

/**
 * Open Roulette Window
 *
 * @param {object} pkt - PACKET.ZC.ACK_OPEN_ROULETTE
 */
function onOpenRoulette(pkt) {
	if (pkt.result === 0) {
		Roulette.onOpen(pkt);
		return;
	}

	// "You cannot open Lucky Roulette window."
	showMessage(2632, COLOR_ERROR);
}

/**
 * Receive Roulette Info (item list)
 *
 * @param {object} pkt - PACKET.ZC.ACK_ROULETTE_INFO
 */
function onRouletteInfo(pkt) {
	Roulette.onRouletteInfo(pkt);
}

/**
 * Receive Roulette Spin Result
 *
 * @param {object} pkt - PACKET.ZC.ACK_GENERATE_ROULETTE
 */
function onGenerateRoulette(pkt) {
	switch (pkt.result) {
		case 0: // GENERATE_ROULETTE_SUCCESS
			Roulette.onGenerate(pkt, false);
			return;

		case 3: // GENERATE_ROULETTE_LOSING
			Roulette.onGenerate(pkt, true);
			return;

		case 1: // "You cannot start Lucky Roulette."
			showMessage(2634, COLOR_WARNING);
			break;

		case 2: // "You need points to start Lucky Roulette."
			showMessage(2635, COLOR_WARNING);
			break;

		case 4: // "Please make more than 5 item slots in the inventory."
			showMessage(2693, COLOR_WARNING);
			break;

		case 5: // "Drawing the blank in the previous roulette, you cannot play the higher roulette."
			showMessage(2700, COLOR_WARNING);
			break;

		default:
			return;
	}

	Roulette.onGenerateFailed();
}

/**
 * Receive Roulette Close ACK
 *
 * @param {object} pkt - PACKET.ZC.ACK_CLOSE_ROULETTE
 */
function onCloseRoulette(pkt) {
	if (pkt.result === 0) {
		Roulette.onClosed();
		return;
	}

	// "You cannot close Lucky Roulette window."
	showMessage(2633, COLOR_ERROR);
}

/**
 * Receive Roulette Item Result
 *
 * @param {object} pkt - PACKET.ZC.RECV_ROULETTE_ITEM
 */
function onRecvRouletteItem(pkt) {
	switch (pkt.result) {
		case 0: // RECV_ITEM_SUCCESS
			Roulette.onItemReceived(pkt);
			break;

		case 1: // "You cannot claim the prize."
			showMessage(2636, COLOR_ERROR);
			break;

		case 2: // "The maximum number of items has exceeded."
			showMessage(2637, COLOR_ERROR);
			break;

		case 3: // "You are overburdened. Please clear some items from the inventory."
			showMessage(2638, COLOR_ERROR);
			break;
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
