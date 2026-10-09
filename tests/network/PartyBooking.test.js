import { describe, it, expect, beforeAll } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import PacketVersions from 'Network/PacketVersions.js';
import BinaryReader from 'Utils/BinaryReader.js';

// Party booking at the 2018+ packet versions. rAthena (and the official 2020
// client) use the 2009 ids for search, delete and update there; only the
// register request moved with the shuffle tables. Before this, roBrowser sent
// its search as 0x08e7 and its delete as 0x08eb, which the server reads as
// something else.

function bytes(pkt) {
	return Array.from(new Uint8Array(pkt.buffer));
}

function u16(value) {
	return [value & 0xff, (value >> 8) & 0xff];
}

function u32(value) {
	return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
}

function name(text) {
	const out = new Array(24).fill(0);
	for (let i = 0; i < text.length; ++i) {
		out[i] = text.charCodeAt(i);
	}
	return out;
}

beforeAll(() => {
	Object.keys(PacketVersions).forEach(date => PACKETVER.addSupport(date, PacketVersions[date]));
	PACKETVER.value = 20221005;
});

describe('party booking requests at 20221005', () => {
	it('registers as 0x0802 with level, map and all six jobs', () => {
		const pkt = new PACKET.CZ.PARTY_BOOKING_REQ_REGISTER();
		pkt.RegisterInfo = { Level: 50, MapID: 0x0203, Job: [5, 11, 1, -1, -1, -1] };

		expect(bytes(pkt.build())).toEqual([
			...u16(0x0802),
			...u16(50),
			...u16(0x0203),
			...[5, 11, 1, -1, -1, -1].flatMap(u16)
		]);
	});

	it('searches as 0x0804, 14 bytes', () => {
		const pkt = new PACKET.CZ.PARTY_BOOKING_REQ_SEARCH();
		pkt.Level = 60;
		pkt.MapID = 0;
		pkt.Job = -1;
		pkt.LastIndex = 7;
		pkt.ResultCount = 10;

		expect(bytes(pkt.build())).toEqual([...u16(0x0804), ...u16(60), ...u16(0), ...u16(-1), ...u32(7), ...u16(10)]);
	});

	it('deletes as a bare 0x0806', () => {
		expect(bytes(new PACKET.CZ.PARTY_BOOKING_REQ_DELETE().build())).toEqual(u16(0x0806));
	});

	it('updates as 0x0808 with all six jobs', () => {
		const pkt = new PACKET.CZ.PARTY_BOOKING_REQ_UPDATE();
		pkt.Job = [24, 30, 2, 3, -1, -1];

		expect(bytes(pkt.build())).toEqual([...u16(0x0808), ...[24, 30, 2, 3, -1, -1].flatMap(u16)]);
	});
});

describe('PACKET.ZC.PARTY_BOOKING_ACK_SEARCH (0x0805)', () => {
	it('reads 48-byte ads after the more-results flag', () => {
		const ad = (index, who, level) => [
			...u32(index),
			...name(who),
			...u32(1700000000),
			...u16(level),
			...u16(0x0101),
			...[5, 6, -1, -1, -1, -1].flatMap(u16)
		];
		const body = [1, ...ad(3, 'Alice', 40), ...ad(9, 'Bob', 75)];
		const buf = new Uint8Array(body).buffer;
		const pkt = new PACKET.ZC.PARTY_BOOKING_ACK_SEARCH(new BinaryReader(buf), buf.byteLength);

		expect(pkt.IsExistMoreResult).toBe(1);
		expect(pkt.Info).toHaveLength(2);
		expect(pkt.Info[1].Index).toBe(9);
		expect(pkt.Info[1].CharName).toBe('Bob');
		expect(pkt.Info[1].Detail.Level).toBe(75);
		expect(pkt.Info[1].Detail.MapID).toBe(0x0101);
		expect(pkt.Info[1].Detail.Job).toEqual([5, 6, -1, -1, -1, -1]);
	});
});
