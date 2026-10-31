import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * The official character select reads the slot picked last time from its
 * CURSLOT setting when it opens. CharSelectV4 saved the slot but never read
 * it back, so it always opened on the first character.
 */

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
		}

		getRoot() {
			return this._host;
		}

		draggable() {}

		on() {}
	}
	return { MockGUIComponent, saved: { index: 0 }, screen: null };
});

vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getMessage: id => `MSG ${id}`, getMapName: () => '' }
}));
vi.mock('DB/Monsters/MonsterTable.js', () => ({ default: {} }));
vi.mock('DB/Status/StatusState.js', () => ({ default: {} }));
vi.mock('Core/Preferences.js', () => ({
	default: { get: (_name, defaults) => Object.assign(mocks.saved, { ...defaults, ...mocks.saved, save: vi.fn() }) }
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_p, cb) => cb?.('') } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn(), tick: 0 } }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: class {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c, showPromptBox: vi.fn() } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/ScreenHooks.js', () => ({
	default: {
		show: (_name, screen) => {
			mocks.screen = screen;
		},
		hide: vi.fn(),
		update: vi.fn()
	}
}));
vi.mock('UI/ExitHooks.js', () => ({ default: { emit: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));

async function open(savedIndex) {
	vi.resetModules();
	mocks.saved = { index: savedIndex };
	const CharSelect = (await import('UI/Components/CharSelect/CharSelectV4/CharSelectV4.js')).default;
	CharSelect._host.innerHTML = CharSelect.render();
	CharSelect.init();
	CharSelect.onAppend();
	return CharSelect;
}

describe('CharSelectV4 cursor', () => {
	let CharSelect;

	afterEach(() => {
		CharSelect?.onRemove();
	});

	it('opens on the slot picked last time', async () => {
		CharSelect = await open(4);
		expect(mocks.screen.index).toBe(4);
	});

	it('keeps a stale saved slot inside the window', async () => {
		CharSelect = await open(40);
		expect(mocks.screen.index).toBe(14);
	});
});
