import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Escape on character select asks "Are you sure that you want to quit?".
 * The deletion countdowns were stopped as soon as the prompt opened, so
 * answering no left them frozen.
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
	return { MockGUIComponent, saved: { index: 0 }, screen: null, prompt: null };
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
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent: c => c,
		showPromptBox: vi.fn((text, yes, no, onYes, onNo) => {
			mocks.prompt = { onYes, onNo };
		})
	}
}));
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

const KEYS = (await import('Controls/KeyEventHandler.js')).default;
const CharSelect = (await import('UI/Components/CharSelect/CharSelectV4/CharSelectV4.js')).default;

describe('CharSelectV4 quit prompt', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		CharSelect._host.innerHTML = CharSelect.render();
		CharSelect.init();
		CharSelect.onAppend();
	});

	afterEach(() => {
		CharSelect.onRemove();
		vi.useRealTimers();
	});

	it('keeps the deletion countdowns running when the player answers no', () => {
		const countdown = CharSelect._host.querySelector('.timedelete.slot0');
		countdown.classList.remove('hidden');
		countdown.dataset.duration = '100';

		CharSelect.onKeyDown({ which: KEYS.ESCAPE, stopImmediatePropagation: vi.fn() });
		mocks.prompt.onNo?.();
		vi.advanceTimersByTime(3000);

		expect(countdown.dataset.duration).toBe('97');
	});

	it('quits on yes', () => {
		CharSelect.onExitRequest = vi.fn();
		CharSelect.onKeyDown({ which: KEYS.ESCAPE, stopImmediatePropagation: vi.fn() });
		mocks.prompt.onYes();

		expect(CharSelect.onExitRequest).toHaveBeenCalledOnce();
	});
});
