/**
 * tests/ui/ItemInfo.cardWindow.test.js
 *
 * A card right-clicked in a card slot opens in a second item window, as in the official client.
 */
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.ui = { show: vi.fn(), hide: vi.fn(), is: vi.fn(() => true) };
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
		focus() {}
		// Enough of the real lifecycle: init once, then onAppend / onRemove
		append() {
			if (!this.__inited) {
				this.__inited = true;
				this.init?.();
			}
			this.__active = true;
			this.onAppend?.();
		}
		remove() {
			this.__active = false;
			this.onRemove?.();
		}
	}
	return { MockGUIComponent, pending: [], missing: new Set() };
});

const items = {
	1: { identifiedResourceName: 'apple', identifiedDescriptionName: [] },
	2: { identifiedResourceName: 'c_dimensional_sword', identifiedDescriptionName: [] },
	1101: { identifiedResourceName: 'sword', identifiedDescriptionName: [], slotCount: 2, identifiedDisplayName: 'Sword' },
	4001: { identifiedResourceName: 'card', identifiedDescriptionName: [], identifiedDisplayName: 'Poring Card' }
};

// Anything else the window asks the DB for answers empty.
vi.mock('DB/DBManager.js', () => ({
	default: new Proxy(
		{ INTERFACE_PATH: '', getItemInfo: id => items[id], isPetEgg: () => false, formatMsgToHtml: s => s },
		{ get: (target, key) => (key in target ? target[key] : () => '') }
	)
}));
// Images answer later, in the order a test releases them
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(path, onload, onerror) {
			mocks.pending.push(() => (mocks.missing.has(path) ? onerror?.("Can't get file") : onload?.(`img:${path}`)));
		}
	}
}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			return component;
		}
	}
}));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: vi.fn(), hookPacket: vi.fn() } }));
vi.mock('Network/PacketStructure.js', () => ({ default: { CZ: {}, ZC: {} } }));
vi.mock('UI/Components/CardIllustration/CardIllustration.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: { ui: true, remove: vi.fn() } }));
vi.mock('UI/Components/ItemPreview/ItemPreview.js', () => ({ default: { ui: true, remove: vi.fn() } }));
vi.mock('UI/Components/MakeReadBook/MakeReadBook.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: {} }));
vi.mock('UI/Components/Navigation/Navigation.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800, render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: function Entity() {} }));
vi.mock('Loaders/Sprite.js', () => ({ default: {} }));
vi.mock('Loaders/Action.js', () => ({ default: {} }));
vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, setType: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

const { default: ItemInfo, ItemInfoCard } = await import('UI/Components/ItemInfo/ItemInfo.js');

function answerAll() {
	while (mocks.pending.length) mocks.pending.shift()();
}

it('opens a right-clicked card in its own window and keeps the item', () => {
	ItemInfo.append();
	ItemInfo.uid = 1101;
	ItemInfo.setItem({ ITID: 1101, IsIdentified: true, type: 5, slot: { card1: 4001, card2: 0, card3: 0, card4: 0 } });
	answerAll();
	const setCard = vi.spyOn(ItemInfoCard, 'setItem');

	const icon = ItemInfo.getRoot().querySelector('.cardlist .item[data-index="0"] .icon');
	icon.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));

	expect(ItemInfoCard.__active).toBe(true);
	expect(setCard).toHaveBeenCalledWith({ ITID: 4001, IsIdentified: true, type: 6 });
	expect(ItemInfo.uid).toBe(1101);
	expect(ItemInfoCard).not.toBe(ItemInfo);
	expect(ItemInfoCard.scaleName).toBe('ItemInfo');
});

it('closes only itself on Escape or its close button', async () => {
	const { default: ItemCompare } = await import('UI/Components/ItemCompare/ItemCompare.js');
	const { default: ItemPreview } = await import('UI/Components/ItemPreview/ItemPreview.js');
	ItemCompare.remove.mockClear();
	ItemPreview.remove.mockClear();

	ItemInfoCard.onKeyDown({ which: 27, key: 'Escape' });
	expect(ItemInfoCard.__active).toBe(false);
	expect(ItemInfo.__active).toBe(true);
	expect(ItemCompare.remove).not.toHaveBeenCalled();
	expect(ItemPreview.remove).not.toHaveBeenCalled();

	ItemInfoCard.append();
	ItemInfoCard.getRoot().querySelector('.close')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	expect(ItemCompare.remove).not.toHaveBeenCalled();
});

it('opens a compare window card in the card window', async () => {
	const { default: ItemCompare } = await import('UI/Components/ItemCompare/ItemCompare.js');
	const setCard = vi.spyOn(ItemInfoCard, 'setItem');
	ItemCompare.onCardInfo(4001);
	expect(setCard).toHaveBeenLastCalledWith({ ITID: 4001, IsIdentified: true, type: 6 });
});
