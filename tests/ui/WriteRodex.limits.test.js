/**
 * tests/ui/WriteRodex.limits.test.js
 *
 * The compose window wants a 4-50 character title and at most 1000 of text,
 * like the official one.
 */
import { beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ chat: vi.fn() }));

vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '', getMessage: id => `MSG ${id}` } }));
vi.mock('DB/Monsters/MonsterTable.js', () => ({ default: {} }));
vi.mock('Engine/SessionStorage.js', () => ({ default: { zeny: 1000, Entity: { display: { name: 'Me' } } } }));
vi.mock('Core/Preferences.js', () => ({ default: { get: (_name, defaults) => ({ ...defaults, save: vi.fn() }) } }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: vi.fn() } }));
vi.mock('Renderer/Renderer.js', () => ({ default: { width: 1200, height: 800 } }));
vi.mock('UI/GUIComponent.js', () => ({
	default: class {
		constructor(name) {
			this.name = name;
			this._host = document.createElement('div');
		}
		draggable() {}
		focus() {}
	}
}));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c } }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: { addText: (...args) => mocks.chat(...args), TYPE: {}, FILTER: {} }
}));
vi.mock('UI/Components/ItemInfo/ItemInfo.js', () => ({ default: {} }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: {} }));
vi.mock('UI/Components/Rodex/Rodex.js', () => ({ default: {} }));
vi.mock('UI/Components/Inventory/Inventory.js', () => ({ default: {} }));

const WriteRodex = (await import('UI/Components/Rodex/WriteRodex.js')).default;

let host;
beforeEach(() => {
	document.body.innerHTML = '';
	host = document.createElement('div');
	host.innerHTML = WriteRodex.render();
	document.body.appendChild(host);
	WriteRodex._host = host;
	WriteRodex.onAppend();
	WriteRodex.initData({ receiveName: 'Friend' });
	WriteRodex.receiver = 'Friend';
	WriteRodex.requestSendRodex = vi.fn();
	WriteRodex.requestCancelWriteRodex = vi.fn();
	mocks.chat.mockClear();
});

function send(title, body = '') {
	host.querySelector('.title-text').value = title;
	host.querySelector('.content-text').value = body;
	host.querySelector('.send').click();
}

it('refuses a title under 4 or over 50 characters', () => {
	send('Hi');
	send('x'.repeat(51));
	send('\t\t\t\t');
	expect(WriteRodex.requestSendRodex).not.toHaveBeenCalled();
	expect(mocks.chat.mock.calls.map(call => call[0])).toEqual(['MSG 2596', 'MSG 2596', 'MSG 2596']);
});

it('refuses text over 1000 characters', () => {
	send('Hello', 'x'.repeat(1001));
	expect(WriteRodex.requestSendRodex).not.toHaveBeenCalled();
	expect(mocks.chat).toHaveBeenCalledWith('MSG 2628', undefined, undefined);
});

it('sends a mail inside the limits', () => {
	send('Hello', 'x'.repeat(1000));
	expect(WriteRodex.requestSendRodex).toHaveBeenCalledOnce();
});
