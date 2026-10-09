import { describe, it, expect } from 'vitest';
import PACKET from 'Network/PacketStructure.js';
import PacketRegister from 'Network/PacketRegister.js';
import BinaryReader from 'Utils/BinaryReader.js';

function writeString(view, offset, text) {
	for (let i = 0; i < text.length; i++) {
		view.setUint8(offset + i, text.charCodeAt(i));
	}
}

function readString(view, offset, length) {
	let text = '';
	for (let i = 0; i < length && view.getUint8(offset + i); i++) {
		text += String.fromCharCode(view.getUint8(offset + i));
	}
	return text;
}

/**
 * Body of a server packet, after its 2-byte header
 */
function body(size, fill) {
	const buf = new ArrayBuffer(size - 2);
	fill(new DataView(buf));
	return buf;
}

// Layouts from rAthena (fork pin 47caf96) clif.cpp and clif_packetdb.hpp at PACKETVER 20221005
describe('battleground queue, server packets', () => {
	it('registers every one with its rAthena length', () => {
		expect(PacketRegister[0x8d8]).toBe(PACKET.ZC.ACK_ENTRY_QUEUE_APPLY);
		expect(PacketRegister[0x8d9]).toBe(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY);
		expect(PacketRegister[0x8db]).toBe(PACKET.ZC.ACK_ENTRY_QUEUE_CANCEL);
		expect(PacketRegister[0x8df]).toBe(PACKET.ZC.NOTIFY_LOBBY_ADMISSION);
		expect(PacketRegister[0x8e1]).toBe(PACKET.ZC.REPLY_ACK_LOBBY_ADMISSION);
		expect(PacketRegister[0x90e]).toBe(PACKET.ZC.ENTRY_QUEUE_INIT);

		expect(PACKET.ZC.ACK_ENTRY_QUEUE_APPLY.size).toBe(27);
		expect(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY.size).toBe(30);
		expect(PACKET.ZC.ACK_ENTRY_QUEUE_CANCEL.size).toBe(27);
		expect(PACKET.ZC.NOTIFY_LOBBY_ADMISSION.size).toBe(50);
		expect(PACKET.ZC.REPLY_ACK_LOBBY_ADMISSION.size).toBe(51);
		expect(PACKET.ZC.ENTRY_QUEUE_INIT.size).toBe(2);
	});

	// 0x8d8 <result>.B <battleground name>.24B
	it('reads the application result', () => {
		const buf = body(27, view => {
			view.setUint8(0, 7);
			writeString(view, 1, 'Tierra Gorge');
		});
		const pkt = new PACKET.ZC.ACK_ENTRY_QUEUE_APPLY(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ Result: 7, EntryQueueName: 'Tierra Gorge' });
	});

	// 0x8d9 <battleground name>.24B <queue number>.L
	it('reads the place in the queue', () => {
		const buf = body(30, view => {
			writeString(view, 0, 'Flavius');
			view.setInt32(24, 3, true);
		});
		const pkt = new PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ EntryQueueName: 'Flavius', Ranking: 3 });
	});

	// 0x8db <result>.B <battleground name>.24B
	it('reads the cancel result', () => {
		const buf = body(27, view => {
			view.setUint8(0, 1);
			writeString(view, 1, 'Flavius');
		});
		const pkt = new PACKET.ZC.ACK_ENTRY_QUEUE_CANCEL(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ Result: 1, EntryQueueName: 'Flavius' });
	});

	// 0x8df <battleground name>.24B <lobby name>.24B
	it('reads the lobby notice', () => {
		const buf = body(50, view => {
			writeString(view, 0, 'KVM (Level 80 and up)');
			writeString(view, 24, 'KVM lobby');
		});
		const pkt = new PACKET.ZC.NOTIFY_LOBBY_ADMISSION(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ EntryQueueName: 'KVM (Level 80 and up)', LobbyName: 'KVM lobby' });
	});

	// 0x8e1 <result>.B <battleground name>.24B <lobby name>.24B
	it('reads the admission answer', () => {
		const buf = body(51, view => {
			view.setUint8(0, 1);
			writeString(view, 1, 'Flavius');
			writeString(view, 25, 'Flavius lobby');
		});
		const pkt = new PACKET.ZC.REPLY_ACK_LOBBY_ADMISSION(new BinaryReader(buf), buf.byteLength);

		expect(pkt).toMatchObject({ Result: 1, EntryQueueName: 'Flavius', LobbyName: 'Flavius lobby' });
	});
});

describe('battleground queue, client packets', () => {
	// 0x8d7 <queue type>.W <battleground name>.24B
	it('applies', () => {
		const pkt = new PACKET.CZ.REQ_ENTRY_QUEUE_APPLY();
		pkt.ApplyType = 2;
		pkt.EntryQueueName = 'Tierra Gorge';
		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(28);
		expect(view.getUint16(0, true)).toBe(0x8d7);
		expect(view.getUint16(2, true)).toBe(2);
		expect(readString(view, 4, 24)).toBe('Tierra Gorge');
	});

	// 0x8da <battleground name>.24B
	it('cancels', () => {
		const pkt = new PACKET.CZ.REQ_ENTRY_QUEUE_CANCEL();
		pkt.EntryQueueName = 'Flavius';
		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(26);
		expect(view.getUint16(0, true)).toBe(0x8da);
		expect(readString(view, 2, 24)).toBe('Flavius');
	});

	// 0x8e0 <result>.B <battleground name>.24B <lobby name>.24B
	it('answers the lobby notice', () => {
		const pkt = new PACKET.CZ.REPLY_LOBBY_ADMISSION();
		pkt.Result = 2;
		pkt.EntryQueueName = 'Flavius';
		pkt.LobbyName = 'Flavius lobby';
		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(51);
		expect(view.getUint16(0, true)).toBe(0x8e0);
		expect(view.getUint8(2)).toBe(2);
		expect(readString(view, 3, 24)).toBe('Flavius');
		expect(readString(view, 27, 24)).toBe('Flavius lobby');
	});

	// 0x90a <battleground name>.24B
	it('asks for the place in the queue', () => {
		const pkt = new PACKET.CZ.REQ_ENTRY_QUEUE_RANKING();
		pkt.EntryQueueName = 'Flavius';
		const view = new DataView(pkt.build().buffer);

		expect(view.byteLength).toBe(26);
		expect(view.getUint16(0, true)).toBe(0x90a);
		expect(readString(view, 2, 24)).toBe('Flavius');
	});
});
