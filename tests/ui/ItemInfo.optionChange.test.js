/**
 * tests/ui/ItemInfo.optionChange.test.js
 *
 * An item option change shows the item with the packet's new attributes.
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
	}
	return { MockGUIComponent, pending: [], missing: new Set(), hooks: new Map() };
});

const items = {
	1: { identifiedResourceName: 'apple', identifiedDescriptionName: [] },
	2: { identifiedResourceName: 'c_dimensional_sword', identifiedDescriptionName: [] }
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
vi.mock('Network/NetworkManager.js', () => ({
	default: { sendPacket: vi.fn(), hookPacket: (type, fn) => mocks.hooks.set(type, fn) }
}));
vi.mock('Network/PacketStructure.js', () => ({ default: { CZ: {}, ZC: { CHANGE_ITEM_OPTION: 'CHANGE_ITEM_OPTION' } } }));
vi.mock('UI/Components/CardIllustration/CardIllustration.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemPreview/ItemPreview.js', () => ({ default: {} }));
vi.mock('UI/Components/MakeReadBook/MakeReadBook.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: { isInEquipList: () => null } }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({
	default: { getItemByIndex: () => ({ index: 5, ITID: 2, IsIdentified: true, type: 5, RefiningLevel: 0, Options: [] }) }
}));
vi.mock('UI/Components/Navigation/Navigation.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: function Entity() {} }));
vi.mock('Loaders/Sprite.js', () => ({ default: {} }));
vi.mock('Loaders/Action.js', () => ({ default: {} }));
vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, setType: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

const { default: ItemInfo } = await import('UI/Components/ItemInfo/ItemInfo.js');

it('shows the changed options, refine and grade, and keeps the window open', () => {
	const setItem = vi.spyOn(ItemInfo, 'setItem');
	const remove = vi.fn();
	ItemInfo.remove = remove;
	ItemInfo.append = vi.fn();
	const none = { index: 0, value: 0, param: 0 };
	const options = [undefined, { index: 5, value: 10, param: 0 }, none, none, none, none];
	const pkt = { index: 5, isDamaged: 0, slot: { card1: 4001 }, Options: options, refiningLevel: 7, enchantgrade: 2 };
	ItemInfo.uid = 2;

	mocks.hooks.get('CHANGE_ITEM_OPTION')(pkt);

	expect(remove).not.toHaveBeenCalled();
	expect(setItem).toHaveBeenLastCalledWith(
		expect.objectContaining({ ITID: 2, RefiningLevel: 7, enchantgrade: 2, Options: options, slot: { card1: 4001 } })
	);
});
