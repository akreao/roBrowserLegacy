/**
 * tests/ui/MiniMap.buttons.test.js
 *
 * The 2025 minimap's buttons: Maximize opens the memo map, World Map the world map.
 */
import { expect, it, vi } from 'vitest';
import htmlText from 'UI/Components/MiniMap/MiniMapV2/MiniMapV2.html?raw';

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		static MouseMode = { STOP: 'stop', CROSS: 'cross' };
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this._host.innerHTML = htmlText;
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: (_id, text) => text, getTownInfo: () => [] } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_key, def) => Object.assign(def, { save: vi.fn() }) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn(), tick: 0 } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { width: 100, height: 100 } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { TAB: 9 } }));

const { createMiniMap } = await import('UI/Components/MiniMap/MiniMapCommon.js');

it('opens the memo map from Maximize and the world map from World Map', () => {
	const worldMap = { toggle: vi.fn() };
	const bigMap = { toggle: vi.fn(), setSource: vi.fn() };
	const MiniMap = createMiniMap({ name: 'MiniMapV2', htmlText, cssText: '', worldMap, bigMap, townInfoToggle: true });
	MiniMap.init();
	const root = MiniMap.getRoot();

	root.querySelector('.mini').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
	expect(bigMap.toggle).toHaveBeenCalledOnce();
	expect(worldMap.toggle).not.toHaveBeenCalled();

	root.querySelector('.viewon').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
	expect(worldMap.toggle).toHaveBeenCalledOnce();
	expect(bigMap.toggle).toHaveBeenCalledOnce();

	expect(bigMap.setSource).toHaveBeenCalledOnce();
	expect(root.querySelector('.mini').title).toBe('Maximize');
	expect(root.querySelector('.viewon').title).toBe('World Map');
});
