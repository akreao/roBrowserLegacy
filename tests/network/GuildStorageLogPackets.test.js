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

beforeEach(() => {
	PACKETVER.value = 20221005;
});

// rAthena PACKET_ZC_ACK_GUILDSTORAGE_LOG (0x9da), after the header and length:
// <result>.W <amount>.W { <id>.L <item id>.L <amount>.L <action>.B <refine>.L <unique id>.Q
// <identified>.B <item type>.W <cards>.4L <name>.24B <time>.24B <attribute>.B }*
// Item ids are two bytes before 2018-11-21. The official handler steps 0x5d (93) bytes an entry.
describe('ZC_ACK_GUILDSTORAGE_LOG', () => {
	it('reads the entries', () => {
		const entry = 93;
		const buf = new ArrayBuffer(4 + entry * 2);
		const view = new DataView(buf);
		view.setUint16(0, 1, true);
		view.setUint16(2, 2, true);
		for (let i = 0; i < 2; i++) {
			const o = 4 + i * entry;
			view.setUint32(o, 500 + i, true);
			view.setUint32(o + 4, 1201, true);
			view.setInt32(o + 8, 3 + i, true);
			view.setUint8(o + 12, i);
			view.setInt32(o + 13, 7, true);
			view.setUint32(o + 17, 0xffffffff, true);
			view.setUint32(o + 21, 0xffffffff, true);
			view.setUint8(o + 25, 1);
			view.setUint16(o + 26, 5, true);
			view.setUint32(o + 28, 4001, true);
			writeString(view, o + 44, `Member ${i}`);
			writeString(view, o + 68, '2026-10-09 16:11:25');
			view.setUint8(o + 92, i);
		}

		const pkt = new PACKET.ZC.ACK_GUILDSTORAGE_LOG(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ result: 1, amount: 2 });
		expect(pkt.items).toHaveLength(2);
		expect(pkt.items[1]).toEqual({
			id: 501,
			ITID: 1201,
			count: 4,
			action: 1,
			RefiningLevel: 7,
			IsIdentified: 1,
			type: 5,
			slot: { card1: 4001, card2: 0, card3: 0, card4: 0 },
			name: 'Member 1',
			time: '2026-10-09 16:11:25',
			IsDamaged: 1
		});
		expect(pkt.items[0]).toMatchObject({ id: 500, action: 0, IsDamaged: 0 });
		expect(PacketRegister[0x9da]).toBe(PACKET.ZC.ACK_GUILDSTORAGE_LOG);
	});

	it('reads two-byte item ids before 2018-11-21', () => {
		PACKETVER.value = 20180620;
		const buf = new ArrayBuffer(4 + 83);
		const view = new DataView(buf);
		view.setUint16(0, 1, true);
		view.setUint16(2, 1, true);
		view.setUint32(4, 9, true);
		view.setUint16(8, 1201, true);
		view.setInt32(10, 1, true);
		view.setUint16(30, 4001, true);
		writeString(view, 38, 'Member');

		const pkt = new PACKET.ZC.ACK_GUILDSTORAGE_LOG(new BinaryReader(buf), buf.byteLength);

		expect(pkt.items).toHaveLength(1);
		expect(pkt.items[0]).toMatchObject({ id: 9, ITID: 1201, count: 1, slot: { card1: 4001 }, name: 'Member' });
	});

	it('carries no entries with an empty or failed result', () => {
		const buf = new ArrayBuffer(4);
		new DataView(buf).setUint16(0, 2, true);

		const pkt = new PACKET.ZC.ACK_GUILDSTORAGE_LOG(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ result: 2, amount: 0, items: [] });
	});
});
