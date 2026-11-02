import { afterEach, describe, expect, it } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PACKETVER from 'Network/PacketVerManager.js';
import BinaryReader from 'Utils/BinaryReader.js';

// A store assistant (0x0a89, 0x0b05) is drawn as a player with the shop owner's
// name over it. Every other spawn packet decodes that name as text, so a UTF-8
// name such as a Japanese one has to come out the same way here.

const NAME_LENGTH = 24;
const OWNER = 'テスト商人';

const originalVersion = PACKETVER.value;
afterEach(() => {
	PACKETVER.value = originalVersion;
});

function u32(value) {
	return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
}

function u16(value) {
	return [value & 0xff, (value >>> 8) & 0xff];
}

/** A NUL-padded fixed-size field holding `text` as UTF-8, as the server sends it. */
function fixed(text, size) {
	const out = new Array(size).fill(0);
	out.splice(0, 0, ...new TextEncoder().encode(text));
	return out.slice(0, size);
}

/** Everything before the name, in the 20181121+ layout (long weapon and shield). */
function look() {
	return [
		...u32(150001), // GID
		...u16(4252), // job
		...u16(0),
		...u16(150), // x
		...u16(180), // y
		1, // sex
		...u16(5), // head
		...u32(1201), // weapon
		...u32(2101), // shield
		...u16(0),
		...u16(0),
		...u16(0),
		...u16(0),
		...u16(0),
		...u16(0)
	];
}

function parse(Struct, bytes) {
	const buf = new ArrayBuffer(bytes.length);
	new Uint8Array(buf).set(bytes);
	const fp = new BinaryReader(buf);
	return { pkt: new Struct(fp, buf.byteLength), fp };
}

describe('store assistant owner name', () => {
	it('decodes PACKET.ZC.STORE_ASSISTANT_ENTRY (0x0a89)', () => {
		PACKETVER.value = 20221005;
		const { pkt, fp } = parse(PACKET.ZC.STORE_ASSISTANT_ENTRY, [...look(), ...fixed(OWNER, NAME_LENGTH)]);

		expect(pkt.name).toBe(OWNER);
		expect(pkt.PosDir.slice(0, 2)).toEqual([150, 180]);
		expect(fp.tell()).toBe(59); // 61 bytes less the opcode
	});

	it('decodes PACKET.ZC.STORE_ASSISTANT_ENTRY_V2 (0x0b05)', () => {
		PACKETVER.value = 20221005;
		const { pkt, fp } = parse(PACKET.ZC.STORE_ASSISTANT_ENTRY_V2, [
			...look(),
			...fixed(OWNER, NAME_LENGTH),
			...u16(0)
		]);

		expect(pkt.name).toBe(OWNER);
		expect(fp.tell()).toBe(61); // 63 bytes less the opcode
	});
});
