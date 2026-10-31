/**
 * tests/ui/PartyFriends.dblclick.test.js
 *
 * Double-clicking a friend or party member opens a whisper to them, as in the official client.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
	class MockGUIComponent {
		constructor() {
			this._host = document.createElement('div');
			this._host.innerHTML = '<div class="content"><div class="friend"></div></div>';
			this.ui = { show: vi.fn(), hide: vi.fn(), is: vi.fn(() => true) };
		}

		getRoot() {
			return this._host;
		}

		draggable() {}

		focus() {}

		parseHTML() {}
	}

	MockGUIComponent.MouseMode = Object.freeze({ CROSS: 0, STOP: 1, FREEZE: 2 });

	return {
		MockGUIComponent,
		chat: vi.fn(),
		messages: {},
		loadFile: vi.fn(),
		whisper: vi.fn()
	};
});

vi.mock('UI/GUIComponent.js', () => ({ default: mocks.MockGUIComponent }));
vi.mock('UI/Components/ChatBox/ChatBox.js', () => ({
	default: {
		addText: (...args) => mocks.chat(...args),
		TYPE: { BLUE: 2 },
		FILTER: { PUBLIC_LOG: 8 }
	}
}));
vi.mock('DB/DBManager.js', () => ({
	default: {
		getMessage: (id, defaultText) =>
			id in mocks.messages ? mocks.messages[id] : defaultText !== undefined ? defaultText : 'NO MSG ' + id,
		INTERFACE_PATH: 'data/texture/'
	}
}));
vi.mock('Core/Client.js', () => ({ default: { loadFile: (...args) => mocks.loadFile(...args) } }));
vi.mock('UI/UIManager.js', () => ({
	default: {
		showPromptBox: vi.fn(),
		showMessageBox: vi.fn(),
		addComponent: component => component,
		getComponent: vi.fn()
	}
}));
vi.mock('Network/NetworkManager.js', () => ({ default: { sendPacket: vi.fn(), hookPacket: vi.fn() } }));

// PartyFriends.js calls this very factory at module scope, and several of the
// module's own imports reach it - so without this the factory runs before its
// GUIComponent binding is initialised and the import dies on a TDZ error.
vi.mock('UI/Components/PartyFriends/PartyFriends.js', () => ({ default: {} }));

// The rest of the component's import graph, which reaches the renderer and the
// whole UI registry. None of it is under test here.
vi.mock('DB/Monsters/MonsterTable.js', () => ({ default: {} }));
vi.mock('Controls/KeyEventHandler.js', () => ({ default: {} }));
vi.mock('Controls/MouseEventHandler.js', () => ({ default: {} }));
vi.mock('Renderer/Camera.js', () => ({ default: {} }));
vi.mock('Renderer/Renderer.js', () => ({ default: { render: vi.fn(), stop: vi.fn() } }));
vi.mock('Renderer/SpriteRenderer.js', () => ({ default: {} }));
vi.mock('Renderer/Entity/Entity.js', () => ({ default: class {} }));
vi.mock('UI/Elements/Elements.js', () => ({}));
vi.mock('UI/Components/ContextMenu/ContextMenu.js', () => ({ default: { remove: vi.fn(), append: vi.fn() } }));
vi.mock('UI/Components/InputBox/InputBox.js', () => ({ default: { append: vi.fn(), remove: vi.fn() } }));
vi.mock('UI/Components/MiniMap/MiniMap.js', () => ({ default: { addPartyMemberMarker: vi.fn() } }));
vi.mock('UI/Components/Mail/Mail.js', () => ({ default: {} }));
vi.mock('UI/Components/Rodex/Rodex.js', () => ({ default: {} }));
vi.mock('UI/Components/WhisperBox/WhisperBox.js', () => ({ default: { show: (...args) => mocks.whisper(...args) } }));
vi.mock('UI/Components/SkillTargetSelection/SkillTargetSelection.js', () => ({ default: {} }));
vi.mock('UI/Components/PartyFriends/PartyHelper/PartyHelper.js', () => ({ default: { prepare: vi.fn() } }));
vi.mock('./PartyMemberExternal/PartyMemberExternal.js', () => ({ default: {} }));

vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20220000 } }));

const { createPartyFriends } = await import('UI/Components/PartyFriends/PartyFriendsCommon.js');

it('opens a whisper to a double-clicked friend', () => {
	const Component = createPartyFriends({ name: 'Friends', htmlText: '', cssText: '' });
	Component.init();
	Component.setFriends([{ Name: 'Seyren', GID: 150001, AID: 2000001, State: 0 }]);
	const node = Component.getRoot().querySelector('.friend .node');

	node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, which: 1 }));
	node.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

	expect(mocks.whisper).toHaveBeenCalledWith('Seyren');
});

it('does nothing while the window is locked', () => {
	mocks.whisper.mockClear();
	const Component = createPartyFriends({ name: 'FriendsLocked', htmlText: '', cssText: '' });
	Component.getRoot().insertAdjacentHTML('beforeend', '<button class="lock off"></button>');
	Component.init();
	Component.setFriends([{ Name: 'Seyren', GID: 150001, AID: 2000001, State: 0 }]);
	const root = Component.getRoot();
	root.querySelector('.lock').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
	const node = root.querySelector('.friend .node');

	node.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, which: 1 }));
	node.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));

	expect(mocks.whisper).not.toHaveBeenCalled();
});
