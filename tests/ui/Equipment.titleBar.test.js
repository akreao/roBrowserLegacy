/**
 * tests/ui/Equipment.titleBar.test.js
 *
 * Double-clicking the title bar reduces the equipment window, like the mini button.
 */
import { afterAll, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ render: null, entity: null, cartItems: { _host: null } }));

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: {}, getActualType: vi.fn(), setType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getItemInfo: () => ({}), getItemName: () => '', getMessage: () => '', getAllTitles: () => [] }
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
vi.mock('UI/Components/CartItems/CartItems.js', () => ({ default: mocks.cartItems }));
vi.mock('UI/Components/SwitchEquip/SwitchEquip.js', () => ({ default: { append: vi.fn() } }));
vi.mock('UI/Components/WinStats/WinStats.js', () => ({ default: { getUI: () => ({ embed: vi.fn() }) } }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getUI: () => ({}) } }));
vi.mock('Preferences/Graphics.js', () => ({ default: {} }));

// jsdom has no 2D context; the preview only needs one to clear.
HTMLCanvasElement.prototype.getContext = function () {
	return { canvas: this, clearRect() {} };
};

const Equipment = (await import('UI/Components/Equipment/EquipmentV3/EquipmentV3.js')).default;

// prepare() schedules scrollbar checks up to 500 ms out; let the last ones
// land before jsdom is torn down.
afterAll(() => new Promise(resolve => setTimeout(resolve, 600)));

describe('Equipment title bar', () => {
	it('reduces and restores the window on a title bar double-click', () => {
		mocks.entity = character(false);
		Equipment.append();
		const root = Equipment.getRoot();
		const panel = root.querySelector('.panel');
		const dblclick = target => target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
		dblclick(root.querySelector('.titlebar'));
		expect(panel.style.display).toBe('none');
		dblclick(root.querySelector('.titlebar'));
		expect(panel.style.display).toBe('');
		dblclick(root.querySelector('.titlebar .close'));
		expect(panel.style.display).toBe('');
	});
});

function character(hasCart) {
	return { hasCart, effectState: 0, ACTION: { IDLE: 0 }, effectColor: new Float32Array(4), renderEntity: vi.fn() };
}
