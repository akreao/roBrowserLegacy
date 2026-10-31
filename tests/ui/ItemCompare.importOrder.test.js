/**
 * tests/ui/ItemCompare.importOrder.test.js
 *
 * ItemCompare and ItemInfo import each other; loading ItemCompare first must not crash.
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
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { screen: { x: 0, y: 0 } } }));
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

it('loads when the compare window is imported before the item window', async () => {
	const { default: ItemCompare } = await import('UI/Components/ItemCompare/ItemCompare.js');
	const { default: ItemInfo, showCardInfo } = await import('UI/Components/ItemInfo/ItemInfo.js');
	expect(ItemCompare).toBeTruthy();
	expect(ItemInfo).toBeTruthy();
	expect(typeof showCardInfo).toBe('function');
});
