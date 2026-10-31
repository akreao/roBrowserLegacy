import { expect, it, vi } from 'vitest';
import htmlText from 'UI/Components/WinStats/WinStatsV2/WinStatsV2.html?raw';

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
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: () => ({ save: vi.fn() }) } }));
vi.mock('Renderer/Renderer.js', () => ({ default: {} }));
vi.mock('Engine/SessionStorage.js', () => ({ default: {} }));
vi.mock('DB/DBManager.js', () => ({ default: { getMessage: () => '', formatMsgToHtml: text => text } }));
const { createWinStats } = await import('UI/Components/WinStats/WinStatsCommon.js');

it('reduces and restores the window when the title bar is double-clicked', () => {
	const component = createWinStats({ name: 'WinStatsV2', htmlText, cssText: '', hasTraits: true });
	component.init();
	const root = component.getRoot();
	const panel = root.querySelector('.panel');
	const dblclick = target => target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
	dblclick(root.querySelector('.titlebar .text'));
	expect(panel.style.display).toBe('none');
	dblclick(root.querySelector('.titlebar'));
	expect(panel.style.display).toBe('');
	dblclick(root.querySelector('.titlebar .close'));
	expect(panel.style.display).toBe('');
	dblclick(root.querySelector('.common_stats'));
	expect(panel.style.display).toBe('');
});
