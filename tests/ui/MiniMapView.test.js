/**
 * tests/ui/MiniMapView.test.js
 *
 * The minimap's Map View button opens the large map (official UIMiniMapWnd), or says
 * "Unsupported map" when the map has no minimap bitmap.
 */
import { describe, expect, it, vi } from 'vitest';

vi.mock('UI/CursorManager.js', () => ({ default: { ACTION: { DEFAULT: 0 }, setType: vi.fn(), getActualType: vi.fn() } }));
vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: 'data/texture/ui/',
		getMessage: (id, fallback) => fallback,
		getMapName: (_map, fallback) => fallback,
		getNaviLinkTable: () => ({
			1: ['prontera', 1, 200, 0, '', 0, 156, 20, 'prt_fild08', 170, 375],
			2: ['geffen', 2, 200, 0, '', 0, 10, 10, 'prontera', 1, 1]
		})
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn(), loadFiles: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { Entity: { position: [150, 180] } } }));
vi.mock('Renderer/Renderer.js', () => ({
	default: { width: 1200, height: 800, tick: 0, render: vi.fn(), stop: vi.fn() }
}));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { width: 312, height: 390 } }));
vi.mock('Renderer/EntityManager.js', () => ({ default: { setOverEntity: vi.fn() } }));
vi.mock('UI/Scrollbar.js', () => ({ default: {} }));
const showMessageBox = vi.fn();
vi.mock('UI/UIManager.js', () => ({
	default: { addComponent: component => component, showMessageBox: (...args) => showMessageBox(...args) }
}));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));

const MiniMapView = (await import('UI/Components/MiniMap/MiniMapView/MiniMapView.js')).default;

const minimap = loaded => ({
	getViewData: () => ({ image: {}, loaded, party: [], guild: [], markers: [], towninfo: [] })
});

describe('the Map View button', () => {
	it('says Unsupported map when the map has no minimap bitmap', () => {
		MiniMapView.toggle(minimap(false));
		expect(showMessageBox).toHaveBeenCalledWith('Unsupported map', 'ok');
		expect(MiniMapView._host?.parentNode).toBeFalsy();
	});

	it('opens and closes the large map', () => {
		MiniMapView.onMapChange('prontera.gat');
		MiniMapView.toggle(minimap(true));
		expect(MiniMapView._host.parentNode).toBeTruthy();
		expect(MiniMapView.getRoot().querySelector('canvas').width).toBe(512);
		MiniMapView.toggle(minimap(true));
		expect(MiniMapView._host.parentNode).toBeFalsy();
	});
});
