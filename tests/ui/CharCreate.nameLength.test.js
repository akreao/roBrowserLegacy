import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The official client refuses a character name shorter than 4 or longer than
 * 23 characters before sending it (msgstringtable 21 and 531). Ours sent it
 * and left the server to refuse it.
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
	return { MockGUIComponent, messages: [] };
});

vi.mock('DB/DBManager.js', () => ({
	default: { INTERFACE_PATH: '', getMessage: id => `MSG ${id}` }
}));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn(), tick: 0 } }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: class {} }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (_p, cb) => cb?.('') } }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		addComponent: c => c,
		showMessageBox: vi.fn(text => {
			mocks.messages.push(text);
		})
	}
}));
vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/ScreenHooks.js', () => ({ default: { show: vi.fn(), hide: vi.fn(), update: vi.fn() } }));
vi.mock('UI/Elements/Elements.js', () => ({}));

const CharCreate = (await import('UI/Components/CharCreate/CharCreatev4/CharCreatev4.js')).default;

function make(name) {
	const root = CharCreate._host;
	root.querySelector('#char_name').value = name;
	root.querySelector('.make').click();
	return root.querySelector('#char_name');
}

describe('CharCreate name length', () => {
	beforeEach(() => {
		mocks.messages.length = 0;
		CharCreate._host.innerHTML = CharCreate.render();
		CharCreate.init();
		CharCreate.onCharCreationRequest = vi.fn();
	});

	it('refuses a name under 4 characters', () => {
		const input = make('abc');
		expect(mocks.messages).toEqual(['MSG 21']);
		expect(CharCreate.onCharCreationRequest).not.toHaveBeenCalled();
		expect(input.value).toBe('abc');
	});

	it('refuses a name over 23 characters and clears it', () => {
		const input = make('a'.repeat(24));
		expect(mocks.messages).toEqual(['MSG 531']);
		expect(CharCreate.onCharCreationRequest).not.toHaveBeenCalled();
		expect(input.value).toBe('');
	});

	it('sends a name of 4 to 23 characters', () => {
		make('abcd');
		make('a'.repeat(23));
		expect(mocks.messages).toEqual([]);
		expect(CharCreate.onCharCreationRequest).toHaveBeenCalledTimes(2);
	});
});
