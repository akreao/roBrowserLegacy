import { beforeEach, expect, it, vi } from 'vitest';
import htmlText from 'UI/Components/WinStats/WinStatsV2/WinStatsV2.html?raw';

const prefs = vi.hoisted(() => ({ save: () => {} }));
const loadFile = vi.hoisted(() => vi.fn());

vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		constructor() {
			this._host = document.createElement('div');
			this._host.innerHTML = htmlText;
			document.body.appendChild(this._host);
		}
		getRoot() {
			return this._host;
		}
		draggable() {}
		focus() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (key, def) => Object.assign(prefs, def, prefs.saved) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: {} }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: 'data/texture/', getMessage: () => '', formatMsgToHtml: text => text }
}));

async function create(saved) {
	vi.resetModules();
	document.body.innerHTML = '';
	prefs.saved = saved;
	const { createWinStats } = await import('UI/Components/WinStats/WinStatsCommon.js');
	const component = createWinStats({ name: 'WinStatsV2', htmlText, cssText: '', hasTraits: true });
	component.init();
	return component;
}

beforeEach(() => loadFile.mockClear());

it('restores the reduced window and the closed trait panel', async () => {
	const root = (await create({ reduce: true, traits: false })).getRoot();
	expect(root.querySelector('.panel').style.display).toBe('none');
	expect(root.querySelector('.traits_component').style.display).toBe('none');
	expect(loadFile).toHaveBeenLastCalledWith('data/texture/statuswnd/expand_on_normal.bmp', expect.any(Function));
});

it('opens the trait panel by default with the collapse arrow', async () => {
	const root = (await create({})).getRoot();
	expect(root.querySelector('.panel').style.display).toBe('');
	expect(root.querySelector('.traits_component').style.display).toBe('');
	expect(loadFile).toHaveBeenLastCalledWith('data/texture/statuswnd/expand_off_normal.bmp', expect.any(Function));
});

it('saves the trait panel state with the reduced state', async () => {
	const component = await create({});
	const root = component.getRoot();
	root.querySelector('.view_traits').click();
	root.querySelector('.titlebar .mini').click();
	component._host.style.left = '10px';
	component._host.style.top = '20px';
	component.onRemove();
	expect(prefs.traits).toBe(false);
	expect(prefs.reduce).toBe(true);
});
