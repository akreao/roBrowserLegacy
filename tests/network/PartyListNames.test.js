import { describe, it, expect } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import BinaryReader from 'Utils/BinaryReader.js';

// The party list arrives in three generations (0x00fb, 0x0a44, 0x0ae5). Every
// other packet that carries a character name - the add-member, leave and chat
// packets among them - decodes it as text, so the list has to as well: the
// party window matches members across those packets by name, and draws it.

const NAME_LENGTH = 24;
const PARTY = 'パーティー';
const MEMBER = 'テスト';

function u32(value) {
	return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
}

function u16(value) {
	return [value & 0xff, (value >>> 8) & 0xff];
}

/** A NUL-padded fixed-size field holding `text` as UTF-8, as rAthena sends it. */
function fixed(text, size) {
	const out = new Array(size).fill(0);
	out.splice(0, 0, ...new TextEncoder().encode(text));
	return out.slice(0, size);
}

function parse(Struct, bytes) {
	const buf = new ArrayBuffer(bytes.length);
	new Uint8Array(buf).set(bytes);
	return new Struct(new BinaryReader(buf), buf.byteLength);
}

describe('party list names', () => {
	it('decodes PACKET.ZC.GROUP_LIST (0x00fb)', () => {
		const pkt = parse(PACKET.ZC.GROUP_LIST, [
			...fixed(PARTY, NAME_LENGTH),
			...u32(2000001),
			...fixed(MEMBER, NAME_LENGTH),
			...fixed('prontera.gat', 16),
			0,
			0
		]);

		expect(pkt.groupName).toBe(PARTY);
		expect(pkt.groupInfo[0].characterName).toBe(MEMBER);
	});

	it('decodes PACKET.ZC.GROUP_LIST2 (0x0a44)', () => {
		const pkt = parse(PACKET.ZC.GROUP_LIST2, [
			...fixed(PARTY, NAME_LENGTH),
			...u32(2000001),
			...fixed(MEMBER, NAME_LENGTH),
			...fixed('prontera.gat', 16),
			0,
			0,
			...u16(4008),
			...u16(99)
		]);

		expect(pkt.groupName).toBe(PARTY);
		expect(pkt.groupInfo[0].characterName).toBe(MEMBER);
		expect(pkt.groupInfo[0].mapName).toBe('prontera.gat');
		expect(pkt.groupInfo[0].baseLevel).toBe(99);
	});

	it('decodes PACKET.ZC.GROUP_LIST3 (0x0ae5)', () => {
		const pkt = parse(PACKET.ZC.GROUP_LIST3, [
			...fixed(PARTY, NAME_LENGTH),
			...u32(2000001),
			...u32(150001),
			...fixed(MEMBER, NAME_LENGTH),
			...fixed('prontera.gat', 16),
			0,
			1,
			...u16(4252),
			...u16(200)
		]);

		expect(pkt.groupName).toBe(PARTY);
		expect(pkt.groupInfo[0].characterName).toBe(MEMBER);
		expect(pkt.groupInfo[0].mapName).toBe('prontera.gat');
		expect(pkt.groupInfo[0].class_).toBe(4252);
		expect(pkt.groupInfo[0].baseLevel).toBe(200);
	});

	// The window finds a member to remove by AID and name; the leave packet
	// decodes its name, so the list's name has to come out the same.
	it('names a member the same way the leave packet does', () => {
		const list = parse(PACKET.ZC.GROUP_LIST3, [
			...fixed(PARTY, NAME_LENGTH),
			...u32(2000001),
			...u32(150001),
			...fixed(MEMBER, NAME_LENGTH),
			...fixed('prontera.gat', 16),
			0,
			0,
			...u16(0),
			...u16(1)
		]);
		const leave = parse(PACKET.ZC.DELETE_MEMBER_FROM_GROUP, [...u32(2000001), ...fixed(MEMBER, NAME_LENGTH), 0]);

		expect(leave.characterName).toBe(list.groupInfo[0].characterName);
	});
});
