import { describe, it, expect } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import BinaryReader from 'Utils/BinaryReader.js';

// rAthena PACKET_ZC_MERGE_ITEM_OPEN, after the header and length: { <index>.W }*
describe('ZC_MERGE_ITEM_OPEN', () => {
	it('reads the inventory indexes', () => {
		const buf = new ArrayBuffer(6);
		const view = new DataView(buf);
		view.setInt16(0, 2, true);
		view.setInt16(2, 7, true);
		view.setInt16(4, 31, true);

		const pkt = new PACKET.ZC.MERGE_ITEM_OPEN(new BinaryReader(buf), buf.byteLength);

		expect(pkt.itemList).toEqual([2, 7, 31]);
		expect(PacketRegister[0x96d]).toBe(PACKET.ZC.MERGE_ITEM_OPEN);
	});
});

// rAthena PACKET_ZC_ACK_MERGE_ITEM: <index>.W <amount>.W <reason>.B
describe('ZC_ACK_MERGE_ITEM', () => {
	it('reads the stack that remains and the result', () => {
		const buf = new ArrayBuffer(5);
		const view = new DataView(buf);
		view.setInt16(0, 9, true);
		view.setUint16(2, 1500, true);
		view.setUint8(4, 0);

		const pkt = new PACKET.ZC.ACK_MERGE_ITEM(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ index: 9, amount: 1500, reason: 0 });
		expect(PACKET.ZC.ACK_MERGE_ITEM.size).toBe(7);
		expect(PacketRegister[0x96f]).toBe(PACKET.ZC.ACK_MERGE_ITEM);
	});
});

// rAthena clif_parse_merge_item_req: 096e <len>.W { <index>.W }*, and 0974 to cancel
describe('merge requests', () => {
	it('sends the stacks ticked', () => {
		const pkt = new PACKET.CZ.REQ_MERGE_ITEM();
		pkt.itemList = [2, 7, 31];

		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(10);
		expect(view.getUint16(0, true)).toBe(0x096e);
		expect(view.getUint16(2, true)).toBe(10);
		expect([view.getInt16(4, true), view.getInt16(6, true), view.getInt16(8, true)]).toEqual([2, 7, 31]);
	});

	it('cancels', () => {
		const view = new DataView(new PACKET.CZ.CANCEL_MERGE_ITEM().build().buffer);

		expect([view.byteLength, view.getUint16(0, true)]).toEqual([2, 0x0974]);
	});
});
