import { beforeEach, describe, expect, it, vi } from 'vitest';

// The answers to /ex, /in, /exall, /inall and the refused list, printed the
// way the official client prints them (kRO RagexeRE 2020-12-29, 0x00D1,
// 0x00D2 and 0x00D4).
const mocks = vi.hoisted(() => ({ hooks: new Map(), sent: [], lines: [] }));

vi.mock('Network/NetworkManager.js', () => ({
	default: { hookPacket: (struct, fn) => mocks.hooks.set(struct, fn), sendPacket: pkt => mocks.sent.push(pkt) }
}));
vi.mock('DB/DBManager.js', () => ({ default: { getMessage: id => `msg ${id}` } }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: {
		addText: (text, type, filter, color) => mocks.lines.push([text, color]),
		TYPE: { INFO: 1 },
		FILTER: { PUBLIC_LOG: 0 }
	}
}));
vi.mock('UI/Components/WhisperBox/WhisperBox.js', () => ({ default: { instances: {}, preferences: {} } }));
vi.mock('Engine/MapEngine/Friends.js', () => ({ default: { isFriend: () => false } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));

const PrivateMessageEngine = (await import('Engine/MapEngine/PrivateMessage.js')).default;
const PACKET = (await import('Network/PacketStructure.js')).default;

describe('Whisper settings', () => {
	beforeEach(() => {
		mocks.hooks.clear();
		mocks.sent.length = 0;
		mocks.lines.length = 0;
		PrivateMessageEngine();
	});

	it('names the player from /ex or /in in the answer', () => {
		PrivateMessageEngine.requestWhisperPC('Poring', 0);
		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.SETTING_WHISPER_PC);
		expect(mocks.sent[0]).toMatchObject({ name: 'Poring', type: 0 });

		const onAnswer = mocks.hooks.get(PACKET.ZC.SETTING_WHISPER_PC);
		onAnswer({ type: 0, result: 0 });
		onAnswer({ type: 0, result: 1 });
		onAnswer({ type: 0, result: 2 });
		onAnswer({ type: 1, result: 0 });
		onAnswer({ type: 1, result: 1 });
		onAnswer({ type: 1, result: 2 });
		expect(mocks.lines).toEqual([
			['Poringmsg 194', '#ffff00'],
			['Poringmsg 195', '#ffff00'],
			['Poringmsg 196', '#ffff00'],
			['Poringmsg 197', '#ffff00'],
			['Poringmsg 198', '#ffff00']
		]);
	});

	it('answers /exall and /inall', () => {
		PrivateMessageEngine.requestWhisperState(1);
		expect(mocks.sent[0]).toMatchObject({ type: 1 });

		const onAnswer = mocks.hooks.get(PACKET.ZC.SETTING_WHISPER_STATE);
		onAnswer({ type: 0, result: 0 });
		onAnswer({ type: 0, result: 1 });
		onAnswer({ type: 1, result: 0 });
		onAnswer({ type: 1, result: 1 });
		onAnswer({ type: 2, result: 0 });
		expect(mocks.lines.map(line => line[0])).toEqual(['msg 3427', 'msg 3428', 'msg 3429', 'msg 3430']);
	});

	it('lists the refused players', () => {
		PrivateMessageEngine.requestWhisperList();
		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.REQ_WHISPER_LIST);

		const onList = mocks.hooks.get(PACKET.ZC.WHISPER_LIST);
		onList({ wisperList: [] });
		onList({ wisperList: [{ name: 'Poring' }, { name: 'Drops' }] });
		expect(mocks.lines).toEqual([
			['msg 3395', '#00ffff'],
			['msg 3396', '#00ffff'],
			['Poring', '#00ffff'],
			['Drops', '#00ffff']
		]);
	});
});
