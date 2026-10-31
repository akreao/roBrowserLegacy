/**
 * tests/ui/PlayerViewEquip.reduce.test.js
 *
 * The other player's equipment window reduces to its title bar, tab row
 * included, from the mini button or a title bar double-click, and comes
 * back reduced.
 */
import { expect, it, vi } from 'vitest';

const prefs = vi.hoisted(() => ({ reduce: false, save: () => {} }));

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: () => '' } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn(), loadFiles: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_key, def) => Object.assign(def, prefs) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: class {} }));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));

HTMLCanvasElement.prototype.getContext = function () {
	return { canvas: this, clearRect() {} };
};

const { createPlayerViewEquip } = await import('UI/Components/PlayerViewEquip/PlayerViewEquipCommon.js');

function create() {
	const component = createPlayerViewEquip({
		name: 'PlayerViewEquipV1',
		cssText: '',
		hasTabs: true,
		costumeRows: [],
		costumeTableBg: ''
	});
	component._host.innerHTML = component.render();
	component.init();
	return component.getRoot();
}

it('reduces with the tab row from a title bar double-click or the mini button', () => {
	const root = create();
	const panel = root.querySelector('.panel');
	const tabs = root.querySelector('.vieweqtab-manager');
	const dblclick = target => target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
	dblclick(root.querySelector('.titlebar'));
	expect(panel.style.display).toBe('none');
	expect(tabs.style.display).toBe('none');
	dblclick(root.querySelector('.titlebar .close'));
	expect(panel.style.display).toBe('none');
	root.querySelector('.titlebar .mini').click();
	expect(panel.style.display).toBe('');
	expect(tabs.style.display).toBe('');
});

it('comes back reduced', () => {
	prefs.reduce = true;
	const root = create();
	expect(root.querySelector('.panel').style.display).toBe('none');
	expect(root.querySelector('.vieweqtab-manager').style.display).toBe('none');
});

it('starts the character preview when a restored window is expanded', async () => {
	prefs.reduce = true;
	const root = create();
	const { default: Renderer } = await import('Renderer/Renderer.js');
	Renderer.render.mockClear();
	root.querySelector('.titlebar .mini').click();
	expect(Renderer.render).toHaveBeenCalledOnce();
	Renderer.stop.mockClear();
	root.querySelector('.titlebar .mini').click();
	expect(Renderer.stop).toHaveBeenCalledOnce();
});
