/**
 * tests/ui/CartItems.hoverText.test.js
 *
 * Hovering a cart item reads "Name 10 ea", like the official cart window.
 */
import { expect, it, vi } from 'vitest';

const storageHost = document.createElement('div');
const inventoryHost = document.createElement('div');
const reqAddItemFromCart = vi.fn();

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, getActualType: vi.fn(), setType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getItemInfo: () => ({}), getItemName: (item, { showItemOptions = true } = {}) => (item.ITID === 501 ? 'Red Potion' : showItemOptions ? 'Sword [1 Option]' : 'Sword'), getMessage: (_id, text) => text }
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn(), loadFiles: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: {} }));
vi.mock('UI/Components/Storage/Storage.js', () => ({
	default: { _host: storageHost, reqAddItemFromCart }
}));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { _host: inventoryHost } }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));

const CartItems = (await import('UI/Components/CartItems/CartItems.js')).default;

it('writes the name, the amount and "ea" without a colon', () => {
	CartItems.prepare();
	CartItems.list = [];
	CartItems.setItems([{ index: 3, ITID: 501, count: 10, IsIdentified: true }]);
	const root = CartItems.getRoot();
	root.querySelector('.item[data-index="3"]').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
	expect(root.querySelector('.overlay').textContent).toBe('Red Potion 10 ea');
});

it('writes items with random options with message 2551', () => {
	CartItems.prepare();
	CartItems.list = [];
	CartItems.setItems([{ index: 4, ITID: 1101, count: 1, type: 4, IsIdentified: true, Options: [{ index: 1 }] }]);
	const root = CartItems.getRoot();
	root.querySelector('.item[data-index="4"]').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
	expect(root.querySelector('.overlay').textContent).toBe('Sword [1 Option] : 1 Quantity');
});
