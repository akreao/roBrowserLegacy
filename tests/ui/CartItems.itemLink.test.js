/**
 * tests/ui/CartItems.itemLink.test.js
 *
 * Shift+clicking a cart item puts its link in the chat, as in the inventory.
 */
import { expect, it, vi } from 'vitest';

const chat = vi.hoisted(() => ({ _host: null }));

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, getActualType: vi.fn(), setType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getItemInfo: () => ({}),
		getItemName: () => 'Red Potion',
		getMessage: () => '',
		createItemLink: () => 'LINK'
	}
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
vi.mock('UI/Components/Storage/Storage.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: {} }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: {} }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({ default: chat }));

const CartItems = (await import('UI/Components/CartItems/CartItems.js')).default;

it('adds a Shift+clicked item to the chat input only', () => {
	chat._host = document.createElement('div');
	chat._host.innerHTML = '<div class="input-chatbox" contenteditable></div>';
	CartItems.prepare();
	CartItems.list = [];
	CartItems.setItems([{ index: 3, ITID: 501, count: 10, IsIdentified: true }]);
	const item = CartItems.getRoot().querySelector('.item[data-index="3"]');
	const input = chat._host.querySelector('.input-chatbox');

	item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	expect(input.innerHTML).toBe('');
	item.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
	expect(input.querySelector('.item-link').dataset.item).toBe('LINK');
	expect(input.textContent).toBe('<Red Potion> ');

	// The official cart does nothing on a double-click, Shift or not
	expect(() => item.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, shiftKey: true }))).not.toThrow();
	expect(input.querySelectorAll('.item-link')).toHaveLength(1);
});
