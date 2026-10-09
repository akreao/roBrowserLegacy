import { describe, expect, it, vi } from 'vitest';

// The dress room and private airship windows, with the renderer and inventory stubbed.
const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
			this.__active = false;
		}

		getRoot() {
			return this._host;
		}

		append() {
			this.__active = true;
		}

		remove() {
			this.__active = false;
		}

		draggable() {}
	}

	class MockEntity {
		constructor() {
			this.effectColor = new Float32Array(4);
			this.ACTION = { IDLE: 0 };
		}

		set(props) {
			Object.assign(this, props);
		}
	}
	MockEntity.TYPE_PC = 1;

	const inventory = { getItemById: id => (id === 25464 ? { ITID: id, count: 3 } : null) };
	return { MockGUIComponent, MockEntity, inventory };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		isDoram: job => job === 4218,
		// iRO leaves some airship lines empty
		getMessage: (id, text) => (id === 3332 ? '' : text),
		getMapName: (map, def) => (map === 'prontera.rsw' ? 'Prontera' : def),
		getItemInfo: id => ({ identifiedDisplayName: id === 6909 ? 'Nyangvine Fruit' : 'World Tour Ticket' })
	}
}));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_k, def) => ({ ...def, save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800, render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: mocks.MockEntity }));
vi.mock('Engine/SessionStorage.js', () => ({
	default: { Entity: { GID: 1, job: 7, sex: 1, head: 5, headpalette: 2, bodypalette: 0 } }
}));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: { getUI: () => mocks.inventory } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent(component) {
			HTMLCanvasElement.prototype.getContext = () => ({});
			component.getRoot().innerHTML = component.render();
			component.init();
			return component;
		}
	}
}));

const { default: DressRoom } = await import('UI/Components/DressRoom/DressRoom.js');
const { default: PrivateAirship } = await import('UI/Components/PrivateAirship/PrivateAirship.js');

describe('Dress room', () => {
	it('opens on the player look and lists hair colors first, as the official combo does', () => {
		DressRoom.open();
		const root = DressRoom.getRoot();

		expect([...root.querySelectorAll('.category option')].map(o => o.textContent)).toEqual([
			'Hair color',
			'Hairstyle',
			'Dress color'
		]);
		expect(root.querySelectorAll('.list .row')).toHaveLength(9);
		expect(root.querySelector('.row.selected').textContent).toBe('Hair color 2');

		DressRoom.setCategory('head');
		expect(root.querySelectorAll('.list .row')).toHaveLength(29);
		expect(root.querySelector('.row.selected').textContent).toBe('Hairstyle 5');
	});

	it('puts a choice on the preview, not on the player', () => {
		DressRoom.setCategory('headpalette');
		DressRoom.select(6);

		expect(DressRoom.getPreview().headpalette).toBe(6);
		expect(DressRoom.getPreview().head).toBe(5);
		expect(DressRoom.getRoot().querySelector('.row.selected').textContent).toBe('Hair color 6');
	});
});

describe('Private airship', () => {
	it('names the map and picks the ticket the player carries', () => {
		PrivateAirship.open('prontera.gat');
		const root = PrivateAirship.getRoot();

		expect(root.querySelector('.destination').textContent).toBe('Prontera (prontera)');
		expect(root.querySelector('.row.selected').textContent).toBe('World Tour Ticket (3)');
		expect(root.querySelector('.row.missing').textContent).toBe('Nyangvine Fruit (0)');
	});

	it('asks once, then shows a failure', () => {
		const onRequest = vi.fn();
		PrivateAirship.onRequest = onRequest;
		PrivateAirship.request();
		PrivateAirship.request();

		expect(onRequest).toHaveBeenCalledTimes(1);
		expect(onRequest).toHaveBeenCalledWith('prontera', 25464);

		const text = PrivateAirship.onResult(PrivateAirship.RESULT.DESTINATION_MAP_INVALID);
		expect(text).toBe('The private airship cannot fly to this map.');
		expect(PrivateAirship.getRoot().querySelector('.status').textContent).toBe(text);
	});

	it('closes when the flight is granted', () => {
		PrivateAirship.request();
		PrivateAirship.onResult(PrivateAirship.RESULT.OK);

		expect(PrivateAirship.__active).toBe(false);
	});
});
