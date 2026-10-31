import { beforeEach, describe, expect, it, vi } from 'vitest';

// The Cash Shop cart's limits and purchase results use the official messages
// (UICashShopWnd_Cart vfunc37 0x00798b80, ZC_SE_PC_BUY_CASHITEM_RESULT 0x00cd3b70).
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.magnet = {};
		}

		getRoot() {
			return this._host;
		}

		draggable() {}

		static processDataAttrs() {}
	}

	return { MockGUIComponent, messageBox: vi.fn(), addText: vi.fn() };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getItemInfo: id => ({ identifiedDisplayName: id === 501 ? 'Red Potion' : 'Apple', identifiedResourceName: 'r' }),
		getCashShopBannerTable: () => [],
		getMessage: id => `msg${id} %d`
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: vi.fn() } }));
vi.mock('Network/PacketStructure.js', () => ({ default: { CZ: {} } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { ENTER: 13, ESCAPE: 27 } }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: mocks.addText, TYPE: { ERROR: 'error' }, FILTER: { PUBLIC_LOG: 'log' } }
}));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_k, def) => ({ ...def, save: vi.fn() }) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			component.init();
			return component;
		},
		showMessageBox: mocks.messageBox
	}
}));

const { default: CashShop } = await import('UI/Components/CashShop/CashShop.js');

const ITEMS = Array.from({ length: 9 }, (_, i) => ({ itemId: 501 + i, price: 10 }));

function add(itemId) {
	const root = CashShop.getRoot();
	let box = root.querySelector('.test-add');
	if (!box) {
		root.insertAdjacentHTML('beforeend', '<div class="test-add purchase-btn-container"><button></button></div>');
		box = root.querySelector('.test-add');
	}
	const button = box.querySelector('button');
	button.dataset.itemid = String(itemId);
	button.click();
}

beforeEach(() => {
	CashShop.cashShopListItem = [];
	CashShop.readCashShopItems({ tabNum: 0, count: ITEMS.length, items: ITEMS.map(item => ({ ...item })) });
	CashShop.activeCashMenu = 0;
	CashShop.cartItem = [];
	CashShop.cartItemLen = 0;
	CashShop.checkCartItemLen = 0;
	mocks.messageBox.mockReset();
	mocks.addText.mockReset();
});

describe('Cash Shop cart', () => {
	it('holds 8 kinds of items (message 3312)', () => {
		for (let i = 0; i < 8; i++) {
			add(501 + i);
		}
		expect(CashShop.cartItem).toHaveLength(8);
		expect(mocks.messageBox).not.toHaveBeenCalled();
		add(509);
		expect(CashShop.cartItem).toHaveLength(8);
		expect(mocks.messageBox).toHaveBeenCalledWith('msg3312 %d', 'ok');
	});

	it('holds 100 of one item (message 1704)', () => {
		add(501);
		const item = CashShop.cartItem[0];
		item.amount = 99;
		add(501);
		expect(item.amount).toBe(100);
		add(501);
		expect(item.amount).toBe(100);
		expect(mocks.messageBox).toHaveBeenCalledWith('msg1704 100', 'ok');
	});
});

describe('Cash Shop purchase results', () => {
	it('says nothing on success', () => {
		const readPoints = vi.spyOn(CashShop, 'readPoints').mockImplementation(() => {});
		CashShop.cartItemLen = 1;
		CashShop.setSuccessCashShopUpdate({ result: 0, cashPoints: 5, kafraPoints: 0 });
		expect(mocks.addText).not.toHaveBeenCalled();
		expect(mocks.messageBox).not.toHaveBeenCalled();
		expect(readPoints).toHaveBeenCalledWith(5, 0, 0);
		readPoints.mockRestore();
	});

	it('keeps the cart on a partial purchase but updates the points', () => {
		const readPoints = vi.spyOn(CashShop, 'readPoints').mockImplementation(() => {});
		add(501);
		CashShop.cartItemLen = 1;
		CashShop.setSuccessCashShopUpdate({ result: 8, cashPoints: 5, kafraPoints: 0 });
		expect(CashShop.cartItem).toHaveLength(1);
		expect(readPoints).toHaveBeenCalledWith(5, 0, 0);
		expect(mocks.addText).toHaveBeenLastCalledWith('msg1814 %d', 'error', 'log');
		readPoints.mockRestore();
	});

	it('puts a failure in the chat in red', () => {
		CashShop.setSuccessCashShopUpdate({ result: 2 });
		expect(mocks.addText).toHaveBeenLastCalledWith('msg57 %d', 'error', 'log');
		CashShop.setSuccessCashShopUpdate({ result: 10 });
		expect(mocks.addText).toHaveBeenLastCalledWith('msg1945 %d', 'error', 'log');
		CashShop.setSuccessCashShopUpdate({ result: 12 });
		expect(mocks.addText).toHaveBeenLastCalledWith('msg1947 %d', 'error', 'log');
		expect(mocks.messageBox).not.toHaveBeenCalled();
	});
});
