import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import PacketVersions from 'Network/PacketVersions.js';
import PACKETVER from 'Network/PacketVerManager.js';
import BinaryReader from 'Utils/BinaryReader.js';

beforeAll(() => {
	for (const date of Object.keys(PacketVersions)) {
		PACKETVER.addSupport(date, PacketVersions[date]);
	}
});

beforeEach(() => {
	PACKETVER.value = 20221005;
});

function body(bytes) {
	const buf = new ArrayBuffer(bytes.length);
	new Uint8Array(buf).set(bytes);
	return buf;
}

// rAthena clif_dressing_room: 0A02 <view>.W
describe('ZC_DRESSROOM_OPEN', () => {
	it('is registered and reads the view', () => {
		const buf = body([3, 0]);
		const pkt = new PACKET.ZC.DRESSROOM_OPEN(new BinaryReader(buf), buf.byteLength);

		expect(pkt.view).toBe(3);
		expect(PACKET.ZC.DRESSROOM_OPEN.size).toBe(4);
		expect(PacketRegister[0xa02]).toBe(PACKET.ZC.DRESSROOM_OPEN);
	});
});

// rAthena clif_attendence_response: 0AF0 <unknown>.L <data>.L
describe('ZC_ACK_CHECK_ATTENDANCE', () => {
	it('is registered and reads the type and the new count', () => {
		const buf = new ArrayBuffer(8);
		const view = new DataView(buf);
		view.setUint32(0, 0, true);
		view.setUint32(4, 7, true);
		const pkt = new PACKET.ZC.ACK_CHECK_ATTENDANCE(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ type: 0, data: 7 });
		expect(PACKET.ZC.ACK_CHECK_ATTENDANCE.size).toBe(10);
		expect(PacketRegister[0xaf0]).toBe(PACKET.ZC.ACK_CHECK_ATTENDANCE);
	});
});

// rAthena clif_private_airship_response: 0A4A <response>.L
describe('ZC_PRIVATE_AIRSHIP_RESPONSE', () => {
	it('is registered and reads the result', () => {
		const buf = body([4, 0, 0, 0]);
		const pkt = new PACKET.ZC.PRIVATE_AIRSHIP_RESPONSE(new BinaryReader(buf), buf.byteLength);

		expect(pkt.flag).toBe(4);
		expect(PACKET.ZC.PRIVATE_AIRSHIP_RESPONSE.size).toBe(6);
		expect(PacketRegister[0xa4a]).toBe(PACKET.ZC.PRIVATE_AIRSHIP_RESPONSE);
	});
});

// rAthena PACKET_CZ_PRIVATE_AIRSHIP_REQUEST: 0A49 <map name>.16B <item id>.L (.W before 2018-11-21)
describe('CZ_PRIVATE_AIRSHIP_REQUEST', () => {
	function build() {
		const pkt = new PACKET.CZ.PRIVATE_AIRSHIP_REQUEST();
		pkt.mapName = 'prontera.gat';
		pkt.ItemID = 25464;
		return new DataView(pkt.build().buffer);
	}

	it('writes the map and a 4-byte item id at 20221005', () => {
		const view = build();

		expect(view.byteLength).toBe(22);
		expect(view.getUint16(0, true)).toBe(0xa49);
		const name = String.fromCharCode(...new Uint8Array(view.buffer, 2, 12));
		expect(name).toBe('prontera.gat');
		expect(view.getUint8(14)).toBe(0);
		expect(view.getUint32(18, true)).toBe(25464);
	});

	it('writes a 2-byte item id before 2018-11-21', () => {
		PACKETVER.value = 20180620;
		const view = build();

		expect(view.byteLength).toBe(20);
		expect(view.getUint16(18, true)).toBe(25464);
	});
});
