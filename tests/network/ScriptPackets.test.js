import { describe, it, expect } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import BinaryReader from 'Utils/BinaryReader.js';

function writeString(view, offset, text) {
	for (let i = 0; i < text.length; i++) {
		view.setUint8(offset + i, text.charCodeAt(i));
	}
}

// rAthena clif_navigateTo, after the header:
// <type>.B <flag>.B <hide window>.B <map>.16B <x>.W <y>.W <monster id>.W
describe('ZC_NAVIGATION_ACTIVE', () => {
	it('reads the target map and cell', () => {
		const buf = new ArrayBuffer(25);
		const view = new DataView(buf);
		view.setUint8(0, 0);
		view.setUint8(1, 3);
		view.setUint8(2, 1);
		writeString(view, 3, 'pay_fild08');
		view.setInt16(19, 157, true);
		view.setInt16(21, 129, true);
		view.setUint16(23, 0, true);

		const pkt = new PACKET.ZC.NAVIGATION_ACTIVE(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ type: 0, flag: 3, hideWindow: 1, mapName: 'pay_fild08', x: 157, y: 129, mobID: 0 });
		expect(PACKET.ZC.NAVIGATION_ACTIVE.size).toBe(27);
		expect(PacketRegister[0x8e2]).toBe(PACKET.ZC.NAVIGATION_ACTIVE);
	});
});

// rAthena PACKET_ZC_PLAY_NPC_BGM from 2022-05-04, after the header and length:
// <play type>.B <bgm>.?B (NUL-terminated)
describe('ZC_PLAY_NPC_BGM2', () => {
	it('reads the variable-length file name', () => {
		const name = '\\bgm\\12.mp3';
		const buf = new ArrayBuffer(1 + name.length + 1);
		const view = new DataView(buf);
		view.setUint8(0, 0);
		writeString(view, 1, name);

		const pkt = new PACKET.ZC.PLAY_NPC_BGM2(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ playType: 0, Bgm: name });
		expect(PACKET.ZC.PLAY_NPC_BGM2.size).toBe(-1);
		expect(PacketRegister[0xb8c]).toBe(PACKET.ZC.PLAY_NPC_BGM2);
	});
});
