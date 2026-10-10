import { describe, expect, it, vi } from 'vitest';

// NavigationOfficial (opt-in via the `officialLayout` config) follows the official UINavigationV4Wnd: the four search
// categories, a search view and a map view, a simple mode, and none of
// roBrowser's own controls (coordinate footer, "Services" box, clickable map).
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.magnet = {};
			this.ui = {
				show: () => (this._host.style.display = ''),
				hide: () => (this._host.style.display = 'none')
			};
		}

		getRoot() {
			return this._host;
		}

		draggable() {}
	}

	const results = [
		{ type: 'MAP', name: 'Prontera', mapName: 'prontera', x: null, y: null },
		{ type: 'NPC', name: 'Kafra Employee', mapName: 'prontera', x: 146, y: 89 }
	];

	return { MockGUIComponent, results, findPathBetweenMaps: vi.fn(() => null) };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: 'data/texture/interface/',
		mapalias: {},
		getMessage: (id, def) => def,
		searchNavigation: vi.fn(() => mocks.results),
		getNaviLinkTable: () => []
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: { ENTER: 13, ESCAPE: 27 } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800, render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/MapRenderer.js', () => ({ default: { currentMap: 'prontera.gat' } }));
vi.mock('Renderer/Map/Altitude.js', () => ({ default: { TYPE: { WALKABLE: 1 } } }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { Entity: { position: [150, 180, 0] } } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/Components/Navigation/MapPathFinder.js', () => ({
	default: { findPathBetweenMaps: mocks.findPathBetweenMaps }
}));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			component.getRoot().innerHTML = component.render();
			component.init();
			return component;
		},
		showPromptBox: vi.fn()
	}
}));

const { default: Navigation } = await import('UI/Components/Navigation/NavigationOfficial.js');
const root = () => Navigation.getRoot();
const wnd = () => root().querySelector('.Navigation');

describe('Navigation window layout', () => {
	it('offers the official categories ALL / Map / Npc / Mob', () => {
		const items = [...root().querySelectorAll('.combo-item')];
		expect(items.map(i => i.dataset.type)).toEqual(['ALL', 'MAP', 'NPC', 'MOB']);
		expect(items.map(i => i.querySelector('ui-text').getAttribute('msg'))).toEqual([
			'2206',
			'2207',
			'2208',
			'2209'
		]);
	});

	it('has none of the controls the official window lacks', () => {
		expect(root().querySelector('.services-toggle')).toBeNull();
		expect(root().querySelector('.coordinates-bar')).toBeNull();
		expect(root().querySelector('.mouse-info')).toBeNull();
		expect(root().querySelector('select')).toBeNull();
	});

	it('switches between basic and simple mode, and search and map view', () => {
		Navigation.show();
		expect(wnd().classList.contains('basic')).toBe(true);

		root().querySelector('.btn-mini').click();
		expect(Navigation.getMode()).toBe('simple');
		expect(wnd().classList.contains('simple')).toBe(true);

		root().querySelector('.btn-simple-max').click();
		expect(Navigation.getMode()).toBe('basic');

		Navigation.setView('search');
		root().querySelector('.btn-back').click();
		expect(wnd().classList.contains('view-map')).toBe(true);
		root().querySelector('.btn-back').click();
		expect(wnd().classList.contains('view-search')).toBe(true);
	});

	it('lists results, and "Set as the target" routes to the selected one', async () => {
		root().querySelector('.combo-item[data-type="NPC"]').click();
		expect(Navigation.getSearchType()).toBe('NPC');

		root().querySelector('.search-input').value = 'kafra';
		root().querySelector('.search-button').click();

		const { default: DB } = await import('DB/DBManager.js');
		expect(DB.searchNavigation).toHaveBeenCalledWith('kafra', 'NPC', { includeMaps: true });

		const rows = root().querySelectorAll('.result-list .row');
		expect(rows.length).toBe(2);
		expect(root().querySelector('.btn-target').hasAttribute('disabled')).toBe(true);

		rows[1].click();
		expect(rows[1].classList.contains('selected')).toBe(true);
		expect(root().querySelector('.btn-target').hasAttribute('disabled')).toBe(false);

		const navigateTo = vi.spyOn(Navigation, 'navigateTo');
		root().querySelector('.btn-target').click();
		expect(navigateTo).toHaveBeenCalledWith(
			expect.objectContaining({ endMap: 'prontera', endX: 146, endY: 89, displayName: 'Kafra Employee' })
		);
		expect(Navigation.getView()).toBe('map');
		expect(root().querySelector('.map-line1').textContent).toBe('Kafra Employee');
		navigateTo.mockRestore();
	});

	it('projects map cells onto the square minimap, centred on the longer side', () => {
		// 400x200 map on a 266 px minimap: the map fills the width and is centred vertically
		const p = Navigation.projectToMinimap(0, 200, 400, 200, 266);
		expect(p.x).toBeCloseTo(0);
		expect(p.y).toBeCloseTo(66.5);
		const q = Navigation.projectToMinimap(400, 0, 400, 200, 266);
		expect(q.x).toBeCloseTo(266);
		expect(q.y).toBeCloseTo(199.5);
	});
});
