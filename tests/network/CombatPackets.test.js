import { describe, it, expect } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import BinaryReader from 'Utils/BinaryReader.js';

function read(Struct, bytes, write) {
	const buf = new ArrayBuffer(bytes);
	write(new DataView(buf));
	return new Struct(new BinaryReader(buf), buf.byteLength);
}

// rAthena PACKET_ZC_SPIRITS_ATTRIBUTE: <aid>.L <type>.W <num>.W
describe('ZC_SPIRITS_ATTRIBUTE', () => {
	it('reads the charm type and count', () => {
		const pkt = read(PACKET.ZC.SPIRITS_ATTRIBUTE, 8, view => {
			view.setUint32(0, 150001, true);
			view.setInt16(4, 3, true);
			view.setInt16(6, 10, true);
		});

		expect(pkt).toMatchObject({ AID: 150001, spiritsType: 3, num: 10 });
		expect(PACKET.ZC.SPIRITS_ATTRIBUTE.size).toBe(10);
		expect(PacketRegister[0x8cf]).toBe(PACKET.ZC.SPIRITS_ATTRIBUTE);
	});
});

// rAthena PACKET_ZC_SOULENERGY: <aid>.L <num>.W
describe('ZC_SOULENERGY', () => {
	it('reads the soul count', () => {
		const pkt = read(PACKET.ZC.SOULENERGY, 6, view => {
			view.setUint32(0, 150001, true);
			view.setUint16(4, 20, true);
		});

		expect(pkt).toMatchObject({ AID: 150001, num: 20 });
		expect(PACKET.ZC.SOULENERGY.size).toBe(8);
		expect(PacketRegister[0xb73]).toBe(PACKET.ZC.SOULENERGY);
	});
});

// rAthena PACKET_ZC_SUMMON_HP_INIT: <summon aid>.L <hp>.L <max hp>.L
// rAthena PACKET_ZC_SUMMON_HP_UPDATE: <summon aid>.L <var id>.W <value>.L
describe('ZC_SUMMON_HP', () => {
	it('reads the summon HP', () => {
		const init = read(PACKET.ZC.SUMMON_HP_INIT, 12, view => {
			view.setUint32(0, 110000123, true);
			view.setUint32(4, 2500, true);
			view.setUint32(8, 4000, true);
		});

		expect(init).toMatchObject({ summonAID: 110000123, CurrentHP: 2500, MaxHP: 4000 });
		expect(PACKET.ZC.SUMMON_HP_INIT.size).toBe(14);
		expect(PacketRegister[0xb6b]).toBe(PACKET.ZC.SUMMON_HP_INIT);
	});

	it('reads one HP change', () => {
		const update = read(PACKET.ZC.SUMMON_HP_UPDATE, 10, view => {
			view.setUint32(0, 110000123, true);
			view.setUint16(4, 5, true);
			view.setUint32(6, 1800, true);
		});

		expect(update).toMatchObject({ summonAID: 110000123, VarId: 5, Value: 1800 });
		expect(PACKET.ZC.SUMMON_HP_UPDATE.size).toBe(12);
		expect(PacketRegister[0xb6c]).toBe(PACKET.ZC.SUMMON_HP_UPDATE);
	});
});
