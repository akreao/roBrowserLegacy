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
vi.mock('Engine/SessionStorage.js', () => ({ default: { isRenewal: true } }));
vi.mock('DB/DBManager.js', () => ({ default: { getMessage: () => '', formatMsgToHtml: text => text } }));
const { createWinStats } = await import('UI/Components/WinStats/WinStatsCommon.js');

const component = createWinStats({ name: 'WinStatsV2', htmlText, cssText: '', hasTraits: true });
component.__loaded = true;
component.init();
const root = component.getRoot();
const text = selector => root.querySelector(selector).textContent;

it('writes stat bonuses like the official window', () => {
	component.update('str2', 5);
	expect(text('.bonus .str')).toBe('+5');
	component.update('str2', -3);
	expect(text('.bonus .str')).toBe('-3');
	component.update('str2', 0);
	expect(text('.bonus .str')).toBe('');
});

it('only shows positive trait bonuses', () => {
	component.update('pow2', 2);
	expect(text('.bonus .pow')).toBe('+2');
	component.update('pow2', -2);
	expect(text('.bonus .pow')).toBe('');
});

it('keeps "a + b" for negative second values', () => {
	component.update('def2', -4);
	expect(text('.def2')).toBe('+ -4');
	component.update('matak2', 12);
	expect(text('.matak2')).toBe('+ 12');
});

it('never shows Res or MRes below 0', () => {
	component.update('res', -10);
	component.update('mres', 7);
	expect(text('.res')).toBe('0');
	expect(text('.mres')).toBe('7');
});
