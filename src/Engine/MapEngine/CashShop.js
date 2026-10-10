/**
 * Engine/MapEngine/CashShop.js
 *
 * Manage Trade packets and UI
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 *
 * @author Vincent Thibault
 */

/**
 * Load dependencies
 */
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import CashShop from 'UI/Components/CashShop/CashShop.js';

function onOpenCashShop(pkt) {
	CashShop.readPoints(pkt.cashPoints, pkt.kafraPoints, pkt.tab);
	CashShop.prepare();
	CashShop.append();
}

/**
 * The Refresh button: open the shop again, which brings the points up to date
 *
 * @param {number} tab
 */
function onRefreshRequest(tab) {
	let pkt;
	if (PACKETVER.value >= 20191224) {
		pkt = new PACKET.CZ.SE_CASHSHOP_OPEN2();
		pkt.tab = tab || 0;
	} else {
		pkt = new PACKET.CZ.SE_CASHSHOP_OPEN1();
	}
	Network.sendPacket(pkt);
}

function onOpenReqCashShopItemList(pkt) {
	CashShop.readCashShopItems(pkt);
}

function onSuccessCashShopBuyList(pkt) {
	CashShop.setSuccessCashShopUpdate(pkt);
}

/**
 * Initialize
 */
export default function MainEngine() {
	CashShop.onRefreshRequest = onRefreshRequest;
	Network.hookPacket(PACKET.ZC.SE_CASHSHOP_OPEN, onOpenCashShop);
	Network.hookPacket(PACKET.ZC.SE_CASHSHOP_OPEN2, onOpenCashShop);
	Network.hookPacket(PACKET.ZC.SE_CASHSHOP_OPEN3, onOpenCashShop); // old with no tab
	Network.hookPacket(PACKET.ZC.ACK_SCHEDULER_CASHITEM, onOpenReqCashShopItemList);
	Network.hookPacket(PACKET.ZC.SE_PC_BUY_CASHITEM_RESULT, onSuccessCashShopBuyList);
}
