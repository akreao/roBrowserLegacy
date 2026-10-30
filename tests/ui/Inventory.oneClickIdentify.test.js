import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Ctrl + right click on an item, against the official client's item window
// (UIItemWnd, right-click handler): one-click identify with a Magnifier.
const net = vi.hoisted(() => ({ sent: [], chat: [] }));

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
vi.mock('Network/NetworkManager.js', () => ({ default: { hookPacket: vi.fn(), sendPacket: pkt => net.sent.push(pkt) } }));
vi.mock('Network/PacketStructure.js', () => ({
	default: {
		CZ: {
			REQ_ONECLICK_ITEMIDENTIFY: function () {
				this.name = 'REQ_ONECLICK_ITEMIDENTIFY';
			}
		}
	}
}));
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
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: text => net.chat.push(text), TYPE: {}, FILTER: {} }
}));
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

const NAME = 'InventoryOneClickIdentifyTest';

const htmlText = `
	<div class="titlebar"></div>
	<div class="container"><div class="content"></div></div>
`;

const UNIDENTIFIED = { index: 7, ITID: 1201, type: 4, count: 1, IsIdentified: false };
const MAGNIFIER = { index: 8, ITID: 611, type: 2, count: 3, IsIdentified: true };

function mount({ items = [UNIDENTIFIED, MAGNIFIER], tab = 1 } = {}) {
	localStorage.setItem(NAME, JSON.stringify({ show: true, tab, _version: 1.0 }));
	const Component = createInventory({ name: NAME, htmlText, cssText: '', defaultHeight: 2 });
	Component.getRoot().innerHTML = htmlText;
	Component.init();
	Component.onAppend();
	Component.list = items;
	const item = document.createElement('div');
	item.className = 'item';
	item.setAttribute('data-index', '7');
	Component.getRoot().querySelector('.content').appendChild(item);
	return { Component, item };
}

function ctrlRightClick(el) {
	const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, ctrlKey: true, button: 2 });
	Object.defineProperty(event, 'which', { value: 3 });
	el.dispatchEvent(event);
}

describe('inventory, Ctrl + right click', () => {
	beforeEach(() => {
		localStorage.clear();
		net.sent.length = 0;
		net.chat.length = 0;
	});
	afterEach(() => localStorage.clear());

	it('asks to identify an unidentified item in the Equip tab', () => {
		const { item } = mount();
		ctrlRightClick(item);

		expect(net.sent).toHaveLength(1);
		expect(net.sent[0].name).toBe('REQ_ONECLICK_ITEMIDENTIFY');
		expect(net.sent[0].index).toBe(7);
		expect(net.chat).toHaveLength(0);
	});

	it('says there is no Magnifier, and still asks', () => {
		const { item } = mount({ items: [UNIDENTIFIED] });
		ctrlRightClick(item);

		expect(net.chat).toEqual(["You don't have any Magnifier."]);
		expect(net.sent).toHaveLength(1);
	});

	it('does not ask outside the Equip tab', () => {
		const { item } = mount({ tab: 2 });
		ctrlRightClick(item);
		expect(net.sent).toHaveLength(0);
	});

	it('does not ask for an identified item', () => {
		const { item } = mount({ items: [{ ...UNIDENTIFIED, IsIdentified: true }, MAGNIFIER] });
		ctrlRightClick(item);
		expect(net.sent).toHaveLength(0);
	});

	it('leaves pet eggs alone', () => {
		const { item } = mount({ items: [{ ...UNIDENTIFIED, ITID: 9001 }] });
		ctrlRightClick(item);
		expect(net.sent).toHaveLength(0);
		expect(net.chat).toHaveLength(0);
	});
});
