import { beforeEach, describe, expect, it, vi } from 'vitest';

// The merge handlers in Engine/MapEngine/Item.js are module-private and only
// reachable through the hooks ItemEngine() registers.
const mocks = vi.hoisted(() => ({
	hooks: new Map(),
	sent: [],
	chat: [],
	updated: [],
	merge: null
}));

vi.mock('Network/NetworkManager.js', () => ({
	default: {
		hookPacket: (struct, fn) => mocks.hooks.set(struct, fn),
		sendPacket: pkt => mocks.sent.push(pkt)
	}
}));

vi.mock('DB/DBManager.js', () => ({ default: { getMessage: (id, text) => text, INTERFACE_PATH: '' } }));
vi.mock('Core/Configs.js', () => ({ default: { get: (_k, d) => d } }));
vi.mock('Renderer/ItemObject.js', () => ({ default: {} }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: {} }));
vi.mock('Renderer/EffectManager.js', () => ({ default: {} }));
vi.mock('Renderer/EntityManager.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: {
		addText: (text, type, filter, color) => mocks.chat.push({ text, type, color }),
		TYPE: { INFO: 'info', ERROR: 'error' },
		FILTER: {}
	}
}));
vi.mock('UI/Components/ItemObtain/ItemObtain.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemSelection/ItemSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: { getUI: () => ({ updateItem: (index, count) => mocks.updated.push([index, count]) }) }
}));
vi.mock('UI/Components/CartItems/CartItems.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));
vi.mock('UI/Components/PlayerViewEquip/PlayerViewEquip.js', () => ({ default: {} }));
vi.mock('UI/Components/SwitchEquip/SwitchEquip.js', () => ({ default: {} }));
vi.mock('UI/Components/MakeItemSelection/MakeItemSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/MakeItemSelection/ItemListWindowSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/Storage/Storage.js', () => ({ default: {} }));
vi.mock('UI/Components/MergeItem/MergeItem.js', () => {
	mocks.merge = {
		__active: false,
		opened: null,
		open(list) {
			this.__active = true;
			this.opened = list;
		},
		remove() {
			this.__active = false;
		}
	};
	return { default: mocks.merge };
});

const ItemEngine = (await import('Engine/MapEngine/Item.js')).default;
const PACKET = (await import('Network/PacketStructure.js')).default;

ItemEngine();

function deliver(struct, pkt) {
	mocks.hooks.get(struct)(pkt);
}

describe('Item merge', () => {
	beforeEach(() => {
		mocks.sent.length = 0;
		mocks.chat.length = 0;
		mocks.updated.length = 0;
		mocks.merge.__active = false;
		mocks.merge.opened = null;
	});

	it('opens the window on the stacks offered', () => {
		deliver(PACKET.ZC.MERGE_ITEM_OPEN, { itemList: [2, 7] });

		expect(mocks.merge.opened).toEqual([2, 7]);
		expect(mocks.sent).toEqual([]);
	});

	it('answers an empty offer with a cancel, as the official client does', () => {
		deliver(PACKET.ZC.MERGE_ITEM_OPEN, { itemList: [] });

		expect(mocks.merge.opened).toBe(null);
		expect(mocks.sent).toHaveLength(1);
		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.CANCEL_MERGE_ITEM);
	});

	it('sends the ticked stacks, and cancels on close', () => {
		mocks.merge.onMerge([2, 7]);
		mocks.merge.onCancel();

		expect(mocks.sent[0]).toBeInstanceOf(PACKET.CZ.REQ_MERGE_ITEM);
		expect(mocks.sent[0].itemList).toEqual([2, 7]);
		expect(mocks.sent[1]).toBeInstanceOf(PACKET.CZ.CANCEL_MERGE_ITEM);
	});

	it('gives the stack that remains its new amount and closes the window', () => {
		mocks.merge.open([2, 7]);
		deliver(PACKET.ZC.ACK_MERGE_ITEM, { index: 2, amount: 300, reason: 0 });

		expect(mocks.updated).toEqual([[2, 300]]);
		expect(mocks.chat).toEqual([{ text: 'Items merged.', type: 'info', color: '#ffff64' }]);
		expect(mocks.merge.__active).toBe(false);
	});

	it('reports a failure, leaves the inventory alone and closes the window', () => {
		mocks.merge.open([2, 7]);
		deliver(PACKET.ZC.ACK_MERGE_ITEM, { index: 0, amount: 0, reason: 2 });

		expect(mocks.updated).toEqual([]);
		expect(mocks.chat[0].type).toBe('error');
		expect(mocks.merge.__active).toBe(false);
	});
});
