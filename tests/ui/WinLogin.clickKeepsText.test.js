import { describe, expect, it, vi } from 'vitest';

/**
 * The official client's edit boxes only take focus when clicked. Clearing on
 * mousedown threw away the saved ID whenever a player clicked into the field.
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
	}
	return { MockGUIComponent };
});

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: id => `MSG ${id}` } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_p, cb) => cb?.('') } }));
vi.mock('Core/Configs.js', () => ({ default: { get: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({
	default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) }
}));
vi.mock('Core/PerfProbe.js', () => ({ default: { start: () => false } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c, showMessageBox: vi.fn() } }));
vi.mock('UI/ScreenHooks.js', () => ({ default: { show: vi.fn(), hide: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

const { createWinLogin } = await import('UI/Components/WinLogin/WinLoginCommon.js');
const htmlText = (await import('UI/Components/WinLogin/WinLoginV2/WinLoginV2.html?raw')).default;

function mount() {
	const WinLogin = createWinLogin({ name: 'WinLoginTest', htmlText, cssText: '' });
	WinLogin._host.innerHTML = WinLogin.render();
	WinLogin.init();
	return WinLogin._host;
}

describe('WinLogin fields', () => {
	it.each(['.user', '.pass'])('keeps the text in %s when it is clicked', selector => {
		const root = mount();
		const input = root.querySelector(selector);
		input.value = 'saved';

		input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

		expect(input.value).toBe('saved');
	});
});
