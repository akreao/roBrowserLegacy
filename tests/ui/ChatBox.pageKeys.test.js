/**
 * tests/ui/ChatBox.pageKeys.test.js
 *
 * Page Up/Down scroll the chat log like the official client (Ctrl: top/bottom).
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor(name) {
			this.name = name;
			this.magnet = {};
			this._host = document.createElement('div');
			this.ui = { show: vi.fn(), hide: vi.fn(), is: vi.fn(() => true) };
		}

		getRoot() {
			return this._host;
		}

		draggable() {}

		focus() {}

		parseHTML() {}
	}
	MockGUIComponent.MouseMode = { CROSS: 'cross', DEFAULT: 'default' };

	return { MockGUIComponent };
});

vi.mock('DB/DBManager.js', () => ({
	default: {
		INTERFACE_PATH: '',
		getMessage: (id, defaultText) => (defaultText !== undefined ? defaultText : `NO MSG ${id}`)
	}
}));
vi.mock('Renderer/Renderer.js', () => ({
	default: { width: 1200, height: 800, tick: 0, render: vi.fn(), stop: vi.fn() }
}));
vi.mock('Renderer/EntityManager.js', () => ({ default: { get: vi.fn(), getOverEntity: vi.fn() } }));
vi.mock('Core/Client.js', () => ({
	default: {
		loadFile(_path, callback) {
			callback?.('');
		},
		loadFiles(_paths, callback) {
			callback?.('');
		}
	}
}));
vi.mock('Core/Events.js', () => ({ default: { setTimeout: vi.fn(), clearTimeout: vi.fn() } }));
vi.mock('Core/Preferences.js', () => ({
	default: {
		get: (_name, defaults) => ({ ...defaults, save: vi.fn() })
	}
}));
vi.mock('Core/Configs.js', () => ({ default: { get: vi.fn() } }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: { screen: { x: 0, y: 0 } } }));
vi.mock('Controls/BattleMode.js', () => ({ default: { process: vi.fn(() => false) } }));
vi.mock('Controls/ProcessCommand.js', () => ({ default: { add: vi.fn(), processCommand: vi.fn() } }));
vi.mock('UI/CursorManager.js', () => ({ default: { setType: vi.fn(), ACTION: {} } }));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: c => c, showMessageBox: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/Components/ContextMenu/ContextMenu.js', () => ({
	default: { __loaded: true, remove: vi.fn(), append: vi.fn(), addElement: vi.fn() }
}));
vi.mock('UI/Components/ChatBoxSettings/ChatBoxSettings.js', () => ({
	default: { append: vi.fn(), updateTab: vi.fn(), getTabs: () => [], tabOption: [] }
}));

// KEYS is deliberately NOT mocked: `getDeepActiveElement` is installed with
// Object.defineProperty({ writable: false }), so a mock of it would be a
// different function than the one shipping, and the shadow-piercing walk is
// exactly what this guard depends on.
const ChatBox = (await import('UI/Components/ChatBox/ChatBox.js')).default;
const KEYS = (await import('Controls/KeyEventHandler.js')).default;
const ChatBoxSettings = (await import('UI/Components/ChatBoxSettings/ChatBoxSettings.js')).default;
const Configs = (await import('Core/Configs.js')).default;
const Events = (await import('Core/Events.js')).default;

function mountChatBox() {
	const host = document.createElement('div');
	host.innerHTML = ChatBox.render();
	document.body.appendChild(host);
	ChatBox._host = host;
	ChatBox._shadow = null;
	return host;
}

function keyEvent(which, ctrlKey = false) {
	return {
		which,
		ctrlKey,
		target: document.body,
		preventDefault: vi.fn(),
		stopImmediatePropagation: vi.fn(),
		getModifierState: () => false
	};
}

describe('ChatBox - Page Up/Down', () => {
	let content;

	beforeEach(() => {
		document.body.innerHTML = '';
		const root = mountChatBox();
		// Tabs build their logs at runtime; one log in the active tab is enough here.
		content = document.createElement('div');
		content.className = 'content';
		content.dataset.content = ChatBox.activeTab;
		root.querySelector('.contentwrapper').appendChild(content);
		Object.defineProperty(content, 'clientHeight', { configurable: true, value: 100 });
		Object.defineProperty(content, 'scrollHeight', { configurable: true, value: 1000 });
		content.scrollTop = 500;
	});

	it('scrolls the chat log a page less one line', () => {
		ChatBox.onKeyDown(keyEvent(KEYS.PAGEUP));
		expect(content.scrollTop).toBe(414);
		ChatBox.onKeyDown(keyEvent(KEYS.PAGEDOWN));
		expect(content.scrollTop).toBe(500);
	});

	it('goes to the top or bottom with Ctrl', () => {
		ChatBox.onKeyDown(keyEvent(KEYS.PAGEUP, true));
		expect(content.scrollTop).toBe(0);
		ChatBox.onKeyDown(keyEvent(KEYS.PAGEDOWN, true));
		expect(content.scrollTop).toBe(1000);
	});

	it('uses the real Page Up and Page Down key codes', () => {
		expect(KEYS.PAGEUP).toBe(33);
		expect(KEYS.PAGEDOWN).toBe(34);
	});
});
