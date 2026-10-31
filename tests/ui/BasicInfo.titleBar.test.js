import { beforeEach, describe, expect, it, vi } from 'vitest';

// The official Basic Info window only moves, and only reduces on a double
// click, from its 17px title bar (UIBasicInfoWnd checks y < 17).
const mocks = vi.hoisted(() => ({ pending: [], root: null }));

class MockGUIComponent {
	getRoot() {
		return mocks.root;
	}
	draggable() {}
}
vi.mock('UI/GUIComponent.js', () => ({ default: MockGUIComponent }));
vi.mock('UI/UIManager.js', () => ({ default: { addComponent: component => component } }));
vi.mock('Core/Client.js', () => ({
	default: {
		// Answers when the test says so, and in any order.
		loadFile: (filename, onload) => mocks.pending.push({ filename, answer: () => onload(filename) })
	}
}));
vi.mock('Core/Preferences.js', () => ({ default: { get: () => ({ save: vi.fn() }) } }));
vi.mock('Core/Configs.js', () => ({ default: { get: () => false } }));
vi.mock('DB/DBManager.js', () => ({ default: { INTERFACE_PATH: '' } }));
vi.mock('Network/PacketVerManager.js', () => ({ default: { value: 20221005 } }));
const stub = vi.hoisted(() => () => ({ default: {} }));
vi.mock('DB/Monsters/MonsterTable.js', stub);
vi.mock('Renderer/Renderer.js', stub);
vi.mock('Engine/SessionStorage.js', stub);
vi.mock('UI/Components/Inventory/Inventory.js', stub);
vi.mock('UI/Components/Equipment/Equipment.js', stub);
vi.mock('UI/Components/PartyFriends/PartyFriends.js', stub);
vi.mock('UI/Components/Guild/Guild.js', stub);
vi.mock('UI/Components/Bank/Bank.js', stub);
vi.mock('UI/Components/Escape/Escape.js', stub);
vi.mock('UI/Components/WorldMap/WorldMap.js', stub);
vi.mock('UI/Components/CheckAttendance/CheckAttendance.js', stub);
vi.mock('UI/Components/ChatRoomCreate/ChatRoomCreate.js', stub);
vi.mock('UI/Components/Rodex/Rodex.js', stub);
vi.mock('UI/Components/WinStats/WinStats.js', stub);
vi.mock('UI/Components/Navigation/Navigation.js', stub);
vi.mock('UI/Components/SkillList/SkillList.js', stub);
vi.mock('UI/Components/Quest/Quest.js', stub);
vi.mock('UI/Components/Achievement/Achievement.js', stub);
vi.mock('UI/Components/Reputation/Reputation.js', stub);

const { createBasicInfo } = await import('UI/Components/BasicInfo/BasicInfoCommon.js');

function make(titleBarHeight) {
	const info = createBasicInfo({
		name: 'TitleTest',
		htmlText: '',
		cssText: '',
		prefKey: 'TitleTest',
		innerId: '#x',
		topbarDblClick: true,
		titleBarHeight
	});
	info._host = { getBoundingClientRect: () => ({ top: 100, left: 0 }) };
	info.toggleMode = vi.fn();
	info.init();
	return info;
}

const at = y => ({ clientY: 100 + y });

function dblclick(target, y) {
	target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, clientY: 100 + y }));
}

describe('the Basic Information title bar', () => {
	beforeEach(() => {
		mocks.root = document.createElement('div');
		mocks.root.innerHTML = '<div id="x"><div class="topbar"><button class="right"></button></div><div class="body"></div></div>';
	});

	it('starts a drag only from the top 17px', () => {
		const info = make(17);
		expect(info.canStartDrag(at(0))).toBe(true);
		expect(info.canStartDrag(at(16))).toBe(true);
		expect(info.canStartDrag(at(17))).toBe(false);
		expect(info.canStartDrag(at(60))).toBe(false);
	});

	it('keeps a started drag going while the window moves', () => {
		const info = make(17);
		const event = at(5);
		expect(info.canStartDrag(event)).toBe(true);
		info._host = { getBoundingClientRect: () => ({ top: 0, left: 0 }) };
		expect(info.canStartDrag(event)).toBe(true);
	});

	it('reduces on a double click on the title bar, not below it or on its buttons', () => {
		const info = make(17);
		const body = mocks.root.querySelector('.body');
		dblclick(body, 40);
		expect(info.toggleMode).not.toHaveBeenCalled();
		dblclick(mocks.root.querySelector('.right'), 5);
		expect(info.toggleMode).not.toHaveBeenCalled();
		dblclick(body, 5);
		expect(info.toggleMode).toHaveBeenCalledTimes(1);
	});

	it('leaves older windows draggable from anywhere', () => {
		const info = make(0);
		expect(info.canStartDrag).toBeUndefined();
	});
});
