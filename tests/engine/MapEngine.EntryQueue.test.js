import { beforeEach, describe, expect, it, vi } from 'vitest';

// The battleground queue follows the official client's handlers (kRO RagexeRE
// 2020-12-29, Recv_0x08D8..0x090E): which window opens, what is sent back.
const mocks = vi.hoisted(() => {
	const windowStub = () => ({
		__active: false,
		append: vi.fn(function () {
			this.__active = true;
		}),
		remove: vi.fn(function () {
			this.__active = false;
		}),
		toggle: vi.fn()
	});
	return {
		hooks: new Map(),
		sent: [],
		entryQueue: windowStub(),
		standBy: Object.assign(windowStub(), { setQueue: vi.fn() }),
		request: Object.assign(windowStub(), { setName: vi.fn() }),
		entries: [
			{ id: 1, name: 'Tierra Gorge', displayName: 'Tierra Valley', teamA: 10, teamB: 10 },
			{ id: 2, name: 'Flavius', displayName: 'Flavius', teamA: 10, teamB: 10 }
		]
	};
});

vi.mock('Network/NetworkManager.js', () => ({
	default: { hookPacket: (struct, fn) => mocks.hooks.set(struct, fn), sendPacket: pkt => mocks.sent.push(pkt) }
}));
vi.mock('DB/DBManager.js', () => ({
	default: {
		getMessage: (id, fallback) => fallback,
		getEntryQueueByName: name => mocks.entries.find(entry => entry.name === name) || null
	}
}));
vi.mock('Audio/SoundManager.js', () => ({ default: { play: vi.fn() } }));
vi.mock('UI/UIManager.js', () => ({ default: { showMessageBox: vi.fn() } }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: vi.fn(), TYPE: { INFO: 1 }, FILTER: { PUBLIC_LOG: 0 } }
}));
vi.mock('UI/Components/EntryQueue/EntryQueue.js', () => ({ default: mocks.entryQueue }));
vi.mock('UI/Components/EntryQueue/EntryQueueStandBy.js', () => ({ default: mocks.standBy }));
vi.mock('UI/Components/EntryQueue/EntryQueueRequest.js', () => ({ default: mocks.request }));

const { default: EntryQueueEngine, getEntryQueueState } = await import('Engine/MapEngine/EntryQueue.js');
const PACKET = (await import('Network/PacketStructure.js')).default;
const UIManager = (await import('UI/UIManager.js')).default;

const receive = (struct, pkt) => mocks.hooks.get(struct)(pkt);

describe('battleground queue engine', () => {
	beforeEach(() => {
		mocks.hooks.clear();
		mocks.sent.length = 0;
		for (const ui of [mocks.entryQueue, mocks.standBy, mocks.request]) {
			ui.__active = false;
		}
		vi.clearAllMocks();
		EntryQueueEngine();
	});

	it('applies for the battleground chosen in the list', () => {
		mocks.entryQueue.onSelect(mocks.entries[0]);
		mocks.entryQueue.onApply(2, mocks.entries[0]);

		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.REQ_ENTRY_QUEUE_APPLY);
		expect(mocks.sent[0]).toMatchObject({ ApplyType: 2, EntryQueueName: 'Tierra Gorge' });
	});

	it('opens the waiting window when the application is accepted', () => {
		receive(PACKET.ZC.ACK_ENTRY_QUEUE_APPLY, { Result: 1, EntryQueueName: 'Flavius' });

		expect(mocks.standBy.append).toHaveBeenCalled();
		expect(getEntryQueueState().inQueue).toBe(true);
	});

	it('explains a refused application', () => {
		receive(PACKET.ZC.ACK_ENTRY_QUEUE_APPLY, { Result: 7, EntryQueueName: 'Flavius' });

		expect(UIManager.showMessageBox).toHaveBeenCalledWith('Request has duplicated.', 'ok');
		expect(mocks.standBy.append).not.toHaveBeenCalled();
	});

	it('shows the place in the queue, and closes the list', () => {
		mocks.entryQueue.__active = true;
		receive(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, { EntryQueueName: 'Flavius', Ranking: 4 });

		expect(mocks.standBy.setQueue).toHaveBeenCalledWith('Flavius', 20, 4);
		expect(mocks.entryQueue.remove).toHaveBeenCalled();
	});

	it('asks for the place in the queue from the menu while queued, else opens the list', () => {
		mocks.entryQueue.onMenuButton();
		expect(mocks.entryQueue.toggle).toHaveBeenCalledTimes(1);

		receive(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, { EntryQueueName: 'Flavius', Ranking: 4 });
		mocks.entryQueue.onMenuButton();

		expect(mocks.entryQueue.toggle).toHaveBeenCalledTimes(1);
		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.REQ_ENTRY_QUEUE_RANKING);
		expect(mocks.sent[0].EntryQueueName).toBe('Flavius');
	});

	it('leaves the queue from the waiting window', () => {
		receive(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, { EntryQueueName: 'Flavius', Ranking: 1 });
		mocks.standBy.onCancel();

		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.REQ_ENTRY_QUEUE_CANCEL);
		expect(mocks.sent[0].EntryQueueName).toBe('Flavius');

		receive(PACKET.ZC.ACK_ENTRY_QUEUE_CANCEL, { Result: 1, EntryQueueName: 'Flavius' });
		expect(mocks.standBy.remove).toHaveBeenCalled();
		expect(getEntryQueueState()).toMatchObject({ inQueue: false, entry: null });
	});

	it('asks to enter when the battleground is ready, and answers with both names', () => {
		receive(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, { EntryQueueName: 'Tierra Gorge', Ranking: 1 });
		receive(PACKET.ZC.NOTIFY_LOBBY_ADMISSION, { EntryQueueName: 'Tierra Gorge', LobbyName: 'Tierra lobby' });

		expect(mocks.request.append).toHaveBeenCalled();
		expect(mocks.request.setName).toHaveBeenCalledWith('Tierra Valley');

		mocks.request.onAnswer(true);
		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.REPLY_LOBBY_ADMISSION);
		expect(mocks.sent[0]).toMatchObject({ Result: 1, EntryQueueName: 'Tierra Gorge', LobbyName: 'Tierra lobby' });
	});

	it('declines with 2 and leaves the queue', () => {
		receive(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, { EntryQueueName: 'Flavius', Ranking: 1 });
		receive(PACKET.ZC.NOTIFY_LOBBY_ADMISSION, { EntryQueueName: 'Flavius', LobbyName: 'Flavius' });
		mocks.request.onAnswer(false);

		expect(mocks.sent[0].Result).toBe(2);
		expect(getEntryQueueState().inQueue).toBe(false);
	});

	it('forgets the queue on ZC_ENTRY_QUEUE_INIT', () => {
		receive(PACKET.ZC.NOTIFY_ENTRY_QUEUE_APPLY, { EntryQueueName: 'Flavius', Ranking: 1 });
		receive(PACKET.ZC.ENTRY_QUEUE_INIT, {});

		expect(getEntryQueueState()).toMatchObject({ inQueue: false, entry: null });
	});
});
