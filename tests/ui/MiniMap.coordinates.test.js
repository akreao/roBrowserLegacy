/**
 * tests/ui/MiniMap.coordinates.test.js
 *
 * The 2025 minimap's coordinates are updated every frame: the page is written only when a number
 * changes, and a window drawn again gets them back.
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
const mocks = vi.hoisted(() => ({ messageBox: vi.fn() }));

vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c, showMessageBox: mocks.messageBox } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getMessage: (_id, text) => text,
		getTownInfo: () => [],
		mapalias: {},
		isMinimapException: map => map === '1@cata'
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_key, def) => Object.assign(def, { save: vi.fn() }) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn(), tick: 0 } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { width: 100, height: 100 } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { TAB: 9 } }));

const { createMiniMap } = await import('UI/Components/MiniMap/MiniMapCommon.js');

it('writes a coordinate only when it changes', () => {
	const MiniMap = createMiniMap({ name: 'MiniMapV2', htmlText, cssText: '', coordinates: true });
	MiniMap.init();
	const root = MiniMap.getRoot();
	const x = root.querySelector('.coordinates .coord.x');
	const y = root.querySelector('.coordinates .coord.y');

	MiniMap.updateCoordinates(150.6, 184.2);
	expect(x.textContent).toBe('150');
	expect(y.textContent).toBe('184');

	let writes = 0;
	new MutationObserver(records => (writes += records.length)).observe(root, {
		childList: true,
		characterData: true,
		subtree: true
	});
	MiniMap.updateCoordinates(150.9, 184.7);
	MiniMap.updateCoordinates(150.1, 185.0);
	return Promise.resolve().then(() => {
		expect(writes).toBe(1);
		expect(x.textContent).toBe('150');
		expect(y.textContent).toBe('185');
	});
});

it('finds the coordinates again when the window is drawn again', () => {
	const MiniMap = createMiniMap({ name: 'MiniMapV2', htmlText, cssText: '', coordinates: true });
	MiniMap.init();
	const root = MiniMap.getRoot();
	MiniMap.updateCoordinates(10, 20);

	root.innerHTML = htmlText;
	MiniMap.updateCoordinates(10, 20);
	expect(root.querySelector('.coordinates .coord.x').textContent).toBe('10');
	expect(root.querySelector('.coordinates .coord.y').textContent).toBe('20');
});
