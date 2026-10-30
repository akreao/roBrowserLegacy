import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// How a double-click on an inventory item is handled, against the official
// client's item window (UIItemWnd, its double-click handler).
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor() {
			this._host = document.createElement('div');
			this.magnet = { TOP: false, BOTTOM: false, LEFT: false, RIGHT: false };
		}

		getRoot() {
			return this._host;
		}

		draggable() {
			return this;
		}

		focus() {}
	}

	return { MockGUIComponent };
});

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: (_id, def) => def } }));
vi.mock('DB/Items/ItemType.js', () => ({ default: {} }));
vi.mock('Network/NetworkManager.js', () => ({ default: { hookPacket: vi.fn(), sendPacket: vi.fn() } }));
vi.mock('Network/PacketStructure.js', () => ({ default: {} }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20211103 } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_path, cb) => cb?.(''), loadFiles: (_paths, cb) => cb?.() } }));
vi.mock('Core/Configs.js', () => ({ default: { get: (_k, d) => d } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIVersionManager.js', () => ({ default: { getInventoryVersion: () => 0 } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/TouchDrag.js', () => ({ attachTouchDrag: vi.fn() }));
vi.mock('UI/Components/CartItems/CartItems.js', () => ({ default: {} }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({ default: { addText: vi.fn(), TYPE: {}, FILTER: {} } }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));
vi.mock('UI/Components/Storage/Storage.js', () => ({ default: {} }));
vi.mock('UI/Components/SwitchEquip/SwitchEquip.js', () => ({ default: {} }));
vi.mock('UI/Components/BasicInfo/BasicInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/Refine/Refine.js', () => ({ default: {} }));
vi.mock('UI/Components/EnchantGrade/EnchantGrade.js', () => ({ default: {} }));
vi.mock('UI/Components/Enchant/Enchant.js', () => ({ default: {} }));
vi.mock('UI/Components/Mail/Mail.js', () => ({ default: {} }));
vi.mock('UI/Components/Rodex/WriteRodex.js', () => ({ default: {} }));

const { createInventory } = await import('UI/Components/Inventory/InventoryCommon.js');

const NAME = 'InventoryItemUseTest';

const htmlText = `
	<div class="titlebar"></div>
	<div class="container"><div class="content"></div></div>
`;

function mount() {
	const Component = createInventory({ name: NAME, htmlText, cssText: '', defaultHeight: 2 });
	Component.getRoot().innerHTML = htmlText;
	Component.init();
	Component.onAppend();
	Component.getItemByIndex = index => (index === 7 ? { index: 7, ITID: 501, type: 0, count: 1 } : null);
	Component.useItem = vi.fn();
	const item = document.createElement('div');
	item.className = 'item';
	item.setAttribute('data-index', '7');
	Component.getRoot().querySelector('.content').appendChild(item);
	return { Component, item };
}

const dblclick = (el, init = {}) => el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, ...init }));

describe('inventory, double-clicking an item', () => {
	beforeEach(() => localStorage.clear());
	afterEach(() => localStorage.clear());

	it('uses it', () => {
		const { Component, item } = mount();
		dblclick(item);
		expect(Component.useItem).toHaveBeenCalledTimes(1);
	});

	it('does nothing with Shift held, as the official client', () => {
		const { Component, item } = mount();
		dblclick(item, { shiftKey: true });
		expect(Component.useItem).not.toHaveBeenCalled();
	});
});
