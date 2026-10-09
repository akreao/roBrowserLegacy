import { describe, it, expect, beforeEach } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import PACKETVER from 'Network/PacketVerManager.js';
import BinaryReader from 'Utils/BinaryReader.js';

function writeString(view, offset, text) {
	for (let i = 0; i < text.length; i++) {
		view.setUint8(offset + i, text.charCodeAt(i));
	}
}

function read(Struct, bytes, write) {
	const buf = new ArrayBuffer(bytes);
	write(new DataView(buf));
	return new Struct(new BinaryReader(buf), buf.byteLength);
}

beforeEach(() => {
	PACKETVER.value = 20221005;
});

// rAthena clif_broadcast_obtain_special_item, after the header and length:
// <type>.B <item id>.L <name length>.B <name>.?B, then for a monster
// <monster name length>.B <monster name>.?B, or for a box
// <box id length>.B <box id>.L <refine length>.B <refine>.L
describe('ZC_BROADCASTING_SPECIAL_ITEM_OBTAIN', () => {
	it('reads a monster drop', () => {
		const pkt = read(PACKET.ZC.BROADCASTING_SPECIAL_ITEM_OBTAIN, 1 + 4 + 1 + 24 + 1 + 24, view => {
			view.setUint8(0, 1);
			view.setUint32(1, 4121, true);
			view.setInt8(5, 24);
			writeString(view, 6, 'Steven');
			view.setInt8(30, 24);
			writeString(view, 31, 'Phreeoni');
		});

		expect(pkt).toMatchObject({ type: 1, ITID: 4121, Name: 'Steven', monsterName: 'Phreeoni', boxITID: 0 });
		expect(PacketRegister[0x7fd]).toBe(PACKET.ZC.BROADCASTING_SPECIAL_ITEM_OBTAIN);
	});

	it('reads an item from a box', () => {
		const pkt = read(PACKET.ZC.BROADCASTING_SPECIAL_ITEM_OBTAIN, 1 + 4 + 1 + 24 + 1 + 4 + 1 + 4, view => {
			view.setUint8(0, 0);
			view.setUint32(1, 5022, true);
			view.setInt8(5, 24);
			writeString(view, 6, 'Steven');
			view.setInt8(30, 4);
			view.setUint32(31, 616, true);
			view.setInt8(35, 4);
			view.setUint32(36, 0, true);
		});

		expect(pkt).toMatchObject({ type: 0, ITID: 5022, Name: 'Steven', boxITID: 616, monsterName: '' });
	});

	it('reads an NPC reward', () => {
		const pkt = read(PACKET.ZC.BROADCASTING_SPECIAL_ITEM_OBTAIN, 1 + 4 + 1 + 24 + 1, view => {
			view.setUint8(0, 2);
			view.setUint32(1, 2357, true);
			view.setInt8(5, 24);
			writeString(view, 6, 'Steven');
			view.setInt8(30, 0);
		});

		expect(pkt).toMatchObject({ type: 2, ITID: 2357, Name: 'Steven', monsterName: '' });
	});
});

// rAthena PACKET_ZC_CASH_TIME_COUNTER: <item id>.L <seconds>.L
describe('ZC_CASH_TIME_COUNTER', () => {
	it('reads a four-byte item id', () => {
		const pkt = read(PACKET.ZC.CASH_TIME_COUNTER, 8, view => {
			view.setUint32(0, 100250, true);
			view.setUint32(4, 3600, true);
		});

		expect(pkt).toMatchObject({ ITID: 100250, RemainSecond: 3600 });
	});
});

// rAthena PACKET_ZC_ACK_TAKEOFF_EQUIP_ALL: <result>.B
describe('ZC_ACK_TAKEOFF_EQUIP_ALL', () => {
	it('reads the result', () => {
		const pkt = read(PACKET.ZC.ACK_TAKEOFF_EQUIP_ALL, 1, view => view.setUint8(0, 1));

		expect(pkt.result).toBe(1);
		expect(PacketRegister[0xbae]).toBe(PACKET.ZC.ACK_TAKEOFF_EQUIP_ALL);
	});
});
