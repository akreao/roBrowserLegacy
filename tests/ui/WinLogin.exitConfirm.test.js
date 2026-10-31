import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The official login window asks "Are you sure that you want to quit?"
 * (msgstringtable 17) before quitting. Ours reloaded the game at once, from
 * the close button and from a stray Escape alike.
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
	return { MockGUIComponent, prompts: [] };
});

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: id => `MSG ${id}` } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_p, cb) => cb?.('') } }));
vi.mock('Core/Configs.js', () => ({ default: { get: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({
	default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) }
}));
vi.mock('Core/PerfProbe.js', () => ({ default: { start: () => false } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent: c => c,
		showMessageBox: vi.fn(),
		showPromptBox: vi.fn((text, yes, no, onYes, onNo) => {
			const prompt = { text, onYes, onNo, remove: vi.fn() };
			mocks.prompts.push(prompt);
			return prompt;
		})
	}
}));
vi.mock('UI/ScreenHooks.js', () => ({ default: { show: vi.fn(), hide: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

const { createWinLogin } = await import('UI/Components/WinLogin/WinLoginCommon.js');
const KEYS = (await import('Controls/KeyEventHandler.js')).default;
const htmlText = (await import('UI/Components/WinLogin/WinLoginV2/WinLoginV2.html?raw')).default;

function mount() {
	const WinLogin = createWinLogin({ name: 'WinLoginTest', htmlText, cssText: '' });
	WinLogin._host.innerHTML = WinLogin.render();
	WinLogin.init();
	WinLogin.onExitRequest = vi.fn();
	WinLogin.onConnectionRequest = vi.fn();
	return WinLogin;
}

function key(WinLogin, which) {
	const event = { which, stopImmediatePropagation: vi.fn() };
	return WinLogin.onKeyDown(event);
}

describe('WinLogin exit', () => {
	beforeEach(() => {
		mocks.prompts.length = 0;
	});

	it('asks before quitting from the close button', () => {
		const WinLogin = mount();
		WinLogin._host.querySelector('.exit').click();

		expect(mocks.prompts).toHaveLength(1);
		expect(mocks.prompts[0].text).toBe('MSG 17');
		expect(WinLogin.onExitRequest).not.toHaveBeenCalled();

		mocks.prompts[0].onYes();
		expect(WinLogin.onExitRequest).toHaveBeenCalledOnce();
	});

	it('stays on the login window when the player says no', () => {
		const WinLogin = mount();
		key(WinLogin, KEYS.ESCAPE);
		mocks.prompts[0].onNo();

		expect(WinLogin.onExitRequest).not.toHaveBeenCalled();
		key(WinLogin, KEYS.ESCAPE);
		expect(mocks.prompts).toHaveLength(2);
	});

	it('closes the prompt on a second Escape instead of stacking another', () => {
		const WinLogin = mount();
		key(WinLogin, KEYS.ESCAPE);
		key(WinLogin, KEYS.ESCAPE);

		expect(mocks.prompts).toHaveLength(1);
		expect(mocks.prompts[0].remove).toHaveBeenCalledOnce();
		expect(WinLogin.onExitRequest).not.toHaveBeenCalled();
	});

	it('does not log in when Enter is pressed behind the prompt', () => {
		const WinLogin = mount();
		key(WinLogin, KEYS.ESCAPE);
		key(WinLogin, KEYS.ENTER);

		expect(WinLogin.onConnectionRequest).not.toHaveBeenCalled();
	});
});
