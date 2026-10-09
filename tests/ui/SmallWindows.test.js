import { describe, expect, it, vi, beforeEach } from 'vitest';

// The dress room, attendance reply and private airship handlers, as the official client answers them.
const mocks = vi.hoisted(() => {
	const hooks = new Map();
	const sent = [];
	const chat = [];
	const attendance = {
		__active: true,
		_host: { style: { display: '' } },
		setData: vi.fn(),
		cleanUI: vi.fn(),
		updateUI: vi.fn(),
		onClose: vi.fn()
	};
	const dressRoom = { open: vi.fn() };
	const airship = { onResult: vi.fn(() => null) };
	return { hooks, sent, chat, attendance, dressRoom, airship };
});

vi.mock('Core/Configs.js', () => ({ default: { get: () => true } }));
vi.mock('DB/DBManager.js', () => ({ default: { getMessage: (id, text) => text } }));
vi.mock('Network/NetworkManager.js', () => ({
	default: {
		hookPacket: (type, fn) => mocks.hooks.set(type, fn),
		sendPacket: pkt => mocks.sent.push(pkt)
	}
}));
vi.mock('Network/PacketStructure.js', () => {
	class PRIVATE_AIRSHIP_REQUEST {}
	return {
		default: {
			ZC: {
				UI_OPEN: 'UI_OPEN',
				UI_OPEN_V3: 'UI_OPEN_V3',
				ACK_CHECK_ATTENDANCE: 'ACK_CHECK_ATTENDANCE',
				DRESSROOM_OPEN: 'DRESSROOM_OPEN',
				PRIVATE_AIRSHIP_RESPONSE: 'PRIVATE_AIRSHIP_RESPONSE'
			},
			CZ: { PRIVATE_AIRSHIP_REQUEST }
		}
	};
});
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
vi.mock('UI/Components/CheckAttendance/CheckAttendance.js', () => ({ default: mocks.attendance }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: text => mocks.chat.push(text), TYPE: { ERROR: 1 }, FILTER: { PUBLIC_LOG: 1 } }
}));
vi.mock('UI/Components/DressRoom/DressRoom.js', () => ({ default: mocks.dressRoom }));
vi.mock('UI/Components/EnchantGrade/EnchantGrade.js', () => ({ default: {} }));
vi.mock('UI/Components/Enchant/Enchant.js', () => ({ default: {} }));
vi.mock('UI/Components/PrivateAirship/PrivateAirship.js', () => ({ default: mocks.airship }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('UI/Components/Quest/Quest.js', () => ({ default: {} }));

const { default: UIOpen } = await import('Engine/MapEngine/UIOpen.js');
UIOpen();

beforeEach(() => {
	vi.clearAllMocks();
	mocks.sent.length = 0;
	mocks.chat.length = 0;
	mocks.attendance._host.style.display = '';
});

describe('attendance reply', () => {
	it('redraws the open window with the new count, claimed today', () => {
		mocks.hooks.get('ACK_CHECK_ATTENDANCE')({ type: 0, data: 4 });

		expect(mocks.attendance.setData).toHaveBeenCalledWith(41);
		expect(mocks.attendance.cleanUI).toHaveBeenCalled();
		expect(mocks.attendance.updateUI).toHaveBeenCalled();
	});

	it('leaves a hidden window alone', () => {
		mocks.attendance._host.style.display = 'none';
		mocks.hooks.get('ACK_CHECK_ATTENDANCE')({ type: 0, data: 4 });

		expect(mocks.attendance.setData).not.toHaveBeenCalled();
	});

	it('says the claim failed and closes the window', () => {
		mocks.hooks.get('ACK_CHECK_ATTENDANCE')({ type: 1, data: 0 });

		expect(mocks.chat).toHaveLength(1);
		expect(mocks.attendance.onClose).toHaveBeenCalled();
	});
});

describe('dress room', () => {
	it('opens on ZC_DRESSROOM_OPEN', () => {
		mocks.hooks.get('DRESSROOM_OPEN')({ view: 0 });

		expect(mocks.dressRoom.open).toHaveBeenCalled();
	});
});

describe('private airship', () => {
	it('sends the map and the chosen item', () => {
		mocks.airship.onRequest('prontera', 6909);

		expect(mocks.sent).toHaveLength(1);
		expect(mocks.sent[0]).toMatchObject({ mapName: 'prontera.gat', ItemID: 6909 });
	});

	it('passes the result to the window and repeats a failure in the chat', () => {
		mocks.airship.onResult.mockReturnValueOnce('No ticket');
		mocks.hooks.get('PRIVATE_AIRSHIP_RESPONSE')({ flag: 2 });

		expect(mocks.airship.onResult).toHaveBeenCalledWith(2);
		expect(mocks.chat).toEqual(['No ticket']);
	});
});
