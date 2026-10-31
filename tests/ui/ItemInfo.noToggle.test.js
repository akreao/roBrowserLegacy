/**
 * tests/ui/ItemInfo.noToggle.test.js
 *
 * Right-clicking the same item again keeps its description open, as in the official client.
 */
import { expect, it, vi } from 'vitest';

const storageHost = document.createElement('div');
const inventoryHost = document.createElement('div');
const reqAddItemFromCart = vi.fn();
const info = vi.hoisted(() => ({ append: vi.fn(), remove: vi.fn(), setItem: vi.fn(), uid: -1 }));

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, getActualType: vi.fn(), setType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getItemInfo: () => ({}), getItemName: () => '', getMessage: () => '' }
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn(), loadFiles: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: info }));
vi.mock('UI/Components/ItemCompare/ItemCompare.js', () => ({ default: {} }));
vi.mock('UI/Components/Storage/Storage.js', () => ({
	default: { _host: storageHost, reqAddItemFromCart }
}));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { _host: inventoryHost } }));
vi.mock('UI/Components/Equipment/Equipment.js', () => ({ default: { isInEquipList: () => null } }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({ default: {} }));

const CartItems = (await import('UI/Components/CartItems/CartItems.js')).default;

it('shows the description again instead of closing it', () => {
	CartItems.prepare();
	CartItems.list = [];
	CartItems.setItems([{ index: 3, ITID: 909, count: 100 }]);
	const icon = CartItems.getRoot().querySelector('.item[data-index="3"] .icon');
	const rightClick = () => {
		const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2 });
		Object.defineProperty(event, 'which', { value: 3 });
		icon.dispatchEvent(event);
	};

	rightClick();
	info.uid = 909;
	rightClick();

	expect(info.remove).not.toHaveBeenCalled();
	expect(info.append).toHaveBeenCalledTimes(2);
	expect(info.setItem).toHaveBeenCalledTimes(2);
});
