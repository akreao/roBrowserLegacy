import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import PacketVersions from 'Network/PacketVersions.js';
import PACKETVER from 'Network/PacketVerManager.js';
import BinaryReader from 'Utils/BinaryReader.js';

function writeString(view, offset, text) {
	for (let i = 0; i < text.length; i++) {
		view.setUint8(offset + i, text.charCodeAt(i));
	}
}

beforeAll(() => {
	for (const date of Object.keys(PacketVersions)) {
		PACKETVER.addSupport(date, PacketVersions[date]);
	}
});

beforeEach(() => {
	PACKETVER.value = 20221005;
});

// rAthena PACKET_ZC_SEARCH_STORE_INFO_ACK from 2020-09-16 (0xb64), after the header and length:
// <first page>.B <next page>.B <uses>.B { <store id>.L <account id>.L <shop name>.80B <item id>.L
// <item type>.B <price>.L <amount>.W <cards>.4L <options>.25B <refine>.B <grade>.B }*
describe('ZC_SEARCH_STORE_INFO_ACK2', () => {
	it('reads the results', () => {
		const entry = 142;
		const buf = new ArrayBuffer(3 + entry * 2);
		const view = new DataView(buf);
		view.setUint8(0, 1);
		view.setUint8(1, 1);
		view.setUint8(2, 4);
		for (let i = 0; i < 2; i++) {
			const o = 3 + i * entry;
			view.setUint32(o, 10 + i, true);
			view.setUint32(o + 4, 2000000 + i, true);
			writeString(view, o + 8, `Shop ${i}`);
			view.setUint32(o + 88, 1201, true);
			view.setUint8(o + 92, 5);
			view.setUint32(o + 93, 15000, true);
			view.setUint16(o + 97, 3, true);
			view.setUint32(o + 99, 4001, true);
			view.setInt16(o + 115, 1, true);
			view.setInt16(o + 117, 20, true);
			view.setUint8(o + 140, 7);
			view.setUint8(o + 141, 2);
		}

		const pkt = new PACKET.ZC.SEARCH_STORE_INFO_ACK2(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ IsFirstPage: 1, IsNexPage: 1, RemainedSearchCnt: 4 });
		expect(pkt.SSI_List).toHaveLength(2);
		expect(pkt.SSI_List[1]).toMatchObject({
			SSI_ID: 11,
			AID: 2000001,
			StoreName: 'Shop 1',
			ITID: 1201,
			ItemType: 5,
			price: 15000,
			count: 3,
			slot: { card1: 4001, card2: 0, card3: 0, card4: 0 },
			RefiningLevel: 7,
			enchantgrade: 2
		});
		expect(pkt.SSI_List[1].Options[0]).toEqual({ index: 1, value: 20, param: 0 });
		expect(PacketRegister[0xb64]).toBe(PACKET.ZC.SEARCH_STORE_INFO_ACK2);
	});
});

// rAthena clif_parse_SearchStoreInfo at 20221005: 0835 <len>.W <type>.B <max>.L <min>.L
// <item count>.B <card count>.B { <item id>.L }* { <card id>.L }*
describe('CZ_SEARCH_STORE_INFO', () => {
	it('writes four-byte item and card ids', () => {
		const pkt = new PACKET.CZ.SEARCH_STORE_INFO();
		pkt.StoreType = 1;
		pkt.maxPrice = 50000;
		pkt.minPrice = 100;
		pkt.ItemIDList = [1201, 1202];
		pkt.CardIDList = [4001];

		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(15 + 3 * 4);
		expect(view.getUint16(0, true)).toBe(0x0835);
		expect(view.getUint16(2, true)).toBe(27);
		expect(view.getUint8(4)).toBe(1);
		expect(view.getUint32(5, true)).toBe(50000);
		expect(view.getUint32(9, true)).toBe(100);
		expect(view.getUint8(13)).toBe(2);
		expect(view.getUint8(14)).toBe(1);
		expect([view.getUint32(15, true), view.getUint32(19, true), view.getUint32(23, true)]).toEqual([
			1201, 1202, 4001
		]);
	});

	it('writes two-byte ids before 2018-11-21', () => {
		PACKETVER.value = 20180620;
		const pkt = new PACKET.CZ.SEARCH_STORE_INFO();
		pkt.ItemIDList = [1201];

		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(17);
		expect(view.getUint16(15, true)).toBe(1201);
	});
});

// 0838 (CZ_SEARCH_STORE_INFO_NEXT_PAGE), 083b (CZ_CLOSE_SEARCH_STORE_INFO),
// 083c <account id>.L <store id>.L <item id>.L (CZ_SSILIST_ITEM_CLICK)
describe('store search requests', () => {
	it('asks for the next page and closes', () => {
		const next = new DataView(new PACKET.CZ.SEARCH_STORE_INFO_NEXT_PAGE().build().buffer);
		const close = new DataView(new PACKET.CZ.CLOSE_SEARCH_STORE_INFO().build().buffer);

		expect([next.byteLength, next.getUint16(0, true)]).toEqual([2, 0x0838]);
		expect([close.byteLength, close.getUint16(0, true)]).toEqual([2, 0x083b]);
	});

	it('clicks a result', () => {
		const pkt = new PACKET.CZ.SSILIST_ITEM_CLICK();
		pkt.AID = 2000001;
		pkt.SSI_ID = 11;
		pkt.ITID = 1201;

		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(14);
		expect(view.getUint16(0, true)).toBe(0x083c);
		expect(view.getUint32(2, true)).toBe(2000001);
		expect(view.getUint32(6, true)).toBe(11);
		expect(view.getUint32(10, true)).toBe(1201);
	});
});
