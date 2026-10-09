/**
 * Engine/MapEngine/PartyBooking.js
 *
 * Party booking: register, search and remove party ads (packets 0x802-0x80b)
 *
 * This file is part of ROBrowser, (http://www.robrowser.com/).
 */

import DB from 'DB/DBManager.js';
import Network from 'Network/NetworkManager.js';
import PACKET from 'Network/PacketStructure.js';
import UIManager from 'UI/UIManager.js';
import ChatBox from 'UI/Components/ChatBox/ChatBox.js';
import PartyBooking from 'UI/Components/PartyBooking/PartyBooking.js';
import PartyBookingRecruit from 'UI/Components/PartyBooking/PartyBookingRecruit.js';
import PartyBookingAd from 'UI/Components/PartyBooking/PartyBookingAd.js';
import { LEVEL_RANGE, getJobNames, getMapName } from 'UI/Components/PartyBooking/PartyBookingData.js';

/**
 * @var {Object|null} ad sent and waiting for the server's answer: { level, mapId, jobs }
 */
let _pending = null;

/**
 * Search party ads
 */
function search(level, mapId, job, lastIndex, count) {
	const pkt = new PACKET.CZ.PARTY_BOOKING_REQ_SEARCH();
	pkt.Level = level;
	pkt.MapID = mapId;
	pkt.Job = job;
	pkt.LastIndex = lastIndex;
	pkt.ResultCount = count;
	Network.sendPacket(pkt);
}

/**
 * Register an ad
 */
function register(level, mapId, jobs) {
	const pkt = new PACKET.CZ.PARTY_BOOKING_REQ_REGISTER();
	pkt.RegisterInfo = { Level: level, MapID: mapId, Job: jobs };
	_pending = { level: level, mapId: mapId, jobs: jobs };
	Network.sendPacket(pkt);
}

/**
 * Change the jobs the registered ad asks for
 */
function update(jobs) {
	const pkt = new PACKET.CZ.PARTY_BOOKING_REQ_UPDATE();
	pkt.Job = jobs;
	Network.sendPacket(pkt);
	PartyBookingAd.setJobs(jobs);
}

/**
 * Remove the registered ad
 */
function remove() {
	Network.sendPacket(new PACKET.CZ.PARTY_BOOKING_REQ_DELETE());
}

/**
 * Open the ad form, or the ad already up
 */
function openRecruit() {
	if (PartyBookingAd.getAd()) {
		PartyBookingAd.append();
		return;
	}
	PartyBookingRecruit.open();
}

/**
 * Answer to registering an ad
 *
 * @param {object} pkt - PACKET.ZC.PARTY_BOOKING_ACK_REGISTER
 */
function onRegister(pkt) {
	if (pkt.Result !== 0) {
		// 2: an ad is already up
		UIManager.showMessageBox(DB.getMessage(pkt.Result === 2 ? 1941 : 1826), 'ok');
		return;
	}

	PartyBookingRecruit.remove();
	if (_pending) {
		PartyBookingAd.show(_pending.level, _pending.mapId, _pending.jobs);
		_pending = null;
	}
}

/**
 * Search results
 *
 * @param {object} pkt - PACKET.ZC.PARTY_BOOKING_ACK_SEARCH
 */
function onSearch(pkt) {
	PartyBooking.setResults(pkt.Info, !!pkt.IsExistMoreResult);
}

/**
 * Answer to removing the ad
 *
 * @param {object} pkt - PACKET.ZC.PARTY_BOOKING_ACK_DELETE
 */
function onDelete(pkt) {
	switch (pkt.Result) {
		case 0: // removed
		case 1: // had expired
			PartyBookingAd.clear();
			break;
		case 2: // failed
			UIManager.showMessageBox(DB.getMessage(1828), 'ok');
			break;
		case 3: // nothing registered
			UIManager.showMessageBox(DB.getMessage(1829), 'ok');
			PartyBookingAd.clear();
			break;
	}
}

/**
 * Someone registered an ad
 *
 * @param {object} pkt - PACKET.ZC.PARTY_BOOKING_NOTIFY_INSERT
 */
function onInsert(pkt) {
	const info = pkt.Info;
	const detail = info.Detail;
	const ad = {
		Index: info.Index,
		CharName: info.CharName,
		ExpireTime: info.ExpireTime,
		Detail: {
			Level: detail.Level,
			MapID: detail.MapID,
			Job: [detail.Job1, detail.Job2, detail.Job3, detail.Job4, detail.Job5, detail.Job6]
		}
	};

	PartyBooking.addAd(ad);

	if (PartyBooking.isNoticeOn()) {
		ChatBox.addText(
			DB.getMessage(1688) +
				' - ' +
				ad.CharName +
				' (' +
				detail.Level +
				'~' +
				(detail.Level + LEVEL_RANGE) +
				', ' +
				getMapName(PartyBooking.getRegions(), detail.MapID) +
				'): ' +
				getJobNames(ad.Detail.Job),
			ChatBox.TYPE.INFO,
			ChatBox.FILTER.PARTY
		);
	}
}

/**
 * Someone changed their ad's jobs
 *
 * @param {object} pkt - PACKET.ZC.PARTY_BOOKING_NOTIFY_UPDATE
 */
function onUpdate(pkt) {
	PartyBooking.updateAd(pkt.Index, [pkt.Job1, pkt.Job2, pkt.Job3, pkt.Job4, pkt.Job5, pkt.Job6]);
}

/**
 * Someone's ad was removed
 *
 * @param {object} pkt - PACKET.ZC.PARTY_BOOKING_NOTIFY_DELETE
 */
function onRemove(pkt) {
	PartyBooking.removeAd(pkt.Index);
}

/**
 * Initialize
 */
export default function PartyBookingEngine() {
	PartyBooking.onSearch = search;
	PartyBooking.onRecruit = openRecruit;
	PartyBookingRecruit.onRegister = register;
	PartyBookingRecruit.onUpdate = update;
	PartyBookingAd.onRewrite = ad => PartyBookingRecruit.open(ad);
	PartyBookingAd.onDelete = remove;

	Network.hookPacket(PACKET.ZC.PARTY_BOOKING_ACK_REGISTER, onRegister);
	Network.hookPacket(PACKET.ZC.PARTY_BOOKING_ACK_SEARCH, onSearch);
	Network.hookPacket(PACKET.ZC.PARTY_BOOKING_ACK_DELETE, onDelete);
	Network.hookPacket(PACKET.ZC.PARTY_BOOKING_NOTIFY_INSERT, onInsert);
	Network.hookPacket(PACKET.ZC.PARTY_BOOKING_NOTIFY_UPDATE, onUpdate);
	Network.hookPacket(PACKET.ZC.PARTY_BOOKING_NOTIFY_DELETE, onRemove);
}
