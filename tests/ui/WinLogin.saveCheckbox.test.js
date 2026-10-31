import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The 2025 login window (bg_login.tga) draws a 12x12 checkbox_on/off.bmp with
 * a separate "Save ID" label. The older chk_save bitmaps have the Korean
 * label baked in, which showed up next to the box on the new background.
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

		placeOnTop() {}
	}
	return { MockGUIComponent, loaded: [] };
});

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: 'ui/', getMessage: id => `MSG ${id}` } }));
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile: (path, cb) => {
			mocks.loaded.push(path);
			cb?.(path);
		}
	}
}));
vi.mock('Core/Configs.js', () => ({ default: { get: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({
	default: { get: (_name, defaults) => ({ ...defaults, saveID: false, save: vi.fn() }) }
}));
vi.mock('Core/PerfProbe.js', () => ({ default: { start: () => false } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c, showMessageBox: vi.fn() } }));
vi.mock('UI/ScreenHooks.js', () => ({ default: { show: vi.fn(), hide: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

const { createWinLogin } = await import('UI/Components/WinLogin/WinLoginCommon.js');
const v2Html = (await import('UI/Components/WinLogin/WinLoginV2/WinLoginV2.html?raw')).default;
const classicHtml = (await import('UI/Components/WinLogin/WinLogin/WinLogin.html?raw')).default;

function mount(htmlText) {
	const WinLogin = createWinLogin({ name: 'WinLoginTest', htmlText, cssText: '' });
	WinLogin._host.innerHTML = WinLogin.render();
	WinLogin.init();
	WinLogin.onAppend();
	return WinLogin._host;
}

describe('WinLogin save-ID checkbox', () => {
	beforeEach(() => {
		mocks.loaded.length = 0;
	});

	it('uses the plain checkbox art and a Save ID label on the 2025 window', () => {
		const root = mount(v2Html);
		expect(mocks.loaded.at(-1)).toBe('ui/login_interface/checkbox_off.bmp');
		expect(root.querySelector('.save-label').getAttribute('msg')).toBe('3411');

		root.querySelector('.save').dispatchEvent(new MouseEvent('mousedown'));
		expect(mocks.loaded.at(-1)).toBe('ui/login_interface/checkbox_on.bmp');
	});

	it('keeps the chk_save art on the classic window', () => {
		const root = mount(classicHtml);
		expect(mocks.loaded.at(-1)).toBe('ui/login_interface/chk_saveoff.bmp');

		root.querySelector('.save').dispatchEvent(new MouseEvent('mousedown'));
		expect(mocks.loaded.at(-1)).toBe('ui/login_interface/chk_saveon.bmp');
	});
});
