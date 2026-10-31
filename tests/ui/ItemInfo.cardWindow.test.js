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
		append() {
			this.__active = true;
		}
		remove() {
			this.__active = false;
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
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemPreview/ItemPreview.js', () => ({ default: {} }));
vi.mock('UI/Components/MakeReadBook/MakeReadBook.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: {} }));
vi.mock('UI/Components/Navigation/Navigation.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
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
});
