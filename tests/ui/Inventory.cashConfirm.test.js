import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The official client's item window (UIItemWnd, double-click handler) asks
// before opening a cash shop item, and uses it on Yes.
const prompt = vi.hoisted(() => ({ calls: [] }));

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

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: (_id, def) => def, getItemName: () => 'Bubble Gum Box' } }));
vi.mock('DB/Items/ItemType.js', () => ({ default: { HEALING: 0, CASH: 18 } }));
vi.mock('Network/NetworkManager.js', () => ({ default: { hookPacket: vi.fn(), sendPacket: vi.fn() } }));
vi.mock('Network/PacketStructure.js', () => ({ default: {} }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20211103 } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_path, cb) => cb?.(''), loadFiles: (_paths, cb) => cb?.() } }));
vi.mock('Core/Configs.js', () => ({ default: { get: (_k, d) => d } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({
	default: { addComponent: component => component, showPromptBox: (...args) => prompt.calls.push(args) }
}));
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

const NAME = 'InventoryCashConfirmTest';

const htmlText = `
	<div class="titlebar"></div>
	<div class="container"><div class="content"></div></div>
`;

function mount(type = 0) {
	const Component = createInventory({ name: NAME, htmlText, cssText: '', defaultHeight: 2 });
	Component.getRoot().innerHTML = htmlText;
	Component.init();
	Component.onAppend();
	Component.list = [{ index: 7, ITID: 501, type, count: 1 }];
	Component.onUseItem = vi.fn();
	const item = document.createElement('div');
	item.className = 'item';
	item.setAttribute('data-index', '7');
	Component.getRoot().querySelector('.content').appendChild(item);
	return { Component, item };
}

const dblclick = (el, init = {}) => el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, ...init }));

describe('using a cash shop item', () => {
	beforeEach(() => {
		localStorage.clear();
		prompt.calls.length = 0;
	});
	afterEach(() => localStorage.clear());

	it('asks first on a double-click, naming the item, and uses it on Yes', () => {
		const { Component, item } = mount(18);
		dblclick(item);

		expect(Component.onUseItem).not.toHaveBeenCalled();
		expect(prompt.calls).toHaveLength(1);
		const [text, yes, no, onYes] = prompt.calls[0];
		expect(text).toContain('^990099Bubble Gum Box^000000');
		expect([yes, no]).toEqual(['ok', 'cancel']);

		onYes();
		expect(Component.onUseItem).toHaveBeenCalledWith(7);
	});

	it('asks too when used from a shortcut bar', () => {
		const { Component } = mount(18);
		Component.useItem(Component.list[0]);

		expect(prompt.calls).toHaveLength(1);
		expect(Component.onUseItem).not.toHaveBeenCalled();
	});

	it('does nothing on Yes once the item has left the inventory', () => {
		const { Component, item } = mount(18);
		dblclick(item);
		Component.list = [{ index: 7, ITID: 607, type: 0, count: 1 }]; // another item took its index

		prompt.calls[0][3]();
		expect(Component.onUseItem).not.toHaveBeenCalled();
	});

	it('uses any other item straight away', () => {
		const { Component, item } = mount(0);
		dblclick(item);

		expect(prompt.calls).toHaveLength(0);
		expect(Component.onUseItem).toHaveBeenCalledWith(7);
	});
});
