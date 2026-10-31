/**
 * tests/ui/ItemObtain.text.test.js
 *
 * The item-obtained popup reads "You got %s (%d).", like the official one.
 */
import { expect, it, vi } from 'vitest';

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		static MouseMode = { CROSS: 'cross' };
		constructor() {
			this._host = document.createElement('div');
		}
		getRoot() {
			return this._host;
		}
		placeOnTop() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component._host.innerHTML = component.render();
			return component;
		}
	}
}));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getItemInfo: () => ({ identifiedResourceName: 'apple' }),
		getItemName: () => 'Apple',
		getMessage: (_id, text) => text
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Events.js', () => ({ default: { setTimeout: vi.fn(), clearTimeout: vi.fn() } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200 } }));

const ItemObtain = (await import('UI/Components/ItemObtain/ItemObtain.js')).default;

it('writes the item and its amount like the official popup', () => {
	ItemObtain.set({ ITID: 512, count: 3, IsIdentified: true });
	expect(ItemObtain.getRoot().querySelector('.content').textContent.trim()).toBe('You got Apple (3).');
});
