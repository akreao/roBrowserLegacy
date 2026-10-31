/**
 * tests/ui/Equipment.itemLink.test.js
 *
 * Shift+clicking a worn item puts its link in the chat, as in the inventory.
 */
import { afterAll, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ render: null, entity: null, cartItems: { _host: null }, chat: { _host: null } }));

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, getActualType: vi.fn(), setType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getItemInfo: () => ({}), getItemName: () => 'Sword', createItemLink: () => 'LINK', getMessage: () => '', getAllTitles: () => [] }
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn(), loadFiles: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, show: true, save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({
	default: { width: 1200, height: 800, render: fn => (mocks.render = fn), stop: vi.fn() }
}));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: { bind2DContext: vi.fn() } }));
vi.mock('Renderer/Entity/Entity.js', () => ({
	default: class {
		static TYPE_PC = 0;
		ACTION = { IDLE: 0 };
		effectColor = new Float32Array(4);
		set() {}
		renderEntity() {}
	}
}));
vi.mock('Engine/SessionStorage.js', () => ({
	default: {
		get Entity() {
			return mocks.entity;
		}
	}
}));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/UIVersionManager.js', () => ({ default: { getEquipmentVersion: () => 0 } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({ default: mocks.chat }));
vi.mock('UI/Components/CartItems/CartItems.js', () => ({ default: mocks.cartItems }));
vi.mock('UI/Components/SwitchEquip/SwitchEquip.js', () => ({ default: { append: vi.fn() } }));
vi.mock('UI/Components/WinStats/WinStats.js', () => ({ default: { getUI: () => ({ embed: vi.fn() }) } }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getUI: () => ({}), equippedItems: [] } }));
vi.mock('Preferences/Graphics.js', () => ({ default: {} }));

// jsdom has no 2D context; the preview only needs one to clear.
HTMLCanvasElement.prototype.getContext = function () {
	return { canvas: this, clearRect() {} };
};

const Equipment = (await import('UI/Components/Equipment/EquipmentV3/EquipmentV3.js')).default;

// prepare() schedules scrollbar checks up to 500 ms out; let the last ones
// land before jsdom is torn down.
afterAll(() => new Promise(resolve => setTimeout(resolve, 600)));

describe('Equipment item link', () => {
	it('adds a Shift+clicked item to the chat input only', () => {
		mocks.chat._host = document.createElement('div');
		mocks.chat._host.innerHTML = '<div class="input-chatbox" contenteditable></div>';
		mocks.entity = character(false);
		Equipment.append();
		Equipment.equip({ index: 5, ITID: 1101, IsIdentified: true }, 2);
		const item = Equipment.getRoot().querySelector('.item[data-index="5"]');
		const input = mocks.chat._host.querySelector('.input-chatbox');
		item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(input.innerHTML).toBe('');
		item.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
		expect(input.querySelector('.item-link').dataset.item).toBe('LINK');
		expect(input.textContent).toBe('<Sword> ');
	});
});

function character(hasCart) {
	return { hasCart, effectState: 0, ACTION: { IDLE: 0 }, effectColor: new Float32Array(4), renderEntity: vi.fn() };
}
