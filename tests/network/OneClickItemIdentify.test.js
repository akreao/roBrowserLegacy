import { describe, expect, it } from 'vitest';
import PACKET from 'Network/PacketStructure.js';

describe('CZ_REQ_ONECLICK_ITEMIDENTIFY', () => {
	it('sends the item index in 4 bytes', () => {
		const packet = new PACKET.CZ.REQ_ONECLICK_ITEMIDENTIFY();
		packet.index = 7;
		const writer = packet.build();
		expect(Array.from(new Uint8Array(writer.buffer))).toEqual([0x35, 0x0a, 7, 0]);
		expect(PACKET.CZ.REQ_ONECLICK_ITEMIDENTIFY.size).toBe(4);
		expect(packet.constructor.name).toBe('PACKET_CZ_REQ_ONECLICK_ITEMIDENTIFY');
	});
});
