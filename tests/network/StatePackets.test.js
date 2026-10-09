import { describe, it, expect } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import BinaryReader from 'Utils/BinaryReader.js';

// Three ten-byte packets rAthena sends at 20221005 that roBrowser did not
// register: Crimson Marker positions, a party member's job and level, and a
// script removing an effect from an entity.

function parse(Struct, view) {
	return new Struct(new BinaryReader(view.buffer), view.byteLength);
}

describe('state packets', () => {
	it('registers 0x09c1, 0x0abd and 0x0b0d', () => {
		expect(PacketRegister[0x9c1]).toBe(PACKET.ZC.C_MARKERINFO);
		expect(PacketRegister[0xabd]).toBe(PACKET.ZC.NOTIFY_MEMBERINFO_TO_GROUPM);
		expect(PacketRegister[0xb0d]).toBe(PACKET.ZC.REMOVE_EFFECT);
	});

	it('reads a Crimson Marker removal as -1, -1', () => {
		const view = new DataView(new ArrayBuffer(8));
		view.setUint32(0, 110001, true);
		view.setInt16(4, -1, true);
		view.setInt16(6, -1, true);
		const pkt = parse(PACKET.ZC.C_MARKERINFO, view);

		expect(pkt.AID).toBe(110001);
		expect(pkt.xPos).toBe(-1);
		expect(pkt.yPos).toBe(-1);
	});

	it('reads a party member job and level', () => {
		const view = new DataView(new ArrayBuffer(8));
		view.setUint32(0, 2000001, true);
		view.setInt16(4, 4060, true);
		view.setInt16(6, 175, true);
		const pkt = parse(PACKET.ZC.NOTIFY_MEMBERINFO_TO_GROUPM, view);

		expect(pkt.AID).toBe(2000001);
		expect(pkt.job).toBe(4060);
		expect(pkt.level).toBe(175);
	});

	it('reads the effect to remove', () => {
		const view = new DataView(new ArrayBuffer(8));
		view.setUint32(0, 110002, true);
		view.setInt32(4, 347, true);
		const pkt = parse(PACKET.ZC.REMOVE_EFFECT, view);

		expect(pkt.AID).toBe(110002);
		expect(pkt.effectID).toBe(347);
	});
});
